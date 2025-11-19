<template>
  <div class="menu-container">
    <div class="logo-wrapper">
      <div class="logo">Logo</div>
    </div>
    <div class="menu-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="menuStore.isCollapse"
        :background-color="menuBackgroundColor"
        :text-color="menuTextColor"
        :active-text-color="menuActiveTextColor"
        class="sidebar-menu"
      >
        <MenuItem v-for="item in menuStore.menuList" :key="item.path" :item="item" />
      </el-menu>
      <div class="menu-footer">
        <el-button class="collapse-btn" text size="small" @click="menuStore.toggleCollapse">
          <el-icon>
            <component :is="menuStore.isCollapse ? Expand : Fold" />
          </el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuItem from '@/layouts/menuItem.vue'
import { Expand, Fold } from '@element-plus/icons-vue'

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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.logo-wrapper {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background-color: var(--el-bg-color);
  transition: all 0.3s;
  overflow: hidden;

  .logo {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-color-primary);
    white-space: nowrap;
    transition: opacity 0.3s;
  }
}

.menu-wrapper {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  gap: 12px;
}

.sidebar-menu {
  flex: 1;
  border: none;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  scrollbar-width: none; // Firefox
  -ms-overflow-style: none; // IE/Edge legacy

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  // 菜单项 hover 样式
  :deep(.el-menu-item) {
    position: relative;
    transition:
      background-color 0.3s,
      border-radius 0.3s;

    // Hover 效果
    &:hover {
      background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
      color: var(--el-color-primary);
      border-radius: 8px;
    }

    // 激活状态
    &.is-active {
      background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
      color: var(--el-color-primary);
      font-weight: 600;
      border-radius: 8px;

      // 左侧指示条
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 20px;
        background-color: var(--el-color-primary);
        border-radius: 0 3px 3px 0;
      }
    }
  }

  // 子菜单 hover 样式
  :deep(.el-sub-menu) {
    .el-sub-menu__title {
      transition:
        background-color 0.3s,
        border-radius 0.3s;

      // Hover 效果
      &:hover {
        background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
        color: var(--el-color-primary);
        border-radius: 8px;
      }
    }
  }
}

.menu-footer {
  flex-shrink: 0;
  padding: 8px 0 0;
  border-top: 1px solid var(--el-border-color-lighter);

  .collapse-btn {
    width: 100%;
    justify-content: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 4px;
    color: var(--el-text-color-primary);
    transition:
      background-color 0.3s,
      color 0.3s,
      transform 0.3s;

    &:hover {
      background: color-mix(in srgb, var(--el-color-primary) 12%, transparent);
      color: var(--el-color-primary);
      transform: translateY(-1px);
    }

    :deep(.el-icon) {
      font-size: 16px;
    }

    span {
      transition: opacity 0.3s;
    }
  }
}

// 暗色主题适配
:deep(.el-menu--dark) {
  .el-menu-item {
    &:hover {
      background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
    }

    &.is-active {
      background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
    }
  }

  .el-sub-menu__title {
    &:hover {
      background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
    }
  }
}
</style>
