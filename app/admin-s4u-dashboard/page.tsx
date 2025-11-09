'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('/api/admin/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon }: any) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="text-gray-400 text-xl ml-3">{icon}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon="📦"
        />
        <StatCard
          title="Orders"
          value={stats.totalOrders}
          icon="🛒"
        />
        <StatCard
          title="Users"
          value={stats.totalUsers}
          icon="👥"
        />
        <StatCard
          title="Revenue"
          value={`€${stats.totalRevenue.toFixed(2)}`}
          icon="💰"
        />
        <StatCard
          title="Pending"
          value={stats.pendingOrders}
          icon="⏳"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/admin-s4u-dashboard/products/add"
            className="border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 px-4 rounded-md text-center transition-all"
          >
            + Add Product
          </Link>
          <Link
            href="/admin-s4u-dashboard/orders"
            className="border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 px-4 rounded-md text-center transition-all"
          >
            View Orders
          </Link>
          <Link
            href="/admin-s4u-dashboard/users"
            className="border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 px-4 rounded-md text-center transition-all"
          >
            View Users
          </Link>
          <Link
            href="/admin-s4u-dashboard/seo"
            className="border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 px-4 rounded-md text-center transition-all"
          >
            SEO Settings
          </Link>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          Use the sidebar to navigate through different sections. Manage your products, orders, users, and SEO settings.
        </p>
      </div>
    </div>
  );
}

