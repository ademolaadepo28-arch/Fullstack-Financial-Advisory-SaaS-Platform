'use client';

import React from 'react';
import Link from 'next/link';
import { PRICING_TIERS } from '@/data/portfoliosData';
import { Check, ShieldCheck, Sparkles, ArrowRight, Zap, Lock } from 'lucide-react';

interface PricingTableProps {
  onOpenBooking: () => void;
  onOpenCompliance: () => void;
}

export default function PricingTable({ onOpenBooking, onOpenCompliance }: PricingTableProps) {
  return (
    <section id="pricing-section" className="py-20 bg-slate-950/80 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>SECTION 6: DATA SCHEMA & RECURRING BILLING MODELS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transparent Pricing. Zero Asset Under Management (AUM) Skims.
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Traditional advisors charge 1.00% to 1.50% AUM fees every year, bleeding tens of thousands from compounding. Aura Wealth charges flat, transparent fees with no product kickbacks.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {PRICING_TIERS.map((tier) => {
            const isPopular = tier.popular;

            return (
              <div
                key={tier.name}
                className={`rounded-3xl p-8 transition-all duration-300 relative flex flex-col justify-between border ${
                  isPopular
                    ? 'bg-slate-900 border-emerald-500 shadow-2xl shadow-emerald-500/15 md:-translate-y-2'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[11px] font-mono font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg">
                    {tier.badge}
                  </div>
                )}

                <div>
                  {/* Top Tier Info */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      {tier.tagline}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {tier.complianceLevel}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">{tier.name}</h3>

                  {/* Price */}
                  <div className="mt-4 mb-6 flex items-baseline gap-1.5">
                    <span className="text-4xl font-black font-mono text-white">{tier.price}</span>
                    <span className="text-xs font-mono text-slate-400">{tier.billingPeriod}</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    {tier.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-8 pt-6 border-t border-slate-800/80">
                  {tier.name === 'Consultation Only' ? (
                    <button
                      onClick={onOpenBooking}
                      className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 hover:border-amber-500/40 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>{tier.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : tier.buttonVariant === 'primary' ? (
                    <Link
                      href={tier.ctaLink}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>{tier.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href={tier.ctaLink}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>{tier.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Regulatory Strip */}
        <div className="mt-14 max-w-4xl mx-auto p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-white font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Security, Fiduciary & Regulatory Guardrails (Specification Verification)</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            All SaaS portfolio feeds strictly operate under publisher/educational non-discretionary standards. Webhook handlers verify active Stripe customer ID status via JWT authentication middleware prior to granting access to encrypted portfolio endpoints.
          </p>
        </div>
      </div>
    </section>
  );
}
