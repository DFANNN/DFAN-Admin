import { h, render } from 'vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import { ElIcon } from 'element-plus'
import { useMenuStore } from '@/stores/menu'

const menuStore = useMenuStore()

// 参数类型
interface IDialogOption {
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm'
  title?: string
  width?: string | number
  confirmText?: string
  content?: string | Component | (() => unknown)
  showClose?: boolean
  showFullscreenButton?: boolean
  mobileAdaptive?: boolean
  resizable?: boolean
  showCancelButton?: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
}

// 默认图标映射
const typeIconMap = {
  info: { icon: 'HSolid:InformationCircleIcon', color: 'var(--el-color-primary)' },
  success: { icon: 'HSolid:CheckCircleIcon', color: '#52c41a' },
  warning: { icon: 'HSolid:ExclamationTriangleIcon', color: '#faad14' },
  error: { icon: 'HSolid:XCircleIcon', color: '#ff4d4f' },
  confirm: { icon: 'HOutline:QuestionMarkCircleIcon', color: '#faad14' },
}

// 创建对话框
const createDialog = (options: IDialogOption) => {
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
      options.onClose()
      updateVNode(false)
      destroy()
    },
    onConfirm: async () => {
      await options.onConfirm()
      updateVNode(false)
      destroy()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any

  const slots: Record<string, () => unknown> = {}

  if (options.type) {
    const config = typeIconMap[options.type]

    const IconComponent = menuStore.iconComponents[config.icon] as Component

    slots.default = () =>
      h('div', { style: `display: flex;align-items: center;gap: 0.75rem;min-height: 2.5rem` }, [
        h(
          ElIcon,
          { size: '1.5rem', style: `color: ${config.color}` },
          {
            default: () => h(IconComponent),
          },
        ),
        h('div', props.content as string),
      ])
  }

  // 5. 创建虚拟节点
  const vNode = h(BaseDialog, props, slots)

  // 6. 渲染虚拟节点
  render(vNode, container)

  // 7. 挂载容器
  document.body.appendChild(container)
}

// 封装快捷调用
export const Dialog = {
  info: (options: IDialogOption) => {
    return createDialog({
      title: '系统提示',
      confirmText: '知道了',
      ...options,
      width: '400px',
      showFullscreenButton: false,
      showClose: false,
      mobileAdaptive: false,
      resizable: false,
      showCancelButton: false,
      type: 'info',
    })
  },
  success: (options: IDialogOption) => {
    return createDialog({
      title: '成功',
      confirmText: '知道了',
      ...options,
      width: '400px',
      showFullscreenButton: false,
      showClose: false,
      mobileAdaptive: false,
      resizable: false,
      showCancelButton: false,
      type: 'success',
    })
  },
  warning: (options: IDialogOption) => {
    return createDialog({
      title: '警告',
      confirmText: '知道了',
      ...options,
      width: '400px',
      showFullscreenButton: false,
      showClose: false,
      mobileAdaptive: false,
      resizable: false,
      showCancelButton: false,
      type: 'warning',
    })
  },
  error: (options: IDialogOption) => {
    return createDialog({
      title: '错误',
      confirmText: '知道了',
      ...options,
      width: '400px',
      showFullscreenButton: false,
      showClose: false,
      mobileAdaptive: false,
      resizable: false,
      showCancelButton: false,
      type: 'error',
    })
  },
}
