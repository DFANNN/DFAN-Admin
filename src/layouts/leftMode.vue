<template>
  <el-container class="left-mode-container">
    <MenuView />
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
import MenuView from '@/layouts/menu.vue'
defineOptions({ name: 'LeftMode' })
</script>

<style scoped lang="scss">
.left-mode-container {
  width: 100%;
  height: 100%;
}

.header {
  height: 50px;
  background: var(--el-bg-color);
}

.main {
  background: var(--el-bg-color-page);
  padding: 1rem;
}
</style>
