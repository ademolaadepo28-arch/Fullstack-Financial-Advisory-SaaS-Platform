'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FunnelWorkflow from '@/components/FunnelWorkflow';
import CalculatorContainer from '@/components/Calculators/CalculatorContainer';
import IntakeQuestionnaire from '@/components/Booking/IntakeQuestionnaire';
import PortfolioExplorer from '@/components/Portfolios/PortfolioExplorer';
import PricingTable from '@/components/PricingTable';
import ComplianceModal from '@/components/ComplianceModal';
import Footer from '@/components/Footer';
import { Layers, Sparkles, ArrowRight, ShieldCheck, TrendingUp, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [complianceOpen, setComplianceOpen] = useState(false);

  const scrollToBooking = () => {
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-white selection:bg-emerald-500 selection:text-slate-950 font-sans flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onOpenCompliance={() => setComplianceOpen(true)}
        onOpenBooking={scrollToBooking}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenBooking={scrollToBooking}
          onOpenCompliance={() => setComplianceOpen(true)}
        />

        {/* Section 2: End-to-End Client Funnel Architecture */}
        <FunnelWorkflow />

        {/* Section 1: Interactive Client Calculators Suite */}
        <CalculatorContainer
          onOpenBooking={scrollToBooking}
        />

        {/* Section 4: Paid 30-Minute Consultation & Calendar Integration ($150) */}
        <IntakeQuestionnaire />

        {/* Section 5: Model Portfolios Architecture Showcase */}
        <section id="portfolios-section" className="py-20 bg-[#090D16] border-b border-slate-800 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SECTION 5: POST-CONSULTATION SAAS MODEL PORTFOLIO ARCHITECTURE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Institutional Model Portfolios
              </h2>
              <p className="mt-3 text-slate-400 text-sm sm:text-base">
                Curated asset allocations with live ticker weightings, quarterly rebalances, and automated drift triggers (±5%).
              </p>
            </div>

            {/* Interactive Model Portfolios Explorer */}
            <PortfolioExplorer />

            {/* Transition CTA to Member Portal */}
            <div className="mt-12 text-center">
              <Link
                href="/portal"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 transition-all"
              >
                <span>Launch Rebalance Simulator in Member Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 6: Data Schema & Recurring Billing Models */}
        <PricingTable
          onOpenBooking={scrollToBooking}
          onOpenCompliance={() => setComplianceOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenCompliance={() => setComplianceOpen(true)}
        onOpenBooking={scrollToBooking}
      />

      {/* Compliance Disclaimer Modal */}
      <ComplianceModal
        isOpen={complianceOpen}
        onClose={() => setComplianceOpen(false)}
      />
    </div>
  );
}
