import { h, render, type Component, type AppContext } from 'vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue' // 指向你的组件路径

interface DialogOptions {
  title?: string
  content?: string | Component | (() => any)
  footer?: string | Component | (() => any)
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm'
  width?: string
  onConfirm?: () => Promise<void> | void
  onClose?: () => void
  // 可以根据需要透传 BaseDialog 的其他 Props
  [key: string]: any
}

// 默认图标映射 (假设你使用的是之前代码中的图标方案)
const typeIconMap = {
  info: { icon: 'HOutline:InformationCircleIcon', color: '#1890ff' },
  success: { icon: 'HOutline:CheckCircleIcon', color: '#52c41a' },
  warning: { icon: 'HOutline:ExclamationTriangleIcon', color: '#faad14' },
  error: { icon: 'HOutline:XCircleIcon', color: '#ff4d4f' },
  confirm: { icon: 'HOutline:QuestionMarkCircleIcon', color: '#faad14' },
}

export const showDialog = (options: DialogOptions, appContext?: AppContext) => {
  // 1. 创建挂载容器
  const container = document.createElement('div')

  // 2. 销毁函数
  const destroy = () => {
    render(null, container)
    container.remove()
  }

  // 3. 构造组件属性
  const props = {
    ...options,
    modelValue: true, // 默认打开
    'onUpdate:modelValue': (val: boolean) => {
      if (!val) {
        render(h(BaseDialog, { ...props, modelValue: false }), container)
        setTimeout(destroy, 400) // 等待动画结束销毁
      }
    },
    onClose: () => {
      options.onClose?.()
      setTimeout(destroy, 400)
    },
    onConfirm: async () => {
      if (options.onConfirm) {
        await options.onConfirm()
      }
      // 这里的逻辑可以根据业务调整：确认后是否自动关闭
      // 如果需要在 onConfirm 内部控制关闭，可以把 destroy 传出去
      render(h(BaseDialog, { ...props, modelValue: false }), container)
      setTimeout(destroy, 400)
    },
  }

  // 4. 处理插槽 (Content)
  const slots: any = {}

  if (options.content) {
    slots.default = () => {
      if (typeof options.content === 'string') {
        return h('div', { style: 'padding: 10px 0' }, options.content)
      } else if (typeof options.content === 'function') {
        return (options.content as Function)()
      } else {
        return h(options.content as Component)
      }
    }
  }

  // 如果有 type，在标题前加个图标
  if (options.type) {
    const config = typeIconMap[options.type]
    const originalHeader = slots.header
    slots.header = () =>
      h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
        // 这里假设你有全局注册的图标组件或使用 Iconify
        // h('span', { class: config.icon, style: `color: ${config.color}; font-size: 22px` }),
        h('span', { style: `color: ${config.color}` }, options.title || '提示'),
      ])
  }

  // 5. 渲染
  const vnode = h(BaseDialog, props, slots)

  // 继承应用上下文 (以便可以使用全局注册的组件、插件等)
  if (appContext) {
    vnode.appContext = appContext
  }

  render(vnode, container)
  document.body.appendChild(container)

  return {
    destroy,
  }
}

// 封装快捷调用
export const Dialog = {
  info: (options: DialogOptions) =>
    showDialog({ ...options, type: 'info', showFooter: true, showCancel: false }),
  success: (options: DialogOptions) =>
    showDialog({ ...options, type: 'success', showFooter: true, showCancel: false }),
  warning: (options: DialogOptions) =>
    showDialog({ ...options, type: 'warning', showFooter: true }),
  error: (options: DialogOptions) => showDialog({ ...options, type: 'error', showFooter: true }),
  confirm: (options: DialogOptions) =>
    showDialog({ ...options, type: 'confirm', showFooter: true }),
}
