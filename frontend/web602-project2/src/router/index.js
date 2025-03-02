import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Products from "@/views/Products.vue";
import ProductDetails from "@/views/ProductDetails.vue";
import Cart from "@/views/Cart.vue";
import Checkout from "@/views/Checkout.vue";
import DashboardBuyer from "@/views/DashboardBuyer.vue";
import DashboardSeller from "@/views/DashboardSeller.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/products", component: Products },
  { path: "/product/:id", component: ProductDetails },
  { path: "/cart", component: Cart },
  { path: "/checkout", component: Checkout },
  { path: "/dashboard/buyer", component: DashboardBuyer },
  { path: "/dashboard/seller", component: DashboardSeller },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
