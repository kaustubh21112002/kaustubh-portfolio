import React from 'react';

export interface ERPSyncRecord {
  id: number;
  enterprise_id: string;
  enterprise_name: string;
  erp_system: string;
  sync_status: 'RECONCILED_SYNCED' | 'DELTA_SYNCING' | 'RECONCILIATION_REQUIRED' | 'SYNC_STALLED';
  unreconciled_tx_count: number;
  ledger_count: number;
  reconciled_volume_inr: number;
  gst_status: 'GSTR1_MATCHED' | 'GSTR3B_FILED' | 'E_WAY_BILL_ALERT' | 'MISMATCH_DETECTED';
  udyam_number: string;
  sync_latency_ms: number;
  last_sync_at: string;
}

interface ERPReconciliationTableProps {
  records: ERPSyncRecord[];
}

export const ERPReconciliationTable: React.FC<ERPReconciliationTableProps> = ({ records }) => {
  const getSyncBadge = (status: ERPSyncRecord['sync_status']) => {
    switch (status) {
      case 'RECONCILED_SYNCED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'DELTA_SYNCING':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'RECONCILIATION_REQUIRED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  const getGstBadge = (status: ERPSyncRecord['gst_status']) => {
    switch (status) {
      case 'GSTR1_MATCHED':
      case 'GSTR3B_FILED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'E_WAY_BILL_ALERT':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <h3 className="text-base font-semibold text-slate-100 tracking-wide font-mono uppercase">
              Tally & MSME Accounting Ledger Reconciliation Queue
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time XML/ODBC sync verification across Tally Prime, Vyapar, and Zoho Books enterprise deployments.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider">
              <th className="py-2.5 px-3">Enterprise Client</th>
              <th className="py-2.5 px-3">Accounting Software</th>
              <th className="py-2.5 px-3">Sync Status</th>
              <th className="py-2.5 px-3 text-center">Unreconciled TX</th>
              <th className="py-2.5 px-3 text-center">Active Ledgers</th>
              <th className="py-2.5 px-3">Reconciled Gross Volume</th>
              <th className="py-2.5 px-3 text-right">Statutory GST Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {records.map(record => (
              <tr key={record.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-100 font-sans">{record.enterprise_name}</div>
                  <div className="text-[10px] text-slate-500">{record.udyam_number}</div>
                </td>
                <td className="py-3 px-3 text-slate-300 font-sans">
                  {record.erp_system}
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getSyncBadge(record.sync_status)}`}>
                    {record.sync_status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`font-semibold ${record.unreconciled_tx_count > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {record.unreconciled_tx_count}
                  </span>
                </td>
                <td className="py-3 px-3 text-center text-slate-300">
                  {record.ledger_count} Ledgers
                </td>
                <td className="py-3 px-3 text-teal-300 font-semibold">
                  ₹{(record.reconciled_volume_inr / 10000000).toFixed(2)} Cr
                </td>
                <td className="py-3 px-3 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getGstBadge(record.gst_status)}`}>
                    {record.gst_status.replace(/_/g, ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

