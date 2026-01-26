/**
 * IndexedDB 类型定义和常量
 */

// 数据库配置
export const DB_NAME = 'DFAN-admin-db'
export const DB_VERSION = 4

// 数据库表名
export const STORES = {
  USERS: 'users',
  ROLES: 'roles',
  MENUS: 'menus',
} as const

// 用户接口
export interface User {
  id: string
  username: string
  password: string
  name?: string
  avatar?: string
  email?: string
  phone?: string // 手机号
  roleId?: string // 用户角色ID（单角色）
  menuIds?: string[] // 菜单权限ID列表（用于admin用户拥有所有菜单权限）
  status?: 'active' | 'inactive' // 状态
  isBuiltIn?: boolean // 是否为内置用户
  createTime?: string // 创建时间
  updateTime?: string // 更新时间
  loginLogs?: Log[]
  [key: string]: unknown
}

// 日志
export interface Log {
  id: string
  device: string
  browser: string
  ip: string
  location: string[]
  time: string
  status: string
}

// 角色接口
export interface Role {
  id: string
  name: string // 角色名称
  code: string // 角色编码（唯一）
  description?: string // 角色描述
  isBuiltIn: boolean // 是否为内置角色
  status?: 'active' | 'inactive' // 状态
  menuIds?: string[] // 菜单权限ID列表
  createTime?: string // 创建时间
  updateTime?: string // 更新时间
  [key: string]: unknown
}

// 菜单类型
export type MenuType = 'directory' | 'menu' | 'button'

// 菜单接口
export interface Menu {
  id: string
  type: MenuType // 菜单类型：directory(目录)、menu(菜单)、button(按钮)
  path: string // 路由路径（directory和button可以为空）
  title: string // 菜单标题
  icon?: string // 图标名称
  parentId?: string | null // 父菜单ID（null表示顶级菜单）
  order?: number // 排序
  status?: 'active' | 'inactive' // 状态
  permission?: string // 权限标识（主要用于button类型）
  isBuiltIn?: boolean // 是否为内置菜单
  createTime?: string // 创建时间
  updateTime?: string // 更新时间
  [key: string]: unknown
}
