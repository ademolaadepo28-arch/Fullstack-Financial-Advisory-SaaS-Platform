'use client';

import React, { useState } from 'react';
import { MODEL_PORTFOLIOS } from '@/data/portfoliosData';
import { ModelPortfolio } from '@/types';
import { Layers, TrendingUp, AlertCircle, PieChart, Shield, CheckCircle2, ChevronRight, BellRing, Sparkles, FileText, ArrowRight } from 'lucide-react';

interface PortfolioExplorerProps {
  onSelectPortfolio?: (portfolio: ModelPortfolio) => void;
  showMemberFeatures?: boolean;
}

export default function PortfolioExplorer({ onSelectPortfolio, showMemberFeatures = false }: PortfolioExplorerProps) {
  const [activeTier, setActiveTier] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const portfolio = MODEL_PORTFOLIOS[activeTier];

  return (
    <div className="space-y-8">
      {/* Portfolio Selector Tabs */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 max-w-3xl w-full">
          {(Object.keys(MODEL_PORTFOLIOS) as Array<'conservative' | 'balanced' | 'aggressive'>).map((key) => {
            const p = MODEL_PORTFOLIOS[key];
            const isSelected = activeTier === key;

            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTier(key);
                  if (onSelectPortfolio) onSelectPortfolio(p);
                }}
                className={`p-3.5 rounded-xl text-left transition-all relative ${
                  isSelected
                    ? 'bg-slate-800 border border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-transparent hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {key === 'conservative' ? 'Conservative Yield' : key === 'balanced' ? 'Balanced Growth' : 'Aggressive Thematic'}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {p.tagline.split(' ')[0]} / {p.tagline.split(' ')[2]}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {key === 'conservative'
                    ? '30/70 Capital Preservation'
                    : key === 'balanced'
                    ? '60/40 Global Broad Index'
                    : '85/15 Tech & Alternatives'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Portfolio Overview Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative">
        {/* Top Header Badge & Tagline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {portfolio.driftThreshold}
              </span>
              <span className="text-xs text-slate-500 font-mono">• {portfolio.rebalanceFrequency}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {portfolio.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {portfolio.description}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 text-right">
            <span className="text-xs text-slate-400">Target Dividend Yield:</span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {portfolio.targetYield}% APY
            </span>
          </div>
        </div>

        {/* 4 Quantitative Key Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">10-Yr Historical CAGR</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
              +{portfolio.historicalCagr}%
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Backtested Trajectory</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Sharpe Ratio</span>
            <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
              {portfolio.sharpeRatio}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Risk-Adjusted Efficiency</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Max Historical Drawdown</span>
            <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">
              {portfolio.maxDrawdown}%
            </span>
            <span className="text-[10px] text-slate-500 font-mono">2008 & 2020 Stress Tested</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Rebalance Trigger</span>
            <span className="text-xl font-bold font-mono text-teal-400 mt-1 block">
              {portfolio.driftThreshold.split(' ')[0]}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Automated Drift Band</span>
          </div>
        </div>

        {/* Asset Class Proportion Bar */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 mb-8">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span>Asset Class Allocation Matrix</span>
            </span>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                Equity ({portfolio.equityPercentage}%)
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2.5 h-2.5 rounded bg-blue-500" />
                Fixed Income ({portfolio.fixedIncomePercentage}%)
              </span>
              {portfolio.alternativesPercentage > 0 && (
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                  Alts ({portfolio.alternativesPercentage}%)
                </span>
              )}
            </div>
          </div>

          {/* Stacked Progress Bar */}
          <div className="h-4 rounded-xl overflow-hidden flex bg-slate-800 shadow-inner">
            {portfolio.equityPercentage > 0 && (
              <div
                style={{ width: `${portfolio.equityPercentage}%` }}
                className="bg-emerald-500 h-full transition-all duration-500"
              />
            )}
            {portfolio.fixedIncomePercentage > 0 && (
              <div
                style={{ width: `${portfolio.fixedIncomePercentage}%` }}
                className="bg-blue-500 h-full transition-all duration-500"
              />
            )}
            {portfolio.alternativesPercentage > 0 && (
              <div
                style={{ width: `${portfolio.alternativesPercentage}%` }}
                className="bg-amber-500 h-full transition-all duration-500"
              />
            )}
          </div>
        </div>

        {/* Live Holdings & Ticker Allocation Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Curated Ticker Weightings & Expense Ratios</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-500">
              {portfolio.allocations.length} Core Holdings
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ticker</th>
                  <th className="py-3 px-4">Asset / ETF Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Target Weight</th>
                  <th className="py-3 px-4 text-right">Expense Ratio</th>
                  <th className="py-3 px-4 text-right">Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans">
                {portfolio.allocations.map((item) => (
                  <tr key={item.ticker} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {item.ticker}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-[11px] text-slate-400 leading-tight">{item.description}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          item.category === 'Equity'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : item.category === 'Fixed Income'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white text-sm">
                      {item.targetWeight}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300">
                      {item.expenseRatio}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-400 font-medium">
                      {item.yield}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Advisor Commentary Box */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/30 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
              MONTHLY ADVISOR COMMENTARY • {portfolio.monthlyCommentary.date}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400">{portfolio.monthlyCommentary.author}</span>
          </div>
          <h4 className="text-sm font-bold text-white">
            "{portfolio.monthlyCommentary.title}"
          </h4>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            {portfolio.monthlyCommentary.content}
          </p>
        </div>

        {/* Rebalance History Log */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <BellRing className="w-3.5 h-3.5 text-amber-400" />
              <span>Historical Rebalance Activity & Drift Log</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">SEC Publisher Audit Trail</span>
          </div>

          <div className="space-y-2">
            {portfolio.rebalanceHistory.map((log, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 text-[11px]">{log.date}</span>
                    <span className="font-semibold text-emerald-400">{log.action}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{log.rationale}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">EXECUTED</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
