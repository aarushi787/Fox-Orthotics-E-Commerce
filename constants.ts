import { FiltersState } from './types';

export const CATEGORIES = [
    { name: 'Lumbar & Back Support', count: 23 },
    { name: 'Wrist & Hand Braces', count: 22 },
    { name: 'Knee Support & Braces', count: 20 },
    { name: 'Ankle & Foot Support', count: 14 },
    { name: 'Mobility & Support Aids', count: 12 },
    { name: 'Cervical Collars', count: 5 },
];


export const SIZES = ['Universal', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Left', 'Right'];
export const CERTIFICATIONS = ['ISO Certified', 'FDA Approved', 'CE Certified'];
export const AVAILABILITY_OPTIONS = [
    { id: 'all', label: 'All Products' },
    { id: 'inStock', label: 'In Stock Only' },
    { id: 'bulk', label: 'Bulk Available' },
];

export const INITIAL_FILTERS: FiltersState = {
  categories: [],
  priceRange: [0, 2000],
  sizes: [],
  certifications: [],
  availability: 'all',
};

// Expose Razorpay key from Vite environment (set VITE_RAZORPAY_KEY_ID in .env)
export const RAZORPAY_KEY_ID = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || '';
