import { defineStore } from 'pinia'
import * as Icons from '@element-plus/icons-vue'

export const useMenuStore = defineStore('menu', () => {
  // 图标映射(导入所有图标)
  const iconComponents: Record<string, Component> = Icons

  // 菜单折叠状态
  const isCollapse = ref(false)
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  // 菜单数据配置
  const menuList = ref([
    {
      path: '/layout/home',
      title: '首页',
      icon: 'HomeFilled',
    },
    {
      path: '/layout/system',
      title: '系统管理',
      icon: 'Setting',
      children: [
        {
          path: '/layout/system/user',
          title: '用户管理',
          icon: 'User',
        },
        {
          path: '/layout/system/role',
          title: '角色管理',
          icon: 'Grid',
        },
        {
          path: '/layout/system/menu',
          title: '菜单管理',
          icon: 'Menu',
        },
      ],
    },
    {
      path: '/layout/content',
      title: '内容管理',
      icon: 'Files',
      children: [
        {
          path: '/layout/content/article',
          title: '文章管理',
          icon: 'Document',
        },
        {
          path: '/layout/content/category',
          title: '分类管理',
          icon: 'Grid',
        },
      ],
    },
    {
      path: '/layout/data',
      title: '数据分析',
      icon: 'DataAnalysis',
      children: [
        {
          path: '/layout/data/overview',
          title: '数据概览',
          icon: 'Location',
        },
        {
          path: '/layout/data/report',
          title: '数据报表',
          icon: 'Document',
        },
      ],
    },
    {
      path: '/layout/tools',
      title: '工具',
      icon: 'Tools',
      children: [
        {
          path: '/layout/tools/icon',
          title: '图标库',
          icon: 'Grid',
        },
        {
          path: '/layout/tools/component',
          title: '组件库',
          icon: 'Files',
        },
      ],
    },
    {
      path: '/layout/settings',
      title: '一级菜单',
      icon: 'Setting',
      children: [
        {
          path: '/layout/settings/user',
          title: '二级菜单',
          icon: 'Document',
          children: [
            {
              path: '/layout/settings/user/user',
              title: '三级菜单',
              icon: 'User',
            },
          ],
        },
      ],
    },
  ])

  return {
    iconComponents,
    menuList,
    isCollapse,
    toggleCollapse,
  }
})
