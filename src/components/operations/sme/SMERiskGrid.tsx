import React from 'react';

export interface SMERecord {
  id: number;
  enterprise_id: string;
  enterprise_name: string;
  sector: string;
  digital_maturity_score: number;
  equipment_failure_probability: number;
  predictive_savings_inr: number;
  downtime_hours_prevented: number;
  compliance_status: 'GOVERNED_COMPLIANT' | 'MONITORING_REQUIRED' | 'REVIEW_PENDING';
  last_assessment_at: string;
}

interface SMERiskGridProps {
  enterprises: SMERecord[];
}

export const SMERiskGrid: React.FC<SMERiskGridProps> = ({ enterprises }) => {
  const getComplianceBadge = (status: SMERecord['compliance_status']) => {
    switch (status) {
      case 'GOVERNED_COMPLIANT':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MONITORING_REQUIRED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <h3 className="text-base font-semibold text-slate-100 tracking-wide font-mono uppercase">
              Predictive Equipment Risk & MSME Maturity Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical failure probability modeling, downtime prevention hours, and governed compliance telemetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enterprises.map(enterprise => (
          <div
            key={enterprise.id}
            className="p-4 rounded-lg border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500">
                  {enterprise.enterprise_id}
                </span>
                <h4 className="text-sm font-semibold text-slate-100 mt-0.5 truncate" title={enterprise.enterprise_name}>
                  {enterprise.enterprise_name}
                </h4>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${getComplianceBadge(enterprise.compliance_status)}`}>
                {enterprise.compliance_status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="mt-2 text-xs text-slate-400 font-sans">
              {enterprise.sector}
            </div>

            {/* Digital Maturity Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Digital Maturity</span>
                <span className="font-semibold text-emerald-400">{enterprise.digital_maturity_score}/100</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${enterprise.digital_maturity_score}%` }}
                ></div>
              </div>
            </div>

            {/* Empirical Risk & Cost Savings Grid */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Failure Risk</span>
                <span className={`font-semibold ${
                  enterprise.equipment_failure_probability >= 0.10
                    ? 'text-rose-400'
                    : enterprise.equipment_failure_probability >= 0.05
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {(enterprise.equipment_failure_probability * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Saved Downtime</span>
                <span className="text-slate-200 font-semibold">{enterprise.downtime_hours_prevented} hrs</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">INR Value</span>
                <span className="text-emerald-400 font-semibold">
                  ₹{(enterprise.predictive_savings_inr / 100000).toFixed(1)}L
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
