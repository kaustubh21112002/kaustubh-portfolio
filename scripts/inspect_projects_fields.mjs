import fs from 'fs';
import { projects } from '../src/data/projects.ts';

for (const p of projects) {
  console.log('ID:', p.id);
  console.log('Title:', p.title);
  console.log('Date:', p.date);
  console.log('Status:', p.status);
  console.log('Problem:', p.problemStatement?.slice(0, 50));
  console.log('Approach:', p.approach?.slice(0, 50));
  console.log('KeyFinding:', p.keyFinding?.slice(0, 50));
  console.log('Implication:', p.businessImplication?.slice(0, 50));
  console.log('Tools:', p.tools);
  console.log('Evidence:', p.evidenceUrl);
  console.log('-------------------------');
}

