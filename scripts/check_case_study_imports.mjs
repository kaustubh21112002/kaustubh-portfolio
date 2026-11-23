import fs from 'fs';
const f = fs.readFileSync('dist/assets/index-BYCjreRd.js', 'utf8');
const symbols = ['A', '_', 'D', 'qe', '_e', '$e', 'Ge'];
for (const s of symbols) {
  const regex = new RegExp(`\\b${s}\\b`, 'g');
  let match;
  let count = 0;
  while ((match = regex.exec(f)) !== null) {
    count++;
  }
  console.log(`Symbol ${s} appears ${count} times in index.js`);
}

