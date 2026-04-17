/**
 * 初始化 IndexedDB 默认数据
 */
import {
  addUser,
  userExists,
  STORES,
  add,
  getAll,
  update,
  type Role,
  type Menu,
  type MenuType,
  ensureDBInitialized,
} from './index'
import { hasChildren } from './menus'
import dayjs from 'dayjs'
import { APP_CONFIG } from '@/config/app.config'

/**
 * 初始化默认用户数据
 */
export async function initDefaultUsers(): Promise<void> {
  try {
    // 检查默认用户是否存在
    const adminExists = await userExists('admin')

    if (!adminExists) {
      const defaultUsers = APP_CONFIG.mock.defaultUsers

      for (const user of defaultUsers) {
        await addUser(user)
      }
      console.log('[MSW IndexedDB] 默认用户已创建: admin/admin，已分配为超级管理员角色')
    }
  } catch (error) {
    console.error('[MSW IndexedDB] 初始化默认用户失败:', error)
    throw error
  }
}

/**
 * 获取菜单的所有后代菜单ID（包括子菜单和按钮，向下递归）
 */
function getMenuDescendants(menuId: string, allMenus: Menu[]): string[] {
  const descendants: string[] = []
  const menuMap = new Map<string, Menu>()

  // 创建菜单映射
  allMenus.forEach((menu) => {
    menuMap.set(menu.id, menu)
  })

  // 递归查找所有子菜单
  const findChildren = (parentId: string) => {
    allMenus.forEach((menu) => {
      if (menu.parentId === parentId) {
        descendants.push(menu.id)
        // 递归查找子菜单的子菜单
        findChildren(menu.id)
      }
    })
  }

  findChildren(menuId)
  return descendants
}

/**
 * 初始化默认角色数据
 */
export async function initDefaultRoles(): Promise<void> {
  try {
    // 检查是否已有角色数据
    const existingRoles = await getAll<Role>(STORES.ROLES)

    if (existingRoles.length === 0) {
      // 从数据库获取所有菜单ID（用于超级管理员，包括以后新增的菜单）
      const allMenus = await getAll<Menu>(STORES.MENUS)
      const allMenuIds = allMenus.map((menu) => menu.id)

      // 获取系统管理（menu_2）及其所有后代菜单ID
      const systemMenuIds = new Set(['menu_2'])
      const systemDescendants = getMenuDescendants('menu_2', allMenus)
      systemDescendants.forEach((id) => systemMenuIds.add(id))

      const defaultRoles: Role[] = APP_CONFIG.mock.defaultRoles.map((role) => ({
        ...role,
        menuIds:
          role.code === 'super_admin'
            ? allMenuIds
            : role.code === 'user'
              ? allMenuIds.filter((menuId) => !systemMenuIds.has(menuId))
              : [],
      }))

      // 批量添加默认角色
      for (const role of defaultRoles) {
        await add<Role>(STORES.ROLES, role)
      }

      console.log('[MSW IndexedDB] 默认角色已创建:', defaultRoles.length, '个')
    }
  } catch (error) {
    console.error('[MSW IndexedDB] 初始化默认角色失败:', error)
    throw error
  }
}

const defaultMenuTreeData = APP_CONFIG.mock.defaultMenuTreeData

function collectMenuPaths(
  menuItems: Menu[],
  acc: Set<string> = new Set(),
): Set<string> {
  menuItems.forEach((item) => {
    if (item.path) {
      acc.add(item.path)
    }
    if (item.children && item.children.length > 0) {
      collectMenuPaths(item.children, acc)
    }
  })
  return acc
}

const builtInMenuPaths = collectMenuPaths(defaultMenuTreeData)

/**
 * 将树形菜单数据转换为扁平结构
 */
function flattenMenuTree(
  menuItems: Menu[],
  parentId: string | null = null,
  order: number = 0,
): Menu[] {
  const menus: Menu[] = []
  let currentOrder = order

  menuItems.forEach((item) => {
    // 直接使用菜单数据中定义的固定ID
    if (!item.id) {
      throw new Error(`菜单项缺少ID: ${item.path || item.title}`)
    }
    const menuId = item.id

    // 优先使用数据中定义的 type，如果没有则根据是否有子菜单判断类型
    let menuType: MenuType
    if (
      item.type &&
      (item.type === 'directory' || item.type === 'menu' || item.type === 'button')
    ) {
      menuType = item.type as MenuType
    } else {
      const hasChildren = item.children && item.children.length > 0
      menuType = hasChildren ? 'directory' : 'menu'
    }

    // 使用数据中定义的字段，如果没有则使用默认值
    const menu: Menu = {
      id: menuId,
      type: menuType,
      path: item.path || '',
      title: item.title,
      icon: item.icon,
      parentId: item.parentId !== undefined && item.parentId !== null ? item.parentId : parentId,
      order: item.order !== undefined ? item.order : currentOrder++,
      status: (item.status === 'active' || item.status === 'inactive' ? item.status : 'active') as
        | 'active'
        | 'inactive',
      permission: (item as { permission?: string }).permission,
      createTime: item.createTime || dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updateTime: item.updateTime || dayjs().format('YYYY-MM-DD HH:mm:ss'),
      isBuiltIn: item.isBuiltIn !== undefined ? item.isBuiltIn : true,
    }

    menus.push(menu)

    // 处理子菜单
    if (item.children && item.children.length > 0) {
      const childMenus = flattenMenuTree(item.children, menuId, 0)
      menus.push(...childMenus)
    }
  })

  return menus
}

/**
 * 初始化默认菜单数据
 */
export async function initDefaultMenus(): Promise<void> {
  try {
    // 检查是否已有菜单数据
    const existingMenus = await getAll<Menu>(STORES.MENUS)

    // 如果已有菜单但没有type字段，为它们设置默认类型
    if (existingMenus.length > 0) {
      let needsUpdate = false

      for (const menu of existingMenus) {
        const updates: Partial<Menu> = {}

        if (!menu.type) {
          // 根据是否有子菜单判断类型
          const hasChild = await hasChildren(menu.id)
          const defaultType: MenuType = hasChild ? 'directory' : 'menu'
          updates.type = defaultType
        }

        if (menu.isBuiltIn === undefined) {
          updates.isBuiltIn = menu.path ? builtInMenuPaths.has(menu.path) : false
        }

        if (Object.keys(updates).length > 0) {
          const updatedMenu: Menu = {
            ...menu,
            ...updates,
            updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          }

          await update<Menu>(STORES.MENUS, updatedMenu)
          needsUpdate = true
        }
      }

      if (needsUpdate) {
        console.log('[MSW IndexedDB] 已更新现有菜单的类型/内置字段')
      }
    }

    if (existingMenus.length === 0) {
      // 转换为扁平结构
      const flatMenus = flattenMenuTree(defaultMenuTreeData)

      // 批量添加默认菜单
      for (const menu of flatMenus) {
        await add<Menu>(STORES.MENUS, menu)
      }

      console.log('[MSW IndexedDB] 默认菜单已创建:', flatMenus.length, '个')
    }
  } catch (error) {
    console.error('[MSW IndexedDB] 初始化默认菜单失败:', error)
    throw error
  }
}

/**
 * 初始化所有默认数据
 */
export async function initData(): Promise<void> {
  try {
    // 确保数据库结构已初始化（包括升级）
    await ensureDBInitialized()
    // 先初始化菜单，再初始化角色，最后初始化用户（用户需要分配角色）
    await initDefaultMenus()
    await initDefaultRoles() // 角色需要引用菜单ID，用户需要引用角色ID
    await initDefaultUsers() // admin用户需要分配超级管理员角色，所以要在角色初始化之后
    console.log('[MSW IndexedDB] 数据初始化完成')
  } catch (error) {
    console.error('[MSW IndexedDB] 数据初始化失败:', error)
    throw error
  }
}
