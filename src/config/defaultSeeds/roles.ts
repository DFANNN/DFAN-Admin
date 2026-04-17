import type { Role } from '@/mocks/db/types'

export const DEFAULT_ROLES: Role[] = [
  {
    id: 'role_1',
    name: '管理员',
    code: 'super_admin',
    description: '拥有系统所有权限，可管理所有功能',
    isBuiltIn: true,
    status: 'active',
    createTime: '2025-12-12 14:00:12',
    updateTime: '2025-12-12 14:00:12',
  },
  {
    id: 'role_2',
    name: '普通用户',
    code: 'user',
    description: '普通用户权限，可查看和操作基础功能',
    isBuiltIn: true,
    status: 'active',
    createTime: '2025-12-12 14:00:12',
    updateTime: '2025-12-12 14:00:12',
  },
  {
    id: 'role_3',
    name: '无权限用户',
    code: 'no_permission',
    description: '无权限用户，无法访问任何功能',
    isBuiltIn: true,
    status: 'active',
    createTime: '2025-12-12 14:00:12',
    updateTime: '2025-12-12 14:00:12',
  },
]
