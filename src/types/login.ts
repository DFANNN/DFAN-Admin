import type { ICommonResponse } from '@/types/common'
import type { IUserItem } from '@/types/system/user'
import type { IMenuItem } from '@/types/system/menu'

// 登录参数类型
export interface ILoginParams {
  username: string
  password: string
}

// 登录响应类型
export type ILoginResponse = ICommonResponse<{
  token: string
  user: IUserItem
}>

/**
 * 用户权限响应类型
 */
export type IUserPermissionsResponse = ICommonResponse<{
  menus: IMenuItem[]
  buttonPermissions: string[]
}>
