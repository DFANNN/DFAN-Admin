import { createRouter, createWebHistory } from 'vue-router'
import { staticRoutes } from '@/router/route'
import { menuToRoute } from '@/utils/menuToRoute'
import NProgress from 'nprogress'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: staticRoutes,
})

router.beforeEach(async (to, _from) => {
  NProgress.start()
  const token = localStorage.getItem('token')

  if (!token) {
    if (to.path !== '/login') return { name: 'login' }
    return true
  }

  const menuStore = useMenuStore()

  // 首次加载：初始化动态路由
  if (!menuStore.menuList?.length) {
    await menuStore.getUserPermissions()
    const dynamicRoutes = menuToRoute(menuStore.menuList)

    // 如果没有动态路由，则跳转到403页面
    if (!dynamicRoutes.length) return { path: '/exception/403' }

    // 添加动态路由（在 404 之前添加，这样 404 只匹配真正不存在的路由）
    dynamicRoutes.forEach((route) => router.addRoute('layout', route))

    // 访问根路径，重定向到第一个菜单项
    if (to.fullPath === '/') return { name: dynamicRoutes[0]?.name as string }

    // 其他情况：让路由系统正常匹配（如果不存在会匹配到 404）
    return to.fullPath
  }

  // 已加载：正常处理
  if (to.path === '/login') {
    const firstRoute = menuStore.menuList?.[0]
    // 如果第一个菜单项存在，则重定向到第一个菜单项
    if (firstRoute) return firstRoute.path
    // 如果第一个菜单项不存在，则重定向到根路径
    return { path: '/' }
  }

  NProgress.done()
  return true
})

export default router
