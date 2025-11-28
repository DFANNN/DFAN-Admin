import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/layout/home',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/layout',
      name: 'layout',
      component: () => import('@/layouts/index.vue'),
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/home/index.vue'),
        },
        {
          path: 'system/role',
          name: 'role',
          component: () => import('@/views/system/role/index.vue'),
        },
        {
          path: 'system/menu',
          name: 'menu',
          component: () => import('@/views/system/menu/index.vue'),
        },
        {
          path: 'system/user',
          name: 'user',
          component: () => import('@/views/system/user/index.vue'),
        },
      ],
    },
  ],
})

export default router
