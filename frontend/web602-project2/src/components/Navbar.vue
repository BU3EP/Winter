<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link class="navbar-brand" to="/">E-Shop</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/products">Shop</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/cart">Cart</router-link>
          </li>

          <!-- Show Dashboard based on Role -->
          <li v-if="user && user.role === 'buyer'" class="nav-item">
            <router-link class="nav-link" to="/dashboard/buyer">Dashboard</router-link>
          </li>
          <li v-if="user && user.role === 'seller'" class="nav-item">
            <router-link class="nav-link" to="/dashboard/seller">Seller Panel</router-link>
          </li>
          <li v-if="user && user.role === 'admin'" class="nav-item">
            <router-link class="nav-link" to="/admin">Admin Panel</router-link>
          </li>

          <!-- Show Login or Logout -->
          <li v-if="!user" class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li v-if="user" class="nav-item">
            <button @click="logout" class="nav-link btn btn-link">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      user: null, // Stores user session
    };
  },
  methods: {
    loadUserSession() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.user = null;
      this.$router.push("/login"); // Redirect after logout
    },
  },
  mounted() {
    this.loadUserSession();
  },
};
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.btn-link {
  border: none;
  background: none;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}
</style>
