'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

export default function CartPage() {
  const router = useRouter();
  const { items, total, removeFromCart, updateQuantity } = useCart();
  const { addToast } = useToast();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      addToast('Product removed from cart', 'info', 2000);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId);
    addToast(`${productName} removed from cart`, 'info', 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link href="/products" className="inline-block bg-accent text-dark-text px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Header */}
              <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.productId} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Product Name */}
                      <div className="col-span-6">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-500 mt-1">ID: {item.productId}</p>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                            className="w-12 text-center border border-gray-300 rounded py-1 text-sm"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-right">
                        <p className="text-gray-900 font-medium">€{item.price.toFixed(2)}</p>
                      </div>

                      {/* Total */}
                      <div className="col-span-2 text-right">
                        <p className="text-gray-900 font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                        <button
                          onClick={() => handleRemove(item.productId, item.productName)}
                          className="text-red-500 hover:text-red-700 text-xs mt-1 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link href="/products" className="text-accent hover:underline font-medium">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>€0.00</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-accent text-dark-text py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => router.push('/products')}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

