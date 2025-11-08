'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'eu_bank',
    shippingOption: 'regular',
  });

  const shippingOptions = [
    { value: 'regular', label: 'Regular Packaging (without more fees)', fee: 0 },
    { value: 'discrete', label: 'Discrete packaging for maximum privacy', fee: 15 },
    { value: 'austria', label: 'Extra shipping fee for sending from Austria (mandatory for Danish customers)', fee: 25 },
  ];

  const shippingFee = shippingOptions.find(opt => opt.value === formData.shippingOption)?.fee || 0;
  const totalWithShipping = total + shippingFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add products to your cart before checking out.</p>
            <Link href="/products" className="inline-block bg-accent text-dark-text px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city || !formData.country) {
      addToast('Please fill in all required fields', 'error', 3000);
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Clear cart and redirect to confirmation
      clearCart();
      addToast('Order placed successfully!', 'success', 2000);
      router.push('/order-confirmation');
    } catch (error) {
      addToast('Failed to place order. Please try again.', 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Options */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-2">More shipping options for your satisfaction <span className="text-red-500">*</span></h2>
                <p className="text-sm text-gray-600 mb-6">Select your preferred shipping option</p>

                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <label key={option.value} className="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="shippingOption"
                        value={option.value}
                        checked={formData.shippingOption === option.value}
                        onChange={handleInputChange}
                        className="w-4 h-4 mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <p className="font-medium text-gray-900">{option.label}</p>
                        {option.fee > 0 && (
                          <p className="text-sm text-gray-600 mt-1">+ €{option.fee.toFixed(2)}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                
                <div className="space-y-3">
                  {[
                    { value: 'eu_bank', label: 'EU Bank Transfer' },
                    { value: 'us_bank', label: 'US Bank Transfer' },
                    { value: 'uk_bank', label: 'UK Bank Transfer' },
                    { value: 'card_paypal', label: 'Credit Card / PayPal' },
                    { value: 'bitcoin', label: 'Bitcoin' },
                  ].map((method) => (
                    <label key={method.value} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleInputChange}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-medium text-gray-700">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-dark-text py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.productName} x{item.quantity}</span>
                    <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className={shippingFee > 0 ? 'font-medium' : 'text-green-600 font-medium'}>
                    {shippingFee > 0 ? `€${shippingFee.toFixed(2)}` : 'Free'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>€{totalWithShipping.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

