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
    // 更新主题颜色变量
    setPrimaryColor(primaryColor.value)
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
    // 判断是否是暗黑模式（通常 Element Plus 会在 html 标签加 .dark 类）
    const isDark = themeMode.value === 'dark'

    // 关键：在 Dark 模式下，Light 系列变量应该向“背景色”靠拢，而不是白色
    // Element Plus 暗黑模式默认背景色通常是 #141414
    const mixLightTarget = isDark ? '#141414' : '#ffffff'
    // 关键：在 Dark 模式下，Dark-2 变量通常反而要亮一点点，用于 hover 反馈
    const mixDarkTarget = isDark ? '#ffffff' : '#000000'

    root.style.setProperty('--el-color-primary', color)

    // 生成 light-3 到 light-9
    // 在暗色模式下，这些会由主色逐渐淡化融入背景，不会产生刺眼的亮色
    root.style.setProperty(
      '--el-color-primary-light-3',
      `color-mix(in srgb, ${color} 70%, ${mixLightTarget})`,
    )
    root.style.setProperty(
      '--el-color-primary-light-5',
      `color-mix(in srgb, ${color} 50%, ${mixLightTarget})`,
    )
    root.style.setProperty(
      '--el-color-primary-light-7',
      `color-mix(in srgb, ${color} 30%, ${mixLightTarget})`,
    )
    root.style.setProperty(
      '--el-color-primary-light-8',
      `color-mix(in srgb, ${color} 20%, ${mixLightTarget})`,
    )
    root.style.setProperty(
      '--el-color-primary-light-9',
      `color-mix(in srgb, ${color} 10%, ${mixLightTarget})`,
    )

    // Dark-2 变量处理
    // Light 模式下变深 20%；Dark 模式下变亮 20%（符合官方交互直觉）
    root.style.setProperty(
      '--el-color-primary-dark-2',
      `color-mix(in srgb, ${color} 80%, ${mixDarkTarget})`,
    )
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
