<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="menuStore.isCollapse"
    :background-color="menuBackgroundColor"
    :text-color="menuTextColor"
    :active-text-color="menuActiveTextColor"
    :mode="themeStore.layout === 'topMode' ? 'horizontal' : 'vertical'"
    @select="navigation"
    class="menu-container"
  >
    <Transition :name="themeStore.layout === 'leftMode' ? 'el-zoom-in-top' : 'el-zoom-in-left'">
      <el-menu-item class="logo" v-if="themeStore.showLogo">
        <img :src="APP_CONFIG.logoSrc" alt="logo" class="logo-img" />
        <span class="logo-title" :style="{ color: logoTitleColor }">{{ APP_CONFIG.name }}</span>
      </el-menu-item>
    </Transition>

    <MenuItem v-for="item in menuStore.menuList" :key="item.path" :item="item" />
  </el-menu>
</template>

<script setup lang="ts">
import { APP_CONFIG } from '@/config/app.config'
import MenuItem from '@/layouts/menuItem.vue'

defineOptions({ name: 'MenuView' })

const menuStore = useMenuStore()
const themeStore = useThemeStore()
const route = useRoute()
const router = useRouter()
// 当前激活的菜单项
const activeMenu = computed(() => route.path)

// 菜单颜色配置
const menuBackgroundColor = computed(() => {
  if (themeStore.themeMode === 'dark') return '#141414'
  if (themeStore.layout === 'topMode') return '#ffffff'
  return themeStore.sidebarMode === 'dark' ? '#141414' : '#ffffff'
})

const menuTextColor = computed(() => {
  if (themeStore.themeMode === 'dark') return '#e5e7eb'
  if (themeStore.layout === 'topMode') return '#303133'
  return themeStore.sidebarMode === 'dark' ? '#e5e7eb' : '#303133'
})

const menuActiveTextColor = computed(() => {
  return themeStore.primaryColor
})

const logoTitleColor = computed(() => {
  if (themeStore.layout === 'topMode') return ''
  if (themeStore.sidebarMode === 'dark') return '#ffffff'
  return ''
})

const navigation = (key: string) => {
  router.push(key)
}
</script>

<style scoped lang="scss">
.menu-container {
  height: 100%;
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.3s ease;

    .logo-img {
      width: 43px;
      height: 43px;
      flex-shrink: 0;
      object-fit: contain;
      transition: transform 0.3s ease;
    }

    .logo-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      letter-spacing: 0.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.menu-container:not(.el-menu--collapse) {
  width: 200px;
  &.el-menu--horizontal {
    width: 100%;
    height: 50px;
    border: none !important;
    border-bottom: none !important;
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;

    .el-menu-item:nth-child(1) {
      height: 50px;
      padding: 0;
      border-bottom: none !important;

      &:hover {
        background-color: transparent;
      }
    }

    :deep(.el-menu-item) {
      height: 50px;
      line-height: 50px;
      border: none !important;
      border-bottom: none !important;
      border-top: none !important;
      border-left: none !important;
      border-right: none !important;
    }

    :deep(.el-sub-menu) {
      border: none !important;
      border-bottom: none !important;
      border-top: none !important;
      border-left: none !important;
      border-right: none !important;

      .el-sub-menu__title {
        height: 50px;
        line-height: 50px;
        border: none !important;
        border-bottom: none !important;
        border-top: none !important;
        border-left: none !important;
        border-right: none !important;
      }
    }
  }
}
.el-menu > .el-menu-item:nth-child(1) {
  height: 50px;
  padding: 0 10px;
  border-bottom: none !important;

  &:hover {
    background-color: transparent;
  }
}
</style>
