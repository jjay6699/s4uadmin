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

type Address = {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type OrderHistoryEntry = {
  date: string;
  label: string;
  note?: string;
};

type AdminOrder = {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: string;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  notes?: string;
  history: OrderHistoryEntry[];
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
};

// Demo orders data (in-memory store so PUT requests persist for the session)
const DEMO_ORDERS: AdminOrder[] = [
  {
    id: 'order-001',
    userId: 'user-123',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    customerPhone: '+1 202 555 0119',
    total: 450.0,
    status: 'delivered',
    paymentStatus: 'completed',
    paymentMethod: 'EU Bank Transfer',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: {
      fullName: 'John Smith',
      email: 'john@example.com',
      phone: '+1 202 555 0119',
      street: '123 Main Street',
      city: 'Berlin',
      state: 'Berlin',
      postalCode: '10115',
      country: 'Germany',
    },
    billingAddress: {
      fullName: 'John Smith',
      email: 'john@example.com',
      phone: '+1 202 555 0119',
      street: '123 Main Street',
      city: 'Berlin',
      state: 'Berlin',
      postalCode: '10115',
      country: 'Germany',
    },
    trackingNumber: 'DE1234567890',
    notes: 'Customer prefers discrete packaging.',
    history: [
      { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), label: 'Order created' },
      { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), label: 'Payment received' },
      { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), label: 'Shipped with DHL', note: 'Tracking DE1234567890' },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), label: 'Delivered to customer' },
    ],
    items: [
      { productId: 'prod-1', productName: 'Testosterone Enanthate 250mg', quantity: 2, price: 225 },
    ],
  },
  {
    id: 'order-002',
    userId: 'user-456',
    customerName: 'Emily Carter',
    customerEmail: 'emily@example.co.uk',
    customerPhone: '+44 7700 900123',
    total: 320.5,
    status: 'shipped',
    paymentStatus: 'completed',
    paymentMethod: 'Credit Card',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: {
      fullName: 'Emily Carter',
      email: 'emily@example.co.uk',
      phone: '+44 7700 900123',
      street: '45 Queen Street',
      city: 'London',
      state: 'London',
      postalCode: 'SW1A 1AA',
      country: 'United Kingdom',
    },
    billingAddress: {
      fullName: 'Emily Carter',
      email: 'emily@example.co.uk',
      phone: '+44 7700 900123',
      street: '45 Queen Street',
      city: 'London',
      state: 'London',
      postalCode: 'SW1A 1AA',
      country: 'United Kingdom',
    },
    trackingNumber: 'UK9988776655',
    notes: '',
    history: [
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), label: 'Order created' },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), label: 'Payment received' },
      { date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), label: 'Shipped with Royal Mail', note: 'Tracking UK9988776655' },
    ],
    items: [
      { productId: 'prod-2', productName: 'Deca Durabolin 300mg', quantity: 1, price: 320.5 },
    ],
  },
  {
    id: 'order-003',
    userId: 'user-789',
    customerName: 'Paul Andersen',
    customerEmail: 'paul@example.dk',
    customerPhone: '+45 22 33 44 55',
    total: 680.0,
    status: 'processing',
    paymentStatus: 'completed',
    paymentMethod: 'Bitcoin',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: {
      fullName: 'Paul Andersen',
      email: 'paul@example.dk',
      phone: '+45 22 33 44 55',
      street: '9 Norrebro Street',
      city: 'Copenhagen',
      state: 'Copenhagen',
      postalCode: '2200',
      country: 'Denmark',
    },
    billingAddress: {
      fullName: 'Paul Andersen',
      email: 'paul@example.dk',
      phone: '+45 22 33 44 55',
      street: '9 Norrebro Street',
      city: 'Copenhagen',
      state: 'Copenhagen',
      postalCode: '2200',
      country: 'Denmark',
    },
    trackingNumber: '',
    notes: 'Awaiting final QC before shipping.',
    history: [
      { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), label: 'Order created' },
      { date: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), label: 'Payment confirmed (BTC)' },
      { date: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), label: 'Preparing shipment' },
    ],
    items: [
      { productId: 'prod-3', productName: 'Premium Bulking Stack', quantity: 3, price: 226.67 },
    ],
  },
  {
    id: 'order-004',
    userId: 'user-101',
    customerName: 'Marco Rossi',
    customerEmail: 'marco@example.it',
    customerPhone: '+39 331 123 4567',
    total: 250.0,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'US Bank Transfer',
    createdAt: new Date().toISOString(),
    shippingAddress: {
      fullName: 'Marco Rossi',
      email: 'marco@example.it',
      phone: '+39 331 123 4567',
      street: '12 Via Roma',
      city: 'Milan',
      state: 'MI',
      postalCode: '20100',
      country: 'Italy',
    },
    billingAddress: {
      fullName: 'Marco Rossi',
      email: 'marco@example.it',
      phone: '+39 331 123 4567',
      street: '12 Via Roma',
      city: 'Milan',
      state: 'MI',
      postalCode: '20100',
      country: 'Italy',
    },
    trackingNumber: '',
    notes: '',
    history: [
      { date: new Date().toISOString(), label: 'Order created' },
    ],
    items: [
      { productId: 'prod-4', productName: 'Cutting Stack Lite', quantity: 1, price: 250 },
    ],
  },
];

const ordersStore: AdminOrder[] = JSON.parse(JSON.stringify(DEMO_ORDERS));

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: ordersStore,
    });
  } catch (error) {
    console.error('Orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const payload = await request.json();
    const { id, status, paymentStatus, trackingNumber, notes } = payload;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const targetOrder = ordersStore.find((order) => order.id === id);
    if (!targetOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    if (status && targetOrder.status !== status) {
      targetOrder.status = status;
      targetOrder.history.unshift({
        date: new Date().toISOString(),
        label: `Status updated to ${status}`,
      });
    }

    if (paymentStatus && targetOrder.paymentStatus !== paymentStatus) {
      targetOrder.paymentStatus = paymentStatus;
      targetOrder.history.unshift({
        date: new Date().toISOString(),
        label: `Payment marked as ${paymentStatus}`,
      });
    }

    if (typeof trackingNumber === 'string') {
      targetOrder.trackingNumber = trackingNumber;
    }

    if (typeof notes === 'string') {
      targetOrder.notes = notes;
    }

    return NextResponse.json({
      success: true,
      order: targetOrder,
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

