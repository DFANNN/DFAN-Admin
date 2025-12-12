import type { Directive, DirectiveBinding } from 'vue'
import { watchEffect, type WatchStopHandle } from 'vue'
import { useMenuStore } from '@/stores/menu'

// 扩展 HTMLElement 类型以存储 watcher
interface HTMLElementWithWatcher extends HTMLElement {
  __permissionWatcher?: WatchStopHandle
}

/**
 * 检查是否有权限
 * @param permissions 用户拥有的权限列表
 * @param value 指令绑定的值（字符串或字符串数组）
 * @returns 是否有权限
 */
const checkPermission = (permissions: string[], value: string | string[]): boolean => {
  if (!value) return true // 如果没有传入权限值，默认有权限

  if (typeof value === 'string') {
    // 单个权限：检查是否在权限列表中
    return permissions.includes(value)
  }

  if (Array.isArray(value)) {
    // 多个权限：需要全部满足（AND 逻辑）
    return value.every((permission) => permissions.includes(permission))
  }

  return true
}

/**
 * 更新元素的禁用状态
 */
const updateElementDisabled = (el: HTMLElement, hasPermission: boolean) => {
  if (!hasPermission) {
    el.setAttribute('disabled', 'true')
    // 如果是 Element Plus 的按钮，还需要设置 disabled 类
    if (el.classList.contains('el-button')) {
      el.classList.add('is-disabled')
    }
  } else {
    el.removeAttribute('disabled')
    if (el.classList.contains('el-button')) {
      el.classList.remove('is-disabled')
    }
  }
}

export const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const menuStore = useMenuStore()
    const element = el as HTMLElementWithWatcher

    // 监听权限变化并更新按钮状态
    const stopWatcher = watchEffect(() => {
      const currentPermissions = menuStore.buttonPermissions
      const hasPermission = checkPermission(currentPermissions, binding.value)
      updateElementDisabled(element, hasPermission)
    })

    // 将停止函数存储到元素上，以便在卸载时清理
    element.__permissionWatcher = stopWatcher
  },

  updated(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const menuStore = useMenuStore()
    const hasPermission = checkPermission(menuStore.buttonPermissions, binding.value)
    updateElementDisabled(el, hasPermission)
  },

  unmounted(el: HTMLElement) {
    // 清理监听器
    const element = el as HTMLElementWithWatcher
    const stopWatcher = element.__permissionWatcher
    if (stopWatcher) {
      stopWatcher()
      element.__permissionWatcher = undefined
    }
  },
}
