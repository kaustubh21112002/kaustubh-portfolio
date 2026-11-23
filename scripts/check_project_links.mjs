import fs from 'fs';
import { projects } from '../src/data/projects.ts';

for (const p of projects) {
  console.log(`\n=== ${p.id} ===`);
  console.log('Title:', p.title);
  console.log('Links:', p.verifiedLinks);
  console.log('EvidenceUrl:', p.evidenceUrl);
  console.log('EvidenceLabel:', p.evidenceLabel);
}

