/**
 * 认证相关的 MSW Handlers
 */
import { http, HttpResponse } from 'msw'
import { getUser } from '../db/index'
import { generateToken } from './utils'

/**
 * 登录接口
 */
export const loginHandler = http.post('/cat-admin-api/login', async ({ request }) => {
  try {
    const body = (await request.json()) as { username?: string; password?: string }

    const { username, password } = body

    // 验证参数
    if (!username || !password) {
      return HttpResponse.json({
        code: 500,
        data: null,
        message: '用户名和密码不能为空',
      })
    }

    // 从 IndexedDB 查询用户
    const user = await getUser(username)

    if (!user) {
      return HttpResponse.json({
        code: 500,
        data: null,
        message: '用户名或密码错误',
      })
    }

    // 验证密码
    if (user.password !== password) {
      return HttpResponse.json({
        code: 500,
        data: null,
        message: '用户名或密码错误',
      })
    }

    // 登录成功，生成 token
    const token = generateToken()

    // 返回token
    return HttpResponse.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
      },
    })
  } catch (error) {
    console.error('[MSW] 登录接口错误:', error)
    return HttpResponse.json({
      code: 500,
      message: '服务器内部错误',
      data: null,
    })
  }
})
