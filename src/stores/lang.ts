import { defineStore } from 'pinia'
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import zhTW from 'element-plus/es/locale/lang/zh-tw'
import EN from 'element-plus/es/locale/lang/en'
import { setI18nLang } from '@/i18n'
import { APP_CONFIG } from '@/config/app.config'
import { STORAGE_KEYS, storage } from '@/utils/storage'
import type { ILangCode, ILangOption } from '@/types/lang'

export const useLangStore = defineStore('lang', () => {
  // 当前语言
  const currentLang = ref<ILangCode>(
    storage.get<ILangCode>(STORAGE_KEYS.LANG) || APP_CONFIG.defaultLang,
  )

  // 国际化options
  const langOptions: ILangOption[] = [
    {
      code: 'zh-CN',
      shortCode: 'CN',
      label: '简体中文',
      elementLocale: 'zhCN',
    },
    {
      code: 'zh-TW',
      shortCode: 'TW',
      label: '繁體中文',
      elementLocale: 'zhTW',
    },
    {
      code: 'en-US',
      shortCode: 'EN',
      label: 'English',
      elementLocale: 'EN',
    },
  ] as const

  // 当前语言对应的完整配置项，便于读取展示名称和 Element Plus 映射字段。
  const currentLangOption = computed(
    () => langOptions.find((option) => option.code === currentLang.value)!,
  )

  // element语言包映射表
  const elementLangMap = {
    EN,
    zhCN,
    zhTW,
  } as const

  // element 当前的语言
  const currentElementLang = computed(
    () => elementLangMap[currentLangOption.value.elementLocale as keyof typeof elementLangMap],
  )

  // 设置语言
  const setLang = (code: ILangCode) => {
    currentLang.value = code
    // 同步 vue-i18n
    setI18nLang(code)
    // 刷新页面，向后端请求时会携带最新的语言参数，确保接口返回正确的语言内容。
    window.location.reload()
  }

  // 监听语言变化，并将变化同步storage
  watch(
    currentLang,
    (newLang) => {
      // 将当前语言持久化到 localStorage，刷新页面后仍能保留用户选择
      storage.set(STORAGE_KEYS.LANG, newLang)
    },
    { immediate: true },
  )

  return {
    currentLang,
    langOptions,
    currentLangOption,
    currentElementLang,
    setLang,
  }
})
