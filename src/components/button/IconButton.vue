<!-- 图标按钮组件 -->
<template>
  <el-tooltip
    :content="tooltip"
    :placement="placement"
    :effect="effect"
    :show-after="showAfter"
    :disabled="!tooltip"
  >
    <div class="action-btn" :style="{ width: size, height: size }" @click="handleClick">
      <el-icon :style="{ fontSize: iconSize }">
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
})

const emits = defineEmits<Emits>()

const handleClick = (event: MouseEvent) => {
  emits('click', event)
}

// 计算图标组件：如果是字符串则从 menuStore.iconComponents 获取，否则直接使用
const iconComponent = computed(() => {
  if (typeof props.icon === 'string') {
    return menuStore.iconComponents[props.icon]
  }
  return props.icon
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
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--el-text-color-regular);
  background: transparent;

  &:hover {
    background: var(--el-fill-color-light);
    color: var(--el-color-primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .el-icon {
    font-size: 1.5rem;
  }
}
</style>
