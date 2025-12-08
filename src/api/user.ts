import request from '@/utils/request'
import type {
  IUserListParams,
  IUserListResponse,
  ICreateOrUpdateUserParams,
  IUserDetailResponse,
  IUpdateUserProfileParams,
  IUpdatePasswordParams,
  IUpdateUserAvatarParams,
} from '@/types/system/user'
import type { ICommonResponse } from '@/types/common'

/**
 * 获取用户列表分页
 */
export const userPage = (params?: IUserListParams) => {
  return request.get<IUserListResponse>('/users', { params })
}

/**
 * 创建用户
 */
export const createUser = (data: ICreateOrUpdateUserParams) => {
  return request.post<ICommonResponse<unknown>>('/users', data)
}

/**
 * 根据ID获取用户详情
 */
export const userInfo = (id: string) => {
  return request.get<IUserDetailResponse>(`/users/${id}`)
}

/**
 * 更新用户
 */
export const updateUser = (data: ICreateOrUpdateUserParams) => {
  return request.put<ICommonResponse<unknown>>('/users', data)
}

/**
 * 删除用户
 */
export const deleteUser = (ids: string[]) => {
  return request.delete<ICommonResponse<unknown>>('/users', { data: ids })
}

/**
 * 修改用户个人信息
 */
export const updateProfile = (data: IUpdateUserProfileParams) => {
  return request.put<ICommonResponse<unknown>>('/users/profile', data)
}

/**
 * 修改密码
 */
export const updatePasswordRequest = (data: IUpdatePasswordParams) => {
  return request.put<ICommonResponse<unknown>>('/users/password', data)
}

/**
 * 修改头像
 */
export const updateAvatarRequest = (data: IUpdateUserAvatarParams) => {
  return request.put<ICommonResponse<unknown>>('/users/avatar', data)
}
