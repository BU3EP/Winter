<template>
    <div class="auth-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p><a href="#">Forgot Password?</a></p>
      <p>New User? <router-link to="/register">Sign Up</router-link></p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        email: "",
        password: "",
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post("http://localhost:5000/api/auth/login", {
            email: this.email,
            password: this.password,
          });
  
          const { token, user } = response.data;
          localStorage.setItem("token", token);
          alert(`Welcome ${user.name}!`);
  
          if (user.role === "buyer") {
            this.$router.push("/dashboard/buyer");
          } else if (user.role === "seller") {
            this.$router.push("/dashboard/seller");
          } else {
            this.$router.push("/admin");
          }
        } catch (error) {
          alert(error.response?.data?.message || "Login failed.");
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .auth-container {
    max-width: 350px;
    margin: 50px auto;
    padding: 20px;
    background: #ddd;
    text-align: center;
    border-radius: 8px;
  }
  input {
    width: 100%;
    padding: 8px;
    margin: 10px 0;
    border: 1px solid #bbb;
  }
  button {
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>
  