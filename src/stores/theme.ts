import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  // 布局方式: leftMode, topMode
  const layout = ref<'leftMode' | 'topMode'>('leftMode')

  // 主题模式: light, dark
  const themeMode = ref<'light' | 'dark'>('light')

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
  }
})
