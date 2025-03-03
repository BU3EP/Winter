# E-Commerce Marketplace

## Overview
This project is a modern **E-Commerce Marketplace Web App** where **buyers and sellers** can interact seamlessly. The platform enables sellers to list products, buyers to explore and purchase them, and admins to manage the system effectively.

## Features
### General Features
- Responsive **UI/UX** design based on wireframe templates.
- **Secure Authentication** using JWT.
- **Role-Based Access Control** for buyers, sellers, and admins.

### Buyer Features
- Browse and search for products.
- Add products to the **shopping cart**.
- Place **orders** with a secure checkout process.
- View **order history** and manage their wishlist.

### Seller Features
- **List and manage products** with images, descriptions, and stock information.
- Manage **inventory and product updates**.
- View **sales analytics** and order history.

### Admin Features
- **Approve or reject** product listings.
- Manage users (approve sellers, block buyers, etc.).
- View platform analytics (sales, active users, etc.).

## Tech Stack
### Frontend
- **Vue.js 3** (Composition API) for a dynamic user experience.
- **Pinia** for state management.
- **Vue Router** for navigation.
- **SASS (SCSS)** for modular styling.

### Backend
- **Node.js** with **Express.js** for handling API requests.
- **MongoDB** with **Mongoose** for database management.
- **JWT Authentication** for secure user sessions.

### Deployment & Security
- **GitHub** for version control.
- **HTTPS & SSL** for secure communication.
- **Testing** with Jest/Mocha.

## Project Structure
```
ecomm-marketplace/
│── node_modules/        # Dependencies installed via npm
│── public/              # Static assets (favicon, images, etc.)
│── src/                 # Main source code
│   ├── assets/          # Global styles, images, and fonts
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Page layouts (Header, Footer, Sidebar)
│   ├── stores/          # Pinia state management stores
│   ├── services/        # API calls and business logic
│   ├── views/           # Page-level components
│   ├── routes/          # Vue Router configuration
│   ├── utils/           # Utility functions (formatting, validation, etc.)
│   ├── tests/           # Unit and integration tests
│   ├── App.vue          # Root Vue component
│   ├── main.js          # Main entry file
│── .env                 # Environment variables
│── .gitignore           # Files to ignore in Git
│── package.json         # Project dependencies and scripts
│── vite.config.js       # Vite configuration
│── README.md            # Documentation
```

## API Documentation
The backend API is built using **Express.js** and follows RESTful principles. The base URL is:
```
http://your-backend-url.com/api/
```
### Authentication
- **Register**: `POST /api/users/register`
- **Login**: `POST /api/users/login`
- **User Profile**: `GET /api/users/profile`

### Products
- **Get All Products**: `GET /api/products`
- **Get Product by ID**: `GET /api/products/:id`
- **Create Product**: `POST /api/products` *(Seller Only)*
- **Update Product**: `PUT /api/products/:id` *(Seller Only)*
- **Delete Product**: `DELETE /api/products/:id` *(Seller Only)*

### Shopping Cart
- **Get Cart**: `GET /api/cart`
- **Add to Cart**: `POST /api/cart/add`
- **Update Quantity**: `PUT /api/cart/update/:id`
- **Remove Item**: `DELETE /api/cart/remove/:id`
- **Clear Cart**: `DELETE /api/cart/clear`

### Orders
- **Create Order**: `POST /api/orders`
- **Get Orders**: `GET /api/orders`
- **Cancel Order**: `PUT /api/orders/:id/cancel`


For full API details, refer to the [API Documentation](API-documentation.md).

## Setup & Installation
### Prerequisites
- **Node.js** (v16+ recommended)
- **MongoDB** (local or cloud-based instance)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/SRai22/web-602-project-2.git
   cd web-602-project-2/ecomm-marketplace/
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add:
   ```sh
   VITE_API_BASE_URL=http://your-backend-url.com/api/
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Deployment
To deploy the application:
1. Build the frontend:
   ```sh
   npm run build
   ```
2. Deploy backend to **Vercel, Heroku, or AWS**.
3. Configure environment variables in the deployment platform.

## Future Enhancements
- **Product Reviews & Ratings**
- **Email Notifications for Orders**
- **PWA Features for Offline Support**
- **Integration with Payment Gateway**

## Contributors
- **Shravan S Rai** - *Developer*

## License
This project is **MIT licensed**.