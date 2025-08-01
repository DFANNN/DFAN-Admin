import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login/accountLogin' },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      children: [{ path: 'accountLogin', component: () => import('@/views/login/loginMode/accountLogin.vue') }]
    }
  ]
})

export default router
