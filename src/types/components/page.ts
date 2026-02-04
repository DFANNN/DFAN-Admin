// page组件的配置类型

//   表单配置类型
export interface IFormConfig {
  label: string // 表单label
  type: 'elInput' | 'elInputNumber' | 'elSelect' | 'elDatePicker' // 要渲染的表单组件
  prop: string // 表单字段名
  defaultValue?: unknown // 表单字段默认值
  attrs?: Record<string, unknown> // 组件属性 支持当前渲染组件的所有属性api
}

// 表格column的类型
export interface ITableColumns {
  visible?: boolean
  prop?: string
  type?: string
  fixed?: 'left' | 'right' | boolean
  [key: string]: unknown
}
