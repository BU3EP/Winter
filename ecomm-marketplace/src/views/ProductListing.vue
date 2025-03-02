<template>
    <div>
      <Navbar />
      <section class="product-list">
        <h1>Product Listing</h1>
        <p>This is a placeholder for the Product Listing Page.</p>
        <router-link to="/">Go Back to Home</router-link>
      </section>
      <Footer />
    </div>
  </template>
  
  <script setup>
  import Navbar from '@/components/Navbar.vue';
  import Footer from '@/components/Footer.vue';
  </script>
  
  <style scoped>
  .product-list {
    text-align: center;
    padding: 50px;
  }
  </style>
  