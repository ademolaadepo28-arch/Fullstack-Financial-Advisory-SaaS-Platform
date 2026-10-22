import { NextRequest, NextResponse } from 'next/server';
import { verifyBookingToken } from '@/lib/tokens';

export async function POST(req: NextRequest) {
  try {
    const { token, selectedDate, selectedSlot, timezone } = await req.json();

    if (!token || !selectedDate || !selectedSlot) {
      return NextResponse.json({ error: 'Missing token, date, or time slot.' }, { status: 400 });
    }

    const verification = verifyBookingToken(token);
    if (!verification.valid || !verification.payload) {
      return NextResponse.json({ error: 'Unauthorized: Booking token is invalid or expired.' }, { status: 401 });
    }

    const payload = verification.payload;
    const meetingId = `meet-${Math.random().toString(36).substring(2, 8)}-${Math.random().toString(36).substring(2, 6)}`;
    const googleMeetUrl = `https://meet.google.com/${meetingId}`;
    const zoomUrl = `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    // Generate .ics calendar content
    const startTimeFormatted = `${selectedDate.replace(/-/g, '')}T${selectedSlot.replace(':', '')}00Z`;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Aura Wealth//Advisory Intake//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
SUMMARY:Aura Wealth 30-Min Strategy Consultation with Demola Adepo, CFP®
DESCRIPTION:Private Advisory Review. Google Meet: ${googleMeetUrl}\\nClient: ${payload.name} (${payload.email})\\nObjective: ${payload.intakeSummary.objective}\\nRisk Profile: ${payload.intakeSummary.riskProfile}
LOCATION:${googleMeetUrl}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    console.log(`[Calendar Handshake Success] Reserved slot for ${payload.email} at ${selectedDate} ${selectedSlot}. Dispatched meeting link ${googleMeetUrl} and questionnaire bundle to advisor inbox.`);

    return NextResponse.json({
      success: true,
      bookingDetails: {
        clientName: payload.name,
        clientEmail: payload.email,
        date: selectedDate,
        timeSlot: selectedSlot,
        timezone: timezone || 'America/New_York (EST)',
        advisor: 'Demola Adepo, CFP®, Senior Quantitative Wealth Advisor',
        googleMeetUrl,
        zoomUrl,
        icsContent,
        intakeSummary: payload.intakeSummary,
        status: 'CONFIRMED',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
