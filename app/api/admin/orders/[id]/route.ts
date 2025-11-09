import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Mock order data - in production, this would come from a database
const MOCK_ORDER = {
  id: 'ORD-2024-001',
  orderNumber: '2024-001',
  customer: {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
  },
  billing: {
    firstName: 'John',
    lastName: 'Smith',
    company: 'Acme Corp',
    address1: '123 Main Street',
    address2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    postcode: '10001',
    country: 'United States',
  },
  shipping: {
    firstName: 'John',
    lastName: 'Smith',
    company: 'Acme Corp',
    address1: '123 Main Street',
    address2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    postcode: '10001',
    country: 'United States',
  },
  items: [
    {
      productId: '1',
      productName: 'Testosterone Enanthate 250mg',
      quantity: 2,
      price: 89.99,
      tax: 7.20,
      total: 179.98,
    },
    {
      productId: '2',
      productName: 'Deca Durabolin 300mg',
      quantity: 1,
      price: 119.99,
      tax: 9.60,
      total: 119.99,
    },
    {
      productId: '3',
      productName: 'Dianabol 10mg',
      quantity: 3,
      price: 49.99,
      tax: 4.00,
      total: 149.97,
    },
  ],
  status: 'processing',
  paymentStatus: 'paid',
  paymentMethod: 'Credit Card',
  shippingMethod: 'Standard Shipping',
  shippingCost: 15.00,
  subtotal: 449.94,
  tax: 62.40,
  discount: 0,
  total: 527.34,
  date: '2024-11-01T10:30:00Z',
  notes: [
    {
      id: '1',
      type: 'system',
      content: 'Order created via checkout.',
      author: 'System',
      date: '2024-11-01T10:30:00Z',
    },
    {
      id: '2',
      type: 'system',
      content: 'Payment completed via Stripe. Transaction ID: ch_3QK1234567890',
      author: 'System',
      date: '2024-11-01T10:30:15Z',
    },
    {
      id: '3',
      type: 'private',
      content: 'Customer requested expedited processing.',
      author: 'Admin',
      date: '2024-11-01T11:00:00Z',
    },
    {
      id: '4',
      type: 'customer',
      content: 'Your order has been confirmed and is being prepared for shipment.',
      author: 'Admin',
      date: '2024-11-01T11:05:00Z',
    },
  ],
  customerNote: 'Please ship to the back door.',
  transactionId: 'ch_3QK1234567890',
  ipAddress: '192.168.1.1',
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const params = await context.params;
    const orderId = params.id;

    // In production, fetch the order from database
    // For now, return mock data
    return NextResponse.json({
      success: true,
      order: MOCK_ORDER,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const params = await context.params;
    const orderId = params.id;
    const body = await request.json();

    // In production, update the order in database
    console.log('Updating order:', orderId, body);

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: body,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const params = await context.params;
    const orderId = params.id;

    // In production, delete the order from database
    console.log('Deleting order:', orderId);

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

