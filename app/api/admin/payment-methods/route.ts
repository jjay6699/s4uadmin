import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Demo payment methods data
const PAYMENT_METHODS = [
  {
    id: 'eu-bank-transfer',
    name: 'EU Bank Transfer',
    enabled: true,
    instructions: 'Please transfer the total amount to our EU bank account. Include your order number in the payment reference.',
    accountDetails: 'IBAN: DE89 3704 0044 0532 0130 00\nBIC: COBADEFFXXX\nBank: Commerzbank AG\nAccount Holder: Steroids4U Ltd',
  },
  {
    id: 'us-bank-transfer',
    name: 'US Bank Transfer',
    enabled: true,
    instructions: 'Transfer funds to our US bank account. Processing may take 2-3 business days.',
    accountDetails: 'Account Number: 1234567890\nRouting Number: 021000021\nBank: Chase Bank\nAccount Holder: Steroids4U Inc',
  },
  {
    id: 'uk-bank-transfer',
    name: 'UK Bank Transfer',
    enabled: true,
    instructions: 'Make a bank transfer to our UK account. Please use your order ID as reference.',
    accountDetails: 'Sort Code: 12-34-56\nAccount Number: 12345678\nBank: Barclays Bank\nAccount Holder: Steroids4U UK Ltd',
  },
  {
    id: 'credit-card-paypal',
    name: 'Credit Card / PayPal',
    enabled: true,
    instructions: 'Pay securely with your credit card or PayPal account. Payment is processed immediately.',
    accountDetails: '',
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    enabled: true,
    instructions: 'Send Bitcoin to the address provided after placing your order. Payment confirmation may take up to 1 hour.',
    accountDetails: 'Bitcoin Address: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh\n(Address will be generated for each order)',
  },
];

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentMethods: PAYMENT_METHODS,
    });
  } catch (error) {
    console.error('Payment methods error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

