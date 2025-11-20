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

  // 主题颜色预设
  const primaryColorOptions = [
    { value: '#8B5CF6', name: '紫色' },
    { value: '#10B981', name: '绿色' },
    { value: '#F59E0B', name: '橙色' },
    { value: '#EF4444', name: '红色' },
    { value: '#6366F1', name: '靛蓝' },
    { value: '#1677FF', name: '蓝色' },
    { value: '#0EA5E9', name: '天蓝' },
    { value: '#00BCD4', name: '青色' },
    { value: '#909399', name: '灰色' },
  ]

  // 设置 Element Plus 主题色变量
  const setPrimaryColor = (color: string) => {
    const root = document.documentElement
    root.style.setProperty('--el-color-primary', color)
    root.style.setProperty('--el-color-primary-light-3', `color-mix(in srgb, ${color} 70%, white)`)
    root.style.setProperty('--el-color-primary-light-5', `color-mix(in srgb, ${color} 50%, white)`)
    root.style.setProperty('--el-color-primary-light-7', `color-mix(in srgb, ${color} 30%, white)`)
    root.style.setProperty('--el-color-primary-light-8', `color-mix(in srgb, ${color} 20%, white)`)
    root.style.setProperty('--el-color-primary-light-9', `color-mix(in srgb, ${color} 10%, white)`)
    root.style.setProperty('--el-color-primary-dark-2', `color-mix(in srgb, ${color} 80%, black)`)
  }

  // 主题颜色
  const primaryColor = ref(localStorage.getItem('theme-color-primary') || '#8B5CF6')
  setPrimaryColor(primaryColor.value)

  // 切换主题颜色
  const togglePrimaryColor = (colorValue: string) => {
    primaryColor.value = colorValue
    localStorage.setItem('theme-color-primary', colorValue)
    setPrimaryColor(colorValue)
  }

  // 布局方式: leftMode, topMode
  const layout = ref<'leftMode' | 'topMode'>(
    (localStorage.getItem('layout') as 'leftMode' | 'topMode') || 'leftMode',
  )
  const toggleLayout = (newVal: 'leftMode' | 'topMode') => {
    layout.value = newVal
    localStorage.setItem('layout', newVal)
  }

  // 侧边栏配色
  const sidebarMode = ref<'light' | 'dark'>(
    (localStorage.getItem('sidebarMode') as 'light' | 'dark') || 'light',
  )
  const toggleSidebarMode = (newVal: 'light' | 'dark') => {
    sidebarMode.value = newVal
    localStorage.setItem('sidebarMode', newVal)
  }

  // 布局元素
  const showLogo = ref(JSON.parse(localStorage.getItem('showLogo') || 'true'))
  const toggleShowLogo = (value: boolean) => {
    showLogo.value = value
    localStorage.setItem('showLogo', JSON.stringify(showLogo.value))
  }
  const showTabs = ref(true)

  const themeConfigDrawerOpen = ref(false)

  return {
    layout,
    themeMode,
    primaryColor,
    sidebarMode,
    showLogo,
    showTabs,
    themeConfigDrawerOpen,
    primaryColorOptions,
    toggleThemeMode,
    toggleLayout,
    togglePrimaryColor,
    toggleSidebarMode,
    toggleShowLogo,
  }
})
