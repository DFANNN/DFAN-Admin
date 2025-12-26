<template>
  <div class="text-ellipsis-container">
    <!-- tooltip 提示 -->
    <el-tooltip :content="props.text" :disabled="!isEllipsis" v-if="tooltipType === 'element'">
      <div
        ref="textRef"
        class="text-ellipsis-content"
        :class="{ 'is-expanded': !isEllipsis, 'is-clickable': clickable && isEllipsis }"
        :style="ellipsisStyle"
        @click="handleClick"
      >
        {{ text }}
      </div>
    </el-tooltip>

    <!-- Native Title -->
    <div
      v-else
      ref="textRef"
      class="text-ellipsis-content"
      :class="{ 'is-expanded': !isEllipsis, 'is-clickable': clickable }"
      :style="ellipsisStyle"
      :title="tooltipType === 'native' && isEllipsis ? text : undefined"
      @click="handleClick"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  // 要展示的文本内容
  text: string
  // 展示行数，超过此行数后省略（默认：1）
  line?: number
  // 是否允许点击展开/收起（默认：false）
  clickable?: boolean
  // tooltip 提示类型（默认：'element', 原生：'native', 不显示：'none'）
  tooltipType?: 'element' | 'native' | 'none'
}

const props = withDefaults(defineProps<IProps>(), {
  text: '',
  line: 1,
  clickable: true,
  tooltipType: 'element',
})

// 省略状态
const isEllipsis = ref(true)
const textRef = useTemplateRef<HTMLDivElement>('textRef')

// 省略样式
const ellipsisStyle = computed(() => {
  return {
    '-webkit-line-clamp': String(props.line),
    'line-clamp': String(props.line),
  }
})

// 坚持当前文本是否可以省略
const checkEllipsis = async () => {
  await nextTick()
  if (textRef.value) {
    console.log(`output->textRef.value.scrollHeight`, textRef.value.scrollHeight)
    console.log(`output->textRef.value.clientHeight`, textRef.value.clientHeight)
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
  if (props.clickable) isEllipsis.value = !isEllipsis.value
}
</script>

<style scoped lang="scss">
.text-ellipsis-container {
  position: relative;
  display: inline-block;
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
}
</style>
