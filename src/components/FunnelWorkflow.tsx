'use client';

import React, { useState } from 'react';
import { Calculator, Download, CreditCard, Layers, ArrowRight, CheckCircle2, Shield, Zap } from 'lucide-react';

export default function FunnelWorkflow() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 1,
      number: '01',
      title: 'Free Calculators',
      subtitle: 'Client-Side Lead Engine',
      badge: 'Zero Friction',
      icon: Calculator,
      color: 'emerald',
      description: 'Prospects explore interactive Compound Wealth, FIRE Runway, and Tax-Drag visualizers with dynamic sliders and SVG asset curves.',
      metric: '3 Real-time Calculators',
      actionPrompt: 'Jump to Calculators',
      actionHref: '#calculators-section',
    },
    {
      id: 2,
      number: '02',
      title: 'Lead Capture & Memo',
      subtitle: 'Exportable PDF Diagnostics',
      badge: 'Email Gate',
      icon: Download,
      color: 'teal',
      description: 'Qualified users unlock their personalized Financial Diagnostic Plan Memo (printable PDF) with custom gap analysis and risk score.',
      metric: 'Custom PDF Summary',
      actionPrompt: 'View Sample Plan',
      actionHref: '#calculators-section',
    },
    {
      id: 3,
      number: '03',
      title: 'Paid Consultation',
      subtitle: 'Stripe Checkout ($150)',
      badge: 'Monetized Intake',
      icon: CreditCard,
      color: 'amber',
      description: 'Pre-authorized 1-on-1 intake prevents no-shows. Server cryptographically signs a single-use booking token releasing Cal.com slot.',
      metric: '$150 Fixed Intake',
      actionPrompt: 'Schedule Intake',
      actionHref: '#booking-section',
    },
    {
      id: 4,
      number: '04',
      title: 'SaaS Model Portfolios',
      subtitle: 'Recurring Member Tier',
      badge: '$49 – $149 / mo',
      icon: Layers,
      color: 'emerald',
      description: 'Ongoing subscription granting live ticker weightings, quarterly rebalancing emails, and automated ±5% drift threshold alerts.',
      metric: '3 Curated Portfolios',
      actionPrompt: 'Explore Member Portal',
      actionHref: '/portal',
    },
  ];

  return (
    <section id="funnel-section" className="py-20 bg-slate-950/70 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>SECTION 2: END-TO-END CLIENT FUNNEL ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            From Free Lead Generation to Recurring SaaS
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            How our four-stage automated pipeline converts passive search traffic into high-intent fiduciary consultations and long-term portfolio subscribers.
          </p>
        </div>

        {/* Funnel Diagram Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 -translate-y-1'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {/* Step Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-slate-600">
                      {step.number}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        step.color === 'amber'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : step.color === 'teal'
                          ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {step.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center mb-4">
                    <Icon
                      className={`w-6 h-6 ${
                        step.color === 'amber'
                          ? 'text-amber-400'
                          : step.color === 'teal'
                          ? 'text-teal-400'
                          : 'text-emerald-400'
                      }`}
                    />
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">{step.title}</h3>
                  <p className="text-xs font-mono text-emerald-400/90 mt-0.5">{step.subtitle}</p>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Step Footer Metric & CTA */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">{step.metric}</span>
                  <a
                    href={step.actionHref}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 group"
                  >
                    <span>{step.actionPrompt}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Specification Matrix Sub-strip */}
        <div className="mt-12 p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Fullstack Architecture Matrix Verified</p>
                <p className="text-xs text-slate-400">
                  Calculators (Zustand/Local) → Stripe Webhook Token Gateway → Private Cal.com Booking → Supabase Auth RLS Portfolios
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Next.js 14 App Router</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>HMAC Signed Booking Tokens</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
