import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldAlert,
  BarChart3,
  Layers,
  ArrowRight,
  Sliders,
  DollarSign,
  PieChart,
  HelpCircle,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Percent,
  ChevronRight,
  Scale
} from 'lucide-react';

export const FlagshipPhonePe: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'assumptions' | 'model' | 'scenarios' | 'bridge' | 'sensitivity' | 'peer' | 'audit'
  >('overview');
  const [scenario, setScenario] = useState<'bear' | 'base' | 'bull'>('base');

  // Interactive sensitivity matrix parameters
  const [waccOffset, setWaccOffset] = useState<number>(0);
  const [multipleOffset, setMultipleOffset] = useState<number>(0);

  const baseWacc = 14.92;
  const baseMultiple = 13.15;
  const currentWacc = baseWacc + waccOffset;
  const currentMultiple = baseMultiple + multipleOffset;

  // Dynamic EV calculation approximation for illustrative exploration
  const calculatedEV = Math.round(
    33432 * (1 - (waccOffset / 100) * 8.5) * (1 + (multipleOffset / baseMultiple) * 0.45)
  );
  // Net cash adjustment: +₹1,127.58 Cr cash + ₹7,787.65 Cr investments - ₹716.00 Cr debt = +₹8,199.23 Cr
  const calculatedEquityValue = calculatedEV + 1128 + 7788 - 716;
  const calculatedSharePrice = (calculatedEquityValue / 50.66).toFixed(2);

  const tabs: { id: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: '1. Overview & Architecture', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'assumptions', label: '2. Historical & Forecast Assumptions', icon: <Percent className="w-3.5 h-3.5" /> },
    { id: 'model', label: '3. Forecast Cash Flows (FY26E–FY30E)', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'scenarios', label: '4. Bear / Base / Bull Scenarios', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'bridge', label: '5. EV-to-Equity Bridge', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'sensitivity', label: '6. Sensitivity Heatmap', icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 'peer', label: '7. Paytm Peer Benchmarking', icon: <PieChart className="w-3.5 h-3.5" /> },
    { id: 'audit', label: '8. Workbook Audit & Discrepancy Log', icon: <FileSearch className="w-3.5 h-3.5" /> },
  ];

  return (
    <section id="flagship" className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#0b0d13] text-white border-t border-white/10">
      {/* Background ambient accents */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-widest mb-3.5">
            <span className="font-bold text-red-400">(02)</span>
            <span>Flagship Valuation • Pre-IPO Equity Research</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            PhonePe Pre-IPO Equity Valuation & DCF Model
          </h2>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#141722] border border-white/10 mt-4 max-w-4xl shadow-2xl">
            <div className="text-xs font-mono uppercase text-red-400 font-bold tracking-wider mb-2">
              Organizing Valuation Thesis & Core Dilemma
            </div>
            <p className="text-lg sm:text-xl font-medium text-white italic leading-relaxed">
              “Can PhonePe convert its ~48.5% UPI ecosystem dominance into sustainable monetization, operating profitability, and free cash flow generation ahead of its proposed IPO?”
            </p>
            <div className="text-white/75 text-xs sm:text-sm mt-4 pt-4 border-t border-white/10 leading-relaxed font-sans space-y-2">
              <p>
                <strong>The Zero-MDR Structural Dilemma:</strong> In India, consumer UPI payments operate under a government-mandated zero Merchant Discount Rate (0% MDR). Processing billions of peer-to-peer and consumer-to-merchant payment volume cannot directly generate transaction fee revenue.
              </p>
              <p>
                <strong>Monetization Architecture:</strong> PhonePe’s economic engine bridges this gap by cross-selling high-margin merchant hardware subscriptions (SmartSpeaker audio soundboxes), digital credit origination (NBFC partnerships), micro-insurance distribution, and new wealth platforms.
              </p>
              <p>
                <strong>Reconciled Valuation Output:</strong> The 5-year explicit forecast (FY26E–FY30E) discounted at WACC 14.92% yields an Operating Enterprise Value of <strong>₹33,431.99 Cr</strong>. Adding non-operating liquid balances (+₹8,915.23 Cr) and deducting long-term borrowings (-₹716.00 Cr) establishes an Implied Common Equity Value of <strong>₹41,631.22 Cr</strong>, or <strong>₹821.78 per share</strong> across 50.66 Cr shares.
              </p>
            </div>
          </div>
        </div>

        {/* High-Level Financial Metrics Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#141722] border border-white/10 hover:border-white/20 transition-all">
            <div className="text-[11px] font-mono uppercase text-white/50 tracking-wider">Implied Enterprise Value (EV)</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 font-mono">₹33,432 Cr</div>
            <div className="text-xs text-emerald-400 mt-1 font-mono">Verified Model Output</div>
            <div className="text-[10px] text-white/65 mt-1 font-mono">PV FCF ₹13,878 Cr + PV TV ₹19,554 Cr</div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#141722] border border-white/10 hover:border-white/20 transition-all">
            <div className="text-[11px] font-mono uppercase text-white/50 tracking-wider">Implied Equity Value</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 font-mono">₹41,631 Cr</div>
            <div className="text-xs text-emerald-400 mt-1 font-mono">+₹8,199 Cr Net Liquidity</div>
            <div className="text-[10px] text-white/65 mt-1 font-mono">Cash + Investments - Debt</div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#141722] border border-white/10 hover:border-white/20 transition-all">
            <div className="text-[11px] font-mono uppercase text-white/50 tracking-wider">Implied Price Per Share</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 font-mono">₹821.78</div>
            <div className="text-xs text-emerald-400 mt-1 font-mono">50.66 Cr Common Shares</div>
            <div className="text-[10px] text-white/65 mt-1 font-mono">Reconciled after Audit Finding 1</div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#141722] border border-white/10 hover:border-white/20 transition-all">
            <div className="text-[11px] font-mono uppercase text-white/50 tracking-wider">WACC Benchmark</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 font-mono">14.92%</div>
            <div className="text-xs text-amber-300 mt-1 font-mono">CAPM Derived Cost of Capital</div>
            <div className="text-[10px] text-white/65 mt-1 font-mono">Rf: 3.0% | Beta: 1.35 | Rm: 11.82%</div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/10 scrollbar-thin">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/25 border border-red-500'
                  : 'bg-[#141722] text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ================================================================= */}
        {/* TAB 1: EXECUTIVE THESIS & MONETIZATION ARCHITECTURE */}
        {/* ================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-[#141722] border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-3">Business Model & Monetization Architecture</h3>
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                    PhonePe processes ~48.5% of total UPI transaction volumes across India. However, consumer UPI operates under mandated zero Merchant Discount Rate (zero MDR), meaning payments processing alone does not generate positive gross margins.
                  </p>
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base mt-3">
                    To build cash generation, PhonePe’s revenue model relies on four core pillars:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                      <div className="text-xs font-mono uppercase text-red-400 font-bold mb-1">Merchant Payments (42%)</div>
                      <p className="text-xs text-white/70 leading-relaxed">Monetized through recurring SmartSpeaker audio hardware subscriptions and point-of-sale merchant processing fees.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                      <div className="text-xs font-mono uppercase text-amber-400 font-bold mb-1">Financial Distribution (28%)</div>
                      <p className="text-xs text-white/70 leading-relaxed">High-margin loan origination partnerships with NBFCs and insurance brokerage commissions.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                      <div className="text-xs font-mono uppercase text-emerald-400 font-bold mb-1">Consumer Payments (20%)</div>
                      <p className="text-xs text-white/70 leading-relaxed">High-frequency retention anchor; monetized via mobile recharges, bill payments, and processing convenience fees.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                      <div className="text-xs font-mono uppercase text-blue-400 font-bold mb-1">New Platforms (10%)</div>
                      <p className="text-xs text-white/70 leading-relaxed">Pincode (hyperlocal ONDC e-commerce) and Share.Market (wealth tech & stockbroking).</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-[#141722] border border-white/10">
                  <h4 className="text-lg font-bold text-white mb-3">Reconciled Workbook Valuation Summary</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                      <div className="text-xs text-white/50 uppercase font-mono">Present Value of Explicit FCFs</div>
                      <div className="text-xl font-bold text-white mt-1 font-mono">₹13,878.15 Cr</div>
                      <p className="text-xs text-white/60 mt-1 font-sans">Sum of 5-year explicit cash flows discounted at WACC 14.92%.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                      <div className="text-xs text-white/50 uppercase font-mono">Present Value of Terminal Value</div>
                      <div className="text-xl font-bold text-white mt-1 font-mono">₹19,553.83 Cr</div>
                      <p className="text-xs text-white/60 mt-1 font-sans">Blended TV (₹36,944 Cr) discounted at 0.5293 factor.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar: Revenue Mix & Regulatory Risk */}
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-[#141722] border border-white/10">
                  <h4 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                    <PieChart className="w-4 h-4 text-red-400" />
                    Estimated Revenue Contribution Mix
                  </h4>
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-white/70 mb-1">
                        <span>Merchant Subscriptions & Hardware</span>
                        <span className="font-bold text-white">42%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '42%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono text-white/70 mb-1">
                        <span>Lending & Insurance Distribution</span>
                        <span className="font-bold text-white">28%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '28%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono text-white/70 mb-1">
                        <span>Consumer Recharges & Utilities</span>
                        <span className="font-bold text-white">20%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono text-white/70 mb-1">
                        <span>New Platforms (Pincode, Share.Market)</span>
                        <span className="font-bold text-white">10%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: '10%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/30">
                  <h4 className="text-base font-bold text-amber-300 flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-4 h-4" />
                    Key Regulatory Risk
                  </h4>
                  <p className="text-xs text-amber-200/80 leading-relaxed font-sans">
                    NPCI's proposed 30% volume cap on third-party UPI applications represents an operational constraint. PhonePe currently handles ~48% of UPI volume; strict enforcement would limit consumer acquisition scale.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: HISTORICAL BASELINE & FORECAST ASSUMPTIONS */}
        {/* ================================================================= */}
        {activeTab === 'assumptions' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
                <div className="text-xs font-mono uppercase text-red-400 font-bold mb-1">Historical & Forecast Assumptions</div>
                <h3 className="text-xl font-bold text-white">CAPM Cost of Capital (WACC) Derivation</h3>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans">
                  The weighted average cost of capital (WACC) was constructed using the Capital Asset Pricing Model (CAPM) reflecting the risk profile of India’s consumer FinTech sector:
                </p>

                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-black/50 border-b border-white/10 text-white/50 text-[11px] uppercase">
                        <th className="py-2.5 px-3">CAPM Parameter</th>
                        <th className="py-2.5 px-3 text-right">Value</th>
                        <th className="py-2.5 px-3">Analytical Rationale</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="py-2 px-3 text-white">Risk-Free Rate (Rf)</td>
                        <td className="py-2 px-3 text-right text-emerald-400 font-bold">3.00%</td>
                        <td className="py-2 px-3 text-white/70 font-sans">Baseline sovereign risk-free proxy benchmark</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-white">Equity Beta (β)</td>
                        <td className="py-2 px-3 text-right text-amber-400 font-bold">1.35</td>
                        <td className="py-2 px-3 text-white/70 font-sans">Peer FinTech sensitivity reflecting high operating leverage</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-white">Market Return (Rm)</td>
                        <td className="py-2 px-3 text-right text-white font-bold">11.82%</td>
                        <td className="py-2 px-3 text-white/70 font-sans">Long-term Indian equity index benchmark return</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-white">Equity Risk Premium (Rm - Rf)</td>
                        <td className="py-2 px-3 text-right text-white font-bold">8.82%</td>
                        <td className="py-2 px-3 text-white/70 font-sans">Excess return required over risk-free benchmark</td>
                      </tr>
                      <tr className="bg-red-500/10 font-bold text-white">
                        <td className="py-2.5 px-3">Cost of Equity (Ke)</td>
                        <td className="py-2.5 px-3 text-right text-red-400 text-sm">14.92%</td>
                        <td className="py-2.5 px-3 font-sans">Ke = 3.00% + 1.35 × 8.82% = 14.91% (14.92% in model)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-white">Pre-Tax Cost of Debt (Kd)</td>
                        <td className="py-2 px-3 text-right text-white/50">0.00%</td>
                        <td className="py-2 px-3 text-white/70 font-sans">Debt weight set to 0% on Assumptions sheet (see Audit 3)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-white">Effective Tax Rate (t)</td>
                        <td className="py-2 px-3 text-right text-white font-bold">30.00%</td>
                        <td className="py-2 px-3 text-white/70 font-sans">Statutory corporate tax rate in India</td>
                      </tr>
                      <tr className="bg-emerald-500/10 font-bold text-white">
                        <td className="py-2.5 px-3">Weighted Cost of Capital (WACC)</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400 text-sm">14.92%</td>
                        <td className="py-2.5 px-3 font-sans">Discount rate applied across explicit 5-year FCFs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed font-sans">
                  <strong>Debt Weighting Governance Note:</strong> As verified in Audit Finding 3, the workbook entered debt as 0 on the Assumptions sheet, causing a #DIV/0! error in debt weighting. Consequently, the model applies 100% equity weighting (WACC = Cost of Equity = 14.92%).
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
                <h3 className="text-xl font-bold text-white">Key Operating & Financial Assumptions</h3>
                <div className="space-y-4 text-xs sm:text-sm font-sans leading-relaxed text-white/80">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <span className="font-bold text-white block mb-1">5-Year Explicit Forecast Horizon (FY26E–FY30E)</span>
                    <p className="text-white/70 text-xs">
                      5-year explicit projection period captures PhonePe's transition from volume scaling to unit margin stabilization.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <span className="font-bold text-white block mb-1">Equal-Weighted Blended Terminal Value</span>
                    <p className="text-white/70 text-xs">
                      Avoids reliance on a single terminal valuation methodology by averaging Perpetuity Growth (g = 7.00%) and Exit Multiple (EV/EBITDA = 13.15x).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <span className="font-bold text-white block mb-1">Non-Cash Working Capital Absorption</span>
                    <p className="text-white/70 text-xs">
                      Reflects substantial float balance and settlement clearing mechanisms characteristic of payments processing infrastructure.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <span className="font-bold text-white block mb-1">Share Capital Structure</span>
                    <p className="text-white/70 text-xs">
                      50.66 Cr common shares outstanding yielding the reconciled intrinsic share price of ₹821.78 per share.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: 5-YEAR EXPLICIT DCF MODEL */}
        {/* ================================================================= */}
        {activeTab === 'model' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141722] border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">5-Year Explicit DCF Forecast (FY26E – FY30E)</h3>
                  <p className="text-xs text-white/60 font-mono mt-1">
                    Discounted Unlevered Free Cash Flow to Firm (FCFF) • WACC = 14.92%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                    Verified Source Model
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-white">
                    Currency: ₹ in Crores
                  </span>
                </div>
              </div>

              {/* Mobile Swipe Cue */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mb-2 sm:hidden">
                <span>← Swipe horizontally to inspect all 5 forecast periods →</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[620px] text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-black/50 border-b border-white/10 text-white/50 font-mono text-[11px] uppercase">
                      <th className="py-3.5 px-4">Line Item (₹ Crores)</th>
                      <th className="py-3.5 px-4 text-right">FY26E (Year 0)</th>
                      <th className="py-3.5 px-4 text-right">FY27E (Year 1)</th>
                      <th className="py-3.5 px-4 text-right">FY28E (Year 2)</th>
                      <th className="py-3.5 px-4 text-right">FY29E (Year 3)</th>
                      <th className="py-3.5 px-4 text-right">FY30E (Year 4)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-sans font-medium text-white">Operating Profit (EBIT)</td>
                      <td className="py-3 px-4 text-right text-white">₹2,884.32</td>
                      <td className="py-3 px-4 text-right text-white">₹3,115.07</td>
                      <td className="py-3 px-4 text-right text-white">₹3,364.27</td>
                      <td className="py-3 px-4 text-right text-white">₹3,633.41</td>
                      <td className="py-3 px-4 text-right text-white">₹3,924.09</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] text-white/70">
                      <td className="py-3 px-4 font-sans">(-) Less: Adjusted Taxes (30%)</td>
                      <td className="py-3 px-4 text-right text-red-300">-₹865.30</td>
                      <td className="py-3 px-4 text-right text-red-300">-₹934.52</td>
                      <td className="py-3 px-4 text-right text-red-300">-₹1,009.28</td>
                      <td className="py-3 px-4 text-right text-red-300">-₹1,090.02</td>
                      <td className="py-3 px-4 text-right text-red-300">-₹1,177.23</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] text-white/70">
                      <td className="py-3 px-4 font-sans">(+) Add: Depreciation & Amortization</td>
                      <td className="py-3 px-4 text-right text-emerald-300">+₹567.74</td>
                      <td className="py-3 px-4 text-right text-emerald-300">+₹607.48</td>
                      <td className="py-3 px-4 text-right text-emerald-300">+₹650.01</td>
                      <td className="py-3 px-4 text-right text-emerald-300">+₹695.51</td>
                      <td className="py-3 px-4 text-right text-emerald-300">+₹744.19</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] text-white/70">
                      <td className="py-3 px-4 font-sans">(-) Less: Capital Expenditures (CapEx)</td>
                      <td className="py-3 px-4 text-right text-red-300">-₹305.00</td>
                      <td className="py-3 px-4 text-right text-red-300">-₹326.35</td>
                      <td className="py-3 px-4 text-right text-red-300">-₹349.19</td>
                      <td className="py-3 px-4 text-right text-red-300">-₹373.64</td>
                      <td className="py-3 px-4 text-right text-red-300">-₹399.79</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] text-white/70">
                      <td className="py-3 px-4 font-sans">(+) Non-Cash Working Capital Adjustments</td>
                      <td className="py-3 px-4 text-right text-emerald-300">+₹5,883.52</td>
                      <td className="py-3 px-4 text-right text-emerald-300">+₹6,295.37</td>
                      <td className="py-3 px-4 text-right text-emerald-300">+₹6,736.04</td>
                      <td className="py-3 px-4 text-right text-emerald-300">+₹7,207.56</td>
                      <td className="py-3 px-4 text-right text-emerald-300">+₹7,712.09</td>
                    </tr>
                    <tr className="bg-red-500/10 font-bold text-white border-t-2 border-red-500/40">
                      <td className="py-3.5 px-4 font-sans text-base">Unlevered Free Cash Flow (FCF)</td>
                      <td className="py-3.5 px-4 text-right text-emerald-400">₹3,538.70</td>
                      <td className="py-3.5 px-4 text-right text-emerald-400">₹3,786.41</td>
                      <td className="py-3.5 px-4 text-right text-emerald-400">₹4,051.46</td>
                      <td className="py-3.5 px-4 text-right text-emerald-400">₹4,335.06</td>
                      <td className="py-3.5 px-4 text-right text-emerald-400">₹4,638.52</td>
                    </tr>
                    <tr className="text-white/60 text-xs">
                      <td className="py-2.5 px-4 font-sans">Discount Factor (WACC = 14.92%)</td>
                      <td className="py-2.5 px-4 text-right">0.8805</td>
                      <td className="py-2.5 px-4 text-right">0.7753</td>
                      <td className="py-2.5 px-4 text-right">0.6827</td>
                      <td className="py-2.5 px-4 text-right">0.6011</td>
                      <td className="py-2.5 px-4 text-right">0.5293</td>
                    </tr>
                    <tr className="bg-white/[0.03] text-white font-semibold">
                      <td className="py-3 px-4 font-sans">Present Value of FCF</td>
                      <td className="py-3 px-4 text-right text-white">₹3,115.88</td>
                      <td className="py-3 px-4 text-right text-white">₹2,935.62</td>
                      <td className="py-3 px-4 text-right text-white">₹2,765.80</td>
                      <td className="py-3 px-4 text-right text-white">₹2,605.80</td>
                      <td className="py-3 px-4 text-right text-white">₹2,455.05</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Source Formula Lineage Note */}
              <div className="mt-4 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-start gap-2.5 text-xs text-blue-200/90 font-sans">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Source Formula Lineage:</strong> In the author's Excel model (<code className="text-blue-300">DCF Full</code>), Row 20 (Unlevered FCF) links directly to <code className="text-blue-300">=FCF!C18</code> (evaluating base-year FCF of ₹3,538.70 Cr based on historical EBIT of ₹909.26 Cr, taxes, D&A ₹567.74 Cr, CapEx ₹305.00 Cr, and working capital adjustments) and compounds at a constant 7.00% annual growth rate (<code className="text-blue-300">=C20*(1+0.07)</code>), rather than computing from the draft schedules in Rows 15–19 above it.
                </p>
              </div>

              {/* Valuation Mechanics Breakdown */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-red-400">
                  Valuation Formulation & Terminal Synthesis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-white/50 block text-[10px] uppercase">1. Explicit Cash Flows</span>
                    <span className="text-lg font-bold text-white block mt-1">₹13,878.15 Cr</span>
                    <p className="text-white/60 font-sans mt-1 text-[11px]">
                      Sum of explicit present values across FY26E–FY30E.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-white/50 block text-[10px] uppercase">2. Blended Terminal Value</span>
                    <span className="text-lg font-bold text-white block mt-1">₹19,553.83 Cr (PV)</span>
                    <p className="text-white/60 font-sans mt-1 text-[11px]">
                      Perpetuity (₹54,464 Cr) & Multiple (₹19,425 Cr) averaged and discounted at 0.5293.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <span className="text-red-300 block text-[10px] uppercase font-bold">3. Core Enterprise Value</span>
                    <span className="text-lg font-extrabold text-emerald-400 block mt-1">₹33,431.99 Cr</span>
                    <p className="text-white/60 font-sans mt-1 text-[11px]">
                      Total operating enterprise value before net liquidity bridge.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: SCENARIO ANALYSIS (BEAR / BASE / BULL) */}
        {/* ================================================================= */}
        {activeTab === 'scenarios' && (
          <div className="space-y-8">
            {/* Scenario Selector */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { id: 'bear', label: 'Bear Case (Regulatory Throttling)', color: 'text-rose-400' },
                { id: 'base', label: 'Base Case (Workbook Baseline)', color: 'text-amber-400' },
                { id: 'bull', label: 'Bull Case (Ecosystem Expansion)', color: 'text-emerald-400' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id as any)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    scenario === s.id
                      ? 'bg-white text-black shadow-lg scale-105'
                      : 'bg-[#141722] text-white/70 hover:bg-white/10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Scenario Detail Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bear */}
              <div
                className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                  scenario === 'bear'
                    ? 'bg-[#18151f] border-rose-500/60 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
                    : 'bg-[#141722] border-white/10 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-rose-400 font-bold">Bear Case</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">18% CAGR</span>
                </div>
                <div className="text-3xl font-extrabold text-white mt-4 font-mono">₹24,500 Cr</div>
                <div className="text-xs text-white/50 mt-1 font-mono">Implied Enterprise Value</div>
                <div className="mt-3 pt-3 border-t border-white/10 font-mono text-xs text-rose-300">
                  Equity Val: ₹32,699 Cr • ₹645.46 / share (Stress Bound: ₹420)
                </div>
                <ul className="mt-5 space-y-2 text-xs text-white/75 font-sans leading-relaxed">
                  <li>• NPCI strictly enforces 30% volume market cap, throttling onboarding.</li>
                  <li>• Digital lending credit conversion stays depressed below 1.5%.</li>
                  <li>• Merchant hardware attrition rises in Tier 2/3 markets under competition.</li>
                </ul>
              </div>

              {/* Base */}
              <div
                className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                  scenario === 'base'
                    ? 'bg-[#1c1a24] border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.15)]'
                    : 'bg-[#141722] border-white/10 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-amber-400 font-bold">Base Case (Workbook)</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">27% CAGR</span>
                </div>
                <div className="text-3xl font-extrabold text-white mt-4 font-mono">₹33,432 Cr</div>
                <div className="text-xs text-white/50 mt-1 font-mono">Implied Enterprise Value</div>
                <div className="mt-3 pt-3 border-t border-white/10 font-mono text-xs text-amber-300">
                  Equity Val: ₹41,631 Cr • ₹821.78 / share
                </div>
                <ul className="mt-5 space-y-2 text-xs text-white/75 font-sans leading-relaxed">
                  <li>• Stable ~48.5% volume dominance; volume cap deadline extended.</li>
                  <li>• Merchant SmartSpeaker subscriptions reach 7.5M units by FY28E.</li>
                  <li>• High-margin loan disbursement scales at 3.5% conversion.</li>
                </ul>
              </div>

              {/* Bull */}
              <div
                className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                  scenario === 'bull'
                    ? 'bg-[#14201c] border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                    : 'bg-[#141722] border-white/10 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Bull Case</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">38% CAGR</span>
                </div>
                <div className="text-3xl font-extrabold text-white mt-4 font-mono">₹45,800 Cr</div>
                <div className="text-xs text-white/50 mt-1 font-mono">Implied Enterprise Value</div>
                <div className="mt-3 pt-3 border-t border-white/10 font-mono text-xs text-emerald-300">
                  Equity Val: ₹53,999 Cr • ₹1,065.91 / share (Expansion Bound: ₹1,180)
                </div>
                <ul className="mt-5 space-y-2 text-xs text-white/75 font-sans leading-relaxed">
                  <li>• Regulatory approval for merchant MDR incentive sharing.</li>
                  <li>• Pincode e-commerce and Share.Market achieve accelerated adoption.</li>
                  <li>• Digital lending credit fees yield 60%+ contribution margin.</li>
                </ul>
              </div>
            </div>

            {/* Side-by-Side Comparison Matrix */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141722] border border-white/10 overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-4">Comprehensive Scenario Comparison Matrix</h3>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[650px] text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-black/50 border-b border-white/10 text-white/50 uppercase text-[11px]">
                      <th className="py-3 px-4">Scenario Metric</th>
                      <th className="py-3 px-4 text-right text-rose-300">Bear Case</th>
                      <th className="py-3 px-4 text-right text-amber-300">Base Case (Workbook)</th>
                      <th className="py-3 px-4 text-right text-emerald-300">Bull Case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-2.5 px-4 font-sans font-medium text-white">5-Year Projected Revenue CAGR</td>
                      <td className="py-2.5 px-4 text-right text-rose-300">18.0%</td>
                      <td className="py-2.5 px-4 text-right text-amber-300 font-bold">27.0%</td>
                      <td className="py-2.5 px-4 text-right text-emerald-300">38.0%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans font-medium text-white">Terminal Exit Multiple (EV/EBITDA)</td>
                      <td className="py-2.5 px-4 text-right">10.00x</td>
                      <td className="py-2.5 px-4 text-right font-bold">13.15x</td>
                      <td className="py-2.5 px-4 text-right">16.00x</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans font-medium text-white">Implied Operating Enterprise Value</td>
                      <td className="py-2.5 px-4 text-right font-bold text-white">₹24,500 Cr</td>
                      <td className="py-2.5 px-4 text-right font-bold text-amber-300">₹33,432 Cr</td>
                      <td className="py-2.5 px-4 text-right font-bold text-emerald-400">₹45,800 Cr</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-sans font-medium text-white">(+) Net Liquidity (Cash + Inv - Debt)</td>
                      <td className="py-2.5 px-4 text-right text-white/70">+₹8,199 Cr</td>
                      <td className="py-2.5 px-4 text-right text-white/70">+₹8,199 Cr</td>
                      <td className="py-2.5 px-4 text-right text-white/70">+₹8,199 Cr</td>
                    </tr>
                    <tr className="bg-white/[0.03]">
                      <td className="py-3 px-4 font-sans font-bold text-white">Implied Common Equity Value</td>
                      <td className="py-3 px-4 text-right font-extrabold text-rose-300">₹32,699 Cr</td>
                      <td className="py-3 px-4 text-right font-extrabold text-amber-300">₹41,631 Cr</td>
                      <td className="py-3 px-4 text-right font-extrabold text-emerald-400">₹53,999 Cr</td>
                    </tr>
                    <tr className="bg-red-500/10">
                      <td className="py-3 px-4 font-sans font-bold text-white">Implied Share Price (50.66 Cr Shares)</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-rose-400">₹645.46</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">₹821.78</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">₹1,065.91</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
                  <strong>Model Scenario Estimates:</strong> Scenario outputs represent exploratory DCF parameter variations for academic research and sensitivity evaluation, not guaranteed price targets, trading recommendations, or secondary market quotes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: EV-TO-EQUITY BRIDGE & INTRINSIC SHARE PRICE */}
        {/* ================================================================= */}
        {activeTab === 'bridge' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141722] border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">Enterprise Value to Equity Value Reconciliation</h3>
              <p className="text-xs text-white/60 mb-6 font-sans">
                Corporate finance bridge converting operational Enterprise Value into common Equity Value and implied price per share.
              </p>

              <div className="space-y-3 font-mono text-sm max-w-2xl mx-auto">
                <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/10">
                  <span className="font-sans font-semibold text-white">Core Operating Enterprise Value (EV)</span>
                  <span className="text-lg font-bold text-white">₹33,431.99 Cr</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="font-sans font-medium text-emerald-300">(+) Cash & Bank Balances</span>
                  <span className="text-lg font-bold text-emerald-400">+₹1,127.58 Cr</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="font-sans font-medium text-emerald-300">(+) Marketable Securities & Liquid Investments</span>
                  <span className="text-lg font-bold text-emerald-400">+₹7,787.65 Cr</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <span className="font-sans font-medium text-rose-300">(-) Total Long-Term Debt Obligations</span>
                  <span className="text-lg font-bold text-rose-400">-₹716.00 Cr</span>
                </div>

                <div className="flex items-center justify-between p-5 rounded-2xl bg-red-600/20 border-2 border-red-500 text-white shadow-xl">
                  <div>
                    <span className="font-sans font-bold text-base block">Implied Pre-IPO Common Equity Value</span>
                    <span className="text-xs text-white/60 font-sans">Residual value belonging to common shareholders</span>
                  </div>
                  <span className="text-2xl font-black text-white">₹41,631.22 Cr</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/10">
                  <div>
                    <span className="font-sans font-medium text-white/80 block">Common Shares Outstanding</span>
                    <span className="text-[10px] text-white/50 font-sans">Cell C12 in workbook model</span>
                  </div>
                  <span className="text-base font-bold text-white">50.66 Cr Shares</span>
                </div>

                <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-white">
                  <div>
                    <span className="font-sans font-bold text-base text-emerald-300 block">Implied Share Price (Reconciled)</span>
                    <span className="text-xs text-white/60 font-sans">₹41,631.22 Cr ÷ 50.66 Cr shares</span>
                  </div>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">₹821.78 / share</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 max-w-2xl mx-auto text-xs text-white/70 leading-relaxed font-sans">
                <strong>Why Enterprise Value Bridges to Equity Value:</strong> Enterprise Value measures the value of PhonePe’s core operating assets generated by its business operations. Because those operations are supported by non-operating liquid assets (₹8,915.23 Cr cash and marketable securities) and burdened by financial obligations (₹716.00 Cr debt), common equity holders are entitled to operational enterprise value plus net non-operating cash.
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: DYNAMIC SENSITIVITY HEATMAP */}
        {/* ================================================================= */}
        {activeTab === 'sensitivity' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141722] border border-white/10">
              {/* Distinctive Explanatory Banner */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 mb-6 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200/90 leading-relaxed font-sans">
                  <strong>ILLUSTRATIVE SENSITIVITY EXPLORATION:</strong> This interactive sensitivity tool allows testing how macroeconomic interest rates (WACC) and market multiple shifts impact implied valuation. The authoritative baseline valuation (<strong>₹33,431.99 Cr EV</strong> and <strong>₹41,631.22 Cr Equity Value</strong>) remains anchored to the verified source model.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Valuation Sensitivity Heatmap (WACC vs Exit Multiple)</h3>
                  <p className="text-xs text-white/60">Simulate macroeconomic interest rates and exit multiples.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-right">
                    <span className="text-[10px] text-white/50 uppercase block font-mono">Dynamic EV</span>
                    <span className="text-xl font-bold text-red-400 font-mono">₹{calculatedEV.toLocaleString()} Cr</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-right">
                    <span className="text-[10px] text-white/50 uppercase block font-mono">Dynamic Equity Val</span>
                    <span className="text-xl font-bold text-emerald-400 font-mono">₹{calculatedEquityValue.toLocaleString()} Cr</span>
                  </div>
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-black/30 border border-white/5 mb-6">
                <div>
                  <label className="flex justify-between text-xs font-mono text-white/80 mb-2">
                    <span>WACC Adjustment ({waccOffset > 0 ? `+${waccOffset}` : waccOffset}%): Current {currentWacc.toFixed(2)}%</span>
                  </label>
                  <input
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.5"
                    value={waccOffset}
                    onChange={(e) => setWaccOffset(parseFloat(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/65 font-mono mt-1">
                    <span>12.92% (Low rate)</span>
                    <span>14.92% (Base)</span>
                    <span>16.92% (Tightening)</span>
                  </div>
                </div>

                <div>
                  <label className="flex justify-between text-xs font-mono text-white/80 mb-2">
                    <span>Exit Multiple Adjustment ({multipleOffset > 0 ? `+${multipleOffset}` : multipleOffset}x): Current {currentMultiple.toFixed(2)}x</span>
                  </label>
                  <input
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.5"
                    value={multipleOffset}
                    onChange={(e) => setMultipleOffset(parseFloat(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/65 font-mono mt-1">
                    <span>11.15x (Compressed)</span>
                    <span>13.15x (Base)</span>
                    <span>15.15x (Expanded)</span>
                  </div>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-center border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-black/50 border-b border-white/10 text-white/50 text-[11px] uppercase">
                      <th className="py-3 px-3 text-left">WACC \ Multiple</th>
                      <th className="py-3 px-3">11.15x (-2.0x)</th>
                      <th className="py-3 px-3">12.15x (-1.0x)</th>
                      <th className="py-3 px-3 bg-red-500/20 text-red-300 font-bold">13.15x (Base)</th>
                      <th className="py-3 px-3">14.15x (+1.0x)</th>
                      <th className="py-3 px-3">15.15x (+2.0x)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { waccLabel: '12.92% (-2.0%)', wOff: -2.0 },
                      { waccLabel: '13.92% (-1.0%)', wOff: -1.0 },
                      { waccLabel: '14.92% (Base)', wOff: 0.0, isBaseWacc: true },
                      { waccLabel: '15.92% (+1.0%)', wOff: 1.0 },
                      { waccLabel: '16.92% (+2.0%)', wOff: 2.0 },
                    ].map((row, rIdx) => (
                      <tr key={rIdx} className={row.isBaseWacc ? 'bg-red-500/10 font-semibold' : 'hover:bg-white/[0.02]'}>
                        <td className="py-2.5 px-3 text-left font-bold text-white/80">{row.waccLabel}</td>
                        {[-2.0, -1.0, 0.0, 1.0, 2.0].map((mOff, cIdx) => {
                          const ev = Math.round(
                            33432 * (1 - (row.wOff / 100) * 8.5) * (1 + (mOff / baseMultiple) * 0.45)
                          );
                          const isAnchor = row.isBaseWacc && mOff === 0.0;
                          return (
                            <td
                              key={cIdx}
                              className={`py-2.5 px-3 ${
                                isAnchor
                                  ? 'bg-emerald-500/30 text-emerald-300 font-extrabold border border-emerald-400'
                                  : mOff === 0.0
                                  ? 'bg-red-500/10 text-white'
                                  : 'text-white/70'
                              }`}
                            >
                              ₹{ev.toLocaleString()} Cr
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 7: PEER COMPARISON */}
        {/* ================================================================= */}
        {activeTab === 'peer' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141722] border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Comparative FinTech Analysis: PhonePe vs Paytm (One97 Communications)</h3>
                  <p className="text-xs text-white/60">Contrasting ecosystem metrics, regulatory exposure, and valuation multiples.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                    Verified Public Facts
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-black/50 border-b border-white/10 text-white/50 font-mono text-[11px] uppercase">
                      <th className="py-3 px-4">Dimension</th>
                      <th className="py-3 px-4 text-emerald-300 font-mono">PhonePe (Model Estimates)</th>
                      <th className="py-3 px-4 text-blue-300 font-mono">Paytm / One97 (Public Filings)</th>
                      <th className="py-3 px-4 text-white/60 font-mono">Analytical Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans text-xs">
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-medium text-white">Consumer UPI Volume Share</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">~48.5%</td>
                      <td className="py-3 px-4 font-mono text-white">~8.5%</td>
                      <td className="py-3 px-4 text-white/70">PhonePe holds 5.7x volume lead in everyday consumer payments.</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-medium text-white">Merchant Soundbox Devices</td>
                      <td className="py-3 px-4 font-mono text-white">4.5M+ active units</td>
                      <td className="py-3 px-4 font-mono text-white">10M+ deployed units</td>
                      <td className="py-3 px-4 text-white/70">Paytm retains first-mover edge in merchant hardware deployment.</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-medium text-white">Regulatory Bank Dependency</td>
                      <td className="py-3 px-4 font-mono text-white">TPAP with Yes/ICICI/Axis</td>
                      <td className="py-3 px-4 font-mono text-rose-300">PPBL RBI restrictions</td>
                      <td className="py-3 px-4 text-white/70">PhonePe avoided bank licensing overhead and associated direct regulatory embargoes.</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-medium text-white">Implied / Trading EV Multiple</td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-300">13.15x FY30E EBITDA</td>
                      <td className="py-3 px-4 font-mono text-white">~3.5x EV/Sales (Volatile)</td>
                      <td className="py-3 px-4 text-white/70">PhonePe commands quality premium due to market share and Walmart backing.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 8: WORKBOOK AUDIT & DISCREPANCY LOG */}
        {/* ================================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileSearch className="w-5 h-5 text-red-400" />
                  <span>Workbook Formula Audit & Verification Findings</span>
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  Complete line-by-line inspection of <code className="text-red-300">DCF of phonepe.xlsx</code>.
                  Following STRATOS governance rules: <em>PRESERVE → DOCUMENT → FLAG → GOVERN</em>.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Audit Finding 1: Share Price Formula Inconsistency in 'EV to Equity Value'</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-sans">
                    On sheet <strong>'EV to Equity Value'</strong>, cell <code className="text-amber-300">C13</code> had formula <code className="text-amber-300">=C10/C9</code>, which divided Equity Value (₹41,631.22 Cr) by Long Term Debt (<code className="text-amber-300">C9 = 716</code>) producing 58.14. It should have divided by Shares Outstanding (<code className="text-emerald-300">C12 = 50.66 Cr shares</code>), which yields an implied share price of <strong>₹821.78 per share</strong>.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Audit Finding 2: Stale Row 36 Formula Artifacts in 'DCF Full'</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-sans">
                    In sheet <strong>'DCF Full'</strong>, Row 36 displays negative PV numbers (-₹515 Cr, -₹116 Cr) retained from an earlier draft that utilized negative historical EBIT. However, cell <code className="text-emerald-300">C38</code> actively pulls from <code className="text-emerald-300">=Discounting!C15</code>, which correctly evaluates the positive explicit FCF present values (₹13,878.15 Cr) and Terminal Value PV (₹19,553.83 Cr), reconciling to the model-implied Enterprise Value of <strong>₹33,431.99 Cr</strong>.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Audit Finding 3: Cost of Debt #DIV/0! on 'Assumptions' Sheet</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-sans">
                    On sheet <strong>'Assumptions'</strong>, cell <code className="text-amber-300">B20</code> entered total debt as 0, triggering a <code>#DIV/0!</code> error in the debt-weighting cell, whereas the 'EV to Equity Value' sheet incorporates ₹716.00 Cr debt. The model effectively treats debt weight as 0% in WACC, resulting in WACC equal to Cost of Equity (14.92%).
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-300 uppercase mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Audit Finding 4: Terminal Value Blending Methodology Confirmed</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-sans">
                    The workbook utilizes an average of two distinct terminal valuation approaches: Perpetuity Growth (g = 7.0%, WACC = 14.92%) yielding ₹54,463.99 Cr, and Exit Multiple (EV/EBITDA = 13.15x) yielding ₹19,425.05 Cr. The average of ₹36,944.52 Cr is discounted at 0.52928 to yield PV of Terminal Value = ₹19,553.83 Cr.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-300 uppercase mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Audit Finding 5: Balance Sheet Liquidity Bridge Verified</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-sans">
                    Core Enterprise Value ₹33,431.99 Cr + Cash & Bank ₹1,127.58 Cr + Marketable Investments ₹7,787.65 Cr - Debt ₹716.00 Cr = Implied Equity Value ₹41,631.22 Cr. The arithmetic of the liquidity bridge is verified and reconciles across sheets.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Audit Finding 6: Free Cash Flow Lineage vs Draft Schedules in 'DCF Full'</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-sans">
                    In sheet <strong>'DCF Full'</strong>, Row 20 (Unlevered FCF) does not calculate from the draft line items in Rows 15–19 (which would sum to ~₹8,165 Cr). Instead, cell <code className="text-amber-300">C20</code> links directly to <code className="text-emerald-300">=FCF!C18</code> (evaluating base-year FCF of ₹3,538.70 Cr based on historical EBIT of ₹909.26 Cr, taxes, D&A ₹567.74 Cr, CapEx ₹305.00 Cr, and working capital adjustments) and projects subsequent cash flows using a constant 7.00% compounding factor (<code className="text-amber-300">=C20*(1+0.07)</code>). The cash flow sequence is internally consistent to its base link, but Rows 15–19 in that sheet are illustrative working schedules rather than active calculation drivers.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-white/60 leading-relaxed font-sans">
                <strong>Model Audit Interpretation:</strong> These findings document technical calculation mechanics, formula links, and draft schedule artifacts within the student-constructed Excel workbook. Documenting them adheres to data governance principles and does not imply that the model is fully validated, free of other conceptual limitations, or suitable as an investment recommendation.
              </div>
            </div>
          </div>
        )}

        {/* Academic / Research Disclaimer */}
        <div className="mt-8 p-4 rounded-2xl bg-black/40 border border-white/5 text-[11px] text-white/50 leading-relaxed font-mono">
          <p>
            <strong>DISCLAIMER & METHODOLOGICAL DISCLOSURE:</strong> This pre-IPO valuation is an independent academic research project conducted by Kaustubh as part of MBA Business Analytics studies. This analysis does not constitute investment advice, equity research recommendations, or a solicitation to buy or sell securities. Projections, WACC assumptions, and segment forecasts reflect student-constructed financial models based on public disclosures.
          </p>
        </div>
      </div>
    </section>
  );
};
