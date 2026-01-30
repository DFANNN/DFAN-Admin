// 个人中心ts类型文件

// 当前选中的标签页
export type ICurrentTab = 'personalInfo' | 'projects' | 'permissions' | 'messages' | 'logs'

// tab 菜单数据类型
export interface ITabsMenuData {
  key: string // 绑定值，选中选项卡的 name
  label: string // 标题
  badge?: number | string // 徽标数量
  disabled?: boolean // 是否禁用
  icon?: string | Component // 标题前的图标名称或图标组件
}

// 团队成员列表类型
export interface ITeamItem {
  id?: string
  name: string
  role: string
  avatar: string
  status: 'online' | 'offline'
}

// 项目列表类型
export interface IProjectItem {
  id?: string | number // 项目ID
  name: string // 项目名称
  desc: string // 项目描述
  icon: string | Comment // 项目图标
  color: string // 展示颜色
  members: {
    name: string // 成员名称
    avatar: string // 成员头像
  }[]
  progress: number // 项目进度
  time: string // 项目时间
  status: 'not_started' | 'in_progress' | 'completed' // 项目状态（ 待开始、进行中、已完成 ）
}
