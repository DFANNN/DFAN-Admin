<!-- 图标按钮组件 -->
<template>
  <el-tooltip
    :content="tooltip"
    :placement="placement"
    :effect="effect"
    :show-after="showAfter"
    :disabled="!tooltip || disabled"
  >
    <div
      class="action-btn"
      :class="{
        'is-disabled': disabled || loading,
        'is-loading': loading,
        [`action-btn--${type}`]: type !== 'default',
      }"
      :style="{ width: size, height: size }"
      @click="handleClick"
    >
      <!-- 如果是独立使用 请替换为自己的图标库  -->
      <el-icon v-if="loading" :style="{ fontSize: iconSize }" class="loading-icon">
        <component :is="loadingIconComponent" />
      </el-icon>
      <el-icon v-else :style="{ fontSize: iconSize }">
        <component :is="iconComponent" />
      </el-icon>
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
const menuStore = useMenuStore()

interface Props {
  // 图标：可以是字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件
  icon: string | Component
  // Tooltip 提示内容（可选，不传则不显示 tooltip）
  tooltip?: string
  //  Tooltip 位置（默认：bottom）
  placement?: 'top' | 'bottom' | 'left' | 'right'
  // Tooltip 主题（默认：dark）
  effect?: 'dark' | 'light'
  // Tooltip 显示延迟时间（默认：200）毫秒
  showAfter?: number
  // 按钮尺寸（默认：2rem / 32px）
  size?: string
  // 图标尺寸（默认：1.5rem）
  iconSize?: string
  // 是否禁用（默认：false）
  disabled?: boolean
  // 按钮类型（默认：default）
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  // 是否加载中（默认：false）
  loading?: boolean
  // 加载图标（可选，默认使用 ArrowPathIcon）
  loadingIcon?: string | Component
}

interface Emits {
  // 点击事件
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom',
  effect: 'dark',
  showAfter: 200,
  size: '2rem',
  iconSize: '1.25rem',
  disabled: false,
  type: 'default',
  loading: false,
  loadingIcon: 'HOutline:ArrowPathIcon',
})

const emits = defineEmits<Emits>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emits('click', event)
}

// 计算图标组件：如果是字符串则从 menuStore.iconComponents 获取，否则直接使用
const iconComponent = computed(() => {
  if (typeof props.icon === 'string') {
    return menuStore.iconComponents[props.icon]
  }
  return props.icon
})

// 计算加载图标组件
const loadingIconComponent = computed(() => {
  if (typeof props.loadingIcon === 'string') {
    return menuStore.iconComponents[props.loadingIcon]
  }
  return props.loadingIcon
})
</script>

<style scoped lang="scss">
/* 操作按钮样式 */
.action-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--el-text-color-primary);
  background: transparent;

  &:hover:not(.is-disabled) {
    background: var(--el-fill-color);
    // color: var(--el-color-primary);
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.6;
    color: var(--el-text-color-disabled);
  }

  &.is-loading {
    cursor: not-allowed;
  }

  .el-icon {
    font-size: 1.5rem;
  }

  .loading-icon {
    animation: rotating 2s linear infinite;
  }

  // 默认类型（已有样式，无需额外样式）

  // Primary 类型
  &.action-btn--primary {
    color: var(--el-color-primary);

    &:hover:not(.is-disabled) {
      background: var(--el-color-primary-light-7);
      color: var(--el-color-primary);
    }
  }

  // Success 类型
  &.action-btn--success {
    color: var(--el-color-success);

    &:hover:not(.is-disabled) {
      background: var(--el-color-success-light-7);
      color: var(--el-color-success);
    }
  }

  // Warning 类型
  &.action-btn--warning {
    color: var(--el-color-warning);

    &:hover:not(.is-disabled) {
      background: var(--el-color-warning-light-7);
      color: var(--el-color-warning);
    }
  }

  // Danger 类型
  &.action-btn--danger {
    color: var(--el-color-danger);

    &:hover:not(.is-disabled) {
      background: var(--el-color-danger-light-7);
      color: var(--el-color-danger);
    }
  }
}

// 旋转动画
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
