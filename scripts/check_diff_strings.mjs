import fs from 'fs';
import { projects } from '../src/data/projects.ts';

const jsonRaw = fs.readFileSync('src/data/projects.json', 'utf8');
const jsonProjects = JSON.parse(jsonRaw);

const p = projects[0];
const jp = jsonProjects[0];
console.log('TS problem:\n', JSON.stringify(p.problemStatement));
console.log('JSON problem:\n', JSON.stringify(jp.problem));

