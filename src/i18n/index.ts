import { createI18n } from 'vue-i18n'
import enUS from '@/i18n/en-US.json'
import zhCN from '@/i18n/zh-CN.json'
import zhTW from '@/i18n/zh-TW.json'
import { APP_CONFIG } from '@/config/app.config'
import { STORAGE_KEYS, storage } from '@/utils/storage'
import type { ILangCode } from '@/types/lang'

/**
 * 聚合所有语言包
 * key 必须与应用内部统一的 locale code 完全一致，
 * 否则 store、请求头、Element Plus 和 vue-i18n 之间会出现不一致问题。
 */
export const messages = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS,
} as const

/**
 * 创建全局 i18n 实例
 * - legacy: false 表示使用 Composition API 模式
 * - locale 使用应用默认语言(优先读取 localStorage，没有则使用 app.config 中的 defaultLang)
 * - fallbackLocale 用于翻译缺失时兜底
 */
export const i18n = createI18n({
  legacy: false,
  locale: storage.get<ILangCode>(STORAGE_KEYS.LANG) || APP_CONFIG.defaultLang,
  fallbackLocale: APP_CONFIG.defaultLang,
  messages,
})

/**
 * 统一设置运行时语言
 * 1. vue-i18n 当前语言同步更新
 * 2. HTML lang 属性同步更新，便于浏览器、SEO 和辅助工具识别页面语言
 * @param lang  当前语言的code
 */
export const setI18nLang = (lang: ILangCode) => {
  i18n.global.locale.value = lang
  document.documentElement.lang = lang
}
