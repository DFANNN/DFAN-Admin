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
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    background-color: #ffffff;
  }

  .el-main {
    background-color: #f5f7fa;
    border-top: 1px solid rgba(0, 0, 0, 0.04);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
  }
}
</style>
