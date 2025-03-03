# E-Commerce Marketplace Backend

This is the backend for a modern e-commerce marketplace, enabling buyers, sellers, and admins to interact seamlessly. It is built with **Node.js**, **Express.js**, and **MongoDB**.

## Features

- **User Authentication** (JWT-based login & session management)
- **Role-based Access Control** (Buyer, Seller, Admin)
- **Product Listings** (Create, update, delete, and browse products)
- **Shopping Cart** (Manage cart items and checkout)
- **Order Management** (Place, track, and cancel orders)
- **Admin Dashboard** (Approve sellers, manage users, view analytics)
- **Security Measures** (Rate limiting, sanitization, XSS protection)
- **File Uploads** (Image upload for products)

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt.js
- **Security:** Helmet, CORS, Mongo-Sanitize, XSS-Clean
- **Logging:** Morgan, Winston
- **File Uploads:** Multer

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

- **Node.js** (v16+)
- **MongoDB** (Locally or via a cloud provider like MongoDB Atlas)
- **Environment Variables** (See `.env.example` for required variables)

### 2️⃣ Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/SRai22/web-602-project-2.git
cd web-602-project-2/backend/
npm install
```

### 3️⃣ Environment Setup

Create a `.env` file in the root directory and configure the following:

```ini
PORT=5000
MONGO_URI=mongodb+srv://your_mongo_connection
JWT_SECRET=your_secret_key
SESSION_SECRET=your_session_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5000
```

### 4️⃣ Run the Server

```sh
npm start  # Start the server in production mode
npm run dev  # Start in development mode (nodemon enabled)
```

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint        | Description            | Protected |
|--------|---------------|----------------------|------------|
| POST   | `/api/auth/register` | Register a new user | ❌ |
| POST   | `/api/auth/login` | Login and get a JWT token | ❌ |
| GET    | `/api/auth/session` | Check user session | ✅ |
| POST   | `/api/auth/logout` | Logout user | ✅ |

### Users

| Method | Endpoint        | Description            | Protected |
|--------|---------------|----------------------|------------|
| GET    | `/api/users/profile` | Get user profile | ✅ |

### Products

| Method | Endpoint        | Description            | Protected |
|--------|---------------|----------------------|------------|
| GET    | `/api/products` | Get all products | ❌ |
| GET    | `/api/products/:id` | Get product by ID | ❌ |
| POST   | `/api/products` | Add new product | ✅ (Seller) |
| PUT    | `/api/products/:id` | Update product | ✅ (Seller) |
| DELETE | `/api/products/:id` | Delete product | ✅ (Seller) |
| POST   | `/api/products/upload` | Upload product image | ✅ |

### Cart

| Method | Endpoint        | Description            | Protected |
|--------|---------------|----------------------|------------|
| GET    | `/api/cart` | Get user's cart | ✅ |
| POST   | `/api/cart/add` | Add product to cart | ✅ |
| PUT    | `/api/cart/update/:id` | Update cart item quantity | ✅ |
| DELETE | `/api/cart/remove/:id` | Remove item from cart | ✅ |
| DELETE | `/api/cart/clear` | Clear entire cart | ✅ |

### Orders

| Method | Endpoint        | Description            | Protected |
|--------|---------------|----------------------|------------|
| POST   | `/api/orders` | Create new order | ✅ |
| GET    | `/api/orders` | Get all user orders | ✅ |
| GET    | `/api/orders/:id` | Get specific order | ✅ |
| PUT    | `/api/orders/:id/cancel` | Cancel an order | ✅ |

### Admin (Protected)

| Method | Endpoint        | Description            | Protected |
|--------|---------------|----------------------|------------|
| PUT    | `/api/admin/approve-seller/:id` | Approve a seller | ✅ (Admin) |
| PUT    | `/api/admin/reject-seller/:id` | Reject a seller | ✅ (Admin) |
| GET    | `/api/admin/analytics` | View platform analytics | ✅ (Admin) |

---

## 🛡 Security Features

- **JWT Authentication** with user role-based access
- **Input Sanitization** (MongoDB query injection prevention, XSS protection)
- **Rate Limiting** (Limits requests to prevent DDoS attacks)
- **Helmet** (Secures HTTP headers)
- **CORS** (Restricts API access to allowed domains)
- **Sessions Stored Securely** using MongoDB

---

## 🐞 Error Handling & Logging

- **Express Middleware** for catching 404 errors
- **Winston & Morgan** for logging API requests and errors

---

## 📝 Future Enhancements

- **Product Reviews & Ratings**
- **Email Notifications for Orders**
- **GraphQL API for Flexible Queries**
- **WebSockets for Real-time Order Updates**
- **Admin Dashboard for Analytics**

---

## 📄 License

This project is licensed under the MIT License.

---
