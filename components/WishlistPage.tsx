import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { HeartIcon } from './icons';

interface WishlistPageProps {
    wishlist: number[];
    allProducts: Product[];
    onToggleWishlist: (productId: number) => void;
    onAddToCart: (product: Product, quantity: number) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ wishlist, allProducts, onToggleWishlist, onAddToCart }) => {
    const wishlistedProducts = allProducts.filter(p => wishlist.includes(p.id));

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900">Your Wishlist</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Your favorite products, all in one place.
                </p>
            </div>

            {wishlistedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistedProducts.map(product => (
                        <ProductCard 
                            key={product.id}
                            product={product}
                            isWishlisted={true}
                            onToggleWishlist={onToggleWishlist}
                            onAddToCart={onAddToCart}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-6 bg-white rounded-lg shadow-sm border">
                    <HeartIcon className="w-16 h-16 mx-auto text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-800 mt-6">Your wishlist is empty</h3>
                    <p className="text-gray-500 mt-2 mb-6">
                        Looks like you haven't added any products to your wishlist yet.
                    </p>
                    <a href="#/" className="inline-block bg-brand-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-blue-dark transition-colors">
                        Start Shopping
                    </a>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
