import { NextRequest, NextResponse } from 'next/server';
import { loadCategoriesFromCSV } from '@/lib/utils/csv-parser';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    let categories = loadCategoriesFromCSV();

    // Filter by slug if provided
    if (slug) {
      const category = categories.find(c => c.slug === slug);
      return NextResponse.json({
        success: true,
        data: category || null,
      });
    }

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

