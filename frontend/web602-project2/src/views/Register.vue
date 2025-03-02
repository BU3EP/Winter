<template>
    <div class="auth-container">
      <h2>Sign Up</h2>
      <form @submit.prevent="register">
        <input v-model="name" type="text" placeholder="Full Name" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />
        <div class="role-selection">
          <label><input type="radio" v-model="role" value="buyer" required /> Buyer</label>
          <label><input type="radio" v-model="role" value="seller" required /> Seller</label>
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "buyer",
      };
    },
    methods: {
      async register() {
        if (this.password !== this.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
  
        try {
          const response = await axios.post("http://localhost:5000/api/users/register", {
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
          });
  
          alert("Registration successful! Please wait for admin approval.");
          this.$router.push("/login");
        } catch (error) {
          alert(error.response?.data?.message || "Registration failed.");
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
  .role-selection {
    margin: 10px 0;
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
  