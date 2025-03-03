<template>
    <div>
      <Navbar />
      <section class="hero">
        <button @click="navigateToShop">Shop Now</button>
      </section>

      <section class="products">
        <div v-for="product in limitedProducts" :key="product.id" class="product">
          <img :src=getImageUrl(product.image) :alt="product.name" class="product-image"/>
          <p><strong>{{ product.name }}</strong></p>
          <p>${{ product.price }}</p>
          <button @click="addToCart(product)">Add to Cart</button>
        </div>
      </section>
  
      <Footer />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '@/services/apiService';
  import Navbar from '@/components/Navbar.vue';
  import Footer from '@/components/Footer.vue';
  import { useCartStore } from '@/stores/cartStore';
  
  const router = useRouter();
  const cartStore = useCartStore();
  const products = ref([]);
  const categories = ref(["Laptops", "Desktops", "Smartphones", "Tablets"]);
  const navigateToShop = () => {
    router.push('/products');
  };

  const addToCart = (product) => {
    cartStore.addToCart(product);
  };

  const limitedProducts = computed(() => products.value.slice(0, 4));

  const getImageUrl = (imagePath) => {
      if (!imagePath) return "https://via.placeholder.com/150"; // Default image
      if (imagePath.startsWith("http")) return imagePath; // Full URL case
      console.log(`Image path received: ${imagePath}`)
      const url = `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/${imagePath.replace(/^\//, '')}`;
      console.log(url);
      return url;
    };

  onMounted(async () => {
    try {
      const productResponse = await api.get('/products');
      products.value = productResponse.data;

    } catch (error) {
      console.error("Error fetching products or categories:", error);
    }
  });

  </script>
  
  <style scoped>
  .hero {
    background: #6a50dd;
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

  .hero button:hover {
    background: #6182dd;
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
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    padding: 20px;
    justify-content: center;
}

  .product {
    background: #fff;
    padding: 15px;
    text-align: center;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
  }

  .product:hover {
    transform: scale(1.05);
  }

  .product img.product-image {
    width: 70%;
    height: 70%;
    max-height: 150px;
    object-fit: cover;
    border-radius: 5px;
  }
  </style>
  