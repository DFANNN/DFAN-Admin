/**
 * 用户相关的 MSW Handlers
 */
import { http, HttpResponse } from 'msw'
import dayjs from 'dayjs'
import {
  getAll,
  getById,
  add,
  update,
  remove,
  STORES,
  getUserById,
  usernameExists,
  type User,
} from '../db/index'
import { verifyAuth } from './utils'

/**
 * 获取用户列表
 */
export const getUserListHandler = http.get('/cat-admin-api/users', async ({ request }) => {
  // 验证token
  const authError = verifyAuth(request)
  if (authError) {
    return authError
  }

  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10)
    const username = url.searchParams.get('username') || ''
    const name = url.searchParams.get('name') || ''
    const status = url.searchParams.get('status') as 'active' | 'inactive' | null
    const sortOrder = url.searchParams.get('sortOrder') || 'desc' // 排序方向，默认为降序（最新在前）

    // 从 IndexedDB 获取所有用户
    let users = await getAll<User>(STORES.USERS)

    // 筛选
    if (username) {
      users = users.filter((user) => user.username.includes(username))
    }
    if (name) {
      users = users.filter((user) => user.name?.includes(name))
    }
    if (status) {
      users = users.filter((user) => user.status === status)
    }

    // 排序：按照创建时间排序，最新创建的放在第一个（降序）
    users.sort((a, b) => {
      const aTime = dayjs(a.createTime || '1970-01-01 00:00:00').valueOf()
      const bTime = dayjs(b.createTime || '1970-01-01 00:00:00').valueOf()

      if (sortOrder === 'asc') {
        return aTime - bTime // 升序：旧的在前
      } else {
        return bTime - aTime // 降序：新的在前（默认）
      }
    })

    // 分页
    const total = users.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = users.slice(start, end)

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
    console.error('[MSW] 获取用户列表错误:', error)
    return HttpResponse.json({
      code: 500,
      message: '服务器内部错误',
      data: null,
    })
  }
})

/**
 * 获取用户详情
 */
export const getUserByIdHandler = http.get(
  '/cat-admin-api/users/:id',
  async ({ params, request }) => {
    // 验证token
    const authError = verifyAuth(request)
    if (authError) {
      return authError
    }

    try {
      const { id } = params
      if (!id || typeof id !== 'string') {
        return HttpResponse.json({
          code: 500,
          message: '用户ID不能为空',
          data: null,
        })
      }

      const user = await getUserById(id)

      if (!user) {
        return HttpResponse.json({
          code: 500,
          message: '用户不存在',
          data: null,
        })
      }

      return HttpResponse.json({
        code: 200,
        message: '获取成功',
        data: user,
      })
    } catch (error) {
      console.error('[MSW] 获取用户详情错误:', error)
      return HttpResponse.json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      })
    }
  },
)

/**
 * 创建用户
 */
export const createUserHandler = http.post('/cat-admin-api/users', async ({ request }) => {
  // 验证token
  const authError = verifyAuth(request)
  if (authError) {
    return authError
  }

  try {
    const body = (await request.json()) as {
      username?: string
      password?: string
      name?: string
      phone?: string
      email?: string
      roleId?: string
      status?: 'active' | 'inactive'
    }

    const { username, password, name, phone, email, roleId, status } = body

    // 验证参数
    if (!username || !password) {
      return HttpResponse.json({
        code: 500,
        message: '用户名和密码不能为空',
        data: null,
      })
    }

    if (!status) {
      return HttpResponse.json({
        code: 500,
        message: '用户状态不能为空',
        data: null,
      })
    }

    // 验证用户名不允许中文
    if (/[\u4e00-\u9fa5]/.test(username)) {
      return HttpResponse.json({
        code: 500,
        message: '用户名不允许输入中文',
        data: null,
      })
    }

    // 检查用户名是否已存在
    const usernameExistsResult = await usernameExists(username)
    if (usernameExistsResult) {
      return HttpResponse.json({
        code: 500,
        message: '用户名已存在',
        data: null,
      })
    }

    // 创建用户
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      username,
      password,
      name,
      phone,
      email,
      roleId: roleId || undefined,
      status,
      isBuiltIn: false,
      createTime: now,
      updateTime: now,
    }

    await add<User>(STORES.USERS, newUser)

    return HttpResponse.json({
      code: 200,
      message: '创建成功',
      data: newUser,
    })
  } catch (error) {
    console.error('[MSW] 创建用户错误:', error)
    return HttpResponse.json({
      code: 500,
      message: '服务器内部错误',
      data: null,
    })
  }
})

/**
 * 更新用户
 */
export const updateUserHandler = http.put('/cat-admin-api/users', async ({ request }) => {
  // 验证token
  const authError = verifyAuth(request)
  if (authError) {
    return authError
  }

  try {
    const body = (await request.json()) as {
      id?: string
      username?: string
      password?: string
      name?: string
      phone?: string
      email?: string
      roleId?: string
      status?: 'active' | 'inactive'
    }

    if (!body.id) {
      return HttpResponse.json({
        code: 500,
        message: '用户ID不能为空',
        data: null,
      })
    }

    // 获取现有用户
    const existingUser = await getUserById(body.id)
    if (!existingUser) {
      return HttpResponse.json({
        code: 500,
        message: '用户不存在',
        data: null,
      })
    }

    // 如果是内置用户，不允许修改
    if (existingUser.isBuiltIn) {
      return HttpResponse.json({
        code: 500,
        message: '内置用户不允许修改',
        data: null,
      })
    }

    // 如果更新了用户名，检查是否重复
    if (body.username && body.username !== existingUser.username) {
      // 验证用户名不允许中文
      if (/[\u4e00-\u9fa5]/.test(body.username)) {
        return HttpResponse.json({
          code: 500,
          message: '用户名不允许输入中文',
          data: null,
        })
      }

      const usernameExistsResult = await usernameExists(body.username, body.id)
      if (usernameExistsResult) {
        return HttpResponse.json({
          code: 500,
          message: '用户名已存在',
          data: null,
        })
      }
    }

    // 更新用户
    const updatedUser: User = {
      ...existingUser,
      username: body.username ?? existingUser.username,
      password: body.password ?? existingUser.password, // 如果提供了新密码则更新
      name: body.name ?? existingUser.name,
      phone: body.phone ?? existingUser.phone,
      email: body.email ?? existingUser.email,
      roleId: body.roleId !== undefined ? body.roleId : existingUser.roleId,
      status: body.status ?? existingUser.status,
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }

    await update<User>(STORES.USERS, updatedUser)

    return HttpResponse.json({
      code: 200,
      message: '更新成功',
      data: updatedUser,
    })
  } catch (error) {
    console.error('[MSW] 更新用户错误:', error)
    return HttpResponse.json({
      code: 500,
      message: '服务器内部错误',
      data: null,
    })
  }
})

/**
 * 删除用户（支持批量删除）
 */
export const deleteUserHandler = http.delete('/cat-admin-api/users', async ({ request }) => {
  // 验证token
  const authError = verifyAuth(request)
  if (authError) {
    return authError
  }

  try {
    // 从请求体中读取 ID 数组
    const ids = (await request.json()) as string[]

    // 验证 ID 数组
    if (!Array.isArray(ids) || ids.length === 0) {
      return HttpResponse.json({
        code: 500,
        message: '用户ID数组不能为空',
        data: null,
      })
    }

    // 验证每个 ID 都是字符串
    if (!ids.every((id) => typeof id === 'string' && id.trim())) {
      return HttpResponse.json({
        code: 500,
        message: '用户ID格式不正确',
        data: null,
      })
    }

    const errors: string[] = []
    const successIds: string[] = []

    // 遍历每个 ID，进行验证和删除
    for (const id of ids) {
      // 获取用户信息
      const user = await getUserById(id)

      if (!user) {
        errors.push(`用户 ${id} 不存在`)
        continue
      }

      // 检查是否为内置用户
      if (user.isBuiltIn) {
        errors.push(`用户 ${user.username} 是内置用户，不允许删除`)
        continue
      }

      // 删除用户
      try {
        await remove(STORES.USERS, id)
        successIds.push(id)
      } catch {
        errors.push(`删除用户 ${id} 失败`)
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
        ? `成功删除 ${successIds.length} 个用户，失败 ${errors.length} 个：${errors.join('; ')}`
        : `成功删除 ${successIds.length} 个用户`

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
    console.error('[MSW] 删除用户错误:', error)
    return HttpResponse.json({
      code: 500,
      message: '服务器内部错误',
      data: null,
    })
  }
})
