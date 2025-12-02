// 角色管理类型文件
import type { ICommonResponse } from '@/types/common'

// 角色列表项
export interface IRoleItem {
  id: string
  name: string
  code: string
  description: string
  isBuiltIn: boolean
  status: 'active' | 'inactive'
  menuIds?: string[] // 菜单权限ID列表
  createTime?: string
  updateTime?: string
}

// 角色列表查询参数
export interface IRoleListParams {
  page: number
  pageSize: number
  name?: string
  code?: string
  status?: 'active' | 'inactive'
  sortOrder?: 'asc' | 'desc'
}

// 创建/更新角色参数
export interface ICreateOrUpdateRoleParams {
  id?: string
  name: string
  code: string
  description: string
  status: 'active' | 'inactive'
  menuIds?: string[] // 菜单权限ID列表
}

// 角色列表响应
export type IRoleListResponse = ICommonResponse<{
  list: IRoleItem[]
  total: number
  page: number
  pageSize: number
}>

// 角色详情响应
export type IRoleDetailResponse = ICommonResponse<IRoleItem>
