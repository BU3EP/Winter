<template>
  <div>
    <Navbar />
    <div class="container">
      <aside class="filters">
        <label>Categories:</label>
        <select v-model="selectedCategory" @change="fetchProducts">
          <option value="">All</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
        <label>Price Range:</label>
        <input type="range" v-model="priceRange" min="0" max="2000" @change="fetchProducts">
        <label>Sort By:</label>
        <select v-model="sortBy" @change="fetchProducts">
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </aside>
      <section class="products">
        <div v-for="product in products" :key="product.id" class="product">
          <img :src=getImageUrl(product.image) :alt="product.name" class="product-image"/>
          <p><strong>{{ product.name }}</strong></p>
          <p>
            ${{ product.price }}
          </p>
          <button @click="addToCart(product)">Add to Cart</button>
        </div>
      </section>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="page === 1">&laquo; Prev</button>
      <span>Page {{ page }}</span>
      <button @click="nextPage">Next &raquo;</button>
    </div>
    <Footer />
  </div>
</template>

<script>
import api from '@/services/apiService';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import { ref, onMounted } from 'vue';

export default {
  components: { Navbar, Footer },
  setup() {
    const products = ref([]);
    const categories = ref(["Laptops", "Desktops", "Smartphones", "Tablets"]);
    const selectedCategory = ref("");
    const priceRange = ref(2000);
    const sortBy = ref("price-asc");
    const page = ref(1);

    const fetchProducts = async () => {
      try {
        const response = await api.get('/products', {
          params: { 
            category: selectedCategory.value, // ✅ Use the reactive variable
            price_max: priceRange.value, 
            sort: sortBy.value, 
            page: page.value 
          }
        });
        console.log(response.data)
        products.value = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const getImageUrl = (imagePath) => {
      if (!imagePath) return "https://via.placeholder.com/150"; // Default image
      if (imagePath.startsWith("http")) return imagePath; // Full URL case
      console.log(`Image path received: ${imagePath}`)
      const url = `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/${imagePath.replace(/^\//, '')}`;
      console.log(url);
      return url;
    };

    const addToCart = async (product) => {
      try {
        const token = localStorage.getItem('token');
        await api.post('/cart/add', 
          { productId: product.id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Added to cart!');
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    };

    const nextPage = () => {
      page.value++;
      fetchProducts();
    };
    const prevPage = () => {
      if (page.value > 1) {
        page.value--;
        fetchProducts();
      }
    };

    onMounted(fetchProducts);

    return { products, categories, selectedCategory, priceRange, sortBy, page, fetchProducts, addToCart, nextPage, prevPage, getImageUrl };
  }
};
</script>

<style scoped>
.container {
  display: flex;
  margin: 20px;
}
.filters {
  width: 250px;
  padding: 15px;
  background: #dddddd;
}
.products {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  padding: 20px;
}
.product {
  background: #fff;
  padding: 15px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}
.product img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
}
.pagination {
  text-align: center;
  margin: 20px;
}
button {
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
}
</style>
