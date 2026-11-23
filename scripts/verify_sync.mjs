import fs from 'fs';
import { projects } from '../src/data/projects.ts';

const jsonRaw = fs.readFileSync('src/data/projects.json', 'utf8');
const jsonProjects = JSON.parse(jsonRaw);

console.log('Comparing projects.ts vs projects.json:');
for (const p of projects) {
  const jp = jsonProjects.find(j => j.id === p.id);
  if (!jp) {
    console.error('MISSING IN JSON:', p.id);
  } else {
    console.log(`- ${p.id}:`);
    console.log(`  problem equal: ${p.problemStatement === jp.problem}`);
    console.log(`  approach equal: ${p.approach === jp.method}`);
    console.log(`  finding equal: ${p.keyFinding === jp.result}`);
  }
}

