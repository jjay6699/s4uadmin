'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, total } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [currency, setCurrency] = useState('EUR');
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleCategoryHover = async (categorySlug: string) => {
    setHoveredCategory(categorySlug);
    try {
      const response = await fetch(`/api/products?category=${categorySlug}&limit=8`);
      const data = await response.json();
      if (data.success) {
        setCategoryProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching category products:', error);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'All Products', href: '/products' },
    { label: 'Categories', href: '/categories', hasDropdown: true },
    { label: 'Bitcoin', href: '/bitcoin' },
    { label: 'Manufacturers', href: '/manufacturers' },
    { label: 'Lab Tests', href: '/lab-tests' },
    { label: 'Articles', href: '/articles' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success && data.data) {
          // Filter to show only main categories for megamenu (case-insensitive)
          const mainCategories = [
            'ORAL STEROIDS',
            'ANTIESTROGENS AND PCT',
            'ANTIBIOTICS',
            'MEDICAL EQUIPMENTS',
            'STEROID CYCLES',
            'INJECTABLE STEROIDS',
            'HIGH BLOOD PRESSURE',
            'ACNE',
            'ORIGINAL PHARMACY PRODUCTS',
            'GROWTH HORMONES (HGH) AND PEPTIDES',
            'SEXUAL HEALTH',
            'ANTIANXIETY, SLEEP AID - INSOMNIA',
            'PAIN KILLERS',
            'FAT LOSS',
            'LIVER AID',
            'DIURETICS',
            'SARMS',
          ];

          const filtered = data.data.filter((cat: Category) =>
            mainCategories.includes(cat.name.toUpperCase())
          );
          setCategories(filtered);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Handle click outside to close megamenu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    if (isCategoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCategoriesOpen]);

  return (
    <header className="bg-white">
      {/* Top Tier */}
      <div className="border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-2">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.webp"
                alt="Steroids4u Logo"
                width={80}
                height={80}
                priority
                className="h-20 w-auto"
              />
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
              {/* Search Bar - Desktop */}
              <form onSubmit={handleSearch} className="max-w-lg">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Currency Selector */}
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-2 py-1 text-sm bg-white cursor-pointer border-0 font-medium"
              >
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
                <option value="USD">USD $</option>
              </select>

              {/* Account Link */}
              <Link href="/account" className="text-dark-text hover:text-accent transition-colors text-sm font-medium">
                Account
              </Link>

              {/* Cart Icon with Price */}
              <Link href="/cart" className="relative flex items-center gap-1">
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
                <span className="text-sm font-semibold text-dark-text">€{total.toFixed(2)}</span>
                <span className="absolute -top-2 -right-2 bg-accent text-dark-text text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Layout - Logo and Search Side by Side */}
          <div className="md:hidden flex items-center gap-3 w-full justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.webp"
                alt="Steroids4u Logo"
                width={70}
                height={70}
                priority
                className="h-16 w-auto"
              />
            </Link>

            {/* Mobile Search Bar - Narrower and aligned right */}
            <form onSubmit={handleSearch} className="w-40">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Tier - Navigation */}
      <div className="border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button - Left */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-dark-text"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 flex-1 justify-end">
              {navLinks.map((link, index) => (
                <div key={link.href} className="flex items-center gap-6 relative">
                  {link.hasDropdown ? (
                    <div
                      className="relative"
                      ref={categoriesRef}
                    >
                      <button
                        onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                        className={`text-dark-text hover:text-accent transition-colors font-medium text-sm flex items-center gap-1 ${
                          isActive(link.href) ? 'text-accent' : ''
                        }`}
                      >
                        {link.label}
                        <svg className={`w-3 h-3 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7" />
                        </svg>
                      </button>

                      {/* Megamenu Dropdown */}
                      {isCategoriesOpen && categories.length > 0 && (
                        <div
                          className="absolute top-full mt-0 bg-white border border-gray-300 shadow-lg z-50"
                          style={{ width: '1000px', left: '50%', transform: 'translateX(-50%)' }}
                          onMouseLeave={() => {
                            setHoveredCategory(null);
                            setCategoryProducts([]);
                          }}
                        >
                          <div className="p-8">
                            <div className="grid grid-cols-4 gap-8">
                              {categories.map((category) => (
                                <button
                                  key={category.slug}
                                  onClick={() => {
                                    router.push(`/products?category=${category.slug}`);
                                    setIsCategoriesOpen(false);
                                  }}
                                  className="text-left group hover:opacity-80 transition-opacity"
                                >
                                  <h5 className="font-semibold text-dark-text group-hover:text-accent transition-colors text-sm mb-2">
                                    {category.name.toUpperCase()}
                                  </h5>
                                  <p className="text-xs text-gray-600 line-clamp-2">
                                    {category.description || 'Browse our selection'}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`text-dark-text hover:text-accent transition-colors font-medium text-sm ${
                        isActive(link.href) ? 'text-accent' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                  {index < navLinks.length - 1 && <span className="text-gray-300">|</span>}
                </div>
              ))}
            </nav>

            {/* Mobile Right Section */}
            <div className="md:hidden flex items-center gap-3 flex-shrink-0">
              {/* Currency Selector */}
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-2 py-1 text-xs bg-white cursor-pointer border border-gray-300 rounded font-medium"
              >
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
                <option value="USD">USD $</option>
              </select>

              {/* Account Link */}
              <Link href="/account" className="text-dark-text hover:text-accent transition-colors text-xs font-medium">
                Account
              </Link>

              {/* Cart Icon with Price */}
              <Link href="/cart" className="relative flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-dark-text"
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
                <span className="text-xs font-semibold text-dark-text">€{total.toFixed(0)}</span>
                <span className="absolute -top-2 -right-2 bg-accent text-dark-text text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {itemCount}
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-3 pb-3 border-t border-gray-300 pt-3">
              {navLinks.map((link) => (
                <div key={link.href}>
                  {link.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                        className="w-full text-left py-2 text-dark-text hover:text-accent transition-colors text-sm flex items-center justify-between"
                      >
                        {link.label}
                        <svg className={`w-3 h-3 transition-transform ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7" />
                        </svg>
                      </button>
                      {isMobileCategoriesOpen && (
                        <div className="pl-4 bg-gray-50 py-2 rounded">
                          {categories.map((category) => (
                            <Link
                              key={category.slug}
                              href={`/products?category=${category.slug}`}
                              className="block py-2 text-dark-text hover:text-accent transition-colors text-xs"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsMobileCategoriesOpen(false);
                              }}
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className={`block py-2 transition-colors text-sm ${
                        isActive(link.href) ? 'text-accent font-semibold' : 'text-dark-text hover:text-accent'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

