/**
 * MSW Handlers 工具函数
 */
import { HttpResponse } from 'msw'

/**
 * 生成简单的 token（用于开发测试）
 */
export function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
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
 * @returns 如果token无效则返回错误响应，否则返回null
 */
export function verifyAuth(request: Request) {
  const token = extractToken(request)

  if (!token || !validateToken(token)) {
    return HttpResponse.json({
      code: 401,
      message: '未授权，请先登录',
      data: null,
    })
  }

  return null
}
