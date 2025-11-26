/**
 * 初始化 IndexedDB 默认数据
 */
import {
  addUser,
  userExists,
  STORES,
  type User,
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

/**
 * 初始化默认用户数据
 */
export async function initDefaultUsers(): Promise<void> {
  try {
    // 检查默认用户是否存在
    const adminExists = await userExists('admin')

    if (!adminExists) {
      // 创建默认管理员用户
      const defaultUser: User = {
        id: `user_${Date.now()}`,
        username: 'admin',
        password: 'admin', // 明文存储，仅用于开发测试
        name: '管理员',
        email: 'admin@example.com',
      }

      await addUser(defaultUser)
      console.log('[MSW IndexedDB] 默认用户已创建: admin/admin')
    }
  } catch (error) {
    console.error('[MSW IndexedDB] 初始化默认用户失败:', error)
    throw error
  }
}

/**
 * 初始化默认角色数据
 */
export async function initDefaultRoles(): Promise<void> {
  try {
    // 检查是否已有角色数据
    const existingRoles = await getAll<Role>(STORES.ROLES)

    if (existingRoles.length === 0) {
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
      const defaultRoles: Role[] = [
        {
          id: 'role_1',
          name: '超级管理员',
          code: 'super_admin',
          description: '拥有系统所有权限，可管理所有功能',
          isBuiltIn: true,
          status: 'active',
          createTime: now,
          updateTime: now,
        },
        {
          id: 'role_2',
          name: '管理员',
          code: 'admin',
          description: '拥有大部分管理权限，可管理系统配置和用户',
          isBuiltIn: true,
          status: 'active',
          createTime: now,
          updateTime: now,
        },
        {
          id: 'role_3',
          name: '普通用户',
          code: 'user',
          description: '普通用户权限，可查看和操作基础功能',
          isBuiltIn: true,
          status: 'active',
          createTime: now,
          updateTime: now,
        },
        {
          id: 'role_4',
          name: '编辑',
          code: 'editor',
          description: '内容编辑权限，可创建和编辑内容',
          isBuiltIn: true,
          status: 'active',
          createTime: now,
          updateTime: now,
        },
        {
          id: 'role_5',
          name: '访客',
          code: 'guest',
          description: '访客权限，仅可查看公开内容',
          isBuiltIn: true,
          status: 'active',
          createTime: now,
          updateTime: now,
        },
      ]

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

/**
 * 将树形菜单数据转换为扁平结构
 */
function flattenMenuTree(
  menuItems: Array<{
    path: string
    title: string
    icon?: string
    children?: Array<unknown>
  }>,
  parentId: string | null = null,
  order: number = 0,
): Menu[] {
  const menus: Menu[] = []
  let currentOrder = order

  menuItems.forEach((item) => {
    const menuId = `menu_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

    // 根据是否有子菜单判断类型
    const hasChildren = item.children && item.children.length > 0
    const menuType: 'directory' | 'menu' = hasChildren ? 'directory' : 'menu'

    const menu: Menu = {
      id: menuId,
      type: menuType,
      path: item.path,
      title: item.title,
      icon: item.icon,
      parentId,
      order: currentOrder++,
      status: 'active',
      createTime: now,
      updateTime: now,
    }

    menus.push(menu)

    // 处理子菜单
    if (hasChildren) {
      const childMenus = flattenMenuTree(item.children as typeof menuItems, menuId, 0)
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
        if (!menu.type) {
          // 根据是否有子菜单判断类型
          const hasChild = await hasChildren(menu.id)
          const defaultType: MenuType = hasChild ? 'directory' : 'menu'

          const updatedMenu: Menu = {
            ...menu,
            type: defaultType,
            updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          }

          await update<Menu>(STORES.MENUS, updatedMenu)
          needsUpdate = true
        }
      }

      if (needsUpdate) {
        console.log('[MSW IndexedDB] 已更新现有菜单的类型字段')
      }
    }

    if (existingMenus.length === 0) {
      // 从 menu.ts 中的菜单数据
      const menuTreeData = [
        {
          path: '/layout/home',
          title: '首页',
          icon: 'HomeFilled',
        },
        {
          path: '/layout/system',
          title: '系统管理',
          icon: 'Setting',
          children: [
            {
              path: '/layout/system/user',
              title: '用户管理',
              icon: 'User',
            },
            {
              path: '/layout/system/role',
              title: '角色管理',
              icon: 'Grid',
            },
            {
              path: '/layout/system/menu',
              title: '菜单管理',
              icon: 'Menu',
            },
          ],
        },
        {
          path: '/layout/content',
          title: '内容管理',
          icon: 'Files',
          children: [
            {
              path: '/layout/content/article',
              title: '文章管理',
              icon: 'Document',
            },
            {
              path: '/layout/content/category',
              title: '分类管理',
              icon: 'Grid',
            },
          ],
        },
        {
          path: '/layout/data',
          title: '数据分析',
          icon: 'DataAnalysis',
          children: [
            {
              path: '/layout/data/overview',
              title: '数据概览',
              icon: 'Location',
            },
            {
              path: '/layout/data/report',
              title: '数据报表',
              icon: 'Document',
            },
          ],
        },
        {
          path: '/layout/tools',
          title: '工具',
          icon: 'Tools',
          children: [
            {
              path: '/layout/tools/icon',
              title: '图标库',
              icon: 'Grid',
            },
            {
              path: '/layout/tools/component',
              title: '组件库',
              icon: 'Files',
            },
          ],
        },
        {
          path: '/layout/settings',
          title: '一级菜单',
          icon: 'Setting',
          children: [
            {
              path: '/layout/settings/user',
              title: '二级菜单',
              icon: 'Document',
              children: [
                {
                  path: '/layout/settings/user/user',
                  title: '三级菜单',
                  icon: 'User',
                },
              ],
            },
          ],
        },
      ]

      // 转换为扁平结构
      const flatMenus = flattenMenuTree(menuTreeData)

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
    await initDefaultUsers()
    await initDefaultRoles()
    await initDefaultMenus()
    console.log('[MSW IndexedDB] 数据初始化完成')
  } catch (error) {
    console.error('[MSW IndexedDB] 数据初始化失败:', error)
    throw error
  }
}
