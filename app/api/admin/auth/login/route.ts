import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Demo admin credentials
const DEMO_ADMIN = {
  id: 'admin-001',
  email: 'admin@steroids4u.eu',
  name: 'Admin User',
  password: 'admin123', // In production, this should be hashed
  role: 'super_admin' as const,
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check credentials against demo admin
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      // Generate JWT token
      const token = jwt.sign(
        {
          id: DEMO_ADMIN.id,
          email: DEMO_ADMIN.email,
          role: DEMO_ADMIN.role,
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return NextResponse.json({
        success: true,
        token,
        admin: {
          id: DEMO_ADMIN.id,
          email: DEMO_ADMIN.email,
          name: DEMO_ADMIN.name,
          role: DEMO_ADMIN.role,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

