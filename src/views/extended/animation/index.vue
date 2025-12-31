<template>
  <!-- 基础使用 -->
  <el-button @click="visible = !visible">切换可见性</el-button>
  <AnimateWrapper name="slideUp">
    <div v-if="visible">内容</div>
  </AnimateWrapper>

  <!-- 自定义离开动画 -->
  <el-button @click="show = !show">切换显示</el-button>
  <AnimateWrapper name="slideUp">
    <div v-if="show">弹跳效果</div>
  </AnimateWrapper>
</template>

<script setup lang="ts">
defineOptions({ name: 'AnimationView' })

const visible = ref(true)
const show = ref(true)
</script>

<style></style>
