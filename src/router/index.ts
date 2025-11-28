import { createRouter, createWebHistory } from 'vue-router'
import { staticRoutes } from '@/router/route'
import { menuToRoute } from '@/utils/menuToRoute'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: staticRoutes,
})

router.beforeEach(async (to, from) => {
  const token = localStorage.getItem('token')
  console.log(`output->token`, token)
  console.log(`output->to`, to)
  console.log(`output->from`, from)

  if (!token) {
    if (to.path !== '/login') return { name: 'login' }
    return true
  }

  if (token) {
    const menuStore = useMenuStore()
    if (!menuStore.menuList?.length) await menuStore.getUserPermissions()
    console.log(`output->menuStore.menuList`, menuStore.menuList)
    console.log(`output->menuToRoute`, menuToRoute(menuStore.menuList))

    if (to.path === '/login') return { path: from.path }
    return true
  }
})

export default router
