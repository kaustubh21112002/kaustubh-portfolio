import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Plus,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import type { ApplicationWorkflowStatus } from '../../data/approvalGateService';

export interface KanbanApplicationCard {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationWorkflowStatus;
  fitScore: number;
  updatedAt: string;
  packageHash?: string;
  notes?: string;
}

const DEFAULT_APPLICATIONS: KanbanApplicationCard[] = [
  {
    id: 'app_1',
    companyName: 'Retail Analytics Corp',
    jobTitle: 'Senior Business Analyst',
    status: 'DISCOVERED',
    fitScore: 84,
    updatedAt: '2026-11-10T12:00:00Z',
    notes: 'Strong overlap with STRATOS data governance and KPI tree design.'
  },
  {
    id: 'app_2',
    companyName: 'Capital Partners',
    jobTitle: 'Financial Analyst - Corporate Finance',
    status: 'PREPARING',
    fitScore: 92,
    updatedAt: '2026-11-11T14:30:00Z',
    notes: 'DCF sensitivity and terminal value scheduling match PhonePe flagship deliverable.'
  },
  {
    id: 'app_3',
    companyName: 'Logistics OS',
    jobTitle: 'Operations Data Analyst',
    status: 'PENDING_APPROVAL',
    fitScore: 78,
    updatedAt: '2026-11-12T09:15:00Z',
    packageHash: 'pkg_sha256_e4b1a8f9',
    notes: 'Tailored resume bullets awaiting candidate sign-off.'
  },
  {
    id: 'app_4',
    companyName: 'FinTech Platform',
    jobTitle: 'Decision Intelligence Lead',
    status: 'APPROVED',
    fitScore: 95,
    updatedAt: '2026-11-12T11:00:00Z',
    packageHash: 'pkg_sha256_3c8d197a',
    notes: 'Approved by candidate principal. Single-use execution token issued.'
  },
  {
    id: 'app_5',
    companyName: 'Enterprise SaaS',
    jobTitle: 'Analytics Engineer',
    status: 'SUBMITTED',
    fitScore: 88,
    updatedAt: '2026-11-09T16:45:00Z',
    packageHash: 'pkg_sha256_71a0b52d',
    notes: 'Application dispatched via candidate token confirmation.'
  }
];

const COLUMNS: Array<{ status: ApplicationWorkflowStatus; label: string; accentColor: string }> = [
  { status: 'DISCOVERED', label: 'Discovered', accentColor: 'border-white/20 text-white/70' },
  { status: 'PREPARING', label: 'Preparing', accentColor: 'border-amber-500/40 text-amber-300' },
  { status: 'PENDING_APPROVAL', label: 'Pending Approval', accentColor: 'border-purple-500/40 text-purple-300' },
  { status: 'APPROVED', label: 'Approved', accentColor: 'border-blue-500/40 text-blue-300' },
  { status: 'SUBMITTED', label: 'Submitted', accentColor: 'border-emerald-500/40 text-emerald-300' }
];

interface ApplicationKanbanBoardProps {
  onSelectApplication?: (app: KanbanApplicationCard) => void;
}

export const ApplicationKanbanBoard: React.FC<ApplicationKanbanBoardProps> = ({
  onSelectApplication
}) => {
  const [applications, setApplications] = useState<KanbanApplicationCard[]>(DEFAULT_APPLICATIONS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = applications.filter(
    (app) =>
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAppsForColumn = (status: ApplicationWorkflowStatus) =>
    filteredApps.filter((app) => app.status === status);

  return (
    <div className="w-full bg-[#0b0d14] border border-white/10 rounded-2xl p-5 space-y-4 font-sans text-white">
      {/* Board Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-red-500" />
              <span>Career Opportunities Kanban</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/10 text-white/70">
              {applications.length} Total Tracks
            </span>
          </div>
          <p className="text-xs text-white/50 mt-0.5">
            Governed candidate workflow from automated discovery to deterministic approval.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter companies or roles..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/40 focus:border-red-400 focus-visible:outline-none font-sans"
          />
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto pb-2">
        {COLUMNS.map((col) => {
          const colApps = getAppsForColumn(col.status);
          return (
            <div
              key={col.status}
              className="bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col min-w-[200px] space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className={`text-[11px] font-mono font-bold uppercase ${col.accentColor}`}>
                  {col.label}
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-white/60">
                  {colApps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-2 flex-1 min-h-[150px]">
                {colApps.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-4 border border-dashed border-white/5 rounded-lg text-[11px] font-mono text-white/30 text-center">
                    No applications
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => onSelectApplication?.(app)}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all cursor-pointer group space-y-2 select-none"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-semibold text-white/90 group-hover:text-red-300 transition-colors leading-snug">
                          {app.jobTitle}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white/80 shrink-0">
                          {app.fitScore}%
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-white/60 font-sans">
                        <Building2 className="w-3 h-3 text-white/40 shrink-0" />
                        <span className="truncate">{app.companyName}</span>
                      </div>

                      {app.packageHash && (
                        <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                          <span>Digest:</span>
                          <span className="text-purple-300 font-semibold">{app.packageHash.slice(0, 14)}...</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

