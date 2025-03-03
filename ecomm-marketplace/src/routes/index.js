import { createRouter, createWebHistory } from 'vue-router';

const LandingPage = () => import('@/views/LandingPage.vue');
const ProductListing = () => import('@/views/ProductListing.vue');
const Auth = () => import('@/views/AuthenticationPage.vue')

const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/products', name: 'ProductListing', component: ProductListing },
  { path: '/login', name: 'Auth', component: Auth}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
