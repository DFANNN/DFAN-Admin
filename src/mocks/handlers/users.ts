/**
 * 用户相关的 MSW Handlers
 */
import { http, HttpResponse } from 'msw'
import { APP_CONFIG } from '@/config/app.config'
import dayjs from 'dayjs'
import {
  getAll,
  add,
  update,
  remove,
  getById,
  STORES,
  getUserById,
  usernameExists,
  buildMenuTree,
  getMenuAncestors,
  type User,
  type Role,
  type Menu,
} from '../db/index'
import { verifyAuth } from './utils'

const MSW_BASE = APP_CONFIG.listenMSWPath

/**
 * 获取用户列表
 */
export const getUserListHandler = http.get(`${MSW_BASE}/users`, async ({ request }) => {
  // 验证token
  const { error } = verifyAuth(request)
  if (error) {
    return error
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
export const getUserByIdHandler = http.get(`${MSW_BASE}/users/:id`, async ({ params, request }) => {
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
})

/**
 * 创建用户
 */
export const createUserHandler = http.post(`${MSW_BASE}/users`, async ({ request }) => {
  // 验证token
  const { error } = verifyAuth(request)
  if (error) {
    return error
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
      id: `user_${Date.now()}`,
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
export const updateUserHandler = http.put(`${MSW_BASE}/users`, async ({ request }) => {
  // 验证token
  const { error } = verifyAuth(request)
  if (error) {
    return error
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
export const deleteUserHandler = http.delete(`${MSW_BASE}/users`, async ({ request }) => {
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

/**
 * 获取当前用户信息
 * 从token中获取用户ID，无需路径参数
 */
export const getCurrentUserHandler = http.get(`${MSW_BASE}/users/info`, async ({ request }) => {
  // 验证token并获取用户ID
  const { error, userId } = verifyAuth(request)
  if (error) {
    return error
  }

  if (!userId) {
    return HttpResponse.json({
      code: 401,
      message: '无法从token中获取用户ID',
      data: null,
    })
  }

  try {
    // 获取用户信息
    const user = await getUserById(userId)
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
    console.error('[MSW] 获取用户信息错误:', error)
    return HttpResponse.json({
      code: 500,
      message: '服务器内部错误',
      data: null,
    })
  }
})

/**
 * 获取用户权限（菜单权限和按钮权限）
 * 从token中获取用户ID，无需路径参数
 */
export const getUserPermissionsHandler = http.get(
  `${MSW_BASE}/users/permissions`,
  async ({ request }) => {
    // 验证token并获取用户ID
    const { error, userId } = verifyAuth(request)
    if (error) {
      return error
    }

    if (!userId) {
      return HttpResponse.json({
        code: 401,
        message: '无法从token中获取用户ID',
        data: null,
      })
    }

    try {
      // 获取用户信息
      const user = await getUserById(userId)
      if (!user) {
        return HttpResponse.json({
          code: 500,
          message: '用户不存在',
          data: null,
        })
      }

      // 如果用户未分配角色，返回空数组
      if (!user.roleId) {
        return HttpResponse.json({
          code: 200,
          message: '获取成功',
          data: {
            menus: [],
            buttonPermissions: [],
          },
        })
      }

      // 获取角色信息
      const role = await getById<Role>(STORES.ROLES, user.roleId)
      if (!role) {
        return HttpResponse.json({
          code: 200,
          message: '获取成功',
          data: {
            menus: [],
            buttonPermissions: [],
          },
        })
      }

      // 如果角色未分配菜单权限，返回空数组
      if (!role.menuIds || role.menuIds.length === 0) {
        return HttpResponse.json({
          code: 200,
          message: '获取成功',
          data: {
            menus: [],
            buttonPermissions: [],
          },
        })
      }

      // 获取所有菜单
      const allMenus = await getAll<Menu>(STORES.MENUS)

      // 根据menuIds过滤，只获取用户有权限的菜单，且status为active
      const userMenuIds = new Set(role.menuIds!)

      // 对于每个有权限的菜单（包括按钮、menu、directory），自动包含其所有父菜单
      const userAuthorizedMenus = allMenus.filter(
        (menu) => role.menuIds!.includes(menu.id) && menu.status === 'active',
      )

      // 为每个有权限的菜单查找并添加所有祖先菜单
      userAuthorizedMenus.forEach((menu) => {
        const ancestors = getMenuAncestors(menu.id, allMenus)
        ancestors.forEach((ancestorId) => {
          userMenuIds.add(ancestorId)
        })
      })

      // 根据扩展后的menuIds过滤，只获取用户有权限的菜单，且status为active
      const userMenus = allMenus.filter(
        (menu) => userMenuIds.has(menu.id) && menu.status === 'active',
      )

      // 分离菜单和按钮权限
      const menuItems = userMenus.filter(
        (menu) => menu.type === 'directory' || menu.type === 'menu',
      )
      const userButtonMenus = userMenus.filter((menu) => menu.type === 'button')

      // 构建菜单树
      const menuTree = buildMenuTree(menuItems)

      // 提取按钮权限并去重
      const buttonPermissions = Array.from(
        new Set(
          userButtonMenus
            .map((menu) => menu.permission)
            .filter((permission): permission is string => !!permission),
        ),
      )

      return HttpResponse.json({
        code: 200,
        message: '获取成功',
        data: {
          menus: menuTree,
          buttonPermissions,
        },
      })
    } catch (error) {
      console.error('[MSW] 获取用户权限错误:', error)
      return HttpResponse.json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      })
    }
  },
)

/**
 * 修改用户基本信息（姓名、手机号、邮箱）
 * 从token中获取用户ID，无需路径参数
 */
export const updateUserProfileHandler = http.put(
  `${MSW_BASE}/users/profile`,
  async ({ request }) => {
    // 验证token并获取用户ID
    const { error, userId } = verifyAuth(request)
    if (error) {
      return error
    }

    if (!userId) {
      return HttpResponse.json({
        code: 401,
        message: '无法从token中获取用户ID',
        data: null,
      })
    }

    try {
      const body = (await request.json()) as {
        name?: string
        phone?: string
        email?: string
        avatar?: string
        bio?: string
        tags?: string
      }

      // 获取现有用户
      const existingUser = await getUserById(userId)
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

      // 更新用户基本信息
      const updatedUser: User = {
        ...existingUser,
        name: body.name,
        phone: body.phone,
        email: body.email,
        avatar: body.avatar,
        bio: body.bio,
        tags: body.tags,
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }

      await update<User>(STORES.USERS, updatedUser)

      return HttpResponse.json({
        code: 200,
        message: '更新成功',
        data: updatedUser,
      })
    } catch (error) {
      console.error('[MSW] 修改用户基本信息错误:', error)
      return HttpResponse.json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      })
    }
  },
)

/**
 * 修改用户密码
 * 从token中获取用户ID，无需路径参数
 */
export const updateUserPasswordHandler = http.put(
  `${MSW_BASE}/users/password`,
  async ({ request }) => {
    // 验证token并获取用户ID
    const { error, userId } = verifyAuth(request)
    if (error) {
      return error
    }

    if (!userId) {
      return HttpResponse.json({
        code: 401,
        message: '无法从token中获取用户ID',
        data: null,
      })
    }

    try {
      const body = (await request.json()) as {
        oldPassword?: string
        newPassword?: string
        confirmPassword?: string
      }

      const { oldPassword, newPassword, confirmPassword } = body

      // 验证参数
      if (!oldPassword || !newPassword || !confirmPassword) {
        return HttpResponse.json({
          code: 500,
          message: '旧密码、新密码和确认密码不能为空',
          data: null,
        })
      }

      // 验证新密码长度至少6位
      if (newPassword.length < 6) {
        return HttpResponse.json({
          code: 500,
          message: '新密码长度至少6位',
          data: null,
        })
      }

      // 验证新密码和确认密码是否一致
      if (newPassword !== confirmPassword) {
        return HttpResponse.json({
          code: 500,
          message: '新密码和确认密码不一致',
          data: null,
        })
      }

      // 获取现有用户
      const existingUser = await getUserById(userId)
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

      // 验证旧密码是否正确
      if (existingUser.password !== oldPassword) {
        return HttpResponse.json({
          code: 500,
          message: '旧密码错误',
          data: null,
        })
      }

      // 更新用户密码
      const updatedUser: User = {
        ...existingUser,
        password: newPassword,
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }

      await update<User>(STORES.USERS, updatedUser)

      // 返回更新后的用户信息（不包含密码字段）
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = updatedUser

      return HttpResponse.json({
        code: 200,
        message: '密码修改成功',
        data: userWithoutPassword,
      })
    } catch (error) {
      console.error('[MSW] 修改用户密码错误:', error)
      return HttpResponse.json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      })
    }
  },
)

/**
 * 修改用户头像
 * 从token中获取用户ID，无需路径参数
 */
export const updateUserAvatarHandler = http.put(`${MSW_BASE}/users/avatar`, async ({ request }) => {
  // 验证token并获取用户ID
  const { error, userId } = verifyAuth(request)
  if (error) {
    return error
  }

  if (!userId) {
    return HttpResponse.json({
      code: 401,
      message: '无法从token中获取用户ID',
      data: null,
    })
  }

  try {
    const body = (await request.json()) as {
      avatar?: string
    }

    // 验证参数
    if (body.avatar === undefined || body.avatar === null) {
      return HttpResponse.json({
        code: 500,
        message: '头像不能为空',
        data: null,
      })
    }

    // 获取现有用户
    const existingUser = await getUserById(userId)
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

    // 更新用户头像
    const updatedUser: User = {
      ...existingUser,
      avatar: body.avatar,
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }

    await update<User>(STORES.USERS, updatedUser)

    return HttpResponse.json({
      code: 200,
      message: '头像修改成功',
      data: updatedUser,
    })
  } catch (error) {
    console.error('[MSW] 修改用户头像错误:', error)
    return HttpResponse.json({
      code: 500,
      message: '服务器内部错误',
      data: null,
    })
  }
})

/**
 * 添加登录日志
 */
export const addLoginLogHandler = http.put(`${MSW_BASE}/users/log`, async ({ request }) => {
  // 验证token并获取用户ID
  const { error, userId } = verifyAuth(request)
  if (error) {
    return error
  }
  if (!userId) {
    return HttpResponse.json({
      code: 401,
      message: '无法从token中获取用户ID',
      data: null,
    })
  }

  try {
    // 日志消息
    const body = (await request.json()) as {
      id: string
      device: string
      browser: string
      ip: string
      location: string[]
      time: string
      status: string
    }

    body.id = `log_${Date.now()}`

    // 获取现有用户
    const existingUser = await getUserById(userId)

    if (!existingUser) {
      return HttpResponse.json({
        code: 500,
        message: '用户不存在',
        data: null,
      })
    }

    // 更新用户信息
    const updatedUser: User = {
      ...existingUser,
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      loginLogs: [body, ...(existingUser.loginLogs || [])],
    }

    await update<User>(STORES.USERS, updatedUser)

    return HttpResponse.json({
      code: 200,
      message: '添加登录日志成功',
      data: null,
    })
  } catch (error) {
    console.error('[MSW] 添加登录日志错误:', error)
    return HttpResponse.json({
      code: 500,
      message: '服务器内部错误',
      data: null,
    })
  }
})
