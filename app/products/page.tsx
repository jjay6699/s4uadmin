'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  brand?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 21,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    priceRange: { min: 0, max: 1000 },
    categories: [],
  });
  const [loadingFilters, setLoadingFilters] = useState(true);

  const search = searchParams.get('search');
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const page = parseInt(searchParams.get('page') || '1');

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoadingFilters(true);
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);

        const response = await fetch(`/api/products/filters?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setFilterOptions(data.data);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilterOptions();
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        params.set('limit', '21');

        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setProducts(data.data);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Fetch category data when category changes
  useEffect(() => {
    if (category) {
      const fetchCategory = async () => {
        try {
          const response = await fetch(`/api/categories?slug=${category}`);
          const data = await response.json();
          if (data.success && data.data) {
            setCategoryData(data.data);
          }
        } catch (error) {
          console.error('Error fetching category:', error);
        }
      };
      fetchCategory();
    } else {
      setCategoryData(null);
    }
  }, [category]);

  const capitalizeTitle = (text: string): string => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getPageTitle = () => {
    if (search) return `Search Results for "${search}"`;
    if (category) return capitalizeTitle(category.replace(/-/g, ' '));
    if (brand) return capitalizeTitle(brand.replace(/-/g, ' '));
    return 'All Products';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{getPageTitle()}</h1>
          {categoryData?.description && (
            <p className="text-gray-600 mb-4 max-w-3xl">{categoryData.description}</p>
          )}
          <p className="text-muted">
            {pagination.total} product{pagination.total !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            {!loadingFilters ? (
              <ProductFilters
                onFiltersChange={() => {}}
                filterOptions={filterOptions}
              />
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            )}
          </div>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="mb-8 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <label htmlFor="sort" className="text-sm font-medium text-dark-text">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-accent"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
              <div className="text-sm text-muted">
                Page {pagination.page} of {pagination.totalPages}
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      price={product.price}
                      stock={product.stock}
                      images={product.images}
                      category={product.category}
                      brand={product.brand}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    {pagination.page > 1 && (
                      <a
                        href={`?${new URLSearchParams(searchParams.toString()).toString()}&page=${(pagination.page - 1).toString()}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Previous
                      </a>
                    )}

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <a
                        key={p}
                        href={`?${new URLSearchParams(searchParams.toString()).toString()}&page=${p.toString()}`}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          p === pagination.page
                            ? 'bg-accent text-dark-text font-semibold'
                            : 'border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </a>
                    ))}

                    {pagination.page < pagination.totalPages && (
                      <a
                        href={`?${new URLSearchParams(searchParams.toString()).toString()}&page=${(pagination.page + 1).toString()}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Next
                      </a>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted mb-4">No products found</p>
                <a
                  href="/products"
                  className="inline-block px-6 py-2 bg-accent text-dark-text rounded-lg hover:opacity-90 transition-opacity"
                >
                  View All Products
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Loading...</p></div>}>
      <ProductsContent />
    </Suspense>
  );
}
