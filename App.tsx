
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import ProductDetailPage from './components/ProductDetailPage';
import ProductListingPage from './components/ProductListingPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import DealerPage from './components/DealerPage';
import WishlistPage from './components/WishlistPage';
import CartPage from './components/CartPage';
import Toast from './components/Toast';
import AIAdvisor from './components/AIAdvisor';
import { Product, FiltersState, CartItem } from './types';
import { INITIAL_FILTERS } from './constants';
import PageTransition from './components/PageTransition';
import SkeletonCard from './components/SkeletonCard';
import api from './src/services/api.js';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<number[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [sortOption, setSortOption] = useState('featured');
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' | 'error' | 'warning' } | null>(null);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        showToast('Failed to load products. Please check the backend connection.', 'error');
         // Fallback to local data if API fails
        try {
            const response = await fetch('/products.json');
            const data = await response.json();
            setProducts(data);
        } catch (fallbackError) {
             console.error("Failed to fetch fallback products:", fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleWishlist = (productId: number) => {
    const isWishlisted = wishlist.includes(productId);
    setWishlist(prevWishlist =>
      isWishlisted
        ? prevWishlist.filter(id => id !== productId)
        : [...prevWishlist, productId]
    );
    if (!isWishlisted) {
      showToast('Added to wishlist!', 'info');
    } else {
      showToast('Removed from wishlist.', 'info');
    }
  };
  
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    showToast('Added to cart!', 'success');
  };

  const handleUpdateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const applyFiltersAndSort = useCallback(() => {
    let tempProducts = [...products];
    const lowerCaseQuery = searchQuery.toLowerCase();

    if (searchQuery.length > 1) {
        tempProducts = tempProducts.filter(p => 
            p.name.toLowerCase().includes(lowerCaseQuery) ||
            p.sku.toLowerCase().includes(lowerCaseQuery) ||
            p.category.toLowerCase().includes(lowerCaseQuery) ||
            p.description.toLowerCase().includes(lowerCaseQuery)
        );
    }

    if (currentPath.startsWith('#/category/')) {
      const categorySlug = currentPath.split('/')[2];
      const categoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(' And ', ' & ');
      tempProducts = tempProducts.filter(p => p.category === categoryName);
    }

    if (Array.isArray(filters.categories) && filters.categories.length > 0) {
      tempProducts = tempProducts.filter(p => filters.categories.includes(p.category));
    }
    tempProducts = tempProducts.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
    // Material filter removed — no filtering by material.
    if (Array.isArray(filters.sizes) && filters.sizes.length > 0) {
      tempProducts = tempProducts.filter(p => filters.sizes.some(s => p.sizes.includes(s)));
    }
    if (Array.isArray(filters.certifications) && filters.certifications.length > 0) {
      tempProducts = tempProducts.filter(p => filters.certifications.every(c => p.certifications.includes(c)));
    }
    if (filters.availability === 'inStock') {
      tempProducts = tempProducts.filter(p => p.inStock);
    } else if (filters.availability === 'bulk') {
      tempProducts = tempProducts.filter(p => p.bulkAvailable);
    }

    switch (sortOption) {
      case 'price-asc':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        tempProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        tempProducts.sort((a, b) => a.id - b.id);
        break;
    }

    setFilteredProducts(tempProducts);
  }, [products, filters, searchQuery, sortOption, currentPath]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleFilterChange = (newFilters: Partial<FiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery('');
  };

  const handleRemoveActiveFilter = (key: keyof FiltersState | 'search', value?: any) => {
    if (key === 'search') {
      setSearchQuery('');
    } else if (key === 'priceRange') {
        setFilters(prev => ({ ...prev, priceRange: INITIAL_FILTERS.priceRange }));
    } else {
      setFilters(prev => {
        const currentValues = (prev[key as keyof FiltersState] as string[]) || [];
        const newValues = currentValues.filter(v => v !== value);
        return { ...prev, [key]: newValues };
      });
    }
  };
  
  const getCategoryFromPath = (path: string) => {
    if (path.startsWith('#/category/')) {
        const slug = path.split('/')[2];
        return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(' And ', ' & ');
    }
    return 'All Products';
  };
  
  const renderPage = () => {
    if (currentPath.startsWith('#/product/')) {
      const productId = parseInt(currentPath.split('/')[2], 10);
      const product = products.find(p => p.id === productId);
      return product ? (
        <ProductDetailPage 
          product={product} 
          allProducts={products}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
        />
      ) : <p>Product not found.</p>;
    }
    
    switch(currentPath) {
        case '#/login': return <LoginPage />;
        case '#/about': return <AboutPage />;
        case '#/contact': return <ContactPage />;
        case '#/dealer': return <DealerPage />;
        // Admin dashboard removed from frontend routing
        case '#/wishlist': return <WishlistPage 
                                    wishlist={wishlist} 
                                    allProducts={products} 
                                    onToggleWishlist={handleToggleWishlist} 
                                    onAddToCart={handleAddToCart} 
                                  />;
        case '#/cart': return <CartPage 
                                cartItems={cart} 
                                onUpdateQuantity={handleUpdateCartQuantity} 
                                onRemoveItem={handleRemoveFromCart}
                              />;
        case '#/':
        default:
             if (currentPath.startsWith('#/category/')) {
                 return (
                    <ProductListingPage 
                        products={filteredProducts}
                        filters={filters}
                        searchQuery={searchQuery}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                        onRemoveActiveFilter={handleRemoveActiveFilter}
                        wishlist={wishlist}
                        onToggleWishlist={handleToggleWishlist}
                        onAddToCart={handleAddToCart}
                        sortOption={sortOption}
                        onSortChange={setSortOption}
                        pageTitle={getCategoryFromPath(currentPath)}
                    />
                );
            }
            return (
                <ProductListingPage 
                    products={filteredProducts}
                    filters={filters}
                    searchQuery={searchQuery}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    onRemoveActiveFilter={handleRemoveActiveFilter}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                    pageTitle="All Products"
                />
            );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      <Header 
        products={products}
        wishlistCount={wishlist.length} 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onAiFinderClick={() => setIsAiAdvisorOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <PageTransition>
            {renderPage()}
          </PageTransition>
        )}
      </main>
      <Footer />
      <Toast message={toast?.message} type={toast?.type} isVisible={!!toast} />
      {isAiAdvisorOpen && (
          <AIAdvisor 
            products={products}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onClose={() => setIsAiAdvisorOpen(false)}
          />
      )}
    </div>
  );
};

// FIX: Add default export for App component to resolve import error.
export default App;
