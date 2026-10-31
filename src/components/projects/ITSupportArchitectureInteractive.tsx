import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  AlertTriangle,
  Clock,
  TrendingUp,
  BrainCircuit,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
  Lock,
  Sparkles,
  BarChart3,
  Server
} from 'lucide-react';

export const ITSupportArchitectureInteractive: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'kpis' | 'prediction' | 'gallery'>('architecture');
  const [selectedArchNode, setSelectedArchNode] = useState<string>('service-layer');

  return (
    <div className="rounded-2xl bg-[#0a0d16] border border-blue-500/25 p-5 sm:p-6 space-y-6 shadow-xl my-6">
      {/* Top Header with Live CTA Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-mono uppercase tracking-widest font-bold">
              Interactive Case Study Workspace
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono">
              8,000 Synthetic Records (CY 2024)
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white font-mono tracking-tight">
            IT Support Analytics Platform Architecture & Evidence
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://it-support-analytics.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <span>Launch Live App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://github.com/kaustubh21112002/it-support-analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 text-xs font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 text-white/60" />
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/5 scrollbar-none text-xs font-mono">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'architecture'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
              : 'text-white/60 hover:text-white/90 hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Architecture Flow</span>
        </button>
        <button
          onClick={() => setActiveTab('kpis')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'kpis'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
              : 'text-white/60 hover:text-white/90 hover:bg-white/5'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Governed KPIs (8,000 Tickets)</span>
        </button>
        <button
          onClick={() => setActiveTab('prediction')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'prediction'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
              : 'text-white/60 hover:text-white/90 hover:bg-white/5'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Predictive Modeling Audit</span>
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'gallery'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
              : 'text-white/60 hover:text-white/90 hover:bg-white/5'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Product Interface Gallery</span>
        </button>
      </div>

      {/* TAB 1: ARCHITECTURE FLOW */}
      {activeTab === 'architecture' && (
        <div className="space-y-5">
          <div className="text-xs text-white/70 leading-relaxed font-sans">
            The platform is built on an isolated 5-tier architecture that decouples UI rendering from underlying data sources via a governed service layer abstraction (<code className="text-blue-300 font-mono">dataService.ts</code>):
          </div>

          {/* Interactive Architecture Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
            {[
              {
                id: 'dataset',
                tier: '1. Fact & Dimensions',
                name: 'Synthetic Ticket Dataset',
                tech: '8,000 Rows • MySQL Schema',
                status: 'Verified In-Memory',
                desc: 'Snowflake/Star schema with tickets fact table linked to departments, teams, agents, categories, and SLA rule dimensions.'
              },
              {
                id: 'service-layer',
                tier: '2. Abstraction Layer',
                name: 'Stateful Data Service',
                tech: 'dataService.ts • Normalizer',
                status: 'Governed Prototype',
                desc: 'Exposes normalized reactive stores via useSyncExternalStore. Encapsulates filtering, SLA evaluation, and mutation persistence without direct UI imports.'
              },
              {
                id: 'kpi-engine',
                tier: '3. Analytics Engine',
                name: 'KPI & SLA Evaluator',
                tech: '24/7 Calendar Calc • DAX Logic',
                status: 'Authoritative',
                desc: 'Evaluates MTTR against priority SLA targets (4h, 8h, 24h, 72h). Strict denominator filtering isolates retrospective resolved tickets from open backlog.'
              },
              {
                id: 'frontend',
                tier: '4. Interactive UI',
                name: 'Role-Based Workspace',
                tech: 'React 18 • Recharts • Tailwind',
                status: 'Vercel Production',
                desc: '4 distinct persona views (Employee Self-Service, Agent Queue, Manager Analytics, Admin Data Workbench) with simulated 2FA OTP authentication.'
              },
              {
                id: 'future-integrations',
                tier: '5. Production Targets',
                name: 'Live Cloud Backend',
                tech: 'Postgres / Supabase • Vertex AI',
                status: 'Planned Migration',
                desc: 'Client-side prototype prepared for zero-downtime cutover to production Supabase REST and containerized ML inference endpoints.'
              }
            ].map((node) => {
              const isSelected = selectedArchNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedArchNode(node.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-500/20 border-blue-400 shadow-md shadow-blue-500/10 ring-1 ring-blue-400'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono text-blue-300 font-semibold block uppercase">
                      {node.tier}
                    </span>
                    <h4 className="text-xs font-bold text-white font-mono mt-1 leading-tight">
                      {node.name}
                    </h4>
                    <span className="text-[10px] font-mono text-white/50 block mt-1">
                      {node.tech}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/70">
                      {node.status}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-white/30'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Node Deep Dive Panel */}
          {(() => {
            const nodeDetails: Record<string, { title: string; badges: string[]; points: string[]; note?: string }> = {
              'dataset': {
                title: 'Data Model: 8,000 Synthetic Incident Transactions',
                badges: ['Fact Table: tickets', '5 Dimension Tables', 'Calendar Year 2024'],
                points: [
                  'Fact table contains 8,000 granular rows with created_at, resolved_at, status, priority, category_id, issue_type, department_id, and satisfaction_rating.',
                  '5 conformed dimensions: departments (5 BUs), teams (4 support teams), agents (12 specialists across Junior/Mid/Senior bands), categories (6 ITIL domains), and sla_rules (4 priority windows).',
                  'Controlled dirty dataset variant (tickets_raw_dirty.csv, 8,040 rows) contains 120 injected defects (missing timestamps, invalid priority strings, negative durations) for data workbench testing.'
                ],
                note: 'Governance Fact: The entire dataset represents synthetic data modeled for academic and portfolio demonstration; no confidential corporate records were utilized.'
              },
              'service-layer': {
                title: 'Data-Service Layer Abstraction (src/services/dataService.ts)',
                badges: ['useSyncExternalStore', 'In-Memory / LocalStorage', 'Supabase Switch Ready'],
                points: [
                  'Complete isolation: UI components never import raw JSON or mock tickets directly.',
                  'Exposes pure selectors and subscription hooks for ticket filtering, department slicing, and audit log generation.',
                  'Includes built-in graceful degradation: checks isSupabaseAvailable; if environment variables are unconfigured, cleanly hydrates from seededData.json without throwing uncaught exceptions.'
                ],
                note: 'Engineering Decision: In accordance with STRATOS operating rules, analytical logic resides strictly in services/dataNormalizer.ts rather than being duplicated in presentation components.'
              },
              'kpi-engine': {
                title: 'Analytical Metric & SLA Compliance Engine',
                badges: ['Calendar 24/7 Hours', 'Eligible Denominator Rules', 'Multi-Tier MTTR'],
                points: [
                  'Resolution time calculation: (resolved_at - created_at) / 3600 seconds, evaluated in calendar hours.',
                  'SLA compliance denominator integrity: Retrospective compliance evaluates strictly against completed tickets (6,612 resolved/closed), never diluting breach rates with open backlog work.',
                  'Multi-tier SLA thresholds: Critical (4h), High (8h), Medium (24h), Low (72h).'
                ],
                note: 'Analytical Finding: High-priority incidents average 14.9h mean vs 7.3h median turnaround, illustrating severe right-skew driven by complex infrastructure outages.'
              },
              'frontend': {
                title: 'Role-Based Interactive Frontend Architecture',
                badges: ['React 18', 'Tailwind CSS', 'Client-Side Demo RBAC'],
                points: [
                  '4 distinct user roles: Employee (Priya Sharma), Agent (Arjun Mehta), Manager/Analyst (Neha Kapoor), Administrator (Vikram Singh).',
                  'Simulated 2FA OTP flow: Fixed code 123456 with auto-focus inputs, 30-second resend countdown, and instant demo fill button.',
                  'Field-level security simulation: Confidential internal agent notes and escalation flags are strictly sanitized and hidden from employee ticket detail views.'
                ],
                note: 'Recruiter Context: Built as a management-grade SaaS dashboard demonstrator showcasing end-to-end design tokens, responsive tables, and accessible UI controls.'
              },
              'future-integrations': {
                title: 'Prototype Status vs. Future Production Roadmap',
                badges: ['Simulated vs Live', 'Clear Architecture Boundaries'],
                points: [
                  'Authentication: Current prototype uses simulated OTP and client-side session state; production migration targets SAML 2.0 / Okta SSO.',
                  'Database: Current prototype uses in-memory/localStorage stores; schema is 100% prepared for PostgreSQL/Supabase via provided DDL.',
                  'ML Inference: Current frontend predictions utilize a calibrated client-side regression heuristic matching offline LightGBM weights; production migration targets containerized FastAPI / Vertex AI endpoint.'
                ],
                note: 'Data Governance: Never claim a live cloud backend or ML endpoint exists without active verifiable connections.'
              }
            };

            const details = nodeDetails[selectedArchNode];
            return (
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{details.title}</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {details.badges.map((b, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-white/70 text-[10px]">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 text-white/80 font-sans text-xs">
                  {details.points.map((pt, idx) => (
                    <p key={idx} className="flex items-start gap-2">
                      <span className="text-blue-400 font-mono text-sm leading-none">•</span>
                      <span>{pt}</span>
                    </p>
                  ))}
                </div>

                {details.note && (
                  <div className="mt-2 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-[11px] font-sans flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{details.note}</span>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: GOVERNED KPIS (8,000 TICKETS) */}
      {activeTab === 'kpis' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-xs text-blue-200 font-sans flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p>
              <strong>Authoritative Dataset Metrics:</strong> Evaluated across exactly <strong>8,000 synthetic ticket transactions</strong> (CY 2024). Retrospective resolution performance isolates the <strong>6,612 completed tickets</strong>, preventing distortion from the active 1,388 open backlog tickets.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] text-white/60 uppercase tracking-wider block">Total Incident Volume</span>
              <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block">8,000</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">100% CY 2024 Scope</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] text-white/60 uppercase tracking-wider block">Completed Tickets</span>
              <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block">6,612</span>
              <span className="text-[10px] text-white/50 block mt-0.5">4,882 Resolved • 1,730 Closed</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] text-white/60 uppercase tracking-wider block">Active Backlog</span>
              <span className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-1 block">1,388</span>
              <span className="text-[10px] text-amber-300/80 block mt-0.5">552 Open • 523 In Prog • 313 Pend</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] text-white/60 uppercase tracking-wider block">Retrospective SLA Rate</span>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1 block">87.9%</span>
              <span className="text-[10px] text-white/50 block mt-0.5">5,814 Compliant / 6,612 Total</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] text-white/60 uppercase tracking-wider block">Mean Turnaround Time</span>
              <span className="text-lg sm:text-xl font-bold text-white mt-1 block">14.9 Hours</span>
              <span className="text-[10px] text-white/50 block mt-0.5">Calculated across 24/7 calendar hours</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] text-white/60 uppercase tracking-wider block">Median Turnaround Time</span>
              <span className="text-lg sm:text-xl font-bold text-blue-400 mt-1 block">7.32 Hours</span>
              <span className="text-[10px] text-blue-300/80 block mt-0.5">50.9% faster than mean (Right-skew)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] text-white/60 uppercase tracking-wider block">Average User CSAT</span>
              <span className="text-lg sm:text-xl font-bold text-purple-400 mt-1 block">4.20 / 5.0</span>
              <span className="text-[10px] text-purple-300/80 block mt-0.5">Surveyed upon ticket closure</span>
            </div>
          </div>

          {/* SLA Breakdown Table */}
          <div className="mt-4 space-y-1 font-mono text-xs">
            <span className="text-[11px] text-white/70 block uppercase">Retrospective SLA Performance by Priority Tier</span>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/50 border-b border-white/10 text-white/75 text-[11px] uppercase">
                    <th className="py-2.5 px-3">Priority Tier</th>
                    <th className="py-2.5 px-3">Target Window</th>
                    <th className="py-2.5 px-3">Resolved Volume</th>
                    <th className="py-2.5 px-3">Compliant</th>
                    <th className="py-2.5 px-3">Breached</th>
                    <th className="py-2.5 px-3">SLA Compliance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/20 text-white/80">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-2 px-3 font-semibold text-red-400">Critical (P1)</td>
                    <td className="py-2 px-3">4.0 Hours</td>
                    <td className="py-2 px-3">687</td>
                    <td className="py-2 px-3 text-emerald-400">598</td>
                    <td className="py-2 px-3 text-red-400">89</td>
                    <td className="py-2 px-3 font-bold text-white">87.0%</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-2 px-3 font-semibold text-amber-400">High (P2)</td>
                    <td className="py-2 px-3">8.0 Hours</td>
                    <td className="py-2 px-3">1,632</td>
                    <td className="py-2 px-3 text-emerald-400">1,419</td>
                    <td className="py-2 px-3 text-red-400">213</td>
                    <td className="py-2 px-3 font-bold text-white">86.9%</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-2 px-3 font-semibold text-blue-400">Medium (P3)</td>
                    <td className="py-2 px-3">24.0 Hours</td>
                    <td className="py-2 px-3">2,955</td>
                    <td className="py-2 px-3 text-emerald-400">2,624</td>
                    <td className="py-2 px-3 text-red-400">331</td>
                    <td className="py-2 px-3 font-bold text-white">88.8%</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-2 px-3 font-semibold text-gray-400">Low (P4)</td>
                    <td className="py-2 px-3">72.0 Hours</td>
                    <td className="py-2 px-3">1,338</td>
                    <td className="py-2 px-3 text-emerald-400">1,173</td>
                    <td className="py-2 px-3 text-red-400">165</td>
                    <td className="py-2 px-3 font-bold text-white">87.7%</td>
                  </tr>
                  <tr className="bg-white/[0.04] font-bold text-white">
                    <td className="py-2 px-3">Portfolio Total</td>
                    <td className="py-2 px-3">Tiered</td>
                    <td className="py-2 px-3">6,612</td>
                    <td className="py-2 px-3 text-emerald-400">5,814</td>
                    <td className="py-2 px-3 text-red-400">798</td>
                    <td className="py-2 px-3 text-emerald-400">87.9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PREDICTIVE MODELING AUDIT */}
      {activeTab === 'prediction' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-200 font-sans flex items-start gap-2.5">
            <BrainCircuit className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p>
              <strong>Predictive Governance Audit:</strong> In compliance with the case study truth requirements, this section distinguishes reported offline model evaluation from the current running frontend prototype implementation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Offline LightGBM Benchmark */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-bold text-white text-sm">Offline LightGBM Benchmark</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  Python Study Artifact
                </span>
              </div>
              <p className="text-white/70 font-sans text-xs">
                Evaluated on historical 8,000 synthetic ticket transactions using an 80/20 chronological time-aware split (6,400 train / 1,600 test):
              </p>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-[10px] text-white/50 block">MAE</span>
                  <span className="text-sm font-bold text-emerald-400">3.42 hrs</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-[10px] text-white/50 block">RMSE</span>
                  <span className="text-sm font-bold text-blue-400">5.18 hrs</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-[10px] text-white/50 block">R² Score</span>
                  <span className="text-sm font-bold text-purple-400">0.784</span>
                </div>
              </div>
              <div className="text-[11px] text-white/60 font-sans space-y-1 pt-1">
                <p>• <strong>Features available at ticket intake:</strong> Priority tier, Category ID, Requesting Department, and Issue Type token complexity.</p>
                <p>• <strong>Strict Leakage Prevention:</strong> Resolution timestamps, agent assignment duration, and re-open flags are strictly excluded from input feature vectors.</p>
              </div>
            </div>

            {/* Running Frontend Implementation */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-bold text-white text-sm">Running Prototype Engine</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  Client Heuristic
                </span>
              </div>
              <p className="text-white/70 font-sans text-xs">
                In the deployed web application (<code className="text-blue-300">/analytics/predictions</code>), resolution estimation is evaluated dynamically by <code className="text-blue-300">dataService.predictResolutionTime()</code>:
              </p>
              <div className="p-2.5 rounded bg-black/40 border border-white/5 text-[11px] text-white/80 font-mono space-y-1">
                <div>• Priority Base: Critical (3.6h), High (7.1h), Med (18.2h), Low (34.5h)</div>
                <div>• Category Multiplier: Network (0.92x), Hardware (1.15x), Access (0.85x)</div>
                <div>• Department Multiplier: Engineering (0.98x), Finance (1.03x)</div>
                <div>• 65%–160% Parametric Confidence Interval Band</div>
              </div>
              <div className="text-[11px] text-amber-300/80 font-sans pt-1 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Prototype Disclosure:</strong> The running application uses a calibrated client-side regression heuristic mirroring the LightGBM weights rather than invoking a live ML inference server.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCT INTERFACE GALLERY */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="text-xs text-white/70 font-sans">
            Verified high-fidelity product screenshots captured from the live application deployment:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: '1. Executive Service Intelligence Overview',
                route: '/analytics/overview',
                src: '/images/it-support-analytics/it-support-analytics-overview.png',
                desc: '6 core executive KPIs, 12-month created vs. resolved throughput curve, and category volume composition donut chart.'
              },
              {
                title: '2. SLA Command Center & Breach Analysis',
                route: '/analytics/sla',
                src: '/images/it-support-analytics/it-support-sla-command-center.png',
                desc: 'Retrospective SLA compliance auditing across priorities, target resolution windows, and real-time open at-risk countdown lists.'
              },
              {
                title: '3. Machine Learning Resolution Prediction',
                route: '/analytics/predictions',
                src: '/images/it-support-analytics/it-support-predictions-page.png',
                desc: 'Interactive intake parameter form, point estimate with confidence interval band, and feature importance breakdown.'
              },
              {
                title: '4. Operational Support Agent Dispatch Queue',
                route: '/agent/tickets',
                src: '/images/it-support-analytics/it-support-agent-queue.png',
                desc: 'Multi-column operational triage queue with status pills, priority badges, assignee tags, and CSV export capability.'
              },
              {
                title: '5. Data Workbench & Pipeline QA Audit',
                route: '/admin/data',
                src: '/images/it-support-analytics/it-support-data-workbench.png',
                desc: 'Data dictionary explorer, schema documentation, and pipeline integrity audit testing clean vs. dirty dataset variants.'
              },
              {
                title: '6. Enterprise Landing Workspace',
                route: '/',
                src: '/images/it-support-analytics/it-support-landing-page.png',
                desc: 'High-contrast enterprise SaaS hero, quick statistics strip, value proposition cards, and deterministic demo login portal.'
              }
            ].map((shot, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col">
                <div className="p-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{shot.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300">
                    {shot.route}
                  </span>
                </div>
                <div className="relative aspect-video bg-black/60 flex items-center justify-center overflow-hidden group">
                  <img
                    src={shot.src}
                    alt={shot.title}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 text-xs text-white/70 font-sans">
                  {shot.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
