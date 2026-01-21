// 个人中心ts类型文件

// 当前选中的标签页
export type ICurrentTab = 'personalInfo' | 'projects' | 'permissions' | 'logs' | 'settings'

// 导航菜单
export interface IMenuTab {
  id: ICurrentTab
  name: string
  icon: string
}
