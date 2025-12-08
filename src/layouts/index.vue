<template>
  <div class="layout-container">
    <LeftMode v-if="themeStore.layout === 'leftMode'" />
    <TopMode v-else />
    <ThemeConfig />

    <!-- 移动端菜单抽屉 -->
    <el-drawer
      v-model="menuStore.isMobileMenuOpen"
      :direction="'ltr'"
      :with-header="false"
      :size="230"
      class="mobile-menu-drawer"
    >
      <MenuView />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import LeftMode from '@/layouts/leftMode.vue'
import TopMode from '@/layouts/topMode.vue'
import ThemeConfig from '@/layouts/themeConfig.vue'
import MenuView from '@/layouts/menu.vue'
defineOptions({ name: 'LayoutView' })

const menuStore = useMenuStore()

const themeStore = useThemeStore()
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;
}
</style>
