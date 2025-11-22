export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  moq: number;
  imageUrls: string[];
  material: string;
  sizes: string[];
  certifications: string[];
  inStock: boolean;
  bulkAvailable: boolean;
  description: string;
  features: string[];
}

export interface FiltersState {
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  certifications: string[];
  availability: 'all' | 'inStock' | 'bulk';
}

export interface CartItem {
  product: Product;
  quantity: number;
}