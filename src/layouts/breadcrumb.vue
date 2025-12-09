<template>
  <div class="breadcrumb-container" v-if="breadcrumbList.length > 0">
    <el-breadcrumb separator="/">
      <!-- 动态面包屑项 -->
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbList"
        :key="item.id"
        :to="index < breadcrumbList.length - 1 ? { path: item.path } : undefined"
      >
        <div class="breadcrumb-item">
          <el-icon v-if="props.showIcon && item.icon" class="breadcrumb-icon">
            <component :is="menuStore.iconComponents[item.icon]" />
          </el-icon>
          <span>{{ item.title }}</span>
        </div>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import type { IMenuItem } from '@/types/system/menu'

defineOptions({ name: 'BreadcrumbView' })

const props = withDefaults(
  defineProps<{
    showIcon: boolean
  }>(),
  {
    showIcon: true,
  },
)

const route = useRoute()
const menuStore = useMenuStore()

interface BreadcrumbItem {
  id: string
  title: string
  path: string
  icon?: string
}

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

// 查找首页菜单项（path 为 '/' 或 '/home'）
const findHomeMenu = (menus: IMenuItem[]): IMenuItem | null => {
  for (const item of menus) {
    // 检查是否为首页（path 为 '/' 或 '/home'）
    if (item.type === 'menu' && (item.path === '/' || item.path === '/dashboard/home')) {
      return item
    }
    // 递归查找子菜单
    if (item.children?.length) {
      const child = findHomeMenu(item.children)
      if (child) return child
    }
  }
  return null
}

// 构建 id -> menuItem 的映射，用于快速查找父节点
const buildMenuMap = (
  menus: IMenuItem[],
  map: Map<string, IMenuItem> = new Map(),
): Map<string, IMenuItem> => {
  menus.forEach((item) => {
    map.set(item.id, item)
    if (item.children?.length) {
      buildMenuMap(item.children, map)
    }
  })
  return map
}

// 根据 parentId 向上回溯，构建面包屑路径
const buildBreadcrumbPath = (
  current: IMenuItem,
  menuMap: Map<string, IMenuItem>,
): BreadcrumbItem[] => {
  const path: BreadcrumbItem[] = []
  let node: IMenuItem | null = current

  while (node) {
    // 只添加 type 为 'directory' 或 'menu' 的项到面包屑
    if (node.type === 'directory' || node.type === 'menu') {
      path.unshift({
        id: node.id,
        title: node.title,
        path: node.path || '#',
        icon: node.icon,
      })
    }

    // 向上查找父节点
    node = node.parentId && menuMap.has(node.parentId) ? menuMap.get(node.parentId)! : null
  }

  return path
}

// 计算面包屑列表
const breadcrumbList = computed<BreadcrumbItem[]>(() => {
  // 如果菜单列表为空，返回空数组
  if (!menuStore.menuList.length) return []

  // 查找当前路由对应的菜单项
  const currentMenu = findMenuByPath(menuStore.menuList, route.path)

  // 如果找不到菜单项，尝试从路由 meta 中获取信息（处理不在菜单中的页面，如403、404、个人中心等）
  if (!currentMenu) {
    const path: BreadcrumbItem[] = []

    // 查找首页菜单项
    const homeMenu = findHomeMenu(menuStore.menuList)

    // 如果找到首页，先添加首页
    if (homeMenu && route.path !== homeMenu.path) {
      path.push({
        id: homeMenu.id,
        title: homeMenu.title,
        path: homeMenu.path || '/',
        icon: homeMenu.icon,
      })
    }

    // 从路由 meta 中获取当前页面的标题
    const routeTitle = route.meta?.title as string | undefined
    if (routeTitle) {
      path.push({
        id: (route.name as string) || route.path,
        title: routeTitle,
        path: route.path,
        icon: route.meta?.icon as string | undefined,
      })
    }

    return path
  }

  // 构建菜单映射
  const menuMap = buildMenuMap(menuStore.menuList)

  // 构建面包屑路径
  const path = buildBreadcrumbPath(currentMenu, menuMap)

  // 查找首页菜单项
  const homeMenu = findHomeMenu(menuStore.menuList)

  // 如果找到首页且当前路径不是首页，则在开头添加首页
  if (homeMenu && route.path !== homeMenu.path) {
    // 检查面包屑路径中是否已包含首页（避免重复）
    const hasHome = path.some((item) => item.id === homeMenu.id)
    if (!hasHome) {
      path.unshift({
        id: homeMenu.id,
        title: homeMenu.title,
        path: homeMenu.path || '/',
        icon: homeMenu.icon,
      })
    }
  }

  return path
})
</script>

<style scoped lang="scss">
.breadcrumb-container {
  .breadcrumb-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    .breadcrumb-icon {
      font-size: 1.125rem;
    }
  }
}
</style>
