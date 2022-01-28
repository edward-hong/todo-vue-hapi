import { createRouter, createWebHistory } from 'vue-router'

import Index from './pages/Index.vue'
import Signup from './pages/Signup.vue'
import Signin from './pages/Signin.vue'
import Activate from './pages/Activate.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin,
  },
  {
    path: '/activate/:token',
    name: 'Activate',
    component: Activate,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
