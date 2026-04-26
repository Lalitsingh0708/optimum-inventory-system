# 🏭 Optimum Inventory Control System for Machine Spares and Consumables

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/Node.js-18.x-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-success.svg)

**A full-stack web application for managing industrial spare parts inventory, optimizing stock levels using EOQ, and automating the procurement workflow.**

[Live Demo](https://optimum-inventory-system.vercel.app) 
·[Report Bug](https://github.com/Lalitsingh0708/Inventory-system/issues) 
·[Request Feature](https://github.com/Lalitsingh0708/Inventory-system/issues)
</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [EOQ Formula](#-eoq-formula)
- [Screenshots](#-screenshots)
- [Author](#-author)

---

## 📖 About the Project

The **Optimum Inventory Control System (OICS)** is designed to solve a critical industrial problem — managing spare parts and consumables efficiently to prevent machine downtime. Traditional systems rely on spreadsheets and guesswork, leading to stockouts, over-purchasing, and wasted capital.

OICS brings together:
- **Real-time stock tracking** with usage history
- **EOQ-based optimization** to calculate the ideal order quantity
- **Automated reorder alerts** when stock falls below the reorder point
- **Full procurement workflow** from purchase order creation to stock receipt
- **Role-based access** for Admins and Inventory Managers

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🔐 **Authentication** | JWT-based login, Admin & Inventory Manager roles |
| 📊 **Dashboard** | KPI cards, usage charts, stock status breakdown |
| 🔩 **Spare Parts** | Full CRUD, stock update with transaction types, search & filter |
| 🏭 **Machines** | Register machines, assign spare parts, track maintenance |
| 🤝 **Suppliers** | Supplier profiles, ratings, spend tracking |
| 📦 **Purchase Orders** | Draft → Pending → Approved → Ordered → Received workflow |
| 📐 **EOQ Optimizer** | Auto-calculates Economic Order Quantity and reorder point |
| 🔔 **Reorder Alerts** | Live alerts for low-stock and out-of-stock items |
| 📈 **Reports** | Inventory report, usage analysis, cost analysis charts |
| 👥 **User Management** | Admin-only user creation and role management |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| HTML5, CSS3 | Structure and styling |
| JavaScript | Dynamic behavior |
| Chart.js / Recharts | Analytics and data visualization |
| CSS | Responsive UI design |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Server-side runtime |
| Express.js | REST API framework |
| MongoDB + Mongoose | Database and ODM |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| Morgan | HTTP request logging |

---

## 📁 Folder Structure

```
inventory-system/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   │
│   ├── controllers/
│   │   ├── authController.js      # Login, register, user management
│   │   ├── machineController.js   # Machine CRUD + part assignment
│   │   ├── orderController.js     # Purchase order workflow
│   │   ├── reportController.js    # Inventory, usage, cost reports
│   │   ├── spareController.js     # Spare parts CRUD + stock updates
│   │   └── supplierController.js  # Supplier management
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect + adminOnly guards
│   │   └── errorMiddleware.js     # Global error handler
│   │
│   ├── models/
│   │   ├── Machine.js             # Machine schema (Mongoose)
│   │   ├── Order.js               # Purchase order schema
│   │   ├── Spare.js               # Spare part schema with EOQ virtuals
│   │   ├── Supplier.js            # Supplier schema
│   │   └── User.js                # User schema with bcrypt hooks
│   │
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── machineRoutes.js       # /api/machines/*
│   │   ├── orderRoutes.js         # /api/purchase-orders/*
│   │   ├── reportRoutes.js        # /api/reports/*
│   │   ├── spareRoutes.js         # /api/spare-parts/*
│   │   └── supplierRoutes.js      # /api/suppliers/*
│   │
│   ├── utils/
│   │   ├── eoqCalculator.js       # EOQ and reorder point logic
│   │   └── mailer.js              # Email notifications (optional)
│   │
│   ├── data/                      # Seed data files
│   ├── .env                       # Environment variables
│   ├── server.js                  # Express app entry point
│   └── vercel.json                # Vercel deployment config
│
├── frontend/
│   ├── assets/
│   │   ├── icons/                 # App icons and favicons
│   │   └── images/                # Static images
│   │
│   ├── css/
│   │   ├── spareco.css            # Spare parts module styles
│   │   └── style.css              # Global styles
│   │
│   ├── js/
│   │   ├── api.js                 # Axios API service layer
│   │   ├── auth.js                # Login/logout/token handling
│   │   ├── chatbot.js             # AI chatbot assistant
│   │   ├── dashboard.js           # Dashboard charts and KPIs
│   │   ├── eoq.js                 # EOQ optimizer page logic
│   │   ├── login.js               # Login page controller
│   │   ├── reports.js             # Reports and analytics
│   │   ├── spareco.js             # Spare parts page logic
│   │   └── spares.js              # Spare parts helper functions
│   │
│   ├── dashboard.html             # Main dashboard page
│   ├── eoq.html                   # EOQ optimizer page
│   ├── index.html                 # Landing / home page
│   ├── login.html                 # Login and register page
│   ├── payment.html               # Payment/subscription page
│   ├── reports.html               # Reports and analytics page
│   └── spares.html                # Spare parts inventory page
│
├── node_modules/
├── package.json
├── package-lock.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) v6 or higher (local or Atlas)
- [Git](https://git-scm.com/)
- npm v9+

```bash
node -v     # v18.x.x
npm -v      # v9.x.x
mongod --version  # v6.x.x or v7.x.x
```

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Lalitsingh0708/Inventory-system
cd inventory-system
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies (if applicable)**

```bash
cd ../frontend
# If using a build tool:
npm install
# Otherwise, open HTML files directly in browser
```

---

### Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
mongodb+srv://username:password@cluster0.h8bz45.mongodb.net

# Authentication
JWT_SECRET=inventory_super_secret_key_2024
JWT_EXPIRES_IN=7d

# Email (optional - for mailer.js)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

### Running the App

**Start MongoDB**

```bash
mongod
```

**Start the backend server**

```bash
cd backend
npm run dev       # Development mode with nodemon
# OR
npm start         # Production mode
```

Server will run at: `http://localhost:5000`

**Access the frontend**

Open any HTML file directly in your browser, or serve with a static server:

```bash
cd frontend
npx serve .
# Open http://localhost:5000
```

**Seed demo users** (first-time setup)

```bash
POST http://localhost:5000/api/auth/seed
```

This creates two demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@inventory.com | admin123 |
| Inventory Manager | manager@inventory.com | manager123 |

---

## 📡 API Endpoints

### Authentication — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/login` | Public | Login and receive JWT token |
| POST | `/register` | Public | Register new user |
| GET | `/me` | Protected | Get current user profile |
| GET | `/users` | Admin | List all users |
| PUT | `/users/:id` | Admin | Update user role/status |
| POST | `/seed` | Public | Create demo users |

### Spare Parts — `/api/spare-parts`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Protected | Get all spare parts (with filters) |
| POST | `/` | Protected | Add new spare part |
| GET | `/:id` | Protected | Get spare part details + usage history |
| PUT | `/:id` | Protected | Update spare part |
| DELETE | `/:id` | Protected | Delete spare part |
| PUT | `/:id/stock` | Protected | Update stock (consume/return/adjust) |
| GET | `/alerts/reorder` | Protected | Get all parts at/below reorder point |
| GET | `/meta/categories` | Protected | Get all unique categories |

### Machines — `/api/machines`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Protected | Get all machines |
| POST | `/` | Protected | Register new machine |
| GET | `/:id` | Protected | Get machine details |
| PUT | `/:id` | Protected | Update machine |
| PUT | `/:id/assign-part` | Protected | Assign spare part to machine |
| DELETE | `/:id` | Protected | Delete machine |

### Suppliers — `/api/suppliers`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Protected | Get all suppliers |
| POST | `/` | Protected | Add new supplier |
| GET | `/:id` | Protected | Get supplier details |
| PUT | `/:id` | Protected | Update supplier |
| DELETE | `/:id` | Protected | Delete supplier |

### Purchase Orders — `/api/purchase-orders`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Protected | Get all purchase orders |
| POST | `/` | Protected | Create new purchase order |
| GET | `/:id` | Protected | Get order details |
| PUT | `/:id` | Protected | Update order |
| PUT | `/:id/approve` | Admin | Approve order (changes status to ordered) |
| PUT | `/:id/receive` | Protected | Mark received + auto-update stock |
| DELETE | `/:id` | Protected | Delete draft/pending order |

### Dashboard — `/api/dashboard`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/stats` | Protected | KPI summary (counts, values) |
| GET | `/usage-chart` | Protected | Monthly usage trend data |
| GET | `/category-breakdown` | Protected | Category-wise inventory breakdown |
| GET | `/stock-status` | Protected | Stock status distribution |

### Reports — `/api/reports`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/inventory` | Protected | Full inventory report with summary |
| GET | `/usage` | Protected | Spare parts usage report (date range) |
| GET | `/cost-analysis` | Protected | Purchase spend + category cost breakdown |
| GET | `/eoq` | Protected | EOQ report for all parts |

---

## 🗄 Database Schema

### Users
```js
{
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  role: "admin" | "inventory_manager",
  department: String,
  isActive: Boolean,
  lastLogin: Date
}
```

### Spare Parts (Spare.js)
```js
{
  partNumber: String (unique),
  name: String,
  category: String,
  unit: String,
  currentStock: Number,
  minimumStock: Number,
  maximumStock: Number,
  reorderPoint: Number,
  reorderQuantity: Number,
  unitCost: Number,
  leadTimeDays: Number,
  annualDemand: Number,
  holdingCostRate: Number,
  orderingCost: Number,
  supplierId: ObjectId → Supplier,
  location: String,
  isCritical: Boolean,
  usageHistory: [{ date, qty, type, machine, reason }]
}
```

### Machines
```js
{
  machineId: String (unique),
  name: String,
  type: String,
  department: String,
  location: String,
  manufacturer: String,
  status: "active" | "maintenance" | "inactive",
  spareParts: [{ sparePartId: ObjectId, quantityRequired: Number, criticality: String }],
  lastMaintenanceDate: Date,
  nextMaintenanceDate: Date
}
```

### Suppliers
```js
{
  supplierCode: String (unique),
  name: String,
  contactPerson: String,
  email: String,
  phone: String,
  city: String,
  category: String,
  leadTimeDays: Number,
  rating: Number (1–5),
  paymentTerms: String,
  totalOrders: Number,
  totalSpend: Number,
  isActive: Boolean
}
```

### Purchase Orders (Order.js)
```js
{
  poNumber: String (auto-generated),
  supplierId: ObjectId → Supplier,
  items: [{ sparePartId, quantity, unitPrice, receivedQuantity }],
  status: "draft" | "pending" | "approved" | "ordered" | "partial" | "received" | "cancelled",
  orderDate: Date,
  expectedDeliveryDate: Date,
  actualDeliveryDate: Date,
  totalAmount: Number,
  approvedBy: ObjectId → User
}
```

---

## 📐 EOQ Formula

The EOQ (Economic Order Quantity) module minimizes total inventory cost:

```
EOQ = √( 2 × D × S / H )
```

| Variable | Description |
|----------|-------------|
| **D** | Annual Demand (units/year) |
| **S** | Ordering Cost per order (₹) |
| **H** | Annual Holding Cost per unit = Unit Cost × Holding Rate |

**Reorder Point Formula:**

```
Reorder Point = (Daily Demand × Lead Time Days) × 1.20
```
> The 1.20 factor adds a 20% safety stock buffer.

**Location:** `backend/utils/eoqCalculator.js`

---

## 📸 Screenshots

> *(Add your actual screenshots here by uploading images to your repo)*

| Dashboard | Spare Parts | EOQ Optimizer |
|-----------|------------|---------------|
| ![Dashboard](assets/screenshots/dashboard.png) | ![Spares](assets/screenshots/spares.png) | ![EOQ](assets/screenshots/eoq.png) |

| Purchase Orders | Reorder Alerts | Reports |
|----------------|----------------|---------|
| ![Orders](assets/screenshots/orders.png) | ![Alerts](assets/screenshots/alerts.png) | ![Reports](assets/screenshots/reports.png) |

---

## 🚀 Deployment

```
project deployed on : optimum-inventory-system.vercel.app

For Vercel deployment, a `vercel.json` is already configured in the backend folder:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/css/(.*)",
      "dest": "/frontend/css/$1"
    },
    {
      "src": "/js/(.*)",
      "dest": "/frontend/js/$1"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/frontend/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

---

