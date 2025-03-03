import { createRouter, createWebHistory } from 'vue-router';

const LandingPage = () => import('@/views/LandingPage.vue');
const ProductListing = () => import('@/views/ProductListing.vue');
const Auth = () => import('@/views/AuthenticationPage.vue');
const CartView = () => import('@/views/CartView.vue');
const BuyerDashboard = () => import('@/views/BuyerDashboard.vue');
const SellerDashboard = () => import('@/views/SellerDashboard.vue');


const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/products', name: 'ProductListing', component: ProductListing },
  { path: '/login', name: 'Auth', component: Auth},
  { path: '/cart', name: "CartView", component: CartView },
  { path: '/account', name: 'BuyerDashboard', component: BuyerDashboard },
  { path: '/seller', name: 'SellerDashboard', component: SellerDashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
