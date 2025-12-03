<template>
  <el-container class="top-mode-container">
    <el-header class="header">
      <HeaderView />
    </el-header>
    <TabsView />
    <el-main class="main">
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade-slide" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import HeaderView from '@/layouts/header.vue'
import TabsView from '@/layouts/tabsView.vue'

defineOptions({ name: 'TopMode' })
</script>

<style scoped lang="scss">
.top-mode-container {
  width: 100%;
  height: 100%;

  .header {
    height: 50px;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-lighter);
    padding-right: 0.25rem;
  }

  .main {
    background: var(--el-bg-color-page);
    padding: 1rem;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
