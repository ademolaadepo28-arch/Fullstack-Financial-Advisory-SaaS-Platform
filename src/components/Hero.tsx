'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, Calendar, Shield, Sparkles, CheckCircle2, DollarSign, Activity } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenCompliance: () => void;
}

export default function Hero({ onOpenBooking, onOpenCompliance }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-800">
      {/* Background Decorative Gradients & Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/5 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Specification Top Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-300 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-400 font-semibold">ARCHITECTURE & ENGINEERING SPEC</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">FA-MVP-2026-V1</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 font-medium">MVP 4-Week Milestone</span>
          </div>
        </div>

        {/* Primary Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Modern Lead Engine, Interactive Calculators &{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              SaaS Model Portfolios
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            A minimalist, high-converting digital storefront combining transparent financial planning tools with an instant monetization funnel. Free calculators capture initial prospect interest and risk profiles, funneling qualified leads into a <strong className="text-emerald-400 font-semibold">$150 paid 30-minute consultation</strong> and recurring <strong className="text-white font-semibold">$49–$149/mo SaaS model portfolios</strong>.
          </p>

          {/* Action CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#calculators-section"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/45 transition-all flex items-center justify-center gap-2 group"
            >
              <Calculator className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>Launch Free Calculators Suite</span>
              <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 hover:border-emerald-500/40 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Paid 30-Min Consultation ($150)</span>
            </button>

            <Link
              href="/portal"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Portfolios</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </Link>
          </div>

          {/* Trust Markers Bar */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">Fiduciary Standard</p>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Zero product commissions or hidden AUM kickbacks.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">$150 Stripe Intake</p>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">High-intent pre-authorized slot commitment.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <Activity className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">±5% Drift Alerts</p>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Automated rebalancing triggers on 3 model tiers.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">SEC Educational Safe Harbor</p>
                <button
                  onClick={onOpenCompliance}
                  className="text-[11px] text-emerald-400 hover:underline leading-tight mt-0.5 block text-left"
                >
                  Rule 202(a)(11)(D) publisher compliance.
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
