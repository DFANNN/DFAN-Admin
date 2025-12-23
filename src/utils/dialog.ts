import { h, render, isVNode, type Component } from 'vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import { ElIcon } from 'element-plus'
import { useMenuStore } from '@/stores/menu'

const menuStore = useMenuStore()

// 对话框类型
type IDialogType = 'info' | 'success' | 'warning' | 'error' | 'confirm'

// BaseDialog 组件的 props 类型（排除 modelValue，因为这是内部管理的）
interface IDialogProps {
  // 标题
  title?: string
  // 是否全屏展示
  fullscreen?: boolean
  // 是否显示切换全屏按钮
  showFullscreenButton?: boolean
  // 是否显示关闭按钮
  showClose?: boolean
  // 是否显示footer的取消按钮(默认显示)
  showCancelButton?: boolean
  // 是否显示footer的确定按钮(默认显示)
  showConfirmButton?: boolean
  // 是否显示footer
  showFooter?: boolean
  // 取消按钮文本
  cancelText?: string
  // 确定按钮文本
  confirmText?: string
  // 是否可拉伸
  resizable?: boolean
  // 关闭按钮图标（可以是字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件）
  closeIcon?: string | Component
  // 关闭按钮图标尺寸
  closeIconSize?: string
  // 全屏按钮图标（可以是字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件）
  fullscreenIcon?: string | Component
  // 全屏按钮图标尺寸
  fullscreenIconSize?: string
  // 退出全屏按钮图标（可以是字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件）
  exitFullscreenIcon?: string | Component
  // 退出全屏按钮图标尺寸
  exitFullscreenIconSize?: string
  // 是否显示确认按钮加载状态
  showConfirmLoading?: boolean
  // 宽度
  width?: string | number
  // 是否支持移动端适配（默认：true）
  mobileAdaptive?: boolean
  // 移动端对话框宽度（默认：'90%'）
  mobileWidth?: string
  // 移动端断点（默认：992，单位：px）
  mobileBreakpoint?: number
  // 默认插槽的最大高度（默认：60vh,经过我的测试，这个值适配的最好，如果需要更大的高度，可以传入更大的值）如果不设置会导致内容过长对话框超出屏幕
  defaultSlotMaxHeight?: string | number
  // 拖拽功能
  draggable?: boolean
}

// 调用 Dialog.info/success/warning/error 时的参数类型
interface IDialogCallOptions extends IDialogProps {
  // 对话框类型（用于内部处理图标和样式）
  type?: IDialogType
  // 对话框内容（字符串、组件或渲染函数）
  content?: string | Component | (() => unknown)
  // 关闭回调（可选）
  onClose?: () => void
  // 确认回调（可选）
  onConfirm?: () => Promise<void> | void
  // 图标（可以是字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件）
  icon?: string | Component
}

// 默认图标映射
const typeIconMap: Record<IDialogType, { icon: string; color: string }> = {
  info: { icon: 'HSolid:InformationCircleIcon', color: 'var(--el-color-primary)' },
  success: { icon: 'HSolid:CheckCircleIcon', color: '#52c41a' },
  warning: { icon: 'HSolid:ExclamationTriangleIcon', color: '#faad14' },
  error: { icon: 'HSolid:XCircleIcon', color: '#ff4d4f' },
  confirm: { icon: 'HSolid:QuestionMarkCircleIcon', color: 'var(--el-color-primary)' },
}

// 创建对话框
const createDialog = (options: IDialogCallOptions) => {
  // 1. 创建挂载容器
  const container = document.createElement('div')

  // 2. 销毁函数(动画时间400ms)
  const destroy = () => {
    setTimeout(() => {
      // 销毁虚拟节点
      render(null, container)
      // 移除容器
      container.remove()
    }, 400)
  }

  // 3. 更新虚拟节点(数据变化时更新)
  const updateVNode = (value: boolean) => {
    render(h(BaseDialog, { ...props, modelValue: value }), container)
  }

  // 4. 构造组件属性
  const props = {
    ...options,
    modelValue: true,
    // 监听模型值变化事件
    // 'onUpdate:modelValue': (value: boolean) => {
    //   if (!value) {
    //     updateVNode(value)
    //     destroy()
    //   }
    // },
    onClose: () => {
      options.onClose?.()
      updateVNode(false)
      destroy()
    },
    onConfirm: async () => {
      await options.onConfirm?.()
      updateVNode(false)
      destroy()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any

  // 5. 创建插槽
  const slots: Record<string, () => unknown> = {}

  if (options.type) {
    const config = typeIconMap[options.type]

    const IconComponent = menuStore.iconComponents[config.icon] as Component

    const renderContent = (content: unknown) => {
      if (isVNode(content)) return content
      if (typeof content === 'string') return content
      if (typeof content === 'function') return content()
      return String(content ?? '')
    }

    slots.default = () =>
      h('div', { style: `display: flex;align-items: center;gap: 0.75rem;min-height: 2.5rem` }, [
        h(
          ElIcon,
          { size: '1.5rem', style: `color: ${config.color}` },
          {
            default: () => {
              if (typeof options.icon === 'string') {
                return h(menuStore.iconComponents[options.icon] as Component)
              }
              if (options.icon && typeof options.icon !== 'string') {
                return h(options.icon as Component)
              }
              return h(IconComponent)
            },
          },
        ),
        h('div', renderContent(options.content)),
      ])
  }

  // 6. 创建虚拟节点
  const vNode = h(BaseDialog, props, slots)

  // 7. 渲染虚拟节点
  render(vNode, container)

  // 8. 挂载容器
  document.body.appendChild(container)
}

// 封装快捷调用
export const Dialog = {
  info: (options: IDialogCallOptions) => {
    return createDialog({
      title: '系统提示',
      confirmText: '知道了',
      width: '400px',
      showFullscreenButton: false,
      showClose: false,
      mobileAdaptive: false,
      resizable: false,
      showCancelButton: false,
      ...options,
      type: 'info',
    })
  },
  success: (options: IDialogCallOptions) => {
    return createDialog({
      title: '成功',
      confirmText: '知道了',
      width: '400px',
      showFullscreenButton: false,
      showClose: false,
      mobileAdaptive: false,
      resizable: false,
      showCancelButton: false,
      ...options,
      type: 'success',
    })
  },
  warning: (options: IDialogCallOptions) => {
    return createDialog({
      title: '警告',
      confirmText: '知道了',
      width: '400px',
      showFullscreenButton: false,
      showClose: false,
      mobileAdaptive: false,
      resizable: false,
      showCancelButton: false,
      ...options,
      type: 'warning',
    })
  },
  error: (options: IDialogCallOptions) => {
    return createDialog({
      title: '错误',
      confirmText: '知道了',
      width: '400px',
      showFullscreenButton: false,
      showClose: false,
      mobileAdaptive: false,
      resizable: false,
      showCancelButton: false,
      ...options,
      type: 'error',
    })
  },
  confirm: (options: IDialogCallOptions) => {
    return createDialog({
      title: '确认',
      width: '400px',
      showFullscreenButton: false,
      showClose: false,
      mobileAdaptive: false,
      resizable: false,
      ...options,
      type: 'confirm',
    })
  },
}
