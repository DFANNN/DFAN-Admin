import request from '@/utils/request'
import type {
  IRoleListParams,
  IRoleListResponse,
  ICreateOrUpdateRoleParams,
  IRoleDetailResponse,
} from '@/types/system/role'
import type { ICommonResponse } from '@/types/common'

/**
 * 获取角色列表分页
 */
export const rolePage = (params?: IRoleListParams) => {
  return request.get<IRoleListResponse>('/roles', { params })
}

/**
 * 创建角色
 */
export const createRole = (data: ICreateOrUpdateRoleParams) => {
  return request.post<ICommonResponse<unknown>>('/roles', data)
}

/**
 * 根据ID获取角色详情
 */
export const roleInfo = (id: string) => {
  return request.get<IRoleDetailResponse>(`/roles/${id}`)
}

/**
 * 更新角色
 */
export const updateRole = (data: ICreateOrUpdateRoleParams) => {
  return request.put<ICommonResponse<unknown>>('/roles', data)
}

/**
 * 删除角色
 */
export const deleteRole = (ids: string[]) => {
  return request.delete<ICommonResponse<unknown>>('/roles', { data: ids })
}
