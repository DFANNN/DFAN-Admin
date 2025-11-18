<template>
  <div class="layout-container">
    <LeftMode v-if="themeStore.layout === 'leftMode'" />
    <TopMode v-else />
    <ThemeConfig />
  </div>
</template>

<script setup lang="ts">
import LeftMode from '@/layouts/leftMode.vue'
import TopMode from '@/layouts/topMode.vue'
import ThemeConfig from '@/layouts/themeConfig.vue'
defineOptions({ name: 'LayoutView' })

const themeStore = useThemeStore()
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;
}
</style>
