import request from '@/utils/request'
import type {
  ILoginParams,
  ILoginResponse,
  IUserPermissionsResponse,
  ILoginLogParams,
} from '@/types/login'
import type { ICommonResponse } from '@/types/common'
import type { IUserItem } from '@/types/system/user'

export const login = (params: ILoginParams) => {
  return request.post<ILoginResponse>('/login', params)
}

/**
 * 获取用户权限（菜单权限和按钮权限）
 */
export const userPermissions = () => {
  return request.get<IUserPermissionsResponse>('/users/permissions')
}

/**
 * 获取用户信息
 */
export const userInfoRequest = () => {
  return request.get<ICommonResponse<IUserItem>>('/users/info')
}

// 记录用户登录日志
export const addLoginLog = (data: ILoginLogParams) => {
  return request.put('/users/log', data)
}
