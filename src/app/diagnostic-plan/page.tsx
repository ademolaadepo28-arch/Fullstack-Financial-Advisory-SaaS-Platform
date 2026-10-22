'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Printer, ArrowLeft, ShieldCheck, TrendingUp, Calendar, Download, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';

function DiagnosticContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Valued Investor';
  const email = searchParams.get('email') || 'investor@example.com';
  const type = searchParams.get('type') || 'compound';

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Top action bar (hidden on print) */}
      <div className="max-w-4xl mx-auto mb-8 print:hidden flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Interactive Calculators</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all shadow-md"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print or Save as PDF</span>
          </button>

          <Link
            href="/#booking-section"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Fiduciary Review ($150)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Printable Financial Diagnostic Memo Document */}
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Memo Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-800 print:border-slate-300 gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 print:border-slate-400 print:text-slate-800">
                CONFIDENTIAL FIDUCIARY DIAGNOSTIC MEMO
              </span>
              <span className="text-xs text-slate-500 print:text-slate-600 font-mono">• Ref: FA-MVP-2026-V1</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white print:text-black tracking-tight">
              Aura Wealth Quantitative Financial Plan
            </h1>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
              Prepared for: <strong className="text-slate-200 print:text-black">{name}</strong> ({email}) • Date: {currentDate}
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 print:border-slate-300 sm:pl-6">
            <span className="text-xs font-bold text-white print:text-black block">Demola Adepo, CFP®</span>
            <span className="text-[11px] text-emerald-400 print:text-slate-700 block">Senior Quantitative Wealth Advisor</span>
            <span className="text-[10px] text-slate-500 print:text-slate-500 block font-mono">Fiduciary Standard Certified</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-6">
          <section>
            <h2 className="text-sm font-bold text-emerald-400 print:text-black uppercase tracking-wider font-mono mb-2">
              1. Executive Diagnostic Summary
            </h2>
            <div className="p-4 rounded-2xl bg-slate-950/70 print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs text-slate-300 print:text-slate-700 leading-relaxed">
              <p>
                Based on your client-side quantitative simulation, this diagnostic assessment summarizes key wealth accumulation velocities, sequence-of-returns mitigations, and asset location tax alpha. Your financial trajectory demonstrates substantial compounding capacity when insulated against high advisor AUM fees and unnecessary tax drag.
              </p>
            </div>
          </section>

          {/* Quantitative Metrics Highlight */}
          <section>
            <h2 className="text-sm font-bold text-emerald-400 print:text-black uppercase tracking-wider font-mono mb-2">
              2. Quantitative Projections & Benchmark Thresholds
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="text-[10px] uppercase font-mono text-slate-500 print:text-slate-600 block">Focus Module</span>
                <span className="text-base font-bold text-white print:text-black mt-1 block">
                  {type === 'compound'
                    ? 'Compound Wealth Growth'
                    : type === 'fire'
                    ? 'FIRE Runway & SWR'
                    : 'Tax-Drag Mitigation'}
                </span>
                <span className="text-[10px] text-emerald-400 print:text-emerald-700 font-mono">Formula Verified</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="text-[10px] uppercase font-mono text-slate-500 print:text-slate-600 block">Safe SWR Corridor</span>
                <span className="text-base font-bold text-amber-400 print:text-amber-700 mt-1 block">
                  3.5% – 4.0%
                </span>
                <span className="text-[10px] text-slate-400 print:text-slate-600 font-mono">Trinity Study Standard</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="text-[10px] uppercase font-mono text-slate-500 print:text-slate-600 block">Automated Drift Buffer</span>
                <span className="text-base font-bold text-emerald-400 print:text-emerald-700 mt-1 block">
                  ±5.0% Band
                </span>
                <span className="text-[10px] text-slate-400 print:text-slate-600 font-mono">Quarterly Rebalancing</span>
              </div>
            </div>
          </section>

          {/* Fiduciary Recommendations */}
          <section>
            <h2 className="text-sm font-bold text-emerald-400 print:text-black uppercase tracking-wider font-mono mb-2">
              3. Fiduciary Strategic Recommendations
            </h2>
            <div className="space-y-3 text-xs text-slate-300 print:text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white print:text-black">Eliminate AUM Fee Friction:</strong> Avoid traditional advisory wealth skims (1.0%–1.5% AUM fees). Over a 25-year compounding period, a 1% fee skims over 28% of your total ending portfolio value.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white print:text-black">Implement Algorithmic Asset Location:</strong> Shelter dividend-generating fixed income (e.g. BND, TIP) inside tax-advantaged retirement accounts (Traditional/Roth IRA) while holding passive low-turnover equity index ETFs (VTI, VXUS) in taxable accounts.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white print:text-black">Enforce Systematic Rebalancing:</strong> Maintain target risk parameters through threshold rebalancing rather than emotional market timing.
                </div>
              </div>
            </div>
          </section>

          {/* Next Steps: 30-Min Strategy Call Invitation */}
          <section className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-amber-950/30 print:bg-slate-100 border border-emerald-500/30 print:border-slate-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 print:text-amber-800 font-bold block">
                  STEP 3: FIDUCIARY INTAKE COMMITMENT
                </span>
                <h3 className="text-base font-bold text-white print:text-black mt-0.5">
                  Schedule Your 30-Minute Advisory Review ($150)
                </h3>
                <p className="text-xs text-slate-300 print:text-slate-700 mt-1 max-w-xl">
                  Review this diagnostic with Demola Adepo, CFP®. 1-on-1 private video strategy review. Pre-authorized credit card handshake guarantees zero spam and immediate slot commitment.
                </p>
              </div>

              <Link
                href="/#booking-section"
                className="shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 print:hidden"
              >
                <span>Book $150 Slot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* Regulatory Notice Footer */}
          <div className="pt-6 border-t border-slate-800 print:border-slate-300 text-[10px] text-slate-400 print:text-slate-600 space-y-1">
            <p>
              <strong>SEC Educational Notice:</strong> This diagnostic plan is prepared for informational and educational purposes under Section 202(a)(11)(D) of the Investment Advisers Act of 1940. Mathematical projections do not guarantee future performance.
            </p>
            <p>
              Aura Wealth Advisory • 100 Wall Street, New York, NY 10005 • support@aurawealth.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DiagnosticPlanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Compiling Diagnostic Report...</div>}>
      <DiagnosticContent />
    </Suspense>
  );
}
