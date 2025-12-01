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
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/exception/404/index.vue'),
      },
    ],
  },
  {
    path: '/exception/403',
    name: '403',
    component: () => import('@/views/exception/403/index.vue'),
  },
]
