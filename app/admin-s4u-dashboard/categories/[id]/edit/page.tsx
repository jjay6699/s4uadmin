'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCategory(data.category);
          setFormData({
            name: data.category.name,
            slug: data.category.slug,
            description: data.category.description || '',
          });
        } else {
          alert('Category not found');
          router.push('/admin-s4u-dashboard/categories');
        }
      } catch (error) {
        console.error('Failed to fetch category:', error);
        alert('Failed to load category');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin-s4u-dashboard/categories');
      } else {
        alert('Failed to update category');
      }
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-gray-500">Loading category...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-gray-500">Category not found</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Edit Category</h1>
          <p className="text-sm text-gray-500 mt-1">Update category information</p>
        </div>
        <Link
          href="/admin-s4u-dashboard/categories"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-md transition-colors"
        >
          ← Back to Categories
        </Link>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-medium">{category.productCount}</span> products are currently in this category
            </p>
          </div>

          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="Enter category name"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="category-slug"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly version of the name. Be careful when changing this as it may affect existing links.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="Enter category description"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin-s4u-dashboard/categories"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-6 rounded-md transition-colors inline-block"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

