'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioExplorer from '@/components/Portfolios/PortfolioExplorer';
import RebalanceCalculator from '@/components/Portfolios/RebalanceCalculator';
import ComplianceModal from '@/components/ComplianceModal';
import { Layers, RefreshCw, Video, MessageSquare, ShieldCheck, Lock, Sparkles, CreditCard, CheckCircle2, User, ExternalLink, Bell, ArrowRight } from 'lucide-react';

function PortalContent() {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get('tier') === 'premium' ? 'premium' : 'core';

  const [activeTier, setActiveTier] = useState<'core' | 'premium'>(initialTier);
  const [activeTab, setActiveTab] = useState<'portfolios' | 'rebalance' | 'webinars' | 'billing'>('portfolios');
  const [complianceOpen, setComplianceOpen] = useState(false);

  // AMA Question simulator
  const [questionText, setQuestionText] = useState('');
  const [questionSent, setQuestionSent] = useState(false);

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText) return;
    setQuestionSent(true);
    setTimeout(() => {
      setQuestionText('');
      setQuestionSent(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col">
      <Navbar onOpenCompliance={() => setComplianceOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Member Status Top Banner */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">SaaS Model Portfolio Portal</h1>
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    activeTier === 'premium'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {activeTier === 'premium' ? 'Premium Advisory ($149/mo)' : 'Core Access ($49/mo)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Client ID: <span className="font-mono text-slate-300">usr_stripe_9842a1</span> • Next Rebalance Alert: <span className="text-emerald-400 font-mono">Q4 2026</span>
              </p>
            </div>
          </div>

          {/* Tier Switcher & Quick Portal Actions */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTier('core')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTier === 'core'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Core Tier ($49)
            </button>
            <button
              onClick={() => setActiveTier('premium')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTier === 'premium'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Premium Tier ($149)
            </button>
          </div>
        </div>

        {/* Protected Navigation Sub-Tabs */}
        <div className="flex border-b border-slate-800 space-x-2 sm:space-x-6 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('portfolios')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'portfolios'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Curated Model Portfolios</span>
          </button>

          <button
            onClick={() => setActiveTab('rebalance')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'rebalance'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Live Drift & Rebalance Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('webinars')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'webinars'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Advisor AMA & Messaging</span>
            {activeTier === 'core' && (
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/40">
                PREMIUM
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'billing'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Recurring Billing & Disclaimers</span>
          </button>
        </div>

        {/* Tab 1: Model Portfolios Explorer */}
        {activeTab === 'portfolios' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <PortfolioExplorer showMemberFeatures={true} />
          </div>
        )}

        {/* Tab 2: Rebalance Calculator */}
        {activeTab === 'rebalance' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <RebalanceCalculator />
          </div>
        )}

        {/* Tab 3: Webinars & Advisor AMA Direct Channel */}
        {activeTab === 'webinars' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {activeTier === 'core' ? (
              <div className="rounded-3xl bg-slate-900 border border-amber-500/30 p-8 text-center max-w-2xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Unlock Monthly Advisor AMA Webinars & Direct Messaging
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  The Premium Advisory SaaS tier ($149/mo) includes monthly live video AMA sessions with Demola Adepo, CFP®, tactical sector commentary, and direct priority messaging.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => setActiveTier('premium')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Upgrade to Premium ($149/mo)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Webinars archive */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Video className="w-4 h-4 text-emerald-400" />
                      <span>Monthly Advisor AMA Webinar Archive</span>
                    </h3>
                    <span className="text-xs font-mono text-emerald-400">Live Q&A</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-emerald-400 font-semibold">October 2026 Session</span>
                        <span className="text-slate-500 font-mono text-[11px]">Duration: 48 mins</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        "Macro Yield Curve Dynamics & AI Semiconductor Valuations"
                      </h4>
                      <p className="text-xs text-slate-400">
                        Advisor Demola Adepo breaks down 10-Yr Treasury yield resistance, why we trimmed SMH by 3%, and asset location for high-earning software executives.
                      </p>
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          RECORDING READY
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-emerald-400 font-semibold">September 2026 Session</span>
                        <span className="text-slate-500 font-mono text-[11px]">Duration: 54 mins</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        "Automated Drift Triggers: How the 60/40 Model Navigated Q3 Volatility"
                      </h4>
                      <p className="text-xs text-slate-400">
                        Case study reviewing subscriber drift notifications and dollar rebalance order execution.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Direct Advisor Priority Messaging Channel */}
                <div className="lg:col-span-5 bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Priority Advisory Messaging</h3>
                      <p className="text-[11px] text-slate-400">Direct channel with Demola Adepo, CFP®</p>
                    </div>
                  </div>

                  <form onSubmit={handleSendQuestion} className="space-y-3">
                    <label className="text-xs text-slate-300 block">
                      Submit a question for the upcoming AMA or private advisory review:
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="e.g. In the Aggressive Thematic model, what is your threshold for rotating out of QQQM if tech multiples compress?"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />

                    {questionSent && (
                      <p className="text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/30">
                        ✓ Question dispatched to advisor inbox! Expected response window: &lt; 24 business hours.
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Submit Priority Advisory Inquiry</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Billing & Disclaimers */}
        {activeTab === 'billing' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-200">
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">Stripe Subscription Management</h3>
                  <p className="text-xs text-slate-400">Manage payment methods, billing cycle, and plan tier</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>

              <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Current Plan:</span>
                  <span className="text-white font-bold">
                    {activeTier === 'premium' ? 'Premium Advisory SaaS ($149 / month)' : 'Core Portfolio Access ($49 / month)'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Billing Method:</span>
                  <span className="text-slate-300 font-mono">Visa ending in •••• 4242</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Next Invoice:</span>
                  <span className="text-slate-300 font-mono">November 22, 2026</span>
                </div>
              </div>

              {/* Security & Regulatory Verification Note */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 text-xs text-slate-400 space-y-2">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Specification Guardrails Compliance:</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  All SaaS portfolio feeds strictly operate under publisher/educational non-discretionary standards. Webhook handlers verify active Stripe customer ID status via JWT authentication middleware prior to granting access to encrypted portfolio endpoints.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3">
                <button
                  onClick={() => alert('Stripe Customer Billing Portal: Opening simulated billing session')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Stripe Billing Portal</span>
                </button>

                <button
                  onClick={() => setComplianceOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-all"
                >
                  View SEC Rule 202(a)(11)(D) Disclosures
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer onOpenCompliance={() => setComplianceOpen(true)} />

      <ComplianceModal
        isOpen={complianceOpen}
        onClose={() => setComplianceOpen(false)}
      />
    </div>
  );
}

export default function PortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090D16] text-white flex items-center justify-center">Loading Member Portal...</div>}>
      <PortalContent />
    </Suspense>
  );
}
