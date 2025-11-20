<template>
  <div>
    <el-container class="top-mode-container">
      <el-header class="header">
        <HeaderView />
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import HeaderView from '@/layouts/header.vue'

defineOptions({ name: 'TopMode' })
</script>

<style scoped lang="scss">
.top-mode-container {
  width: 100%;
  height: 100%;

  .header {
    height: 50px;
    background: var(--el-bg-color);
  }

  .el-main {
    background: var(--el-bg-color-page);
  }
}
</style>
