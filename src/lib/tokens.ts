import crypto from 'crypto';

const SECRET_SALT = process.env.BOOKING_TOKEN_SECRET || 'aura-wealth-secure-booking-token-secret-2026';

export interface BookingTokenPayload {
  email: string;
  name: string;
  intakeSummary: {
    assetsTier: string;
    riskProfile: string;
    objective: string;
  };
  paidAmount: number; // 15000 in cents ($150.00)
  timestamp: number;
  stripeSessionId: string;
}

/**
 * Creates an HMAC signed single-use booking token
 */
export function generateBookingToken(payload: BookingTokenPayload): string {
  const data = JSON.stringify(payload);
  const encodedData = Buffer.from(data).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_SALT)
    .update(encodedData)
    .digest('base64url');

  return `${encodedData}.${signature}`;
}

/**
 * Verifies an HMAC signed single-use booking token
 */
export function verifyBookingToken(token: string): { valid: boolean; payload?: BookingTokenPayload; error?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      return { valid: false, error: 'Malformed token structure' };
    }

    const [encodedData, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_SALT)
      .update(encodedData)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return { valid: false, error: 'Invalid token cryptographic signature' };
    }

    const jsonStr = Buffer.from(encodedData, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonStr) as BookingTokenPayload;

    // Check expiration (valid for 72 hours)
    const now = Date.now();
    const tokenAge = now - payload.timestamp;
    const maxAge = 72 * 60 * 60 * 1000;

    if (tokenAge > maxAge) {
      return { valid: false, error: 'Booking token has expired. Please contact advisor.' };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: 'Token parsing failure' };
  }
}
