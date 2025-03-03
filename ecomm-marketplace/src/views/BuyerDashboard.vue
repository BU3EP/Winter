<template>
    <div>
      <Navbar />
      <div class="dashboard-container">
        <aside class="sidebar">
          <ul>
            <li @click="selectedTab = 'orders'">Order History</li>
            <li @click="selectedTab = 'wishlist'">Wishlist</li>
            <li @click="selectedTab = 'cart'">Shopping Cart</li>
          </ul>
        </aside>
        
        <section class="main-content">
          <div v-if="selectedTab === 'orders'">
            <h2>Order History</h2>
            <table>
              <tr>
                <th>Order ID</th>
                <th>Product Name</th>
                <th>Status</th>
                <th>Total Price</th>
              </tr>
              <tr v-for="order in orders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.productName }}</td>
                <td>{{ order.status }}</td>
                <td>${{ order.totalPrice }}</td>
              </tr>
            </table>
          </div>
          
          <div v-if="selectedTab === 'wishlist'">
            <h2>Wishlist</h2>
            <div class="wishlist-grid">
              <div v-for="item in wishlist" :key="item.id" class="wishlist-item">
                <img :src="item.image" alt="product" />
                <p>{{ item.name }}</p>
                <button @click="addToCart(item)">Add to Cart</button>
              </div>
            </div>
          </div>
          
          <div v-if="selectedTab === 'cart'">
            <CartView />
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/authStore';
  import { useCartStore } from '@/stores/cartStore';
  import api from '@/services/apiService';
  import Navbar from '@/components/Navbar.vue';
  import CartView from '@/views/CartView.vue';
  
  export default {
    components: { Navbar, CartView },
    setup() {
      const authStore = useAuthStore();
      const cartStore = useCartStore();
      const orders = ref([]);
      const wishlist = ref([]);
      const selectedTab = ref('orders');
  
      onMounted(async () => {
        if (authStore.user) {
          const orderResponse = await api.get('/orders');
          orders.value = orderResponse.data;
  
          const wishlistResponse = await api.get('/wishlist');
          wishlist.value = wishlistResponse.data;
        }
      });
  
      const addToCart = (item) => {
        cartStore.addToCart(item);
      };
  
      return { orders, wishlist, selectedTab, addToCart };
    }
  };
  </script>
  
  <style scoped>
  .dashboard-container {
    display: flex;
  }
  .sidebar {
    width: 250px;
    background: linear-gradient(135deg, #6e8df3, #6091fa);
    padding: 15px;
  }
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  .sidebar li {
    padding: 10px;
    cursor: pointer;
    background: white;
    margin-bottom: 10px;
    text-align: center;
    border-radius: 5px;
  }
  .main-content {
    flex-grow: 1;
    padding: 20px;
    background: #fff;
  }
  .wishlist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  .wishlist-item {
    background: white;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
  }
  .wishlist-item img {
    width: 100px;
    height: 100px;
  }
  </style>
  