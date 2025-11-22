import React, { useState } from 'react';
import Filters from './Filters';
import ProductGrid from './ProductGrid';
import ActiveFilters from './ActiveFilters';
import { Product, FiltersState } from '../types';

interface ProductListingPageProps {
    products: Product[];
    filters: FiltersState;
    searchQuery: string;
    onFilterChange: (newFilters: Partial<FiltersState>) => void;
    onClearFilters: () => void;
    onRemoveActiveFilter: (key: keyof FiltersState | 'search', value?: any) => void;
    wishlist: number[];
    onToggleWishlist: (productId: number) => void;
    onAddToCart: (product: Product, quantity: number) => void;
    sortOption: string;
    onSortChange: (value: string) => void;
    pageTitle: string;
}

const ProductListingPage: React.FC<ProductListingPageProps> = (props) => {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">
                    <a href="#/" className="hover:text-brand-blue cursor-pointer">Home</a> / <span className="text-gray-800 font-medium">{props.pageTitle}</span>
                </div>
                <button 
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 p-2 px-3 rounded-md bg-white border border-gray-300 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
                    aria-label="Open filters"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    <span>Show Filters</span>
                </button>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Desktop Sidebar - Always visible */}
              <aside className="hidden lg:block lg:w-1/4">
                <Filters 
                  filters={props.filters} 
                  onFilterChange={props.onFilterChange} 
                  onClear={props.onClearFilters}
                />
              </aside>

               {/* Mobile Off-canvas Filters */}
              <div className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isMobileFiltersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                 {/* Overlay */}
                 <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileFiltersOpen(false)}></div>
                 
                 {/* Content */}
                 <div className={`relative bg-white h-full w-4/5 max-w-xs shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                     <div className="p-4 flex justify-between items-center border-b">
                         <h2 className="text-lg font-bold">Filters</h2>
                         <button onClick={() => setIsMobileFiltersOpen(false)} className="text-2xl font-light" aria-label="Close filters">&times;</button>
                     </div>
                     <div className="overflow-y-auto h-[calc(100%-65px)]">
                         <Filters 
                             filters={props.filters} 
                             onFilterChange={props.onFilterChange} 
                             onClear={props.onClearFilters}
                         />
                     </div>
                 </div>
              </div>

              <div className="flex-1">
                <ActiveFilters 
                    filters={props.filters}
                    searchQuery={props.searchQuery}
                    onRemove={props.onRemoveActiveFilter}
                />
                <ProductGrid 
                    products={props.products} 
                    wishlist={props.wishlist}
                    onToggleWishlist={props.onToggleWishlist}
                    onAddToCart={props.onAddToCart}
                    sortOption={props.sortOption}
                    onSortChange={props.onSortChange}
                    onClearFilters={props.onClearFilters}
                />
              </div>
            </div>
        </>
    );
};

export default ProductListingPage;
