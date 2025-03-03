import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartItems: [],
  }),

  getters: {
    totalItems: (state) => state.cartItems.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },

  actions: {
    addToCart(product) {
        const authStore = useAuthStore();

        if(!authStore.user) {
            console.warn("User not logged in. Cannot add item to cart.");
            return;
        }
        const existingItem = this.cartItems.find((item) => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cartItems.push({ ...product, quantity: 1 });
        }
    },

    removeFromCart(productId) {
      this.cartItems = this.cartItems.filter((item) => item.id !== productId);
    },

    clearCart() {
      this.cartItems = [];
    },
  },
});
