import React from 'react';

export interface ValuationWaterfallProps {
  enterpriseValue: number;       // e.g. 33431.99 or 33432
  cashAndBank: number;           // e.g. 1127.58
  marketableInvestments: number; // e.g. 7787.65
  longTermDebt: number;          // e.g. 716.00
  equityValue: number;           // e.g. 41631.22 or 41631
  scenarioName?: string;         // 'Bear Case' | 'Base Case' | 'Bull Case'
}

interface WaterfallStep {
  id: string;
  label: string;
  sublabel: string;
  type: 'starting' | 'addition' | 'subtraction' | 'final';
  amount: number;
  signedAmount: number;
  startValue: number;
  endValue: number;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  colorBadge: string;
}

export const ValuationWaterfallChart: React.FC<ValuationWaterfallProps> = ({
  enterpriseValue,
  cashAndBank,
  marketableInvestments,
  longTermDebt,
  equityValue,
  scenarioName = 'Base Case'
}) => {
  // 1. Establish full-precision sequential steps
  const step1End = enterpriseValue;
  const step2End = step1End + cashAndBank;
  const step3End = step2End + marketableInvestments;
  const step4End = step3End - longTermDebt;
  const calculatedEquity = step4End;

  const steps: WaterfallStep[] = [
    {
      id: 'ev',
      label: 'Core Enterprise Value (EV)',
      sublabel: 'Operating assets discounted at 14.92% WACC',
      type: 'starting',
      amount: enterpriseValue,
      signedAmount: enterpriseValue,
      startValue: 0,
      endValue: step1End,
      colorBg: 'rgba(59, 130, 246, 0.25)', // Blue tone for baseline EV
      colorBorder: 'rgba(96, 165, 250, 0.8)',
      colorText: '#93c5fd',
      colorBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
    },
    {
      id: 'cash',
      label: '(+) Cash & Bank Balances',
      sublabel: 'Non-operating liquid bank cash',
      type: 'addition',
      amount: cashAndBank,
      signedAmount: cashAndBank,
      startValue: step1End,
      endValue: step2End,
      colorBg: 'rgba(16, 185, 129, 0.25)', // Emerald tone for additions
      colorBorder: 'rgba(52, 211, 153, 0.8)',
      colorText: '#6ee7b7',
      colorBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      id: 'investments',
      label: '(+) Marketable Securities',
      sublabel: 'Liquid treasury & mutual fund investments',
      type: 'addition',
      amount: marketableInvestments,
      signedAmount: marketableInvestments,
      startValue: step2End,
      endValue: step3End,
      colorBg: 'rgba(16, 185, 129, 0.25)', // Emerald tone
      colorBorder: 'rgba(52, 211, 153, 0.8)',
      colorText: '#6ee7b7',
      colorBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      id: 'debt',
      label: '(-) Long-Term Debt Obligations',
      sublabel: 'Long-term borrowings & lease liabilities',
      type: 'subtraction',
      amount: longTermDebt,
      signedAmount: -longTermDebt,
      startValue: step3End,
      endValue: step4End,
      colorBg: 'rgba(244, 63, 94, 0.25)', // Rose tone for debt deduction
      colorBorder: 'rgba(251, 113, 133, 0.8)',
      colorText: '#fda4af',
      colorBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    },
    {
      id: 'equity',
      label: '(=) Implied Equity Value',
      sublabel: 'Residual value attributable to shareholders',
      type: 'final',
      amount: calculatedEquity,
      signedAmount: calculatedEquity,
      startValue: 0,
      endValue: calculatedEquity,
      colorBg: 'rgba(239, 68, 68, 0.3)', // STRATOS Red flagship tone
      colorBorder: 'rgba(239, 68, 68, 0.9)',
      colorText: '#ffffff',
      colorBadge: 'bg-red-500/30 text-white border-red-500'
    }
  ];

  // Max scale includes the peak cumulative value (step 3: EV + Cash + Investments)
  const peakValue = Math.max(step3End, calculatedEquity, 45000);
  const chartHeight = 220; // SVG canvas height in pixels
  const chartWidth = 720;  // SVG canvas width coordinate system
  const paddingY = 30;
  const plotHeight = chartHeight - paddingY * 2;

  // Scale function mapping financial values to SVG y coordinates
  const scaleY = (val: number) => {
    return chartHeight - paddingY - (val / peakValue) * plotHeight;
  };

  const colWidth = 100;
  const colGap = 35;
  const startX = 35;

  const formatCr = (val: number) => {
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} Cr`;
  };

  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 p-4 sm:p-6 space-y-4">
      {/* Header and Context Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <h4 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wide">
              EV-to-Equity Capital Bridge Waterfall
            </h4>
          </div>
          <p className="text-xs text-white/60 font-sans mt-0.5">
            Unit: ₹ Crore • Proportional bridge visualization ({scenarioName})
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/80 self-start sm:self-auto">
          <span>Net Non-Operating Liquidity:</span>
          <span className="font-bold text-emerald-400">
            +{formatCr(cashAndBank + marketableInvestments - longTermDebt)}
          </span>
        </div>
      </div>

      {/* 1. Large-Screen SVG Waterfall Diagram (Hidden on small mobile where horizontal space is cramped) */}
      <div className="hidden md:block overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[620px]"
          role="img"
          aria-label={`Waterfall chart reconciling Enterprise Value of ${formatCr(enterpriseValue)} through cash addition of ${formatCr(cashAndBank)}, marketable securities addition of ${formatCr(marketableInvestments)}, and debt deduction of ${formatCr(longTermDebt)}, arriving at Implied Equity Value of ${formatCr(calculatedEquity)}.`}
        >
          {/* Subtle horizontal grid lines */}
          <line
            x1={startX - 10}
            y1={chartHeight - paddingY}
            x2={chartWidth - 20}
            y2={chartHeight - paddingY}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />
          <line
            x1={startX - 10}
            y1={scaleY(peakValue * 0.5)}
            x2={chartWidth - 20}
            y2={scaleY(peakValue * 0.5)}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1={startX - 10}
            y1={scaleY(peakValue)}
            x2={chartWidth - 20}
            y2={scaleY(peakValue)}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="3 3"
            strokeWidth="1"
          />

          {/* Connectors & Waterfall Bars */}
          {steps.map((step, idx) => {
            const x = startX + idx * (colWidth + colGap);
            const yTop = scaleY(Math.max(step.startValue, step.endValue));
            const yBottom = scaleY(Math.min(step.startValue, step.endValue));
            const barHeight = Math.max(Math.abs(yBottom - yTop), 4);

            const nextStep = steps[idx + 1];
            const nextX = startX + (idx + 1) * (colWidth + colGap);
            const connectorY = scaleY(step.endValue);

            const isNegative = step.signedAmount < 0;

            return (
              <g key={step.id} className="transition-all duration-300">
                {/* Horizontal dotted connector to next bar */}
                {nextStep && (
                  <line
                    x1={x + colWidth}
                    y1={connectorY}
                    x2={nextX}
                    y2={connectorY}
                    stroke="rgba(255,255,255,0.3)"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                )}

                {/* Step Bar Rectangle */}
                <rect
                  x={x}
                  y={yTop}
                  width={colWidth}
                  height={barHeight}
                  rx="6"
                  fill={step.colorBg}
                  stroke={step.colorBorder}
                  strokeWidth="1.5"
                />

                {/* Step Value Above/Below Bar */}
                <text
                  x={x + colWidth / 2}
                  y={yTop - 8}
                  textAnchor="middle"
                  fill={step.colorText}
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {isNegative ? '-' : step.type === 'addition' ? '+' : ''}
                  {formatCr(step.amount)}
                </text>

                {/* Step Short Label Under Base */}
                <text
                  x={x + colWidth / 2}
                  y={chartHeight - paddingY + 16}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.8)"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  {idx === 0 ? 'Core EV' : idx === 1 ? '+ Cash' : idx === 2 ? '+ Invest.' : idx === 3 ? '- Debt' : '= Equity'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 2. Responsive Mobile Waterfall Cards (Shown on mobile screens < 768px for perfect touch readability) */}
      <div className="md:hidden space-y-2.5">
        {steps.map((step, idx) => {
          const isNegative = step.signedAmount < 0;
          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                step.type === 'final'
                  ? 'bg-red-500/15 border-red-500 text-white font-bold'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${step.colorBadge}`}>
                  {idx + 1}
                </span>
                <div>
                  <span className="font-sans font-medium text-white block">{step.label}</span>
                  <span className="text-[10px] text-white/50 font-sans">{step.sublabel}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`font-bold font-mono text-sm block`} style={{ color: step.colorText }}>
                  {isNegative ? '-' : step.type === 'addition' ? '+' : ''}
                  {formatCr(step.amount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanatory Caption & Accounting Footnote */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/70 leading-relaxed font-sans">
        <strong>Reconciliation Bridge Rule:</strong> Enterprise Value represents core operations (₹{enterpriseValue.toLocaleString('en-IN')} Cr). Equity value is derived by adding non-operating cash (+₹{cashAndBank.toLocaleString('en-IN')} Cr) and marketable securities (+₹{marketableInvestments.toLocaleString('en-IN')} Cr) and deducting total borrowings (-₹{longTermDebt.toLocaleString('en-IN')} Cr), arriving at implied shareholder equity of ₹{calculatedEquity.toLocaleString('en-IN')} Cr.
      </div>
    </div>
  );
};

