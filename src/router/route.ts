/**
 * name: 路由名称, 也用于keepAlive缓存，需要与组件名称一致
 * meta.keepAlive: 是否需要缓存
 *
 */
export const staticRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { keepAlive: false },
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
        path: '/profile',
        name: 'ProfileView',
        component: () => import('@/views/profile/index.vue'),
        meta: { title: '个人中心', icon: 'HOutline:UserCircleIcon', keepAlive: true },
      },
      {
        path: '/exception/403',
        name: '403',
        component: () => import('@/views/exception/403/index.vue'),
        meta: { title: '403', icon: 'HOutline:NoSymbolIcon', keepAlive: true },
      },
      {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/exception/404/index.vue'),
        meta: { title: '404', icon: 'HOutline:QuestionMarkCircleIcon', keepAlive: true },
      },
    ],
  },
]
