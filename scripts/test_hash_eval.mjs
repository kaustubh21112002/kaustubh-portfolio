import crypto from 'node:crypto';
import fs from 'node:fs';

const storedHash = 'scrypt$efd6f9dd72ba415fa5970ef45b8f53c7$2ff2ac99a48a2e416a5bf2f9d0f71c76f0d09e3d1f0326b6e783d9aafdcc2610';

function verify(candidate, hash) {
  const parts = hash.split('$');
  console.log('Parts length:', parts.length, parts[0]);
  if (parts.length !== 3) return false;
  const salt = Buffer.from(parts[1], 'hex');
  const expected = Buffer.from(parts[2], 'hex');
  const derived = crypto.scryptSync(candidate, salt, expected.length, {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 32 * 1024 * 1024
  });
  return crypto.timingSafeEqual(derived, expected);
}

console.log('Verify kaust@8080:', verify('kaust@8080', storedHash));

