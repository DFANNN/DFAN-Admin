/**
 * 应用全局配置
 * 用户可以在这里自定义项目的各种配置项
 */
import { DEFAULT_MENU_TREE_DATA } from '@/config/defaultSeeds/menus'
import { DEFAULT_ROLES } from '@/config/defaultSeeds/roles'
import { DEFAULT_USERS } from '@/config/defaultSeeds/users'
import type { IAppConfig } from '@/types/app.config'

export const APP_CONFIG: IAppConfig = {
  // 是否启用 MSW
  enableMSW: true,
  // MSW 监听的请求路径
  listenMSWPath: '/DFAN-admin-api',

  // Mock / IndexedDB 默认初始化配置
  mock: {
    //  IndexedDB数据库默认菜单
    defaultMenuTreeData: DEFAULT_MENU_TREE_DATA,
    // IndexedDB数据库默认角色
    defaultRoles: DEFAULT_ROLES,
    // IndexedDB数据库默认用户
    defaultUsers: DEFAULT_USERS,
  },

  // 项目名称
  name: 'DFAN Admin',

  // Favicon src - 根据环境动态设置 base path
  faviconSrc: `${import.meta.env.VITE_STATIC_URL}favicon.ico`,

  // Logo src
  logoSrc: new URL('@/assets/logo.svg', import.meta.url).href,

  // 移动端断点、小于该宽度时按移动端布局渲染（单位px）
  mobileBreakpoint: 992,

  // 是否展示主题配置
  showThemeConfig: true,

  // 主题配置默认 JSON默认值
  themeConfig: {
    themeMode: 'light',
    primaryColor: '#8B5CF6',
    layout: 'leftMode',
    sidebarMode: 'light',
    showLogo: true,
    showTabs: true,
  },

  // 是否展示全屏/退出全屏按钮
  showFullscreen: true,

  // 是否展示国际化
  showI18n: true,

  // 国际化默认语言
  defaultLanguage: 'zh-CN',

  // 是否展示消息通知
  showNotification: true,

  // 登录页面是否展示手机号登录
  showPhoneLogin: true,

  // 登录页面是否展示扫码登录
  showQrLogin: true,

  // 登录页面是否展示注册账号
  showRegister: true,
}
