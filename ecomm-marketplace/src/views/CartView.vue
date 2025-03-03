<template>
    <div>
      <Navbar />
      <div class="container">
        <section class="cart">
          <h2>Shopping Cart</h2>
  
          <table class="cart-table">
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Remove</th>
            </tr>
            <tr v-for="item in cartItems" :key="item.id">
              <td class="product-info">
                <img :src="item.image || '/placeholder.jpg'" alt="Product Image" />
                {{ item.name }}
              </td>
              <td>${{ item.price.toFixed(2) }}</td>
              <td>
                <input
                  type="number"
                  v-model="item.quantity"
                  min="1"
                  @change="updateQuantity(item, item.quantity)"
                />
              </td>
              <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
              <td @click="removeFromCart(item.id)" class="remove-btn">X</td>
            </tr>
          </table>
  
          <div class="summary">
            <p><strong>Total: ${{ totalPrice.toFixed(2) }}</strong></p>
            <button class="checkout-btn" @click="checkout">Proceed to Checkout</button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  </template>
  
  <script setup>
  import { computed } from "vue";
  import { useCartStore } from "@/stores/cartStore";
  import Navbar from "@/components/Navbar.vue";
  import Footer from "@/components/Footer.vue";
  
  const cartStore = useCartStore();
  const cartItems = computed(() => cartStore.cartItems);
  const totalPrice = computed(() => cartStore.totalPrice);
  
  const updateQuantity = (item, quantity) => {
    if (quantity < 1) {
      removeFromCart(item.id);
    } else {
      item.quantity = parseInt(quantity, 10);
    }
  };
  
  const removeFromCart = (productId) => {
    cartStore.removeFromCart(productId);
  };
  
  const checkout = () => {
    alert("Proceeding to checkout...");
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    margin: 20px;
  }
  
  .cart {
    width: 70%;
    background: #ddd;
    padding: 20px;
    border-radius: 10px;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .cart-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .cart-table th, .cart-table td {
    padding: 10px;
    border-bottom: 1px solid #bbb;
    text-align: center;
  }
  
  .cart-table th {
    background: #ccc;
  }
  
  .cart-table img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }
  
  .product-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .remove-btn {
    cursor: pointer;
    color: red;
    font-weight: bold;
  }
  
  .summary {
    margin-top: 20px;
    padding: 15px;
    background: #ccc;
    text-align: right;
    border-radius: 5px;
  }
  
  .checkout-btn {
    margin-top: 10px;
    padding: 10px 15px;
    background: #6884ff;
    border: none;
    color: white;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
  }
  
  .checkout-btn:hover {
    background: #67b5f5;
  }
  </style>
  