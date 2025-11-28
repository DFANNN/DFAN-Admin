import type { ICommonResponse } from '@/types/common'
import type { IUserItem } from '@/types/system/user'

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

// 菜单列表项
export interface IMenuItem {
  children: IMenuItem[]
  createTime: string
  icon: string
  id: string
  isBuiltIn: boolean
  order: number
  parentId: string | null
  path: string
  status: 'active' | 'inactive'
  title: string
  type: 'menu' | 'button'
  updateTime: string
}

/**
 * 用户权限响应类型
 */
export type IUserPermissionsResponse = ICommonResponse<{
  menuList: IMenuItem[]
  buttonList: string[]
}>
