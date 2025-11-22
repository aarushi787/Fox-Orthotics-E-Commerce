import React, { useState } from 'react';
import { CartItem } from '../types';
import { ShoppingCartIcon } from './icons';
import api from '../src/services/api.js';
import { RAZORPAY_KEY_ID } from '../constants';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, onUpdateQuantity, onRemoveItem }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = +(subtotal * 0.05).toFixed(2); // 5% GST
  const total = +(subtotal + tax).toFixed(2);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const MIN_QTY = 50;

  if (cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{minHeight: '50vh'}}>
        <div className="text-center p-10 bg-white rounded-lg shadow-sm border max-w-md mx-auto">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-accent-light mb-6">
            <ShoppingCartIcon className="w-8 h-8 text-brand-accent" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Your cart is empty</h3>
          <p className="text-gray-500 mt-2 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <a href="#/" className="inline-block bg-brand-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-blue-dark transition-all duration-300 transform hover:scale-105">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900">Your Shopping Cart</h1>
        </div>
        <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Cart Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</h2>
                <div className="space-y-4">
                    {cartItems.map(({ product, quantity }) => (
                        <div key={product.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                            <a href={`#/product/${product.id}`}>
                              <img src={product.imageUrls[0]} alt={product.name} className="w-24 h-24 object-cover rounded-md border" />
                            </a>
                            <div className="flex-grow">
                                <a href={`#/product/${product.id}`} className="font-semibold text-gray-800 hover:text-brand-blue">{product.name}</a>
                                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                <button onClick={() => onRemoveItem(product.id)} className="text-xs text-red-500 hover:underline mt-1">Remove</button>
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                  type="number"
                                  value={quantity}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value || '0', 10);
                                    onUpdateQuantity(product.id, val);
                                  }}
                                  min={MIN_QTY}
                                  className="w-16 border-gray-300 rounded-md text-center"
                                />
                                <p className="font-semibold w-24 text-right">₹{(product.price * quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-1">
                 <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>GST (5%)</span>
                          <span>₹{tax.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between text-gray-600 border-b pb-3">
                            <span>Shipping</span>
                            <span className="font-semibold text-green-600">FREE</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg text-gray-900 pt-2">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                    {checkoutError && <p className="text-sm text-red-500 mb-2">{checkoutError}</p>}
                    <button
                      onClick={async () => {
                        setCheckoutError(null);
                        // Validate min quantities before checkout
                        for (const item of cartItems) {
                          if (item.quantity < MIN_QTY) {
                            setCheckoutError(`Minimum order quantity for "${item.product.name}" is ${MIN_QTY} pieces.`);
                            return;
                          }
                        }

                        try {
                          // Create razorpay order on server
                          const razorpayOrder = await api.createRazorpayOrder(total);

                          // Load Razorpay script if not loaded
                          if (!(window as any).Razorpay) {
                            await new Promise((resolve, reject) => {
                              const script = document.createElement('script');
                              script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                              script.onload = resolve;
                              script.onerror = reject;
                              document.body.appendChild(script);
                            });
                          }

                          const options = {
                            key: RAZORPAY_KEY_ID,
                            amount: razorpayOrder.amount, // amount in paise
                            currency: razorpayOrder.currency || 'INR',
                            name: 'Fox Orthotics',
                            description: 'Order Payment',
                            order_id: razorpayOrder.id,
                            handler: async function (response: any) {
                              try {
                                // After successful payment, create order in backend
                                await api.createOrder(
                                  cartItems.map(ci => ({ productId: ci.product.id, quantity: ci.quantity, price: ci.product.price })),
                                  total,
                                  tax,
                                  0,
                                  'Customer provided at checkout',
                                  `razorpay_payment_id:${response.razorpay_payment_id}`
                                );
                                // Redirect to orders or show success
                                window.location.href = '#/orders';
                              } catch (err) {
                                console.error(err);
                                setCheckoutError('Payment succeeded but failed to create order. Please contact support.');
                              }
                            },
                            prefill: {
                              // Optionally prefill user info if available
                            },
                            notes: {},
                            theme: { color: '#2563eb' }
                          };

                          const rzp = new (window as any).Razorpay(options);
                          rzp.open();

                        } catch (err) {
                          console.error(err);
                          setCheckoutError('Unable to initialize payment. Please try again later.');
                        }
                      }}
                      className="w-full mt-6 bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-brand-blue-dark transition-colors"
                    >
                      Proceed to Checkout
                    </button>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default CartPage;
