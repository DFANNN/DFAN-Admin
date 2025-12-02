<template>
  <div class="header-container">
    <!-- 菜单区域 -->
    <div class="menu-container" v-if="themeStore.layout === 'topMode'">
      <MenuView />
    </div>
    <!-- 左侧区域 -->
    <div class="header-left" v-else>
      <el-tooltip content="折叠菜单" placement="bottom" effect="dark">
        <div class="action-btn" @click="menuStore.toggleCollapse">
          <el-icon
            ><component
              :is="
                menuStore.isCollapse
                  ? menuStore.iconComponents['Expand']
                  : menuStore.iconComponents['Fold']
              "
          /></el-icon>
        </div>
      </el-tooltip>
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

        <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom" effect="dark">
          <div class="action-btn" @click="toggleFullscreen">
            <el-icon
              ><component
                :is="
                  isFullscreen
                    ? menuStore.iconComponents['FullScreen']
                    : menuStore.iconComponents['Aim']
                "
            /></el-icon>
          </div>
        </el-tooltip>
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
import { useFullscreen } from '@vueuse/core'

defineOptions({ name: 'HeaderView' })

const menuStore = useMenuStore()
const themeStore = useThemeStore()
// 全屏功能
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
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
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .el-icon {
    font-size: 18px;
  }
}
</style>
