'use client';

import React from 'react';
import { X, ShieldCheck, Scale, AlertOctagon, FileText, CheckCircle2 } from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComplianceModal({ isOpen, onClose }: ComplianceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Regulatory Disclosures & Fiduciary Guardrails
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Document Ref: FA-MVP-2026-V1 • SEC / FINRA Compliance Framework
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>1. Publisher & Non-Discretionary Educational Safe Harbor</span>
            </h4>
            <p className="text-slate-400">
              All SaaS model portfolio feeds, ticker allocation percentages, automated drift notifications, and rebalance calculations published through the Aura Wealth platform operate strictly under the <strong>Publisher's Exemption of the Investment Advisers Act of 1940 (SEC Rule 202(a)(11)(D))</strong> and state equivalent educational non-discretionary standards.
            </p>
            <p className="text-slate-400 mt-2">
              Aura Wealth does not take custody of client funds, does not accept discretionary power-of-attorney over client brokerage accounts, and does not execute broker-dealer trades on behalf of subscribers. Subscribers maintain full discretionary custody at their independent custodians (e.g. Charles Schwab, Fidelity, Vanguard).
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <span>2. Hypothetical Performance & Backtesting Disclaimers (FINRA Rule 2210)</span>
            </h4>
            <p className="text-slate-400">
              Historical Compound Annual Growth Rates (CAGR), Sharpe ratios, maximum drawdowns, and dividend yields displayed on this platform are based on mathematical index backtests and fund benchmark histories. <strong>Past performance is no guarantee of future investment returns.</strong> All investing involves risk of loss, including the possible loss of principal invested.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>3. Paid 1-on-1 Consultation Fiduciary Standard ($150 Fixed Fee)</span>
            </h4>
            <p className="text-slate-400">
              When a client engages in the paid 30-minute consultation with Demola Adepo, CFP®, the advisor adheres to the fiduciary standard of care. The $150 intake fee represents a fixed, transparent engagement fee. Aura Wealth advisors do not accept third-party commissions, 12b-1 mutual fund distribution fees, or revenue-sharing arrangements from any recommended exchange-traded funds.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>4. Webhook Security & Access Verification</span>
            </h4>
            <p className="text-slate-400">
              Access to protected member portfolio endpoints is cryptographically restricted. Stripe webhook event handlers verify active customer subscription status using HMAC SHA-256 JWT tokens prior to decrypting rebalancing trade orders and model updates.
            </p>
          </div>
        </div>

        {/* Modal Close CTA */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            I Acknowledge & Understand
          </button>
        </div>
      </div>
    </div>
  );
}
