import { defineStore } from 'pinia'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { IMenuItem } from '@/types/system/menu'

export interface TabItem {
  path: string
  fullPath: string
  title: string
  icon?: string
  closable: boolean
  name?: string | symbol
}

export const useTabsStore = defineStore('tabs', () => {
  // 标签页列表
  const tabs = ref<TabItem[]>([])
  // 当前激活的标签页路径
  const activePath = ref<string>('')

  // 从菜单列表中根据 path 递归查找节点
  const findMenuByPath = (menus: IMenuItem[], path: string): IMenuItem | null => {
    for (const item of menus) {
      // 只匹配 type 为 'menu' 的项（实际页面路由）
      if (item.type === 'menu' && item.path === path) {
        return item
      }
      // 递归查找子菜单
      if (item.children?.length) {
        const child = findMenuByPath(item.children, path)
        if (child) return child
      }
    }
    return null
  }

  /**
   * 添加标签页
   * @param route 路由对象
   */
  const addTab = (route: RouteLocationNormalizedLoaded) => {
    // 如果路由 meta 中标记为 keepAlive为false，则不添加到标签页
    if (!route.meta?.keepAlive) return

    // 如果当前菜单列表中有首页，则添加首页标签页
    if (!tabs.value.some((tab) => tab.path === '/dashboard/home')) {
      const menuStore = useMenuStore()
      const homeMenu = findMenuByPath(menuStore.menuList, '/dashboard/home')
      if (homeMenu) {
        tabs.value.unshift({
          path: homeMenu.path,
          fullPath: homeMenu.path,
          title: homeMenu.title,
          icon: homeMenu.icon,
          closable: false,
          name: 'HomeView',
        })
      }
    }

    // 检查标签页是否已存在
    const existTab = tabs.value.find((tab) => tab.path === route.path)
    if (existTab) {
      // 如果已存在，只更新激活状态
      activePath.value = route.path
      return
    }

    // 添加新标签页
    tabs.value.push({
      path: route.path,
      fullPath: route.fullPath,
      title: (route.meta?.title as string) || route.name?.toString() || '未命名',
      icon: route.meta?.icon as string | undefined,
      closable: route.path !== '/home' && route.path !== '/', // 首页不允许关闭
      name: route.name,
    })

    // 设置当前激活的标签页
    activePath.value = route.path
    if (tabs.value.length === 1) {
      tabs.value[0]!.closable = false
    }
  }

  /**
   * 移除标签页
   * @param path 要移除的标签页路径
   */
  const removeTab = (path: string) => {
    const index = tabs.value.findIndex((tab) => tab.path === path)
    if (index === -1) return

    const isActive = tabs.value[index]?.path === activePath.value
    tabs.value.splice(index, 1)

    // 如果移除的是当前激活的标签页，需要跳转到相邻的标签页
    if (isActive && tabs.value.length > 0) {
      // 优先跳转到右侧的标签页，如果没有则跳转到左侧
      const nextTab = tabs.value[index] || tabs.value[index - 1]
      if (nextTab) {
        activePath.value = nextTab.path
      }
    }
    if (tabs.value.length === 1) {
      tabs.value[0]!.closable = false
    }
  }

  /**
   * 关闭其他标签页
   * @param path 保留的标签页路径
   */
  const closeOtherTabs = (path: string) => {
    tabs.value = tabs.value.filter((tab) => tab.path === path || !tab.closable)
    activePath.value = path
  }

  /**
   * 关闭所有标签页（保留不可关闭的）
   */
  const closeAllTabs = () => {
    tabs.value = tabs.value.filter((tab) => !tab.closable)
    if (tabs.value.length > 0) {
      activePath.value = tabs.value[0]?.path || ''
    }
  }

  /**
   * 关闭左侧标签页
   * @param path 当前标签页路径
   */
  const closeLeftTabs = (path: string) => {
    const index = tabs.value.findIndex((tab) => tab.path === path)
    if (index === -1) return

    // 保留当前标签页及右侧的标签页，以及不可关闭的标签页
    tabs.value = tabs.value.filter((tab, i) => i >= index || !tab.closable)
    activePath.value = path
  }

  /**
   * 关闭右侧标签页
   * @param path 当前标签页路径
   */
  const closeRightTabs = (path: string) => {
    const index = tabs.value.findIndex((tab) => tab.path === path)
    if (index === -1) return

    // 保留当前标签页及左侧的标签页，以及不可关闭的标签页
    tabs.value = tabs.value.filter((tab, i) => i <= index || !tab.closable)
    activePath.value = path
  }

  /**
   * 清除所有标签页
   */
  const clearTabs = () => {
    tabs.value = []
    activePath.value = ''
  }

  return {
    tabs,
    activePath,
    addTab,
    removeTab,
    closeOtherTabs,
    closeAllTabs,
    closeLeftTabs,
    closeRightTabs,
    clearTabs,
  }
})
