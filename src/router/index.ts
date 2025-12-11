import { createRouter, createWebHistory } from 'vue-router'
import { staticRoutes } from '@/router/route'
import { menuToRoute } from '@/utils/menuToRoute'
import { useTabsStore } from '@/stores/tabs'
import NProgress from 'nprogress'

// 配置 NProgress
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
})

// 动态路由的名称列表
const dynamicRouteNames = ref<string[]>([])

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_STATIC_URL || '/'),
  routes: staticRoutes,
})

router.beforeEach(async (to) => {
  NProgress.start()
  const token = localStorage.getItem('token')

  // 未登录：跳转到登录页面
  if (!token) {
    if (to.path !== '/login') return { name: 'login' }
    return true
  }

  const menuStore = useMenuStore()

  // 首次加载：初始化动态路由
  if (!menuStore.hasLoadedPermissions) {
    await menuStore.getUserPermissions()
    const dynamicRoutes = menuToRoute(menuStore.menuList)

    // 如果没有动态路由，则跳转到403页面
    if (!dynamicRoutes.length) return { name: '403' }

    // 添加动态路由（在 404 之前添加，这样 404 只匹配真正不存在的路由）
    dynamicRoutes.forEach((route) => {
      router.addRoute('layout', route)
      if (route.name) dynamicRouteNames.value.push(route.name as string)
    })

    // 访问根路径，重定向到第一个菜单项
    if (to.fullPath === '/') return { name: dynamicRoutes[0]?.name as string }

    // 其他情况：使用 redirect 路由作为中间层，确保动态路由加载后再跳转（暂时注释掉，因为redirect路由会导致加载缓慢）
    // return {
    //   path: `/redirect${to.fullPath}`,
    //   query: to.query,
    //   hash: to.hash,
    // }

    // 直接跳转到目标路径，确保动态路由加载后再跳转
    return to.fullPath
  }

  // 已加载：正常处理
  // 访问 403 / 404 等异常页时，直接放行（此时权限已加载，403 是真的没有权限）
  if (to.name === '403' || to.name === '404') {
    return true
  }

  // 访问登录页：重定向到第一个菜单项
  if (to.path === '/login') {
    const firstRoute = menuStore.menuList?.[0]
    // 如果第一个菜单项存在，则重定向到第一个菜单项
    if (firstRoute) return firstRoute.path
    // 如果第一个菜单项不存在，则重定向到 403 页面
    return { name: '403' }
  }

  return true
})

router.afterEach((to) => {
  NProgress.done()

  // 添加标签页
  const tabsStore = useTabsStore()
  tabsStore.addTab(to)
})

// 重置路由(清除动态路由)
const resetRouter = () => {
  dynamicRouteNames.value.forEach((name) => {
    router.removeRoute(name)
  })
  dynamicRouteNames.value = []
}

export { resetRouter }

export default router
