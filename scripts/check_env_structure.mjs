import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
if (!fs.existsSync(envPath)) {
  console.log('ENV_FILE_NOT_FOUND');
  process.exit(0);
}

const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) {
    const key = trimmed.slice(0, eqIdx);
    const val = trimmed.slice(eqIdx + 1);
    console.log(`Key: ${key} | Length: ${val.length} | HasQuotes: ${val.startsWith('"') || val.startsWith("'")} | Prefix: ${val.slice(0, 8)}...`);
  }
}

