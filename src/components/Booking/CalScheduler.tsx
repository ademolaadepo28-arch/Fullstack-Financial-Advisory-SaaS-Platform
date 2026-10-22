'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Calendar, Clock, Video, CheckCircle2, User, ArrowRight, Download, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CalSchedulerProps {
  token: string;
}

export default function CalScheduler({ token }: CalSchedulerProps) {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Scheduling state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:30 AM');
  const [timezone, setTimezone] = useState<string>('America/New_York (EST)');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Available dates for next 10 business days
  const availableDates = [
    { label: 'Tomorrow', date: '2026-10-23', day: 'Friday' },
    { label: 'Oct 26', date: '2026-10-26', day: 'Monday' },
    { label: 'Oct 27', date: '2026-10-27', day: 'Tuesday' },
    { label: 'Oct 28', date: '2026-10-28', day: 'Wednesday' },
    { label: 'Oct 29', date: '2026-10-29', day: 'Thursday' },
    { label: 'Oct 30', date: '2026-10-30', day: 'Friday' },
    { label: 'Nov 02', date: '2026-11-02', day: 'Monday' },
  ];

  const timeSlots = [
    '09:00 AM',
    '10:30 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
    '05:15 PM',
  ];

  useEffect(() => {
    setSelectedDate(availableDates[0].date);

    // Verify token with backend
    async function verify() {
      try {
        const res = await fetch('/api/verify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (data.valid && data.client) {
          setValid(true);
          setClientData(data.client);
        } else {
          setValid(false);
          setErrorMessage(data.error || 'Invalid or expired single-use booking token.');
        }
      } catch (err: any) {
        setValid(false);
        setErrorMessage(err.message || 'Verification network error');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      verify();
    } else {
      setLoading(false);
      setValid(false);
      setErrorMessage('No booking authorization token detected. Please complete the $150 intake payment first.');
    }
  }, [token]);

  const handleConfirmAppointment = async () => {
    setBookingInProgress(true);
    try {
      const res = await fetch('/api/book-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          selectedDate,
          selectedSlot,
          timezone,
        }),
      });

      const data = await res.json();
      if (data.success && data.bookingDetails) {
        setBookingDetails(data.bookingDetails);
        setBookingConfirmed(true);
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
          });
        } catch (e) {}
      } else {
        alert(data.error || 'Failed to reserve appointment slot.');
      }
    } catch (err: any) {
      alert(err.message || 'Appointment reservation failed.');
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleDownloadIcs = () => {
    if (!bookingDetails?.icsContent) return;
    const blob = new Blob([bookingDetails.icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Aura_Wealth_Consultation_${bookingDetails.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center p-8 bg-slate-900 rounded-2xl border border-slate-800">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
        <p className="text-sm font-semibold text-white">Verifying Single-Use Cryptographic Token...</p>
        <p className="text-xs text-slate-400 mt-1 font-mono">HMAC SHA-256 Authentication Handshake</p>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-2xl bg-slate-900 border border-rose-500/30 text-center">
        <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Private Calendar Access Denied</h3>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          {errorMessage}
        </p>
        <div className="mt-6 pt-4 border-t border-slate-800">
          <Link
            href="/#booking-section"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all"
          >
            <span>Return to $150 Consultation Intake</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Booking Confirmation Screen
  if (bookingConfirmed && bookingDetails) {
    return (
      <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
            HANDSHAKE COMPLETE • STATUS: CONFIRMED
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Consultation Scheduled
          </h2>
          <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
            Your private 30-minute quantitative strategy review is confirmed with Senior Wealth Advisor Demola Adepo, CFP®.
          </p>
        </div>

        {/* Meeting Credentials Card */}
        <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-6 space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 font-mono text-[10px] uppercase block">Date & Time</span>
              <span className="text-white font-bold text-sm block mt-0.5">
                {bookingDetails.date} at {bookingDetails.timeSlot}
              </span>
              <span className="text-slate-400 text-[11px] font-mono">{bookingDetails.timezone}</span>
            </div>

            <div>
              <span className="text-slate-500 font-mono text-[10px] uppercase block">Advisor</span>
              <span className="text-emerald-400 font-bold text-sm block mt-0.5">
                {bookingDetails.advisor}
              </span>
              <span className="text-slate-400 text-[11px]">Fiduciary Standard Certified</span>
            </div>
          </div>

          {/* Meeting Links */}
          <div className="space-y-2">
            <span className="text-slate-400 text-[11px] block font-medium">Video Conference Access:</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={bookingDetails.googleMeetUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Video className="w-4 h-4 text-emerald-400" />
                <span>Join via Google Meet</span>
              </a>

              <button
                onClick={handleDownloadIcs}
                className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span>Download .ICS Calendar File</span>
              </button>
            </div>
          </div>

          {/* Questionnaire Response Bundle Dispatched Notice */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Intake response bundle (<strong className="text-slate-200">{clientData?.intakeSummary?.objective}</strong> / <strong className="text-slate-200">{clientData?.intakeSummary?.riskProfile}</strong>) dispatched to advisor inbox.
            </span>
          </div>
        </div>

        {/* Next Step Transition to SaaS Model Portfolios */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold block">
              STEP 4: POST-CONSULTATION TRANSITION
            </span>
            <h4 className="text-sm font-bold text-white mt-0.5">Explore Ongoing SaaS Model Portfolios</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Access live ticker allocations, quarterly rebalance emails, and automated drift triggers ($49–$149/mo).
            </p>
          </div>

          <Link
            href="/portal"
            className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
          >
            <span>Enter SaaS Member Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Active Cal.com Scheduler Screen
  return (
    <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
      {/* Authorized Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-mono px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Pre-Authorized Single-Use Token Valid
            </span>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">| $150 Paid</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Schedule Your Private Strategy Review
          </h2>
          <p className="text-xs text-slate-400">
            Welcome, <strong className="text-white">{clientData?.name}</strong>. Select your preferred 30-minute intake window.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Advisor:</span>
          <span className="text-xs font-bold text-emerald-400 block font-mono">Demola Adepo, CFP®</span>
          <span className="text-[10px] text-slate-500">Google Meet / Zoom</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Date Selection */}
        <div className="md:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Select Date</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">14-Day Calendar</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {availableDates.map((d) => {
              const isSelected = selectedDate === d.date;
              return (
                <div
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                        isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {d.date.split('-')[2]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{d.label}</p>
                      <p className="text-[10px] text-slate-400">{d.day} • {d.date}</p>
                    </div>
                  </div>
                  {isSelected && <span className="text-xs font-mono text-emerald-400 font-bold">Selected</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Time Slots & Timezone */}
        <div className="md:col-span-6 space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Timezone</span>
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl p-2.5 font-mono focus:outline-none focus:border-emerald-500"
            >
              <option value="America/New_York (EST)">Eastern Time (US & Canada - EST)</option>
              <option value="America/Chicago (CST)">Central Time (US & Canada - CST)</option>
              <option value="America/Denver (MST)">Mountain Time (US & Canada - MST)</option>
              <option value="America/Los_Angeles (PST)">Pacific Time (US & Canada - PST)</option>
              <option value="Europe/London (GMT)">London / UTC (GMT)</option>
            </select>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono mb-2">
              Available 30-Min Slots
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Intake Recap */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Intake Bundle Recap:</span>
            <p className="text-slate-300">
              Objective: <strong className="text-emerald-400">{clientData?.intakeSummary?.objective}</strong>
            </p>
            <p className="text-slate-300">
              Risk Profile: <strong className="text-white">{clientData?.intakeSummary?.riskProfile}</strong>
            </p>
          </div>

          <button
            onClick={handleConfirmAppointment}
            disabled={bookingInProgress || !selectedDate || !selectedSlot}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            {bookingInProgress ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirming Slot & Dispatching Video Links...</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>Confirm Slot ({selectedDate} @ {selectedSlot})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
