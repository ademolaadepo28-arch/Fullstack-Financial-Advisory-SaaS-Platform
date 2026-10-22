'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ShieldCheck, Scale, Lock, Heart } from 'lucide-react';

interface FooterProps {
  onOpenCompliance?: () => void;
  onOpenBooking?: () => void;
}

export default function Footer({ onOpenCompliance, onOpenBooking }: FooterProps) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-500/20">
                <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                AURA<span className="text-emerald-400 font-light">WEALTH</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Fullstack Financial Advisory & SaaS Platform. Modern lead engine, client-side interactive calculators, paid 30-minute fiduciary intake, and recurring model portfolio subscription feeds.
            </p>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
              <span>Stack: Next.js 14 / TypeScript</span>
              <span>•</span>
              <span>Stripe + Cal.com API</span>
            </div>
          </div>

          {/* Calculators Col */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-3">
              Calculators
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#calculators-section" className="hover:text-emerald-400 transition-colors">
                  Compound Wealth Growth
                </a>
              </li>
              <li>
                <a href="#calculators-section" className="hover:text-emerald-400 transition-colors">
                  Retirement / FIRE Runway
                </a>
              </li>
              <li>
                <a href="#calculators-section" className="hover:text-emerald-400 transition-colors">
                  Tax-Shielded vs. Taxable
                </a>
              </li>
              <li>
                <a href="#calculators-section" className="hover:text-emerald-400 transition-colors">
                  Exportable PDF Diagnostics
                </a>
              </li>
            </ul>
          </div>

          {/* Model Portfolios Col */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-3">
              Model Portfolios
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/portal?tier=conservative" className="hover:text-emerald-400 transition-colors">
                  Conservative Yield (30/70)
                </Link>
              </li>
              <li>
                <Link href="/portal?tier=balanced" className="hover:text-emerald-400 transition-colors">
                  Balanced Growth (60/40)
                </Link>
              </li>
              <li>
                <Link href="/portal?tier=aggressive" className="hover:text-emerald-400 transition-colors">
                  Aggressive Thematic (85/15)
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-emerald-400 transition-colors">
                  Rebalance & Drift Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Fiduciary Col */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-3">
              Governance & Fiduciary
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenCompliance} className="hover:text-emerald-400 text-left transition-colors">
                  SEC Rule 202(a)(11)(D) Disclosures
                </button>
              </li>
              <li>
                <button onClick={onOpenCompliance} className="hover:text-emerald-400 text-left transition-colors">
                  FINRA Rule 2210 Backtest Notice
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} className="hover:text-emerald-400 text-left transition-colors">
                  $150 Strategy Consultation Intake
                </button>
              </li>
              <li>
                <a href="#pricing-section" className="hover:text-emerald-400 transition-colors">
                  Flat Pricing vs AUM Skims
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-8 border-t border-slate-900 space-y-3 text-[11px] text-slate-300 leading-relaxed">
          <p>
            <strong>Regulatory & Fiduciary Disclosure:</strong> Aura Wealth operates strictly as an educational publisher and non-discretionary model portfolio service provider pursuant to Section 202(a)(11)(D) of the Investment Advisers Act of 1940. Neither Aura Wealth nor its quantitative algorithms execute discretionary securities transactions or take custody of subscriber assets. All portfolio models, CAGR estimates, and rebalance signals are provided for informational and educational purposes. Past performance is no guarantee of future results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-slate-900 text-slate-300 text-xs">
            <span>© 2026 Aura Wealth Advisory Platform. All rights reserved. Document Ref: FA-MVP-2026-V1.</span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Stripe 256-Bit • Supabase Auth • Next.js 14 App Router</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
