export interface CalculatorInputs {
  // Compound Wealth
  initialPrincipal: number;
  monthlyDeposit: number;
  years: number;
  cagr: number;
  compoundingFrequency: 'monthly' | 'annually';
  inflationRate: number;

  // FIRE Runway
  currentAge: number;
  targetRetirementAge: number;
  currentInvestments: number;
  annualExpensesInRetirement: number;
  safeWithdrawalRate: number; // 3.5 - 4.0%
  expectedRoi: number;

  // Tax Drag
  marginalTaxRate: number; // e.g. 24%
  capGainsTaxRate: number; // e.g. 15%
  dividendYield: number; // e.g. 2%
  annualTurnover: number; // e.g. 15%
}

export interface CompoundResult {
  nominalTotal: number;
  realTotal: number;
  totalContributions: number;
  totalInterest: number;
  purchasingPowerLoss: number;
  timeline: {
    year: number;
    nominal: number;
    contributions: number;
    real: number;
  }[];
}

export interface FireResult {
  fireNumber: number;
  projectedNestEgg: number;
  currentGap: number;
  yearsRemaining: number;
  monthlyRequiredSavings: number;
  isFireReady: boolean;
  runwayYears: number;
  timeline: {
    age: number;
    balance: number;
    target: number;
  }[];
}

export interface TaxDragResult {
  taxShieldedTotal: number;
  taxableTotal: number;
  taxDragDollars: number;
  dragPercentage: number;
  advisoryAlphaValue: number;
  timeline: {
    year: number;
    taxShielded: number;
    taxable: number;
    lostToTaxes: number;
  }[];
}

export interface IntakeResponses {
  fullName: string;
  email: string;
  phone?: string;
  investableAssetsTier: '<$50k' | '$50k-$250k' | '$250k-$1M' | '$1M+';
  riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive' | 'Thematic';
  coreObjective: 'FIRE' | 'Wealth Accumulation' | 'Capital Preservation' | 'Tax Optimization';
  accountTypes: string[];
  notes?: string;
}

export interface TickerAllocation {
  ticker: string;
  name: string;
  category: 'Equity' | 'Fixed Income' | 'Alternatives' | 'Cash';
  targetWeight: number; // in % (e.g. 35)
  currentWeight?: number;
  expenseRatio: number;
  yield: number;
  description: string;
}

export interface ModelPortfolio {
  id: 'conservative' | 'balanced' | 'aggressive';
  name: string;
  tagline: string;
  equityPercentage: number;
  fixedIncomePercentage: number;
  alternativesPercentage: number;
  targetYield: number;
  historicalCagr: number;
  sharpeRatio: number;
  maxDrawdown: number;
  rebalanceFrequency: string;
  driftThreshold: string;
  description: string;
  allocations: TickerAllocation[];
  rebalanceHistory: {
    date: string;
    action: string;
    rationale: string;
  }[];
  monthlyCommentary: {
    date: string;
    author: string;
    title: string;
    content: string;
  };
}

export interface ConsultationBooking {
  token: string;
  customerEmail: string;
  customerName: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed';
  meetingLink: string;
  intakeData: IntakeResponses;
}
