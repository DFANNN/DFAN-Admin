import request from '@/utils/request'

// 角色接口
export interface Role {
  id: string
  name: string
  code: string
  description?: string
  isBuiltIn: boolean
  status?: 'active' | 'inactive'
  createTime?: string
  updateTime?: string
}

// 角色列表查询参数
export interface RoleListParams {
  page?: number
  pageSize?: number
  name?: string
  code?: string
  status?: 'active' | 'inactive'
}

// 创建角色参数
export interface CreateRoleParams {
  name: string
  code: string
  description?: string
  status?: 'active' | 'inactive'
}

// 更新角色参数
export interface UpdateRoleParams {
  name?: string
  code?: string
  description?: string
  status?: 'active' | 'inactive'
}

// 角色列表响应
export interface RoleListResponse {
  code: number
  message: string
  success: boolean
  data: {
    list: Role[]
    total: number
    page: number
    pageSize: number
  }
}

// 角色详情响应
export interface RoleDetailResponse {
  code: number
  message: string
  success: boolean
  data: Role
}

// 通用响应
export interface CommonResponse {
  code: number
  message: string
  success: boolean
  data?: unknown
}

/**
 * 获取角色列表
 */
export const getRoleList = (params?: RoleListParams) => {
  return request.get<RoleListResponse>('/roles', { params })
}

/**
 * 根据ID获取角色详情
 */
export const getRoleById = (id: string) => {
  return request.get<RoleDetailResponse>(`/roles/${id}`)
}

/**
 * 创建角色
 */
export const createRole = (data: CreateRoleParams) => {
  return request.post<CommonResponse>('/roles', data)
}

/**
 * 更新角色
 */
export const updateRole = (id: string, data: UpdateRoleParams) => {
  return request.put<CommonResponse>(`/roles/${id}`, data)
}

/**
 * 删除角色
 */
export const deleteRole = (id: string) => {
  return request.delete<CommonResponse>(`/roles/${id}`)
}

