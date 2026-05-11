/**
 * 数据字典 —— 统一维护各业务枚举的 label/value 映射
 * 使用方式：直接绑定到 a-select 的 :options，或用于表格列渲染时的文字转换
 */
import { i18n } from '@/i18n/index'

export interface DictItem<T = string | number> {
  label: string
  value: T
  color?: string // 可选： tag/badge 的颜色
  remark?: string // 可选：备注信息，便于维护者理解该项的用途
}

// 类型标签（用于用户、角色、菜单的类型标签）
export const TYPE_OPTIONS: DictItem<boolean>[] = [
  { label: i18n.global.t('tag.builtIn'), value: true, color: 'warning' },
  { label: i18n.global.t('tag.custom'), value: false, color: 'success' },
]

// 状态标签（用于用户、角色、菜单的状态标签）
export const STATUS_OPTIONS: DictItem<string>[] = [
  { label: i18n.global.t('tag.enabled'), value: 'active', color: 'success' },
  { label: i18n.global.t('tag.disabled'), value: 'inactive', color: 'danger' },
]

/**
 * 通用工具：根据 value 查找对应 label
 * @example getLabelByValue(TAG_TYPE_OPTIONS, 'IMAGE') // '算法'
 */
export const getLabelByValue = <T extends string | number | boolean>(
  dict: DictItem<T>[],
  value: T,
): string => dict.find((item) => item.value === value)?.label ?? String(value)

/**
 * 通用工具：根据 value 查找对应 color
 */
export const getColorByValue = <T extends string | number | boolean>(
  dict: DictItem<T>[],
  value: T,
): string => dict.find((item) => item.value === value)?.color ?? 'primary'
