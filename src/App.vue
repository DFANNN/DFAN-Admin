<template>
  <el-config-provider :locale="langStore.currentElementLang">
    <RouterView />
  </el-config-provider>
</template>

<script setup lang="ts">
const langStore = useLangStore()
</script>

<style></style>
