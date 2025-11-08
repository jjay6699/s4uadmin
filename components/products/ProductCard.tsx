'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

// Capitalize first letter of each word
const capitalizeTitle = (text: string): string => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  brand?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  slug,
  price,
  stock,
  images,
  category,
  brand,
}) => {
  const imageUrl = images && images.length > 0 ? images[0] : null;
  const inStock = stock > 0;
  const { addToCart } = useCart();
  const { addToast } = useToast();

  // Extract only the last level category (remove breadcrumb hierarchy with ">")
  const displayCategory = category.includes('>')
    ? category.split('>').pop()?.trim() || category
    : category;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;

    addToCart(id, name, price, 1);
    addToast(`${name} added to cart`, 'success', 2000);
  };

  return (
    <Link href={`/products/${slug}`}>
      <div className="border border-border rounded-lg overflow-hidden hover:shadow-card transition-shadow cursor-pointer h-full flex flex-col bg-white">
        {/* Image Container */}
        <div className="relative w-full h-40 md:h-64 bg-gray-100 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/images/placeholder.png';
              }}
            />
          ) : (
            <Image
              src="/images/placeholder.svg"
              alt="Placeholder"
              fill
              className="object-cover"
            />
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category Badge */}
          <span className="inline-block bg-gray-200 text-dark-text text-[10px] md:text-xs font-semibold px-2 py-1 rounded-full mb-2 w-fit">
            {displayCategory}
          </span>

          {/* Brand */}
          {brand && (
            <p className="text-xs text-muted mb-1">{brand}</p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 flex-1">{capitalizeTitle(name)}</h3>

          {/* Price and Button */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border gap-2">
            <span className="text-lg font-bold text-dark-text">€{price.toFixed(2)}</span>

            {/* Mobile: Cart Icon Only */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Add to Cart"
            >
              <svg
                className="w-5 h-5 text-dark-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>

            {/* Desktop: Full Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="hidden md:block"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

