import fs from 'fs';
const f = fs.readFileSync('dist/assets/index-BYCjreRd.js', 'utf8');
const regex = /\bQe\b/g;
let match;
while ((match = regex.exec(f)) !== null) {
  const start = Math.max(0, match.index - 50);
  const end = Math.min(f.length, match.index + 50);
  console.log('USAGE OF Qe:', f.slice(start, end));
}

