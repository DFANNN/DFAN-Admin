<!-- 基础标签组件  组要是修改了标签的一些样式  继承el-tags所有api -->
<template>
  <el-tag>
    <slot>
      {{ text }}
    </slot>
  </el-tag>
</template>

<script setup lang="ts">
interface IProps {
  text?: string // 标签内容
}

defineProps<IProps>()
</script>

<style scoped lang="scss">
.el-tag {
  padding: 0.25rem 0.5rem;
  font-weight: 700;
  --el-tag-border-radius: 6px;
  --el-tag-border-color: transparent;
}
</style>
