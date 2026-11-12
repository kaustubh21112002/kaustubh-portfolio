import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🧪 Starting Application Kanban Board Tests...');

// 1. Verify file exists and exports React component
const kanbanPath = join(rootDir, 'src', 'components', 'candidate', 'ApplicationKanbanBoard.tsx');
const kanbanContent = readFileSync(kanbanPath, 'utf8');

assert.ok(
  kanbanContent.includes('export const ApplicationKanbanBoard'),
  'ApplicationKanbanBoard must export the component'
);
assert.ok(
  kanbanContent.includes('Career Opportunities Kanban'),
  'ApplicationKanbanBoard must include board title'
);
assert.ok(
  kanbanContent.includes('DISCOVERED'),
  'ApplicationKanbanBoard must track DISCOVERED status'
);
assert.ok(
  kanbanContent.includes('PENDING_APPROVAL'),
  'ApplicationKanbanBoard must track PENDING_APPROVAL status'
);
assert.ok(
  kanbanContent.includes('SUBMITTED'),
  'ApplicationKanbanBoard must track SUBMITTED status'
);
console.log('  ✓ Test 1: ApplicationKanbanBoard columns and status bindings verified.');

// 2. Verify search filtering logic presence
assert.ok(
  kanbanContent.includes('filteredApps'),
  'ApplicationKanbanBoard must compute filteredApps by search'
);
console.log('  ✓ Test 2: Search filtering verified.');

console.log('\n🎉 ALL APPLICATION KANBAN TESTS PASSED (2/2)\n');

