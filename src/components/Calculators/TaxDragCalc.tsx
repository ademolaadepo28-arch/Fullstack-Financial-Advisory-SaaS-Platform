'use client';

import React, { useState, useMemo } from 'react';
import { calculateTaxDrag, formatCurrency, formatPercent } from '@/lib/calculations';
import { ShieldCheck, Receipt, DollarSign, Download, ArrowRight, Zap, Scale, TrendingDown } from 'lucide-react';

interface TaxDragCalcProps {
  onUnlockDiagnostic: (summaryData: any) => void;
  onOpenBooking: () => void;
}

export default function TaxDragCalc({ onUnlockDiagnostic, onOpenBooking }: TaxDragCalcProps) {
  const [initialPrincipal, setInitialPrincipal] = useState<number>(50000);
  const [annualContribution, setAnnualContribution] = useState<number>(15000);
  const [years, setYears] = useState<number>(20);
  const [nominalReturn, setNominalReturn] = useState<number>(8.5);
  const [marginalTaxRate, setMarginalTaxRate] = useState<number>(32); // 24% - 37%
  const [capGainsTaxRate, setCapGainsTaxRate] = useState<number>(15);
  const [dividendYield, setDividendYield] = useState<number>(2.0);
  const [annualTurnover, setAnnualTurnover] = useState<number>(25);

  const result = useMemo(() => {
    return calculateTaxDrag(
      initialPrincipal,
      annualContribution,
      years,
      nominalReturn,
      marginalTaxRate,
      capGainsTaxRate,
      dividendYield,
      annualTurnover
    );
  }, [
    initialPrincipal,
    annualContribution,
    years,
    nominalReturn,
    marginalTaxRate,
    capGainsTaxRate,
    dividendYield,
    annualTurnover,
  ]);

  const maxVal = Math.max(result.taxShieldedTotal * 1.1, 1);
  const chartWidth = 600;
  const chartHeight = 250;
  const padding = { top: 20, right: 20, bottom: 30, left: 25 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const shieldedPoints = result.timeline.map((point, i) => {
    const x = padding.left + (i / (result.timeline.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - (point.taxShielded / maxVal) * innerHeight;
    return `${x},${y}`;
  });

  const taxablePoints = result.timeline.map((point, i) => {
    const x = padding.left + (i / (result.timeline.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - (point.taxable / maxVal) * innerHeight;
    return `${x},${y}`;
  });

  const shieldedArea = `M ${padding.left},${padding.top + innerHeight} L ${shieldedPoints.join(' L ')} L ${padding.left + innerWidth},${padding.top + innerHeight} Z`;
  const taxableArea = `M ${padding.left},${padding.top + innerHeight} L ${taxablePoints.join(' L ')} L ${padding.left + innerWidth},${padding.top + innerHeight} Z`;

  const handleExportClick = () => {
    onUnlockDiagnostic({
      type: 'tax',
      title: 'Tax-Drag & Asset Location Alpha Diagnostic',
      initialPrincipal,
      annualContribution,
      years,
      marginalTaxRate,
      capGainsTaxRate,
      taxShieldedTotal: result.taxShieldedTotal,
      taxableTotal: result.taxableTotal,
      taxDragDollars: result.taxDragDollars,
      advisoryAlphaValue: result.advisoryAlphaValue,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Sliders */}
      <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>Taxation & Asset Location Inputs</span>
          </h3>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Advisory Alpha
          </span>
        </div>

        {/* Initial Principal & Annual Contribution */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300">Initial Capital</span>
              <span className="font-mono text-emerald-400 font-bold">{formatCurrency(initialPrincipal)}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={500000}
              step={10000}
              value={initialPrincipal}
              onChange={(e) => setInitialPrincipal(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300">Annual Deposit</span>
              <span className="font-mono text-emerald-400 font-bold">{formatCurrency(annualContribution)}/yr</span>
            </div>
            <input
              type="range"
              min={2000}
              max={69000} // IRS 401k + IRA limits
              step={1000}
              value={annualContribution}
              onChange={(e) => setAnnualContribution(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Investment Timeframe */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Investment Horizon</span>
            <span className="font-mono text-emerald-400 font-bold">{years} Years</span>
          </div>
          <input
            type="range"
            min={5}
            max={35}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Marginal Tax Bracket */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Federal & State Marginal Tax Rate</span>
            <span className="font-mono text-amber-400 font-bold">{marginalTaxRate}%</span>
          </div>
          <input
            type="range"
            min={12}
            max={45}
            step={1}
            value={marginalTaxRate}
            onChange={(e) => setMarginalTaxRate(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>12%</span>
            <span>24% (Middle)</span>
            <span>37%+ (High Earner)</span>
          </div>
        </div>

        {/* Capital Gains & Turnover */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-400 text-[11px]">Cap Gains Tax</span>
              <span className="font-mono text-slate-200 text-xs font-bold">{capGainsTaxRate}%</span>
            </div>
            <select
              value={capGainsTaxRate}
              onChange={(e) => setCapGainsTaxRate(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-lg p-2 font-mono"
            >
              <option value={15}>15% (Federal Standard)</option>
              <option value={20}>20% (High Income)</option>
              <option value={23.8}>23.8% (Net Inv Tax)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-400 text-[11px]">Annual Turnover</span>
              <span className="font-mono text-slate-200 text-xs font-bold">{annualTurnover}%</span>
            </div>
            <select
              value={annualTurnover}
              onChange={(e) => setAnnualTurnover(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-lg p-2 font-mono"
            >
              <option value={10}>10% (Index Passive)</option>
              <option value={25}>25% (Semi-Active)</option>
              <option value={50}>50% (Active Stock/Crypto)</option>
            </select>
          </div>
        </div>

        {/* CTA to Export Plan */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={handleExportClick}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Tax Drag Assessment (PDF)</span>
          </button>
        </div>
      </div>

      {/* Right Column: Visualization & Tax Loss Quantification */}
      <div className="lg:col-span-7 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-900/90 rounded-xl p-4 border border-emerald-500/30 shadow-md shadow-emerald-500/5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Tax-Shielded Account</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
              {formatCurrency(result.taxShieldedTotal)}
            </span>
            <span className="text-[10px] text-emerald-500/80 font-mono">IRA / 401(k) / Roth</span>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Taxable Brokerage</span>
            <span className="text-xl font-bold font-mono text-slate-300 mt-1 block">
              {formatCurrency(result.taxableTotal)}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Standard Brokerage</span>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-4 border border-rose-500/30 shadow-md shadow-rose-500/5 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-rose-300 block">Tax-Drag Destroyed</span>
            <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">
              -{formatCurrency(result.taxDragDollars)}
            </span>
            <span className="text-[10px] text-rose-400/80 font-mono">
              {result.dragPercentage}% Wealth Lost to Taxes
            </span>
          </div>
        </div>

        {/* Comparative SVG Line Chart */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Tax-Drag Divergence Trajectory</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Visualizing cumulative friction over {years} years of compounded tax drag.
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                Tax-Shielded
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block" />
                Taxable
              </span>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
              <defs>
                <linearGradient id="shieldedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="taxableGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64748B" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#64748B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.33, 0.66, 1].map((pct) => {
                const y = padding.top + innerHeight * (1 - pct);
                return (
                  <line
                    key={pct}
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + innerWidth}
                    y2={y}
                    stroke="#1E293B"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                );
              })}

              <path d={shieldedArea} fill="url(#shieldedGrad)" />
              <path d={taxableArea} fill="url(#taxableGrad)" />

              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                points={shieldedPoints.join(' ')}
              />

              <polyline
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="4 3"
                points={taxablePoints.join(' ')}
              />
            </svg>
          </div>

          {/* Quantified Advisory Asset Location Value Box */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-teal-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Quantified Advisory Allocation Value:
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    +{formatCurrency(result.advisoryAlphaValue)}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  By implementing active <strong>Asset Location</strong> (placing dividend & bond assets into tax-sheltered accounts while holding growth equities in taxable brokerage) and algorithmic <strong>Tax-Loss Harvesting</strong>, our advisory frameworks save an estimated <strong className="text-emerald-400 font-semibold">{formatCurrency(result.advisoryAlphaValue)}</strong> over {years} years.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
            >
              <span>Schedule Strategy Review ($150)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
