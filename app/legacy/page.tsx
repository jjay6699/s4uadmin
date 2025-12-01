'use client';

import { HeroCarousel } from '@/components/home/HeroCarousel';
import { Button } from '@/components/common/Button';
import { ProductCard } from '@/components/products/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Manufacturer {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [cuttingProducts, setCuttingProducts] = useState<Product[]>([]);
  const [bulkingProducts, setBulkingProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const response = await fetch('/api/products?limit=100');
        const data = await response.json();
        if (data.success) {
          setFeaturedProducts(data.data.slice(0, 4));

          // Filter products by category for cutting and bulking
          const cuttingProds = data.data.filter((p: Product) =>
            p.category.toLowerCase().includes('cutting') ||
            p.category.toLowerCase().includes('fat loss')
          ).slice(0, 4);

          const bulkingProds = data.data.filter((p: Product) =>
            p.category.toLowerCase().includes('bulking') ||
            p.category.toLowerCase().includes('mass')
          ).slice(0, 4);

          // If not enough products in those categories, fill with random ones
          if (cuttingProds.length < 4) {
            const remaining = data.data.filter((p: Product) => !cuttingProds.includes(p)).slice(0, 4 - cuttingProds.length);
            cuttingProds.push(...remaining);
          }

          if (bulkingProds.length < 4) {
            const remaining = data.data.filter((p: Product) => !bulkingProds.includes(p) && !cuttingProds.includes(p)).slice(0, 4 - bulkingProds.length);
            bulkingProds.push(...remaining);
          }

          setCuttingProducts(cuttingProds);
          setBulkingProducts(bulkingProds);

          // Extract unique categories from products
          const uniqueCategories = Array.from(
            new Map(
              data.data.map((p: Product) => [
                p.category,
                { id: p.category, name: p.category, slug: p.category.toLowerCase().replace(/\s+/g, '-') }
              ])
            ).values()
          ) as Category[];
          setCategories(uniqueCategories.slice(0, 4));

          // Extract unique manufacturers from products
          const manufacturersList: Manufacturer[] = [
            { id: 'arenis', name: 'Arenis', slug: 'arenis', logo: '/arenis.webp' },
            { id: 'canada', name: 'Canada Peptides', slug: 'canada-peptides', logo: '/canada.webp' },
            { id: 'hilma', name: 'Hilma Biocare', slug: 'hilma-biocare', logo: '/hilma.webp' },
            { id: 'legitlift', name: 'Legitlift', slug: 'legitlift', logo: '/legitlift.webp' },
            { id: 'british', name: 'British Dragon', slug: 'british-dragon', logo: '/british.webp' },
          ];
          setManufacturers(manufacturersList);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Carousel */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <HeroCarousel />
      </section>

      {/* Info Section Below Banner */}
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🚚',
                title: 'Free Shipping',
                description: 'Take advantage of free shipping on all orders over €320 or €300. Enjoy your shopping without any extra delivery costs.'
              },
              {
                icon: '⭐',
                title: '5 Star Reviews',
                description: 'Our clients consistently rate us 5 stars for exceptional quality and outstanding service. See why we\'re trusted and highly recommended by so many!'
              },
              {
                icon: '✅',
                title: 'Lab Tested',
                description: 'Our performance enhancement products are thoroughly lab-tested to guarantee purity, potency, and safety.'
              },
              {
                icon: '💬',
                title: '24/7 Customer Service',
                description: 'Our dedicated team is available around the clock, ready to assist you at any time. Reach out whenever you need help or guidance.'
              },
            ].map((item, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-base mb-3 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted">Check out our best-selling products</p>
          </div>
          <Link href="/products" className="flex-shrink-0">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse" />
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
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
            ))
          ) : (
            <p className="col-span-full text-center text-muted">No products available</p>
          )}
        </div>
      </section>

      {/* Best for Cutting Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold mb-2">Best for Cutting</h2>
              <p className="text-muted">Top products for cutting cycles</p>
            </div>
            <Link href="/products?category=cutting" className="flex-shrink-0">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse" />
              ))
            ) : cuttingProducts.length > 0 ? (
              cuttingProducts.map((product) => (
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
              ))
            ) : (
              <p className="col-span-full text-center text-muted">No products available</p>
            )}
          </div>
        </div>
      </section>

      {/* Best for Bulking Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Best for Bulking</h2>
            <p className="text-muted">Top products for bulking cycles</p>
          </div>
          <Link href="/products?category=bulking" className="flex-shrink-0">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse" />
            ))
          ) : bulkingProducts.length > 0 ? (
            bulkingProducts.map((product) => (
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
            ))
          ) : (
            <p className="col-span-full text-center text-muted">No products available</p>
          )}
        </div>
      </section>

      {/* Middle Banner Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
          <Image
            src="/middle-banner.jpg"
            alt="Middle Banner"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Manufacturers Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Shop by Manufacturer</h2>
            <p className="text-muted">Check our the best manufacturers below</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6">
            {manufacturers.length > 0 ? (
              manufacturers.map((manufacturer) => (
                <Link
                  key={manufacturer.id}
                  href={`/products?brand=${manufacturer.slug}`}
                  className="relative group overflow-hidden rounded-lg bg-black h-56 flex items-center justify-center hover:shadow-card transition-shadow cursor-pointer"
                >
                  <Image
                    src={manufacturer.logo}
                    alt={manufacturer.name}
                    width={200}
                    height={160}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-muted">Loading manufacturers...</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
