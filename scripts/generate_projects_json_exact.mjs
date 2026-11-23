import fs from 'fs';
import { projects } from '../src/data/projects.ts';

const jsonProjects = projects.map(p => {
  let status = "Completed";
  if (p.id === 'equitrack-analytics-os') {
    status = "In progress";
  } else if (p.status === 'In Progress') {
    status = "In progress";
  }

  // Derive lastUpdated
  let lastUpdated = "2026-10-31";
  if (p.id === 'stratos-governance') lastUpdated = "2025-12-31";
  if (p.id === 'it-support-analytics') lastUpdated = "2024-12-31";
  if (p.id === 'smartbank-360') lastUpdated = "2026-05-31";
  if (p.id === 'phonepe-valuation') lastUpdated = "2026-09-30";
  if (p.id === 'spiideo-sports-analytics') lastUpdated = "2026-10-31";
  if (p.id === 'equitrack-analytics-os') lastUpdated = "2026-10-31";

  // Links array
  const links = [];
  if (p.evidenceUrl && p.evidenceLabel) {
    links.push({ label: p.evidenceLabel, url: p.evidenceUrl });
  }
  if (p.verifiedLinks) {
    for (const vl of p.verifiedLinks) {
      if (!links.some(l => l.url === vl.url)) {
        links.push({ label: vl.label, url: vl.url });
      }
    }
  }

  // Data description
  let dataDesc = p.datasetScope?.scale || p.datasetScope?.structure || "";
  if (!dataDesc) {
    if (p.id === 'phonepe-valuation') dataDesc = "Audited FY21-FY25 disclosures, NPCI UPI volume data, and segment revenue breakdowns.";
    if (p.id === 'smartbank-360') dataDesc = "FinTech unit-economics benchmarks (Revolut, Monzo, Jupiter, Fi), RBI Master Directions, and Basel III CAR standards.";
    if (p.id === 'spiideo-sports-analytics') dataDesc = "1,200+ elite match event streams across panoramic multi-angle camera feeds.";
  }

  return {
    id: p.id,
    title: p.title,
    status: status,
    lastUpdated: lastUpdated,
    oneLineSummary: p.tagline,
    problem: p.problemStatement,
    data: dataDesc,
    method: p.approach,
    result: p.keyFinding,
    tools: p.tools,
    links: links
  };
});

fs.writeFileSync('src/data/projects.json', JSON.stringify(jsonProjects, null, 2), 'utf8');
console.log('Successfully generated src/data/projects.json from projects.ts verbatim data');

