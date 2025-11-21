/**
 * IndexedDB 核心功能
 * 数据库连接、初始化和通用CRUD操作
 */
import { DB_NAME, DB_VERSION, STORES } from './types'

/**
 * 打开数据库
 */
export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new Error('打开数据库失败'))
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // 创建 users 表
      if (!db.objectStoreNames.contains(STORES.USERS)) {
        const userStore = db.createObjectStore(STORES.USERS, { keyPath: 'id' })
        userStore.createIndex('username', 'username', { unique: true })
      }

      // 创建 roles 表
      if (!db.objectStoreNames.contains(STORES.ROLES)) {
        const roleStore = db.createObjectStore(STORES.ROLES, { keyPath: 'id' })
        roleStore.createIndex('code', 'code', { unique: true })
      }

      // 创建或升级 menus 表
      if (!db.objectStoreNames.contains(STORES.MENUS)) {
        const menuStore = db.createObjectStore(STORES.MENUS, { keyPath: 'id' })
        menuStore.createIndex('path', 'path', { unique: false }) // 不唯一，因为directory和button可以为空
        menuStore.createIndex('parentId', 'parentId', { unique: false })
        menuStore.createIndex('type', 'type', { unique: false }) // 添加type索引
      } else {
        // 如果表已存在，尝试添加type索引（如果不存在）
        const menuStore = db.transaction([STORES.MENUS], 'readwrite').objectStore(STORES.MENUS)
        try {
          if (!menuStore.indexNames.contains('type')) {
            menuStore.createIndex('type', 'type', { unique: false })
          }
        } catch (error) {
          // 索引可能已存在或创建失败，忽略错误
          console.warn('[IndexedDB] 创建type索引失败，可能已存在:', error)
        }
      }
    }
  })
}

/**
 * 确保数据库结构已初始化（用于确保升级完成）
 */
export async function ensureDBInitialized(): Promise<void> {
  try {
    await openDB()
  } catch (error) {
    console.error('[IndexedDB] 数据库初始化失败:', error)
    throw error
  }
}

/**
 * 获取表的所有数据（通用方法）
 */
export async function getAll<T = unknown>(tableName: string): Promise<T[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName], 'readonly')
    const store = transaction.objectStore(tableName)
    const request = store.getAll()

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(new Error(`获取 ${tableName} 表数据失败`))
    }
  })
}

/**
 * 根据 ID 获取数据（通用方法）
 */
export async function getById<T = unknown>(tableName: string, id: string): Promise<T | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName], 'readonly')
    const store = transaction.objectStore(tableName)
    const request = store.get(id)

    request.onsuccess = () => {
      resolve(request.result || null)
    }

    request.onerror = () => {
      reject(new Error(`获取 ${tableName} 表数据失败`))
    }
  })
}

/**
 * 添加数据（通用方法）
 */
export async function add<T = unknown>(tableName: string, data: T): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName], 'readwrite')
    const store = transaction.objectStore(tableName)
    const request = store.add(data)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(new Error(`添加 ${tableName} 表数据失败`))
    }
  })
}

/**
 * 更新数据（通用方法）
 */
export async function update<T = unknown>(tableName: string, data: T): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName], 'readwrite')
    const store = transaction.objectStore(tableName)
    const request = store.put(data)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(new Error(`更新 ${tableName} 表数据失败`))
    }
  })
}

/**
 * 删除数据（通用方法）
 */
export async function remove(tableName: string, id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName], 'readwrite')
    const store = transaction.objectStore(tableName)
    const request = store.delete(id)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(new Error(`删除 ${tableName} 表数据失败`))
    }
  })
}
