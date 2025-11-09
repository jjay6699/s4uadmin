'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    images: '',
    tags: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    ogTitle: '',
    ogDescription: '',
    twitterTitle: '',
    twitterDescription: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          shortDescription: formData.shortDescription,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          category: formData.category,
          brand: formData.brand,
          images: formData.images.split(',').map((img) => img.trim()),
          tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
          seo: {
            title: formData.seoTitle,
            description: formData.seoDescription,
            keywords: formData.seoKeywords,
            ogTitle: formData.ogTitle,
            ogDescription: formData.ogDescription,
            twitterTitle: formData.twitterTitle,
            twitterDescription: formData.twitterDescription,
          },
        }),
      });

      if (response.ok) {
        router.push('/admin-s4u-dashboard/products');
      } else {
        setError('Failed to create product');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin-s4u-dashboard/products" className="text-blue-600 hover:text-blue-800">
          ← Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-dark-text">Add New Product</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-8 max-w-4xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-dark-text mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g., Testosterone Enanthate"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g., testosterone-enanthate"
                />
              </div>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Short Description *</label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Brief product summary (shown in product listings)..."
            />
            <p className="text-xs text-gray-500 mt-1">A brief summary shown in product listings and previews</p>
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Full Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Detailed product description with benefits, usage, dosage, etc..."
            />
            <p className="text-xs text-gray-500 mt-1">Full product details shown on the product page</p>
          </div>

          {/* Pricing & Stock */}
          <div>
            <h2 className="text-xl font-bold text-dark-text mb-4">Pricing & Stock</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Price (€) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select Category</option>
                  <option value="bulking">Bulking</option>
                  <option value="cutting">Cutting</option>
                  <option value="growth-hormones">Growth Hormones</option>
                  <option value="peptides">Peptides</option>
                </select>
              </div>
            </div>
          </div>

          {/* Brand, Images & Tags */}
          <div>
            <h2 className="text-xl font-bold text-dark-text mb-4">Brand, Media & Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g., Hilma Biocare"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Images (comma-separated URLs)</label>
                <input
                  type="text"
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-dark-text mb-2">Product Tags / Keywords</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="testosterone, bulking, injectable, muscle gain"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated tags for product categorization and search</p>
            </div>
          </div>

          {/* SEO Settings */}
          <div>
            <h2 className="text-xl font-bold text-dark-text mb-4">SEO & Meta Tags</h2>

            {/* Basic SEO */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Basic SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">SEO Title</label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    maxLength={60}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="SEO title for search engines"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seoTitle.length}/60 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">SEO Description</label>
                  <textarea
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleChange}
                    maxLength={160}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="SEO description for search engines"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seoDescription.length}/160 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">SEO Keywords</label>
                  <input
                    type="text"
                    name="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </div>

            {/* Open Graph (Facebook) */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Open Graph (Facebook, LinkedIn)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">OG Title</label>
                  <input
                    type="text"
                    name="ogTitle"
                    value={formData.ogTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Title for social media sharing (leave empty to use SEO title)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">OG Description</label>
                  <textarea
                    name="ogDescription"
                    value={formData.ogDescription}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Description for social media sharing (leave empty to use SEO description)"
                  />
                </div>
              </div>
            </div>

            {/* Twitter Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Twitter Card</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Twitter Title</label>
                  <input
                    type="text"
                    name="twitterTitle"
                    value={formData.twitterTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Title for Twitter sharing (leave empty to use SEO title)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Twitter Description</label>
                  <textarea
                    name="twitterDescription"
                    value={formData.twitterDescription}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Description for Twitter sharing (leave empty to use SEO description)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-accent hover:bg-yellow-500 text-dark-text font-bold py-2 px-8 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Product'}
            </button>
            <Link
              href="/admin-s4u-dashboard/products"
              className="bg-gray-300 hover:bg-gray-400 text-dark-text font-bold py-2 px-8 rounded-lg transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

