<template>
  <nav class="navbar">
    <div class="logo">LOGO</div>
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

const searchQuery = ref('');
const menuOpen = ref(false);
const mobileMenuOpen = ref(false);
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const cartCount = computed(() => cartStore.totalItems);
const user = computed(() => authStore.user);

const search = () => {
  if (searchQuery.value) {
    router.push(`/search?q=${searchQuery.value}`);
  }
};

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
  background: #ddd;
  position: relative;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 15px;
}

.nav-links.mobile-open {
  display: block;
  position: absolute;
  top: 50px;
  left: 0;
  background: white;
  width: 100%;
  text-align: center;
}

.user-menu {
  position: relative;
  cursor: pointer;
}

.user-menu ul {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  list-style: none;
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
  }
  .nav-links {
    display: none;
    flex-direction: column;
  }
}
</style>
