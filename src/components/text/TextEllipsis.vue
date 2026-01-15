<template>
  <div class="text-ellipsis-container" :style="{ width: computedWidth }">
    <!-- tooltip 提示 -->
    <el-tooltip
      v-if="tooltipType === 'element'"
      :content="textStr"
      :disabled="!showTooltip"
      :append-to="targetElement"
      v-bind="attrs"
    >
      <template #content>
        <slot name="content">
          <div>{{ textStr }}</div>
        </slot>
      </template>
      <div
        ref="textRef"
        class="text-ellipsis-content"
        :class="{ 'is-expanded': expanded, 'is-clickable': clickable && isEllipsis }"
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
      :class="{ 'is-expanded': expanded, 'is-clickable': clickable && isEllipsis }"
      :style="ellipsisStyle"
      :title="tooltipType === 'native' && showTooltip ? textStr : undefined"
      @click="handleClick"
    >
      {{ textStr }}
    </div>

    <!-- 复制按钮 -->
    <el-tooltip v-if="copyable" content="复制" placement="top">
      <div class="copy-button" @click.stop="handleCopy">
        <el-icon>
          <!-- 复制图标，可更换为自己项目的图标 -->
          <component :is="menuStore.iconComponents['HOutline:ClipboardDocumentIcon']" />
        </el-icon>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

interface IProps {
  // 要展示的文本内容
  text: string | number
  // 展示行数，超过此行数后省略（默认：1）
  line?: number
  // 宽度，超过此宽度后省略（默认：100%），支持字符串（vh, rem, px, 百分比）或数字（默认 px）
  width?: string | number
  // 是否允许点击展开/收起（默认：true）
  clickable?: boolean
  // tooltip 提示类型（默认：'element', 原生：'native', 不显示：'none'）
  tooltipType?: 'element' | 'native' | 'none'
  // 是否显示复制按钮（默认：false）
  copyable?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  text: '',
  line: 1,
  clickable: true,
  tooltipType: 'element',
  width: '100%',
  copyable: false,
})

const attrs = useAttrs()
const menuStore = useMenuStore()

// 使用 VueUse 的复制功能
const { copy } = useClipboard()

// 省略状态
const isEllipsis = ref(false)
// 展开状态
const expanded = ref(false)
// 文本Ref
const textRef = useTemplateRef<HTMLDivElement>('textRef')
// 目标元素
const targetElement = ref('')

// 文本字符串
const textStr = computed(() => {
  return String(props.text)
})

// 宽度计算
const computedWidth = computed(() => {
  // 如果是数字，直接转换为 px
  if (typeof props.width === 'number') {
    return `${props.width}px`
  }
  // 如果是字符串，检查是否为纯数字（不带单位）
  const widthStr = String(props.width).trim()
  // 使用正则判断是否为纯数字（可能包含小数点）
  if (/^\d+(\.\d+)?$/.test(widthStr)) {
    return `${widthStr}px`
  }
  // 如果已经包含单位，直接返回
  return widthStr
})

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
    '-webkit-line-clamp': String(props.line),
    'line-clamp': String(props.line),
  }
})

// 坚持当前文本是否可以省略
const checkEllipsis = async () => {
  await nextTick()
  if (textRef.value) {
    isEllipsis.value = textRef.value.scrollHeight > textRef.value.clientHeight
  }
}

watch(
  () => [props.text, props.line],
  () => {
    checkEllipsis()
  },
  { immediate: true },
)

// 点击事件
const handleClick = () => {
  if (props.clickable && isEllipsis.value) expanded.value = !expanded.value
}

// 复制事件
const handleCopy = async () => {
  try {
    await copy(textStr.value)
    ElMessage.success('复制成功')
  } catch {
    ElMessage.error('复制失败')
  }
}

onMounted(() => {
  targetElement.value = '.text-ellipsis-container'
})
</script>

<style scoped lang="scss">
.text-ellipsis-container {
  position: relative;
  width: 100%;
  .text-ellipsis-content {
    word-break: break-word; // 可以在单词中间换行
    text-overflow: ellipsis; // 超出部分用省略号表示
    display: -webkit-box; // 这是一个旧版的 Flexbox-like 布局，用于支持多行文本截断
    -webkit-box-orient: vertical; // 指定 -webkit-box 的排列方向为纵向（垂直排列）
    //-webkit-line-clamp: 2; // 限制显示 最多 2 行，超出部分会被截断(需要配合 display: -webkit-box 和 -webkit-box-orient: vertical 才生效)
    //line-clamp: 2; // 指定最多显示 2 行文本，超出部分用省略号表示(这是未来标准的多行文本截断属性（部分浏览器支持），效果类似 -webkit-line-clamp)
    overflow: hidden;
    transition: all 0.3s ease;

    &.is-expanded {
      display: block; // 显示所有行
      -webkit-line-clamp: unset; // 取消限制，显示所有行
      line-clamp: unset; // 取消限制，显示所有行
    }

    &.is-clickable {
      cursor: pointer;
      //   user-select: none;  // 禁止用户选择文本

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .copy-button {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
    color: var(--el-text-color-secondary);
    background-color: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 0.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    opacity: 0;
    z-index: 10;

    &:hover {
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
  }

  &:hover .copy-button {
    opacity: 1;
  }
}
</style>
