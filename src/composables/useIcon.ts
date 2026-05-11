import * as HeroIcons from '@heroicons/vue/24/outline'

/**
 * 根据图标名称字符串获取heroicons图标组件
 * @param name 图标名称，如 'DashboardOutlined'，为空时返回 null
 * @returns heroicons 图标组件或 null
 */

export const useHeroIcon = (name: string | null | undefined): Component | null => {
  if (!name) return null
  return (HeroIcons as Record<string, Component>)[name] ?? null
}
