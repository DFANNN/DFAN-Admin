// 统一管理所有 localStorage 的 key

// localStorage 的 key
export const STORAGE_KEYS = {
  THEME_CONFIG: 'themeConfig', // 主题配置
}

// 定义 StorageKey 类型，限制只能使用 STORAGE_KEYS 中的 key
type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

export const storage = {
  /**
   * 从 localStorage 读取数据
   * @param key 存储键名
   * @returns 解析后的数据，不存在时返回 null
   */
  get: <T>(key: StorageKey): T | null => {
    const val = localStorage.getItem(key)
    if (!val) return null
    try {
      return JSON.parse(val) as T
    } catch {
      return val as unknown as T
    }
  },

  /**
   * 将数据写入 localStorage
   * @param key 存储键名
   * @param value 要存储的数据（自动序列化为 JSON）
   */
  set: <T>(key: StorageKey, value: T): void => localStorage.setItem(key, JSON.stringify(value)),

  /**
   *
   * 删除指定 localStorage 条目
   * @param key 存储键名
   */
  remove: (key: StorageKey): void => localStorage.removeItem(key),

  /**
   * 清空所有 localStorage 数据
   */
  clear: (): void => localStorage.clear(),
}
