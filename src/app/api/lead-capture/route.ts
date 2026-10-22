import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, calculationType, inputs, summary } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log(`[Lead Captured] Name: ${name || 'Prospect'} | Email: ${email} | Type: ${calculationType} | Summary:`, summary);

    return NextResponse.json({
      success: true,
      message: 'Plan diagnostic ready for download',
      leadId: `lead_${Date.now()}`,
      downloadUrl: `/diagnostic-plan?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name || 'Investor')}&type=${calculationType || 'compound'}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
