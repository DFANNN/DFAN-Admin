export const staticRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layouts/index.vue'),
    children: [
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/system/menu/index.vue'),
      },
    ],
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/exception/403/index.vue'),
  },
]
