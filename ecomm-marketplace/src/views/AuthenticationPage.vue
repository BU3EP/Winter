<template>
    <div>
        <Navbar />
        <div class="auth-container">
            <div class="auth-card">
                <h2>{{ isLogin ? "Login" : "Sign Up" }}</h2>
                <form @submit.prevent="handleSubmit">
                <input v-model="form.email" type="email" placeholder="Email" required />
                <input v-model="form.password" type="password" placeholder="Password" required />
        
                <template v-if="!isLogin">
                    <input v-model="form.name" type="text" placeholder="Full Name" required />
                    <input v-model="form.confirmPassword" type="password" placeholder="Confirm Password" required />
                    <div class="role-selection">
                    <label><input v-model="form.role" type="radio" value="buyer" /> Buyer</label>
                    <label><input v-model="form.role" type="radio" value="seller" /> Seller</label>
                    </div>
                </template>
        
                <button type="submit">{{ isLogin ? "Login" : "Sign Up" }}</button>
                </form>
        
                <p class="toggle-text">
                {{ isLogin ? "New user?" : "Already have an account?" }}
                <span @click="toggleAuth">{{ isLogin ? "Sign Up" : "Login" }}</span>
                </p>
            </div>
        </div>
        <Footer />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "@/stores/authStore";
  import Navbar from "@/components/Navbar.vue";  // Import Navbar
  import Footer from "@/components/Footer.vue";  // Import Footer
  
  const authStore = useAuthStore();
  const router = useRouter();

  onMounted(() => {
    authStore.setRouter(router);
  });

  const isLogin = ref(true);
  const form = ref({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    role: "buyer",
  });
  
  const toggleAuth = () => {
    isLogin.value = !isLogin.value;
    form.value = { email: "", password: "", name: "", confirmPassword: "", role: "buyer" };
  };
  
  const handleSubmit = async () => {
    if (!isLogin.value && form.value.password !== form.value.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    const payload = { ...form.value };
    if (isLogin.value) {
      await authStore.login(payload);
    } else {
      await authStore.register(payload);
    }
  };
  </script>
  
  <style scoped>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to right, #627bee, #687cee);
  }
  
  .auth-card {
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 350px;
  }
  
  h2 {
    margin-bottom: 1rem;
    color: #333;
  }
  
  input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .role-selection {
    margin: 10px 0;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background: #6884ff;
    border: none;
    color: white;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
  }
  
  button:hover {
    background: #67b5f5;
  }
  
  .toggle-text {
    margin-top: 10px;
    font-size: 14px;
  }
  
  .toggle-text span {
    color: #6c8fff;
    cursor: pointer;
    font-weight: bold;
  }
  </style>
  