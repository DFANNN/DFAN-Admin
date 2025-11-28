/**
 * MSW Handlers 工具函数
 */
import { HttpResponse } from 'msw'

/**
 * 生成简单的 token（用于开发测试）
 * @param userId 用户ID，将被编码到token中
 * @returns token字符串，格式：token_${userId}_${timestamp}_${random}
 */
export function generateToken(userId: string): string {
  return `token_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * 从token中解析用户ID
 * @param token token字符串
 * @returns 用户ID，如果token格式不正确则返回null
 */
export function getUserIdFromToken(token: string | null): string | null {
  if (!token || !token.startsWith('token_')) {
    return null
  }

  // token格式：token_${userId}_${timestamp}_${random}
  const parts = token.split('_')
  if (parts.length < 3) {
    return null
  }

  // 返回userId（第二部分）
  return `${parts[1]}_${parts[2]}` || null
}

/**
 * 从请求头中提取 token
 */
export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) {
    return null
  }

  // 支持 "Bearer token" 格式
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return authHeader
}

/**
 * 验证 token 是否有效
 * @param token token字符串
 * @returns 是否有效
 */
export function validateToken(token: string | null): boolean {
  if (!token) {
    return false
  }

  // 简单验证：检查token格式是否正确（以token_开头）
  // 在实际项目中，这里应该验证token是否过期、是否被撤销等
  return token.startsWith('token_')
}

/**
 * 验证请求是否包含有效的token
 * @param request 请求对象
 * @returns 如果token无效则返回错误响应，否则返回null和用户ID的对象
 */
export function verifyAuth(request: Request): {
  error: ReturnType<typeof HttpResponse.json> | null
  userId: string | null
} {
  const token = extractToken(request)

  if (!token || !validateToken(token)) {
    return {
      error: HttpResponse.json({
        code: 401,
        message: '未授权，请先登录',
        data: null,
      }) as ReturnType<typeof HttpResponse.json>,
      userId: null,
    }
  }

  // 从token中解析用户ID
  const userId = getUserIdFromToken(token)

  return {
    error: null,
    userId,
  }
}
