// 主题配置的类型文件

// 主题配色模式
export type IThemeMode = 'light' | 'dark'

// layout布局模式
export type ILayoutMode = 'leftMode' | 'topMode'

// 侧边栏配色模式
export type ISidebarMode = 'light' | 'dark'

// 主题配置
export interface IThemeConfig {
  themeMode: IThemeMode // 主题模式
  primaryColor: string // 主题颜色
  layout: ILayoutMode // 布局方式
  sidebarMode: ISidebarMode // 侧边栏配色
  showLogo: boolean // 是否显示Logo
  showTabs: boolean // 是否显示标签页
}
