import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/add-pin-pv',
      name: 'add-pin-pv',
      component: () => import('../views/AddPinPv.vue'),
    },
    {
      path: '/add-inverter',
      name: 'add-inverter',
      component: () => import('../views/AddInverter.vue'),
    },
    {
      path: '/add-battery',
      name: 'add-battery',
      component: () => import('../views/AddBattery.vue'),
    },
    {
      path: '/add-aluminum-frame',
      name: 'add-aluminum-frame',
      component: () => import('../views/AddAluminumFrame.vue'),
    },
    {
      path: '/combo-create',
      name: 'combo-create',
      component: () => import('../views/ComboCreate.vue'),
    }
  ],
})

export default router
