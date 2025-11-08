/**
 * Specification Extractor Service
 * 
 * This service handles extraction of product specifications from various HTML formats.
 * It supports both structured format (with <strong> tags) and table format.
 */

import { cleanHtmlContent, extractValueByPattern } from '@/lib/utils/html-parser';

export interface ProductSpecifications {
  company?: string;
  dosage?: string;
  productPack?: string;
  content?: string;
}

/**
 * Extracts specifications from structured format
 * Format: <strong>Company:</strong> Value
 */
function extractFromStructuredFormat(html: string): ProductSpecifications {
  const specs: ProductSpecifications = {};

  // Extract Company
  const companyMatch = html.match(/<strong>Company:<\/strong>\s*([^<]*?)(?=<strong>|$)/i);
  if (companyMatch) {
    const value = companyMatch[1].trim();
    if (value) specs.company = value;
  }

  // Extract Dosage
  const dosageMatch = html.match(/<strong>Dosage:<\/strong>\s*([^<]*?)(?=<strong>|$)/i);
  if (dosageMatch) {
    const value = dosageMatch[1].trim();
    if (value) specs.dosage = value;
  }

  // Extract Product Pack
  const packMatch = html.match(/<strong>Product pack:<\/strong>\s*([^<]*?)(?=<strong>|$)/i);
  if (packMatch) {
    const value = packMatch[1].trim();
    if (value) specs.productPack = value;
  }

  // Extract Content (Active)
  const contentMatch = html.match(/<strong>Content\s*\(active\)?:<\/strong>\s*([^<]*?)(?=<strong>|$)/i);
  if (contentMatch) {
    const value = contentMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (value) specs.content = value;
  }

  return specs;
}

/**
 * Extracts specifications from table format
 * Format: <strong>ACTIVE SUBSTANCE:</strong></td><td>value</td>
 */
function extractFromTableFormat(html: string): ProductSpecifications {
  const specs: ProductSpecifications = {};

  // Extract ACTIVE SUBSTANCE (maps to content/active ingredient)
  const activeMatch = html.match(
    /<strong>ACTIVE\s+SUBSTANCE:<\/strong>\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i
  );
  if (activeMatch) {
    const value = cleanHtmlContent(activeMatch[1]).trim();
    if (value && !specs.content) specs.content = value;
  }

  // Extract Usual dosages
  const dosageMatch = html.match(
    /<strong>Usual\s+dosages?:<\/strong>\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i
  );
  if (dosageMatch) {
    const value = cleanHtmlContent(dosageMatch[1]).trim();
    if (value && !specs.dosage) specs.dosage = value;
  }

  // Extract Detection time
  const detectionMatch = html.match(
    /<strong>Detection\s+time:<\/strong>\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i
  );
  if (detectionMatch && !specs.productPack) {
    const value = cleanHtmlContent(detectionMatch[1]).trim();
    if (value) specs.productPack = value;
  }

  // Extract manufacturer/brand from alternative names
  if (!specs.company) {
    const altMatch = html.match(
      /<strong>ALTERNATIVE\s+STEROID\s+NAMES:<\/strong>\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i
    );
    if (altMatch) {
      const value = cleanHtmlContent(altMatch[1]).trim();
      const parts = value.split(',');
      if (parts.length > 0) {
        specs.company = parts[0].trim();
      }
    }
  }

  return specs;
}

/**
 * Checks if HTML contains structured format specifications
 */
function hasStructuredFormat(html: string): boolean {
  return /<strong>Company:<\/strong>|<strong>Dosage:<\/strong>|<strong>Product pack:<\/strong>/i.test(html);
}

/**
 * Checks if HTML contains table format specifications
 */
function hasTableFormat(html: string): boolean {
  return /<strong>ACTIVE\s+SUBSTANCE:<\/strong>|<strong>Usual\s+dosages?:<\/strong>/i.test(html);
}

/**
 * Main extraction function that handles multiple formats
 * @param shortDescription - Short description HTML
 * @param content - Full content HTML
 * @returns Extracted specifications
 */
export function extractSpecifications(
  shortDescription: string,
  content?: string
): ProductSpecifications {
  if (!shortDescription && !content) return {};

  const specs: ProductSpecifications = {};
  const searchTexts: string[] = [];

  // Build search texts array
  if (shortDescription) searchTexts.push(shortDescription);
  if (content) searchTexts.push(content);

  // Try structured format first
  for (const searchText of searchTexts) {
    if (hasStructuredFormat(searchText)) {
      const structuredSpecs = extractFromStructuredFormat(searchText);
      Object.assign(specs, structuredSpecs);
      
      // If we found all specs, return early
      if (specs.company && specs.dosage && specs.productPack && specs.content) {
        return specs;
      }
    }
  }

  // Try table format if no structured format found
  if (!specs.company && !specs.dosage && !specs.productPack && !specs.content) {
    for (const searchText of searchTexts) {
      if (hasTableFormat(searchText)) {
        const tableSpecs = extractFromTableFormat(searchText);
        Object.assign(specs, tableSpecs);
        
        // If we found something, stop searching
        if (specs.company || specs.dosage || specs.productPack || specs.content) {
          break;
        }
      }
    }
  }

  return specs;
}

/**
 * Checks if specifications are available
 */
export function hasSpecifications(specs: ProductSpecifications): boolean {
  return !!(specs.company || specs.dosage || specs.productPack || specs.content);
}

