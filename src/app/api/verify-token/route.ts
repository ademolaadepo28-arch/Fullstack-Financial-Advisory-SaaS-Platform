import { NextRequest, NextResponse } from 'next/server';
import { verifyBookingToken } from '@/lib/tokens';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token missing.' }, { status: 400 });
    }

    const verification = verifyBookingToken(token);
    if (!verification.valid || !verification.payload) {
      return NextResponse.json({ valid: false, error: verification.error || 'Invalid token.' }, { status: 401 });
    }

    return NextResponse.json({
      valid: true,
      client: {
        name: verification.payload.name,
        email: verification.payload.email,
        intakeSummary: verification.payload.intakeSummary,
        paidAmount: verification.payload.paidAmount / 100,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }
}
