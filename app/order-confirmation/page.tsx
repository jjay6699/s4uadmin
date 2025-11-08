'use client';

import React from 'react';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const orderId = `ORD-${Date.now()}`;
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow p-8 text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been successfully placed.</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-lg font-bold text-gray-900">{orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="text-lg font-bold text-gray-900">{orderDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong> You will receive an email confirmation shortly with payment instructions and tracking information.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/products" className="block w-full bg-accent text-dark-text py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
              Continue Shopping
            </Link>
            <Link href="/" className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Fast Processing</h3>
            </div>
            <p className="text-sm text-gray-600">Your order will be processed within 24 hours.</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Secure Packaging</h3>
            </div>
            <p className="text-sm text-gray-600">Your products are carefully packaged for safe delivery.</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">24/7 Support</h3>
            </div>
            <p className="text-sm text-gray-600">Our support team is always available to help you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

