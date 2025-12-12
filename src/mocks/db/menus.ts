/**
 * 菜单相关的数据库操作
 */
import { openDB, getAll } from './core'
import { STORES, type Menu } from './types'

/**
 * 根据路径获取菜单
 */
export async function getMenuByPath(path: string): Promise<Menu | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.MENUS], 'readonly')
    const store = transaction.objectStore(STORES.MENUS)
    const index = store.index('path')
    const request = index.get(path)

    request.onsuccess = () => {
      resolve(request.result || null)
    }

    request.onerror = () => {
      reject(new Error('查询菜单失败'))
    }
  })
}

/**
 * 检查菜单路径是否存在
 */
export async function menuPathExists(path: string, excludeId?: string): Promise<boolean> {
  const menu = await getMenuByPath(path)
  if (!menu) return false
  if (excludeId && menu.id === excludeId) return false
  return true
}

/**
 * 根据父菜单ID获取子菜单列表
 */
export async function getMenusByParentId(parentId: string | null): Promise<Menu[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.MENUS], 'readonly')
    const store = transaction.objectStore(STORES.MENUS)
    const index = store.index('parentId')
    const request = index.getAll(parentId || null)

    request.onsuccess = () => {
      const menus = request.result || []
      // 按 order 排序
      menus.sort((a, b) => (a.order || 0) - (b.order || 0))
      resolve(menus)
    }

    request.onerror = () => {
      reject(new Error('查询子菜单失败'))
    }
  })
}

/**
 * 检查菜单是否有子菜单
 */
export async function hasChildren(menuId: string): Promise<boolean> {
  const children = await getMenusByParentId(menuId)
  return children.length > 0
}

/**
 * 将扁平菜单列表转换为树形结构
 */
export function buildMenuTree(menus: Menu[]): Menu[] {
  const menuMap = new Map<string, Menu>()
  const rootMenus: Menu[] = []

  // 创建菜单映射
  menus.forEach((menu) => {
    menuMap.set(menu.id, { ...menu, children: [] })
  })

  // 构建树形结构
  menus.forEach((menu) => {
    const menuNode = menuMap.get(menu.id)!
    if (!menu.parentId) {
      // 顶级菜单
      rootMenus.push(menuNode)
    } else {
      // 子菜单
      const parent = menuMap.get(menu.parentId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        ;(parent.children as Menu[]).push(menuNode)
      }
    }
  })

  // 对每个层级的菜单按 order 排序
  const sortMenus = (menuList: Menu[]) => {
    menuList.sort((a, b) => (a.order || 0) - (b.order || 0))
    menuList.forEach((menu) => {
      if (menu.children && (menu.children as Menu[]).length > 0) {
        sortMenus(menu.children as Menu[])
      }
    })
  }

  sortMenus(rootMenus)
  return rootMenus
}

/**
 * 获取所有菜单并转换为树形结构
 */
export async function getMenuTree(): Promise<Menu[]> {
  const menus = await getAll<Menu>(STORES.MENUS)
  return buildMenuTree(menus)
}

/**
 * 获取菜单的所有祖先菜单ID（向上递归到根）
 * @param menuId 菜单ID
 * @param allMenus 所有菜单列表
 * @returns 祖先菜单ID数组（包括自己）
 */
export function getMenuAncestors(menuId: string, allMenus: Menu[]): string[] {
  const ancestors: string[] = []
  const menuMap = new Map<string, Menu>()

  // 创建菜单映射
  allMenus.forEach((menu) => {
    menuMap.set(menu.id, menu)
  })

  // 向上递归查找所有父菜单
  let currentMenuId: string | null | undefined = menuId
  const visited = new Set<string>() // 防止循环引用

  while (currentMenuId && !visited.has(currentMenuId)) {
    visited.add(currentMenuId)
    ancestors.push(currentMenuId)

    const menu = menuMap.get(currentMenuId)
    if (menu && menu.parentId) {
      currentMenuId = menu.parentId
    } else {
      break
    }
  }

  return ancestors
}
