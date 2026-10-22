'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, TrendingUp, Calendar, Lock, BarChart3, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenCompliance?: () => void;
  onOpenBooking?: () => void;
}

export default function Navbar({ onOpenCompliance, onOpenBooking }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0B0F19]/85 border-b border-slate-800/80 transition-all">
      {/* Top Advisory Ticker Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-b border-emerald-500/20 py-1.5 px-4 text-xs font-mono text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              MARKET RADAR:
            </span>
            <span className="text-slate-300">S&P 500: <span className="text-emerald-400 font-medium">5,842.10 (+0.42%)</span></span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">10-Yr Treasury: <span className="text-amber-400 font-medium">4.24%</span></span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Target SWR Band: <span className="text-emerald-400 font-medium">3.5% – 4.0%</span></span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 hidden sm:inline">Q4 Rebalancing Drift Check: <span className="text-emerald-400">Neutral (±1.4%)</span></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCompliance}
              className="text-slate-400 hover:text-emerald-400 text-xs flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>SEC Rule 202(a)(11)(D) Disclosures</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/35 transition-all">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                AURA<span className="text-emerald-400 font-light">WEALTH</span>
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-emerald-500/30">
                CFP® ADVISORY
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
              SaaS Engine & Model Portfolios
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="#calculators-section" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Interactive Calculators</span>
          </a>
          <a href="#funnel-section" className="hover:text-emerald-400 transition-colors">
            Funnel Architecture
          </a>
          <a href="#portfolios-section" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Model Portfolios</span>
          </a>
          <a href="#pricing-section" className="hover:text-emerald-400 transition-colors">
            Pricing & Tiers
          </a>
        </div>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/portal"
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Member Portal</span>
          </Link>

          <a
            href="#booking-section"
            onClick={onOpenBooking}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Consultation ($150)</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 py-4 space-y-3">
          <a
            href="#calculators-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-emerald-400 font-medium py-1.5"
          >
            Interactive Calculators
          </a>
          <a
            href="#funnel-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-emerald-400 font-medium py-1.5"
          >
            Funnel Architecture
          </a>
          <a
            href="#portfolios-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-emerald-400 font-medium py-1.5"
          >
            SaaS Model Portfolios
          </a>
          <a
            href="#pricing-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-emerald-400 font-medium py-1.5"
          >
            Pricing & Tiers
          </a>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-lg border border-slate-700"
            >
              Member Portal Login
            </Link>
            <a
              href="#booking-section"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-md"
            >
              Book 30-Min Consultation ($150)
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
