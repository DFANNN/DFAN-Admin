/**
 * 角色相关的 MSW Handlers
 */
import { http, HttpResponse } from 'msw'
import { APP_CONFIG } from '@/config/app.config'
import dayjs from 'dayjs'
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
import { verifyAuth } from './utils'

const MSW_BASE = APP_CONFIG.listenMSWPath

/**
 * 获取角色列表
 */
export const getRoleListHandler = http.get(`${MSW_BASE}/roles`, async ({ request }) => {
  // 验证token
  const { error } = verifyAuth(request)
  if (error) {
    return error
  }

  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10)
    const name = url.searchParams.get('name') || ''
    const code = url.searchParams.get('code') || ''
    const status = url.searchParams.get('status') as 'active' | 'inactive' | null
    const sortOrder = url.searchParams.get('sortOrder') || 'desc' // 排序方向，默认为降序（最新在前）

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

    // 排序：按照创建时间排序，最新创建的放在第一个（降序）
    roles.sort((a, b) => {
      const aTime = dayjs(a.createTime).valueOf()
      const bTime = dayjs(b.createTime).valueOf()

      if (sortOrder === 'asc') {
        return aTime - bTime // 升序：旧的在前
      } else {
        return bTime - aTime // 降序：新的在前（默认）
      }
    })

    // 分页
    const total = roles.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = roles.slice(start, end)

    return HttpResponse.json({
      code: 200,
      message: '获取成功',
      data: {
        list,
        total,
        page,
        pageSize,
      },
    })
  } catch (error) {
    console.error('[MSW] 获取角色列表错误:', error)
    return HttpResponse.json({
      code: 500,
      message: '服务器内部错误',
      data: null,
    })
  }
})

/**
 * 获取角色详情
 */
export const getRoleByIdHandler = http.get(`${MSW_BASE}/roles/:id`, async ({ params, request }) => {
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
        message: '角色ID不能为空',
        data: null,
      })
    }

    const role = await getById<Role>(STORES.ROLES, id)

    if (!role) {
      return HttpResponse.json({
        code: 500,
        message: '角色不存在',
        data: null,
      })
    }

    return HttpResponse.json({
      code: 200,
      message: '获取成功',
      data: role,
    })
  } catch (error) {
    console.error('[MSW] 获取角色详情错误:', error)
    return HttpResponse.json({
      code: 500,
      message: '服务器内部错误',
      data: null,
    })
  }
})

/**
 * 创建角色
 */
export const createRoleHandler = http.post(`${MSW_BASE}/roles`, async ({ request }) => {
  // 验证token
  const { error } = verifyAuth(request)
  if (error) {
    return error
  }

  try {
    const body = (await request.json()) as {
      name?: string
      code?: string
      description?: string
      status?: 'active' | 'inactive'
      menuIds?: string[]
    }

    const { name, code, description, status, menuIds } = body

    // 验证参数
    if (!name || !code) {
      return HttpResponse.json({
        code: 500,
        message: '角色名称和编码不能为空',
        data: null,
      })
    }

    // 检查角色编码是否已存在
    const codeExists = await roleCodeExists(code)
    if (codeExists) {
      return HttpResponse.json({
        code: 500,
        message: '角色编码已存在',
        data: null,
      })
    }

    // 创建角色
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const newRole: Role = {
      id: `role_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      code,
      description,
      isBuiltIn: false,
      status: status || 'active',
      menuIds: Array.isArray(menuIds) ? menuIds : [],
      createTime: now,
      updateTime: now,
    }

    await add<Role>(STORES.ROLES, newRole)

    return HttpResponse.json({
      code: 200,
      message: '创建成功',
      data: newRole,
    })
  } catch (error) {
    console.error('[MSW] 创建角色错误:', error)
    return HttpResponse.json({
      code: 500,
      message: '服务器内部错误',
      data: null,
    })
  }
})

/**
 * 更新角色
 */
export const updateRoleHandler = http.put(`${MSW_BASE}/roles`, async ({ request }) => {
  // 验证token
  const { error } = verifyAuth(request)
  if (error) {
    return error
  }

  try {
    const body = (await request.json()) as {
      id?: string
      name?: string
      code?: string
      description?: string
      status?: 'active' | 'inactive'
      menuIds?: string[]
    }

    if (!body.id) {
      return HttpResponse.json({
        code: 500,
        message: '角色ID不能为空',
        data: null,
      })
    }

    // 获取现有角色
    const existingRole = await getById<Role>(STORES.ROLES, body.id)
    if (!existingRole) {
      return HttpResponse.json({
        code: 500,
        message: '角色不存在',
        data: null,
      })
    }

    // 如果更新了编码，检查是否重复
    if (body.code && body.code !== existingRole.code) {
      const codeExists = await roleCodeExists(body.code, body.id)
      if (codeExists) {
        return HttpResponse.json({
          code: 500,
          message: '角色编码已存在',
          data: null,
        })
      }
    }

    // 如果是内置角色，不允许修改
    if (existingRole.isBuiltIn) {
      return HttpResponse.json({
        code: 500,
        message: '内置角色不允许修改',
        data: null,
      })
    }

    // 更新角色
    const updatedRole: Role = {
      ...existingRole,
      name: body.name ?? existingRole.name,
      code: body.code ?? existingRole.code,
      description: body.description ?? existingRole.description,
      status: body.status ?? existingRole.status,
      menuIds:
        body.menuIds !== undefined
          ? Array.isArray(body.menuIds)
            ? body.menuIds
            : []
          : existingRole.menuIds,
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }

    await update<Role>(STORES.ROLES, updatedRole)

    return HttpResponse.json({
      code: 200,
      message: '更新成功',
      data: updatedRole,
    })
  } catch (error) {
    console.error('[MSW] 更新角色错误:', error)
    return HttpResponse.json({
      code: 500,
      message: '服务器内部错误',
      data: null,
    })
  }
})

/**
 * 删除角色（支持批量删除）
 */
export const deleteRoleHandler = http.delete(`${MSW_BASE}/roles`, async ({ request }) => {
  // 验证token
  const { error } = verifyAuth(request)
  if (error) {
    return error
  }

  try {
    // 从请求体中读取 ID 数组
    const ids = (await request.json()) as string[]

    // 验证 ID 数组
    if (!Array.isArray(ids) || ids.length === 0) {
      return HttpResponse.json({
        code: 500,
        message: '角色ID数组不能为空',
        data: null,
      })
    }

    // 验证每个 ID 都是字符串
    if (!ids.every((id) => typeof id === 'string' && id.trim())) {
      return HttpResponse.json({
        code: 500,
        message: '角色ID格式不正确',
        data: null,
      })
    }

    const errors: string[] = []
    const successIds: string[] = []

    // 遍历每个 ID，进行验证和删除
    for (const id of ids) {
      // 获取角色信息
      const role = await getById<Role>(STORES.ROLES, id)

      if (!role) {
        errors.push(`角色 ${id} 不存在`)
        continue
      }

      // 检查是否为内置角色
      if (role.isBuiltIn) {
        errors.push(`角色 ${role.name} 是内置角色，不允许删除`)
        continue
      }

      // 删除角色
      try {
        await remove(STORES.ROLES, id)
        successIds.push(id)
      } catch {
        errors.push(`删除角色 ${id} 失败`)
      }
    }

    // 如果全部失败
    if (successIds.length === 0) {
      return HttpResponse.json({
        code: 500,
        message: errors.join('; ') || '删除失败',
        data: null,
      })
    }

    // 部分成功或全部成功
    const message =
      errors.length > 0
        ? `成功删除 ${successIds.length} 个角色，失败 ${errors.length} 个：${errors.join('; ')}`
        : `成功删除 ${successIds.length} 个角色`

    return HttpResponse.json({
      code: 200,
      message,
      data: {
        successCount: successIds.length,
        failCount: errors.length,
        successIds,
        errors: errors.length > 0 ? errors : undefined,
      },
    })
  } catch (error) {
    console.error('[MSW] 删除角色错误:', error)
    return HttpResponse.json({
      code: 500,
      message: '服务器内部错误',
      data: null,
    })
  }
})
