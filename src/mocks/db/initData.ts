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
      // 获取超级管理员角色ID（role_1）
      const allRoles = await getAll<Role>(STORES.ROLES)
      const superAdminRole = allRoles.find((role) => role.code === 'super_admin')

      if (!superAdminRole) {
        console.warn('[MSW IndexedDB] 超级管理员角色不存在，无法为admin用户分配角色')
      }

      const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

      // 创建默认管理员用户，分配为超级管理员角色
      const defaultUser: User[] = [
        {
          id: `user1_${Date.now()}`,
          username: 'admin',
          password: 'admin', // 明文存储，仅用于开发测试
          name: '管理员',
          email: 'admin@example.com',
          isBuiltIn: true, // 标记为内置用户
          status: 'active', // 状态：启用
          roleId: superAdminRole ? superAdminRole.id : undefined, // 分配为超级管理员角色（单角色）
          createTime: now,
          updateTime: now,
        },
        {
          id: `user2_${Date.now()}`,
          username: 'user2',
          password: 'user2', // 明文存储，仅用于开发测试
          name: '普通用户',
          email: 'user@example.com',
          isBuiltIn: true, // 标记为内置用户
          status: 'active', // 状态：启用
          roleId: 'role_3', // 分配为普通角色
          createTime: now,
          updateTime: now,
        },
        // 无权限用户
        {
          id: `user3_${Date.now()}`,
          username: 'user3',
          password: 'user3', // 明文存储，仅用于开发测试
          name: '无权限用户',
          email: 'user3@example.com',
          isBuiltIn: true, // 标记为内置用户
          status: 'active', // 状态：启用
          roleId: undefined, // 无权限用户，不分配角色
          createTime: now,
          updateTime: now,
        },
      ]

      for (const user of defaultUser) {
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
 * 初始化默认角色数据
 */
export async function initDefaultRoles(): Promise<void> {
  try {
    // 检查是否已有角色数据
    const existingRoles = await getAll<Role>(STORES.ROLES)

    if (existingRoles.length === 0) {
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

      // 从数据库获取所有菜单ID（用于超级管理员，包括以后新增的菜单）
      const allMenus = await getAll<Menu>(STORES.MENUS)
      const allMenuIds = allMenus.map((menu) => menu.id)

      const defaultRoles: Role[] = [
        {
          id: 'role_1',
          name: '超级管理员',
          code: 'super_admin',
          description: '拥有系统所有权限，可管理所有功能',
          isBuiltIn: true,
          status: 'active',
          menuIds: allMenuIds, // 所有菜单权限（从数据库获取，包括以后新增的菜单）
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
          menuIds: [
            'menu_1', // 首页
            'menu_2', // 系统管理
            'menu_3', // 用户管理
            'menu_4', // 角色管理
            'menu_5', // 菜单管理
          ],
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
          menuIds: [
            'menu_2', // 系统管理
            'menu_3', // 用户管理
            'menu_4', // 角色管理
            'menu_5', // 菜单管理
          ],
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
          menuIds: [
            'menu_1', // 首页
            'menu_6', // 一级菜单
            'menu_7', // 二级菜单
            'menu_8', // 三级菜单
          ],
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
          menuIds: [
            'menu_1', // 首页
          ],
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

const defaultMenuTreeData = [
  {
    id: 'menu_1',
    path: '/home',
    title: '首页',
    icon: 'HomeFilled',
  },
  {
    id: 'menu_2',
    path: '',
    title: '系统管理',
    icon: 'Setting',
    children: [
      {
        id: 'menu_3',
        path: '/system/user',
        title: '用户管理',
        icon: 'User',
      },
      {
        id: 'menu_4',
        path: '/system/role',
        title: '角色管理',
        icon: 'Grid',
      },
      {
        id: 'menu_5',
        path: '/system/menu',
        title: '菜单管理',
        icon: 'Menu',
      },
    ],
  },
  {
    id: 'menu_6',
    path: '',
    title: '一级菜单',
    icon: 'Setting',
    children: [
      {
        id: 'menu_7',
        path: '',
        title: '二级菜单',
        icon: 'Document',
        children: [
          {
            id: 'menu_8',
            path: '/aaa/bbb/ccc',
            title: '三级菜单',
            icon: 'User',
          },
        ],
      },
    ],
  },
]

function collectMenuPaths(
  menuItems: typeof defaultMenuTreeData,
  acc: Set<string> = new Set(),
): Set<string> {
  menuItems.forEach((item) => {
    if (item.path) {
      acc.add(item.path)
    }
    if (item.children && item.children.length > 0) {
      collectMenuPaths(item.children as typeof defaultMenuTreeData, acc)
    }
  })
  return acc
}

const builtInMenuPaths = collectMenuPaths(defaultMenuTreeData)

/**
 * 将树形菜单数据转换为扁平结构
 */
function flattenMenuTree(
  menuItems: typeof defaultMenuTreeData,
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
      isBuiltIn: true,
    }

    menus.push(menu)

    // 处理子菜单
    if (hasChildren) {
      const childMenus = flattenMenuTree(item.children as typeof defaultMenuTreeData, menuId, 0)
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
