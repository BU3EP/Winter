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

        console.log(data);

        if (data) {
          this.token = data.token;
          localStorage.setItem("token", data.token);

          await this.fetchUserProfile(); // Fetch user profile after login

          alert("Login Successful!");
          if (this.router) {
            this.router.push("/products");
          }
        }
        
      } catch (error) {
        console.error("Login error:", error);
        alert("Invalid credentials!");
      }
    },

    async fetchUserProfile() {
      if (!this.token) return;

      try {
        const { data } = await api.get("/users/profile", {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        console.log(`Fetch user profile ${data}`);
        this.user = data;
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        
        if (error.response && error.response.status === 401) {
          // Token is invalid or expired, log out the user
          this.logout();
        }
      }
    },

    async register(payload) {
      try {
        const { data } = await api.post("/users/register", {
          name: payload.name,
          email: payload.email,
          password: payload.password,
        });

        this.token = data.token;
        localStorage.setItem("token", data.token);

        await this.fetchUserProfile(); // Fetch profile after registration

        alert("Account Created!");
        if (this.router) {
          this.router.push("/login");
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
      }
    },

    initializeAuth() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.user = null;
          return;
        }

        this.token = token;
        const userData = localStorage.getItem("user");

        if (userData) {
          try {
            this.user = JSON.parse(userData);
          } catch (e) {
            console.warn("Corrupted user data in storage, clearing...");
            localStorage.removeItem("user");
            this.user = null;
          }
        }

        this.fetchUserProfile();
      } catch (error) {
        console.error("Error initializing authentication:", error);
        this.logout();
      }
    },
  },
});
