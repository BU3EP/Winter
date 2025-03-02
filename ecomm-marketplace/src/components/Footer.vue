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
        <a href="#" class="social-icon facebook">Facebook</a>
        <a href="#" class="social-icon twitter">Twitter</a>
        <a href="#" class="social-icon instagram">Instagram</a>
      </div>
      <p>&copy; {{ new Date().getFullYear() }} E-Market. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: linear-gradient(90deg, #4b79a1, #283e51);
  color: white;
  padding: 20px 0;
  text-align: center;
  transition: background 0.3s ease-in-out;
}

.footer:hover {
  background: linear-gradient(90deg, #355c7d, #2c3e50);
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-links {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.footer-links a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s, transform 0.3s;
}

.footer-links a:hover {
  color: #ffd700;
  transform: scale(1.1);
}

.social-media {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.social-icon {
  text-decoration: none;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 5px;
  transition: background 0.3s, transform 0.3s;
}

.social-icon.facebook {
  background: #3b5998;
}

.social-icon.twitter {
  background: #1da1f2;
}

.social-icon.instagram {
  background: #e1306c;
}

.social-icon:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

p {
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
