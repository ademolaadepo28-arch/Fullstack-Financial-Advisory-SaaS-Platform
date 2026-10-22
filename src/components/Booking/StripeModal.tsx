'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IntakeResponses } from '@/types';
import { X, Lock, CreditCard, Shield, CheckCircle2, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StripeModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: IntakeResponses;
}

export default function StripeModal({ isOpen, onClose, formData }: StripeModalProps) {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expDate, setExpDate] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleExecutePayment = async (forceDemo: boolean = false) => {
    setProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          assetsTier: formData.investableAssetsTier,
          riskTolerance: formData.riskTolerance,
          coreObjective: formData.coreObjective,
          demoMode: forceDemo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate checkout session');
      }

      // If real Stripe URL returned
      if (data.url && data.mode === 'stripe') {
        window.location.href = data.url;
        return;
      }

      // Sandbox Handshake completed!
      if (data.success && data.bookingToken) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore confetti if canvas unsupported
        }

        setTimeout(() => {
          onClose();
          router.push(data.redirectUrl);
        }, 800);
      }
    } catch (err: any) {
      setError(err.message || 'Payment authorization failed.');
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Stripe Checkout Gateway</span>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/20">
                  256-Bit Encrypted
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Authorized Intake Fee: $150.00 USD
              </p>
            </div>
          </div>
        </div>

        {/* Client & Fee Summary */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 mb-5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Consultation For:</span>
            <span className="text-white font-semibold">{formData.fullName} ({formData.email})</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Advisor:</span>
            <span className="text-emerald-400 font-medium">Demola Adepo, CFP®</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Intake Objective:</span>
            <span className="text-amber-400 font-medium">{formData.coreObjective}</span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center">
            <span className="text-xs font-semibold text-white">Total Amount Due</span>
            <span className="text-lg font-black font-mono text-amber-400">$150.00</span>
          </div>
        </div>

        {/* Mock Card Form for Sandbox / Stripe Test Element */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                TEST CARD
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                Expires (MM/YY)
              </label>
              <input
                type="text"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                CVC Security Code
              </label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 mb-4">
            {error}
          </p>
        )}

        {/* Action Button: Automated Handshake */}
        <button
          onClick={() => handleExecutePayment(true)}
          disabled={processing}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-60 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing Token & Releasing Private Calendar...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Authorize $150.00 & Unlock Calendar</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Security Disclosures */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fiduciary Intake Standard</span>
          </span>
          <span className="font-mono text-slate-500">checkout.session.completed</span>
        </div>
      </div>
    </div>
  );
}
