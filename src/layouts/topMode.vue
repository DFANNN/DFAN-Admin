<template>
  <div>
    <el-container class="top-mode-container">
      <el-header class="header">
        <HeaderView />
      </el-header>
      <el-main>
        <RouterView v-slot="{ Component, route }">
          <Transition name="fade-slide" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
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
    position: relative;
    overflow: hidden;
  }

  /* 路由切换过渡动画 */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateX(20px);
  }

  .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-20px);
  }

  .fade-slide-enter-to,
  .fade-slide-leave-from {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
