import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Filter, Info, ChevronRight, Layers, Database } from 'lucide-react';

export interface DQRule {
  id: string;
  field: string;
  category: 'Completeness' | 'Contextual Missingness' | 'Attribution' | 'Referential Integrity' | 'Financial Integrity';
  findings: string;
  affectedVolume: string;
  percentage?: string;
  status: 'Validated' | 'REVIEW';
  protocol: string;
  description: string;
}

export const stratosDQRules: DQRule[] = [
  {
    id: 'DQ-01',
    field: 'customers.email',
    category: 'Completeness',
    findings: '613 missing email addresses',
    affectedVolume: '613 values',
    percentage: '8.17%',
    status: 'Validated',
    protocol: 'Investigate • Preserve missing values without silent imputation',
    description: 'Email contact field missing in customer dimension. Preserved as blank to avoid fabricating synthetic communications.'
  },
  {
    id: 'DQ-02',
    field: 'customers.phone',
    category: 'Completeness',
    findings: '442 missing phone numbers',
    affectedVolume: '442 values',
    percentage: '5.89%',
    status: 'Validated',
    protocol: 'Investigate • Preserve missing values without silent imputation',
    description: 'Phone contact attribute absent in customer table. Maintained as null to maintain audit veracity.'
  },
  {
    id: 'DQ-03',
    field: 'customers.loyalty_tier',
    category: 'Contextual Missingness',
    findings: '2,748 missing tier values (Structural Nulls)',
    affectedVolume: '2,748 values',
    percentage: '36.64%',
    status: 'Validated',
    protocol: 'Structural Nulls • Validated (Member: 4,752 / Non-Member: 2,748)',
    description: 'Absence of tier denotes non-membership rather than missing data. Classified structurally as Non-Member.'
  },
  {
    id: 'DQ-04',
    field: 'customer_rep_bridge.relationship_end_date',
    category: 'Contextual Missingness',
    findings: '2,810 missing end dates (Active Relationships)',
    affectedVolume: '2,810 records',
    percentage: '74.95%',
    status: 'Validated',
    protocol: 'Contextual • Validated (Open relationships retain no end date)',
    description: 'Null end date signifies an active customer-rep association. Valid contextual behavior in temporal bridge tables.'
  },
  {
    id: 'DQ-05',
    field: 'orders.sales_rep_id',
    category: 'Attribution',
    findings: '39,785 digital self-service orders without rep',
    affectedVolume: '39,785 orders',
    percentage: '79.57%',
    status: 'Validated',
    protocol: 'NA-Digital • Validated (Digital: 33,232, Recorded: 10,215, Missing-Physical: 6,553)',
    description: 'Unassigned rep field stems from digital e-commerce checkouts where no physical sales representative was involved.'
  },
  {
    id: 'DQ-06',
    field: 'orders.promo_code',
    category: 'Attribution',
    findings: '38,879 unprompted retail orders',
    affectedVolume: '38,879 orders',
    percentage: '77.76%',
    status: 'Validated',
    protocol: 'Contextual • Validated (Preserve promo_code; create promo_classification)',
    description: 'Orders completed at full price without promotional incentives. Legitimate operational transaction pattern.'
  },
  {
    id: 'DQ-07',
    field: 'orders.campaign_id',
    category: 'Attribution',
    findings: '20,044 unmapped marketing campaigns',
    affectedVolume: '20,044 orders',
    percentage: '40.09%',
    status: 'Validated',
    protocol: 'Unspecified • Validated (Recorded: 29,956 / Unspecified: 20,044; "Unspecified ≠ none")',
    description: 'Direct organic traffic lacking marketing tracking attribution. Formally labeled as "Unspecified" without zero-fill.'
  },
  {
    id: 'DQ-08',
    field: 'orders.delivery_days',
    category: 'Contextual Missingness',
    findings: '6,603 unavailable delivery tracking logs',
    affectedVolume: '6,603 orders',
    percentage: '13.21%',
    status: 'Validated',
    protocol: 'Contextual • Validated (Recorded: 26,629, In-Store Zero-Day: 16,768, Unavailable: 6,603)',
    description: 'Reconciled across delivery channels: 26,629 recorded logistics, 16,768 in-store instant pickups, 6,603 unavailable.'
  },
  {
    id: 'DQ-09',
    field: 'orders.customer_id',
    category: 'Referential Integrity',
    findings: '1,524 orphan customer references',
    affectedVolume: '1,524 orders',
    percentage: '3.05%',
    status: 'Validated',
    protocol: 'Referential Integrity • Validated (Preserve transaction, flag linkage unresolved)',
    description: 'Orders mapped to customer keys absent in dimension table. Preserved in transaction ledger with unresolved linkage flag.'
  },
  {
    id: 'DQ-10',
    field: 'orders.financial_measures',
    category: 'Financial Integrity',
    findings: '15,630 exception occurrences across 14,156 unique orders',
    affectedVolume: '14,156 unique orders (15,630 occurrences)',
    percentage: '28.31%',
    status: 'REVIEW',
    protocol: 'Financial Consistency • STRICTLY REVIEW (Net Revenue > Gross Revenue)',
    description: 'Active source ledger anomaly where Net Revenue exceeds Gross Revenue in controlled totals. Strictly preserved in REVIEW without mathematical force-balancing.'
  }
];

export const StratosDQMatrix: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'Validated' | 'REVIEW'>('ALL');
  const [selectedRuleId, setSelectedRuleId] = useState<string>('DQ-10');

  const filteredRules = selectedFilter === 'ALL'
    ? stratosDQRules
    : stratosDQRules.filter((r) => r.status === selectedFilter);

  const activeRule = stratosDQRules.find((r) => r.id === selectedRuleId) || stratosDQRules[9];

  return (
    <div className="rounded-3xl bg-[#12141c] border border-white/10 p-5 sm:p-7 space-y-6">
      {/* Header & Governance Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h4 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-wide">
              STRATOS 10-Control Data Quality Register
            </h4>
          </div>
          <p className="text-xs text-white/60 font-sans mt-0.5">
            Governed Operational Protocol: <span className="font-mono text-white/90">PRESERVE → DOCUMENT → FLAG → GOVERN</span>
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/40 border border-white/10 self-start sm:self-auto">
          {(['ALL', 'Validated', 'REVIEW'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedFilter(status)}
              aria-pressed={selectedFilter === status}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                selectedFilter === status
                  ? status === 'REVIEW'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'bg-white text-black font-bold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {status === 'ALL' ? 'All 10 Controls' : status === 'Validated' ? '9 Validated' : '1 Under Review'}
            </button>
          ))}
        </div>
      </div>

      {/* Governed High-Level KPI Summary (Reconciled from 02_DQ_Register) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
          <span className="text-xs font-mono text-white/60 block">Analysis Corpus</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-white mt-1 block">50,000</span>
          <span className="text-[10px] text-white/50 font-sans block mt-0.5">Retail Orders</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
          <span className="text-xs font-mono text-white/60 block">Rule Occurrences</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-white mt-1 block">15,630</span>
          <span className="text-[10px] text-white/50 font-sans block mt-0.5">8,073 Rev + 7,557 Profit</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
          <span className="text-xs font-mono text-white/60 block">Unique Affected</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-white mt-1 block">14,156</span>
          <span className="text-[10px] text-white/50 font-sans block mt-0.5">1,474 Overlap Discrepancy</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
          <span className="text-xs font-mono text-amber-300 font-semibold block">DQ-10 Financial</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-amber-400 mt-1 block">REVIEW</span>
          <span className="text-[10px] text-amber-300/80 font-sans block mt-0.5">Net Rev &gt; Gross Rev</span>
        </div>
      </div>

      {/* Interactive Matrix Grid & Inspector View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Interactive Controls List */}
        <div className="lg:col-span-7 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-white/50 mb-2 px-1">
            Select a validation control to inspect governance findings:
          </div>
          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            {filteredRules.map((rule) => {
              const isSelected = rule.id === selectedRuleId;
              const isReview = rule.status === 'REVIEW';

              return (
                <button
                  key={rule.id}
                  onClick={() => setSelectedRuleId(rule.id)}
                  aria-pressed={isSelected}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                    isSelected
                      ? isReview
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg'
                        : 'bg-white/15 border-white/40 text-white shadow-lg'
                      : isReview
                        ? 'bg-amber-500/5 border-amber-500/20 text-white/80 hover:bg-amber-500/10'
                        : 'bg-black/30 border-white/5 text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold shrink-0 ${
                      isReview
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                        : 'bg-white/10 text-white/90 border border-white/10'
                    }`}>
                      {rule.id}
                    </span>
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-medium text-white block truncate">
                        {rule.field}
                      </span>
                      <span className="text-[11px] text-white/50 font-sans block truncate">
                        {rule.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                      isReview
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {rule.status}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-white' : 'text-white/40'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Rule Detail Inspector */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#161a28] border border-white/15 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider block">
                Control Specification Detail
              </span>
              <h5 className="text-base font-bold text-white font-mono mt-0.5">
                {activeRule.id} • {activeRule.field}
              </h5>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
              activeRule.status === 'REVIEW'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {activeRule.status}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] font-mono uppercase text-white/50 block">Audit Finding & Exception Metric:</span>
              <span className="font-mono text-white text-xs font-semibold block mt-0.5 bg-black/40 p-2.5 rounded-xl border border-white/10">
                {activeRule.findings}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-white/50 block">Operational Governance Protocol:</span>
              <p className="text-white/80 font-sans mt-0.5 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/10">
                {activeRule.protocol}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-white/50 block">Architectural Context:</span>
              <p className="text-white/70 font-sans mt-0.5 leading-relaxed">
                {activeRule.description}
              </p>
            </div>

            {activeRule.id === 'DQ-10' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 font-sans leading-relaxed">
                <strong>Data Governance Rule:</strong> DQ-10 remains in REVIEW status. Net Revenue &gt; Gross Revenue represents an active ERP ledger promotional clawback discrepancy. The system forbids silent mathematical imputation.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

