import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'
import type { IMenuItem, IMenuListResponse, ICreateOrUpdateMenuParams } from '@/types/system/menu'

/**
 * 获取菜单列表（树形结构）
 */
export const menuPage = () => {
  return request.get<IMenuListResponse>('/menus')
}

/**
 * 根据ID获取菜单详情
 */
export const menuInfo = (id: string) => {
  return request.get<ICommonResponse<IMenuItem>>(`/menus/${id}`)
}

/**
 * 创建菜单
 */
export const createMenu = (data: ICreateOrUpdateMenuParams) => {
  return request.post<ICommonResponse<unknown>>('/menus', data)
}

/**
 * 更新菜单
 */
export const updateMenu = (data: ICreateOrUpdateMenuParams) => {
  return request.put<ICommonResponse<unknown>>('/menus', data)
}

/**
 * 删除菜单
 */
export const deleteMenu = (id: string) => {
  return request.delete<ICommonResponse<unknown>>(`/menus/${id}`)
}
