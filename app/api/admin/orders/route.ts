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

// Demo orders data
const DEMO_ORDERS = [
  {
    id: 'order-001',
    userId: 'user-123',
    total: 450.00,
    status: 'delivered',
    paymentStatus: 'completed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{ productId: 'prod-1', quantity: 2, price: 225 }],
  },
  {
    id: 'order-002',
    userId: 'user-456',
    total: 320.50,
    status: 'shipped',
    paymentStatus: 'completed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{ productId: 'prod-2', quantity: 1, price: 320.50 }],
  },
  {
    id: 'order-003',
    userId: 'user-789',
    total: 680.00,
    status: 'processing',
    paymentStatus: 'completed',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{ productId: 'prod-3', quantity: 3, price: 226.67 }],
  },
  {
    id: 'order-004',
    userId: 'user-101',
    total: 250.00,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
    items: [{ productId: 'prod-4', quantity: 1, price: 250 }],
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
      orders: DEMO_ORDERS,
    });
  } catch (error) {
    console.error('Orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

