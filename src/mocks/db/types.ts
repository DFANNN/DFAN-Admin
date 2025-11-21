/**
 * IndexedDB 类型定义和常量
 */

// 数据库配置
export const DB_NAME = 'cat-admin-db'
export const DB_VERSION = 2

// 数据库表名
export const STORES = {
  USERS: 'users',
  ROLES: 'roles',
} as const

// 用户接口
export interface User {
  id: string
  username: string
  password: string
  name?: string
  avatar?: string
  email?: string
  [key: string]: unknown
}

// 角色接口
export interface Role {
  id: string
  name: string // 角色名称
  code: string // 角色编码（唯一）
  description?: string // 角色描述
  isBuiltIn: boolean // 是否为内置角色
  status?: 'active' | 'inactive' // 状态
  createTime?: string // 创建时间
  updateTime?: string // 更新时间
  [key: string]: unknown
}
