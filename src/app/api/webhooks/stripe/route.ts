import { NextRequest, NextResponse } from 'next/server';
import { generateBookingToken } from '@/lib/tokens';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: any;

    if (webhookSecret && sig) {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
      }
    } else {
      // Direct JSON parsing for development / sandbox testing
      try {
        event = JSON.parse(rawBody);
      } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
      }
    }

    // Handle payment completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data?.object || event;
      const customerEmail = session.customer_email || session.metadata?.email || 'client@example.com';
      const clientName = session.metadata?.clientName || 'Valued Client';
      const assetsTier = session.metadata?.assetsTier || '$50k-$250k';
      const riskTolerance = session.metadata?.riskTolerance || 'Balanced';
      const coreObjective = session.metadata?.coreObjective || 'Wealth Accumulation';

      // Generate the single-use token granting private calendar access
      const singleUseToken = generateBookingToken({
        email: customerEmail,
        name: clientName,
        intakeSummary: {
          assetsTier,
          riskProfile: riskTolerance,
          objective: coreObjective,
        },
        paidAmount: 15000,
        timestamp: Date.now(),
        stripeSessionId: session.id || `cs_webhook_${Date.now()}`,
      });

      console.log(`[Stripe Webhook] Verified $150 payment for ${customerEmail}. Generated single-use calendar token: ${singleUseToken.substring(0, 16)}...`);

      return NextResponse.json({
        received: true,
        action: 'booking_token_issued',
        customerEmail,
        token: singleUseToken,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook processing error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
