import { createRouter, createWebHistory } from 'vue-router'
import store from '@/stores'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: () => import('@/views/ChangePasswordView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: () => import('@/views/AccountsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/account/create',
    name: 'CreateAccount',
    component: () => import('@/views/AccountFormView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/account/edit/:id',
    name: 'EditAccount',
    component: () => import('@/views/AccountFormView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dompetku',
    name: 'Dompetku',
    component: () => import('@/components/PersonalFinanceTracker.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.state.isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (store.state.isAuthenticated) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
