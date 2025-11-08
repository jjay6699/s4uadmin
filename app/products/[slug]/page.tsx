'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  brand?: string;
  description?: string;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      author: 'John Doe',
      rating: 5,
      title: 'Excellent Product',
      comment: 'Great quality and fast delivery. Highly recommended!',
      date: '2024-01-15',
    },
    {
      id: '2',
      author: 'Jane Smith',
      rating: 4,
      title: 'Good Value',
      comment: 'Good product, met my expectations. Will order again.',
      date: '2024-01-10',
    },
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products?slug=${slug}`);
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setProduct(data.data[0]);
          // Fetch related products from same category
          const relatedResponse = await fetch(`/api/products?category=${data.data[0].category}&limit=6`);
          const relatedData = await relatedResponse.json();
          setRelatedProducts(relatedData.data.filter((p: Product) => p.slug !== slug).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddReview = () => {
    if (newReview.title && newReview.comment) {
      const review: Review = {
        id: Date.now().toString(),
        author: 'You',
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
      };
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
    }
  };

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-gray-600">Product not found</p>
          <Link href="/products" className="text-accent hover:underline mt-4 inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-accent">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-accent">Products</Link>
            <span>/</span>
            <span className="text-dark-text font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Product Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
              <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center">
                {product.images && product.images[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="object-contain"
                  />
                ) : (
                  <div className="text-gray-400">No image available</div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 ${
                        selectedImage === idx ? 'border-accent' : 'border-gray-200'
                      }`}
                    >
                      <Image src={img} alt={`${product.name} ${idx}`} width={64} height={64} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info & Related */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h1 className="text-2xl font-bold text-dark-text mb-2">{product.name}</h1>
              {product.brand && <p className="text-sm text-gray-600 mb-4">Brand: {product.brand}</p>}
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < Math.round(Number(averageRating)) ? 'text-accent' : 'text-gray-300'}`}>★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-3xl font-bold text-accent mb-2">€{product.price.toFixed(2)}</p>
                <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 bg-gray-100 text-dark-text rounded-lg hover:bg-accent transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 bg-gray-100 text-dark-text rounded-lg hover:bg-accent transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  disabled={product.stock === 0}
                  className="w-full px-6 py-3 bg-gray-100 text-dark-text rounded-lg font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-dark-text mb-4">Related Products</h3>
                <div className="space-y-3">
                  {relatedProducts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/products/${related.slug}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <p className="text-sm font-medium text-dark-text truncate">{related.name}</p>
                      <p className="text-accent font-bold">€{related.price.toFixed(2)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-dark-text mb-4">Product Description</h2>
          <div className="prose prose-sm max-w-none text-gray-700">
            {product.description ? (
              <p className="whitespace-pre-wrap">{product.description}</p>
            ) : (
              <p className="text-gray-500">No description available for this product.</p>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-dark-text">Customer Reviews</h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-gray-100 text-dark-text rounded-lg font-medium hover:bg-accent transition-colors"
            >
              Write Review
            </button>
          </div>

          {showReviewForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
              <h3 className="text-lg font-semibold text-dark-text mb-4">Share Your Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`text-3xl transition-colors ${star <= newReview.rating ? 'text-accent' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    placeholder="Summarize your review"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    rows={4}
                    placeholder="Share your experience with this product"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddReview}
                    className="px-6 py-2 bg-gray-100 text-dark-text rounded-lg font-medium hover:bg-accent transition-colors"
                  >
                    Submit Review
                  </button>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="px-6 py-2 bg-gray-100 text-dark-text rounded-lg font-medium hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-dark-text">{review.title}</p>
                      <p className="text-sm text-gray-600">by {review.author} on {review.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < review.rating ? 'text-accent' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

