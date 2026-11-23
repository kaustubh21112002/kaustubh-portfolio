import fs from 'fs';
const indexJs = fs.readFileSync('dist/assets/index-BYCjreRd.js', 'utf8');
const lines = indexJs.split(';');
for (const line of lines) {
  if (line.includes('import') && (line.includes('module-flagship') || line.includes('module-case-studies'))) {
    console.log('STATIC IMPORT FOUND:', line);
  }
}

