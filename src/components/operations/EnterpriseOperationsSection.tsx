import React, { useState } from 'react';
import { SLACommandCenter } from './SLACommandCenter';
import { CRMPipelineCenter } from './crm/CRMPipelineCenter';
import { RenderFleetCenter } from './render/RenderFleetCenter';
import { SMEDigitalTransformationCenter } from './sme/SMEDigitalTransformationCenter';
import { FinancialStatementCenter } from './finance/FinancialStatementCenter';
import { ERPIntegrationCenter } from './erp/ERPIntegrationCenter';
import { CandidateIntelligenceCenter } from './candidate/CandidateIntelligenceCenter';
import { ReliabilityChaosCenter } from './reliability/ReliabilityChaosCenter';
import { ExecutiveOutreachCenter } from './outreach/ExecutiveOutreachCenter';
import { TelemetryPostMortemCenter } from './telemetry/TelemetryPostMortemCenter';
import { B2BCampaignOrchestratorCenter } from './campaigns/B2BCampaignOrchestratorCenter';
import { ComplianceAuditCenter } from './compliance/ComplianceAuditCenter';
import { AgenticWorkflowCenter } from './agents/AgenticWorkflowCenter';
import { SystemWatchdogCenter } from './watchdog/SystemWatchdogCenter';
import { CloudFinOpsCenter } from './finops/CloudFinOpsCenter';

export const EnterpriseOperationsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sla' | 'crm' | 'render' | 'sme' | 'finance' | 'erp' | 'candidate' | 'reliability' | 'outreach' | 'telemetry' | 'campaigns' | 'compliance' | 'agents' | 'watchdog' | 'finops'>('sla');

  return (
    <section id="operations-command-center" className="py-16 border-t border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-[#07080c] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-mono font-semibold tracking-wider uppercase text-cyan-400">
                Enterprise Operations Command OS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              Distributed Telemetry & Production Workspaces
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Live interactive interfaces backed by serverless edge functions, PostgreSQL auto-initializing schemas, and resilient client fallbacks.
            </p>
          </div>

          {/* Module Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200 dark:bg-slate-900/90 rounded-xl border border-slate-300 dark:border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('sla')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'sla'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              01 • SLA Command
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'crm'
                ? 'bg-violet-500 text-white shadow-md shadow-violet-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              02 • CRM Pipeline
            </button>
            <button
              onClick={() => setActiveTab('render')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'render'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              03 • Render Fleet
            </button>
            <button
              onClick={() => setActiveTab('sme')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'sme'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              04 • SME Analytics
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'finance'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              05 • Financial OS
            </button>
            <button
              onClick={() => setActiveTab('erp')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'erp'
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              06 • ERP Hub
            </button>
            <button
              onClick={() => setActiveTab('candidate')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'candidate'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              07 • Candidate AI
            </button>
            <button
              onClick={() => setActiveTab('reliability')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'reliability'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              08 • Chaos Mesh
            </button>
            <button
              onClick={() => setActiveTab('outreach')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'outreach'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              09 • Executive Reports
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'telemetry'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              10 • Telemetry & RCA
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'campaigns'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              11 • OutreachPulse
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'compliance'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              12 • Statutory Audit
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'agents'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              13 • Agent Mesh
            </button>
            <button
              onClick={() => setActiveTab('watchdog')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'watchdog'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              14 • SentinelWatch
            </button>
            <button
              onClick={() => setActiveTab('finops')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === 'finops'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              15 • CloudFinOps
            </button>
          </div>
        </div>

        {/* Tab Viewport */}
        <div className="transition-all duration-300">
          {activeTab === 'sla' && <SLACommandCenter />}
          {activeTab === 'crm' && <CRMPipelineCenter />}
          {activeTab === 'render' && <RenderFleetCenter />}
          {activeTab === 'sme' && <SMEDigitalTransformationCenter />}
          {activeTab === 'finance' && <FinancialStatementCenter />}
          {activeTab === 'erp' && <ERPIntegrationCenter />}
          {activeTab === 'candidate' && <CandidateIntelligenceCenter />}
          {activeTab === 'reliability' && <ReliabilityChaosCenter />}
          {activeTab === 'outreach' && <ExecutiveOutreachCenter />}
          {activeTab === 'telemetry' && <TelemetryPostMortemCenter />}
          {activeTab === 'campaigns' && <B2BCampaignOrchestratorCenter />}
          {activeTab === 'compliance' && <ComplianceAuditCenter />}
          {activeTab === 'agents' && <AgenticWorkflowCenter />}
          {activeTab === 'watchdog' && <SystemWatchdogCenter />}
          {activeTab === 'finops' && <CloudFinOpsCenter />}
        </div>
      </div>
    </section>
  );
};
