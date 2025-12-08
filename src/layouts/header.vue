<template>
  <div class="header-container">
    <!-- 菜单区域 -->
    <div class="menu-container" v-if="showTopMenu">
      <MenuView />
    </div>
    <!-- 左侧区域 -->
    <div class="header-left" v-else>
      <el-tooltip
        :content="menuStore.isMobile ? '展开菜单' : '折叠菜单'"
        placement="bottom"
        effect="dark"
      >
        <div class="action-btn" @click="handleMenuToggle">
          <el-icon
            ><component
              :is="
                menuStore.isMobile
                  ? menuStore.iconComponents['Menu']
                  : menuStore.isCollapse
                    ? menuStore.iconComponents['Expand']
                    : menuStore.iconComponents['Fold']
              "
          /></el-icon>
        </div>
      </el-tooltip>
      <BreadcrumbView :showIcon="true" v-if="!menuStore.isMobile" />
    </div>

    <!-- 右侧操作区 -->
    <div class="header-right">
      <div class="action-buttons">
        <el-tooltip
          content="主题配置"
          placement="bottom"
          effect="dark"
          v-if="APP_CONFIG.showThemeConfig"
        >
          <div class="action-btn" @click="themeStore.themeConfigDrawerOpen = true">
            <el-icon><component :is="menuStore.iconComponents['Setting']" /></el-icon>
          </div>
        </el-tooltip>

        <el-tooltip
          :content="isFullscreen ? '退出全屏' : '全屏'"
          placement="bottom"
          effect="dark"
          v-if="!menuStore.isMobile"
        >
          <div class="action-btn" @click="toggleFullscreen">
            <el-icon>
              <component
                :is="
                  isFullscreen
                    ? menuStore.iconComponents['FullScreen']
                    : menuStore.iconComponents['Aim']
                "
              />
            </el-icon>
          </div>
        </el-tooltip>
        <NotificationDropdown />
      </div>

      <!-- 用户下拉菜单 -->
      <UserDropdown />
    </div>
  </div>
</template>

<script setup lang="ts">
import { APP_CONFIG } from '@/config/app.config'
import MenuView from '@/layouts/menu.vue'
import UserDropdown from '@/layouts/userDropdown.vue'
import BreadcrumbView from '@/layouts/breadcrumb.vue'
import NotificationDropdown from '@/layouts/notificationDropdown.vue'
import { useFullscreen } from '@vueuse/core'

defineOptions({ name: 'HeaderView' })

const menuStore = useMenuStore()
const themeStore = useThemeStore()
// 全屏功能
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// 显示顶部菜单
const showTopMenu = computed(() => {
  return themeStore.layout === 'topMode' && !menuStore.isMobile
})

// 处理菜单切换
const handleMenuToggle = () => {
  if (menuStore.isMobile) {
    menuStore.toggleMobileMenu()
  } else {
    menuStore.toggleCollapse()
  }
}
</script>

<style scoped lang="scss">
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.menu-container {
  flex: 1;
  height: 100%;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 16px;
  border-right: 1px solid var(--el-border-color-lighter);
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--el-text-color-regular);
  background: transparent;

  &:hover {
    background: var(--el-fill-color-light);
    color: var(--el-color-primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    // 直接使用 animate.css 定义的动画名称
    animation: jello;
    animation-duration: 1s;
  }

  .el-icon {
    font-size: 18px;
  }
}
</style>
