import fs from 'fs';
import path from 'path';
import { extractSpecifications, ProductSpecifications } from '@/lib/services/specification-extractor';

// Re-export for backward compatibility
export type { ProductSpecifications };

// Capitalize first letter of each word
function capitalizeTitle(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}


export interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  brand?: string;
  description?: string;
  shortDescription?: string;
  content?: string;
  tags?: string[];
  specifications?: ProductSpecifications;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    twitterTitle?: string;
    twitterDescription?: string;
  };
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string;
}

// Custom CSV parser that handles quoted fields with newlines
function parseCSVContent(content: string): Record<string, string>[] {
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);
  const records: Record<string, string>[] = [];

  let currentRecord: string[] = [];
  let inQuotes = false;
  let currentField = '';

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = line[j + 1];

      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentField += '"';
          j++;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        currentRecord.push(currentField);
        currentField = '';
      } else {
        currentField += char;
      }
    }

    // Handle newline
    if (inQuotes) {
      currentField += '\n';
    } else {
      // End of record
      if (currentField || currentRecord.length > 0) {
        currentRecord.push(currentField);
        currentField = '';

        if (currentRecord.length === headers.length) {
          const record: Record<string, string> = {};
          headers.forEach((header, index) => {
            record[header] = currentRecord[index] || '';
          });
          records.push(record);
          currentRecord = [];
        }
      }
    }
  }

  // Handle last record
  if (currentField || currentRecord.length > 0) {
    currentRecord.push(currentField);
    if (currentRecord.length === headers.length) {
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header] = currentRecord[index] || '';
      });
      records.push(record);
    }
  }

  return records;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

// Main product categories (from the megamenu)
const MAIN_CATEGORIES = [
  'ORAL STEROIDS',
  'INJECTABLE STEROIDS',
  'GROWTH HORMONES (HGH) AND PEPTIDES',
  'ANTIESTROGENS AND PCT',
  'ANTIBIOTICS',
  'MEDICAL EQUIPMENTS',
  'STEROID CYCLES',
  'FAT LOSS',
  'SEXUAL HEALTH',
  'ANTIANXIETY, SLEEP AID - INSOMNIA',
  'PAIN KILLERS',
  'LIVER AID',
  'DIURETICS',
  'SARMS',
  'ACNE',
  'HIGH BLOOD PRESSURE',
  'ORIGINAL PHARMACY PRODUCTS',
];

// Specific category mappings for edge cases
const CATEGORY_MAPPINGS: Record<string, string> = {
  'CANADA PEPTIDES': 'GROWTH HORMONES (HGH) AND PEPTIDES',
  'PEPTIDES': 'GROWTH HORMONES (HGH) AND PEPTIDES',
};

export function loadProductsFromCSV(): ProductData[] {
  const filePath = path.join(process.cwd(), 'products.csv');

  if (!fs.existsSync(filePath)) {
    console.warn('products.csv not found');
    return [];
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parseCSVContent(fileContent);

    const products: ProductData[] = [];

    for (let i = 0; i < records.length; i++) {
      try {
        const row = records[i];

        // Handle BOM in first column name
        let postTitle = row.post_title || row['﻿post_title'];

        // Get price
        let price = 0;
        if (row.regular_price) {
          price = parseFloat(row.regular_price.trim()) || 0;
        }

        // Get stock
        let stock = parseInt(row.stock || '0') || 0;
        if (stock === 0) {
          stock = 100;
        }

        // Skip if no title
        if (!postTitle) continue;

        // If no price, use a default price of 50
        if (price <= 0) {
          price = 50;
        }

        // Parse images
        const images: string[] = [];
        if (row.images) {
          const imageParts = row.images.split('|');
          for (const part of imageParts) {
            const match = part.match(/https?:\/\/[^\s!]+/);
            if (match) {
              images.push(match[0].trim());
            }
          }
        }

        // Get category - intelligently match against main categories only
        let category = 'Uncategorized';
        if (row['tax:product_cat']) {
          const cats = row['tax:product_cat'].split('|').map(c => c.trim());

          // Try to find a category that matches one of the MAIN categories
          let foundCategory = null;
          for (const cat of cats) {
            const catUpper = cat.toUpperCase();

            // Check if it's a direct match
            if (MAIN_CATEGORIES.includes(catUpper)) {
              foundCategory = cat;
              break;
            }

            // Check if it's a subcategory (e.g., "Injectable Steroids > Drostanolone Propionate")
            if (catUpper.includes('>')) {
              const mainPart = catUpper.split('>')[0].trim();
              if (MAIN_CATEGORIES.includes(mainPart)) {
                foundCategory = mainPart;
                break;
              }
            }

            // Check if it's a mapped category (brand or subcategory)
            if (CATEGORY_MAPPINGS[catUpper]) {
              foundCategory = CATEGORY_MAPPINGS[catUpper];
              break;
            }
          }

          // If no main category found, use the first non-empty category
          if (foundCategory) {
            category = foundCategory;
          } else if (cats.length > 0 && cats[0]) {
            category = cats[0];
          }
        }

        const shortDesc = row.post_excerpt?.trim();
        const fullContent = row.post_content?.trim();

        // Parse tags
        const tags: string[] = [];
        if (row['tax:product_tag']) {
          tags.push(...row['tax:product_tag'].split('|').map(t => t.trim()).filter(Boolean));
        }

        products.push({
          id: row.ID || `product-${i}`,
          name: capitalizeTitle(postTitle.trim()),
          slug: row.post_name || postTitle.toLowerCase().replace(/\s+/g, '-'),
          price,
          stock,
          images,
          category,
          brand: row['tax:product_brand']?.trim() || undefined,
          description: row.post_excerpt || row.post_content || undefined,
          shortDescription: shortDesc || undefined,
          content: fullContent || undefined,
          tags: tags.length > 0 ? tags : undefined,
          specifications: extractSpecifications(shortDesc || '', fullContent),
          seo: {
            title: row['meta:_aioseo_title']?.trim() || undefined,
            description: row['meta:_aioseo_description']?.trim() || undefined,
            keywords: row['meta:_aioseo_keywords']?.trim() || undefined,
            ogTitle: row['meta:_aioseo_og_title']?.trim() || undefined,
            ogDescription: row['meta:_aioseo_og_description']?.trim() || undefined,
            twitterTitle: row['meta:_aioseo_twitter_title']?.trim() || undefined,
            twitterDescription: row['meta:_aioseo_twitter_description']?.trim() || undefined,
          },
        });
      } catch (error) {
        // Silently skip rows with parsing errors
      }
    }

    console.log(`✓ Loaded ${products.length} products from CSV`);
    return products;
  } catch (error) {
    console.error('Error loading products from CSV:', error);
    return [];
  }
}

export function loadCategoriesFromCSV(): CategoryData[] {
  const filePath = path.join(process.cwd(), 'categories.csv');

  if (!fs.existsSync(filePath)) {
    console.warn('categories.csv not found');
    return [];
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');

    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);
    const categories: CategoryData[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      try {
        const values = parseCSVLine(lines[i]);
        const row: Record<string, string> = {};

        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        if (row.name === 'Uncategorized') continue;

        categories.push({
          id: row.term_id,
          name: row.name,
          slug: row.slug,
          description: row.description || undefined,
          parent: row.parent || '0',
        });
      } catch (error) {
        // Silently skip rows with parsing errors
      }
    }

    return categories;
  } catch (error) {
    console.error('Error loading categories from CSV:', error);
    return [];
  }
}

