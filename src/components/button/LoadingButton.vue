<template>
  <el-button :loading="loading" @click="handleClick" v-bind="buttonAttrs">
    <!-- 动态渲染el-button支持的插槽，传递loading状态给外部插槽使用 -->
    <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
      <slot :name="name" :loading="loading" v-bind="slotProps || {}"> </slot>
    </template>
  </el-button>
</template>

<script setup lang="ts">
// 禁用自动属性继承，手动控制属性透传
defineOptions({
  inheritAttrs: false,
})

interface IProps {
  loadingDelay?: number
}

const props = withDefaults(defineProps<IProps>(), {
  loadingDelay: 0,
})

// 读取到所有属性
const attrs = useAttrs()

/**
 * 获取按钮属性，去除onClick事件
 * 不然会触发两次点击事件
 */
const buttonAttrs = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onClick, ...args } = attrs
  return args
})

/**
 * 点击事件(自带加载状态)
 * 利用attrs拿到onClick事件，并执行
 * 不能用emit，因为emit是组件内部事件，并且不是同步执行的
 */
const handleClick = async (event: MouseEvent) => {
  let loadingTimer: ReturnType<typeof setTimeout> | null = null
  let hasShownLoading = false

  // 延迟显示 loading
  loadingTimer = setTimeout(() => {
    loading.value = true
    hasShownLoading = true
  }, props.loadingDelay)

  try {
    const onClick = attrs.onClick as ((event: MouseEvent) => Promise<void> | void) | undefined
    await onClick?.(event)
  } finally {
    // 清除定时器（如果接口在延迟时间内返回，定时器还未触发）
    if (loadingTimer) {
      clearTimeout(loadingTimer)
    }
    // 如果已经显示了 loading，则隐藏它
    if (hasShownLoading) {
      loading.value = false
    }
  }
}

const loading = ref(false)
</script>

<style></style>
