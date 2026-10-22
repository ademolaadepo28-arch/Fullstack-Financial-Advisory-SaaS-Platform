'use client';

import React, { useState } from 'react';
import { IntakeResponses } from '@/types';
import { ShieldCheck, Calendar, CreditCard, Check, ArrowRight, User, DollarSign, Target, HelpCircle, Lock } from 'lucide-react';
import StripeModal from './StripeModal';

export default function IntakeQuestionnaire() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<IntakeResponses>({
    fullName: '',
    email: '',
    phone: '',
    investableAssetsTier: '$50k-$250k',
    riskTolerance: 'Balanced',
    coreObjective: 'Wealth Accumulation',
    accountTypes: ['401(k) / IRA', 'Taxable Brokerage'],
    notes: '',
  });

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const assetTiers = [
    { id: '<$50k', label: '< $50,000', desc: 'Emerging Wealth & Foundation' },
    { id: '$50k-$250k', label: '$50,000 – $250,000', desc: 'Core Wealth Accumulator' },
    { id: '$250k-$1M', label: '$250,000 – $1,000,000', desc: 'High Net Worth Accelerator' },
    { id: '$1M+', label: '$1,000,000+', desc: 'Private Wealth / Family Office' },
  ];

  const riskOptions = [
    { id: 'Conservative', label: 'Conservative Preservation', desc: '30% Equity / 70% Fixed Income. Focus on capital preservation & dividends.' },
    { id: 'Balanced', label: 'Balanced Global Growth', desc: '60% Equity / 40% Fixed Income. Global index diversification with automated drift triggers.' },
    { id: 'Aggressive', label: 'Aggressive Growth', desc: '85% Equity / 15% Alternatives. Secular growth, AI compute, and disruptive themes.' },
    { id: 'Thematic', label: 'Thematic Innovation', desc: 'High-conviction tech, real estate REITs, and precious metals.' },
  ];

  const objectives = [
    { id: 'Wealth Accumulation', label: 'Wealth Accumulation', desc: 'Systematic monthly compounding and portfolio optimization.' },
    { id: 'FIRE', label: 'Retirement / FIRE Runway', desc: 'Calculating safe withdrawal rate and bridging nest egg savings gap.' },
    { id: 'Tax Optimization', label: 'Tax-Drag Mitigation', desc: 'Asset location strategy across taxable vs IRA/401(k) accounts.' },
    { id: 'Capital Preservation', label: 'Capital Preservation', desc: 'De-risking portfolio, maximizing fixed income yield & dividend income.' },
  ];

  const accountOptions = [
    '401(k) / 403(b)',
    'Traditional / Roth IRA',
    'Taxable Brokerage',
    'Health Savings Account (HSA)',
    'Real Estate Assets',
    'Crypto / Liquid Alternatives',
  ];

  const handleAccountToggle = (acc: string) => {
    if (formData.accountTypes.includes(acc)) {
      setFormData({
        ...formData,
        accountTypes: formData.accountTypes.filter((a) => a !== acc),
      });
    } else {
      setFormData({
        ...formData,
        accountTypes: [...formData.accountTypes, acc],
      });
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      alert('Please provide your name and email address to proceed.');
      return;
    }
    setCheckoutModalOpen(true);
  };

  return (
    <section id="booking-section" className="py-20 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400 mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>SECTION 4: PAID 30-MINUTE CONSULTATION & CALENDAR INTEGRATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Fiduciary 1-on-1 Strategy Consultation
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Our intake pipeline enforces an upfront <strong className="text-amber-400">$150 pre-authorized advisory fee</strong> to prevent spam and guarantee dedicated time with a Certified Financial Planner (CFP®).
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex items-center justify-between max-w-xl mx-auto mb-8 px-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(step)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentStep === step
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                    : currentStep > step
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {currentStep > step ? <Check className="w-4 h-4" /> : step}
              </button>
              <span className="text-xs font-medium text-slate-300 hidden sm:inline">
                {step === 1 ? 'Profile & Assets' : step === 2 ? 'Risk & Goals' : 'Review & Stripe'}
              </span>
              {step < 3 && <div className="w-12 sm:w-20 h-0.5 bg-slate-800 mx-2" />}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative">
          {/* Step 1: Client Profile & Investable Assets */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  <span>Step 1: Client Profile & Assets Overview</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Confidential intake parameters utilized to prepare your custom diagnostic memo prior to the call.
                </p>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Demola Vance"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. demola@example.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Investable Assets Range */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">
                  Approximate Investable Assets Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {assetTiers.map((tier) => (
                    <div
                      key={tier.id}
                      onClick={() => setFormData({ ...formData, investableAssetsTier: tier.id as any })}
                      className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                        formData.investableAssetsTier === tier.id
                          ? 'bg-amber-500/10 border-amber-500 shadow-md'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white font-mono">{tier.label}</span>
                        {formData.investableAssetsTier === tier.id && (
                          <div className="w-2 h-2 rounded-full bg-amber-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{tier.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.fullName || !formData.email) {
                      alert('Please provide your name and email to continue.');
                      return;
                    }
                    setCurrentStep(2);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1.5"
                >
                  <span>Continue to Risk & Objectives</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Risk Profile & Core Objective */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  <span>Step 2: Risk Profile & Primary Financial Objective</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Aligns the consultation with your specific quantitative goals and risk horizon.
                </p>
              </div>

              {/* Risk Profiles */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">
                  Preferred Investment Posture
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {riskOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setFormData({ ...formData, riskTolerance: opt.id as any })}
                      className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                        formData.riskTolerance === opt.id
                          ? 'bg-amber-500/10 border-amber-500 shadow-md'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{opt.label}</span>
                        {formData.riskTolerance === opt.id && (
                          <div className="w-2 h-2 rounded-full bg-amber-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Financial Objectives */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">
                  Primary Objective for 30-Min Call
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {objectives.map((obj) => (
                    <div
                      key={obj.id}
                      onClick={() => setFormData({ ...formData, coreObjective: obj.id as any })}
                      className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                        formData.coreObjective === obj.id
                          ? 'bg-emerald-500/10 border-emerald-500 shadow-md'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{obj.label}</span>
                        {formData.coreObjective === obj.id && (
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{obj.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Account Types */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">
                  Existing Accounts Held (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {accountOptions.map((acc) => {
                    const selected = formData.accountTypes.includes(acc);
                    return (
                      <button
                        type="button"
                        key={acc}
                        onClick={() => handleAccountToggle(acc)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          selected
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}
                        {acc}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Back to Profile
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1.5"
                >
                  <span>Review & Lock $150 Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Automated Payment-to-Calendar Handshake */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <span>Step 3: Automated Payment-to-Calendar Handshake</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upon completion of checkout, our server generates a single-use booking token granting access to Demola Adepo, CFP®'s private calendar.
                </p>
              </div>

              {/* Consultation Invoice Summary Card */}
              <div className="rounded-xl bg-slate-950/80 border border-amber-500/30 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">30-Minute Quantitative Strategy Session</h4>
                    <p className="text-xs text-slate-400">1-on-1 with Senior Wealth Advisor Demola Adepo, CFP®</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono text-amber-400">$150.00</span>
                    <span className="text-[10px] text-slate-500 block">One-time fixed fee</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-mono block">Client</span>
                    <span className="text-slate-200 font-medium truncate block">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-mono block">Assets Tier</span>
                    <span className="text-slate-200 font-mono font-medium block">{formData.investableAssetsTier}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-mono block">Posture</span>
                    <span className="text-slate-200 font-medium block">{formData.riskTolerance}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-mono block">Objective</span>
                    <span className="text-emerald-400 font-medium block">{formData.coreObjective}</span>
                  </div>
                </div>

                {/* Specific Notes for Advisor */}
                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    Specific questions or notes for advisor (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Seeking to roll over old 401k and optimize asset location for $250k portfolio..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Handshake Flow Spec Alert */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Specification Protocol Handshake:</span>
                </p>
                <ol className="list-decimal list-inside text-slate-400 space-y-1 text-[11px]">
                  <li>Stripe Checkout pre-authorizes fixed $150.00 advisory fee.</li>
                  <li>On webhook event <code className="text-amber-300">checkout.session.completed</code>, server signs a single-use token.</li>
                  <li>Single-use token automatically unlocks private Cal.com / Google Meet calendar slots.</li>
                  <li>Intake response bundle dispatched to advisor inbox with Google Meet link.</li>
                </ol>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Back to Risk
                </button>
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Stripe Checkout ($150)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stripe Payment Modal */}
      <StripeModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        formData={formData}
      />
    </section>
  );
}
