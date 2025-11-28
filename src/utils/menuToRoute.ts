// 将菜单转换为路由
import { type RouteRecordRaw } from 'vue-router'
import type { IMenuItem } from '@/types/login'

// 匹配所有 views 下的 vue 文件
const modules = import.meta.glob('@/views/**/*.vue')

export const menuToRoute = (menuList: IMenuItem[]) => {
  const dynamicRoute: RouteRecordRaw[] = []

  menuList.forEach((menu) => {
    if (menu.type === 'menu') {
      const routeName = menu.path.split('/').filter(Boolean)
      console.log(`output->`, routeName)
      dynamicRoute.push({
        path: menu.path,
        name: routeName[routeName.length - 1],
        component: () => import(`@/views/${menu.path}.vue`),
        meta: {
          icon: menu.icon,
          title: menu.title,
          id: menu.id,
          parentId: menu.parentId,
        },
      })
    }
    if (menu.type === 'directory' && menu.children?.length) {
      dynamicRoute.push(...menuToRoute(menu.children))
    }
  })
  return dynamicRoute
}
