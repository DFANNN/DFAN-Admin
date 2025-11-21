/**
 * MSW Handlers 统一导出
 */
import { loginHandler } from './auth'
import {
  getRoleListHandler,
  getRoleByIdHandler,
  createRoleHandler,
  updateRoleHandler,
  deleteRoleHandler,
} from './roles'
import {
  getMenuListHandler,
  getMenuByIdHandler,
  createMenuHandler,
  updateMenuHandler,
  deleteMenuHandler,
} from './menus'

/**
 * 所有 MSW Handlers
 */
export const handlers = [
  // 认证相关
  loginHandler,

  // 角色相关
  getRoleListHandler,
  getRoleByIdHandler,
  createRoleHandler,
  updateRoleHandler,
  deleteRoleHandler,

  // 菜单相关
  getMenuListHandler,
  getMenuByIdHandler,
  createMenuHandler,
  updateMenuHandler,
  deleteMenuHandler,
]
