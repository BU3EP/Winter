<template>
    <footer class="footer">
      <div class="container">
        <div class="footer-links">
          <router-link to="/about">About Us</router-link>
          <router-link to="/contact">Contact</router-link>
          <router-link to="/terms">Terms & Conditions</router-link>
          <router-link to="/privacy">Privacy Policy</router-link>
        </div>
        <div class="social-media">
          <a href="#" target="_blank">Facebook</a>
          <a href="#" target="_blank">Twitter</a>
          <a href="#" target="_blank">Instagram</a>
        </div>
        <p>&copy; {{ new Date().getFullYear() }} E-Commerce Marketplace. All rights reserved.</p>
      </div>
    </footer>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .footer {
    background: #333;
    color: white;
    padding: 20px 0;
    text-align: center;
  }
  .footer .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .footer-links {
    display: flex;
    gap: 15px;
    margin-bottom: 10px;
  }
  .footer-links a {
    color: white;
    text-decoration: none;
  }
  .social-media {
    display: flex;
    gap: 15px;
    margin-bottom: 10px;
  }
  .social-media a {
    color: white;
    text-decoration: none;
  }
  </style>