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

// Demo users data
const DEMO_USERS = [
  {
    id: 'user-001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    country: 'USA',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    orders: 5,
    totalSpent: 1250.00,
  },
  {
    id: 'user-002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1987654321',
    country: 'UK',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    orders: 3,
    totalSpent: 850.50,
  },
  {
    id: 'user-003',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+33123456789',
    country: 'France',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    orders: 8,
    totalSpent: 2100.00,
  },
  {
    id: 'user-004',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '+49123456789',
    country: 'Germany',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    orders: 2,
    totalSpent: 450.00,
  },
  {
    id: 'user-005',
    name: 'Alex Brown',
    email: 'alex@example.com',
    phone: '+34123456789',
    country: 'Spain',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    orders: 1,
    totalSpent: 320.00,
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
      users: DEMO_USERS,
    });
  } catch (error) {
    console.error('Users error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

