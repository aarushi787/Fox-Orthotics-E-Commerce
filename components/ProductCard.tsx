
import React from 'react';
import { Product } from '../types';
import { StarIcon, HeartIcon, ShoppingCartIcon } from './icons';

interface ProductCardProps {
    product: Product;
    isWishlisted: boolean;
    onToggleWishlist: (productId: number) => void;
    onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isWishlisted, onToggleWishlist, onAddToCart }) => {
    const { id, name, price, originalPrice, rating, moq, imageUrls, inStock, category } = product;
    const safePrice = typeof price === 'number' ? price : Number(price) || 0;
    const safeOriginalPrice = typeof originalPrice === 'number' ? originalPrice : Number(originalPrice) || 0;
    const discount = safeOriginalPrice > 0 ? Math.round(((safeOriginalPrice - safePrice) / safeOriginalPrice) * 100) : 0;
    const fallbackImage = 'https://via.placeholder.com/300x200?text=No+Image';
    const mainImage = Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : fallbackImage;

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group border overflow-hidden animate-fade-in-up">
            <div className="relative overflow-hidden">
                <a href={`#/product/${id}`} className="block">
                    <img 
                        src={mainImage} 
                        alt={name} 
                        className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                    />
                </a>
                <button 
                    onClick={() => onToggleWishlist(id)}
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-300 z-10 active:scale-90"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <HeartIcon className="w-5 h-5" filled={isWishlisted} />
                </button>
                {discount > 5 && (
                     <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        {discount}% OFF
                    </div>
                )}
                 <div className="absolute bottom-3 left-3">
                    {inStock ? (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            In Stock
                        </span>
                    ) : (
                         <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                           <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            Out of Stock
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4 flex-grow flex flex-col">
                <a href={`#/category/${category.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-')}`} className="text-xs text-gray-500 hover:text-brand-accent transition-colors">{category}</a>
                <h3 className="font-bold text-gray-800 mt-1 flex-grow">
                     <a href={`#/product/${id}`} className="hover:text-brand-blue transition-colors leading-tight">
                        {name}
                     </a>
                </h3>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 bg-amber-400 text-white px-2 py-0.5 rounded-md shadow-sm">
                        <StarIcon className="w-4 h-4" />
                        <span className="text-sm font-bold">{rating}</span>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">MOQ: {moq}</div>
                </div>

                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <p className="text-xl font-bold text-brand-blue">₹{safePrice.toFixed(2)}</p>
                        {discount > 5 && <p className="text-xs text-gray-400 line-through">₹{safeOriginalPrice.toFixed(2)}</p>}
                    </div>
                </div>

                 <div className="mt-4 pt-4 border-t flex items-center justify-between gap-2">
                    <a href={`#/product/${id}`} className="flex-1 text-center bg-white border border-gray-300 text-gray-800 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 transform active:scale-95">
                        Details
                    </a>
                    <button 
                        onClick={() => onAddToCart(product, 1)}
                        disabled={!inStock}
                        className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <ShoppingCartIcon className="w-5 h-5" />
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// FIX: Added default export for ProductCard component to resolve import errors.
export default ProductCard;
