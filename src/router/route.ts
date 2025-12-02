export const staticRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  // 重定向路由(暂时注释掉，因为redirect路由会导致加载缓慢)
  // {
  //   path: '/redirect/:path(.*)',
  //   name: 'redirect',
  //   component: () => import('@/views/redirect/index.vue'),
  //   meta: { hidden: true },
  // },
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
      {
        path: '/exception/403',
        name: '403',
        component: () => import('@/views/exception/403/index.vue'),
      },
    ],
  },
]
