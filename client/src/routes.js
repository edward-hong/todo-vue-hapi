import { createRouter, createWebHistory } from 'vue-router'

import Index from './pages/Index.vue'
import Signup from './pages/Signup.vue'
import Signin from './pages/Signin.vue'
import Activate from './pages/Activate.vue'
import Forgot from './pages/Forgot.vue'
import Reset from './pages/Reset.vue'

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
  {
    path: '/forgot',
    name: 'Forgot',
    component: Forgot,
  },
  {
    path: '/reset/:token',
    name: 'Reset',
    component: Reset,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
