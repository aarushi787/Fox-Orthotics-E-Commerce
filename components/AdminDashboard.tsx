import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import api from '../src/services/api.js';

const defaultProduct: Omit<Product, 'id'> = {
  name: '',
  sku: '',
  category: '',
  price: 0,
  originalPrice: 0,
  rating: 0,
  moq: 1,
  imageUrls: [],
  material: '',
  sizes: [],
  certifications: [],
  inStock: true,
  bulkAvailable: false,
  description: '',
  features: [],
};

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(defaultProduct);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    api.getProducts().then(setProducts);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };


  const handleAddProduct = async () => {
    try {
      // Backend expects a single imageUrl, so use the first imageUrls entry or empty string
      const payload = {
        ...newProduct,
        imageUrl: newProduct.imageUrls[0] || '',
        sizes: newProduct.sizes,
        certifications: newProduct.certifications,
        features: newProduct.features,
      };
      const created = await api.request('/products', 'POST', payload);
      setProducts([...products, created]);
      setNewProduct(defaultProduct);
      alert('Product added successfully!');
    } catch (err) {
      alert('Failed to add product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.request(`/products/${id}`, 'DELETE');
      setProducts(products.filter(p => p.id !== id));
      if (selectedProductId === id) setSelectedProductId(null);
      alert('Product deleted.');
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-8 border p-4 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Name" className="border p-2 rounded" />
          <input name="sku" value={newProduct.sku} onChange={handleInputChange} placeholder="SKU" className="border p-2 rounded" />
          <input name="category" value={newProduct.category} onChange={handleInputChange} placeholder="Category" className="border p-2 rounded" />
          <input name="price" type="number" value={newProduct.price} onChange={handleInputChange} placeholder="Price" className="border p-2 rounded" />
          <input name="originalPrice" type="number" value={newProduct.originalPrice} onChange={handleInputChange} placeholder="Original Price" className="border p-2 rounded" />
          <input name="material" value={newProduct.material} onChange={handleInputChange} placeholder="Material" className="border p-2 rounded" />
          <input name="sizes" value={newProduct.sizes.join(',')} onChange={e => setNewProduct(prev => ({ ...prev, sizes: e.target.value.split(',').map(s => s.trim()) }))} placeholder="Sizes (comma separated)" className="border p-2 rounded" />
          <input name="certifications" value={newProduct.certifications.join(',')} onChange={e => setNewProduct(prev => ({ ...prev, certifications: e.target.value.split(',').map(s => s.trim()) }))} placeholder="Certifications (comma separated)" className="border p-2 rounded" />
          <input name="imageUrls" value={newProduct.imageUrls.join(',')} onChange={e => setNewProduct(prev => ({ ...prev, imageUrls: e.target.value.split(',').map(s => s.trim()) }))} placeholder="Image URLs (comma separated)" className="border p-2 rounded" />
          <input name="features" value={newProduct.features.join(',')} onChange={e => setNewProduct(prev => ({ ...prev, features: e.target.value.split(',').map(s => s.trim()) }))} placeholder="Features (comma separated)" className="border p-2 rounded" />
          <textarea name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Description" className="border p-2 rounded col-span-2" />
        </div>
        <button onClick={handleAddProduct} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Add Product</button>
      </div>
      <div className="border p-4 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Product List</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">ID</th>
              <th className="border-b p-2">Name</th>
              <th className="border-b p-2">SKU</th>
              <th className="border-b p-2">Category</th>
              <th className="border-b p-2">Price</th>
              <th className="border-b p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className={selectedProductId === product.id ? 'bg-blue-50' : ''}>
                <td className="p-2">{product.id}</td>
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.sku}</td>
                <td className="p-2">{product.category}</td>
                <td className="p-2">₹{product.price}</td>
                <td className="p-2">
                  <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
