import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'
import { APP_CONFIG } from '@/config/app.config'
import { STORAGE_KEYS, storage } from '@/utils/storage'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import type { IThemeConfig, IThemeMode, ILayoutMode, ISidebarMode } from '@/types/themeConfig'

export const useThemeStore = defineStore('theme', () => {
  const isDark = useDark()
  const toggleDark = useToggle(isDark)

  // 主题配置抽屉的开关状态
  const themeConfigDrawerOpen = ref(false)

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
    const isDark = themeConfig.value.themeMode === 'dark'

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

  // 主题配置(默认读取 localStorage，如果没有则使用 app.config.ts 中的默认值)
  const themeConfig = ref<IThemeConfig>(
    storage.get<IThemeConfig>(STORAGE_KEYS.THEME_CONFIG) ||
      JSON.parse(JSON.stringify(APP_CONFIG.themeConfig)),
  )
  // 初始化时根据主题模式设置主题色变量
  setPrimaryColor(themeConfig.value.primaryColor)

  // 切换主题模式
  const toggleThemeMode = (newVal: IThemeMode) => {
    themeConfig.value.themeMode = newVal
    toggleDark(newVal === 'dark')
    // 更新主题颜色变量
    setPrimaryColor(themeConfig.value.primaryColor)
  }

  //  切换布局方式
  const toggleLayout = (newVal: ILayoutMode) => {
    themeConfig.value.layout = newVal
  }

  // 切换主题颜色
  const togglePrimaryColor = (colorValue: string) => {
    themeConfig.value.primaryColor = colorValue
    setPrimaryColor(colorValue)
  }

  // 切换侧边栏配色
  const toggleSidebarMode = (newVal: ISidebarMode) => {
    themeConfig.value.sidebarMode = newVal
  }

  // 切换是否显示 Logo
  const toggleShowLogo = (value: boolean) => {
    themeConfig.value.showLogo = value
  }

  // 切换是否显示标签页
  const toggleShowTabs = (value: boolean) => {
    themeConfig.value.showTabs = value
  }

  const { copy } = useClipboard()
  // 复制当前主题配置到剪贴板
  const copyThemeConfig = async () => {
    await copy(JSON.stringify(themeConfig.value, null, 2))
    ElMessage.success('主题配置已复制，请到 src/config/app.config.ts 的 themeConfig 中替换默认值')
  }

  // 重置主题配置为默认值
  const resetThemeConfig = () => {
    themeConfig.value = JSON.parse(JSON.stringify(APP_CONFIG.themeConfig)) // 深拷贝默认配置
    toggleDark(themeConfig.value.themeMode === 'dark')
    setPrimaryColor(themeConfig.value.primaryColor)
    ElMessage.success('已恢复默认主题配置')
  }

  // 监听 themeConfig 的变化，实时保存到 localStorage
  watch(
    themeConfig,
    (newConfig) => {
      storage.set(STORAGE_KEYS.THEME_CONFIG, newConfig)
    },
    { deep: true, immediate: true },
  )

  return {
    themeConfig,
    themeConfigDrawerOpen,
    primaryColorOptions,
    toggleThemeMode,
    togglePrimaryColor,
    toggleSidebarMode,
    toggleLayout,
    toggleShowLogo,
    toggleShowTabs,
    copyThemeConfig,
    resetThemeConfig,
  }
})
