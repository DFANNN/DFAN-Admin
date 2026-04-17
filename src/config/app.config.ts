/**
 * 应用全局配置
 * 用户可以在这里自定义项目的各种配置项
 */
import { DEFAULT_MENU_TREE_DATA } from '@/config/defaultSeeds/menus'
import { DEFAULT_ROLES } from '@/config/defaultSeeds/roles'
import { DEFAULT_USERS } from '@/config/defaultSeeds/users'
import type { Role, User, Menu } from '@/mocks/db/types'

interface AppConfig {
  enableMSW: boolean
  listenMSWPath: string
  name: string
  faviconSrc: string
  logoSrc: string
  showThemeConfig: boolean
  mock: {
    defaultMenuTreeData: Menu[]
    defaultRoles: Role[]
    defaultUsers: User[]
  }
}

export const APP_CONFIG: AppConfig = {
  // 是否启用 MSW
  enableMSW: true,
  // MSW 监听的请求路径
  listenMSWPath: '/DFAN-admin-api',

  // 项目名称
  name: 'DFAN Admin',

  // Favicon src - 根据环境动态设置 base path
  faviconSrc: `${import.meta.env.VITE_STATIC_URL}favicon.ico`,

  // Logo src
  logoSrc: new URL('@/assets/logo.svg', import.meta.url).href,

  // 是否展示主题配置
  showThemeConfig: true,

  // Mock / IndexedDB 默认初始化配置
  mock: {
    // 默认菜单
    defaultMenuTreeData: DEFAULT_MENU_TREE_DATA,
    // 默认角色
    defaultRoles: DEFAULT_ROLES,
    // 默认用户
    defaultUsers: DEFAULT_USERS,
  },
}
