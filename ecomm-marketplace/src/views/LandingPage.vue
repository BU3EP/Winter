<template>
    <div>
      <Navbar />
      
      <section class="hero">
        <button @click="navigateToShop">Shop Now</button>
      </section>
  
      <section class="categories">
        <div class="category-box" v-for="n in 4" :key="n">X</div>
      </section>
  
      <section class="products">
        <div v-for="n in 4" :key="n" class="product">
          <img alt="Product Image" />
          <p><strong>Product Name</strong></p>
          <p>Price</p>
          <button>Add to Cart</button>
        </div>
      </section>
  
      <Footer />
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import Navbar from '@/components/Navbar.vue';
  import Footer from '@/components/Footer.vue';
  
  const router = useRouter();
  
  const navigateToShop = () => {
    router.push('/products');
  };
  </script>
  
  <style scoped>
  .hero {
    background: #ccc;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;
  }
  
  .hero button {
    padding: 10px 20px;
    font-size: 18px;
  }
  
  .categories {
    display: flex;
    justify-content: center;
    gap: 15px;
    padding: 20px;
  }
  
  .category-box {
    width: 80px;
    height: 80px;
    background: #bbb;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .products {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    padding: 20px;
  }
  
  .product {
    background: #ddd;
    padding: 15px;
    text-align: center;
  }
  
  .product img {
    width: 100%;
    height: 100px;
    background: #aaa;
  }
  </style>
  