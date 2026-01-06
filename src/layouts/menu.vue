<template>
  <el-scrollbar>
    <el-menu
      :default-active="activeMenu"
      :collapse="menuStore.isCollapse"
      :background-color="menuBackgroundColor"
      :text-color="menuTextColor"
      :active-text-color="menuActiveTextColor"
      :mode="menuMode"
      @select="navigation"
      class="menu-container"
      :class="{ '--menu-border': menuStore.isMobile }"
    >
      <Transition name="bounce">
        <el-menu-item class="logo" v-if="themeStore.showLogo">
          <img :src="APP_CONFIG.logoSrc" alt="logo" class="logo-img" />
          <span class="logo-title" :style="{ color: logoTitleColor }">{{ APP_CONFIG.name }}</span>
        </el-menu-item>
      </Transition>

      <MenuItem v-for="item in menuStore.menuList" :key="item.path" :item="item" />
    </el-menu>
  </el-scrollbar>
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

// 菜单模式
const menuMode = computed(() => {
  if (menuStore.isMobile) return 'vertical'
  return themeStore.layout === 'topMode' ? 'horizontal' : 'vertical'
})

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
  // 移动端点击菜单项后自动关闭抽屉
  if (menuStore.isMobile && menuStore.isMobileMenuOpen) {
    menuStore.isMobileMenuOpen = false
  }
}
</script>

<style scoped lang="scss">
.--menu-border {
  border-right: none;
}

.menu-container {
  height: 100vh;
  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.3s ease;

    .logo-img {
      width: 43px;
      height: 43px;
      flex-shrink: 0;
      object-fit: contain;
      transition: transform 0.3s ease;
    }

    .logo-title {
      font-size: 1.25rem;
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
  width: 13.75rem;
  &.el-menu--horizontal {
    width: 100%;
    height: 49px;
    border: none !important;
    border-bottom: none !important;
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;

    .el-menu-item:nth-child(1) {
      height: 49px;
      padding: 0;
      border-bottom: none !important;

      &:hover {
        background-color: transparent;
      }
    }

    :deep(.el-menu-item) {
      height: 49px;
      line-height: 49px;
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
        height: 49px;
        line-height: 49px;
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
