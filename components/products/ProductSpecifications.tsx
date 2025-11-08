/**
 * Product Specifications Component
 * 
 * Displays product specifications in a consistent, reusable format.
 * Handles rendering of company, dosage, product pack, and active content.
 */

import React from 'react';
import { ProductSpecifications } from '@/lib/services/specification-extractor';

interface ProductSpecificationsProps {
  specifications?: ProductSpecifications;
  className?: string;
}

/**
 * Specification Field Component
 * Renders a single specification field with label and value
 */
const SpecificationField: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:gap-4 gap-1">
    <span className="font-semibold text-gray-900 text-sm">{label}:</span>
    <span className="text-gray-700 text-sm whitespace-pre-wrap">{value}</span>
  </div>
);

/**
 * Product Specifications Component
 * Displays all available specifications for a product
 */
export const ProductSpecificationsComponent: React.FC<ProductSpecificationsProps> = ({
  specifications,
  className = '',
}) => {
  // Don't render if no specifications
  if (!specifications || (!specifications.company && !specifications.dosage && 
      !specifications.productPack && !specifications.content)) {
    return null;
  }

  return (
    <div className={`mb-6 pb-6 border-b border-gray-200 ${className}`}>
      <div className="space-y-3">
        {specifications.company && (
          <SpecificationField label="Company" value={specifications.company} />
        )}
        {specifications.dosage && (
          <SpecificationField label="Dosage" value={specifications.dosage} />
        )}
        {specifications.productPack && (
          <SpecificationField label="Product Pack" value={specifications.productPack} />
        )}
        {specifications.content && (
          <SpecificationField label="Content (Active)" value={specifications.content} />
        )}
      </div>
    </div>
  );
};

export default ProductSpecificationsComponent;

