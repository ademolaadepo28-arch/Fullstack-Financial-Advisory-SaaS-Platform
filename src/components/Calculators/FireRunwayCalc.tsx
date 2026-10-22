'use client';

import React, { useState, useMemo } from 'react';
import { calculateFireRunway, formatCurrency, formatPercent } from '@/lib/calculations';
import { Compass, Flame, ShieldCheck, Download, AlertCircle, ArrowRight, Clock, Target } from 'lucide-react';

interface FireRunwayCalcProps {
  onUnlockDiagnostic: (summaryData: any) => void;
  onOpenBooking: () => void;
}

export default function FireRunwayCalc({ onUnlockDiagnostic, onOpenBooking }: FireRunwayCalcProps) {
  const [currentAge, setCurrentAge] = useState<number>(33);
  const [targetRetirementAge, setTargetRetirementAge] = useState<number>(55);
  const [currentInvestments, setCurrentInvestments] = useState<number>(140000);
  const [annualExpenses, setAnnualExpenses] = useState<number>(75000);
  const [swr, setSwr] = useState<number>(3.8); // 3.5% - 4.0%
  const [expectedRoi, setExpectedRoi] = useState<number>(7.5);
  const [monthlySavings, setMonthlySavings] = useState<number>(2200);

  const result = useMemo(() => {
    return calculateFireRunway(
      currentAge,
      targetRetirementAge,
      currentInvestments,
      annualExpenses,
      swr,
      expectedRoi,
      monthlySavings
    );
  }, [currentAge, targetRetirementAge, currentInvestments, annualExpenses, swr, expectedRoi, monthlySavings]);

  const maxVal = Math.max(result.fireNumber * 1.25, ...result.timeline.map((t) => t.balance), 1);
  const chartWidth = 600;
  const chartHeight = 250;
  const padding = { top: 20, right: 20, bottom: 30, left: 25 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const points = result.timeline.map((point, i) => {
    const x = padding.left + (i / (result.timeline.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - (point.balance / maxVal) * innerHeight;
    return `${x},${y}`;
  });

  const fireLineY = padding.top + innerHeight - (result.fireNumber / maxVal) * innerHeight;
  const areaD = `M ${padding.left},${padding.top + innerHeight} L ${points.join(' L ')} L ${padding.left + innerWidth},${padding.top + innerHeight} Z`;

  const handleExportClick = () => {
    onUnlockDiagnostic({
      type: 'fire',
      title: 'Retirement & FIRE Runway Diagnostic',
      currentAge,
      targetRetirementAge,
      currentInvestments,
      annualExpenses,
      swr,
      fireNumber: result.fireNumber,
      projectedNestEgg: result.projectedNestEgg,
      currentGap: result.currentGap,
      monthlyRequiredSavings: result.monthlyRequiredSavings,
      runwayYears: result.runwayYears,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Sliders */}
      <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>FIRE & Runway Inputs</span>
          </h3>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Dynamic SWR Engine
          </span>
        </div>

        {/* Age Sliders */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300">Current Age</span>
              <span className="font-mono text-emerald-400 font-bold">{currentAge} yrs</span>
            </div>
            <input
              type="range"
              min={20}
              max={65}
              step={1}
              value={currentAge}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCurrentAge(val);
                if (val >= targetRetirementAge) setTargetRetirementAge(val + 5);
              }}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300">Target FIRE Age</span>
              <span className="font-mono text-amber-400 font-bold">{targetRetirementAge} yrs</span>
            </div>
            <input
              type="range"
              min={Math.max(currentAge + 1, 35)}
              max={75}
              step={1}
              value={targetRetirementAge}
              onChange={(e) => setTargetRetirementAge(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Annual Retirement Expenses */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Annual Living Expenses (Target)</span>
            <span className="font-mono text-emerald-400 font-bold">{formatCurrency(annualExpenses)} / yr</span>
          </div>
          <input
            type="range"
            min={30000}
            max={250000}
            step={2500}
            value={annualExpenses}
            onChange={(e) => setAnnualExpenses(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>$30k</span>
            <span>$125k</span>
            <span>$250k/yr</span>
          </div>
        </div>

        {/* Dynamic Safe Withdrawal Rate (SWR) */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-200 font-medium flex items-center gap-1.5">
              <span>Safe Withdrawal Rate (SWR)</span>
            </span>
            <span className="font-mono text-amber-400 font-bold">{formatPercent(swr)}</span>
          </div>
          <input
            type="range"
            min={3.2}
            max={4.5}
            step={0.1}
            value={swr}
            onChange={(e) => setSwr(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>3.5% (High Durability / Early FIRE)</span>
            <span>4.0% (Trinity Standard)</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 leading-tight">
            * Lower SWR (3.5%–3.8%) provides asymmetric protection against sequence-of-returns risk for early retirements exceeding 30 years.
          </p>
        </div>

        {/* Current Net Invested Assets */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Current Invested Capital</span>
            <span className="font-mono text-emerald-400 font-bold">{formatCurrency(currentInvestments)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1000000}
            step={10000}
            value={currentInvestments}
            onChange={(e) => setCurrentInvestments(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Monthly Ongoing Savings */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Monthly Savings Capacity</span>
            <span className="font-mono text-emerald-400 font-bold">{formatCurrency(monthlySavings)} / mo</span>
          </div>
          <input
            type="range"
            min={0}
            max={10000}
            step={100}
            value={monthlySavings}
            onChange={(e) => setMonthlySavings(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={handleExportClick}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate FIRE Diagnostic Memo (PDF)</span>
          </button>
        </div>
      </div>

      {/* Right Column: Visualization & Status */}
      <div className="lg:col-span-7 space-y-6">
        {/* Core KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-900/90 rounded-xl p-4 border border-amber-500/30 shadow-md shadow-amber-500/5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Required Nest Egg</span>
            <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
              {formatCurrency(result.fireNumber)}
            </span>
            <span className="text-[10px] text-amber-500/80 font-mono">FIRE Target Number</span>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-4 border border-emerald-500/30">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Projected at Age {targetRetirementAge}</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
              {formatCurrency(result.projectedNestEgg)}
            </span>
            <span className="text-[10px] text-emerald-500/80 font-mono">
              {result.isFireReady ? 'Target Met!' : 'Projected Balance'}
            </span>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Current Savings Gap</span>
            <span className={`text-xl font-bold font-mono mt-1 block ${result.currentGap > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {result.currentGap > 0 ? `-${formatCurrency(result.currentGap)}` : 'Fully Funded'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {result.currentGap > 0 ? `Need ${formatCurrency(result.monthlyRequiredSavings)}/mo` : 'Surplus Achieved'}
            </span>
          </div>
        </div>

        {/* FIRE Runway Projection SVG */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Nest Egg Runway & Trajectory</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Runway from age {currentAge} to target retirement age {targetRetirementAge} ({result.yearsRemaining} years remaining).
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                Projected Balance
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-0.5 bg-amber-400 inline-block border-b border-dashed" />
                FIRE Nest Egg ({formatCurrency(result.fireNumber)})
              </span>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
              <defs>
                <linearGradient id="fireGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
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

              {/* Area Under Curve */}
              <path d={areaD} fill="url(#fireGrad)" />

              {/* Curve */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                points={points.join(' ')}
              />

              {/* FIRE Target Horizontal Line */}
              <line
                x1={padding.left}
                y1={fireLineY}
                x2={padding.left + innerWidth}
                y2={fireLineY}
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="6 4"
              />

              <text
                x={padding.left + innerWidth - 110}
                y={fireLineY - 6}
                fill="#F59E0B"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                FIRE TARGET: {formatCurrency(result.fireNumber)}
              </text>
            </svg>
          </div>

          {/* Runway Diagnostics Indicator */}
          <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                result.isFireReady ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {result.isFireReady ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {result.isFireReady ? 'On Track for Financial Independence' : 'Capital Acceleration Opportunity'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {result.isFireReady
                    ? `You are projected to exceed your nest egg by age ${targetRetirementAge} with a ${formatCurrency(result.projectedNestEgg - result.fireNumber)} cushion.`
                    : `To bridge the ${formatCurrency(result.currentGap)} gap by age ${targetRetirementAge}, increase monthly savings to ${formatCurrency(result.monthlyRequiredSavings)}/mo or optimize asset allocation.`}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="shrink-0 px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 flex items-center gap-1.5 transition-all"
            >
              <span>Consult Fiduciary ($150)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
