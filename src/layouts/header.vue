<template>
  <div>
    <el-button type="primary" @click="themeStore.themeConfigDrawerOpen = true">切换布局</el-button>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'HeaderView' })

const themeStore = useThemeStore()
</script>

<style></style>
