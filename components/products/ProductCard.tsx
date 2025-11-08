'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/common/Button';

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
            {category}
          </span>

          {/* Brand */}
          {brand && (
            <p className="text-xs text-muted mb-1">{brand}</p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 flex-1">{name}</h3>

          {/* Price and Button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-auto pt-2 border-t border-border gap-2">
            <span className="text-lg font-bold text-dark-text">€{price.toFixed(2)}</span>
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic will be implemented later
              }}
              disabled={!inStock}
              className="w-full md:w-auto text-[13px] md:text-sm"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

