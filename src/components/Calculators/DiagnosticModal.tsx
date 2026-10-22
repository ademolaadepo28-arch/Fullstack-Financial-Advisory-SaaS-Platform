'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, FileText, Download, CheckCircle2, Shield, Lock, ArrowRight, Loader2 } from 'lucide-react';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  summaryData: any;
}

export default function DiagnosticModal({ isOpen, onClose, summaryData }: DiagnosticModalProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide an email to receive your diagnostic summary.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Valued Investor',
          email,
          calculationType: summaryData?.type || 'compound',
          summary: summaryData,
        }),
      });

      const data = await res.json();
      if (data.success && data.downloadUrl) {
        onClose();
        router.push(data.downloadUrl);
      } else {
        setError(data.error || 'Failed to generate diagnostic plan.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-500/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Export Diagnostic Financial Memo
            </h3>
            <p className="text-xs text-slate-400">
              Personalized Executive Plan & Gap Analysis (PDF Summary)
            </p>
          </div>
        </div>

        {/* Diagnostic Preview Highlights */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 mb-5 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Quantitative projection based on your inputs: <strong>{summaryData?.title || 'Financial Growth Forecast'}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Fiduciary asset-location & tax-loss harvesting recommendation memo</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Print-ready client assessment bundle for your CFP® strategy session</span>
          </div>
        </div>

        {/* Lead Capture Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Your Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Michael Vance"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Email Address (Where to send diagnostic report)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. michael@example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Compiling Financial Memo...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Personalized PDF Diagnostics</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Privacy Note */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Fiduciary data privacy: Zero spam, zero data selling. SEC compliance retained.</span>
        </div>
      </div>
    </div>
  );
}
