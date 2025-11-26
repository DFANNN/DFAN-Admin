// 菜单管理类型文件
import type { ICommonResponse } from '@/types/common'

// 菜单类型
export type IMenuType = 'directory' | 'menu' | 'button'

// 菜单列表项
export interface IMenuItem {
  id: string
  type: IMenuType // 菜单类型：directory(目录)、menu(菜单)、button(按钮)
  path: string // 路由路径（directory和button可以为空）
  title: string
  icon: string
  parentId: string | null
  order: number
  status: 'active' | 'inactive'
  permission: string // 权限标识（主要用于button类型）
  isBuiltIn?: boolean // 是否为内置菜单
  createTime?: string
  updateTime?: string
  children?: IMenuItem[]
}

// 菜单列表响应
export type IMenuListResponse = ICommonResponse<IMenuItem[]>

// 创建/更新菜单参数
export interface ICreateOrUpdateMenuParams {
  id?: string
  type: IMenuType
  path: string
  title: string
  icon: string
  parentId: string | null
  order: number
  status: 'active' | 'inactive'
  permission: string
}
