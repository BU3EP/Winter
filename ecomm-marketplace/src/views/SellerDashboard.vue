<template>
    <div>
      <Navbar />
      <div class="seller-dashboard-container">
        <aside class="sidebar">
          <ul>
            <li @click="selectedTab = 'manageProducts'">Manage Products</li>
            <li @click="selectedTab = 'addProduct'">Add Product</li>
            <li @click="selectedTab = 'sales'">Sales Analytics</li>
          </ul>
        </aside>
  
        <section class="main-content">
          <div v-if="selectedTab === 'manageProducts'">
            <h2>Manage Products</h2>
            <table class="product-table">
              <tr>
                <th>Product Name</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.name }}</td>
                <td>{{ product.stock }}</td>
                <td>${{ product.price }}</td>
                <td>{{ product.status }}</td>
                <td>
                  <button @click="editProduct(product)">Edit</button>
                  <button @click="deleteProduct(product.id)">Delete</button>
                </td>
              </tr>
            </table>
          </div>
  
          <div v-if="selectedTab === 'addProduct'">
            <h2>Add New Product</h2>
            <form @submit.prevent="addProduct">
              <label>Product Name</label>
              <input v-model="newProduct.name" type="text" required />
              <label>Price</label>
              <input v-model="newProduct.price" type="number" required />
              <label>Description</label>
              <textarea v-model="newProduct.description" required></textarea>
              <label>Stock</label>
              <input v-model="newProduct.stock" type="number" required />
              <label>Image</label>
              <input type="file" @change="handleFileUpload" required />
              <button type="submit">Add Product</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import api from '@/services/apiService';
  import Navbar from '@/components/Navbar.vue';
  
  export default {
    components: { Navbar },
    setup() {
      const products = ref([]);
      const selectedTab = ref('manageProducts');
      const newProduct = ref({ name: '', price: 0, description: '', stock: 0, image: null });
  
      const fetchProducts = async () => {
        try {
          const response = await api.get('/api/products/seller');
          products.value = response.data;
        } catch (error) {
          console.error("Error fetching seller products:", error);
        }
      };
  
      const addProduct = async () => {
        try {
          const formData = new FormData();
          Object.keys(newProduct.value).forEach((key) => {
            formData.append(key, newProduct.value[key]);
          });
  
          await api.post('/api/products', formData);
          fetchProducts();
          alert("Product added successfully!");
        } catch (error) {
          console.error("Error adding product:", error);
        }
      };
  
      const deleteProduct = async (id) => {
        try {
          await api.delete(`/api/products/${id}`);
          fetchProducts();
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      };
  
      const handleFileUpload = (event) => {
        newProduct.value.image = event.target.files[0];
      };
  
      onMounted(fetchProducts);
  
      return { products, selectedTab, newProduct, fetchProducts, addProduct, deleteProduct, handleFileUpload };
    },
  };
  </script>
  
  <style scoped>
  .seller-dashboard-container {
    display: flex;
    background: linear-gradient(135deg, #6f5fff, #7b93fe);
    padding: 20px;
  }
  .sidebar {
    width: 250px;
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
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
    border-radius: 10px;
  }
  .product-table {
    width: 100%;
    border-collapse: collapse;
  }
  .product-table th, .product-table td {
    padding: 10px;
    border-bottom: 1px solid #bbb;
    text-align: center;
  }
  .product-table th {
    background: #ccc;
  }
  </style>
  