'use client';

import React, { useState, useEffect } from 'react';

interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  instructions: string;
  accountDetails?: string;
}

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PaymentMethod>>({});

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('/api/admin/payment-methods', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPaymentMethods(data.paymentMethods || []);
        }
      } catch (error) {
        console.error('Failed to fetch payment methods:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleEdit = (method: PaymentMethod) => {
    setEditingId(method.id);
    setFormData(method);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/payment-methods/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Update local state
        setPaymentMethods((prev) =>
          prev.map((method) =>
            method.id === editingId ? { ...method, ...formData } as PaymentMethod : method
          )
        );
        setEditingId(null);
        setFormData({});
      } else {
        alert('Failed to update payment method');
      }
    } catch (error) {
      console.error('Failed to update payment method:', error);
      alert('Failed to update payment method');
    }
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/payment-methods/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        setPaymentMethods((prev) =>
          prev.map((method) =>
            method.id === id ? { ...method, enabled } : method
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle payment method:', error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Payment Methods</h1>
        <p className="text-sm text-gray-500 mt-1">Manage payment options and instructions for customers</p>
      </div>

      {/* Payment Methods List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
            Loading payment methods...
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
            No payment methods found
          </div>
        ) : (
          paymentMethods.map((method) => (
            <div key={method.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {editingId === method.id ? (
                /* Edit Mode */
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <input
                        type="checkbox"
                        name="enabled"
                        checked={formData.enabled || false}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-400"
                      />
                      Enable this payment method
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Instructions
                    </label>
                    <textarea
                      name="instructions"
                      value={formData.instructions || ''}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                      placeholder="Enter instructions for customers..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Details (Optional)
                    </label>
                    <textarea
                      name="accountDetails"
                      value={formData.accountDetails || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                      placeholder="Bank account number, IBAN, etc..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-6 rounded-md transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-6 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                          method.enabled
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-gray-50 text-gray-700 border border-gray-200'
                        }`}>
                          {method.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={method.enabled}
                          onChange={(e) => handleToggle(method.id, e.target.checked)}
                          className="rounded border-gray-300 text-gray-900 focus:ring-gray-400"
                        />
                        Active
                      </label>
                      <button
                        onClick={() => handleEdit(method)}
                        className="text-gray-600 hover:text-gray-900 font-medium text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {method.instructions && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Instructions</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{method.instructions}</p>
                    </div>
                  )}

                  {method.accountDetails && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Account Details</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded border border-gray-200">
                        {method.accountDetails}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

