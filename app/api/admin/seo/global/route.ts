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

// Mock global SEO data (in production, this would be stored in a database)
let globalSEO = {
  siteName: 'Steroids4U',
  siteDescription: 'Premium anabolic steroids and performance enhancement products. Fast EU shipping, authentic products, competitive prices.',
  defaultTitle: 'Buy Steroids Online | Steroids4U - Premium Quality Products',
  titleSeparator: '|',
  defaultKeywords: 'buy steroids, anabolic steroids, steroids online, performance enhancement, bodybuilding supplements',
  author: 'Steroids4U',
  ogImage: 'https://steroids4u.eu/og-image.jpg',
  twitterHandle: '@steroids4u',
  twitterCard: 'summary_large_image',
  googleAnalyticsId: '',
  googleSiteVerification: '',
  bingVerification: '',
  facebookAppId: '',
  robots: 'index, follow',
  canonical: 'https://steroids4u.eu',
};

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ success: true, seo: globalSEO });
  } catch (error) {
    console.error('Error fetching global SEO:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();

    // Update global SEO settings
    globalSEO = {
      ...globalSEO,
      ...body,
    };

    // In production, you would save this to a database or config file
    console.log('Global SEO settings updated:', globalSEO);

    return NextResponse.json({ success: true, seo: globalSEO });
  } catch (error) {
    console.error('Error updating global SEO:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

