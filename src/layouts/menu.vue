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
        <div class="logo-icon" :style="{ background: themeStore.primaryColor }">
          <span class="logo-letter">D</span>
        </div>
        <div class="logo-text" v-if="!menuStore.isCollapse || themeStore.layout === 'topMode'">
          <span class="logo-title">LOGO</span>
          <span class="logo-subtitle">Admin</span>
        </div>
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
</script>

<style scoped lang="scss">
.menu-container {
  height: 100%;
  .logo {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    .logo-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: var(--el-color-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
        transform: rotate(45deg);
        transition: all 0.3s ease;
      }

      .logo-letter {
        font-size: 20px;
        font-weight: 700;
        color: #ffffff;
        position: relative;
        z-index: 1;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);

        &::before {
          top: -30%;
          left: -30%;
        }
      }
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      min-width: 0;

      .logo-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: 0.5px;
      }

      .logo-subtitle {
        font-size: 11px;
        font-weight: 500;
        color: var(--el-text-color-regular);
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        opacity: 0.7;
        letter-spacing: 0.3px;
      }
    }

    &:hover {
      .logo-icon {
        transform: translateY(-2px);
      }
    }
  }
}
.menu-container.el-menu--collapse {
  .logo {
    justify-content: center;
    padding: 0;

    .logo-icon {
      margin: 0 auto;
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

    .logo {
      .logo-text {
        flex-direction: row;
        align-items: center;
        gap: 6px;

        .logo-title {
          font-size: 16px;
        }

        .logo-subtitle {
          font-size: 12px;
        }
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
</style>
