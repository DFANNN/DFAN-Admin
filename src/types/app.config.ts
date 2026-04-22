// app.config的类型定义文件
import type { Role, User, Menu } from '@/mocks/db/types'
import type { IThemeConfig } from '@/types/themeConfig'
import type { ILangCode } from '@/types/lang'

export interface IAppConfig {
  enableMSW: boolean // 是否启用 MSW
  listenMSWPath: string // MSW 监听的请求路径
  name: string // 项目名称
  faviconSrc: string // Favicon src - 根据环境动态设置 base path
  logoSrc: string // Logo src
  mobileBreakpoint: number // 小于该宽度时按移动端布局渲染
  showThemeConfig: boolean // 是否展示主题配置
  showI18n: boolean // 是否展示国际化
  defaultLang: ILangCode // 国际化默认语言
  showFullscreen: boolean // 是否展示全屏/退出全屏按钮
  showNotification: boolean // 是否展示消息通知
  showPhoneLogin: boolean // 登录页面是否展示手机号登录
  showQrLogin: boolean // 登录页面是否展示扫码登录
  showRegister: boolean // 是否展示注册账号
  themeConfig: IThemeConfig // 主题配置默认 JSON默认值
  mock: {
    defaultMenuTreeData: Menu[] // IndexedDB数据库默认菜单
    defaultRoles: Role[] // IndexedDB数据库默认角色
    defaultUsers: User[] // IndexedDB数据库默认用户
  }
}
