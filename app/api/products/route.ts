import { NextRequest, NextResponse } from 'next/server';
import { loadProductsFromCSV } from '@/lib/utils/csv-parser';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '21');
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();
    const brandsParam = searchParams.get('brands');
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '999999');
    const inStock = searchParams.get('inStock') === 'true';

    let products = loadProductsFromCSV();

    // Filter by slug (for single product)
    if (slug) {
      products = products.filter((p) => p.slug === slug);
    }

    // Filter by category (match by name or slug)
    if (category) {
      products = products.filter((p) => {
        // Convert both to slug for comparison
        const productCategorySlug = p.category
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
        const filterCategorySlug = category
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');

        // Also check for exact name match (case-insensitive)
        return productCategorySlug === filterCategorySlug ||
               p.category.toLowerCase() === category.toLowerCase();
      });
    }

    // Filter by search
    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.brand?.toLowerCase().includes(search)
      );
    }

    // Filter by brands
    if (brandsParam) {
      const selectedBrands = brandsParam.split(',').map(b => b.toLowerCase());
      products = products.filter((p) =>
        p.brand && selectedBrands.includes(p.brand.toLowerCase())
      );
    }

    // Filter by price range
    products = products.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // Filter by stock
    if (inStock) {
      products = products.filter((p) => p.stock > 0);
    }

    // Pagination
    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

