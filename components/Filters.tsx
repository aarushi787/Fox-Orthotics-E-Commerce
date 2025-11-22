
import React, { useState } from 'react';
import { FiltersState } from '../types';
import { CATEGORIES, SIZES, CERTIFICATIONS, AVAILABILITY_OPTIONS } from '../constants';

interface FiltersProps {
  filters: FiltersState;
  onFilterChange: (newFilters: Partial<FiltersState>) => void;
  onClear: () => void;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="py-4 border-b">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && <div className="mt-4">{children}</div>}
        </div>
    );
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, onClear }) => {

    const handleCheckboxChange = (group: keyof FiltersState, value: string) => {
        const currentValues = (filters[group] as string[]) || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        onFilterChange({ [group]: newValues });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center pb-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button onClick={onClear} className="text-sm font-medium text-brand-blue hover:underline">Clear All</button>
            </div>
            
            <FilterSection title="Product Categories">
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {CATEGORIES.map(category => (
                        <li key={category.name} className="flex items-center justify-between">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(category.name)}
                                    onChange={() => handleCheckboxChange('categories', category.name)}
                                    className="h-4 w-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
                                />
                                <span className="text-sm text-gray-600">{category.name}</span>
                            </label>
                            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{category.count}</span>
                        </li>
                    ))}
                </ul>
            </FilterSection>

            <FilterSection title={`Price Range (₹)`}>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="2000"
                    step="10"
                    value={filters.priceRange[1]}
                    onChange={(e) => onFilterChange({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
            </FilterSection>



             <FilterSection title="Available Sizes">
                <div className="flex flex-wrap gap-2">
                    {SIZES.map(size => (
                        <button
                            key={size}
                            onClick={() => handleCheckboxChange('sizes', size)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${filters.sizes.includes(size) ? 'bg-brand-accent-light text-brand-accent border-brand-accent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </FilterSection>
            
            <FilterSection title="Certification">
                <ul className="space-y-2">
                    {CERTIFICATIONS.map(cert => (
                         <li key={cert}>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.certifications.includes(cert)}
                                    onChange={() => handleCheckboxChange('certifications', cert)}
                                    className="h-4 w-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
                                />
                                <span className="text-sm text-gray-600">{cert}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </FilterSection>

            <FilterSection title="Availability">
                 <ul className="space-y-2">
                    {AVAILABILITY_OPTIONS.map(option => (
                        <li key={option.id}>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="availability"
                                    value={option.id}
                                    checked={filters.availability === option.id}
                                    onChange={(e) => onFilterChange({ availability: e.target.value as any })}
                                    className="h-4 w-4 border-gray-300 text-brand-accent focus:ring-brand-accent"
                                />
                                <span className="text-sm text-gray-600">{option.label}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </FilterSection>

        </div>
    );
};

export default Filters;
