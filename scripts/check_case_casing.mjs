import fs from 'fs';
import path from 'path';

function checkCasing(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!full.includes('node_modules') && !full.includes('.git') && !full.includes('dist')) {
        checkCasing(full);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.matchAll(/from\s+['"](.*?)['"]/g);
      for (const m of matches) {
        const imp = m[1];
        if (imp.startsWith('.')) {
          // Check exact disk casing on Windows
          const targetDir = path.resolve(dir, path.dirname(imp));
          const targetBase = path.basename(imp);
          if (fs.existsSync(targetDir)) {
            const actualDiskFiles = fs.readdirSync(targetDir);
            const rawTargetWithoutExt = targetBase.replace(/\.(js|ts|tsx)$/, '');
            const matchingFile = actualDiskFiles.find(f => {
              const withoutExt = f.replace(/\.(js|ts|tsx)$/, '');
              return withoutExt.toLowerCase() === rawTargetWithoutExt.toLowerCase();
            });

            if (matchingFile) {
              const actualWithoutExt = matchingFile.replace(/\.(js|ts|tsx)$/, '');
              if (actualWithoutExt !== rawTargetWithoutExt) {
                console.log(`CASE MISMATCH in ${full}: imported "${rawTargetWithoutExt}" but disk file is "${actualWithoutExt}"`);
              }
            } else if (!actualDiskFiles.includes(rawTargetWithoutExt)) {
              // Might be folder or index
              const subFolder = path.join(targetDir, rawTargetWithoutExt);
              if (!fs.existsSync(subFolder)) {
                console.log(`MISSING IMPORT in ${full}: ${imp}`);
              }
            }
          } else {
            console.log(`MISSING DIR in ${full}: ${targetDir}`);
          }
        }
      }
    }
  }
}

console.log('--- STARTING CASE-SENSITIVITY & IMPORT INTEGRITY AUDIT ---');
checkCasing('src');
checkCasing('api');
checkCasing('server');
console.log('--- AUDIT COMPLETE ---');

