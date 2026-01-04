<template>
  <div>
    <!-- 基础使用 -->
    <div>
      <el-button type="primary" @click="visible = !visible">切换可见性</el-button>
    </div>
    <AnimateWrapper type="flip-3d" :visible="visible">
      <img src="@/assets/logo.svg" alt="1" width="200" height="200" v-if="visible" />
    </AnimateWrapper>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'AnimationView' })

const visible = ref(true)
</script>

<style></style>
