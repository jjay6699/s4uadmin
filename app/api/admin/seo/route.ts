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

// Demo SEO data
const DEMO_SEO_ITEMS = [
  {
    id: 'seo-001',
    type: 'product' as const,
    targetId: 'testosterone-enanthate',
    title: 'Buy Testosterone Enanthate Online | Steroids4u',
    description: 'High-quality Testosterone Enanthate for sale. Fast EU shipping, authentic products, competitive prices.',
    keywords: 'testosterone enanthate, buy testosterone, anabolic steroids',
    ogImage: 'https://example.com/testosterone.jpg',
    canonical: 'https://steroids4u.eu/products/testosterone-enanthate',
  },
  {
    id: 'seo-002',
    type: 'category' as const,
    targetId: 'bulking',
    title: 'Bulking Steroids | Best Products for Muscle Growth | Steroids4u',
    description: 'Shop our premium bulking steroids collection. Increase muscle mass and strength with authentic products.',
    keywords: 'bulking steroids, muscle growth, anabolic steroids',
    ogImage: 'https://example.com/bulking.jpg',
    canonical: 'https://steroids4u.eu/products?category=bulking',
  },
  {
    id: 'seo-003',
    type: 'page' as const,
    targetId: 'how-to-order',
    title: 'How to Order | Steroids4u',
    description: 'Simple and secure ordering process. Learn how to place your order and get fast delivery.',
    keywords: 'how to order, ordering process, steroids4u',
    canonical: 'https://steroids4u.eu/how-to-order',
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
      seoItems: DEMO_SEO_ITEMS,
    });
  } catch (error) {
    console.error('SEO error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

