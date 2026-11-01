import fs from 'fs';
import path from 'path';
import { validateProjectsData, getLatestProjectUpdateDate } from '../src/data/projectSchema.ts';

const jsonPath = path.resolve(process.cwd(), 'src/data/projects.json');
console.log('Validating projects.json at:', jsonPath);

try {
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const data = validateProjectsData(raw);
  console.log(`PASS: Validated ${data.length} projects successfully.`);
  data.forEach(p => {
    console.log(`- [${p.status}] ${p.id}: ${p.title} (Updated: ${p.lastUpdated})`);
  });
  console.log('Latest Update Date:', getLatestProjectUpdateDate(data));
} catch (err) {
  console.error('FAIL: projects.json validation failed:', err);
  process.exit(1);
}

