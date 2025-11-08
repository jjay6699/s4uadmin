/**
 * HTML Parsing Utilities
 * 
 * This module provides utility functions for parsing and cleaning HTML content.
 * It handles HTML entity decoding, tag removal, and content extraction.
 */

/**
 * Cleans HTML content by removing tags and decoding entities
 * @param html - The HTML string to clean
 * @returns Cleaned text content
 */
export function cleanHtmlContent(html: string): string {
  if (!html) return '';
  
  return html
    .replace(/<[^>]*>/g, '')           // Remove all HTML tags
    .replace(/&nbsp;/g, ' ')           // Replace non-breaking spaces
    .replace(/&lt;/g, '<')             // Decode less-than
    .replace(/&gt;/g, '>')             // Decode greater-than
    .replace(/&amp;/g, '&')            // Decode ampersand
    .replace(/&quot;/g, '"')           // Decode quotes
    .replace(/&#039;/g, "'")           // Decode apostrophes
    .replace(/\s+/g, ' ')              // Normalize whitespace
    .trim();
}

/**
 * Extracts text content from HTML, preserving structure
 * @param html - The HTML string to extract from
 * @returns Extracted text content
 */
export function extractTextContent(html: string): string {
  if (!html) return '';
  
  // Remove script and style tags
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#039;/g, "'");
  
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

/**
 * Extracts table data from HTML
 * @param html - The HTML string containing a table
 * @returns Array of table rows with cells
 */
export function extractTableData(html: string): Array<string[]> {
  const rows: Array<string[]> = [];
  const rowMatches = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || [];
  
  rowMatches.forEach(row => {
    const cells: string[] = [];
    const cellMatches = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g) || [];
    
    cellMatches.forEach(cell => {
      const cellContent = cell.replace(/<td[^>]*>([\s\S]*?)<\/td>/i, '$1');
      cells.push(cleanHtmlContent(cellContent));
    });
    
    if (cells.length > 0) {
      rows.push(cells);
    }
  });
  
  return rows;
}

/**
 * Extracts a value from HTML using a regex pattern
 * @param html - The HTML string to search in
 * @param pattern - The regex pattern to match
 * @returns The extracted value or null
 */
export function extractValueByPattern(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern);
  if (!match || !match[1]) return null;
  
  return cleanHtmlContent(match[1]).trim();
}

/**
 * Extracts all text between two delimiters
 * @param html - The HTML string to search in
 * @param startDelimiter - The starting delimiter
 * @param endDelimiter - The ending delimiter
 * @returns The extracted text or null
 */
export function extractBetweenDelimiters(
  html: string,
  startDelimiter: string,
  endDelimiter: string
): string | null {
  const startIndex = html.indexOf(startDelimiter);
  if (startIndex === -1) return null;
  
  const contentStart = startIndex + startDelimiter.length;
  const endIndex = html.indexOf(endDelimiter, contentStart);
  
  if (endIndex === -1) return null;
  
  const content = html.substring(contentStart, endIndex);
  return cleanHtmlContent(content).trim();
}

/**
 * Checks if HTML contains a specific tag
 * @param html - The HTML string to check
 * @param tagName - The tag name to look for
 * @returns True if the tag is found
 */
export function hasTag(html: string, tagName: string): boolean {
  const pattern = new RegExp(`<${tagName}[^>]*>`, 'i');
  return pattern.test(html);
}

/**
 * Extracts all text from paragraphs in HTML
 * @param html - The HTML string to extract from
 * @returns Array of paragraph texts
 */
export function extractParagraphs(html: string): string[] {
  const paragraphs: string[] = [];
  const pMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  
  pMatches.forEach(p => {
    const text = cleanHtmlContent(p);
    if (text.trim()) {
      paragraphs.push(text);
    }
  });
  
  return paragraphs;
}

