<template>
  <div ref="lottieRef" :style="style"></div>
</template>

<script setup lang="ts">
import Lottie, { type AnimationItem } from 'lottie-web'

interface IProps {
  // lottie 文件(json 文件)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animationData: any
  // 宽度
  width: string | number
  // 高度
  height: string | number
  // 是否自动播放
  autoplay?: boolean
  // 是否循环
  loop?: boolean
  // 渲染器 渲染器是用来渲染动画的，比如 svg、canvas、html
  renderer?: 'svg' | 'canvas' | 'html'
}

const props = withDefaults(defineProps<IProps>(), {
  autoplay: true,
  loop: true,
  renderer: 'svg',
})

// lottie 容器
const lottieRef = useTemplateRef<HTMLDivElement>('lottieRef')

// 动画实例
const animation = ref<AnimationItem | null>(null)

// 计算样式
const style = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

// 初始化动画
onMounted(() => {
  animation.value = Lottie.loadAnimation({
    container: lottieRef.value!,
    renderer: props.renderer,
    loop: props.loop,
    autoplay: props.autoplay,
    animationData: props.animationData,
  })
})

// 销毁动画
onUnmounted(() => {
  animation.value?.destroy()
})

// 暴露动画实例
defineExpose({
  // 播放动画
  play: () => animation.value?.play(),
  // 停止动画
  stop: () => animation.value?.stop(),
  // 暂停动画
  pause: () => animation.value?.pause(),
})
</script>

<style></style>
