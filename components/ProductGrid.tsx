import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: Product[];
    wishlist: number[];
    onToggleWishlist: (productId: number) => void;
    onAddToCart: (product: Product, quantity: number) => void;
    sortOption: string;
    onSortChange: (value: string) => void;
    onClearFilters: () => void; // Added for the empty state button
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, wishlist, onToggleWishlist, onAddToCart, sortOption, onSortChange, onClearFilters }) => {
    return (
        <div>
            <div className="bg-white p-3 rounded-lg shadow-sm border flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-600">Showing <span className="font-bold text-gray-800">{products.length}</span> results</p>
                </div>
                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                        <label htmlFor="sort-by" className="text-sm text-gray-600">Sort by:</label>
                        <select 
                            id="sort-by" 
                            className="text-sm font-medium border-gray-300 rounded-md shadow-sm focus:border-brand-accent focus:ring-brand-accent"
                            value={sortOption}
                            onChange={(e) => onSortChange(e.target.value)}
                        >
                            <option value="featured">Featured Products</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating">Avg. Customer Review</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            isWishlisted={wishlist.includes(product.id)}
                            onToggleWishlist={onToggleWishlist}
                            onAddToCart={onAddToCart}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm border">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">No Products Found</h3>
                    <p className="text-gray-500 mt-2 mb-6">Try adjusting your filters or search query to find what you're looking for.</p>
                     <button 
                        onClick={onClearFilters}
                        className="bg-brand-blue text-white font-bold py-2 px-5 rounded-lg hover:bg-brand-blue-dark transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;
