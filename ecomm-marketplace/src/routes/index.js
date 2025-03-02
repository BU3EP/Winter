import { createRouter, createWebHistory } from 'vue-router';

const LandingPage = () => import('@/views/LandingPage.vue');
const ProductListing = () => import('@/views/ProductListing.vue');

const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/products', name: 'ProductListing', component: ProductListing }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
