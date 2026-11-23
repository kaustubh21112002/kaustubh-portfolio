import fs from 'fs';
const f = fs.readFileSync('dist/assets/module-case-studies-BMb25zsg.js', 'utf8');
console.log('EXPORTED SYMBOLS:', f.slice(f.lastIndexOf('export')));

