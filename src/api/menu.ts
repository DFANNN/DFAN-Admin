import request from '@/utils/request'

// 菜单类型
export type MenuType = 'directory' | 'menu' | 'button'

// 菜单接口
export interface Menu {
  id: string
  type: MenuType // 菜单类型：directory(目录)、menu(菜单)、button(按钮)
  path: string // 路由路径（directory和button可以为空）
  title: string
  icon?: string
  parentId?: string | null
  order?: number
  status?: 'active' | 'inactive'
  permission?: string // 权限标识（主要用于button类型）
  createTime?: string
  updateTime?: string
  children?: Menu[]
}

// 创建菜单参数
export interface CreateMenuParams {
  type: MenuType
  path: string
  title: string
  icon?: string
  parentId?: string | null
  order?: number
  status?: 'active' | 'inactive'
  permission?: string
}

// 更新菜单参数
export interface UpdateMenuParams {
  type?: MenuType
  path?: string
  title?: string
  icon?: string
  parentId?: string | null
  order?: number
  status?: 'active' | 'inactive'
  permission?: string
}

// 菜单列表响应
export interface MenuListResponse {
  code: number
  message: string
  success: boolean
  data: Menu[]
}

// 菜单详情响应
export interface MenuDetailResponse {
  code: number
  message: string
  success: boolean
  data: Menu
}

// 通用响应
export interface CommonResponse {
  code: number
  message: string
  success: boolean
  data?: unknown
}

/**
 * 获取菜单列表（树形结构）
 */
export const getMenuList = () => {
  return request.get<MenuListResponse>('/menus')
}

/**
 * 根据ID获取菜单详情
 */
export const getMenuById = (id: string) => {
  return request.get<MenuDetailResponse>(`/menus/${id}`)
}

/**
 * 创建菜单
 */
export const createMenu = (data: CreateMenuParams) => {
  return request.post<CommonResponse>('/menus', data)
}

/**
 * 更新菜单
 */
export const updateMenu = (id: string, data: UpdateMenuParams) => {
  return request.put<CommonResponse>(`/menus/${id}`, data)
}

/**
 * 删除菜单
 */
export const deleteMenu = (id: string) => {
  return request.delete<CommonResponse>(`/menus/${id}`)
}
