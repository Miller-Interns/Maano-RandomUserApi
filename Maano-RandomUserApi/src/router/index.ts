import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home.vue'
import { RouterName } from '../types/RouterName'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouterName.HOME,
      component: HomeView,
    },
  ],
})

export default router
