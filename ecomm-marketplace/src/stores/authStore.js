import { defineStore } from "pinia";
import api from "@/services/authService";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    router: null,
  }),

  actions: {

    setRouter(routerInstance) {
      this.router = routerInstance;
    },

    async login(payload) {
      try {
        const { data } = await api.post("/users/login", {
          email: payload.email,
          password: payload.password,
        });

        // Response received will be 
        // json
        // {
        //   "message": "Login successful",
        //   "user": {
        //     "id": "user_id",
        //     "name": "John Doe",
        //     "email": "johndoe@example.com",
        //     "role": "buyer"
        //   },
        //   "token": "jwt_token"
        // }

        this.user = data.user;
        this.token = data.token;

        localStorage.setItem("user", data.user);
        localStorage.setItem("token", data.token);

        alert("Login Successful!");

        if (this.router) {
          this.router.push("/products");  // Now router is available globally
        } else {
          console.error("Router is not initialized!");
        }
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


        if (this.router) {
          this.router.push("/login");  // Redirect user to login page
        } else {
          console.error("Router is not initialized!");
        }

      } catch (error) {
        console.error("Registration error:", error);
        alert("Failed to register!");
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      if (this.router) {
        this.router.push("/");
      } else {
        console.error("Router is not initialized!");
      }
    },
  },
});
