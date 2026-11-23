import fs from 'fs';

const filesToClean = [
  'src/components/candidate/ApplicationKanbanBoard.tsx',
  'src/components/candidate/ApplicationPackageModal.tsx',
  'src/components/candidate/InterviewIntelligenceModal.tsx',
  'src/data/approvalGateService.ts',
  'src/data/candidateJobFitScorer.ts',
  'src/data/documentTailoringAssistant.ts',
  'src/data/interviewIntelligenceEngine.ts',
  'src/data/jobMatchEngine.ts',
  'src/lib/resumeIngestionService.ts'
];

for (const f of filesToClean) {
  let content = fs.readFileSync(f, 'utf8');
  const updated = content.replace(/(from\s+['"][^'"]*?)\.ts(['"])/g, '$1$2');
  if (updated !== content) {
    fs.writeFileSync(f, updated, 'utf8');
    console.log(`Cleaned explicit .ts imports from: ${f}`);
  }
}
console.log('Finished import cleaning.');

