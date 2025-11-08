'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: string;
  trackingNumber?: string;
}

interface DeliveryAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'orders' | 'addresses' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    address: '123 Main Street',
    city: 'New York',
    postalCode: '10001',
    country: 'United States',
  });

  const [formData, setFormData] = useState(profile);
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>([
    {
      id: '1',
      label: 'Home',
      address: '123 Main Street',
      city: 'New York',
      postalCode: '10001',
      country: 'United States',
      isDefault: true,
    },
  ]);
  const [newAddress, setNewAddress] = useState<Omit<DeliveryAddress, 'id'>>({
    label: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    isDefault: false,
  });

  const mockOrders: Order[] = [
    {
      id: '#ORD-001',
      date: '2024-01-15',
      total: 250.00,
      status: 'delivered',
      items: 3,
      products: [
        { name: 'Testosterone Enanthate 250mg', quantity: 2, price: 85.00 },
        { name: 'Nandrolone Decanoate 300mg', quantity: 1, price: 80.00 },
      ],
      shippingAddress: '123 Main Street, New York, 10001, United States',
      trackingNumber: 'TRK123456789',
    },
    {
      id: '#ORD-002',
      date: '2024-01-10',
      total: 180.50,
      status: 'shipped',
      items: 2,
      products: [
        { name: 'Boldenone Undecylenate 250mg', quantity: 1, price: 95.00 },
        { name: 'Stanozolol 50mg', quantity: 1, price: 85.50 },
      ],
      shippingAddress: '123 Main Street, New York, 10001, United States',
      trackingNumber: 'TRK987654321',
    },
    {
      id: '#ORD-003',
      date: '2024-01-05',
      total: 420.00,
      status: 'processing',
      items: 5,
      products: [
        { name: 'Trenbolone Acetate 100mg', quantity: 2, price: 120.00 },
        { name: 'Masteron Propionate 100mg', quantity: 1, price: 110.00 },
        { name: 'Oxandrolone 50mg', quantity: 2, price: 95.00 },
      ],
      shippingAddress: '123 Main Street, New York, 10001, United States',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  const handleAddAddress = () => {
    if (newAddress.label && newAddress.address && newAddress.city && newAddress.country) {
      const address: DeliveryAddress = {
        id: Date.now().toString(),
        ...newAddress,
      };
      setDeliveryAddresses([...deliveryAddresses, address]);
      setNewAddress({
        label: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        isDefault: false,
      });
      setIsAddingAddress(false);
    }
  };

  const handleDeleteAddress = (id: string) => {
    setDeliveryAddresses(deliveryAddresses.filter(addr => addr.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setDeliveryAddresses(
      deliveryAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalSpent = mockOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = mockOrders.length;
    const deliveredOrders = mockOrders.filter(o => o.status === 'delivered').length;

    // Get top products
    const productMap = new Map<string, { name: string; quantity: number; totalSpent: number }>();
    mockOrders.forEach(order => {
      order.products.forEach(product => {
        const existing = productMap.get(product.name);
        if (existing) {
          existing.quantity += product.quantity;
          existing.totalSpent += product.price * product.quantity;
        } else {
          productMap.set(product.name, {
            name: product.name,
            quantity: product.quantity,
            totalSpent: product.price * product.quantity,
          });
        }
      });
    });

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    return { totalSpent, totalOrders, deliveredOrders, topProducts };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-dark-text">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your profile, orders, and settings</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-4">
              <nav className="flex flex-col">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 text-left font-medium transition-colors border-l-4 ${
                    activeTab === 'overview'
                      ? 'bg-accent text-dark-text border-accent'
                      : 'text-dark-text hover:text-accent border-transparent'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-4 text-left font-medium transition-colors border-l-4 ${
                    activeTab === 'profile'
                      ? 'bg-accent text-dark-text border-accent'
                      : 'text-dark-text hover:text-accent border-transparent'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-6 py-4 text-left font-medium transition-colors border-l-4 ${
                    activeTab === 'orders'
                      ? 'bg-accent text-dark-text border-accent'
                      : 'text-dark-text hover:text-accent border-transparent'
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`px-6 py-4 text-left font-medium transition-colors border-l-4 ${
                    activeTab === 'addresses'
                      ? 'bg-accent text-dark-text border-accent'
                      : 'text-dark-text hover:text-accent border-transparent'
                  }`}
                >
                  Delivery Addresses
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-6 py-4 text-left font-medium transition-colors border-l-4 ${
                    activeTab === 'settings'
                      ? 'bg-accent text-dark-text border-accent'
                      : 'text-dark-text hover:text-accent border-transparent'
                  }`}
                >
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm text-gray-600 mb-2">Total Spent</p>
                    <p className="text-3xl font-bold text-accent">€{stats.totalSpent.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-2">Across all orders</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm text-gray-600 mb-2">Total Orders</p>
                    <p className="text-3xl font-bold text-dark-text">{stats.totalOrders}</p>
                    <p className="text-xs text-gray-500 mt-2">{stats.deliveredOrders} delivered</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm text-gray-600 mb-2">Average Order Value</p>
                    <p className="text-3xl font-bold text-dark-text">€{(stats.totalSpent / stats.totalOrders).toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-2">Per order</p>
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-dark-text mb-6">Top Products</h2>
                  <div className="space-y-4">
                    {stats.topProducts.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">No products purchased yet.</p>
                    ) : (
                      stats.topProducts.map((product, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-accent text-dark-text font-bold rounded-full text-sm">
                                {idx + 1}
                              </span>
                              <p className="font-semibold text-dark-text">{product.name}</p>
                            </div>
                            <p className="text-sm text-gray-600">Quantity: {product.quantity} units</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-accent">€{product.totalSpent.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">Total spent</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-dark-text">Recent Orders</h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="px-4 py-2 bg-gray-100 text-dark-text rounded-lg font-medium hover:bg-accent transition-colors"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {mockOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div>
                          <p className="font-semibold text-dark-text">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <p className="font-bold text-accent min-w-[80px] text-right">€{order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-dark-text">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isEditing
                        ? 'bg-gray-200 text-dark-text hover:bg-accent'
                        : 'bg-gray-100 text-dark-text hover:bg-accent'
                    }`}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 bg-gray-100 text-dark-text rounded-lg font-medium hover:bg-accent transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setFormData(profile);
                          setIsEditing(false);
                        }}
                        className="px-6 py-2 bg-gray-100 text-dark-text rounded-lg font-medium hover:bg-accent transition-colors"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">First Name</p>
                        <p className="text-lg font-medium text-dark-text">{profile.firstName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Last Name</p>
                        <p className="text-lg font-medium text-dark-text">{profile.lastName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="text-lg font-medium text-dark-text">{profile.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <p className="text-lg font-medium text-dark-text">{profile.phone}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Address</p>
                      <p className="text-lg font-medium text-dark-text">{profile.address}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">City</p>
                        <p className="text-lg font-medium text-dark-text">{profile.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Postal Code</p>
                        <p className="text-lg font-medium text-dark-text">{profile.postalCode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Country</p>
                        <p className="text-lg font-medium text-dark-text">{profile.country}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                {selectedOrder ? (
                  <>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="mb-6 px-4 py-2 bg-gray-100 text-dark-text rounded-lg font-medium hover:bg-accent transition-colors"
                    >
                      Back to Orders
                    </button>
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-dark-text mb-2">Order {selectedOrder.id}</h2>
                        <p className="text-gray-600">Placed on {selectedOrder.date}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-1">Order Status</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                          </span>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-1">Order Total</p>
                          <p className="text-2xl font-bold text-accent">€{selectedOrder.total.toFixed(2)}</p>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-1">Number of Items</p>
                          <p className="text-2xl font-bold text-dark-text">{selectedOrder.items}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-dark-text mb-4">Order Items</h3>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-dark-text">Product</th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-dark-text">Quantity</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-dark-text">Price</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-dark-text">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedOrder.products.map((product, idx) => (
                                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                  <td className="px-6 py-4 text-dark-text">{product.name}</td>
                                  <td className="px-6 py-4 text-center text-dark-text">{product.quantity}</td>
                                  <td className="px-6 py-4 text-right text-dark-text">€{product.price.toFixed(2)}</td>
                                  <td className="px-6 py-4 text-right font-semibold text-dark-text">€{(product.price * product.quantity).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-dark-text mb-4">Shipping Address</h3>
                          <p className="text-dark-text">{selectedOrder.shippingAddress}</p>
                        </div>
                        {selectedOrder.trackingNumber && (
                          <div className="border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-dark-text mb-4">Tracking Information</h3>
                            <p className="text-sm text-gray-600 mb-2">Tracking Number</p>
                            <p className="text-dark-text font-mono">{selectedOrder.trackingNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-dark-text mb-8">Order History</h2>
                    <div className="space-y-4">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <p className="font-semibold text-dark-text text-lg">{order.id}</p>
                              <p className="text-sm text-gray-600">Placed on {order.date}</p>
                              <p className="text-sm text-gray-600">{order.items} items</p>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div className="text-right">
                                <p className="text-2xl font-bold text-accent">€{order.total.toFixed(2)}</p>
                              </div>
                              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-4 py-2 bg-gray-100 text-dark-text rounded-lg font-medium hover:bg-accent transition-colors"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Delivery Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-dark-text">Delivery Addresses</h2>
                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="px-4 py-2 bg-gray-100 text-dark-text rounded-lg font-medium hover:bg-accent transition-colors"
                  >
                    {isAddingAddress ? 'Cancel' : 'Add Address'}
                  </button>
                </div>

                {isAddingAddress && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
                    <h3 className="text-lg font-semibold text-dark-text mb-6">Add New Address</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Label (e.g., Home, Work)</label>
                          <input
                            type="text"
                            value={newAddress.label}
                            onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                            placeholder="Home"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                          <input
                            type="text"
                            value={newAddress.country}
                            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                            placeholder="United States"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                          type="text"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                            placeholder="New York"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                          <input
                            type="text"
                            value={newAddress.postalCode}
                            onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                            placeholder="10001"
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newAddress.isDefault}
                              onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                              className="w-4 h-4"
                            />
                            <span className="text-sm font-medium text-gray-700">Set as Default</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          onClick={handleAddAddress}
                          className="px-6 py-2 bg-gray-100 text-dark-text rounded-lg font-medium hover:bg-accent transition-colors"
                        >
                          Save Address
                        </button>
                        <button
                          onClick={() => setIsAddingAddress(false)}
                          className="px-6 py-2 bg-gray-100 text-dark-text rounded-lg font-medium hover:bg-accent transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {deliveryAddresses.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No delivery addresses yet. Add one to get started.</p>
                  ) : (
                    deliveryAddresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-dark-text">{address.label}</h3>
                              {address.isDefault && (
                                <span className="px-3 py-1 bg-accent text-dark-text text-xs font-semibold rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-dark-text">{address.address}</p>
                            <p className="text-dark-text">{address.city}, {address.postalCode}</p>
                            <p className="text-dark-text">{address.country}</p>
                          </div>
                          <div className="flex gap-2">
                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="px-3 py-2 bg-gray-100 text-dark-text rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="px-3 py-2 bg-gray-100 text-dark-text rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-dark-text mb-8">Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-dark-text">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates about your orders</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>

                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-dark-text">Marketing Emails</p>
                      <p className="text-sm text-gray-600">Receive promotional offers and news</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>

                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-dark-text">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add extra security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-100 text-dark-text rounded-lg font-medium hover:bg-accent transition-colors">
                      Enable
                    </button>
                  </div>

                  <div className="pt-6">
                    <button className="px-6 py-2 bg-gray-100 text-dark-text rounded-lg font-medium hover:bg-red-600 hover:text-white transition-colors">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

