import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { loadProductsFromCSV } from '@/lib/utils/csv-parser';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

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

    // Load products from CSV
    const products = loadProductsFromCSV();

    // Calculate stats (demo data)
    const stats = {
      totalProducts: products.length,
      totalOrders: 42, // Demo data
      totalUsers: 156, // Demo data
      totalRevenue: 12450.50, // Demo data
      pendingOrders: 8, // Demo data
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

