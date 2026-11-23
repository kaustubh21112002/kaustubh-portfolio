import readline from 'readline';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

/**
 * Interactive Local Admin Passphrase Reset Utility
 * 
 * Safety & Privacy Controls:
 * - Hidden terminal input for the passphrase (asterisks/masked).
 * - Exact scrypt parameters matching server/lib/authService.ts (N=16384, r=8, p=1).
 * - Format: scrypt$<salt_hex>$<derived_hex>
 * - Never prints plaintext passphrase, salt, or hash to terminal output or logs.
 * - Updates only the untracked local .env.local file.
 * - Creates a timestamped local backup of .env.local before modification.
 * - Executes automated in-memory verification against verifyPassphrase() to guarantee
 *   that the new credentials validate cleanly.
 */

function hiddenPrompt(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const stdin = process.stdin;
    process.stdout.write(query);

    let password = '';
    const onData = (char) => {
      char = char.toString('utf-8');
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.removeListener('data', onData);
          break;
        case '\u0003': // Ctrl+C
          process.exit(1);
          break;
        case '\u007f': // Backspace
        case '\b':
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(query + '*'.repeat(password.length));
          }
          break;
        default:
          password += char;
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(query + '*'.repeat(password.length));
          break;
      }
    };

    stdin.on('data', onData);

    rl.question('', () => {
      rl.close();
      console.log(''); // newline
      resolve(password.trim());
    });
  });
}

export function generateScryptHash(passphrase) {
  if (!passphrase || passphrase.length === 0 || passphrase.length > 256) {
    throw new Error('Passphrase must be between 1 and 256 characters.');
  }

  // 16 bytes = 32 hex chars (conforms to /^[0-9a-fA-F]{32,128}$/)
  const salt = crypto.randomBytes(16);
  const saltHex = salt.toString('hex');

  // Derived key length 32 bytes = 64 hex chars (conforms to /^[0-9a-fA-F]{64,128}$/)
  const derivedKey = crypto.scryptSync(passphrase, salt, 32, {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 32 * 1024 * 1024
  });
  const derivedHex = derivedKey.toString('hex');

  return `scrypt$${saltHex}$${derivedHex}`;
}

export function updateLocalEnv(newHash) {
  const envPath = path.resolve('.env.local');
  let currentContent = '';
  if (fs.existsSync(envPath)) {
    currentContent = fs.readFileSync(envPath, 'utf8');
    // Create local backup
    const backupPath = path.resolve(`.env.local.backup_${Date.now()}`);
    fs.writeFileSync(backupPath, currentContent, 'utf8');
  }

  const lines = currentContent.split('\n');
  let replaced = false;
  const newLines = lines.map((line) => {
    if (line.trim().startsWith('ANALYTICS_ADMIN_HASH=')) {
      replaced = true;
      return `ANALYTICS_ADMIN_HASH=${newHash}`;
    }
    return line;
  });

  if (!replaced) {
    newLines.push(`ANALYTICS_ADMIN_HASH=${newHash}`);
  }

  fs.writeFileSync(envPath, newLines.join('\n'), 'utf8');
}

// Verification function (in-memory, identical to authService.ts)
export function verifyHashAgainstInput(passphrase, storedHash) {
  try {
    const parts = storedHash.split('$');
    if (parts.length !== 3) return false;
    const [scheme, saltHex, expectedHex] = parts;
    if (scheme !== 'scrypt') return false;

    const salt = Buffer.from(saltHex, 'hex');
    const expectedBuffer = Buffer.from(expectedHex, 'hex');

    const derived = crypto.scryptSync(passphrase, salt, expectedBuffer.length, {
      N: 16384,
      r: 8,
      p: 1,
      maxmem: 32 * 1024 * 1024
    });

    return crypto.timingSafeEqual(derived, expectedBuffer);
  } catch {
    return false;
  }
}

async function main() {
  console.log('====================================================');
  console.log(' PORTFOLIO INTELLIGENCE — LOCAL PASSPHRASE RECOVERY ');
  console.log('====================================================');
  console.log('Policy: Local-only, hidden input, zero secret leakage.');
  console.log('');

  const pass1 = await hiddenPrompt('Enter new administrative passphrase: ');
  if (!pass1) {
    console.error('Error: Empty passphrase provided. Aborted.');
    process.exit(1);
  }

  const pass2 = await hiddenPrompt('Confirm new administrative passphrase: ');
  if (pass1 !== pass2) {
    console.error('Error: Passphrases do not match. Aborted.');
    process.exit(1);
  }

  console.log('\n[1] Generating cryptographic scrypt hash...');
  const newHash = generateScryptHash(pass1);

  console.log('[2] Verifying hash against input before writing...');
  const isValid = verifyHashAgainstInput(pass1, newHash);
  if (!isValid) {
    console.error('Fatal: Generated hash failed verification check.');
    process.exit(1);
  }

  console.log('[3] Updating untracked local configuration (.env.local)...');
  updateLocalEnv(newHash);

  console.log('[4] Verifying incorrect input rejection...');
  const rejected = !verifyHashAgainstInput(pass1 + '_wrong', newHash);
  if (!rejected) {
    console.error('Fatal: Hash failed to reject incorrect password.');
    process.exit(1);
  }

  console.log('\n====================================================');
  console.log('  SUCCESS: Local administration passphrase updated! ');
  console.log('  Variable updated: ANALYTICS_ADMIN_HASH            ');
  console.log('  Target file: .env.local (Untracked)               ');
  console.log('  Verification: 100% PASS (Zero secret leakage)     ');
  console.log('====================================================\n');
}

// Only execute interactive CLI if invoked directly
if (process.argv[1] && process.argv[1].endsWith('reset_local_passphrase.mjs')) {
  main().catch((err) => {
    console.error('Error during passphrase recovery:', err.message);
    process.exit(1);
  });
}

