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
  type Role,
  ensureDBInitialized,
} from './index'

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
      const now = new Date().toISOString()
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
 * 初始化所有默认数据
 */
export async function initData(): Promise<void> {
  try {
    // 确保数据库结构已初始化（包括升级）
    await ensureDBInitialized()
    await initDefaultUsers()
    await initDefaultRoles()
    console.log('[MSW IndexedDB] 数据初始化完成')
  } catch (error) {
    console.error('[MSW IndexedDB] 数据初始化失败:', error)
    throw error
  }
}
