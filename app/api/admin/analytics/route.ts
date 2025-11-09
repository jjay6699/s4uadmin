import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { parseCSV } from '@/lib/utils/csv-parser';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

interface Order {
  id: string;
  customer: string;
  total: number;
  status: string;
  paymentStatus: string;
  date: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

// Mock orders data - in production, this would come from a database
const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2024-001',
    customer: 'John Smith',
    total: 459.99,
    status: 'delivered',
    paymentStatus: 'paid',
    date: '2024-11-01',
    items: [
      { productId: '1', productName: 'Testosterone Enanthate 250mg', quantity: 2, price: 89.99 },
      { productId: '2', productName: 'Deca Durabolin 300mg', quantity: 1, price: 119.99 },
      { productId: '3', productName: 'Dianabol 10mg', quantity: 3, price: 49.99 },
    ],
  },
  {
    id: 'ORD-2024-002',
    customer: 'Mike Johnson',
    total: 329.97,
    status: 'shipped',
    paymentStatus: 'paid',
    date: '2024-11-03',
    items: [
      { productId: '1', productName: 'Testosterone Enanthate 250mg', quantity: 3, price: 89.99 },
      { productId: '4', productName: 'Anavar 50mg', quantity: 1, price: 59.99 },
    ],
  },
  {
    id: 'ORD-2024-003',
    customer: 'Sarah Williams',
    total: 189.98,
    status: 'processing',
    paymentStatus: 'paid',
    date: '2024-11-05',
    items: [
      { productId: '5', productName: 'Winstrol 50mg', quantity: 2, price: 94.99 },
    ],
  },
  {
    id: 'ORD-2024-004',
    customer: 'David Brown',
    total: 549.95,
    status: 'delivered',
    paymentStatus: 'paid',
    date: '2024-11-07',
    items: [
      { productId: '1', productName: 'Testosterone Enanthate 250mg', quantity: 4, price: 89.99 },
      { productId: '6', productName: 'Trenbolone Acetate 100mg', quantity: 2, price: 84.99 },
    ],
  },
  {
    id: 'ORD-2024-005',
    customer: 'Chris Davis',
    total: 279.97,
    status: 'delivered',
    paymentStatus: 'paid',
    date: '2024-10-28',
    items: [
      { productId: '2', productName: 'Deca Durabolin 300mg', quantity: 2, price: 119.99 },
      { productId: '7', productName: 'Primobolan 100mg', quantity: 1, price: 39.99 },
    ],
  },
  {
    id: 'ORD-2024-006',
    customer: 'Robert Miller',
    total: 419.94,
    status: 'delivered',
    paymentStatus: 'paid',
    date: '2024-10-25',
    items: [
      { productId: '3', productName: 'Dianabol 10mg', quantity: 4, price: 49.99 },
      { productId: '4', productName: 'Anavar 50mg', quantity: 3, price: 59.99 },
    ],
  },
  {
    id: 'ORD-2024-007',
    customer: 'James Wilson',
    total: 359.96,
    status: 'delivered',
    paymentStatus: 'paid',
    date: '2024-10-20',
    items: [
      { productId: '1', productName: 'Testosterone Enanthate 250mg', quantity: 4, price: 89.99 },
    ],
  },
  {
    id: 'ORD-2024-008',
    customer: 'Michael Anderson',
    total: 649.93,
    status: 'delivered',
    paymentStatus: 'paid',
    date: '2024-10-15',
    items: [
      { productId: '6', productName: 'Trenbolone Acetate 100mg', quantity: 3, price: 84.99 },
      { productId: '5', productName: 'Winstrol 50mg', quantity: 4, price: 94.99 },
    ],
  },
];

function getDateRange(range: string, startDate?: string, endDate?: string) {
  const now = new Date();
  let start = new Date();
  let end = new Date();

  if (range === 'custom' && startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
  } else {
    switch (range) {
      case '7days':
        start.setDate(now.getDate() - 7);
        break;
      case '30days':
        start.setDate(now.getDate() - 30);
        break;
      case '90days':
        start.setDate(now.getDate() - 90);
        break;
      case '12months':
        start.setMonth(now.getMonth() - 12);
        break;
      default:
        start.setDate(now.getDate() - 30);
    }
  }

  return { start, end };
}

function calculateAnalytics(orders: Order[], dateRange: { start: Date; end: Date }) {
  // Filter orders by date range
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate >= dateRange.start && orderDate <= dateRange.end;
  });

  // Calculate previous period for growth comparison
  const periodLength = dateRange.end.getTime() - dateRange.start.getTime();
  const previousStart = new Date(dateRange.start.getTime() - periodLength);
  const previousEnd = dateRange.start;
  
  const previousOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate >= previousStart && orderDate < previousEnd;
  });

  // Total Revenue
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);
  const revenueGrowth = previousRevenue > 0 
    ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
    : 0;

  // Total Orders
  const totalOrders = filteredOrders.length;
  const previousOrderCount = previousOrders.length;
  const ordersGrowth = previousOrderCount > 0
    ? ((totalOrders - previousOrderCount) / previousOrderCount) * 100
    : 0;

  // Average Order Value
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Conversion Rate (mock - would need visitor data in production)
  const conversionRate = 2.5 + Math.random() * 2;

  // Sales by Date
  const salesByDate = filteredOrders.reduce((acc, order) => {
    const existing = acc.find(item => item.date === order.date);
    if (existing) {
      existing.revenue += order.total;
      existing.orders += 1;
    } else {
      acc.push({
        date: order.date,
        revenue: order.total,
        orders: 1,
      });
    }
    return acc;
  }, [] as Array<{ date: string; revenue: number; orders: number }>);

  salesByDate.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Top Products
  const productStats = new Map<string, { name: string; quantity: number; revenue: number }>();
  
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      const existing = productStats.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
      } else {
        productStats.set(item.productId, {
          name: item.productName,
          quantity: item.quantity,
          revenue: item.price * item.quantity,
        });
      }
    });
  });

  const topProducts = Array.from(productStats.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Sales by Category (mock - would need category data from products)
  const salesByCategory = [
    { category: 'Injectable Steroids', revenue: totalRevenue * 0.45, percentage: 45 },
    { category: 'Oral Steroids', revenue: totalRevenue * 0.30, percentage: 30 },
    { category: 'PCT & Support', revenue: totalRevenue * 0.15, percentage: 15 },
    { category: 'Fat Burners', revenue: totalRevenue * 0.10, percentage: 10 },
  ];

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    conversionRate,
    topProducts,
    salesByDate,
    salesByCategory,
    revenueGrowth,
    ordersGrowth,
  };
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30days';
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const dateRange = getDateRange(range, startDate, endDate);
    const analytics = calculateAnalytics(MOCK_ORDERS, dateRange);

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

