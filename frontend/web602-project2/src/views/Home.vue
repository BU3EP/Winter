<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <h1>Welcome to E-Shop</h1>
      <p>Your one-stop shop for the best deals</p>
      <router-link to="/products" class="shop-now-btn">Shop Now</router-link>
    </section>

    <!-- Categories Section -->
    <section class="categories">
      <h2>Shop by Category</h2>
      <div class="category-container">
        <div v-for="category in categories" :key="category.id" class="category-box">
          {{ category.name }}
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="products">
      <h2>Featured Products</h2>
      <div class="product-grid">
        <div v-for="product in featuredProducts" :key="product.id" class="product-card">
          <img :src="product.image" :alt="product.name">
          <h3>{{ product.name }}</h3>
          <p>${{ product.price }}</p>
          <router-link :to="`/product/${product.id}`" class="product-btn">View Product</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      categories: [],
      featuredProducts: [],
      apiBaseUrl: "http://localhost:5000/api/products", // Change if your API base URL is different
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/categories`);
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async fetchFeaturedProducts() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}?featured=true`);
        this.featuredProducts = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  },
  mounted() {
    this.fetchCategories();
    this.fetchFeaturedProducts();
  }
};
</script>

<style scoped>
.landing-page {
  text-align: center;
}

/* Hero Section */
.hero {
  background: #ccc;
  padding: 50px 20px;
  margin-bottom: 20px;
}
.shop-now-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

/* Categories */
.categories {
  padding: 20px;
}
.category-container {
  display: flex;
  justify-content: center;
  gap: 15px;
}
.category-box {
  background: #bbb;
  padding: 15px;
  width: 120px;
  text-align: center;
  border-radius: 5px;
}

/* Products */
.products {
  padding: 20px;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  padding: 20px;
}
.product-card {
  background: #ddd;
  padding: 15px;
  text-align: center;
  border-radius: 5px;
}
.product-card img {
  width: 100%;
  height: auto;
}
.product-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 12px;
  background: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}
</style>
