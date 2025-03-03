# **API Interface Documentation**
### **E-Commerce Marketplace Backend API**
**Base URL:** `http://localhost:PORT/api/`

## **1. Authentication**
Handles user authentication and session management.

### **1.1 User Registration**
- **Endpoint:** `POST /api/users/register`
- **Request Body:** 
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "johndoe@example.com"
    },
    "token": "jwt_token"
  }
  ```

### **1.2 User Login**
- **Endpoint:** `POST /api/users/login`
- **Request Body:**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "role": "buyer"
    },
    "token": "jwt_token"
  }
  ```

### **1.3 User Profile (Protected)**
- **Endpoint:** `GET /api/users/profile`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "id": "user_id",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "role": "buyer"
  }
  ```

---

## **2. Products**
Handles product management, including **image uploads** when creating or updating products.

### **2.1 Get All Products**
- **Endpoint:** `GET /api/products`
- **Response:**
  ```json
  [
    {
      "id": "product_id",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 1200,
      "stock": 10,
      "category": "Electronics",
      "image": "/uploads/image.jpg",
      "seller": "seller_id"
    }
  ]
  ```

### **2.2 Get Product by ID**
- **Endpoint:** `GET /api/products/:id`
- **Response:** Similar to above.

---

### **2.3 Create Product (Now Includes Image Upload)**
- **Endpoint:** `POST /api/products`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer jwt_token",
    "Content-Type": "multipart/form-data"
  }
  ```
- **Request Body (Form Data):**
  - `name`: `"Laptop"`
  - `description`: `"High-end laptop"`
  - `price`: `1200`
  - `stock`: `10`
  - `category`: `"Electronics"`
  - `image`: (Attach Image File)

- **Example Request Using Axios (Frontend)**
  ```javascript
  const formData = new FormData();
  formData.append("name", "Laptop");
  formData.append("description", "High-end laptop");
  formData.append("price", 1200);
  formData.append("stock", 10);
  formData.append("category", "Electronics");
  formData.append("image", selectedFile);  // Image file

  const response = await axios.post("/api/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${userToken}`,
    },
  });
  ```

- **Response:**
  ```json
  {
    "message": "Product created successfully",
    "product": {
      "id": "product_id",
      "name": "Laptop",
      "description": "High-end laptop",
      "price": 1200,
      "stock": 10,
      "category": "Electronics",
      "image": "/uploads/image.jpg",
      "seller": "seller_id"
    }
  }
  ```

---

### **2.4 Update Product (Now Supports Image Upload)**
- **Endpoint:** `PUT /api/products/:id`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer jwt_token",
    "Content-Type": "multipart/form-data"
  }
  ```
- **Request Body (Form Data - Optional Fields):**
  - `name` (Optional)
  - `description` (Optional)
  - `price` (Optional)
  - `stock` (Optional)
  - `category` (Optional)
  - `image`: (Optional - New Image File)

- **Example Request:**
  ```javascript
  const formData = new FormData();
  formData.append("price", 1500);  // Updating price
  formData.append("stock", 5);  // Updating stock
  formData.append("image", selectedFile);  // Upload new image

  const response = await axios.put(`/api/products/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${userToken}`,
    },
  });
  ```

- **Response:**
  ```json
  {
    "message": "Product updated successfully",
    "product": {
      "id": "product_id",
      "name": "Laptop",
      "description": "High-end laptop",
      "price": 1500,
      "stock": 5,
      "category": "Electronics",
      "image": "/uploads/new-image.jpg"
    }
  }
  ```

**🛠 Backend Fix:**
- The old image **is now deleted** when a new image is uploaded.
- If no new image is uploaded, the old image remains.

---

### **2.5 Delete Product**
- **Endpoint:** `DELETE /api/products/:id`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Product removed successfully"
  }
  ```

**🛠 Backend Fix:**
- The product's **image is now deleted** when the product is removed.

---


## **3. Shopping Cart**
Handles user cart functionalities.

### **3.1 Get Cart**
- **Endpoint:** `GET /api/cart`
- **Headers:** `{ "Authorization": "Bearer jwt_token" }`
- **Response:**
  ```json
  {
    "items": [
      {
        "product": { "id": "product_id", "name": "Laptop", "price": 1200 },
        "quantity": 2
      }
    ]
  }
  ```

### **3.2 Add to Cart**
- **Endpoint:** `POST /api/cart/add`
- **Headers:** `{ "Authorization": "Bearer jwt_token" }`
- **Request Body:**
  ```json
  {
    "productId": "product_id",
    "quantity": 2
  }
  ```

### **3.3 Update Cart Quantity**
- **Endpoint:** `PUT /api/cart/update/:id`
- **Headers:** `{ "Authorization": "Bearer jwt_token" }`
- **Request Body:**
  ```json
  {
    "quantity": 3
  }
  ```

### **3.4 Remove from Cart**
- **Endpoint:** `DELETE /api/cart/remove/:id`
- **Headers:** `{ "Authorization": "Bearer jwt_token" }`

### **3.5 Clear Cart**
- **Endpoint:** `DELETE /api/cart/clear`
- **Headers:** `{ "Authorization": "Bearer jwt_token" }`

---

## **4. Orders**
Handles orders placed by users.

### **4.1 Create Order**
- **Endpoint:** `POST /api/orders`
- **Headers:** `{ "Authorization": "Bearer jwt_token" }`
- **Request Body:**
  ```json
  {
    "products": [
      { "product": "product_id", "quantity": 2 }
    ],
    "totalPrice": 2400
  }
  ```
- **Response:**
  ```json
  { "message": "Order placed successfully", "orderId": "order_id" }
  ```

### **4.2 Get User Orders**
- **Endpoint:** `GET /api/orders`
- **Headers:** `{ "Authorization": "Bearer jwt_token" }`
- **Response:** List of orders.

### **4.3 Get Order by ID**
- **Endpoint:** `GET /api/orders/:id`
- **Headers:** `{ "Authorization": "Bearer jwt_token" }`
- **Response:** Order details.

### **4.4 Cancel Order**
- **Endpoint:** `PUT /api/orders/:id/cancel`
- **Headers:** `{ "Authorization": "Bearer jwt_token" }`

---

## **5. Admin Controls**
Manages platform analytics and seller approvals.

### **5.1 Approve Seller**
- **Endpoint:** `PUT /api/admin/approve-seller/:id`
- **Headers:** `{ "Authorization": "Bearer jwt_token" }`
- **Response:**
  ```json
  { "message": "Seller approved successfully" }
  ```

### **5.2 Reject Seller**
- **Endpoint:** `PUT /api/admin/reject-seller/:id`
- **Headers:** `{ "Authorization": "Bearer jwt_token" }`

### **5.3 Get Platform Analytics**
- **Endpoint:** `GET /api/admin/analytics`
- **Headers:** `{ "Authorization": "Bearer jwt_token" }`

---

## **6. Image Upload**
Handles product image uploads.

### **6.1 Upload Image**
- **Endpoint:** `POST /api/products/upload`
- **Headers:** `Content-Type: multipart/form-data`
- **Request Body:**
  - `image` (file)
- **Response:**
  ```json
  { "imageUrl": "/uploads/filename.jpg" }
  ```

---

# **Authentication & Security**
- **All protected routes require JWT authentication.**
- **Admin routes require an admin role.**
- **Use `Authorization: Bearer jwt_token` in headers for protected routes.**

---

# **Error Handling**
- `400 Bad Request`: Invalid data format.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: Access denied.
- `404 Not Found`: Resource not found.
- `500 Internal Server Error`: Backend error.

---