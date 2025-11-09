# Steroids4u Admin CRM Guide

## 🔐 Admin Login

### Access the Admin Panel
- **URL**: `http://localhost:3000/admin-s4u-login`
- **Demo Email**: `admin@steroids4u.eu`
- **Demo Password**: `admin123`

### Security Notes
- The login URL is intentionally unique (`admin-s4u-login`) to prevent easy discovery
- Demo credentials are for development only - change in production
- JWT tokens expire after 24 hours
- Tokens are stored in localStorage for session persistence

---

## 📊 Dashboard Overview

### Main Dashboard (`/admin-s4u-dashboard`)
The dashboard displays key metrics:
- **Total Products**: Number of products in inventory
- **Total Orders**: All orders placed
- **Total Users**: Registered customers
- **Total Revenue**: Sum of all completed orders
- **Pending Orders**: Orders awaiting processing

### Quick Actions
- ➕ Add Product
- 📋 View Orders
- 👥 View Users
- 🔍 SEO Settings

---

## 📦 Product Management

### View All Products (`/admin-s4u-dashboard/products`)
- **Search**: Filter products by name or slug
- **Pagination**: 10 products per page
- **Actions**: Edit or delete products
- **Stock Status**: Visual indicator (green = in stock, red = out of stock)

### Add New Product (`/admin-s4u-dashboard/products/add`)
**Required Fields:**
- Product Name
- Slug (URL-friendly identifier)
- Description
- Price (€)
- Stock Quantity
- Category

**Optional Fields:**
- Brand
- Images (comma-separated URLs)

**SEO Fields:**
- SEO Title (max 60 characters)
- SEO Description (max 160 characters)
- SEO Keywords (comma-separated)

### Edit Product
- Click "Edit" on any product to modify details
- Changes are saved immediately

### Delete Product
- Click "Delete" to remove a product
- Confirmation required before deletion

---

## 🛒 Order Management

### View Orders (`/admin-s4u-dashboard/orders`)
**Filter by Status:**
- All Orders
- Pending
- Processing
- Shipped
- Delivered
- Cancelled

**Order Information:**
- Order ID
- Customer ID
- Total Amount
- Order Status (color-coded)
- Payment Status
- Order Date

### Order Details
- Click "View" to see full order details
- Update order status
- View customer information
- See order items and prices

**Order Statuses:**
- 🟡 **Pending**: Awaiting payment confirmation
- 🔵 **Processing**: Being prepared for shipment
- 🟣 **Shipped**: In transit to customer
- 🟢 **Delivered**: Successfully delivered
- 🔴 **Cancelled**: Order cancelled

**Payment Statuses:**
- 🟡 **Pending**: Payment not yet received
- 🟢 **Completed**: Payment confirmed
- 🔴 **Failed**: Payment failed

---

## 👥 User Management

### View All Users (`/admin-s4u-dashboard/users`)
**User Information:**
- Name
- Email
- Phone
- Country
- Number of Orders
- Total Amount Spent
- Join Date

**Search & Filter:**
- Search by email or name
- Pagination: 10 users per page

**User Insights:**
- Identify top customers by spending
- Track customer acquisition
- Monitor user engagement

---

## 🔍 SEO Management

### View SEO Settings (`/admin-s4u-dashboard/seo`)
Manage SEO metadata for:
- **Products**: Individual product pages
- **Pages**: Static pages (How to Order, FAQ, etc.)
- **Categories**: Category pages

### SEO Fields

**Title** (max 60 characters)
- Appears in search results
- Should include target keywords
- Example: "Buy Testosterone Enanthate Online | Steroids4u"

**Description** (max 160 characters)
- Appears below title in search results
- Should be compelling and include keywords
- Example: "High-quality Testosterone Enanthate for sale. Fast EU shipping, authentic products, competitive prices."

**Keywords** (comma-separated)
- Primary search terms
- Example: "testosterone enanthate, buy testosterone, anabolic steroids"

**OG Image** (optional)
- Image for social media sharing
- Recommended size: 1200x630px

**Canonical URL** (optional)
- Prevents duplicate content issues
- Use for alternate versions of pages

### Edit SEO
1. Click "Edit" on any SEO item
2. Update fields as needed
3. Click "Save" to apply changes

---

## 📂 Category Management

### View Categories (`/admin-s4u-dashboard/categories`)
**Category Information:**
- Category Name
- Slug
- Description
- Product Count

### Edit Category
1. Click "Edit" on a category card
2. Update name, slug, or description
3. Click "Save"

### Delete Category
1. Click "Delete" on a category card
2. Confirm deletion
3. Category is removed (products remain)

---

## 🔐 Authentication & Security

### Session Management
- Sessions expire after 24 hours
- Automatic logout on token expiration
- Redirect to login page on unauthorized access

### Protected Routes
All admin routes require valid JWT token:
- `/admin-s4u-dashboard/*`
- `/api/admin/*`

### Token Verification
- Tokens verified on every API request
- Invalid/expired tokens return 401 Unauthorized

---

## 📱 Responsive Design

The admin panel is fully responsive:
- **Desktop**: Full sidebar with all navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Hamburger menu navigation

### Sidebar Toggle
- Click the arrow (◀/▶) to collapse/expand sidebar
- Saves space on smaller screens
- Icons remain visible when collapsed

---

## 🚀 API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Login
- `GET /api/admin/auth/verify` - Verify token

### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### Products
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `GET /api/admin/products/[id]` - Get product details
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product

### Orders
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/orders/[id]` - Get order details
- `PUT /api/admin/orders/[id]` - Update order status

### Users
- `GET /api/admin/users` - List all users

### SEO
- `GET /api/admin/seo` - List all SEO items
- `PUT /api/admin/seo/[id]` - Update SEO item

### Categories
- `GET /api/admin/categories` - List all categories
- `PUT /api/admin/categories/[id]` - Update category
- `DELETE /api/admin/categories/[id]` - Delete category

---

## 💡 Tips & Best Practices

1. **Product Slugs**: Use lowercase, hyphens instead of spaces
   - ✅ Good: `testosterone-enanthate`
   - ❌ Bad: `Testosterone Enanthate`

2. **SEO Titles**: Include brand name and main keyword
   - ✅ Good: "Buy Testosterone Enanthate | Steroids4u"
   - ❌ Bad: "Product"

3. **Images**: Use high-quality images, optimize for web
   - Recommended: WebP format, max 500KB
   - Dimensions: 800x800px minimum

4. **Stock Management**: Keep inventory updated
   - Low stock alerts help prevent overselling
   - Regular audits recommended

5. **Order Processing**: Update status promptly
   - Customers receive notifications
   - Improves customer satisfaction

---

## 🐛 Troubleshooting

### Can't Login
- Verify email and password are correct
- Check browser console for errors
- Clear localStorage and try again

### Session Expired
- You'll be redirected to login page
- Log in again to continue

### Changes Not Saving
- Check network tab in browser DevTools
- Verify API endpoint is responding
- Check JWT token validity

### Missing Data
- Refresh the page
- Check if data exists in CSV files
- Verify API endpoints are working

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review API endpoints documentation
3. Check browser console for errors
4. Contact: customerservice@steroids4u.eu

---

**Last Updated**: November 2025
**Version**: 1.0

