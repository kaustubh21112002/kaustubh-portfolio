import {
  calculatePhonePeValuation,
  validateValuationInputs,
  generateSensitivityMatrix,
  PHONEPE_VALUATION_CONSTANTS,
} from '../src/components/flagship/valuationSensitivityMath.ts';

console.log('--- STARTING PHONEPE VALUATION SENSITIVITY MATH TESTS ---\n');

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${testName} - ${details}`);
    failed++;
  }
}

// TEST 1: Base Case Parity with Authoritative Model
{
  const base = calculatePhonePeValuation({
    wacc: PHONEPE_VALUATION_CONSTANTS.BASE_WACC,
    terminalGrowth: PHONEPE_VALUATION_CONSTANTS.BASE_TERMINAL_GROWTH,
    exitMultiple: PHONEPE_VALUATION_CONSTANTS.BASE_EXIT_MULTIPLE,
    methodology: 'blended',
  });

  assert(base.isValid, 'Test 1.1: Base case inputs are valid');
  assert(Math.abs(base.enterpriseValue - 33432.10) < 1.0, 'Test 1.2: Enterprise Value matches ₹33,432 Cr (~33,432.10)', `Got ${base.enterpriseValue}`);
  assert(Math.abs(base.equityValue - 41631.33) < 1.0, 'Test 1.3: Equity Value matches ₹41,631 Cr (~41,631.33)', `Got ${base.equityValue}`);
  assert(Math.abs(base.sharePrice - 821.78) < 0.05, 'Test 1.4: Implied Share Price matches ₹821.78/share', `Got ${base.sharePrice}`);
  assert(Math.abs(base.pvExplicitFcfs - 13878.15) < 0.1, 'Test 1.5: PV of 5-Yr FCF matches ₹13,878.15 Cr', `Got ${base.pvExplicitFcfs}`);
  assert(Math.abs(base.pvTerminalValue - 19553.95) < 1.0, 'Test 1.6: PV of TV matches ₹19,553.95 Cr', `Got ${base.pvTerminalValue}`);
}

// TEST 2: Terminal Value Methodology Switching
{
  const perp = calculatePhonePeValuation({
    wacc: 0.1492,
    terminalGrowth: 0.07,
    exitMultiple: 13.15,
    methodology: 'perpetuity',
  });
  const mult = calculatePhonePeValuation({
    wacc: 0.1492,
    terminalGrowth: 0.07,
    exitMultiple: 13.15,
    methodology: 'multiple',
  });
  const blended = calculatePhonePeValuation({
    wacc: 0.1492,
    terminalGrowth: 0.07,
    exitMultiple: 13.15,
    methodology: 'blended',
  });

  assert(Math.abs(perp.tvWeighted - 54463.99) < 1.0, 'Test 2.1: 100% Perpetuity TV matches ₹54,463.99 Cr', `Got ${perp.tvWeighted}`);
  assert(Math.abs(mult.tvWeighted - 19425.05) < 1.0, 'Test 2.2: 100% Exit Multiple TV matches ₹19,425.05 Cr', `Got ${mult.tvWeighted}`);
  assert(Math.abs(blended.tvWeighted - (perp.tvWeighted + mult.tvWeighted) / 2) < 0.01, 'Test 2.3: Blended TV is exact 50/50 arithmetic mean', `Got ${blended.tvWeighted}`);
  assert(perp.enterpriseValue > blended.enterpriseValue && blended.enterpriseValue > mult.enterpriseValue, 'Test 2.4: Methodology ordering matches perpetuity > blended > multiple');
}

// TEST 3: Monotonicity & Sensitivity Direction
{
  const lowWacc = calculatePhonePeValuation({ wacc: 0.1292, terminalGrowth: 0.07, exitMultiple: 13.15 });
  const baseWacc = calculatePhonePeValuation({ wacc: 0.1492, terminalGrowth: 0.07, exitMultiple: 13.15 });
  const highWacc = calculatePhonePeValuation({ wacc: 0.1692, terminalGrowth: 0.07, exitMultiple: 13.15 });

  assert(lowWacc.enterpriseValue > baseWacc.enterpriseValue && baseWacc.enterpriseValue > highWacc.enterpriseValue, 'Test 3.1: Increasing WACC strictly decreases Enterprise Value');
  assert(lowWacc.sharePrice > baseWacc.sharePrice && baseWacc.sharePrice > highWacc.sharePrice, 'Test 3.2: Increasing WACC strictly decreases Implied Share Price');

  const lowG = calculatePhonePeValuation({ wacc: 0.1492, terminalGrowth: 0.05, exitMultiple: 13.15 });
  const highG = calculatePhonePeValuation({ wacc: 0.1492, terminalGrowth: 0.08, exitMultiple: 13.15 });
  assert(highG.enterpriseValue > baseWacc.enterpriseValue && baseWacc.enterpriseValue > lowG.enterpriseValue, 'Test 3.3: Increasing terminal growth strictly increases valuation');

  const lowMult = calculatePhonePeValuation({ wacc: 0.1492, terminalGrowth: 0.07, exitMultiple: 11.15 });
  const highMult = calculatePhonePeValuation({ wacc: 0.1492, terminalGrowth: 0.07, exitMultiple: 15.15 });
  assert(highMult.enterpriseValue > baseWacc.enterpriseValue && baseWacc.enterpriseValue > lowMult.enterpriseValue, 'Test 3.4: Increasing exit multiple strictly increases valuation');
}

// TEST 4: Boundary & Constraint Validations
{
  const invalidWaccGrowth = calculatePhonePeValuation({ wacc: 0.07, terminalGrowth: 0.07, exitMultiple: 13.15, methodology: 'perpetuity' });
  assert(!invalidWaccGrowth.isValid, 'Test 4.1: Rejects WACC == growth for perpetuity method', invalidWaccGrowth.validationError);

  const waccBelowGrowth = calculatePhonePeValuation({ wacc: 0.06, terminalGrowth: 0.07, exitMultiple: 13.15, methodology: 'blended' });
  assert(!waccBelowGrowth.isValid, 'Test 4.2: Rejects WACC < growth for blended method', waccBelowGrowth.validationError);

  const multipleMethodWithWaccBelowGrowth = calculatePhonePeValuation({ wacc: 0.06, terminalGrowth: 0.07, exitMultiple: 13.15, methodology: 'multiple' });
  assert(multipleMethodWithWaccBelowGrowth.isValid, 'Test 4.3: Allows low WACC when using multiple method (independent of growth)');

  const negativeWacc = calculatePhonePeValuation({ wacc: -0.05, terminalGrowth: 0.07, exitMultiple: 13.15 });
  assert(!negativeWacc.isValid, 'Test 4.4: Rejects negative WACC');

  const nanInput = calculatePhonePeValuation({ wacc: NaN, terminalGrowth: 0.07, exitMultiple: 13.15 });
  assert(!nanInput.isValid, 'Test 4.5: Rejects NaN inputs');
}

// TEST 5: Sensitivity Matrix Generation
{
  const matrix = generateSensitivityMatrix({
    rowParam: 'wacc',
    colParam: 'exitMultiple',
    rowValues: [0.1292, 0.1392, 0.1492, 0.1592, 0.1692],
    colValues: [11.15, 12.15, 13.15, 14.15, 15.15],
    baseParams: {
      wacc: 0.1492,
      terminalGrowth: 0.07,
      exitMultiple: 13.15,
      methodology: 'blended',
    },
  });

  assert(matrix.cells.length === 5, 'Test 5.1: Matrix has exactly 5 rows');
  assert(matrix.cells[0].length === 5, 'Test 5.2: Matrix has exactly 5 columns');
  const baseCell = matrix.cells[2][2];
  assert(Math.abs(baseCell.output.enterpriseValue - 33432.10) < 1.0, 'Test 5.3: Center anchor cell matches base case EV');
}

console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
process.exit(failed > 0 ? 1 : 0);
