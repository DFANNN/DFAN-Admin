<template>
  <el-drawer v-model="themeStore.themeConfigDrawerOpen" :size="360" title="主题配置">
    <!-- 主题模式 -->
    <div class="config-section">
      <div class="section-title">
        <el-icon><Sunny /></el-icon>
        <span>主题模式</span>
      </div>
      <div class="section-content">
        <div class="mode-chip-group">
          <div
            class="mode-chip"
            :class="{ active: themeStore.themeMode === 'light' }"
            @click="themeStore.toggleThemeMode('light')"
          >
            <el-icon><Sunny /></el-icon>
            <span>浅色模式</span>
          </div>
          <div
            class="mode-chip"
            :class="{ active: themeStore.themeMode === 'dark' }"
            @click="themeStore.toggleThemeMode('dark')"
          >
            <el-icon><Moon /></el-icon>
            <span>深色模式</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 布局模式 -->
    <div class="config-section">
      <div class="section-title">
        <el-icon><Grid /></el-icon>
        <span>布局模式</span>
      </div>
      <div class="section-content">
        <div class="layout-preview-group">
          <div
            class="layout-preview-item"
            :class="{ active: themeStore.layout === 'leftMode' }"
            @click="themeStore.toggleLayout('leftMode')"
          >
            <div class="layout-preview left-layout">
              <div class="preview-sidebar"></div>
              <div class="preview-content">
                <div class="preview-header"></div>
                <div class="preview-main"></div>
              </div>
            </div>
            <div class="layout-label">左侧布局</div>
          </div>
          <div
            class="layout-preview-item"
            :class="{ active: themeStore.layout === 'topMode' }"
            @click="(themeStore.toggleLayout('topMode'), (menuStore.isCollapse = false))"
          >
            <div class="layout-preview top-layout">
              <div class="preview-header"></div>
              <div class="preview-main"></div>
            </div>
            <div class="layout-label">顶部布局</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主题颜色 -->
    <div class="config-section">
      <div class="section-title">
        <el-icon><Brush /></el-icon>
        <span>主题颜色</span>
      </div>
      <div class="section-content theme-color-content">
        <div class="color-chip-group">
          <div
            v-for="color in themeStore.primaryColorOptions"
            :key="color.value"
            class="color-chip"
            :class="{ active: themeStore.primaryColor === color.value }"
            @click="themeStore.togglePrimaryColor(color.value)"
          >
            <span class="chip-dot" :style="{ backgroundColor: color.value }"></span>
            <span class="chip-name">{{ color.name }}</span>
          </div>
        </div>
        <div class="custom-color">
          <span>自定义</span>
          <el-color-picker v-model="themeStore.primaryColor" show-alpha />
        </div>
      </div>
    </div>

    <!-- 区域配色 -->
    <Transition name="el-zoom-in-left">
      <div
        class="config-section"
        v-if="themeStore.themeMode !== 'dark' && themeStore.layout !== 'topMode'"
      >
        <div class="section-title">
          <el-icon><Menu /></el-icon>
          <span>侧边栏配色</span>
        </div>
        <div class="section-content">
          <div class="dual-item">
            <el-radio-group v-model="themeStore.sidebarMode" class="mode-radio-group">
              <el-radio-button value="light" @click="themeStore.toggleSidebarMode('light')">
                浅色
              </el-radio-button>
              <el-radio-button value="dark" @click="themeStore.toggleSidebarMode('dark')">
                深色
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 界面元素 -->
    <div class="config-section">
      <div class="section-title">
        <el-icon><View /></el-icon>
        <span>界面元素</span>
      </div>
      <div class="section-content toggles-row">
        <div class="toggle-item">
          <span>显示 Logo</span>
          <el-switch v-model="themeStore.showLogo" />
        </div>
        <div class="toggle-item">
          <span>显示标签页</span>
          <el-switch v-model="themeStore.showTabs" />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { Sunny, Moon, Grid, Menu, Brush, View } from '@element-plus/icons-vue'

defineOptions({ name: 'ThemeConfig' })

const themeStore = useThemeStore()
const menuStore = useMenuStore()
</script>

<style scoped lang="scss">
.config-section {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;

  .el-icon {
    font-size: 14px;
    color: var(--el-color-primary);
  }
}

.section-content {
  padding-left: 20px;
}

.mode-chip-group {
  display: flex;
  gap: 8px;
}

.mode-chip {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  font-size: 12px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  .el-icon {
    font-size: 14px;
  }

  &:hover {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
    box-shadow: 0 3px 8px color-mix(in srgb, var(--el-color-primary) 20%, transparent);
    transform: translateY(-1px);
  }

  &.active {
    background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
    box-shadow: 0 3px 12px color-mix(in srgb, var(--el-color-primary) 25%, transparent);
  }
}

// 布局预览
.layout-preview-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.layout-preview-item {
  cursor: pointer;
  transition: all 0.3s;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  .layout-preview {
    width: 100%;
    aspect-ratio: 4/3;
    border-radius: 6px;
    border: 1px solid transparent;
    background: var(--el-fill-color-light);
    padding: 6px;
    transition: all 0.3s;
    margin-bottom: 8px;

    &.left-layout {
      display: flex;
      gap: 4px;

      .preview-sidebar {
        width: 28%;
        background: var(--el-color-primary);
        border-radius: 4px;
      }

      .preview-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .preview-header {
          height: 18%;
          background: var(--el-bg-color-overlay);
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .preview-main {
          flex: 1;
          background: var(--el-bg-color-overlay);
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }
      }
    }

    &.top-layout {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .preview-header {
        height: 22%;
        background: var(--el-color-primary);
        border-radius: 4px;
      }

      .preview-main {
        flex: 1;
        background: var(--el-bg-color-overlay);
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 4px;
      }
    }
  }

  .layout-label {
    text-align: center;
    font-size: 12px;
    color: var(--el-text-color-regular);
    transition: color 0.3s;
  }

  &:hover {
    border-color: var(--el-color-primary);
    box-shadow: 0 3px 10px color-mix(in srgb, var(--el-color-primary) 20%, transparent);
    transform: translateY(-1px);

    .layout-label {
      color: var(--el-color-primary);
    }
  }

  &.active {
    border-color: var(--el-color-primary);
    background: color-mix(in srgb, var(--el-color-primary) 8%, transparent);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--el-color-primary) 25%, transparent);

    .layout-label {
      color: var(--el-color-primary);
    }
  }
}

// 主题颜色
.theme-color-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.color-chip {
  min-width: 90px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition: all 0.3s;

  .chip-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid var(--el-border-color-lighter);
  }

  &:hover {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
    transform: translateY(-1px);
  }

  &.active {
    background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
    box-shadow: 0 2px 6px color-mix(in srgb, var(--el-color-primary) 20%, transparent);
  }
}

.custom-color {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--el-text-color-regular);
}

// 区域配色
.dual-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mode-radio-group {
  width: 100%;
  display: flex;
  gap: 6px;
  background: var(--el-bg-color-overlay);

  :deep(.el-radio-button) {
    flex: 1;

    .el-radio-button__inner {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid var(--el-border-color-lighter);
      transition: all 0.3s;
      font-size: 12px;
      color: var(--el-text-color-regular);
      font-weight: 400;

      .el-icon {
        font-size: 12px;
      }

      &:hover {
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
        transform: translateY(-1px);
        box-shadow: 0 3px 8px color-mix(in srgb, var(--el-color-primary) 20%, transparent);
      }
    }

    &.is-active .el-radio-button__inner {
      background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
      border-color: var(--el-color-primary);
      color: var(--el-color-primary);
      box-shadow: 0 3px 12px color-mix(in srgb, var(--el-color-primary) 25%, transparent);
    }
  }
}

// 界面元素
.toggles-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.toggle-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--el-text-color-regular);
  padding: 8px 10px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  background: var(--el-bg-color-overlay);
  transition: all 0.3s;
}
</style>
