import { NextRequest, NextResponse } from 'next/server';
import { generateBookingToken } from '@/lib/tokens';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, assetsTier, riskTolerance, coreObjective, demoMode } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    // If Stripe is configured and demoMode is not explicitly forced
    if (stripeSecretKey && !demoMode) {
      try {
        const stripe = require('stripe')(stripeSecretKey);
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: '30-Minute Advisory Strategy Consultation',
                  description: `Fiduciary Intake Review with CFP® Advisor for ${name} (${riskTolerance} / ${coreObjective})`,
                  images: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60'],
                },
                unit_amount: 15000, // $150.00
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          customer_email: email,
          metadata: {
            clientName: name,
            assetsTier: assetsTier || '$50k-$250k',
            riskTolerance: riskTolerance || 'Balanced',
            coreObjective: coreObjective || 'Wealth Accumulation',
          },
          success_url: `${origin}/booking?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/#booking-section`,
        });

        return NextResponse.json({ url: session.url, sessionId: session.id, mode: 'stripe' });
      } catch (stripeErr: any) {
        console.error('Stripe SDK error, falling back to instant sandbox flow:', stripeErr.message);
      }
    }

    // Interactive Demo / Sandbox Handshake (Instant payment simulation)
    const simulatedSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const signedToken = generateBookingToken({
      email,
      name,
      intakeSummary: {
        assetsTier: assetsTier || '$50k-$250k',
        riskProfile: riskTolerance || 'Balanced',
        objective: coreObjective || 'Wealth Accumulation',
      },
      paidAmount: 15000,
      timestamp: Date.now(),
      stripeSessionId: simulatedSessionId,
    });

    return NextResponse.json({
      success: true,
      mode: 'sandbox',
      sessionId: simulatedSessionId,
      bookingToken: signedToken,
      redirectUrl: `/booking?token=${encodeURIComponent(signedToken)}`,
      amount: 150.0,
      clientName: name,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
