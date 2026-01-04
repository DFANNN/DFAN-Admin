<template>
  <Transition
    :name="type"
    :mode="mode === 'default' ? undefined : mode"
    :css="true"
    :style="animationStyle"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
// 动画类型定义
export type AnimationType =
  | 'fade-slide'
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom'
  | 'scale'
  | 'rotate'
  | 'bounce'
  | 'flip-3d'
  | 'rotate-3d'
  | 'blur-fade'
  | 'elastic'
  | 'glow'

// 组件 Props 接口
interface Props {
  /** 动画类型 */
  type?: AnimationType
  /** 动画时长（秒） */
  duration?: number
  /** 动画延迟（秒） */
  delay?: number
  /** 缓动函数 */
  easing?: string
  /** 过渡模式 */
  mode?: 'out-in' | 'in-out' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'fade-slide',
  duration: 0.3,
  delay: 0,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  mode: 'default',
})

// 计算样式对象，用于动态设置动画参数
const animationStyle = computed(() => {
  return {
    '--animation-duration': `${props.duration}s`,
    '--animation-delay': `${props.delay}s`,
    '--animation-easing': props.easing,
  }
})
</script>

<style scoped>
/* 动态动画参数通过 CSS 变量传递到全局样式 */
</style>
