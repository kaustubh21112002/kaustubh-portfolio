import React, { useState } from 'react';
import {
  BarChart3,
  Database,
  Code2,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { skillGroups, SkillGroup } from '../../data/skills';

const getGroupIcon = (iconName: SkillGroup['iconName']) => {
  switch (iconName) {
    case 'TrendingUp':
      return <TrendingUp className="w-5 h-5 text-red-400" />;
    case 'BarChart3':
      return <BarChart3 className="w-5 h-5 text-emerald-400" />;
    case 'Database':
      return <Database className="w-5 h-5 text-blue-400" />;
    case 'Code2':
      return <Code2 className="w-5 h-5 text-amber-400" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-5 h-5 text-purple-400" />;
    case 'Cpu':
    default:
      return <Cpu className="w-5 h-5 text-cyan-400" />;
  }
};

export const SkillsSection: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const filteredGroups =
    selectedGroup === 'all'
      ? skillGroups
      : skillGroups.filter((g) => g.id === selectedGroup);

  return (
    <section id="skills" className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#0e1017] text-white border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Section Label */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-mono uppercase tracking-widest mb-3">
            <span className="text-red-400 font-bold">(05)</span>
            <span>Skills & Verified Competencies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Analytical Toolkit & Applied Evidence
          </h2>
          <p className="text-white/75 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Every listed competency is grounded in verified coursework, internship deliverables, financial workbooks, or database implementations. No arbitrary percentage bars—only real technical applications.
          </p>

          {/* Domain Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            <button
              onClick={() => setSelectedGroup('all')}
              aria-pressed={selectedGroup === 'all'}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                selectedGroup === 'all'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              All Domains ({skillGroups.length})
            </button>
            {skillGroups.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroup(g.id)}
                aria-pressed={selectedGroup === g.id}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                  selectedGroup === g.id
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {g.title.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className={`p-6 sm:p-7 rounded-3xl bg-[#141722] border transition-all duration-300 shadow-xl ${group.accent}`}
            >
              {/* Group Header */}
              <div className="flex items-start gap-3.5 mb-5 pb-4 border-b border-white/10">
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                  {getGroupIcon(group.iconName)}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {group.title}
                  </h3>
                  <p className="text-xs text-white/75 font-sans mt-0.5">
                    {group.subtitle}
                  </p>
                </div>
              </div>

              {/* Skill Items */}
              <div className="space-y-3.5">
                {group.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-bold text-white text-sm font-sans">
                        {skill.name}
                      </span>
                      <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                        {skill.evidence}
                      </span>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed font-sans">
                      {skill.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
