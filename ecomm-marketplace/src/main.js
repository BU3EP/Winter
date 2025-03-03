import { createApp } from 'vue';
import App from './App.vue';
import router from './routes';
import { createPinia } from 'pinia';
import { useAuthStore } from "@/stores/authStore";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

const authStore = useAuthStore();
authStore.initializeAuth(); // Load user info on startup

app.mount("#app");