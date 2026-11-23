import fs from 'fs';
import path from 'path';

function findExplicitTsImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!full.includes('node_modules') && !full.includes('.git') && !full.includes('dist')) {
        findExplicitTsImports(full);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.matchAll(/from\s+['"](.*?)['"]/g);
      for (const m of matches) {
        const imp = m[1];
        if (imp.endsWith('.ts') || imp.endsWith('.tsx')) {
          console.log(`EXPLICIT TS EXTENSION: ${full} -> "${imp}"`);
        }
      }
    }
  }
}

console.log('--- SCANNING FOR EXPLICIT .ts / .tsx EXTENSION IMPORTS ---');
findExplicitTsImports('src');
console.log('--- SCAN COMPLETE ---');

