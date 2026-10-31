/**
 * PhonePe Valuation Sensitivity Mathematical Engine
 *
 * Implements pure financial mathematics for Discounted Cash Flow (DCF) sensitivity exploration.
 * Strictly anchored to the governed baseline:
 * - Base Enterprise Value: ₹33,431.99 Cr (~₹33,432 Cr)
 * - Net Non-Operating Liquidity Bridge: +₹8,199.23 Cr (+₹1,127.58 Cr cash + ₹7,787.65 Cr investments - ₹716.00 Cr debt)
 * - Base Equity Value: ₹41,631.22 Cr (~₹41,631 Cr)
 * - Common Shares Outstanding: 50.66 Cr
 * - Base Implied Share Price: ₹821.78 per share
 * - Base CAPM WACC: 14.92% (Rf: 3.00%, Beta: 1.35, Rm: 11.82%, Debt weight: 0%)
 * - Base Terminal Growth: 7.00%
 * - Base Exit Multiple: 13.15x FY30E EBITDA (₹1,477.19 Cr)
 */

export type TerminalMethodology = 'blended' | 'perpetuity' | 'multiple';

export interface ValuationParameters {
  wacc: number; // e.g. 0.1492 for 14.92%
  terminalGrowth: number; // e.g. 0.07 for 7.00%
  exitMultiple: number; // e.g. 13.15 for 13.15x
  methodology?: TerminalMethodology;
  sharesOutstanding?: number; // defaults to 50.66 Cr
  netLiquidityBridge?: number; // defaults to 8199.23 Cr
}

export interface ValuationOutput {
  wacc: number;
  terminalGrowth: number;
  exitMultiple: number;
  methodology: TerminalMethodology;
  pvExplicitFcfs: number; // ₹ Cr
  tvPerpetuity: number; // ₹ Cr
  tvMultiple: number; // ₹ Cr
  tvWeighted: number; // ₹ Cr
  pvTerminalValue: number; // ₹ Cr
  enterpriseValue: number; // ₹ Cr
  netLiquidity: number; // ₹ Cr
  equityValue: number; // ₹ Cr
  sharesOutstanding: number; // Cr shares
  sharePrice: number; // ₹ per share
  isValid: boolean;
  validationError?: string;
}

export interface SensitivityCell {
  rowValue: number;
  colValue: number;
  output: ValuationOutput;
}

export interface SensitivityMatrix {
  rowParamName: 'wacc';
  colParamName: 'exitMultiple' | 'terminalGrowth';
  rowValues: number[];
  colValues: number[];
  cells: SensitivityCell[][];
}

// Authoritative Baseline Constants from DCF Model
export const PHONEPE_VALUATION_CONSTANTS = {
  BASE_WACC: 0.1492,
  BASE_TERMINAL_GROWTH: 0.07,
  BASE_EXIT_MULTIPLE: 13.15,
  BASE_PV_FCF: 13878.15, // Sum of 5-year explicit FCF PVs
  BASE_TV_PERPETUITY: 54463.99,
  BASE_TV_MULTIPLE: 19425.0485,
  BASE_TV_BLENDED: 36944.51925,
  BASE_PV_TV: 19553.95,
  BASE_EV: 33432.10,
  BASE_NET_LIQUIDITY: 8199.23,
  BASE_EQUITY_VALUE: 41631.33,
  SHARES_OUTSTANDING: 50.66,
  BASE_SHARE_PRICE: 821.78,
  FY30E_EBITDA: 1477.19,
  // Numerator for Gordon growth model: TV_perp * (baseWacc - baseG) = 54463.99 * (0.1492 - 0.07)
  NUMERATOR_G: 54463.99 * (0.1492 - 0.07), // 4313.548008 Cr
  CASH_FLOW_DURATION: 2.85, // Weighted Macaulay duration of explicit 5-year FCFs
};

/**
 * Validate input parameters for financial modeling
 */
export function validateValuationInputs(params: ValuationParameters): { isValid: boolean; error?: string } {
  const { wacc, terminalGrowth, exitMultiple, methodology = 'blended', sharesOutstanding = PHONEPE_VALUATION_CONSTANTS.SHARES_OUTSTANDING } = params;

  if (typeof wacc !== 'number' || isNaN(wacc) || !isFinite(wacc) || wacc <= 0) {
    return { isValid: false, error: 'WACC must be a positive finite percentage.' };
  }
  if (typeof terminalGrowth !== 'number' || isNaN(terminalGrowth) || !isFinite(terminalGrowth)) {
    return { isValid: false, error: 'Terminal growth must be a finite percentage.' };
  }
  if (typeof exitMultiple !== 'number' || isNaN(exitMultiple) || !isFinite(exitMultiple) || exitMultiple <= 0) {
    return { isValid: false, error: 'Exit multiple must be a positive finite number.' };
  }
  if (typeof sharesOutstanding !== 'number' || isNaN(sharesOutstanding) || !isFinite(sharesOutstanding) || sharesOutstanding <= 0) {
    return { isValid: false, error: 'Shares outstanding must be a positive finite number.' };
  }

  // Gordon growth denominator constraint: WACC > terminal growth
  if (methodology !== 'multiple' && wacc <= terminalGrowth) {
    return {
      isValid: false,
      error: `WACC (${(wacc * 100).toFixed(2)}%) must be strictly greater than terminal growth (${(terminalGrowth * 100).toFixed(2)}%) for perpetuity capitalization.`
    };
  }

  return { isValid: true };
}

/**
 * Computes complete PhonePe valuation given sensitivity parameters
 */
export function calculatePhonePeValuation(params: ValuationParameters): ValuationOutput {
  const validation = validateValuationInputs(params);
  const methodology = params.methodology || 'blended';
  const sharesOutstanding = params.sharesOutstanding ?? PHONEPE_VALUATION_CONSTANTS.SHARES_OUTSTANDING;
  const netLiquidity = params.netLiquidityBridge ?? PHONEPE_VALUATION_CONSTANTS.BASE_NET_LIQUIDITY;

  if (!validation.isValid) {
    return {
      wacc: params.wacc,
      terminalGrowth: params.terminalGrowth,
      exitMultiple: params.exitMultiple,
      methodology,
      pvExplicitFcfs: 0,
      tvPerpetuity: 0,
      tvMultiple: 0,
      tvWeighted: 0,
      pvTerminalValue: 0,
      enterpriseValue: 0,
      netLiquidity,
      equityValue: 0,
      sharesOutstanding,
      sharePrice: 0,
      isValid: false,
      validationError: validation.error,
    };
  }

  const { wacc, terminalGrowth, exitMultiple } = params;
  const { BASE_WACC, BASE_TERMINAL_GROWTH, BASE_PV_FCF, NUMERATOR_G, CASH_FLOW_DURATION, FY30E_EBITDA } = PHONEPE_VALUATION_CONSTANTS;

  // 1. PV of Explicit 5-Year Cash Flows
  // Scales with respect to WACC duration
  const pvExplicitFcfs = BASE_PV_FCF * Math.pow((1 + BASE_WACC) / (1 + wacc), CASH_FLOW_DURATION);

  // 2. Terminal Values
  // Perpetuity Growth:
  const tvPerpetuity = (NUMERATOR_G * (1 + terminalGrowth) / (1 + BASE_TERMINAL_GROWTH)) / (wacc - terminalGrowth);

  // Exit Multiple:
  const tvMultiple = exitMultiple * FY30E_EBITDA;

  // Weighted Terminal Value:
  let tvWeighted = 0;
  if (methodology === 'perpetuity') {
    tvWeighted = tvPerpetuity;
  } else if (methodology === 'multiple') {
    tvWeighted = tvMultiple;
  } else {
    // 50/50 blended default
    tvWeighted = (tvPerpetuity + tvMultiple) / 2;
  }

  // 3. Discount Terminal Value from Year 5
  // Model discount factor at Year 5 was 0.52927878 at base WACC
  const dfYear5 = 0.52927878 * Math.pow((1 + BASE_WACC) / (1 + wacc), 5);
  const pvTerminalValue = tvWeighted * dfYear5;

  // 4. Operating Enterprise Value
  const enterpriseValue = pvExplicitFcfs + pvTerminalValue;

  // 5. Implied Equity Value & Share Price
  const equityValue = enterpriseValue + netLiquidity;
  const sharePrice = equityValue / sharesOutstanding;

  return {
    wacc,
    terminalGrowth,
    exitMultiple,
    methodology,
    pvExplicitFcfs,
    tvPerpetuity,
    tvMultiple,
    tvWeighted,
    pvTerminalValue,
    enterpriseValue,
    netLiquidity,
    equityValue,
    sharesOutstanding,
    sharePrice,
    isValid: true,
  };
}

/**
 * Generate a 5x5 sensitivity matrix
 */
export function generateSensitivityMatrix(options: {
  rowParam: 'wacc';
  colParam: 'exitMultiple' | 'terminalGrowth';
  rowValues: number[];
  colValues: number[];
  baseParams: {
    wacc: number;
    terminalGrowth: number;
    exitMultiple: number;
    methodology?: TerminalMethodology;
  };
}): SensitivityMatrix {
  const { rowParam, colParam, rowValues, colValues, baseParams } = options;

  const cells: SensitivityCell[][] = rowValues.map((rVal) => {
    return colValues.map((cVal) => {
      const currentParams: ValuationParameters = {
        ...baseParams,
        wacc: rVal,
        [colParam]: cVal,
      };

      const output = calculatePhonePeValuation(currentParams);
      return {
        rowValue: rVal,
        colValue: cVal,
        output,
      };
    });
  });

  return {
    rowParamName: rowParam,
    colParamName: colParam,
    rowValues,
    colValues,
    cells,
  };
}
