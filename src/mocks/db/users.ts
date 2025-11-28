/**
 * 用户相关的数据库操作
 */
import { openDB } from './core'
import { STORES, type User } from './types'

/**
 * 根据用户名获取用户
 */
export async function getUser(username: string): Promise<User | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.USERS], 'readonly')
    const store = transaction.objectStore(STORES.USERS)
    const index = store.index('username')
    const request = index.get(username)

    request.onsuccess = () => {
      resolve(request.result || null)
    }

    request.onerror = () => {
      reject(new Error('查询用户失败'))
    }
  })
}

/**
 * 添加用户
 */
export async function addUser(user: User): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.USERS], 'readwrite')
    const store = transaction.objectStore(STORES.USERS)
    const request = store.add(user)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(new Error('添加用户失败'))
    }
  })
}

/**
 * 检查用户是否存在
 */
export async function userExists(username: string): Promise<boolean> {
  const user = await getUser(username)
  return user !== null
}

/**
 * 根据ID获取用户
 */
export async function getUserById(id: string): Promise<User | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.USERS], 'readonly')
    const store = transaction.objectStore(STORES.USERS)
    const request = store.get(id)

    request.onsuccess = () => {
      resolve(request.result || null)
    }

    request.onerror = () => {
      reject(new Error('查询用户失败'))
    }
  })
}

/**
 * 检查用户名是否存在
 * @param username 用户名
 * @param excludeId 排除的用户ID（用于更新时检查，不检查自己）
 */
export async function usernameExists(username: string, excludeId?: string): Promise<boolean> {
  const user = await getUser(username)
  if (!user) return false
  if (excludeId && user.id === excludeId) return false
  return true
}
