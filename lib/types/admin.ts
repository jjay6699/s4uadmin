// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminSession {
  id: string;
  adminId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// Product Management
export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  images: string[];
  seo?: {
    title: string;
    description: string;
    keywords: string;
  };
}

// Order Management
export interface OrderStatus {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  notes?: string;
}

// SEO Management
export interface SEOSettings {
  id: string;
  type: 'product' | 'page' | 'category';
  targetId: string;
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  canonical?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Stats
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  recentOrders: any[];
  topProducts: any[];
}

