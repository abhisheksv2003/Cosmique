# 💎 Cosmique — Beauty & Cosmetics E-Commerce Platform

A production-ready, full-stack beauty & cosmetics e-commerce platform.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router) + React 18 |
| **Styling** | Vanilla CSS with custom design system |
| **Backend** | Node.js + Express.js |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | JWT (access + refresh tokens) |
| **Payments** | Stripe |
| **State** | React Context + useReducer |

## 📁 Project Structure

```
cosmique/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.js                 # Seed data
│   ├── src/
│   │   ├── controllers/            # Route handlers
│   │   ├── middleware/              # Auth, validation, error handling
│   │   ├── routes/                  # Express routes
│   │   ├── utils/                   # Helpers, JWT, Prisma client
│   │   └── server.js               # Express app entry point
│   ├── .env                         # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                     # Next.js pages
│   │   │   ├── admin/               # Admin dashboard
│   │   │   ├── cart/                 # Shopping cart
│   │   │   ├── checkout/            # Checkout flow
│   │   │   ├── login/               # Login page
│   │   │   ├── register/            # Registration
│   │   │   ├── orders/              # Order history
│   │   │   ├── products/            # Product listing & detail
│   │   │   ├── profile/             # User profile
│   │   │   ├── wishlist/            # Wishlist
│   │   │   ├── layout.js            # Root layout
│   │   │   └── page.js              # Home page
│   │   ├── components/              # Reusable components
│   │   ├── context/                 # Auth & Cart context
│   │   └── lib/                     # API service
│   ├── .env.local                   # Frontend env vars
│   └── package.json
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

```bash
cd backend

# Update DATABASE_URL in .env with your PostgreSQL credentials
# Then run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed the database
node prisma/seed.js
```

### 3. Start Development Servers

```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 3000)
cd frontend
npm run dev
```

### 4. Access the App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Prisma Studio**: `cd backend && npx prisma studio`

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cosmique.com | Admin@123 |
| Customer | customer@test.com | Customer@123 |

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/profile` — Get profile
- `PUT /api/auth/profile` — Update profile

### Products
- `GET /api/products` — List (with search, filters, pagination)
- `GET /api/products/featured` — Featured products
- `GET /api/products/:id` — Product detail

### Cart
- `GET /api/cart` — Get cart
- `POST /api/cart` — Add to cart
- `PUT /api/cart/:id` — Update quantity
- `DELETE /api/cart/:id` — Remove item

### Orders
- `POST /api/orders` — Create order
- `GET /api/orders` — Get user orders
- `PUT /api/orders/:id/cancel` — Cancel order

### Wishlist
- `GET /api/wishlist` — Get wishlist
- `POST /api/wishlist` — Add to wishlist
- `DELETE /api/wishlist/:id` — Remove

### Admin
- `GET /api/admin/dashboard` — Dashboard stats
- `GET /api/admin/users` — User management
- `GET /api/admin/orders` — Order management

## ✨ Features

- 🔐 JWT Authentication (access + refresh tokens)
- 🛍️ Product catalog with search, filters, pagination
- 🛒 Cart system with stock validation
- 📦 Order management with status tracking
- ⭐ Review system with verified purchase badges
- ♥ Wishlist
- 💳 Stripe payment integration
- 👑 Admin dashboard with analytics
- 📱 Fully responsive design
- 🎨 Premium rose-gold design system
- 🔒 Security: Helmet, CORS, rate limiting, input validation

## 🎨 Design System

The platform uses a custom rose-gold beauty theme:
- **Primary**: Rose Gold (#c4798a)
- **Secondary**: Deep Plum (#6b2d5b)
- **Accent**: Gold (#d4a853)
- **Typography**: Playfair Display + Inter

## 📄 License

MIT License
