<template>
  <div class="text-ellipsis-wrapper" :style="{ maxWidth: computedMaxWidth }">
    <!-- Element Plus Tooltip -->
    <el-tooltip
      v-if="tooltipType === 'element'"
      :content="textStr"
      :placement="tooltipPlacement"
      :disabled="!showTooltip"
    >
      <div
        ref="textRef"
        class="text-ellipsis-content"
        :class="{
          'is-ellipsis': isEllipsis && !expanded,
          'is-expanded': expanded,
          'is-clickable': clickable && isEllipsis,
        }"
        :style="ellipsisStyle"
        @click="handleClick"
      >
        {{ textStr }}
      </div>
    </el-tooltip>

    <!-- Native Title -->
    <div
      v-else
      ref="textRef"
      class="text-ellipsis-content"
      :class="{
        'is-ellipsis': isEllipsis && !expanded,
        'is-expanded': expanded,
        'is-clickable': clickable && isEllipsis,
      }"
      :style="ellipsisStyle"
      :title="tooltipType === 'native' && showTooltip ? textStr : undefined"
      @click="handleClick"
    >
      {{ textStr }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  // 要展示的文本内容
  text: string | number
  // 最大宽度，支持字符串（vh, rem, px, 百分比）或数字（默认 px）
  maxWidth?: string | number
  // 展示行数，超过此行数后省略（默认：1）
  lineClamp?: number
  // 是否允许点击展开/收起（默认：false）
  clickable?: boolean
  // tooltip 提示类型（默认：'element'）
  tooltipType?: 'element' | 'native' | 'none'
  // tooltip 位置（默认：'top'），仅在 tooltipType 为 'element' 时生效
  tooltipPlacement?: string
}

const props = withDefaults(defineProps<IProps>(), {
  text: '',
  maxWidth: undefined,
  lineClamp: 1,
  clickable: false,
  tooltipType: 'element',
  tooltipPlacement: 'top',
})

// 文本字符串
const textStr = computed(() => {
  return String(props.text)
})

// 宽度计算
const computedMaxWidth = computed(() => {
  if (props.maxWidth === undefined) {
    return '100%'
  }
  if (typeof props.maxWidth === 'number') {
    return `${props.maxWidth}px`
  }
  return props.maxWidth
})

// DOM 引用
const textRef = ref<HTMLElement>()

// 省略状态
const isEllipsis = ref(false)
// 展开状态
const expanded = ref(false)

// 是否显示 tooltip
const showTooltip = computed(() => {
  return props.tooltipType !== 'none' && isEllipsis.value && !expanded.value
})

// 省略样式
const ellipsisStyle = computed(() => {
  if (expanded.value) {
    return {}
  }
  return {
    '-webkit-line-clamp': String(props.lineClamp),
    'line-clamp': String(props.lineClamp),
  }
})

// 检测是否省略
const checkEllipsis = () => {
  nextTick(() => {
    if (textRef.value) {
      isEllipsis.value = textRef.value.scrollHeight > textRef.value.clientHeight
    }
  })
}

// 点击事件
const handleClick = () => {
  if (props.clickable && isEllipsis.value) {
    expanded.value = !expanded.value
  }
}

// 监听文本和宽度变化
watch(
  () => [props.text, props.maxWidth, props.lineClamp],
  () => {
    expanded.value = false
    checkEllipsis()
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.text-ellipsis-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.text-ellipsis-content {
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  transition: all 0.3s ease;

  &.is-clickable {
    cursor: pointer;
    user-select: none;

    &:hover {
      opacity: 0.8;
    }
  }

  &.is-expanded {
    display: block;
    -webkit-line-clamp: unset;
    line-clamp: unset;
  }
}
</style>
