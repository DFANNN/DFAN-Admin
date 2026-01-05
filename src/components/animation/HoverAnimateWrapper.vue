<template>
  <div>
    <Motion
      :key="motionKey"
      :is="tag"
      :initial="initial"
      :hovered="hoverConfig"
      :transition="transitionConfig"
      v-bind="$attrs"
      class="animate-hover-wrapper"
    >
      <slot />
    </Motion>
  </div>
</template>

<script setup lang="ts">
import type { Variant } from '@vueuse/motion'

// 定义 hover 动画名称类型
export type HoverAnimationName =
  // 基础动画
  | 'scale'
  | 'lift'
  | 'tilt'
  | 'rotate'
  | 'flip'
  // 弹性动画
  | 'jelly'
  | 'bounce'
  | 'rubber'
  | 'elastic'
  // 动感动画
  | 'pulse'
  | 'shake'
  | 'wobble'
  | 'swing'
  | 'bell'
  | 'magnet'
  | 'squeeze'
  | 'float'

// Props 定义
interface Props {
  name?: HoverAnimationName
  tag?: string
  duration?: number
  intensity?: 'light' | 'normal' | 'strong'
}

const props = withDefaults(defineProps<Props>(), {
  name: 'scale',
  tag: 'div',
  duration: 300,
  intensity: 'normal',
})

// 强度系数
const intensityMap = {
  light: 0.7,
  normal: 1,
  strong: 1.3,
}

const intensityValue = computed(() => intensityMap[props.intensity])

// 初始状态
const initial = {
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  x: 0,
  y: 0,
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  filter: 'blur(0px)',
  boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
}

// Hover 动画预设库（使用 computed 支持响应式）
const hoverPresets = computed<Record<HoverAnimationName, Variant>>(() => {
  const intensity = intensityValue.value
  const duration = props.duration

  return {
    // ========== 基础动画 ==========
    // 缩放效果 - 纯缩放，中心放大
    scale: {
      scale: 1.15 * intensity,
      transition: {
        duration,
        ease: 'easeOut',
      },
    },

    // 抬起效果 - 强调向上抬起，明显的阴影和位移
    lift: {
      y: -12 * intensity,
      scale: 1.08 * intensity,
      transition: {
        duration,
        ease: 'easeOut',
      },
    },

    // 倾斜效果 - 3D 透视倾斜，增强倾斜角度和缩放效果
    tilt: {
      rotateX: 20 * intensity,
      rotateY: 20 * intensity,
      scale: 1.1 * intensity,
      perspective: 1000,
      transition: {
        duration,
        ease: 'easeOut',
      },
    },

    // 旋转效果 - 平面旋转，旋转 180 度半圈
    rotate: {
      rotate: 180 * intensity,
      transition: {
        duration,
        ease: 'easeOut',
      },
    },

    // 翻转效果 - Y 轴翻转
    flip: {
      rotateY: 180 * intensity,
      transition: {
        duration: duration * 1.5,
        ease: 'easeInOut',
      },
    },

    // ========== 弹性动画 ==========
    // 果冻效果 - X/Y 轴不同步缩放，产生果冻感
    jelly: {
      scaleX: [1, 1.15 * intensity, 0.95, 1.05, 1],
      scaleY: [1, 0.85 * intensity, 1.05, 0.95, 1],
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 15,
      },
    },

    // 弹跳效果 - 上下弹跳
    bounce: {
      y: [0, -8 * intensity, 0],
      scale: [1, 1.05 * intensity, 1],
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 10,
      },
    },

    // 橡胶效果 - 橡胶拉伸感，X/Y 轴不同步缩放，模拟橡胶的拉伸和回弹
    rubber: {
      scaleX: [1, 1.3 * intensity, 0.8, 1.2 * intensity, 0.9, 1.1 * intensity, 1],
      scaleY: [1, 0.7 * intensity, 1.3 * intensity, 0.85, 1.15 * intensity, 0.95, 1],
      transition: {
        type: 'spring',
        stiffness: 250,
        damping: 15,
        mass: 1.2,
      },
    },

    // 弹性效果 - 快速弹性回弹，类似弹簧的快速振动
    elastic: {
      scale: [
        1,
        1.25 * intensity,
        0.85,
        1.15 * intensity,
        0.9,
        1.05 * intensity,
        0.95,
        1.02 * intensity,
        1,
      ],
      rotate: [0, -2 * intensity, 2 * intensity, -1 * intensity, 1 * intensity, 0],
      transition: {
        type: 'spring',
        stiffness: 700,
        damping: 20,
        mass: 0.8,
      },
    },

    // ========== 动感动画 ==========
    // 脉冲效果 - 呼吸式缩放
    pulse: {
      scale: [1, 1.1 * intensity, 1],
      transition: {
        duration: duration * 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },

    // 震动效果 - 左右震动
    shake: {
      x: [0, -4 * intensity, 4 * intensity, -4 * intensity, 4 * intensity, 0],
      transition: {
        duration: duration * 0.6,
        ease: 'easeInOut',
      },
    },

    // 摆动效果 - 多方向摆动
    wobble: {
      x: [0, -5 * intensity, 5 * intensity, -3 * intensity, 3 * intensity, 0],
      rotate: [0, -3 * intensity, 3 * intensity, -2 * intensity, 2 * intensity, 0],
      transition: {
        duration: duration * 0.8,
        ease: 'easeInOut',
      },
    },

    // 摇摆效果 - 旋转摇摆
    swing: {
      rotate: [0, 8 * intensity, -8 * intensity, 8 * intensity, -4 * intensity, 0],
      transition: {
        duration: duration * 1.2,
        ease: 'easeInOut',
      },
    },

    // 摇铃效果 - 顶部固定，底部左右摆动，像摇动铃铛一样
    bell: {
      rotate: [
        0,
        20 * intensity,
        -20 * intensity,
        15 * intensity,
        -15 * intensity,
        10 * intensity,
        -10 * intensity,
        5 * intensity,
        -5 * intensity,
        0,
      ],
      transformOrigin: 'top center',
      transition: {
        duration: duration * 1.5,
        ease: 'easeInOut',
      },
    },

    // 磁吸效果 - 向鼠标方向移动
    magnet: {
      scale: 1.08 * intensity,
      x: [0, 5 * intensity, -5 * intensity, 0],
      y: [0, 5 * intensity, -5 * intensity, 0],
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },

    // 挤压效果 - 横向挤压
    squeeze: {
      scaleX: [1, 0.85 * intensity, 1.15 * intensity, 1],
      scaleY: [1, 1.15 * intensity, 0.85 * intensity, 1],
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 15,
      },
    },

    // 漂浮效果 - 上下缓慢浮动，轻盈感
    float: {
      y: [0, -15 * intensity, 0],
      transition: {
        duration: duration * 2,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  }
})

// 计算 hover 配置
const hoverConfig = computed(() => {
  const preset = hoverPresets.value[props.name]
  if (!preset) {
    console.warn(`Hover 动画 "${props.name}" 不存在，使用默认 scale 动画`)
    return hoverPresets.value.scale
  }
  return preset
})

// 计算 transition 配置
const transitionConfig = computed(() => {
  const config = hoverConfig.value.transition
  if (config && typeof config === 'object' && 'duration' in config) {
    return {
      ...config,
      duration: config.duration || props.duration,
    }
  }
  return {
    duration: props.duration,
    ease: 'easeOut',
  }
})

// 生成 Motion 组件的 key，当 props 变化时强制重新渲染
const motionKey = computed(() => {
  return `${props.name}-${props.duration}-${props.intensity}-${props.tag}`
})
</script>

<style scoped>
.animate-hover-wrapper {
  display: inline-block;
  will-change: transform;
  cursor: pointer;
}
</style>
