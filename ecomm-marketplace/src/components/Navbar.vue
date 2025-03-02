<template>
  <nav class="navbar">
    <div class="logo-container">
      <img src="/wu-logo.png" alt="Marketplace Logo" class="logo" />
      <span class="brand-name">E-Market</span>
    </div>
    
    <button class="menu-toggle" @click="toggleMobileMenu">☰</button>

    <div :class="['nav-links', { 'mobile-open': mobileMenuOpen }]">
      <router-link to="/">Home</router-link>
      <router-link to="/products">Categories</router-link>
      <router-link to="/cart">Cart ({{ cartCount }})</router-link>
      <router-link v-if="!user" to="/login">Login</router-link>
      <router-link v-if="user && user.role === 'seller'" to="/seller">Seller Dashboard</router-link>
      <router-link v-if="user && user.role === 'admin'" to="/admin">Admin Panel</router-link>

      <div v-if="user" class="user-menu">
        <img v-if="user.avatar" :src="user.avatar" alt="User Avatar" class="avatar" />
        <span v-else @click="toggleMenu">{{ user.name }}</span>
        <ul v-show="menuOpen">
          <li><router-link to="/profile">Profile</router-link></li>
          <li @click="logout">Logout</li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const menuOpen = ref(false);
const mobileMenuOpen = ref(false);
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const cartCount = computed(() => cartStore.totalItems);
const user = computed(() => authStore.user);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(90deg, #6f5fff, #7b93fe);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 40px;
  height: 40px;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 15px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 5px;
  transition: background 0.3s;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-menu {
  position: relative;
  cursor: pointer;
}

.user-menu ul {
  position: absolute;
  background: white;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 5px;
  display: none;
}

.user-menu:hover ul {
  display: block;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
    color: white;
  }
  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 50px;
    left: 0;
    background: white;
    width: 100%;
    text-align: center;
  }
  .nav-links.mobile-open {
    display: flex;
  }
}
</style>
