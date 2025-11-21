/**
 * 菜单相关的 MSW Handlers
 */
import { http, HttpResponse } from 'msw'
import {
  getById,
  add,
  update,
  remove,
  STORES,
  menuPathExists,
  hasChildren,
  getMenuTree,
  type Menu,
  type MenuType,
} from '../db/index'
import { verifyAuth } from './utils'

/**
 * 获取菜单列表（树形结构）
 */
export const getMenuListHandler = http.get('/cat-admin-api/menus', async ({ request }) => {
  // 验证token
  const authError = verifyAuth(request)
  if (authError) {
    return authError
  }

  try {
    // 获取树形菜单
    const menuTree = await getMenuTree()

    return HttpResponse.json({
      code: 200,
      message: '获取成功',
      success: true,
      data: menuTree,
    })
  } catch (error) {
    console.error('[MSW] 获取菜单列表错误:', error)
    return HttpResponse.json(
      {
        code: 500,
        message: '服务器内部错误',
        success: false,
      },
      { status: 500 },
    )
  }
})

/**
 * 获取菜单详情
 */
export const getMenuByIdHandler = http.get(
  '/cat-admin-api/menus/:id',
  async ({ params, request }) => {
    // 验证token
    const authError = verifyAuth(request)
    if (authError) {
      return authError
    }

    try {
      const { id } = params
      if (!id || typeof id !== 'string') {
        return HttpResponse.json(
          {
            code: 400,
            message: '菜单ID不能为空',
            success: false,
          },
          { status: 400 },
        )
      }

      const menu = await getById<Menu>(STORES.MENUS, id)

      if (!menu) {
        return HttpResponse.json(
          {
            code: 404,
            message: '菜单不存在',
            success: false,
          },
          { status: 404 },
        )
      }

      return HttpResponse.json({
        code: 200,
        message: '获取成功',
        success: true,
        data: menu,
      })
    } catch (error) {
      console.error('[MSW] 获取菜单详情错误:', error)
      return HttpResponse.json(
        {
          code: 500,
          message: '服务器内部错误',
          success: false,
        },
        { status: 500 },
      )
    }
  },
)

/**
 * 创建菜单
 */
export const createMenuHandler = http.post('/cat-admin-api/menus', async ({ request }) => {
  // 验证token
  const authError = verifyAuth(request)
  if (authError) {
    return authError
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
      return HttpResponse.json(
        {
          code: 400,
          message: '菜单类型和标题不能为空',
          success: false,
        },
        { status: 400 },
      )
    }

    // 根据类型验证path
    if (type === 'menu') {
      // menu类型必须要有path
      if (!path) {
        return HttpResponse.json(
          {
            code: 400,
            message: '菜单类型的路径不能为空',
            success: false,
          },
          { status: 400 },
        )
      }
      // 检查菜单路径是否已存在（menu类型的path必须唯一）
      const pathExists = await menuPathExists(path)
      if (pathExists) {
        return HttpResponse.json(
          {
            code: 400,
            message: '菜单路径已存在',
            success: false,
          },
          { status: 400 },
        )
      }
    } else if (type === 'directory') {
      // directory类型的path可以为空或虚拟路径
      // 如果有path，也需要检查唯一性（但可以为空）
      if (path) {
        const pathExists = await menuPathExists(path)
        if (pathExists) {
          return HttpResponse.json(
            {
              code: 400,
              message: '菜单路径已存在',
              success: false,
            },
            { status: 400 },
          )
        }
      }
    } else if (type === 'button') {
      // button类型的path可以为空
      // 如果有path，也需要检查唯一性（但可以为空）
      if (path) {
        const pathExists = await menuPathExists(path)
        if (pathExists) {
          return HttpResponse.json(
            {
              code: 400,
              message: '菜单路径已存在',
              success: false,
            },
            { status: 400 },
          )
        }
      }
    }

    // 创建菜单
    const now = new Date().toISOString()
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
    }

    await add<Menu>(STORES.MENUS, newMenu)

    return HttpResponse.json({
      code: 200,
      message: '创建成功',
      success: true,
      data: newMenu,
    })
  } catch (error) {
    console.error('[MSW] 创建菜单错误:', error)
    return HttpResponse.json(
      {
        code: 500,
        message: '服务器内部错误',
        success: false,
      },
      { status: 500 },
    )
  }
})

/**
 * 更新菜单
 */
export const updateMenuHandler = http.put(
  '/cat-admin-api/menus/:id',
  async ({ params, request }) => {
    // 验证token
    const authError = verifyAuth(request)
    if (authError) {
      return authError
    }

    try {
      const { id } = params
      if (!id || typeof id !== 'string') {
        return HttpResponse.json(
          {
            code: 400,
            message: '菜单ID不能为空',
            success: false,
          },
          { status: 400 },
        )
      }

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

      // 获取现有菜单
      const existingMenu = await getById<Menu>(STORES.MENUS, id)
      if (!existingMenu) {
        return HttpResponse.json(
          {
            code: 404,
            message: '菜单不存在',
            success: false,
          },
          { status: 404 },
        )
      }

      // 确定要使用的类型（如果更新了类型，使用新的，否则使用原有的）
      const menuType = body.type || existingMenu.type

      // 根据类型验证path
      if (menuType === 'menu') {
        // menu类型必须要有path
        const finalPath = body.path !== undefined ? body.path : existingMenu.path
        if (!finalPath) {
          return HttpResponse.json(
            {
              code: 400,
              message: '菜单类型的路径不能为空',
              success: false,
            },
            { status: 400 },
          )
        }
        // 如果更新了路径，检查是否重复
        if (body.path && body.path !== existingMenu.path) {
          const pathExists = await menuPathExists(body.path, id)
          if (pathExists) {
            return HttpResponse.json(
              {
                code: 400,
                message: '菜单路径已存在',
                success: false,
              },
              { status: 400 },
            )
          }
        }
      } else if (menuType === 'directory' || menuType === 'button') {
        // directory和button类型的path可以为空
        // 如果更新了路径，检查是否重复
        if (body.path && body.path !== existingMenu.path) {
          const pathExists = await menuPathExists(body.path, id)
          if (pathExists) {
            return HttpResponse.json(
              {
                code: 400,
                message: '菜单路径已存在',
                success: false,
              },
              { status: 400 },
            )
          }
        }
      }

      // 检查是否将菜单设置为自己的子菜单（防止循环引用）
      if (body.parentId === id) {
        return HttpResponse.json(
          {
            code: 400,
            message: '不能将菜单设置为自己的子菜单',
            success: false,
          },
          { status: 400 },
        )
      }

      // 更新菜单
      const updatedMenu: Menu = {
        ...existingMenu,
        ...body,
        type: menuType,
        path: body.path !== undefined ? body.path : existingMenu.path,
        updateTime: new Date().toISOString(),
      }

      await update<Menu>(STORES.MENUS, updatedMenu)

      return HttpResponse.json({
        code: 200,
        message: '更新成功',
        success: true,
        data: updatedMenu,
      })
    } catch (error) {
      console.error('[MSW] 更新菜单错误:', error)
      return HttpResponse.json(
        {
          code: 500,
          message: '服务器内部错误',
          success: false,
        },
        { status: 500 },
      )
    }
  },
)

/**
 * 删除菜单
 */
export const deleteMenuHandler = http.delete(
  '/cat-admin-api/menus/:id',
  async ({ params, request }) => {
    // 验证token
    const authError = verifyAuth(request)
    if (authError) {
      return authError
    }

    try {
      const { id } = params
      if (!id || typeof id !== 'string') {
        return HttpResponse.json(
          {
            code: 400,
            message: '菜单ID不能为空',
            success: false,
          },
          { status: 400 },
        )
      }

      // 获取菜单信息
      const menu = await getById<Menu>(STORES.MENUS, id)

      if (!menu) {
        return HttpResponse.json(
          {
            code: 404,
            message: '菜单不存在',
            success: false,
          },
          { status: 404 },
        )
      }

      // 检查是否有子菜单
      const hasChildMenus = await hasChildren(id)
      if (hasChildMenus) {
        return HttpResponse.json(
          {
            code: 400,
            message: '该菜单下存在子菜单，无法删除',
            success: false,
          },
          { status: 400 },
        )
      }

      // 删除菜单
      await remove(STORES.MENUS, id)

      return HttpResponse.json({
        code: 200,
        message: '删除成功',
        success: true,
      })
    } catch (error) {
      console.error('[MSW] 删除菜单错误:', error)
      return HttpResponse.json(
        {
          code: 500,
          message: '服务器内部错误',
          success: false,
        },
        { status: 500 },
      )
    }
  },
)
