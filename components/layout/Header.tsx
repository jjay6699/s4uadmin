'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [currency, setCurrency] = useState('EUR');
  const [categories, setCategories] = useState<Category[]>([]);
  const categoriesRef = useRef<HTMLDivElement>(null);

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
    // Hardcoded categories to display
    const displayCategories: Category[] = [
      { id: '1', name: 'Oral Steroids', slug: 'oral-steroids', description: 'Tablet and capsule steroids for convenient oral administration' },
      { id: '2', name: 'Injectable Steroids', slug: 'injectable-steroids', description: 'High-potency injectable anabolic steroids for muscle growth' },
      { id: '3', name: 'Growth Hormones (HGH) and Peptides', slug: 'growth-hormones-hgh-and-peptides', description: 'Human growth hormone and peptide compounds for performance enhancement' },
      { id: '4', name: 'Fat Loss', slug: 'fat-loss', description: 'Cutting-edge fat loss and metabolism-boosting compounds' },
      { id: '5', name: 'Antiestrogens and PCT', slug: 'antiestrogens-and-pct', description: 'Post-cycle therapy and estrogen control products' },
      { id: '6', name: 'High Blood Pressure', slug: 'high-blood-pressure', description: 'Medications to manage blood pressure and cardiovascular health' },
      { id: '7', name: 'Sexual Health', slug: 'sexual-health', description: 'Products for sexual performance and reproductive health' },
      { id: '8', name: 'Liver Aid', slug: 'liver-aid', description: 'Liver support and protection supplements' },
      { id: '9', name: 'Antibiotics', slug: 'antibiotics', description: 'Prescription antibiotics for infection treatment' },
      { id: '10', name: 'Acne', slug: 'acne', description: 'Acne treatment and skin care products' },
      { id: '11', name: 'Antianxiety, Sleep Aid – Insomnia', slug: 'antianxiety-sleep-aid-insomnia', description: 'Sleep support and anxiety management compounds' },
      { id: '12', name: 'Diuretics', slug: 'diuretics', description: 'Water management and diuretic compounds' },
      { id: '13', name: 'Medical Equipments', slug: 'medical-equipments', description: 'Syringes, needles, and injection equipment' },
      { id: '14', name: 'Original Pharmacy Products', slug: 'original-pharmacy-products', description: 'Authentic pharmaceutical products from licensed manufacturers' },
      { id: '15', name: 'Pain Killers', slug: 'pain-killers', description: 'Pain relief and analgesic medications' },
      { id: '16', name: 'SARMs', slug: 'sarms', description: 'Selective androgen receptor modulators for targeted effects' },
      { id: '17', name: 'Steroid Cycles', slug: 'steroid-cycles', description: 'Pre-designed steroid cycle packages and stacks' },
    ];
    setCategories(displayCategories);
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
          <div className="hidden md:flex items-center justify-between gap-4">
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
            <div className="flex items-center gap-4 flex-shrink-0">
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
                <span className="text-sm font-semibold text-dark-text">€540.00</span>
                <span className="absolute -top-2 -right-2 bg-accent text-dark-text text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Layout - Logo Only */}
          <div className="md:hidden flex items-center justify-center">
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
                          index === 0 ? 'text-accent border-b-2 border-accent pb-1' : ''
                        }`}
                      >
                        {link.label}
                        <svg className={`w-3 h-3 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7" />
                        </svg>
                      </button>

                      {/* Megamenu Dropdown */}
                      {isCategoriesOpen && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-max">
                          <div className="grid grid-cols-4 gap-6 p-6 max-w-6xl">
                            {categories.map((category) => (
                              <div key={category.slug}>
                                <Link
                                  href={`/products?category=${category.slug}`}
                                  className="group"
                                  onClick={() => setIsCategoriesOpen(false)}
                                >
                                  <div className="hover:text-accent transition-colors">
                                    <h4 className="font-semibold text-dark-text text-sm mb-1">{category.name}</h4>
                                    {category.description && (
                                      <p className="text-xs text-gray-500 line-clamp-2 group-hover:text-accent">
                                        {category.description}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`text-dark-text hover:text-accent transition-colors font-medium text-sm ${
                        index === 0 ? 'text-accent border-b-2 border-accent pb-1' : ''
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
                <span className="text-xs font-semibold text-dark-text">€540</span>
                <span className="absolute -top-2 -right-2 bg-accent text-dark-text text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  0
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
                      className="block py-2 text-dark-text hover:text-accent transition-colors text-sm"
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

