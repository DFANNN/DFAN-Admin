/**
 * 菜单相关的 MSW Handlers
 */
import { http, HttpResponse } from 'msw'
import { APP_CONFIG } from '@/config/app.config'
import {
  getById,
  add,
  update,
  remove,
  getAll,
  STORES,
  menuPathExists,
  hasChildren,
  buildMenuTree,
  type Menu,
  type MenuType,
} from '../db/index'
import { verifyAuth } from './utils'
import dayjs from 'dayjs'

/**
 * 获取菜单列表（树形结构）
 */
export const getMenuListHandler = http.get(
  `${APP_CONFIG.listenMSWPath}/menus`,
  async ({ request }) => {
    // 验证token
    const { error } = verifyAuth(request)
    if (error) {
      return error
    }

    try {
      // 获取所有菜单（包括按钮）
      const allMenus = await getAll<Menu>(STORES.MENUS)

      // 构建完整的菜单树（包含 directory、menu 和 button 类型）
      const menuTree = buildMenuTree(allMenus)

      return HttpResponse.json({
        code: 200,
        message: '获取成功',
        data: menuTree,
      })
    } catch (error) {
      console.error('[MSW] 获取菜单列表错误:', error)
      return HttpResponse.json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      })
    }
  },
)

/**
 * 获取菜单详情
 */
export const getMenuByIdHandler = http.get(
  `${APP_CONFIG.listenMSWPath}/menus/:id`,
  async ({ params, request }) => {
    // 验证token
    const { error } = verifyAuth(request)
    if (error) {
      return error
    }

    try {
      const { id } = params
      if (!id || typeof id !== 'string') {
        return HttpResponse.json({
          code: 500,
          message: '菜单ID不能为空',
          data: null,
        })
      }

      const menu = await getById<Menu>(STORES.MENUS, id)

      if (!menu) {
        return HttpResponse.json({
          code: 500,
          message: '菜单不存在',
          data: null,
        })
      }

      return HttpResponse.json({
        code: 200,
        message: '获取成功',
        data: menu,
      })
    } catch (error) {
      console.error('[MSW] 获取菜单详情错误:', error)
      return HttpResponse.json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      })
    }
  },
)

/**
 * 创建菜单
 */
export const createMenuHandler = http.post(
  `${APP_CONFIG.listenMSWPath}/menus`,
  async ({ request }) => {
    // 验证token
    const { error } = verifyAuth(request)
    if (error) {
      return error
    }

    try {
      const body = (await request.json()) as {
        type?: MenuType
        path?: string
        title?: string
        icon?: string
        parentId?: string | null
        order?: number
        status?: 'active' | 'inactive'
        permission?: string
      }

      const { type, path, title, icon, parentId, order, status, permission } = body

      // 验证参数
      if (!type || !title) {
        return HttpResponse.json({
          code: 500,
          message: '菜单类型和标题不能为空',
          data: null,
        })
      }

      // 根据类型验证path
      if (type === 'menu') {
        // menu类型必须要有path
        if (!path) {
          return HttpResponse.json({
            code: 500,
            message: '菜单类型的路径不能为空',
            data: null,
          })
        }
        // 检查菜单路径是否已存在（menu类型的path必须唯一）
        const pathExists = await menuPathExists(path)
        if (pathExists) {
          return HttpResponse.json({
            code: 500,
            message: '菜单路径已存在',
            data: null,
          })
        }
      } else if (type === 'directory') {
        // directory类型的path可以为空或虚拟路径
        // 如果有path，也需要检查唯一性（但可以为空）
        if (path) {
          const pathExists = await menuPathExists(path)
          if (pathExists) {
            return HttpResponse.json({
              code: 500,
              message: '菜单路径已存在',
              data: null,
            })
          }
        }
      } else if (type === 'button') {
        // button类型的path可以为空
        // 如果有path，也需要检查唯一性（但可以为空）
        if (path) {
          const pathExists = await menuPathExists(path)
          if (pathExists) {
            return HttpResponse.json({
              code: 500,
              message: '菜单路径已存在',
              data: null,
            })
          }
        }
      }

      // 创建菜单
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
      const newMenu: Menu = {
        id: `menu_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type,
        path: path || '',
        title,
        icon,
        parentId: parentId || null,
        order: order || 0,
        status: status || 'active',
        permission: permission || undefined,
        createTime: now,
        updateTime: now,
        isBuiltIn: false,
      }

      await add<Menu>(STORES.MENUS, newMenu)

      return HttpResponse.json({
        code: 200,
        message: '创建成功',
        data: null,
      })
    } catch (error) {
      console.error('[MSW] 创建菜单错误:', error)
      return HttpResponse.json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      })
    }
  },
)

/**
 * 更新菜单
 */
export const updateMenuHandler = http.put(
  `${APP_CONFIG.listenMSWPath}/menus`,
  async ({ request }) => {
    // 验证token
    const { error } = verifyAuth(request)
    if (error) {
      return error
    }

    try {
      const body = (await request.json()) as {
        id?: string
        type?: MenuType
        path?: string
        title?: string
        icon?: string
        parentId?: string | null
        order?: number
        status?: 'active' | 'inactive'
        permission?: string
      }

      const { id, ...payload } = body as typeof body & { isBuiltIn?: boolean }
      if ('isBuiltIn' in payload) {
        delete (payload as { isBuiltIn?: boolean }).isBuiltIn
      }

      if (!id || typeof id !== 'string') {
        return HttpResponse.json({
          code: 500,
          message: '菜单ID不能为空',
          data: null,
        })
      }

      // 获取现有菜单
      const existingMenu = await getById<Menu>(STORES.MENUS, id)
      if (!existingMenu) {
        return HttpResponse.json({
          code: 500,
          message: '菜单不存在',
          data: null,
        })
      }

      // 检查是否为内置菜单，内置菜单不允许编辑
      if (existingMenu.isBuiltIn) {
        return HttpResponse.json({
          code: 500,
          message: '系统内置菜单不允许编辑',
          data: null,
        })
      }

      // 确定要使用的类型（如果更新了类型，使用新的，否则使用原有的）
      const menuType = payload.type || existingMenu.type

      // 根据类型验证path
      if (menuType === 'menu') {
        // menu类型必须要有path
        const finalPath = payload.path !== undefined ? payload.path : existingMenu.path
        if (!finalPath) {
          return HttpResponse.json({
            code: 500,
            message: '菜单类型的路径不能为空',
            data: null,
          })
        }
        // 如果更新了路径，检查是否重复
        if (payload.path && payload.path !== existingMenu.path) {
          const pathExists = await menuPathExists(payload.path, id)
          if (pathExists) {
            return HttpResponse.json({
              code: 500,
              message: '菜单路径已存在',
              data: null,
            })
          }
        }
      } else if (menuType === 'directory' || menuType === 'button') {
        // directory和button类型的path可以为空
        // 如果更新了路径，检查是否重复
        if (payload.path && payload.path !== existingMenu.path) {
          const pathExists = await menuPathExists(payload.path, id)
          if (pathExists) {
            return HttpResponse.json({
              code: 500,
              message: '菜单路径已存在',
              data: null,
            })
          }
        }
      }

      // 检查是否将菜单设置为自己的子菜单（防止循环引用）
      if (payload.parentId === id) {
        return HttpResponse.json({
          code: 500,
          message: '不能将菜单设置为自己的子菜单',
          data: null,
        })
      }

      // 更新菜单
      const updatedMenu: Menu = {
        ...existingMenu,
        ...payload,
        type: menuType,
        path: payload.path !== undefined ? payload.path : existingMenu.path,
        updateTime: new Date().toISOString(),
        isBuiltIn: existingMenu.isBuiltIn ?? false,
      }

      await update<Menu>(STORES.MENUS, updatedMenu)

      return HttpResponse.json({
        code: 200,
        message: '更新成功',
        data: null,
      })
    } catch (error) {
      console.error('[MSW] 更新菜单错误:', error)
      return HttpResponse.json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      })
    }
  },
)

/**
 * 删除菜单
 */
export const deleteMenuHandler = http.delete(
  `${APP_CONFIG.listenMSWPath}/menus/:id`,
  async ({ params, request }) => {
    // 验证token
    const { error } = verifyAuth(request)
    if (error) {
      return error
    }

    try {
      const { id } = params
      if (!id || typeof id !== 'string') {
        return HttpResponse.json({
          code: 500,
          message: '菜单ID不能为空',
          data: null,
        })
      }

      // 获取菜单信息
      const menu = await getById<Menu>(STORES.MENUS, id)

      if (!menu) {
        return HttpResponse.json({
          code: 500,
          message: '菜单不存在',
          data: null,
        })
      }

      if (menu.isBuiltIn) {
        return HttpResponse.json({
          code: 500,
          message: '系统内置菜单不允许删除',
          data: null,
        })
      }

      // 检查是否有子菜单
      const hasChildMenus = await hasChildren(id)
      if (hasChildMenus) {
        return HttpResponse.json({
          code: 500,
          message: '该菜单下存在子菜单，无法删除',
          data: null,
        })
      }

      // 删除菜单
      await remove(STORES.MENUS, id)

      return HttpResponse.json({
        code: 200,
        message: '删除成功',
        data: null,
      })
    } catch (error) {
      console.error('[MSW] 删除菜单错误:', error)
      return HttpResponse.json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      })
    }
  },
)
