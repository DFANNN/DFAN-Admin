import { defineStore } from 'pinia'
import * as Icons from '@element-plus/icons-vue'
import { userPermissions } from '@/api/login'
import type { IMenuItem } from '@/types/login'

export const useMenuStore = defineStore('menu', () => {
  // 图标映射(导入所有图标)
  const iconComponents: Record<string, Component> = Icons

  // 菜单折叠状态
  const isCollapse = ref(false)
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  // 菜单数据配置
  const menuList = ref<IMenuItem[]>([])
  // 按钮权限
  const buttonPermissions = ref<string[]>([])

  // 获取用户权限
  const getUserPermissions = async () => {
    const { data: res } = await userPermissions()
    if (res.code !== 200) return
    menuList.value = res.data.menus
    buttonPermissions.value = res.data.buttonPermissions
  }

  // 清除用户权限
  const clearUserPermissions = () => {
    menuList.value = []
    buttonPermissions.value = []
  }

  return {
    iconComponents,
    menuList,
    isCollapse,
    toggleCollapse,
    getUserPermissions,
    clearUserPermissions,
  }
})
