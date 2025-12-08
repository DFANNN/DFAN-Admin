import { defineStore } from 'pinia'
import * as Icons from '@element-plus/icons-vue'
import { useWindowSize } from '@vueuse/core'
import { userPermissions } from '@/api/login'
import type { IMenuItem } from '@/types/system/menu'

export const useMenuStore = defineStore('menu', () => {
  // 图标映射(导入所有图标)
  const iconComponents: Record<string, Component> = Icons

  // 菜单折叠状态
  const isCollapse = ref(false)
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  // 响应式监听窗口宽度
  const { width } = useWindowSize()
  // 是否为手机模式
  const isMobile = computed(() => width.value < 992)

  // 如果是手机模式,菜单不折叠
  watchEffect(() => {
    if (isMobile.value) isCollapse.value = false
  })

  // 移动端菜单抽屉显示状态
  const isMobileMenuOpen = ref(false)
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  // 菜单数据配置
  const menuList = ref<IMenuItem[]>([])
  // 按钮权限
  const buttonPermissions = ref<string[]>([])
  // 是否已经加载过权限（用于区分"未加载"和"已加载但为空"）
  const hasLoadedPermissions = ref(false)

  // 获取用户权限
  const getUserPermissions = async () => {
    const { data: res } = await userPermissions()
    if (res.code !== 200) return
    menuList.value = res.data.menus
    buttonPermissions.value = res.data.buttonPermissions
    hasLoadedPermissions.value = true
  }

  // 清除用户权限
  const clearUserPermissions = () => {
    menuList.value = []
    buttonPermissions.value = []
    hasLoadedPermissions.value = false
  }

  return {
    iconComponents,
    menuList,
    isCollapse,
    isMobileMenuOpen,
    hasLoadedPermissions,
    isMobile,
    toggleCollapse,
    toggleMobileMenu,
    getUserPermissions,
    clearUserPermissions,
  }
})
