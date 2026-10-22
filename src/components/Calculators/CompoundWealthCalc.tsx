'use client';

import React, { useState, useMemo } from 'react';
import { calculateCompoundWealth, formatCurrency, formatPercent } from '@/lib/calculations';
import { TrendingUp, DollarSign, Calendar, Percent, ShieldAlert, Sparkles, Download, ArrowRight } from 'lucide-react';

interface CompoundWealthCalcProps {
  onUnlockDiagnostic: (summaryData: any) => void;
  onOpenBooking: () => void;
}

export default function CompoundWealthCalc({ onUnlockDiagnostic, onOpenBooking }: CompoundWealthCalcProps) {
  const [initialPrincipal, setInitialPrincipal] = useState<number>(25000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(1200);
  const [years, setYears] = useState<number>(25);
  const [cagr, setCagr] = useState<number>(8.5);
  const [frequency, setFrequency] = useState<'monthly' | 'annually'>('monthly');
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const result = useMemo(() => {
    return calculateCompoundWealth(
      initialPrincipal,
      monthlyDeposit,
      years,
      cagr,
      frequency,
      inflationRate
    );
  }, [initialPrincipal, monthlyDeposit, years, cagr, frequency, inflationRate]);

  // Find milestones
  const milestones = useMemo(() => {
    const targets = [100000, 250000, 500000, 1000000, 2000000];
    return targets
      .map((target) => {
        const found = result.timeline.find((t) => t.nominal >= target);
        return {
          target,
          reached: Boolean(found),
          year: found ? found.year : null,
        };
      })
      .filter((m) => m.target <= result.nominalTotal * 1.5);
  }, [result]);

  // Chart dimensions and SVG scaling
  const maxVal = Math.max(...result.timeline.map((t) => t.nominal), 1);
  const chartWidth = 600;
  const chartHeight = 260;
  const padding = { top: 20, right: 20, bottom: 30, left: 20 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Generate SVG points
  const nominalPoints = result.timeline.map((point, i) => {
    const x = padding.left + (i / (result.timeline.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - (point.nominal / maxVal) * innerHeight;
    return `${x},${y}`;
  });

  const contributionsPoints = result.timeline.map((point, i) => {
    const x = padding.left + (i / (result.timeline.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - (point.contributions / maxVal) * innerHeight;
    return `${x},${y}`;
  });

  const realPoints = result.timeline.map((point, i) => {
    const x = padding.left + (i / (result.timeline.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - (point.real / maxVal) * innerHeight;
    return `${x},${y}`;
  });

  const nominalAreaD = `M ${padding.left},${padding.top + innerHeight} L ${nominalPoints.join(' L ')} L ${padding.left + innerWidth},${padding.top + innerHeight} Z`;
  const contribAreaD = `M ${padding.left},${padding.top + innerHeight} L ${contributionsPoints.join(' L ')} L ${padding.left + innerWidth},${padding.top + innerHeight} Z`;

  const activePoint = hoveredYear !== null
    ? result.timeline.find((t) => t.year === hoveredYear) || result.timeline[result.timeline.length - 1]
    : result.timeline[result.timeline.length - 1];

  const handleExportClick = () => {
    onUnlockDiagnostic({
      type: 'compound',
      title: 'Compound Wealth Growth Forecast',
      initialPrincipal,
      monthlyDeposit,
      years,
      cagr,
      nominalTotal: result.nominalTotal,
      realTotal: result.realTotal,
      totalInterest: result.totalInterest,
      totalContributions: result.totalContributions,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Sliders and Inputs */}
      <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Growth Parameters</span>
          </h3>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Real-Time Evaluation
          </span>
        </div>

        {/* Initial Principal */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Starting Principal</span>
            <span className="font-mono text-emerald-400 font-bold">{formatCurrency(initialPrincipal)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={250000}
            step={2500}
            value={initialPrincipal}
            onChange={(e) => setInitialPrincipal(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>$0</span>
            <span>$100k</span>
            <span>$250k+</span>
          </div>
        </div>

        {/* Monthly Deposit */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Monthly Contribution</span>
            <span className="font-mono text-emerald-400 font-bold">{formatCurrency(monthlyDeposit)} / mo</span>
          </div>
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={monthlyDeposit}
            onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>$100</span>
            <span>$5,000</span>
            <span>$10,000/mo</span>
          </div>
        </div>

        {/* Investment Horizon */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Time Horizon</span>
            <span className="font-mono text-emerald-400 font-bold">{years} Years</span>
          </div>
          <input
            type="range"
            min={3}
            max={40}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>3 yrs</span>
            <span>20 yrs</span>
            <span>40 yrs</span>
          </div>
        </div>

        {/* Expected CAGR */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Expected Annual CAGR</span>
            <span className="font-mono text-amber-400 font-bold">{formatPercent(cagr)}</span>
          </div>
          <input
            type="range"
            min={3}
            max={14}
            step={0.5}
            value={cagr}
            onChange={(e) => setCagr(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>3.0% (Bond Heavy)</span>
            <span>8.5% (Balanced)</span>
            <span>14.0% (Aggressive)</span>
          </div>
        </div>

        {/* Inflation Adjustment & Compounding Frequency */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Inflation Drag</label>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-12 bg-transparent text-xs text-white font-mono focus:outline-none"
              />
              <span className="text-xs text-slate-400 font-mono">% / yr</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Compounding</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="w-full bg-slate-800/80 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none font-mono"
            >
              <option value="monthly">Monthly (12x/yr)</option>
              <option value="annually">Annually (1x/yr)</option>
            </select>
          </div>
        </div>

        {/* Lead Magnet CTA inside left pane */}
        <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
          <button
            onClick={handleExportClick}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Financial Diagnostic PDF Memo</span>
          </button>
        </div>
      </div>

      {/* Right Column: Visual SVG Curve & Asset Breakdown */}
      <div className="lg:col-span-7 space-y-6">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-emerald-500/30 shadow-md shadow-emerald-500/5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Nominal Balance</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-1 block">
              {formatCurrency(result.nominalTotal)}
            </span>
            <span className="text-[10px] text-emerald-500/80 font-mono">Future Dollar Value</span>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Total Invested</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-slate-200 mt-1 block">
              {formatCurrency(result.totalContributions)}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Your Capital</span>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Compound Interest</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-1 block">
              +{formatCurrency(result.totalInterest)}
            </span>
            <span className="text-[10px] text-amber-500/80 font-mono">Compound Growth</span>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Real Value (Inflation)</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-teal-300 mt-1 block">
              {formatCurrency(result.realTotal)}
            </span>
            <span className="text-[10px] text-teal-400/80 font-mono">Today's Purchasing Power</span>
          </div>
        </div>

        {/* Dynamic SVG Asset Curve */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 relative">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Asset Compounding Growth Curve</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Hover along timeline to inspect Year {activePoint.year} balance projections.
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                Nominal Portfolio
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block" />
                Principal
              </span>
              <span className="flex items-center gap-1 text-teal-400">
                <span className="w-2.5 h-0.5 bg-teal-400 inline-block border-b border-dashed" />
                Real (Inflation-Adj)
              </span>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto cursor-crosshair select-none"
              onMouseLeave={() => setHoveredYear(null)}
            >
              <defs>
                <linearGradient id="nominalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#475569" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#475569" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                const y = padding.top + innerHeight * (1 - pct);
                return (
                  <g key={pct}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + innerWidth}
                      y2={y}
                      stroke="#1E293B"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={padding.left + 5}
                      y={y - 4}
                      fill="#64748B"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {formatCurrency(maxVal * pct)}
                    </text>
                  </g>
                );
              })}

              {/* Area Fills */}
              <path d={nominalAreaD} fill="url(#nominalGrad)" />
              <path d={contribAreaD} fill="url(#contribGrad)" />

              {/* Lines */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                points={nominalPoints.join(' ')}
              />
              <polyline
                fill="none"
                stroke="#64748B"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                points={contributionsPoints.join(' ')}
              />
              <polyline
                fill="none"
                stroke="#2DD4BF"
                strokeWidth="2"
                strokeDasharray="5 4"
                points={realPoints.join(' ')}
              />

              {/* Interactive Hover Vertical Line and Circles */}
              {activePoint && (
                <g>
                  {(() => {
                    const idx = result.timeline.findIndex((t) => t.year === activePoint.year);
                    const x = padding.left + (idx / (result.timeline.length - 1)) * innerWidth;
                    const yNominal = padding.top + innerHeight - (activePoint.nominal / maxVal) * innerHeight;

                    return (
                      <>
                        <line
                          x1={x}
                          y1={padding.top}
                          x2={x}
                          y2={padding.top + innerHeight}
                          stroke="#10B981"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                        <circle cx={x} cy={yNominal} r="5" fill="#10B981" stroke="#0B0F19" strokeWidth="2" />
                      </>
                    );
                  })()}
                </g>
              )}

              {/* Invisible Overlay Rectangles for Year Hover Tracking */}
              {result.timeline.map((point, i) => {
                const widthPerStep = innerWidth / (result.timeline.length - 1);
                const x = padding.left + (i - 0.5) * widthPerStep;
                return (
                  <rect
                    key={point.year}
                    x={Math.max(padding.left, x)}
                    y={padding.top}
                    width={widthPerStep}
                    height={innerHeight}
                    fill="transparent"
                    onMouseEnter={() => setHoveredYear(point.year)}
                  />
                );
              })}
            </svg>
          </div>

          {/* Active Hover Inspection Bar */}
          <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400">Year {activePoint.year} Projection:</span>{' '}
              <span className="text-emerald-400 font-bold">{formatCurrency(activePoint.nominal)}</span>
            </div>
            <div>
              <span className="text-slate-400">Principal Contributed:</span>{' '}
              <span className="text-slate-200">{formatCurrency(activePoint.contributions)}</span>
            </div>
            <div>
              <span className="text-slate-400">Real Inflation Value:</span>{' '}
              <span className="text-teal-300 font-medium">{formatCurrency(activePoint.real)}</span>
            </div>
          </div>
        </div>

        {/* Milestones Road-to-Wealth strip */}
        <div className="bg-slate-900/70 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Capital Accumulation Milestones</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Compounding Velocity</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {milestones.map((m) => (
              <div
                key={m.target}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  m.reached
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <span className="text-xs font-bold text-white block font-mono">
                  {formatCurrency(m.target)}
                </span>
                <span className="text-[11px] font-mono mt-0.5 block">
                  {m.reached ? (
                    <span className="text-emerald-400 font-medium">Reachable Yr {m.year}</span>
                  ) : (
                    <span className="text-slate-500">&gt; {years} Years</span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Advisory Intake CTA Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Want a quantitative allocation roadmap tailored to your timeline?
            </p>
            <button
              onClick={onOpenBooking}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Book $150 Strategy Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
