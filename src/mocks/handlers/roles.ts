/**
 * 角色相关的 MSW Handlers
 */
import { http, HttpResponse } from 'msw'
import {
  getAll,
  getById,
  add,
  update,
  remove,
  STORES,
  roleCodeExists,
  type Role,
} from '../db/index'

/**
 * 获取角色列表
 */
export const getRoleListHandler = http.get('/cat-admin-api/roles', async ({ request }) => {
  try {
    console.log('request', request)
    const url = new URL(request.url)
    console.log('url', url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10)
    const name = url.searchParams.get('name') || ''
    const code = url.searchParams.get('code') || ''
    const status = url.searchParams.get('status') as 'active' | 'inactive' | null

    // 从 IndexedDB 获取所有角色
    let roles = await getAll<Role>(STORES.ROLES)

    // 筛选
    if (name) {
      roles = roles.filter((role) => role.name.includes(name))
    }
    if (code) {
      roles = roles.filter((role) => role.code.includes(code))
    }
    if (status) {
      roles = roles.filter((role) => role.status === status)
    }

    // 分页
    const total = roles.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = roles.slice(start, end)

    return HttpResponse.json({
      code: 200,
      message: '获取成功',
      success: true,
      data: {
        list,
        total,
        page,
        pageSize,
      },
    })
  } catch (error) {
    console.error('[MSW] 获取角色列表错误:', error)
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
 * 获取角色详情
 */
export const getRoleByIdHandler = http.get('/cat-admin-api/roles/:id', async ({ params }) => {
  try {
    const { id } = params
    if (!id || typeof id !== 'string') {
      return HttpResponse.json(
        {
          code: 400,
          message: '角色ID不能为空',
          success: false,
        },
        { status: 400 },
      )
    }

    const role = await getById<Role>(STORES.ROLES, id)

    if (!role) {
      return HttpResponse.json(
        {
          code: 404,
          message: '角色不存在',
          success: false,
        },
        { status: 404 },
      )
    }

    return HttpResponse.json({
      code: 200,
      message: '获取成功',
      success: true,
      data: role,
    })
  } catch (error) {
    console.error('[MSW] 获取角色详情错误:', error)
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
 * 创建角色
 */
export const createRoleHandler = http.post('/cat-admin-api/roles', async ({ request }) => {
  try {
    const body = (await request.json()) as {
      name?: string
      code?: string
      description?: string
      status?: 'active' | 'inactive'
    }

    const { name, code, description, status } = body

    // 验证参数
    if (!name || !code) {
      return HttpResponse.json(
        {
          code: 400,
          message: '角色名称和编码不能为空',
          success: false,
        },
        { status: 400 },
      )
    }

    // 检查角色编码是否已存在
    const codeExists = await roleCodeExists(code)
    if (codeExists) {
      return HttpResponse.json(
        {
          code: 400,
          message: '角色编码已存在',
          success: false,
        },
        { status: 400 },
      )
    }

    // 创建角色
    const now = new Date().toISOString()
    const newRole: Role = {
      id: `role_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      code,
      description,
      isBuiltIn: false,
      status: status || 'active',
      createTime: now,
      updateTime: now,
    }

    await add<Role>(STORES.ROLES, newRole)

    return HttpResponse.json({
      code: 200,
      message: '创建成功',
      success: true,
      data: newRole,
    })
  } catch (error) {
    console.error('[MSW] 创建角色错误:', error)
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
 * 更新角色
 */
export const updateRoleHandler = http.put(
  '/cat-admin-api/roles/:id',
  async ({ params, request }) => {
    try {
      const { id } = params
      if (!id || typeof id !== 'string') {
        return HttpResponse.json(
          {
            code: 400,
            message: '角色ID不能为空',
            success: false,
          },
          { status: 400 },
        )
      }

      const body = (await request.json()) as {
        name?: string
        code?: string
        description?: string
        status?: 'active' | 'inactive'
      }

      // 获取现有角色
      const existingRole = await getById<Role>(STORES.ROLES, id)
      if (!existingRole) {
        return HttpResponse.json(
          {
            code: 404,
            message: '角色不存在',
            success: false,
          },
          { status: 404 },
        )
      }

      // 如果更新了编码，检查是否重复
      if (body.code && body.code !== existingRole.code) {
        const codeExists = await roleCodeExists(body.code, id)
        if (codeExists) {
          return HttpResponse.json(
            {
              code: 400,
              message: '角色编码已存在',
              success: false,
            },
            { status: 400 },
          )
        }
      }

      // 更新角色
      const updatedRole: Role = {
        ...existingRole,
        ...body,
        updateTime: new Date().toISOString(),
      }

      await update<Role>(STORES.ROLES, updatedRole)

      return HttpResponse.json({
        code: 200,
        message: '更新成功',
        success: true,
        data: updatedRole,
      })
    } catch (error) {
      console.error('[MSW] 更新角色错误:', error)
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
 * 删除角色
 */
export const deleteRoleHandler = http.delete('/cat-admin-api/roles/:id', async ({ params }) => {
  try {
    const { id } = params
    if (!id || typeof id !== 'string') {
      return HttpResponse.json(
        {
          code: 400,
          message: '角色ID不能为空',
          success: false,
        },
        { status: 400 },
      )
    }

    // 获取角色信息
    const role = await getById<Role>(STORES.ROLES, id)

    if (!role) {
      return HttpResponse.json(
        {
          code: 404,
          message: '角色不存在',
          success: false,
        },
        { status: 404 },
      )
    }

    // 检查是否为内置角色
    if (role.isBuiltIn) {
      return HttpResponse.json(
        {
          code: 403,
          message: '内置角色不允许删除',
          success: false,
        },
        { status: 403 },
      )
    }

    // 删除角色
    await remove(STORES.ROLES, id)

    return HttpResponse.json({
      code: 200,
      message: '删除成功',
      success: true,
    })
  } catch (error) {
    console.error('[MSW] 删除角色错误:', error)
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
