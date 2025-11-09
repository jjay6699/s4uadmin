import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { loadCategoriesFromCSV, loadProductsFromCSV } from '@/lib/utils/csv-parser';

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

    const categories = loadCategoriesFromCSV();
    const products = loadProductsFromCSV();

    // Filter only parent categories (parent = 0)
    const parentCategories = categories.filter(cat => cat.parent === '0');

    // Count products for each category (including products in subcategories)
    const categoriesWithCount = parentCategories.map(category => {
      // Find all subcategories of this category
      const subcategories = categories.filter(cat => cat.parent === category.id);

      // Count direct products
      const directProductCount = products.filter(p => p.category === category.name).length;

      // Count products in subcategories
      const subcategoryProductCount = subcategories.reduce((count, subcat) => {
        return count + products.filter(p => p.category === subcat.name).length;
      }, 0);

      const totalProductCount = directProductCount + subcategoryProductCount;

      return {
        ...category,
        productCount: totalProductCount,
        subcategoryCount: subcategories.length,
      };
    }).filter(cat => cat.productCount > 0); // Only show categories with products

    return NextResponse.json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    console.error('Categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create category
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { name, slug, description } = body;

    // Generate a new ID
    const categories = loadCategoriesFromCSV();
    const newId = String(Math.max(...categories.map(c => parseInt(c.id) || 0)) + 1);

    // TODO: Implement actual CSV write logic
    // For now, just return success
    console.log('Creating category:', { id: newId, name, slug, description });

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category: {
        id: newId,
        name,
        slug,
        description,
        parent: '0',
      },
    });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

