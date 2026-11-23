import { projects } from '../src/data/projects.ts';

console.log('TOTAL CANONICAL PROJECTS:', projects.length);
for (const p of projects) {
  console.log(`\n======================================================`);
  console.log(`ID: ${p.id}`);
  console.log(`Title: ${p.title}`);
  console.log(`Category: ${p.category} | Status: ${p.status}`);
  console.log(`Evidence URL: ${p.evidenceUrl || 'none'}`);
  console.log(`Key Metrics:`);
  for (const m of p.keyMetrics) {
    console.log(`  * ${m.label} = ${m.value} [${m.classification || 'NONE'}] (${m.subtext || ''})`);
  }
  console.log(`Problem: ${p.problemStatement.slice(0, 120)}...`);
  console.log(`Key Finding: ${p.keyFinding.slice(0, 120)}...`);
  console.log(`Business Implication: ${p.businessImplication.slice(0, 120)}...`);
}

