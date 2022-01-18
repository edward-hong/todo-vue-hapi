import { createRouter, createWebHistory } from 'vue-router'

import Index from './pages/Index.vue'
import Signup from './pages/Signup.vue'
import Signin from './pages/Signin.vue'

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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
