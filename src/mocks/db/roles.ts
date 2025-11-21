/**
 * 角色相关的数据库操作
 */
import { openDB } from './core'
import { STORES, type Role } from './types'

/**
 * 根据角色编码获取角色
 */
export async function getRoleByCode(code: string): Promise<Role | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.ROLES], 'readonly')
    const store = transaction.objectStore(STORES.ROLES)
    const index = store.index('code')
    const request = index.get(code)

    request.onsuccess = () => {
      resolve(request.result || null)
    }

    request.onerror = () => {
      reject(new Error('查询角色失败'))
    }
  })
}

/**
 * 检查角色编码是否存在
 */
export async function roleCodeExists(code: string, excludeId?: string): Promise<boolean> {
  const role = await getRoleByCode(code)
  if (!role) return false
  if (excludeId && role.id === excludeId) return false
  return true
}
