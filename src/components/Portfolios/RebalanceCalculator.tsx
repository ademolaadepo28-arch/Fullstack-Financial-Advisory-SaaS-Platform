'use client';

import React, { useState, useMemo } from 'react';
import { MODEL_PORTFOLIOS } from '@/data/portfoliosData';
import { formatCurrency, formatPercent } from '@/lib/calculations';
import { Sliders, RefreshCw, AlertTriangle, CheckCircle2, ArrowRightLeft, DollarSign, Copy, Check } from 'lucide-react';

export default function RebalanceCalculator() {
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [totalAccountValue, setTotalAccountValue] = useState<number>(100000);
  const [copied, setCopied] = useState(false);

  const portfolio = MODEL_PORTFOLIOS[selectedPortfolioId];

  // Initialize custom mock current weights with a simulated drift on the first holding
  const [currentWeights, setCurrentWeights] = useState<Record<string, number>>({
    VTI: 46, // drifted from 40%
    VXUS: 18,
    BND: 22, // drifted from 25%
    BNDX: 14,
  });

  // Calculate rebalance trades
  const tradeAnalysis = useMemo(() => {
    let hasAlert = false;

    const items = portfolio.allocations.map((alloc) => {
      const currentPct = currentWeights[alloc.ticker] ?? alloc.targetWeight;
      const targetPct = alloc.targetWeight;
      const driftPct = Number((currentPct - targetPct).toFixed(1));

      const isDriftExceeded = Math.abs(driftPct) >= 5.0;
      if (isDriftExceeded) hasAlert = true;

      const currentDollar = Math.round((currentPct / 100) * totalAccountValue);
      const targetDollar = Math.round((targetPct / 100) * totalAccountValue);
      const diffDollar = targetDollar - currentDollar; // positive = BUY, negative = SELL

      return {
        ticker: alloc.ticker,
        name: alloc.name,
        targetWeight: targetPct,
        currentWeight: currentPct,
        driftPct,
        isDriftExceeded,
        currentDollar,
        targetDollar,
        diffDollar,
        action: diffDollar > 0 ? ('BUY' as const) : diffDollar < 0 ? ('SELL' as const) : ('HOLD' as const),
      };
    });

    return { items, hasAlert };
  }, [portfolio, currentWeights, totalAccountValue]);

  const handleWeightChange = (ticker: string, newWeight: number) => {
    setCurrentWeights((prev) => ({
      ...prev,
      [ticker]: Math.max(0, Math.min(100, newWeight)),
    }));
  };

  const handleResetToTarget = () => {
    const fresh: Record<string, number> = {};
    portfolio.allocations.forEach((a) => {
      fresh[a.ticker] = a.targetWeight;
    });
    setCurrentWeights(fresh);
  };

  const handleSimulateDrift = () => {
    const drifted: Record<string, number> = {};
    portfolio.allocations.forEach((a, i) => {
      if (i === 0) drifted[a.ticker] = a.targetWeight + 6.5; // +6.5% drift trigger
      else if (i === 1) drifted[a.ticker] = a.targetWeight - 2.5;
      else if (i === 2) drifted[a.ticker] = a.targetWeight - 4.0;
      else drifted[a.ticker] = a.targetWeight;
    });
    setCurrentWeights(drifted);
  };

  const copyTradeOrders = () => {
    const text = tradeAnalysis.items
      .filter((item) => item.action !== 'HOLD')
      .map(
        (item) =>
          `${item.action} ${formatCurrency(Math.abs(item.diffDollar))} of ${item.ticker} (Current: ${item.currentWeight}%, Target: ${item.targetWeight}%)`
      )
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ALGORITHMIC DISCIPLINE ENGINE
            </span>
            <span className="text-xs text-slate-500 font-mono">• Drift Trigger: ±5.0%</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-400" />
            <span>Automated Drift & Rebalance Calculator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Calculate exact trade orders to realign your portfolio with target institutional weightings.
          </p>
        </div>

        {/* Portfolio Tier Selector & Account Value */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedPortfolioId}
            onChange={(e) => {
              const id = e.target.value as 'conservative' | 'balanced' | 'aggressive';
              setSelectedPortfolioId(id);
              const fresh: Record<string, number> = {};
              MODEL_PORTFOLIOS[id].allocations.forEach((a) => {
                fresh[a.ticker] = a.targetWeight;
              });
              setCurrentWeights(fresh);
            }}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-emerald-500"
          >
            <option value="conservative">Conservative Yield (30/70)</option>
            <option value="balanced">Balanced Growth (60/40)</option>
            <option value="aggressive">Aggressive Thematic (85/15)</option>
          </select>
        </div>
      </div>

      {/* Account Balance Input Strip */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono font-bold">
            $
          </div>
          <div>
            <label className="text-[11px] font-mono text-slate-400 block uppercase">
              Current Total Account Balance ($)
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-white font-mono">$</span>
              <input
                type="number"
                min={1000}
                step={5000}
                value={totalAccountValue}
                onChange={(e) => setTotalAccountValue(Number(e.target.value))}
                className="w-40 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-base text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateDrift}
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate +6.5% Drift</span>
          </button>
          <button
            onClick={handleResetToTarget}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
          >
            Reset to Target
          </button>
        </div>
      </div>

      {/* Drift Status Banner */}
      {tradeAnalysis.hasAlert ? (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-300 mb-6 flex items-start gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-white">
              Automated Drift Threshold Exceeded (±5% Trigger)
            </p>
            <p className="text-rose-200/90 mt-0.5 leading-relaxed">
              One or more holdings have deviated beyond your portfolio tolerance band. Execute the rebalance trade instructions below to lock in gains and prevent excessive drawdowns.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 mb-6 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-white">Portfolio Within Tolerance Bands</p>
            <p className="text-emerald-400/80">All ticker allocations are within ±5% of target weights. No mandatory rebalance required.</p>
          </div>
        </div>
      )}

      {/* Holdings & Drift Analysis Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 mb-6">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Ticker</th>
              <th className="py-3 px-4 text-center">Target Weight</th>
              <th className="py-3 px-4 text-center">Your Current Weight</th>
              <th className="py-3 px-4 text-center">Drift (%)</th>
              <th className="py-3 px-4 text-right">Target Value</th>
              <th className="py-3 px-4 text-right">Execution Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-sans">
            {tradeAnalysis.items.map((item) => (
              <tr key={item.ticker} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-white">
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mr-2">
                    {item.ticker}
                  </span>
                  <span className="font-sans font-normal text-slate-400 text-[11px] hidden sm:inline">
                    {item.name}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-300">
                  {item.targetWeight}%
                </td>

                <td className="py-3.5 px-4 text-center font-mono">
                  <div className="inline-flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={item.currentWeight}
                      onChange={(e) => handleWeightChange(item.ticker, Number(e.target.value))}
                      className="w-10 bg-transparent text-center font-mono font-bold text-white focus:outline-none"
                    />
                    <span className="text-slate-400 text-xs">%</span>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-center font-mono font-bold">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] ${
                      item.isDriftExceeded
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : item.driftPct !== 0
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {item.driftPct > 0 ? `+${item.driftPct}%` : `${item.driftPct}%`}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                  {formatCurrency(item.targetDollar)}
                </td>

                <td className="py-3.5 px-4 text-right font-mono font-bold">
                  {item.action === 'BUY' && (
                    <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      BUY +{formatCurrency(Math.abs(item.diffDollar))}
                    </span>
                  )}
                  {item.action === 'SELL' && (
                    <span className="text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/30">
                      SELL -{formatCurrency(Math.abs(item.diffDollar))}
                    </span>
                  )}
                  {item.action === 'HOLD' && (
                    <span className="text-slate-500 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                      BALANCED
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trade Orders Summary & Copy Button */}
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Generated Execution Order Sheet
          </span>
          <p className="text-xs text-white mt-0.5">
            Log these trades with your custodian (Schwab, Fidelity, Vanguard, or Interactive Brokers).
          </p>
        </div>

        <button
          onClick={copyTradeOrders}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Trade Orders Copied!' : 'Copy Order Sheet'}</span>
        </button>
      </div>
    </div>
  );
}
