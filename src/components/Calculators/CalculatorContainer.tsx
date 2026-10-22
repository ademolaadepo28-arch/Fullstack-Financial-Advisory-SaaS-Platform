'use client';

import React, { useState } from 'react';
import CompoundWealthCalc from './CompoundWealthCalc';
import FireRunwayCalc from './FireRunwayCalc';
import TaxDragCalc from './TaxDragCalc';
import DiagnosticModal from './DiagnosticModal';
import { TrendingUp, Flame, Receipt, Shield, Sparkles } from 'lucide-react';

interface CalculatorContainerProps {
  onOpenBooking: () => void;
}

export default function CalculatorContainer({ onOpenBooking }: CalculatorContainerProps) {
  const [activeTab, setActiveTab] = useState<'compound' | 'fire' | 'tax'>('compound');
  const [modalOpen, setModalOpen] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);

  const handleUnlockDiagnostic = (data: any) => {
    setSummaryData(data);
    setModalOpen(true);
  };

  const tabs = [
    {
      id: 'compound' as const,
      label: 'Compound Wealth Growth',
      icon: TrendingUp,
      tag: 'Asset Curve',
      color: 'emerald',
    },
    {
      id: 'fire' as const,
      label: 'Retirement / FIRE Runway',
      icon: Flame,
      tag: 'Dynamic SWR (3.5%–4%)',
      color: 'amber',
    },
    {
      id: 'tax' as const,
      label: 'Tax-Shielded vs. Taxable',
      icon: Receipt,
      tag: 'Quantified Tax-Drag',
      color: 'teal',
    },
  ];

  return (
    <section id="calculators-section" className="py-20 border-b border-slate-800 relative bg-[#090D16]">
      {/* Subtle background ambient light */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SECTION 1: INTERACTIVE CLIENT CALCULATORS SUITE (CLIENT-SIDE LEAD ENGINE)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Institutional Quantitative Planning Tools
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Client-side real-time formula evaluation with dynamic SVG curves, inflation adjustments, and exportable financial diagnostic summaries.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto max-w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {tab.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Calculator View */}
        <div className="transition-all duration-300">
          {activeTab === 'compound' && (
            <CompoundWealthCalc
              onUnlockDiagnostic={handleUnlockDiagnostic}
              onOpenBooking={onOpenBooking}
            />
          )}

          {activeTab === 'fire' && (
            <FireRunwayCalc
              onUnlockDiagnostic={handleUnlockDiagnostic}
              onOpenBooking={onOpenBooking}
            />
          )}

          {activeTab === 'tax' && (
            <TaxDragCalc
              onUnlockDiagnostic={handleUnlockDiagnostic}
              onOpenBooking={onOpenBooking}
            />
          )}
        </div>
      </div>

      {/* Exportable PDF Lead Capture Modal */}
      <DiagnosticModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        summaryData={summaryData}
      />
    </section>
  );
}
