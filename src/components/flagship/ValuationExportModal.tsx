import React, { useEffect, useRef } from 'react';
import { X, Printer, Download, ShieldAlert, CheckCircle2, AlertTriangle, Layers, Percent, TrendingUp, Scale, ExternalLink } from 'lucide-react';

export interface ValuationSummaryData {
  scenario: 'bear' | 'base' | 'bull';
  wacc: number;
  exitMultiple: number;
  enterpriseValue: number;
  netLiquidity: number;
  equityValue: number;
  sharesOutstanding: number;
  sharePrice: string;
  revenueCagr: string;
  waccParameters: {
    rf: string;
    beta: string;
    rm: string;
    erp: string;
    ke: string;
    wacc: string;
  };
  peerComparison: {
    phonepeMultiple: string;
    paytmMultiple: string;
    phonepeShare: string;
    paytmShare: string;
  };
}

interface ValuationExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ValuationSummaryData;
}

export const ValuationExportModal: React.FC<ValuationExportModalProps> = ({ isOpen, onClose, data }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const printButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        printButtonRef.current?.focus();
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const scenarioTitles = {
    bear: 'Bear Case (Regulatory Throttling & 30% Market Cap)',
    base: 'Base Case (Workbook Baseline — DCF of phonepe.xlsx)',
    bull: 'Bull Case (Ecosystem Expansion & Margin Acceleration)'
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-summary-title"
      data-valuation-modal="true"
      className="valuation-export-modal-root fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className="valuation-export-card relative w-full max-w-4xl max-h-[92vh] bg-[#0d0f17] border border-white/20 rounded-3xl shadow-2xl overflow-y-auto z-10 text-white p-5 sm:p-8 my-auto font-sans"
      >
        {/* Controls Ribbon (excluded during print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-white/10 no-print">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-white/70 font-bold">
              One-Page Executive Valuation Brief
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              ref={printButtonRef}
              onClick={handlePrint}
              aria-label="Print or Save Valuation Brief as PDF"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-mono font-bold transition-transform active:scale-95 cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close valuation summary modal"
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PRINTABLE ONE-PAGE EXECUTIVE VALUATION BRIEF CONTENT           */}
        {/* ============================================================== */}
        <div className="valuation-export-sheet space-y-5 text-neutral-900 dark:text-white print:text-black">
          {/* Header Block */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-white/10 print:border-black/20">
            <div>
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-red-500 dark:text-red-400 print:text-black font-bold">
                Pre-IPO Equity Research & Valuation Brief
              </div>
              <h2 id="export-summary-title" className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                PhonePe Private Limited
              </h2>
              <div className="text-xs font-mono text-neutral-600 dark:text-white/60 print:text-neutral-700 mt-0.5">
                Target Model: DCF Full • Active Scenario: <span className="font-bold uppercase text-neutral-900 dark:text-white print:text-black">{data.scenario}</span>
              </div>
            </div>
            <div className="text-left sm:text-right text-[11px] font-mono text-neutral-600 dark:text-white/60 print:text-neutral-700">
              <div>Author: Kaustubh K. Nandurkar</div>
              <div>MBA Business Analytics (2025–2027)</div>
              <div>Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>

          {/* Key Executive Value Outputs Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-black/40 print:bg-neutral-50 border border-neutral-200 dark:border-white/10 print:border-black/15">
              <span className="text-[10px] uppercase font-mono text-neutral-500 dark:text-white/60 print:text-neutral-600 block">
                Enterprise Value (EV)
              </span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-neutral-900 dark:text-white print:text-black block mt-0.5">
                ₹{data.enterpriseValue.toLocaleString()} Cr
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 print:text-neutral-700">
                Operating FCF + TV
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-black/40 print:bg-neutral-50 border border-neutral-200 dark:border-white/10 print:border-black/15">
              <span className="text-[10px] uppercase font-mono text-neutral-500 dark:text-white/60 print:text-neutral-600 block">
                (+) Net Liquidity
              </span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-neutral-900 dark:text-white print:text-black block mt-0.5">
                +₹{data.netLiquidity.toLocaleString()} Cr
              </span>
              <span className="text-[10px] font-mono text-neutral-500 dark:text-white/50 print:text-neutral-600">
                Cash + Inv - Debt
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-black/40 print:bg-neutral-50 border border-neutral-200 dark:border-white/10 print:border-black/15">
              <span className="text-[10px] uppercase font-mono text-neutral-500 dark:text-white/60 print:text-neutral-600 block">
                Implied Equity Value
              </span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-neutral-900 dark:text-white print:text-black block mt-0.5">
                ₹{data.equityValue.toLocaleString()} Cr
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 print:text-neutral-700">
                Common Equity Pool
              </span>
            </div>

            <div className="p-3 rounded-xl bg-red-500/10 print:bg-neutral-100 border border-red-500/30 print:border-black/20">
              <span className="text-[10px] uppercase font-mono text-red-600 dark:text-red-300 print:text-black block font-bold">
                Implied Per-Share Value
              </span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-red-600 dark:text-red-400 print:text-black block mt-0.5">
                ₹{data.sharePrice}
              </span>
              <span className="text-[10px] font-mono text-neutral-600 dark:text-white/60 print:text-neutral-700">
                50.66 Cr Shares
              </span>
            </div>
          </div>

          {/* Thesis & Methodology Synthesis */}
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-white/[0.02] print:bg-white border border-neutral-200 dark:border-white/10 print:border-black/15 text-xs leading-relaxed space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-neutral-600 dark:text-white/60 print:text-black block">
              Core Valuation Dilemma & Active Scenario Context
            </span>
            <p className="text-neutral-800 dark:text-white/80 print:text-neutral-900 text-[11px] leading-relaxed">
              <strong>Thesis:</strong> PhonePe accounts for ~48.5% of UPI volume in India, but zero MDR on consumer UPI requires monetizing through merchant hardware subscriptions (SmartSpeakers), digital credit origination, and micro-insurance.
            </p>
            <p className="text-neutral-800 dark:text-white/80 print:text-neutral-900 text-[11px] leading-relaxed">
              <strong>Scenario Details ({scenarioTitles[data.scenario]}):</strong> 5-Year CAGR {data.revenueCagr} • Terminal Exit Multiple {data.exitMultiple.toFixed(2)}x EBITDA • WACC {data.wacc.toFixed(2)}% (CAPM: Rf 3.0%, Beta 1.35, Rm 11.82%).
            </p>
          </div>

          {/* Tables Grid: CAPM Bridge & Sensitivity Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs font-mono">
            {/* Table 1: Corporate Finance EV-to-Equity Bridge */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 print:border-black/15 overflow-hidden">
              <div className="p-2.5 bg-neutral-100 dark:bg-black/50 print:bg-neutral-100 border-b border-neutral-200 dark:border-white/10 print:border-black/15 font-bold text-[11px]">
                Corporate Finance EV-to-Equity Bridge
              </div>
              <table className="w-full text-left text-[11px]">
                <tbody className="divide-y divide-neutral-200 dark:divide-white/5 print:divide-black/10">
                  <tr className="bg-neutral-50/50 dark:bg-white/[0.01]">
                    <td className="py-1.5 px-3">Operating Enterprise Value (EV)</td>
                    <td className="py-1.5 px-3 text-right font-bold">₹{data.enterpriseValue.toLocaleString()} Cr</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-emerald-600 dark:text-emerald-400 print:text-neutral-800">(+) Cash & Bank Balances</td>
                    <td className="py-1.5 px-3 text-right text-emerald-600 dark:text-emerald-400 print:text-neutral-800">+₹1,128 Cr</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-emerald-600 dark:text-emerald-400 print:text-neutral-800">(+) Marketable Securities & Liquid Inv.</td>
                    <td className="py-1.5 px-3 text-right text-emerald-600 dark:text-emerald-400 print:text-neutral-800">+₹7,788 Cr</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-rose-600 dark:text-rose-400 print:text-neutral-800">(-) Total Long-Term Debt Obligations</td>
                    <td className="py-1.5 px-3 text-right text-rose-600 dark:text-rose-400 print:text-neutral-800">-₹716 Cr</td>
                  </tr>
                  <tr className="bg-neutral-100 dark:bg-white/5 print:bg-neutral-100 font-bold">
                    <td className="py-2 px-3 text-neutral-900 dark:text-white print:text-black">Implied Common Equity Value</td>
                    <td className="py-2 px-3 text-right text-neutral-900 dark:text-white print:text-black">₹{data.equityValue.toLocaleString()} Cr</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-neutral-600 dark:text-white/70 print:text-neutral-700">Common Shares Outstanding</td>
                    <td className="py-1.5 px-3 text-right font-bold">50.66 Cr Shares</td>
                  </tr>
                  <tr className="bg-red-500/10 print:bg-neutral-200 font-bold text-red-600 dark:text-red-400 print:text-black">
                    <td className="py-2 px-3">Implied Per-Share Price</td>
                    <td className="py-2 px-3 text-right text-xs">₹{data.sharePrice} / share</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table 2: Peer Multiple & Terminal Value Synthesis */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 print:border-black/15 overflow-hidden">
              <div className="p-2.5 bg-neutral-100 dark:bg-black/50 print:bg-neutral-100 border-b border-neutral-200 dark:border-white/10 print:border-black/15 font-bold text-[11px]">
                Methodological Benchmarking & Sensitivity
              </div>
              <table className="w-full text-left text-[11px]">
                <tbody className="divide-y divide-neutral-200 dark:divide-white/5 print:divide-black/10">
                  <tr>
                    <td className="py-1.5 px-3 text-neutral-600 dark:text-white/70 print:text-neutral-700">Cost of Capital (WACC)</td>
                    <td className="py-1.5 px-3 text-right font-bold">{data.wacc.toFixed(2)}% (CAPM derived)</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-neutral-600 dark:text-white/70 print:text-neutral-700">Explicit Forecast Period</td>
                    <td className="py-1.5 px-3 text-right">FY26E–FY30E (5 Years)</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-neutral-600 dark:text-white/70 print:text-neutral-700">Terminal Growth Rate (g)</td>
                    <td className="py-1.5 px-3 text-right">7.00% (Perpetuity)</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-neutral-600 dark:text-white/70 print:text-neutral-700">Exit Multiple (EV/EBITDA)</td>
                    <td className="py-1.5 px-3 text-right font-bold">{data.exitMultiple.toFixed(2)}x</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-neutral-600 dark:text-white/70 print:text-neutral-700">Blended Terminal Value (PV)</td>
                    <td className="py-1.5 px-3 text-right">₹19,554 Cr (58.5% of EV)</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-neutral-600 dark:text-white/70 print:text-neutral-700">UPI Ecosystem Volume Lead</td>
                    <td className="py-1.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400 print:text-neutral-800">
                      ~48.5% vs Paytm ~8.5%
                    </td>
                  </tr>
                  <tr className="bg-neutral-50 dark:bg-white/[0.01]">
                    <td className="py-2 px-3 text-neutral-600 dark:text-white/70 print:text-neutral-700">Merchant Soundbox Base</td>
                    <td className="py-2 px-3 text-right font-bold">4.5M+ active devices</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Verification & Limitations Footer */}
          <div className="p-3 rounded-xl bg-amber-500/10 print:bg-neutral-50 border border-amber-500/25 print:border-black/15 text-[10px] leading-relaxed text-amber-900 dark:text-amber-200/90 print:text-neutral-800 font-sans space-y-1">
            <span className="font-mono uppercase font-bold text-amber-700 dark:text-amber-300 print:text-black flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Governance & Technical Audit Log Findings</span>
            </span>
            <p>
              • <strong>Audit 1:</strong> The Excel workbook formula on sheet 'EV to Equity Value' cell C13 divided by Debt instead of Shares Outstanding (50.66 Cr); reconciled here to ₹821.78 per share.
            </p>
            <p>
              • <strong>Audit 2 & 3:</strong> Unlevered FCF links to =FCF!C18 (base FCF ₹3,538.70 Cr) compounding at 7.0% CAGR; Debt was entered as 0 on Assumptions sheet, causing 100% equity weighting.
            </p>
            <p className="text-[9px] text-neutral-500 dark:text-white/50 print:text-neutral-600 pt-0.5">
              <strong>Academic Research Disclaimer:</strong> Independent academic research model prepared as part of MBA Business Analytics studies. Not an investment recommendation, secondary trade solicitation, or price target.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
