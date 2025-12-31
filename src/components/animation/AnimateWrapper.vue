<template>
  <Transition :name="transitionName" :css="true">
    <slot />
  </Transition>
</template>

<script setup lang="ts">
// 动画类型定义
type AnimationType =
  // Fade 系列
  | 'fade'
  | 'fadeUp'
  | 'fadeDown'
  | 'fadeLeft'
  | 'fadeRight'
  // Slide 系列
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  // Zoom 系列
  | 'zoom'
  | 'zoomUp'
  | 'zoomDown'
  | 'zoomLeft'
  | 'zoomRight'
  // Bounce 系列
  | 'bounce'
  | 'bounceUp'
  | 'bounceDown'
  | 'bounceLeft'
  | 'bounceRight'
  // Scale 系列
  | 'scale'
  | 'scaleUp'
  | 'scaleDown'
  // Rotate 系列
  | 'rotate'
  | 'rotateLeft'
  | 'rotateRight'
  // Flip 系列
  | 'flipX'
  | 'flipY'
  // Elastic 系列
  | 'elasticUp'
  | 'elasticDown'
  | 'elasticLeft'
  | 'elasticRight'
  // Special
  | 'pulse'
  | 'shake'
  | 'swing'

interface IProps {
  /** 动画名称 */
  name: AnimationType
  /** 离开时的动画名称，不传则自动匹配 */
  leaveName?: AnimationType
  /** 动画持续时间（毫秒） */
  duration?: number
  /** 动画延迟时间（毫秒） */
  delay?: number
  /** 缓动函数 */
  easing?: string
}

const props = withDefaults(defineProps<IProps>(), {
  duration: 300,
  delay: 0,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
})

// 自动匹配离开动画
const getLeaveName = (enterName: AnimationType): AnimationType => {
  if (props.leaveName) return props.leaveName

  // 自动匹配规则
  const name = enterName as string
  if (name.includes('Up')) return name.replace('Up', 'Down') as AnimationType
  if (name.includes('Down')) return name.replace('Down', 'Up') as AnimationType
  if (name.includes('Left')) return name.replace('Left', 'Right') as AnimationType
  if (name.includes('Right')) return name.replace('Right', 'Left') as AnimationType
  if (name === 'zoom' || name === 'scale') return name as AnimationType
  if (name === 'fade') return 'fade' as AnimationType
  // 默认淡出
  return 'fade'
}

// 生成 transition name（包含配置信息）
const transitionName = computed(() => {
  const baseName = props.name
  const duration = props.duration
  const delay = props.delay
  const easing = props.easing.replace(/[()]/g, '').replace(/\s+/g, '-')

  // 使用 CSS 变量传递配置
  return `${baseName}-transition`
})

// 动态样式
const transitionStyle = computed(() => {
  return {
    '--transition-duration': `${props.duration}ms`,
    '--transition-delay': `${props.delay}ms`,
    '--transition-easing': props.easing,
  }
})
</script>

<style scoped>
/* 通过 CSS 变量传递配置 */
:deep(*) {
  --transition-duration: v-bind('props.duration + "ms"');
  --transition-delay: v-bind('props.delay + "ms"');
  --transition-easing: v-bind('props.easing');
}
</style>
