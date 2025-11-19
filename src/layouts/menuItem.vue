<template>
  <el-sub-menu v-if="hasChildren" :index="item.path">
    <template #title>
      <el-icon v-if="item.icon">
        <component :is="menuStore.iconComponents[item.icon]" />
      </el-icon>
      <span>{{ item.title }}</span>
    </template>
    <MenuItem v-for="child in item.children" :key="child.path" :item="child" />
  </el-sub-menu>

  <el-menu-item v-else :index="item.path">
    <el-icon v-if="item.icon">
      <component :is="menuStore.iconComponents[item.icon]" />
    </el-icon>
    <span>{{ item.title }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
const props = defineProps(['item'])

const menuStore = useMenuStore()

const hasChildren = computed(() => props.item.children?.length)
</script>
