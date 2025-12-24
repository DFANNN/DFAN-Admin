<template>
  <el-dialog
    :model-value="modelValue"
    :width="computedWidth"
    :show-close="false"
    :fullscreen="fullscreenValue"
    :draggable="draggable"
    class="base-dialog"
    :class="{ 'is-resizable': resizable }"
    v-bind="attrs"
    @update:model-value="handleDialogUpdate"
  >
    <template #header>
      <div class="base-dialog-header">
        <div class="base-dialog-header-title">
          <slot name="header">
            {{ title }}
          </slot>
        </div>
        <div class="base-dialog-header-buttons">
          <template v-if="showFullscreenButton">
            <IconButton
              :icon="fullscreenIcon"
              :iconSize="fullscreenIconSize"
              @click="fullscreenValue = true"
              v-if="!fullscreenValue"
            />
            <IconButton
              :icon="exitFullscreenIcon"
              :iconSize="exitFullscreenIconSize"
              @click="fullscreenValue = false"
              v-else
            />
          </template>
          <IconButton :icon="closeIcon" :iconSize="closeIconSize" @click="close" v-if="showClose" />
        </div>
      </div>
    </template>

    <el-scrollbar :max-height="computedDefaultSlotMaxHeight" v-if="useScrollbar">
      <slot> </slot>
    </el-scrollbar>
    <div v-else>
      <slot> </slot>
    </div>

    <template #footer>
      <slot name="footer">
        <template v-if="showFooter">
          <el-button @click="close" v-if="showCancelButton">{{ cancelText }}</el-button>
          <el-button
            type="primary"
            :loading="showConfirmLoading ? confirmLoading : false"
            @click="confirm"
            v-if="showConfirmButton"
            >{{ confirmText }}</el-button
          >
        </template>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { useWindowSize } from '@vueuse/core'
import IconButton from '@/components/button/IconButton.vue'

// 禁用自动属性继承，手动控制属性透传
defineOptions({
  inheritAttrs: false,
})

// 组件属性类型
interface IProps {
  // 是否打开
  modelValue: boolean
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
  mobileWidth?: string | number
  // 移动端断点（默认：992，单位：px）
  mobileBreakpoint?: number
  // 默认插槽的最大高度（默认：60vh,经过我的测试，这个值适配的最好，如果需要更大的高度，可以传入更大的值）如果不设置会导致内容过长对话框超出屏幕
  defaultSlotMaxHeight?: string | number
  // 拖拽功能
  draggable?: boolean
  // 是否使用el-scrollbar包裹内容
  useScrollbar?: boolean
}

// 组件事件类型
interface IEmits {
  // 更新模型值
  (e: 'update:modelValue', value: boolean): void
  // 关闭按钮点击事件
  (e: 'close'): void
  // 确定按钮点击事件
  //   (e: 'confirm'): void
}

const props = withDefaults(defineProps<IProps>(), {
  fullscreen: false,
  showFullscreenButton: true,
  showClose: true,
  showFooter: true,
  cancelText: '取消',
  confirmText: '确定',
  resizable: true,
  closeIcon: 'HOutline:XMarkIcon',
  closeIconSize: '1.5rem',
  fullscreenIcon: 'HOutline:ArrowsPointingOutIcon',
  fullscreenIconSize: '1.25rem',
  exitFullscreenIcon: 'HOutline:ArrowsPointingInIcon',
  exitFullscreenIconSize: '1.25rem',
  showConfirmLoading: true,
  mobileAdaptive: true,
  mobileWidth: '90%',
  mobileBreakpoint: 992,
  defaultSlotMaxHeight: '60vh',
  draggable: true,
  showCancelButton: true,
  showConfirmButton: true,
  useScrollbar: true,
})

const emits = defineEmits<IEmits>()

// 组件属性（未被props和emits定义的属性）
const attrs = useAttrs()
// 确定按钮加载状态
const confirmLoading = ref(false)
// 内部维护全屏状态
const fullscreenValue = ref(false)

watchEffect(() => {
  fullscreenValue.value = props.fullscreen ?? false
})

// 计算默认插槽的最大高度
const computedDefaultSlotMaxHeight = computed(() => {
  if (fullscreenValue.value) return '100%'
  return props.defaultSlotMaxHeight
})

// 响应式监听窗口宽度
const { width: windowWidth } = useWindowSize()
// 是否为移动端
const isMobile = computed(() => windowWidth.value < props.mobileBreakpoint)

// 计算宽度
const computedWidth = computed(() => {
  if (props.mobileAdaptive && isMobile.value) {
    return props.mobileWidth
  }
  return props.width
})

// 获取 before-close 函数（从 attrs 中获取，支持 kebab-case 和 camelCase）
// 注意：before-close 会通过 attrs 传递给 el-dialog，让 el-dialog 处理 ESC 和点击遮罩层的情况
const beforeClose = computed(() => {
  return (attrs.beforeClose || attrs['before-close']) as ((done: () => void) => void) | undefined
})

// 处理关闭逻辑，支持 before-close
// 用于自定义关闭按钮（header 中的 X 按钮和 footer 中的取消按钮）
const close = () => {
  const doClose = () => {
    emits('update:modelValue', false)
    emits('close')
  }

  // 如果存在 before-close 函数，则调用它
  if (beforeClose.value) {
    beforeClose.value(doClose)
  } else {
    // 否则直接关闭
    doClose()
  }
}

// 处理对话框更新事件(用于监听esc和点击遮罩层关闭)
// 注意：当 el-dialog 通过 ESC 或点击遮罩层关闭时，如果存在 before-close，
// el-dialog 会先调用 before-close，只有 before-close 调用 done() 后才会触发此事件
const handleDialogUpdate = (value: boolean) => {
  // 如果值没有变化，不处理（防止重复触发）
  if (props.modelValue === value) return
  // 更新值到外部
  emits('update:modelValue', value)
  // 当对话框关闭时，也触发外部 close 事件
  if (!value) emits('close')
}

/**
 * 确定按钮点击事件(自带加载状态)
 * 利用attrs拿到onConfirm事件，并执行
 * 不能用emit，因为emit是组件内部事件，并且不是同步执行的
 */
const confirm = async () => {
  // 只有当 showConfirmLoading 不为 false 时才显示 loading
  if (props.showConfirmLoading) confirmLoading.value = true
  try {
    const onConfirm = attrs.onConfirm as (() => Promise<void>) | undefined
    if (onConfirm) await onConfirm()
  } finally {
    if (props.showConfirmLoading) confirmLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.base-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;

  .base-dialog-header-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--el-text-color-primary);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .base-dialog-header-buttons {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 16px;
    flex-shrink: 0;
  }
}
</style>

<style>
.base-dialog {
  min-height: 10rem;
  min-width: 20rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .el-dialog__body {
    flex: 1;
    min-height: 0;
  }
  .el-dialog__footer {
    flex-shrink: 0;
  }
}

/* 开启拖拽调整大小 */
.base-dialog.is-resizable {
  resize: both;
}

.base-dialog.is-fullscreen {
  resize: none;
  width: 100vw !important;
  height: 100vh !important;
}
</style>
