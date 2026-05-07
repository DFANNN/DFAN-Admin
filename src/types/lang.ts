// 国际化的类型

// 本地语言code
export type ILangCode = 'zhCN' | 'zhTW' | 'enUS'
// Element Plus 语言包key
export type IElementLocale = 'EN' | 'zhCN' | 'zhTW'

/**
 * 国际化下拉菜单
 * 如果接口需要的语言参数与应用内部的 locale code 不一致，可以在这里添加一个映射字段
 */
export interface ILangOption {
  code: ILangCode // 应用内部唯一标识，用于业务逻辑判断。
  shortCode: string // 页面展示的code 仅用于界面展示，不参与业务判断。
  label: string // 语言名称，用于界面展示。
  elementLocale: IElementLocale // 用于映射 Element Plus 自带的国际化包。
}
