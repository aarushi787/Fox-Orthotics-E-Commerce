import React, { useState, useCallback, useEffect } from 'react';
import { AIIcon, PhoneIcon, MailIcon, LocationMarkerIcon, SearchIcon, UserIcon, ShoppingCartIcon, HeartIcon } from './icons';
import { CATEGORIES } from '../constants';
import { Product } from '../types';
import SearchSuggestions from './SearchSuggestions';

interface HeaderProps {
    products: Product[];
    wishlistCount: number;
    cartCount: number;
    onAiFinderClick: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const slugify = (text: string) => text.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-');

const Header: React.FC<HeaderProps> = ({ products, wishlistCount, cartCount, onAiFinderClick, searchQuery, setSearchQuery }) => {
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

    useEffect(() => {
        if (searchQuery.length > 1) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(lowerCaseQuery) ||
                p.sku.toLowerCase().includes(lowerCaseQuery) ||
                p.category.toLowerCase().includes(lowerCaseQuery)
            ).sort((a, b) => {
                const aStarts = a.name.toLowerCase().startsWith(lowerCaseQuery);
                const bStarts = b.name.toLowerCase().startsWith(lowerCaseQuery);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                return 0;
            }).slice(0, 8);
            setSuggestions(filtered);
            setIsSuggestionsVisible(true);
        } else {
            setSuggestions([]);
            setIsSuggestionsVisible(false);
        }
    }, [searchQuery, products]);
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSuggestionClick = (product: Product) => {
        setSearchQuery(product.name);
        setIsSuggestionsVisible(false);
        window.location.hash = `#/product/${product.id}`;
    };
    
    return (
        <header className="bg-white shadow-md sticky top-0 z-30">
            {/* Top Bar */}
            <div className="bg-gray-100 text-gray-600 text-xs py-2">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <a href="tel:+919876543210" className="flex items-center gap-1 hover:text-brand-blue transition-colors">
                            <PhoneIcon className="w-4 h-4" />
                            <span>+91 98765 43210</span>
                        </a>
                        <a href="mailto:sales@foxorthotics.com" className="flex items-center gap-1 hover:text-brand-blue transition-colors">
                            <MailIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">sales@foxorthotics.com</span>
                        </a>
                        <div className="hidden md:flex items-center gap-1">
                            <LocationMarkerIcon className="w-4 h-4" />
                            <span>New Delhi, India</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">GST REGISTERED</div>
                        <a href="#/dealer" className="hover:text-brand-blue transition-colors font-medium">Become a Dealer</a>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <a href="#/" className="flex items-center gap-2 cursor-pointer">
                        <div className="bg-white p-2 rounded-full">
                           <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>
                        </div>
                        <div>
                             <h1 className="text-xl font-bold text-white">Fox Orthotics</h1>
                             <p className="text-xs text-gray-300 hidden sm:block">Premium Orthopedic Solutions</p>
                        </div>
                    </a>
                    
                    <div className="flex-1 max-w-2xl mx-4 sm:mx-8 flex items-center gap-2 relative">
                         <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search by product name, category, or SKU..."
                                className="w-full py-2.5 pl-4 pr-12 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => searchQuery.length > 1 && setIsSuggestionsVisible(true)}
                                onBlur={() => setTimeout(() => setIsSuggestionsVisible(false), 200)}
                            />
                            <button className="absolute inset-y-0 right-0 px-4 flex items-center bg-brand-blue-dark text-white rounded-r-md hover:bg-blue-900 transition-colors">
                                <SearchIcon className="w-5 h-5" />
                            </button>
                             {isSuggestionsVisible && suggestions.length > 0 && <SearchSuggestions suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />}
                        </div>
                        <button onClick={onAiFinderClick} className="flex-shrink-0 flex items-center gap-2 bg-brand-accent text-white px-4 py-2.5 rounded-md hover:bg-purple-700 transition-all duration-300 hover:scale-105 active:scale-95" title="AI Product Finder">
                            <AIIcon className="w-5 h-5" />
                            <span className="text-sm font-semibold hidden lg:inline">AI Finder</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 text-white">
                        <a href="#/login" className="flex flex-col items-center hover:text-gray-300 transition-colors">
                            <UserIcon className="w-6 h-6"/>
                            <span className="text-xs hidden sm:inline">Account</span>
                        </a>
                         <a href="#/wishlist" className="relative flex flex-col items-center hover:text-gray-300 transition-colors">
                            <HeartIcon className="w-6 h-6"/>
                            <span className="text-xs hidden sm:inline">Wishlist</span>
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlistCount}</span>
                            )}
                        </a>
                        <a href="#/cart" className="relative flex flex-col items-center hover:text-gray-300 transition-colors">
                            <ShoppingCartIcon className="w-6 h-6"/>
                            <span className="text-xs hidden sm:inline">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
                            )}
                        </a>
                    </div>
                </div>
            </div>
            
            {/* Navigation Bar */}
            <nav className="border-b bg-white hidden md:block">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex gap-1">
                        <a href="#/" className="font-semibold text-gray-700 hover:bg-gray-100 hover:text-brand-blue px-4 py-3 transition-colors text-sm">Home</a>
                        <a href="#/" className="font-semibold bg-brand-accent-light text-brand-accent px-4 py-3 text-sm">All Products</a>
                        {CATEGORIES.slice(0, 5).map(cat => (
                            <a key={cat.name} href={`#/category/${slugify(cat.name)}`} className="text-gray-700 hover:bg-gray-100 hover:text-brand-blue px-4 py-3 transition-colors text-sm font-medium hidden lg:inline-block">{cat.name}</a>
                        ))}
                        {/* Admin link removed from frontend */}
                    </div>
                    <a href="#/dealer" className="text-red-600 font-bold hover:bg-red-50 px-4 py-3 transition-colors text-sm">Bulk Orders</a>
                </div>
            </nav>

        </header>
    );
};

export default Header;
