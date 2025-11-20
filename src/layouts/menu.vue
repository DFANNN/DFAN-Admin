<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="menuStore.isCollapse"
    :background-color="menuBackgroundColor"
    :text-color="menuTextColor"
    :active-text-color="menuActiveTextColor"
    :mode="themeStore.layout === 'topMode' ? 'horizontal' : 'vertical'"
    class="menu-container"
  >
    <el-menu-item index="logo">
      <div class="logo">
        <img src="../assets/logo.svg" alt="logo" />
        <div>Logo</div>
      </div>
    </el-menu-item>
    <MenuItem v-for="item in menuStore.menuList" :key="item.path" :item="item" />
  </el-menu>
</template>

<script setup lang="ts">
import MenuItem from '@/layouts/menuItem.vue'

defineOptions({ name: 'MenuView' })

const menuStore = useMenuStore()
const themeStore = useThemeStore()
const route = useRoute()

// 当前激活的菜单项
const activeMenu = computed(() => route.path)

// 菜单颜色配置
const menuBackgroundColor = computed(() => {
  return themeStore.sidebarMode === 'dark' ? '#141414' : '#ffffff'
})

const menuTextColor = computed(() => {
  return themeStore.sidebarMode === 'dark' ? '#e5e7eb' : '#303133'
})

const menuActiveTextColor = computed(() => {
  return themeStore.primaryColor
})
</script>

<style scoped lang="scss">
.menu-container {
  height: 100%;
  .logo {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    gap: 10px;
    img {
      width: 30px;
      height: 30px;
      object-fit: contain;
    }
  }
}
.menu-container:not(.el-menu--collapse) {
  width: 200px;
  &.el-menu--horizontal {
    width: 100%;
  }
}
</style>
