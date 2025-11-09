'use client';

import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: Array<{
    name: string;
    revenue: number;
    quantity: number;
  }>;
  salesByDate: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  salesByCategory: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
  revenueGrowth: number;
  ordersGrowth: number;
}

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    topProducts: [],
    salesByDate: [],
    salesByCategory: [],
    revenueGrowth: 0,
    ordersGrowth: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, startDate, endDate]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const params = new URLSearchParams({
        range: dateRange,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await fetch(`/api/admin/analytics?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = async () => {
    alert('PDF export functionality - Ready for implementation with jsPDF library');
  };

  const exportToCSV = () => {
    const csvData = [
      ['Date', 'Revenue', 'Orders'],
      ...analyticsData.salesByDate.map(item => [
        item.date,
        item.revenue.toFixed(2),
        item.orders.toString(),
      ]),
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Analytics & Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Track sales performance and business metrics</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 px-4 rounded-md transition-colors"
          >
            📊 Export CSV
          </button>
          <button
            onClick={exportToPDF}
            className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
          >
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Quick Range</label>
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setStartDate('');
                setEndDate('');
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="12months">Last 12 Months</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          {dateRange === 'custom' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
            </>
          )}
          <div className="flex items-end">
            <button
              onClick={fetchAnalytics}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Total Revenue */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</p>
          <p className={`text-xs mt-2 ${analyticsData.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {analyticsData.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(analyticsData.revenueGrowth).toFixed(1)}% vs previous period
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.totalOrders.toLocaleString()}</p>
          <p className={`text-xs mt-2 ${analyticsData.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {analyticsData.ordersGrowth >= 0 ? '↑' : '↓'} {Math.abs(analyticsData.ordersGrowth).toFixed(1)}% vs previous period
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg Order Value</h3>
            <span className="text-2xl">💳</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.averageOrderValue)}</p>
          <p className="text-xs text-gray-500 mt-2">Per transaction</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.conversionRate.toFixed(2)}%</p>
          <p className="text-xs text-gray-500 mt-2">Visitors to customers</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
          <div className="space-y-2">
            {analyticsData.salesByDate.slice(0, 10).map((item, index) => {
              const maxRevenue = Math.max(...analyticsData.salesByDate.map(d => d.revenue));
              const percentage = (item.revenue / maxRevenue) * 100;
              
              return (
                <div key={index}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{item.date}</span>
                    <span className="font-medium">{formatCurrency(item.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-900 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
          <div className="space-y-4">
            {analyticsData.salesByCategory.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{item.category}</span>
                  <span className="text-gray-900 font-semibold">{formatCurrency(item.revenue)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-12 text-right">{item.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analyticsData.topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">#{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.quantity}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

