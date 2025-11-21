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
