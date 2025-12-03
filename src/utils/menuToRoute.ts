// 将菜单转换为路由
import { type RouteRecordRaw, type RouteComponent } from 'vue-router'
import type { IMenuItem } from '@/types/system/menu'

// 匹配所有 views 下的 vue 文件
const modules = import.meta.glob('@/views/**/*.vue')

// 组件名称
const componentName = (name: string) => {
  return name.charAt(0).toUpperCase() + name.substring(1) + 'View'
}

export const menuToRoute = (menuList: IMenuItem[]) => {
  const dynamicRoute: RouteRecordRaw[] = []

  menuList.forEach((menu) => {
    if (menu.type === 'menu') {
      const routeName = menu.path.split('/').filter(Boolean)
      const name = routeName[routeName.length - 1]
      // 删除path开头连续的/
      const path = menu.path.replace(/^\/+/, '')
      dynamicRoute.push({
        path,
        name: componentName(name as string),
        component: modules[`/src/views/${path}/index.vue`] as RouteComponent,
        meta: {
          icon: menu.icon,
          title: menu.title,
          id: menu.id,
          parentId: menu.parentId,
          keepAlive: true,
        },
      })
    }
    if (menu.type === 'directory' && menu.children?.length) {
      dynamicRoute.push(...menuToRoute(menu.children))
    }
  })
  return dynamicRoute
}
