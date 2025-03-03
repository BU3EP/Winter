import { defineStore } from "pinia";
import api from "@/services/authService";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
  }),

  actions: {
    async login(payload) {
      try {
        const { data } = await api.post("/users/login", {
          email: payload.email,
          password: payload.password,
        });
        this.user = data.user;
        this.token = data.token;
        localStorage.setItem("token", data.token);
        alert("Login Successful!");
        useRouter().push("/products");
      } catch (error) {
        console.error("Login error:", error);
        alert("Invalid credentials!");
      }
    },

    async register(payload) {
      try {
        const { data } = await api.post("/users/register", {
          name: payload.name,
          email: payload.email,
          password: payload.password,
        });
        this.user = data.user;
        this.token = data.token;
        localStorage.setItem("token", data.token);
        alert("Account Created!");
        useRouter().push("/products");
      } catch (error) {
        console.error("Registration error:", error);
        alert("Failed to register!");
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      useRouter().push("/");
    },
  },
});
