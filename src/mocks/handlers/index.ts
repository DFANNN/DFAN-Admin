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
import {
  getUserListHandler,
  getUserByIdHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getCurrentUserHandler,
  getUserPermissionsHandler,
  updateUserProfileHandler,
  updateUserPasswordHandler,
  updateUserAvatarHandler,
  addLoginLogHandler,
} from './users'

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

  // 用户相关
  getUserListHandler,
  getCurrentUserHandler, // 必须在 getUserByIdHandler 之前，因为更具体的路由要优先匹配
  getUserPermissionsHandler, // 必须在 getUserByIdHandler 之前，因为更具体的路由要优先匹配
  updateUserProfileHandler, // 必须在 getUserByIdHandler 之前，因为更具体的路由要优先匹配
  updateUserPasswordHandler, // 必须在 getUserByIdHandler 之前，因为更具体的路由要优先匹配
  updateUserAvatarHandler, // 必须在 getUserByIdHandler 之前，因为更具体的路由要优先匹配
  getUserByIdHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  addLoginLogHandler,
]
