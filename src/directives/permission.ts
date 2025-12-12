// 权限指令

import type { Directive, DirectiveBinding } from 'vue'

/**
 * 判断是否有权限
 * @param value 权限值
 */
const checkPermission = (value: string | string[]): boolean => {
  // 如果没有传入权限值，默认没有权限
  if (!value) return false

  const menuStore = useMenuStore()

  // 单个权限
  if (typeof value === 'string') {
    return menuStore.buttonPermissions.includes(value)
  }

  // 多个权限
  if (Array.isArray(value)) {
    return value.every((permission) => menuStore.buttonPermissions.includes(permission))
  }

  return false
}

// 权限指令
export const permissionDirective: Directive = {
  mounted(el: HTMLButtonElement, binding: DirectiveBinding<string | string[]>) {
    if (checkPermission(binding.value)) {
      el.disabled = false
      if (el.classList.contains('el-button')) el.classList.remove('is-disabled')
    } else {
      el.disabled = true
      if (el.classList.contains('el-button')) el.classList.add('is-disabled')
    }
  },
}
