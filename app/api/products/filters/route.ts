import { NextRequest, NextResponse } from 'next/server';
import { loadProductsFromCSV } from '@/lib/utils/csv-parser';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let products = loadProductsFromCSV();

    // Filter by category if provided
    if (category) {
      products = products.filter((p) => {
        const categorySlug = p.category
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
        return categorySlug === category.toLowerCase();
      });
    }

    // Extract unique brands
    const brands = Array.from(
      new Set(
        products
          .filter((p) => p.brand)
          .map((p) => p.brand!)
      )
    ).sort();

    // Calculate price range
    const prices = products.map((p) => p.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));

    return NextResponse.json({
      success: true,
      data: {
        brands,
        priceRange: {
          min: minPrice,
          max: maxPrice,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}

