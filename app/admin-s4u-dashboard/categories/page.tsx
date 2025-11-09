'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
  parent?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 30;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('/api/admin/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'products-asc':
        return a.productCount - b.productCount;
      case 'products-desc':
        return b.productCount - a.productCount;
      default:
        return 0;
    }
  });

  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setCategories(categories.filter((cat) => cat.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleViewDetails = (category: Category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Product Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product categories</p>
        </div>
        <Link
          href="/admin-s4u-dashboard/categories/add"
          className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
        >
          + Add Category
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="">Default</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="products-asc">Products (Low to High)</option>
              <option value="products-desc">Products (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading categories...</div>
        ) : paginatedCategories.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No categories found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Slug</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Products</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{category.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{category.slug}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {category.productCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right space-x-3">
                        <button
                          onClick={() => handleViewDetails(category)}
                          className="text-gray-600 hover:text-gray-900 font-medium"
                        >
                          View
                        </button>
                        <Link
                          href={`/admin-s4u-dashboard/categories/${category.id}/edit`}
                          className="text-gray-600 hover:text-gray-900 font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <p className="text-xs text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, sortedCategories.length)} of {sortedCategories.length}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Details Modal */}
      {showModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedCategory.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{selectedCategory.slug}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {selectedCategory.description || 'No description available'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Statistics</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">{selectedCategory.productCount}</span> products in this category
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href={`/admin-s4u-dashboard/categories/${selectedCategory.id}/edit`}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors text-center"
                >
                  Edit Category
                </Link>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

