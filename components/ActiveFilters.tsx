import React from 'react';
import { FiltersState } from '../types';
import { INITIAL_FILTERS } from '../constants';

interface ActiveFiltersProps {
  filters: FiltersState;
  searchQuery: string;
  onRemove: (key: keyof FiltersState | 'search', value?: any) => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ filters, searchQuery, onRemove }) => {
    const activeFilters = [];

    if (searchQuery) {
        activeFilters.push({
            key: 'search',
            label: `Search: "${searchQuery}"`,
            value: searchQuery
        });
    }

    Array.isArray(filters.categories) && filters.categories.forEach(cat => activeFilters.push({ key: 'categories', label: cat, value: cat }));
    Array.isArray(filters.sizes) && filters.sizes.forEach(size => activeFilters.push({ key: 'sizes', label: size, value: size }));
    Array.isArray(filters.certifications) && filters.certifications.forEach(cert => activeFilters.push({ key: 'certifications', label: cert, value: cert }));

    if (filters.priceRange[1] < INITIAL_FILTERS.priceRange[1]) {
        activeFilters.push({
            key: 'priceRange',
            label: `Price: < ₹${filters.priceRange[1]}`,
            value: filters.priceRange
        });
    }

    if (filters.availability !== 'all') {
        const label = filters.availability === 'inStock' ? 'In Stock Only' : 'Bulk Available';
        // Note: Removing this filter is handled by Clear All, as it's a radio button.
        // Individual removal could be added if needed by setting availability back to 'all'.
    }

    if (activeFilters.length === 0) {
        return null;
    }

  return (
    <div className="mb-4 bg-blue-50 border border-blue-200 p-3 rounded-lg">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-gray-700 mr-2">Active Filters:</span>
        {activeFilters.map(filter => (
          <div key={`${filter.key}-${filter.label}`} className="flex items-center bg-white border border-gray-300 rounded-full text-xs font-medium pl-3 pr-1 py-1">
            <span className="text-gray-700">{filter.label}</span>
            <button onClick={() => onRemove(filter.key as any, filter.value)} className="ml-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full p-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveFilters;
