<template>
  <div>
    <!-- 基础使用 -->
    <div>
      <el-button type="primary" @click="visible = !visible">切换可见性</el-button>
    </div>
    <!-- <AnimateWrapper type="glow" :visible="visible">
      <img src="@/assets/logo.svg" alt="1" width="200" height="200" v-if="visible" />
      <div style="width: 200px; height: 200px; background-color: skyblue" v-if="visible"></div>
    </AnimateWrapper> -->

    <Transition name="flip-3d" :style="{ '--animation-duration': '1s', '--animation-delay': '1s' }">
      <img src="@/assets/logo.svg" alt="1" width="200" height="200" v-if="visible" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'AnimationView' })

const visible = ref(true)
</script>

<style></style>
