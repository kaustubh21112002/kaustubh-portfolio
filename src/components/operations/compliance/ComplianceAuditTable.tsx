import React from 'react';
import type { RegulatoryComplianceRecord } from '../../../../api/operations/regulatoryCompliance';

interface ComplianceAuditTableProps {
  records: RegulatoryComplianceRecord[];
}

export const ComplianceAuditTable: React.FC<ComplianceAuditTableProps> = ({ records }) => {
  const getFilingBadge = (status: RegulatoryComplianceRecord['tax_filing_status']) => {
    switch (status) {
      case 'GSTR_MATCHED_2B':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            GSTR-2B Matched
          </span>
        );
      case 'GSTR_FILED_ON_TIME':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Filed On-Time
          </span>
        );
      case 'RECONCILIATION_PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Reconciliation Pending
          </span>
        );
      case 'STATUTORY_DEFICIT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            Statutory Deficit
          </span>
        );
    }
  };

  const getTierBadge = (tier: string) => {
    if (tier.includes('EXEMPLARY')) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Tier 1 Exemplary
        </span>
      );
    }
    if (tier.includes('MODERATE')) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          Tier 2 Moderate
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
        Tier 3 Elevated
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-mono">
            <th className="py-3 px-4 font-semibold">Enterprise & ID</th>
            <th className="py-3 px-4 font-semibold">GSTIN & Udyam ID</th>
            <th className="py-3 px-4 font-semibold">Tax Filing Status</th>
            <th className="py-3 px-4 font-semibold text-right">Audit Risk Score</th>
            <th className="py-3 px-4 font-semibold text-right">Penalty Exposure (₹)</th>
            <th className="py-3 px-4 font-semibold">Compliance Tier</th>
            <th className="py-3 px-4 font-semibold text-right">Audit Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-sans">
          {records.map((rec) => (
            <tr key={rec.compliance_id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {rec.enterprise_name}
                </div>
                <div className="text-[11px] font-mono text-emerald-500 dark:text-emerald-400">
                  {rec.compliance_id}
                </div>
              </td>
              <td className="py-3.5 px-4 font-mono">
                <div className="text-slate-800 dark:text-slate-200 text-xs font-semibold">
                  {rec.gstin}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {rec.udyam_number}
                </div>
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                {getFilingBadge(rec.tax_filing_status)}
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  {Number(rec.audit_risk_score).toFixed(1)}%
                </div>
                <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full ml-auto mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      rec.audit_risk_score < 10
                        ? 'bg-emerald-500'
                        : rec.audit_risk_score < 30
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, rec.audit_risk_score)}%` }}
                  />
                </div>
              </td>
              <td className="py-3.5 px-4 text-right font-mono font-semibold text-rose-600 dark:text-rose-400">
                ₹{Number(rec.penalty_exposure_inr).toLocaleString()}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                {getTierBadge(rec.compliance_tier)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-slate-500 dark:text-slate-400">
                {new Date(rec.last_audit_date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

