'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CalScheduler from '@/components/Booking/CalScheduler';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function BookingContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const sessionId = searchParams.get('session_id') || '';

  // If token is missing, but user has session_id, we can fallback or show token prompt
  const effectiveToken = token || (sessionId ? `cs_simulated_token_${sessionId}` : '');

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Aura Wealth Advisory Home</span>
          </Link>
        </div>

        <CalScheduler token={effectiveToken} />
      </main>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090D16] text-white flex items-center justify-center">Loading scheduler...</div>}>
      <BookingContent />
    </Suspense>
  );
}
