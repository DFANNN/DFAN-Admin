import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  const isDark = useDark()
  const toggleDark = useToggle(isDark)

  // 主题模式: light, dark
  const themeMode = ref<'light' | 'dark'>(
    (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light',
  )

  // 切换主题模式
  const toggleThemeMode = (newVal: 'light' | 'dark') => {
    themeMode.value = newVal
    toggleDark(newVal === 'dark')
    localStorage.setItem('themeMode', newVal)
  }

  // 布局方式: leftMode, topMode
  const layout = ref<'leftMode' | 'topMode'>('leftMode')

  // 主题颜色
  const primaryColor = ref('#409EFF')

  // 侧边栏配色
  const sidebarBgColor = ref('#ffffff')
  const sidebarTextColor = ref('#333333')

  // Header配色
  const headerBgColor = ref('#ffffff')
  const headerTextColor = ref('#333333')

  // 布局元素
  const showLogo = ref(true)
  const showTabs = ref(true)

  const themeConfigDrawerOpen = ref(false)

  return {
    layout,
    themeMode,
    primaryColor,
    sidebarBgColor,
    sidebarTextColor,
    headerBgColor,
    headerTextColor,
    showLogo,
    showTabs,
    themeConfigDrawerOpen,
    toggleThemeMode,
  }
})
