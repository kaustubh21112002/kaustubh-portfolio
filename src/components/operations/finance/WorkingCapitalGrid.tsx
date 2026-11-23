import React from 'react';

export interface FinancialRecord {
  id: number;
  enterprise_id: string;
  enterprise_name: string;
  sector: string;
  cash_runway_months: number;
  working_capital_ratio: number;
  quick_ratio: number;
  dscr: number;
  monthly_burn_rate_inr: number;
  operating_cash_flow_inr: number;
  liquidity_risk_status: 'LIQUIDITY_OPTIMAL' | 'MONITOR_RUNWAY' | 'CAPITAL_STRESS';
  last_audit_at: string;
}

interface WorkingCapitalGridProps {
  records: FinancialRecord[];
}

export const WorkingCapitalGrid: React.FC<WorkingCapitalGridProps> = ({ records }) => {
  const getRiskBadge = (status: FinancialRecord['liquidity_risk_status']) => {
    switch (status) {
      case 'LIQUIDITY_OPTIMAL':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MONITOR_RUNWAY':
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
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <h3 className="text-base font-semibold text-slate-100 tracking-wide font-mono uppercase">
              Working Capital Health & Solvency Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical liquidity coverage, quick ratios, and debt service coverage (DSCR) monitoring.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {records.map(record => (
          <div
            key={record.id}
            className="p-4 rounded-lg border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500">
                  {record.enterprise_id}
                </span>
                <h4 className="text-sm font-semibold text-slate-100 mt-0.5 truncate" title={record.enterprise_name}>
                  {record.enterprise_name}
                </h4>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${getRiskBadge(record.liquidity_risk_status)}`}>
                {record.liquidity_risk_status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="mt-2 text-xs text-slate-400 font-sans">
              {record.sector}
            </div>

            {/* Cash Runway Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Cash Runway</span>
                <span className={`font-semibold ${
                  record.cash_runway_months < 10
                    ? 'text-rose-400'
                    : record.cash_runway_months < 15
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {record.cash_runway_months} Months
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    record.cash_runway_months < 10
                      ? 'bg-rose-500'
                      : record.cash_runway_months < 15
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, (record.cash_runway_months / 30) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Solvency Ratio Grid */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Working Cap</span>
                <span className="text-slate-200 font-semibold">{record.working_capital_ratio}x</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Quick Ratio</span>
                <span className="text-blue-300 font-semibold">{record.quick_ratio}x</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">DSCR</span>
                <span className="text-emerald-400 font-semibold">{record.dscr}x</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

