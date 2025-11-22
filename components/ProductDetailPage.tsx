import React, { useState, useRef } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { StarIcon, HeartIcon, ShoppingCartIcon, ShieldCheckIcon, CheckIcon, TruckIcon } from './icons';
import ImageGallery from './ImageGallery';

interface ProductDetailPageProps {
    product: Product;
    allProducts: Product[];
    wishlist: number[];
    onToggleWishlist: (productId: number) => void;
    onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, allProducts, wishlist, onToggleWishlist, onAddToCart }) => {
    const { id, name, sku, price, originalPrice, rating, moq, imageUrls, description, features, sizes, material, certifications, inStock } = product;
    const [selectedImage, setSelectedImage] = useState(imageUrls[0]);
    
    const savePercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
    const [selectedSize, setSelectedSize] = useState(sizes[0]);
    const [quantity, setQuantity] = useState(1);
    
    const [zoomStyle, setZoomStyle] = useState({});
    const imageContainerRef = useRef<HTMLDivElement>(null);
    
    const relatedProducts = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 3);

    // Build JSON-LD for structured data (Product schema)
    const productUrl = (typeof window !== 'undefined' ? window.location.origin : '') + `#/product/${id}`;
    const imagesFull = imageUrls && imageUrls.length ? imageUrls.map(img => (typeof window !== 'undefined' ? `${window.location.origin}/${img}` : img)) : [];
    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name,
        image: imagesFull,
        description,
        sku,
        mpn: sku,
        brand: { "@type": "Brand", name: "Fox Orthotics" },
        offers: {
            "@type": "Offer",
            url: productUrl,
            priceCurrency: "INR",
            price: String(price),
            availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition"
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating,
            reviewCount: Math.max(1, Math.round(rating * 10))
        }
    };

    const isCurrentProductWishlisted = wishlist.includes(id);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current) return;
        
        const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: 'scale(2)',
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({
            transformOrigin: 'center center',
            transform: 'scale(1)',
        });
    };
    
    const specData = [
        { label: 'Product Code', value: sku },
        { label: 'Material', value: material },
        { label: 'Available Sizes', value: sizes.join(', ') },
        { label: 'Minimum Order', value: `${moq} pieces` },
        { label: 'Certifications', value: certifications.map(c => <span key={c} className="inline-block bg-gray-100 text-gray-700 text-xs font-medium mr-2 px-2.5 py-1 rounded-full">{c}</span>) },
        { label: 'Stock Status', value: inStock ? <span className="text-green-600 font-bold">In Stock</span> : <span className="text-red-600 font-bold">Out of Stock</span> },
    ];

    return (
        <div className="bg-slate-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
             <div className="mb-4 text-sm text-gray-500">
                <a href="#/" className="hover:text-brand-blue">Home</a> / 
                <a href={`#/category/${product.category.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-')}`} className="hover:text-brand-blue"> {product.category}</a> / 
                <span className="text-gray-800 font-medium"> {name}</span>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div>
                        <div ref={imageContainerRef} className="relative w-full h-auto">
                            <ImageGallery
                                productName={name}
                                initialUrls={imageUrls}
                                selectedImage={selectedImage}
                                onSelect={(url) => setSelectedImage(url)}
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <a href={`#/category/${product.category.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-')}`} className="text-sm font-medium text-brand-accent hover:underline">{product.category}</a>
                        <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{name}</h1>
                        
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                <StarIcon className="w-5 h-5" />
                                <span className="font-bold">{rating}</span>
                            </div>
                             {inStock ? (
                                <span className="text-sm font-semibold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">In Stock</span>
                            ) : (
                                <span className="text-sm font-semibold text-red-600 bg-red-100 px-2.5 py-1 rounded-full">Out of Stock</span>
                            )}
                        </div>
                        
                        <p className="text-gray-600 text-base leading-relaxed mb-6">{description}</p>
                        
                        <div className="bg-slate-50 p-4 rounded-lg mb-6">
                            <p className="text-lg text-gray-500">
                                M.R.P: <span className="line-through">₹{originalPrice.toFixed(2)}</span>
                                <span className="ml-3 bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-md">SAVE {savePercentage}%</span>
                            </p>
                            <p className="text-4xl font-extrabold text-gray-900">₹{price.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">(Inclusive of all taxes)</p>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-800 mb-2">Select Size</h3>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${selectedSize === size ? 'bg-brand-accent text-white border-brand-accent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                         {/* Quantity and Actions */}
                        <div className="flex items-center gap-4 mb-6">
                             <div>
                                <label htmlFor="quantity" className="sr-only">Quantity</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    min="1"
                                    className="w-20 border-gray-300 rounded-md shadow-sm text-center focus:border-brand-accent focus:ring-brand-accent"
                                />
                            </div>
                            <button 
                                onClick={() => onAddToCart(product, quantity)}
                                className="flex-1 flex items-center justify-center gap-2 bg-brand-blue text-white rounded-lg py-3.5 text-base font-bold transition-all duration-300 hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                            >
                                <ShoppingCartIcon className="w-5 h-5" />
                                Add to Cart
                            </button>
                             <button 
                                onClick={() => onToggleWishlist(id)}
                                className="bg-gray-100 p-3.5 rounded-lg text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                                aria-label={isCurrentProductWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <HeartIcon className="w-6 h-6" filled={isCurrentProductWishlisted} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-md border">
                     <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications & Features</h2>
                     <div className="flow-root">
                        <dl className="-my-3 divide-y divide-gray-100 text-sm">
                            {specData.map((spec, index) => (
                                <div key={index} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-800">{spec.label}</dt>
                                    <dd className="text-gray-600 sm:col-span-2">{spec.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                     <div className="mt-8">
                        <h3 className="text-md font-bold text-gray-800 mb-3">Key Features</h3>
                        <ul className="space-y-2 text-gray-600">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="md:col-span-1">
                     <div className="bg-white p-6 rounded-lg shadow-md border space-y-4">
                        <div className="flex items-center gap-3">
                            <TruckIcon className="w-8 h-8 text-brand-blue" />
                            <div>
                                <h4 className="font-bold text-gray-800">Pan-India Delivery</h4>
                                <p className="text-sm text-gray-500">Fast & reliable shipping across the country.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheckIcon className="w-8 h-8 text-brand-blue" />
                            <div>
                                <h4 className="font-bold text-gray-800">Quality Assured</h4>
                                <p className="text-sm text-gray-500">100% genuine products from certified sources.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">You Might Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedProducts.map(p => (
                            <ProductCard 
                                key={p.id}
                                product={p}
                                isWishlisted={wishlist.includes(p.id)}
                                onToggleWishlist={onToggleWishlist}
                                onAddToCart={onAddToCart}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;
