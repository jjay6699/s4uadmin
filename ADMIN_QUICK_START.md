# Admin CRM - Quick Start Guide

## 🚀 Getting Started in 30 Seconds

### Step 1: Start the Server
```bash
cd steroids4u
npm run dev
```

### Step 2: Open Admin Login
Visit: **http://localhost:3000/admin-s4u-login**

### Step 3: Login with Demo Credentials
- **Email**: `admin@steroids4u.eu`
- **Password**: `admin123`

### Step 4: You're In! 🎉
You'll be redirected to the admin dashboard.

---

## 📍 Admin URLs

| Page | URL |
|------|-----|
| **Login** | `/admin-s4u-login` |
| **Dashboard** | `/admin-s4u-dashboard` |
| **Products** | `/admin-s4u-dashboard/products` |
| **Add Product** | `/admin-s4u-dashboard/products/add` |
| **Orders** | `/admin-s4u-dashboard/orders` |
| **Users** | `/admin-s4u-dashboard/users` |
| **SEO Settings** | `/admin-s4u-dashboard/seo` |
| **Categories** | `/admin-s4u-dashboard/categories` |

---

## 🎯 Main Features

### 📊 Dashboard
- View key metrics (products, orders, users, revenue)
- Quick action buttons
- Real-time statistics

### 📦 Products
- **View**: Search and filter all products
- **Add**: Create new products with SEO fields
- **Edit**: Modify product details
- **Delete**: Remove products from inventory

### 🛒 Orders
- **View**: All orders with status filtering
- **Filter**: By status (pending, processing, shipped, etc.)
- **Track**: Payment and order status

### 👥 Users
- **View**: All registered customers
- **Search**: Find users by email or name
- **Metrics**: See order count and spending

### 🔍 SEO
- **Manage**: SEO metadata for products and pages
- **Edit**: Titles, descriptions, keywords
- **Optimize**: OG images and canonical URLs

### 📂 Categories
- **View**: All product categories
- **Edit**: Category details
- **Delete**: Remove categories

---

## 🔑 Demo Credentials

```
Email:    admin@steroids4u.eu
Password: admin123
```

⚠️ **Important**: Change these credentials in production!

---

## 🛡️ Security

- ✅ JWT-based authentication
- ✅ 24-hour token expiration
- ✅ Protected routes
- ✅ Unique login URL
- ✅ Session persistence

---

## 📱 Responsive Design

The admin panel works on:
- ✅ Desktop (full sidebar)
- ✅ Tablet (collapsible sidebar)
- ✅ Mobile (hamburger menu)

---

## 🎨 Color Scheme

- **Accent**: #F7DB3E (Gold)
- **Background**: #212121 (Dark)
- **Text**: Dark text on light backgrounds

---

## 🔧 Common Tasks

### Add a New Product
1. Go to Products → Add Product
2. Fill in product details
3. Add SEO information
4. Click "Create Product"

### Update Order Status
1. Go to Orders
2. Find the order
3. Click "View"
4. Update status
5. Save changes

### Manage SEO
1. Go to SEO Settings
2. Click "Edit" on any item
3. Update title, description, keywords
4. Click "Save"

### Search Users
1. Go to Users
2. Use search box
3. Filter by email or name

---

## 📊 Dashboard Metrics

| Metric | Description |
|--------|-------------|
| **Total Products** | Number of products in inventory |
| **Total Orders** | All orders placed |
| **Total Users** | Registered customers |
| **Total Revenue** | Sum of completed orders |
| **Pending Orders** | Orders awaiting processing |

---

## 🚨 Troubleshooting

### Can't Login?
- Check email and password
- Clear browser cache
- Try incognito mode

### Session Expired?
- You'll be redirected to login
- Log in again

### Changes Not Saving?
- Check internet connection
- Verify API is responding
- Check browser console for errors

### Missing Data?
- Refresh the page
- Check if data exists in CSV files
- Verify API endpoints

---

## 📚 Full Documentation

For detailed information, see:
- **ADMIN_GUIDE.md** - Complete user guide
- **ADMIN_CRM_IMPLEMENTATION.md** - Technical implementation details

---

## 🎓 Tips

1. **Product Slugs**: Use lowercase with hyphens
   - ✅ `testosterone-enanthate`
   - ❌ `Testosterone Enanthate`

2. **SEO Titles**: Keep under 60 characters
   - ✅ "Buy Testosterone | Steroids4u"
   - ❌ "This is a very long product title that exceeds the character limit"

3. **Search**: Use keywords to find items quickly
   - Search products by name
   - Search users by email

4. **Pagination**: Navigate through large lists
   - 10 items per page
   - Use pagination controls

5. **Status Badges**: Color-coded for quick reference
   - 🟡 Pending
   - 🔵 Processing
   - 🟣 Shipped
   - 🟢 Delivered
   - 🔴 Cancelled

---

## 🆘 Need Help?

1. Check this quick start guide
2. Read ADMIN_GUIDE.md for detailed info
3. Check browser console for errors
4. Contact: customerservice@steroids4u.eu

---

**Last Updated**: November 2025
**Version**: 1.0
**Status**: ✅ Ready to Use

