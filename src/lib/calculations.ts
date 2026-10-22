import { CompoundResult, FireResult, TaxDragResult } from '@/types';

/**
 * Calculates compound wealth growth with dynamic monthly contributions,
 * compounding frequencies, and inflation adjustment.
 */
export function calculateCompoundWealth(
  initialPrincipal: number,
  monthlyDeposit: number,
  years: number,
  cagrPercent: number,
  frequency: 'monthly' | 'annually' = 'monthly',
  inflationPercent: number = 2.5
): CompoundResult {
  const r = cagrPercent / 100;
  const infl = inflationPercent / 100;
  const n = frequency === 'monthly' ? 12 : 1;
  const timeline: CompoundResult['timeline'] = [];

  let currentNominal = initialPrincipal;
  let totalContributions = initialPrincipal;

  timeline.push({
    year: 0,
    nominal: Math.round(initialPrincipal),
    contributions: Math.round(initialPrincipal),
    real: Math.round(initialPrincipal),
  });

  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      if (frequency === 'monthly') {
        currentNominal = currentNominal * (1 + r / 12) + monthlyDeposit;
      } else {
        currentNominal = currentNominal + monthlyDeposit;
      }
      totalContributions += monthlyDeposit;
    }

    if (frequency === 'annually') {
      currentNominal = currentNominal * (1 + r);
    }

    const realPurchasingPower = currentNominal / Math.pow(1 + infl, year);

    timeline.push({
      year,
      nominal: Math.round(currentNominal),
      contributions: Math.round(totalContributions),
      real: Math.round(realPurchasingPower),
    });
  }

  const nominalTotal = Math.round(currentNominal);
  const totalContrRounded = Math.round(totalContributions);
  const realTotal = Math.round(currentNominal / Math.pow(1 + infl, years));
  const totalInterest = Math.max(0, nominalTotal - totalContrRounded);
  const purchasingPowerLoss = Math.max(0, nominalTotal - realTotal);

  return {
    nominalTotal,
    realTotal,
    totalContributions: totalContrRounded,
    totalInterest,
    purchasingPowerLoss,
    timeline,
  };
}

/**
 * Calculates Retirement / FIRE runway, target nest egg via dynamic SWR (3.5% - 4.0%),
 * and required savings to bridge the gap.
 */
export function calculateFireRunway(
  currentAge: number,
  targetRetirementAge: number,
  currentInvestments: number,
  annualExpensesInRetirement: number,
  safeWithdrawalRatePercent: number = 4.0,
  expectedRoiPercent: number = 7.0,
  monthlySavings: number = 1500
): FireResult {
  const swr = safeWithdrawalRatePercent / 100;
  const fireNumber = Math.round(annualExpensesInRetirement / swr);
  const yearsRemaining = Math.max(1, targetRetirementAge - currentAge);
  const r = expectedRoiPercent / 100;

  // Project investment balance forward
  let balance = currentInvestments;
  const timeline: FireResult['timeline'] = [];

  timeline.push({
    age: currentAge,
    balance: Math.round(balance),
    target: fireNumber,
  });

  for (let yr = 1; yr <= yearsRemaining; yr++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r / 12) + monthlySavings;
    }
    timeline.push({
      age: currentAge + yr,
      balance: Math.round(balance),
      target: fireNumber,
    });
  }

  const projectedNestEgg = Math.round(balance);
  const currentGap = Math.max(0, fireNumber - projectedNestEgg);
  const isFireReady = projectedNestEgg >= fireNumber;

  // Calculate required monthly savings to hit exact FIRE number
  // FV = PV*(1+r)^t + PMT * [((1+r/12)^(12*t) - 1) / (r/12)]
  const totalMonths = yearsRemaining * 12;
  const monthlyRate = r / 12;
  const pvGrown = currentInvestments * Math.pow(1 + monthlyRate, totalMonths);
  const remainingNeeded = fireNumber - pvGrown;

  let monthlyRequiredSavings = 0;
  if (remainingNeeded > 0) {
    const annuityFactor = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    monthlyRequiredSavings = Math.round(remainingNeeded / annuityFactor);
  }

  // Current runway years based on expenses if no further income
  const runwayYears = Math.min(60, Number((currentInvestments / Math.max(1, annualExpensesInRetirement)).toFixed(1)));

  return {
    fireNumber,
    projectedNestEgg,
    currentGap,
    yearsRemaining,
    monthlyRequiredSavings: Math.max(0, monthlyRequiredSavings),
    isFireReady,
    runwayYears,
    timeline,
  };
}

/**
 * Quantifies tax drag across standard taxable brokerage vs tax-shielded IRA/401(k) accounts.
 */
export function calculateTaxDrag(
  initialPrincipal: number,
  annualContribution: number,
  years: number,
  nominalReturnPercent: number = 8.0,
  marginalTaxPercent: number = 24.0,
  capGainsTaxPercent: number = 15.0,
  dividendYieldPercent: number = 2.0,
  annualTurnoverPercent: number = 20.0
): TaxDragResult {
  const r = nominalReturnPercent / 100;
  const tMarginal = marginalTaxPercent / 100;
  const tCapGains = capGainsTaxPercent / 100;
  const divYield = dividendYieldPercent / 100;
  const turnover = annualTurnoverPercent / 100;

  // Tax drag formula:
  // Dividend drag = divYield * tMarginal
  // Capital gains drag from rebalance turnover = (r - divYield) * turnover * tCapGains
  const annualTaxDragRate = (divYield * tMarginal) + ((r - divYield) * turnover * tCapGains);
  const afterTaxReturn = Math.max(0.01, r - annualTaxDragRate);

  const timeline: TaxDragResult['timeline'] = [];

  let shielded = initialPrincipal;
  let taxable = initialPrincipal;

  timeline.push({
    year: 0,
    taxShielded: Math.round(shielded),
    taxable: Math.round(taxable),
    lostToTaxes: 0,
  });

  for (let yr = 1; yr <= years; yr++) {
    shielded = (shielded + annualContribution) * (1 + r);
    taxable = (taxable + annualContribution) * (1 + afterTaxReturn);

    const lost = Math.max(0, shielded - taxable);

    timeline.push({
      year: yr,
      taxShielded: Math.round(shielded),
      taxable: Math.round(taxable),
      lostToTaxes: Math.round(lost),
    });
  }

  const taxShieldedTotal = Math.round(shielded);
  const taxableTotal = Math.round(taxable);
  const taxDragDollars = Math.max(0, taxShieldedTotal - taxableTotal);
  const dragPercentage = taxShieldedTotal > 0 ? Number(((taxDragDollars / taxShieldedTotal) * 100).toFixed(1)) : 0;

  // Advisory Alpha: Value generated through asset location & tax-loss harvesting (est. ~1.1% annualized recovery)
  const advisoryAlphaValue = Math.round(taxDragDollars * 0.65);

  return {
    taxShieldedTotal,
    taxableTotal,
    taxDragDollars,
    dragPercentage,
    advisoryAlphaValue,
    timeline,
  };
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatPercent(num: number): string {
  return `${num.toFixed(1)}%`;
}
