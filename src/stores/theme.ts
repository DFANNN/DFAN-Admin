import { defineStore } from 'pinia'
import { useDark, useToggle, useCssVar } from '@vueuse/core'

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

  // 主题颜色预设
  const primaryColorOptions = [
    { value: '#409EFF', name: '蓝色' },
    { value: '#67C23A', name: '绿色' },
    { value: '#E6A23C', name: '橙色' },
    { value: '#F56C6C', name: '红色' },
    { value: '#909399', name: '灰色' },
    { value: '#9C27B0', name: '紫色' },
    { value: '#FF9800', name: '深橙' },
    { value: '#00BCD4', name: '青色' },
    { value: '#795548', name: '棕色' },
  ]

  // 主题颜色
  const primaryColor = useCssVar('--el-color-primary')
  primaryColor.value = localStorage.getItem('theme-color-primary') || '#409EFF'

  // 切换主题颜色
  const togglePrimaryColor = (colorValue: string) => {
    primaryColor.value = colorValue
    localStorage.setItem('theme-color-primary', colorValue)
  }

  // 布局方式: leftMode, topMode
  const layout = ref<'leftMode' | 'topMode'>('leftMode')

  // 侧边栏配色
  const sidebarMode = ref<'light' | 'dark'>('light')
  // Header配色
  const headerMode = ref<'light' | 'dark'>('light')

  // 布局元素
  const showLogo = ref(true)
  const showTabs = ref(true)

  const themeConfigDrawerOpen = ref(false)

  return {
    layout,
    themeMode,
    primaryColor,
    sidebarMode,
    headerMode,
    showLogo,
    showTabs,
    themeConfigDrawerOpen,
    primaryColorOptions,
    toggleThemeMode,
    togglePrimaryColor,
  }
})
