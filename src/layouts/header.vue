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
        <HoverAnimateWrapper name="rubber">
          <div class="action-btn" @click="handleMenuToggle">
            <el-icon
              ><component
                :is="
                  menuStore.isMobile
                    ? menuStore.iconComponents['HOutline:Bars3CenterLeftIcon']
                    : menuStore.isCollapse
                      ? menuStore.iconComponents['HOutline:Bars3BottomRightIcon']
                      : menuStore.iconComponents['HOutline:Bars3BottomLeftIcon']
                "
            /></el-icon>
          </div>
        </HoverAnimateWrapper>
      </el-tooltip>
      <BreadcrumbView :showIcon="false" v-if="!menuStore.isMobile" />
    </div>

    <!-- 右侧操作区 -->
    <div class="header-right">
      <div class="action-buttons">
        <!-- 主题配置 -->
        <el-tooltip
          content="主题配置"
          placement="bottom"
          effect="dark"
          v-if="APP_CONFIG.showThemeConfig"
        >
          <HoverAnimateWrapper name="rotate">
            <div class="action-btn" @click="themeStore.themeConfigDrawerOpen = true">
              <el-icon
                ><component :is="menuStore.iconComponents['HOutline:Cog6ToothIcon']"
              /></el-icon>
            </div>
          </HoverAnimateWrapper>
        </el-tooltip>

        <!-- 全屏 -->
        <el-tooltip
          :content="isFullscreen ? '退出全屏' : '全屏'"
          placement="bottom"
          effect="dark"
          v-if="!menuStore.isMobile"
        >
          <HoverAnimateWrapper name="pulse">
            <div class="action-btn" @click="toggleFullscreen">
              <el-icon>
                <component
                  :is="
                    isFullscreen
                      ? menuStore.iconComponents['HOutline:ArrowsPointingInIcon']
                      : menuStore.iconComponents['HOutline:ArrowsPointingOutIcon']
                  "
                />
              </el-icon>
            </div>
          </HoverAnimateWrapper>
        </el-tooltip>

        <!-- 国际化 -->
        <I18nDropdown />

        <!-- 消息通知 -->
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
import I18nDropdown from '@/layouts/i18nDropdown.vue'
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
  }

  .el-icon {
    font-size: 1.25rem;
  }
}
</style>
