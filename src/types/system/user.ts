// 用户管理类型文件
import type { ICommonResponse } from '@/types/common'

// 用户列表项
export interface IUserItem {
  id: string
  username: string
  password: string
  name?: string
  phone?: string
  email?: string
  roleId?: string // 用户角色ID（单角色）
  status: 'active' | 'inactive'
  isBuiltIn?: boolean
  createTime?: string
  updateTime?: string
}

// 用户列表查询参数
export interface IUserListParams {
  page: number
  pageSize: number
  username: string
  name: string
  status?: 'active' | 'inactive'
  sortOrder: 'asc' | 'desc'
}

// 创建/更新用户参数
export interface ICreateOrUpdateUserParams {
  id?: string
  username: string
  password?: string // 创建时必填，更新时可选
  name?: string
  phone?: string
  email?: string
  roleId?: string // 用户角色ID（单角色）
  status: 'active' | 'inactive'
}

// 用户列表响应
export type IUserListResponse = ICommonResponse<{
  list: IUserItem[]
  total: number
  page: number
  pageSize: number
}>

// 用户详情响应
export type IUserDetailResponse = ICommonResponse<IUserItem>
