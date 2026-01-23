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
          name: '宇宙 Root 管理者 Rootiverse',
          email: 'admin@example.com',
          isBuiltIn: true, // 标记为内置用户
          status: 'active', // 状态：启用
          roleId: superAdminRole ? superAdminRole.id : undefined, // 分配为超级管理员角色（单角色）
          createTime: now,
          updateTime: now,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
          bio: '全宇宙最强管理员，掌控一切！',
          tags: 'vue3,typescript,admin',
        },
        {
          id: `user2_${Date.now()}`,
          username: 'user2',
          password: 'user2',
          name: '普通但不平凡的路人乙',
          email: 'user@example.com',
          isBuiltIn: true,
          status: 'active', // 状态：启用
          roleId: 'role_2', // 分配为普通角色
          createTime: now,
          updateTime: now,
        },
        // 无权限用户
        {
          id: `user3_${Date.now()}`,
          username: 'user3',
          password: 'user3',
          name: '权限被吃掉的少年',
          email: 'user3@example.com',
          isBuiltIn: true,
          status: 'active',
          roleId: 'role_3', // 无权限用户，分配为无权限角色
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
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

      // 从数据库获取所有菜单ID（用于超级管理员，包括以后新增的菜单）
      const allMenus = await getAll<Menu>(STORES.MENUS)
      const allMenuIds = allMenus.map((menu) => menu.id)

      // 获取系统管理（menu_2）及其所有后代菜单ID
      const systemMenuIds = new Set(['menu_2'])
      const systemDescendants = getMenuDescendants('menu_2', allMenus)
      systemDescendants.forEach((id) => systemMenuIds.add(id))

      const defaultRoles: Role[] = [
        {
          id: 'role_1',
          name: '管理员',
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
          name: '普通用户',
          code: 'user',
          description: '普通用户权限，可查看和操作基础功能',
          isBuiltIn: true,
          status: 'active',
          // 所有菜单里面去除系统管理（menu_2）及其所有子菜单和按钮
          menuIds: allMenuIds.filter((menuId) => !systemMenuIds.has(menuId)),
          createTime: now,
          updateTime: now,
        },
        {
          id: 'role_3',
          name: '无权限用户',
          code: 'no_permission',
          description: '无权限用户，无法访问任何功能',
          isBuiltIn: true,
          status: 'active',
          menuIds: [],
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
    type: 'directory',
    path: '',
    title: 'Dashboard',
    icon: 'HOutline:HomeIcon',
    parentId: null,
    order: 0,
    status: 'active',
    createTime: '2025-12-12 14:00:12',
    updateTime: '2025-12-12 14:00:12',
    isBuiltIn: true,
    children: [
      {
        id: 'menu_12',
        type: 'menu',
        path: '/dashboard/home',
        title: '工作台',
        icon: 'HOutline:ComputerDesktopIcon',
        parentId: 'menu_1',
        order: 0,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [],
      },
      {
        id: 'menu_13',
        type: 'menu',
        path: '/dashboard/analysis',
        title: '分析页',
        icon: 'HOutline:ChartBarIcon',
        parentId: 'menu_1',
        order: 1,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [],
      },
      {
        id: 'menu_14',
        type: 'menu',
        path: '/dashboard/monitor',
        title: '监控页',
        icon: 'HOutline:EyeIcon',
        parentId: 'menu_1',
        order: 2,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [],
      },
    ],
  },
  {
    id: 'menu_2',
    type: 'directory',
    path: '',
    title: '系统管理',
    icon: 'HOutline:Cog6ToothIcon',
    parentId: null,
    order: 1,
    status: 'active',
    createTime: '2025-12-12 14:00:12',
    updateTime: '2025-12-12 14:00:12',
    isBuiltIn: true,
    children: [
      {
        id: 'menu_3',
        type: 'menu',
        path: '/system/user',
        title: '用户管理',
        icon: 'HOutline:UserGroupIcon',
        parentId: 'menu_2',
        order: 0,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [
          {
            id: 'menu_3_button_0',
            type: 'button',
            path: '',
            title: '添加用户',
            permission: 'user:add',
            parentId: 'menu_3',
            order: 0,
            status: 'active',
            createTime: '2025-12-12 14:00:12',
            updateTime: '2025-12-12 14:00:12',
            isBuiltIn: true,
            children: [],
          },
          {
            id: 'menu_3_button_1',
            type: 'button',
            path: '',
            title: '编辑用户',
            permission: 'user:edit',
            parentId: 'menu_3',
            order: 1,
            status: 'active',
            createTime: '2025-12-12 14:00:12',
            updateTime: '2025-12-12 14:00:12',
            isBuiltIn: true,
            children: [],
          },
          {
            id: 'menu_3_button_2',
            type: 'button',
            path: '',
            title: '删除用户',
            permission: 'user:delete',
            parentId: 'menu_3',
            order: 2,
            status: 'active',
            createTime: '2025-12-12 14:00:12',
            updateTime: '2025-12-12 14:00:12',
            isBuiltIn: true,
            children: [],
          },
          {
            id: 'menu_3_button_3',
            type: 'button',
            path: '',
            title: '查看用户',
            permission: 'user:view',
            parentId: 'menu_3',
            order: 3,
            status: 'active',
            createTime: '2025-12-12 14:00:12',
            updateTime: '2025-12-12 14:00:12',
            isBuiltIn: true,
            children: [],
          },
        ],
      },
      {
        id: 'menu_4',
        type: 'menu',
        path: '/system/role',
        title: '角色管理',
        icon: 'HOutline:IdentificationIcon',
        parentId: 'menu_2',
        order: 1,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [
          {
            id: 'menu_4_button_0',
            type: 'button',
            path: '',
            title: '添加角色',
            permission: 'role:add',
            parentId: 'menu_4',
            order: 0,
            status: 'active',
            createTime: '2025-12-12 14:00:12',
            updateTime: '2025-12-12 14:00:12',
            isBuiltIn: true,
            children: [],
          },
          {
            id: 'menu_4_button_1',
            type: 'button',
            path: '',
            title: '编辑角色',
            permission: 'role:edit',
            parentId: 'menu_4',
            order: 1,
            status: 'active',
            createTime: '2025-12-12 14:00:12',
            updateTime: '2025-12-12 14:00:12',
            isBuiltIn: true,
            children: [],
          },
          {
            id: 'menu_4_button_2',
            type: 'button',
            path: '',
            title: '删除角色',
            permission: 'role:delete',
            parentId: 'menu_4',
            order: 2,
            status: 'active',
            createTime: '2025-12-12 14:00:12',
            updateTime: '2025-12-12 14:00:12',
            isBuiltIn: true,
            children: [],
          },
          {
            id: 'menu_4_button_3',
            type: 'button',
            path: '',
            title: '查看角色',
            permission: 'role:view',
            parentId: 'menu_4',
            order: 3,
            status: 'active',
            createTime: '2025-12-12 14:00:12',
            updateTime: '2025-12-12 14:00:12',
            isBuiltIn: true,
            children: [],
          },
        ],
      },
      {
        id: 'menu_5',
        type: 'menu',
        path: '/system/menu',
        title: '菜单管理',
        icon: 'HOutline:ListBulletIcon',
        parentId: 'menu_2',
        order: 2,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [
          {
            id: 'menu_5_button_0',
            type: 'button',
            path: '',
            title: '添加菜单',
            permission: 'menu:add',
            parentId: 'menu_5',
            order: 0,
            status: 'active',
            createTime: '2025-12-12 14:00:12',
            updateTime: '2025-12-12 14:00:12',
            isBuiltIn: true,
            children: [],
          },
          {
            id: 'menu_5_button_1',
            type: 'button',
            path: '',
            title: '编辑菜单',
            permission: 'menu:edit',
            parentId: 'menu_5',
            order: 1,
            status: 'active',
            createTime: '2025-12-12 14:00:12',
            updateTime: '2025-12-12 14:00:12',
            isBuiltIn: true,
            children: [],
          },
          {
            id: 'menu_5_button_2',
            type: 'button',
            path: '',
            title: '删除菜单',
            permission: 'menu:delete',
            parentId: 'menu_5',
            order: 2,
            status: 'active',
            createTime: '2025-12-12 14:00:12',
            updateTime: '2025-12-12 14:00:12',
            isBuiltIn: true,
            children: [],
          },
          {
            id: 'menu_5_button_3',
            type: 'button',
            path: '',
            title: '查看菜单',
            permission: 'menu:view',
            parentId: 'menu_5',
            order: 3,
            status: 'active',
            createTime: '2025-12-12 14:00:12',
            updateTime: '2025-12-12 14:00:12',
            isBuiltIn: true,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 'menu_17',
    type: 'directory',
    path: '',
    title: '扩展组件',
    icon: 'HOutline:PuzzlePieceIcon',
    parentId: null,
    order: 2,
    status: 'active',
    createTime: '2025-12-12 14:00:12',
    updateTime: '2025-12-12 14:00:12',
    isBuiltIn: true,
    children: [
      {
        id: 'menu_18',
        type: 'menu',
        path: '/extended/button',
        title: '按钮',
        icon: 'HOutline:HandRaisedIcon',
        parentId: 'menu_17',
        order: 0,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [],
      },
      {
        id: 'menu_19',
        type: 'menu',
        path: '/extended/dialog',
        title: '对话框',
        icon: 'HOutline:WindowIcon',
        parentId: 'menu_17',
        order: 0,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [],
      },
      {
        id: 'menu_20',
        type: 'menu',
        path: '/extended/iconSelector',
        title: '图标选择器',
        icon: 'HOutline:SwatchIcon',
        parentId: 'menu_17',
        order: 1,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [],
      },
      {
        id: 'menu_21',
        type: 'menu',
        path: '/extended/textEllipsis',
        title: '文本省略器',
        icon: 'HOutline:EllipsisHorizontalIcon',
        parentId: 'menu_17',
        order: 2,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [],
      },
      {
        id: 'menu_22',
        type: 'menu',
        path: '/extended/hoverAnimation',
        title: 'Hover动画组件',
        icon: 'HOutline:CursorArrowRaysIcon',
        parentId: 'menu_17',
        order: 3,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [],
      },
      {
        id: 'menu_23',
        type: 'menu',
        path: '/extended/transitionAnimation',
        title: 'Transition内置动画',
        icon: 'HOutline:SparklesIcon',
        parentId: 'menu_17',
        order: 3,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [],
      },
    ],
  },
  {
    id: 'menu_15',
    type: 'directory',
    path: '',
    title: '功能演示',
    icon: 'HOutline:BeakerIcon',
    parentId: null,
    order: 3,
    status: 'active',
    createTime: '2025-12-12 14:00:12',
    updateTime: '2025-12-12 14:00:12',
    isBuiltIn: true,
    children: [
      {
        id: 'menu_16',
        type: 'menu',
        path: '/demo/vxeTable',
        title: 'VXE Table',
        icon: 'HOutline:TableCellsIcon',
        parentId: 'menu_15',
        order: 0,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [],
      },
    ],
  },
  {
    id: 'menu_9',
    type: 'directory',
    path: '',
    title: '异常页面',
    icon: 'HOutline:ExclamationTriangleIcon',
    parentId: null,
    order: 4,
    status: 'active',
    createTime: '2025-12-12 14:00:12',
    updateTime: '2025-12-12 14:00:12',
    isBuiltIn: true,
    children: [
      {
        id: 'menu_10',
        type: 'menu',
        path: '/exception/403',
        title: '403页面',
        icon: 'HOutline:NoSymbolIcon',
        parentId: 'menu_9',
        order: 0,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [],
      },
      {
        id: 'menu_11',
        type: 'menu',
        path: '/exception/404',
        title: '404页面',
        icon: 'HOutline:QuestionMarkCircleIcon',
        parentId: 'menu_9',
        order: 1,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [],
      },
    ],
  },
  {
    id: 'menu_6',
    type: 'directory',
    path: '',
    title: '一级菜单',
    icon: 'HOutline:FolderIcon',
    parentId: null,
    order: 5,
    status: 'active',
    createTime: '2025-12-12 14:00:12',
    updateTime: '2025-12-12 14:00:12',
    isBuiltIn: true,
    children: [
      {
        id: 'menu_7',
        type: 'directory',
        path: '',
        title: '二级菜单',
        icon: 'HOutline:FolderOpenIcon',
        parentId: 'menu_6',
        order: 0,
        status: 'active',
        createTime: '2025-12-12 14:00:12',
        updateTime: '2025-12-12 14:00:12',
        isBuiltIn: true,
        children: [
          {
            id: 'menu_8',
            type: 'menu',
            path: '/aaa/bbb/ccc',
            title: '三级菜单',
            icon: 'HOutline:DocumentTextIcon',
            parentId: 'menu_7',
            order: 0,
            status: 'active',
            createTime: '2025-12-12 14:00:12',
            updateTime: '2025-12-12 14:00:12',
            isBuiltIn: true,
            children: [],
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
      // @ts-expect-error - 类型转换是安全的，因为 children 的结构与 defaultMenuTreeData 相同
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
      // @ts-expect-error - 类型转换是安全的，因为 children 的结构与 defaultMenuTreeData 相同
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
