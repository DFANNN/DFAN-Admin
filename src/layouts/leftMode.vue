<template>
  <el-container class="left-mode-container">
    <el-aside width="200px" class="aside">Aside</el-aside>
    <el-container>
      <el-header class="header">
        <HeaderView />
      </el-header>
      <el-main class="main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import HeaderView from '@/layouts/header.vue'

defineOptions({ name: 'LeftMode' })
</script>

<style scoped lang="scss">
.left-mode-container {
  width: 100%;
  height: 100%;
}

.aside {
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
  background-color: #ffffff;
}

.header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  background-color: #ffffff;
}

.main {
  background-color: #f5f7fa;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
}
</style>
