<template>
  <div class="header-container">
    <!-- 菜单区域 -->
    <div class="menu-container" v-if="showTopMenu">
      <MenuView />
    </div>
    <!-- 左侧区域 -->
    <div class="header-left" v-else>
      <HoverAnimateWrapper name="rubber">
        <IconButton
          :icon="
            menuStore.isMobile
              ? 'HOutline:Bars3CenterLeftIcon'
              : menuStore.isCollapse
                ? 'HOutline:Bars3BottomRightIcon'
                : 'HOutline:Bars3BottomLeftIcon'
          "
          :tooltip="menuStore.isMobile ? '展开菜单' : '折叠菜单'"
          @click="handleMenuToggle"
        />
      </HoverAnimateWrapper>
      <BreadcrumbView :showIcon="false" v-if="!menuStore.isMobile" />
    </div>

    <!-- 右侧操作区 -->
    <div class="header-right">
      <div class="action-buttons">
        <!-- 主题配置 -->
        <HoverAnimateWrapper name="rotate">
          <IconButton
            icon="HOutline:Cog6ToothIcon"
            tooltip="主题配置"
            @click="themeStore.themeConfigDrawerOpen = true"
          />
        </HoverAnimateWrapper>

        <!-- 全屏 -->
        <HoverAnimateWrapper name="pulse">
          <IconButton
            :tooltip="isFullscreen ? '退出全屏' : '全屏'"
            :icon="
              isFullscreen ? 'HOutline:ArrowsPointingInIcon' : 'HOutline:ArrowsPointingOutIcon'
            "
            @click="toggleFullscreen"
          />
        </HoverAnimateWrapper>

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
  min-width: 0; // 允许 flex 子元素收缩
  overflow: hidden; // 防止溢出
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
</style>
