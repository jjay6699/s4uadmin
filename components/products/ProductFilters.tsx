'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterOptions {
  brands: string[];
  priceRange: { min: number; max: number };
  categories: string[];
  manufacturers?: string[];
}

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void;
  filterOptions: FilterOptions;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ onFiltersChange, filterOptions }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    stock: true,
    rating: false,
    availability: false,
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filterOptions.priceRange.min,
    filterOptions.priceRange.max,
  ]);
  const [minPrice, setMinPrice] = useState(filterOptions.priceRange.min);
  const [maxPrice, setMaxPrice] = useState(filterOptions.priceRange.max);
  const [inStock, setInStock] = useState(false);
  const [sortOrder, setSortOrder] = useState('');
  const [minRating, setMinRating] = useState(0);

  // Load filters from URL on mount
  useEffect(() => {
    const brandsParam = searchParams.get('brands');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const inStockParam = searchParams.get('inStock');

    if (brandsParam) {
      setSelectedBrands(brandsParam.split(','));
    }
    if (minPriceParam) {
      setMinPrice(parseInt(minPriceParam));
      setPriceRange([parseInt(minPriceParam), priceRange[1]]);
    }
    if (maxPriceParam) {
      setMaxPrice(parseInt(maxPriceParam));
      setPriceRange([priceRange[0], parseInt(maxPriceParam)]);
    }
    if (inStockParam === 'true') {
      setInStock(true);
    }
  }, []);

  const handleBrandChange = (brand: string) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updated);
    applyFilters({ brands: updated, minPrice, maxPrice, inStock });
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min') {
      setMinPrice(value);
      setPriceRange([value, priceRange[1]]);
    } else {
      setMaxPrice(value);
      setPriceRange([priceRange[0], value]);
    }
  };

  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    if (type === 'min') {
      setMinPrice(numValue);
    } else {
      setMaxPrice(numValue);
    }
  };

  const applyPriceFilter = () => {
    applyFilters({ brands: selectedBrands, minPrice, maxPrice, inStock });
  };

  const handleStockChange = () => {
    const newInStock = !inStock;
    setInStock(newInStock);
    applyFilters({ brands: selectedBrands, minPrice, maxPrice, inStock: newInStock });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(minRating === rating ? 0 : rating);
  };

  const applyFilters = (filters: any) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Set or remove filter parameters
    if (filters.brands && filters.brands.length > 0) {
      params.set('brands', filters.brands.join(','));
    } else {
      params.delete('brands');
    }

    if (filters.minPrice > filterOptions.priceRange.min) {
      params.set('minPrice', filters.minPrice.toString());
    } else {
      params.delete('minPrice');
    }

    if (filters.maxPrice < filterOptions.priceRange.max) {
      params.set('maxPrice', filters.maxPrice.toString());
    } else {
      params.delete('maxPrice');
    }

    if (filters.inStock) {
      params.set('inStock', 'true');
    } else {
      params.delete('inStock');
    }

    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setMinPrice(filterOptions.priceRange.min);
    setMaxPrice(filterOptions.priceRange.max);
    setInStock(false);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete('brands');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('inStock');
    params.set('page', '1');
    
    router.push(`?${params.toString()}`);
  };

  const hasActiveFilters = selectedBrands.length > 0 || 
    minPrice > filterOptions.priceRange.min || 
    maxPrice < filterOptions.priceRange.max || 
    inStock;

  const FilterSection = ({ title, section, children }: { title: string; section: keyof typeof expandedSections; children: React.ReactNode }) => (
    <div className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between mb-4 hover:text-accent transition-colors"
      >
        <h4 className="font-semibold text-dark-text text-sm">{title}</h4>
        <svg
          className={`w-4 h-4 transition-transform ${expandedSections[section] ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </button>
      {expandedSections[section] && <div>{children}</div>}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-dark-text">Advanced Filters</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-600 hover:text-dark-text"
        >
          <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          {/* Price Range Filter */}
          <FilterSection title="Price Range" section="price">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => handlePriceInputChange('min', e.target.value)}
                  onBlur={applyPriceFilter}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-accent"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => handlePriceInputChange('max', e.target.value)}
                  onBlur={applyPriceFilter}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>€{minPrice}</span>
                  <span>€{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={filterOptions.priceRange.min}
                  max={filterOptions.priceRange.max}
                  value={minPrice}
                  onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                  onMouseUp={applyPriceFilter}
                  className="w-full"
                />
                <input
                  type="range"
                  min={filterOptions.priceRange.min}
                  max={filterOptions.priceRange.max}
                  value={maxPrice}
                  onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                  onMouseUp={applyPriceFilter}
                  className="w-full"
                />
              </div>
            </div>
          </FilterSection>

          {/* Brand Filter */}
          {filterOptions.brands.length > 0 && (
            <FilterSection title="Brand" section="brand">
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {filterOptions.brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer hover:text-accent transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Stock Filter */}
          <FilterSection title="Availability" section="availability">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer hover:text-accent transition-colors">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={handleStockChange}
                  className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                />
                <span className="text-sm font-medium text-gray-700">In Stock Only</span>
              </label>
            </div>
          </FilterSection>

          {/* Rating Filter */}
          <FilterSection title="Minimum Rating" section="rating">
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center gap-3 cursor-pointer hover:text-accent transition-colors">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-gray-700">
                    {rating}★ & Up
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-100 text-dark-text rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium mt-4"
            >
              Clear All Filters
            </button>
          )}
        </>
      )}
    </div>
  );
};

