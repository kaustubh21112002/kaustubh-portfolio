import fs from 'fs';
const f = fs.readFileSync('dist/assets/module-flagship-valuation-Dvs61-zK.js', 'utf8');
console.log('EXPORTED SYMBOLS:', f.slice(f.lastIndexOf('export')));

