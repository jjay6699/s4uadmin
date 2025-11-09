'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  tax: number;
  total: number;
}

interface OrderNote {
  id: string;
  type: 'system' | 'private' | 'customer';
  content: string;
  author: string;
  date: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  billing: {
    firstName: string;
    lastName: string;
    company: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping: {
    firstName: string;
    lastName: string;
    company: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  items: OrderItem[];
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingMethod: string;
  shippingCost: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  date: string;
  notes: OrderNote[];
  customerNote: string;
  transactionId: string;
  ipAddress: string;
}

export default function EditOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItems, setEditingItems] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'private' | 'customer'>('private');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!order) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        alert('Order updated successfully!');
        router.push('/admin-s4u-dashboard/orders');
      } else {
        alert('Failed to update order');
      }
    } catch (error) {
      console.error('Failed to save order:', error);
      alert('Failed to update order');
    } finally {
      setIsSaving(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim() || !order) return;

    const note: OrderNote = {
      id: Date.now().toString(),
      type: noteType,
      content: newNote,
      author: 'Admin',
      date: new Date().toISOString(),
    };

    setOrder({
      ...order,
      notes: [...order.notes, note],
    });

    setNewNote('');
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (!order) return;
    const newItems = [...order.items];
    newItems[index].quantity = quantity;
    newItems[index].total = quantity * newItems[index].price;
    
    setOrder({
      ...order,
      items: newItems,
    });
  };

  const removeItem = (index: number) => {
    if (!order) return;
    const newItems = order.items.filter((_, i) => i !== index);
    setOrder({
      ...order,
      items: newItems,
    });
  };

  const recalculateTotals = () => {
    if (!order) return;

    const subtotal = order.items.reduce((sum, item) => sum + item.total, 0);
    const tax = order.items.reduce((sum, item) => sum + item.tax * item.quantity, 0);
    const total = subtotal + tax + order.shippingCost - order.discount;

    setOrder({
      ...order,
      subtotal,
      tax,
      total,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-50 text-blue-700 border-blue-200',
      'on-hold': 'bg-gray-50 text-gray-700 border-gray-200',
      completed: 'bg-green-50 text-green-700 border-green-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
      refunded: 'bg-purple-50 text-purple-700 border-purple-200',
      failed: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getNoteColor = (type: string) => {
    const colors: Record<string, string> = {
      system: 'bg-purple-50 border-purple-200',
      private: 'bg-gray-50 border-gray-200',
      customer: 'bg-blue-50 border-blue-200',
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-gray-500">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-gray-500">Order not found</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.date).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/admin-s4u-dashboard/orders')}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 px-4 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Order'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
              <button
                onClick={() => setEditingItems(!editingItems)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {editingItems ? 'Done Editing' : 'Edit Items'}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tax</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total</th>
                    {editingItems && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.productName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(item.price)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {editingItems ? (
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded"
                            min="0"
                          />
                        ) : (
                          item.quantity
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(item.tax * item.quantity)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(item.total)}</td>
                      {editingItems && (
                        <td className="px-6 py-4">
                          <button
                            onClick={() => removeItem(index)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Totals */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="max-w-sm ml-auto space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-red-600">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping ({order.shippingMethod}):</span>
                  <span className="font-medium text-gray-900">{formatCurrency(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-300">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">{formatCurrency(order.total)}</span>
                </div>
              </div>
              {editingItems && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={recalculateTotals}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md"
                  >
                    Recalculate Totals
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Order Notes</h3>
            </div>
            <div className="p-6">
              {/* Existing Notes */}
              <div className="space-y-3 mb-6">
                {order.notes.map((note) => (
                  <div key={note.id} className={`p-4 border rounded-lg ${getNoteColor(note.type)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-gray-600 uppercase">{note.type} Note</span>
                      <span className="text-xs text-gray-500">{new Date(note.date).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-900">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-1">by {note.author}</p>
                  </div>
                ))}
              </div>

              {/* Add New Note */}
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Note</label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                  placeholder="Add a note about this order..."
                />
                <div className="flex justify-between items-center mt-3">
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value as 'private' | 'customer')}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  >
                    <option value="private">Private Note</option>
                    <option value="customer">Note to Customer</option>
                  </select>
                  <button
                    onClick={addNote}
                    className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded-md"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Status</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Order Status</label>
                <select
                  value={order.status}
                  onChange={(e) => setOrder({ ...order, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="pending">Pending Payment</option>
                  <option value="processing">Processing</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  value={order.paymentStatus}
                  onChange={(e) => setOrder({ ...order, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Customer</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">{order.customer.name}</p>
              <p className="text-gray-600">{order.customer.email}</p>
              <p className="text-gray-600">{order.customer.phone}</p>
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Billing Address</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{order.billing.firstName} {order.billing.lastName}</p>
              {order.billing.company && <p>{order.billing.company}</p>}
              <p>{order.billing.address1}</p>
              {order.billing.address2 && <p>{order.billing.address2}</p>}
              <p>{order.billing.city}, {order.billing.state} {order.billing.postcode}</p>
              <p>{order.billing.country}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Shipping Address</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{order.shipping.firstName} {order.shipping.lastName}</p>
              {order.shipping.company && <p>{order.shipping.company}</p>}
              <p>{order.shipping.address1}</p>
              {order.shipping.address2 && <p>{order.shipping.address2}</p>}
              <p>{order.shipping.city}, {order.shipping.state} {order.shipping.postcode}</p>
              <p>{order.shipping.country}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
              {order.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-xs text-gray-900">{order.transactionId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">IP Address:</span>
                <span className="font-mono text-xs text-gray-900">{order.ipAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

