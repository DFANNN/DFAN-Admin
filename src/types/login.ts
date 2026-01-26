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

// 登录模式类型
export type ILoginMode = 'login' | 'forgot' | 'mobile' | 'qr' | 'register'

// 登录模式事件类型
export interface IEmits {
  (e: 'goToMode', mode: ILoginMode): void
}

// 登录接口日志参数类型
export interface ILoginLogParams {
  id?: string
  device: string // 设备名称
  browser: string // 浏览器名称
  ip: string // IP地址
  location: string[] // 位置
  time: string // 时间
  status: string // 状态
}
