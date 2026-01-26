// 用户管理类型文件
import type { ICommonResponse } from '@/types/common'
import type { ILoginLogParams } from '@/types/login'

// 用户列表项
export interface IUserItem {
  id: string
  username: string
  password: string
  name?: string
  avatar?: string // 头像（base64 或 URL）
  phone?: string
  email?: string
  roleId?: string // 用户角色ID（单角色）
  status: 'active' | 'inactive'
  isBuiltIn?: boolean
  createTime?: string
  updateTime?: string
  bio?: string // 个人简介
  tags?: string // 个人标签，逗号分隔
  loginLogs?: ILoginLogParams[] // 登录日志
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

// 消息类型
export type MessageType = 'system' | 'user' | 'todo'

// 用户消息列表项
export interface IUserMessageItem {
  id: string
  title: string
  content: string
  type: MessageType
  read: boolean
  time: string
  avatar?: string
}

// 修改用户个人信息参数
export interface IUpdateUserProfileParams {
  name: string
  phone: string
  email: string
  avatar: string
  bio: string
  tags: string
}

// 修改密码参数
export interface IUpdatePasswordParams {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

// 修改头像参数
export interface IUpdateUserAvatarParams {
  avatar: string // 头像（base64 或 URL）
}
