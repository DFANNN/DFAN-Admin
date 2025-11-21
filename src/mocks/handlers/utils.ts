/**
 * MSW Handlers 工具函数
 */

/**
 * 生成简单的 token（用于开发测试）
 */
export function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}
