<template>
  <el-drawer
    v-model="themeStore.themeConfigDrawerOpen"
    title="主题配置"
    :size="360"
    direction="rtl"
  >
    <div class="theme-config-content" :style="{ '--primary-color': themeStore.primaryColor }">
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
              @click="themeStore.themeMode = 'light'"
            >
              <el-icon><Sunny /></el-icon>
              <span>浅色模式</span>
              <el-icon v-if="themeStore.themeMode === 'light'" class="chip-check"
                ><Check
              /></el-icon>
            </div>
            <div
              class="mode-chip"
              :class="{ active: themeStore.themeMode === 'dark' }"
              @click="themeStore.themeMode = 'dark'"
            >
              <el-icon><Moon /></el-icon>
              <span>深色模式</span>
              <el-icon v-if="themeStore.themeMode === 'dark'" class="chip-check"><Check /></el-icon>
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
              @click="themeStore.layout = 'leftMode'"
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
              @click="themeStore.layout = 'topMode'"
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
              v-for="color in primaryColors"
              :key="color.value"
              class="color-chip"
              :class="{ active: themeStore.primaryColor === color.value }"
              @click="themeStore.primaryColor = color.value"
            >
              <span class="chip-dot" :style="{ backgroundColor: color.value }"></span>
              <span class="chip-name">{{ color.name }}</span>
              <el-icon v-if="themeStore.primaryColor === color.value" class="chip-check">
                <Check />
              </el-icon>
            </div>
          </div>
          <div class="custom-color">
            <span>自定义</span>
            <el-color-picker v-model="themeStore.primaryColor" class="color-picker" show-alpha />
          </div>
        </div>
      </div>

      <!-- 区域配色 -->
      <div class="config-section">
        <div class="section-title">
          <el-icon><Menu /></el-icon>
          <span>区域配色</span>
        </div>
        <div class="section-content dual-mode-row">
          <div class="dual-item">
            <div class="dual-label">侧边栏</div>
            <el-radio-group
              :model-value="getSidebarMode"
              class="mode-radio-group"
              @change="handleSidebarModeChange"
            >
              <el-radio-button label="light">
                <span>浅色</span>
              </el-radio-button>
              <el-radio-button label="dark">
                <span>深色</span>
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="dual-item">
            <div class="dual-label">Header</div>
            <el-radio-group
              :model-value="getHeaderMode"
              class="mode-radio-group"
              @change="handleHeaderModeChange"
            >
              <el-radio-button label="light">
                <span>浅色</span>
              </el-radio-button>
              <el-radio-button label="dark">
                <span>深色</span>
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>

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
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { Sunny, Moon, Grid, Menu, Brush, Check, View } from '@element-plus/icons-vue'

defineOptions({ name: 'ThemeConfig' })

const themeStore = useThemeStore()

// 主题颜色预设
const primaryColors = [
  { value: '#409EFF', name: '蓝色' },
  { value: '#67C23A', name: '绿色' },
  { value: '#E6A23C', name: '橙色' },
  { value: '#F56C6C', name: '红色' },
  { value: '#909399', name: '灰色' },
  { value: '#9C27B0', name: '紫色' },
  { value: '#FF9800', name: '深橙' },
  { value: '#00BCD4', name: '青色' },
]

// 浅色和深色配色
const lightTheme = { bg: '#ffffff', text: '#333333' }
const darkTheme = { bg: '#1f2937', text: '#ffffff' }

// 获取侧边栏当前模式
const getSidebarMode = computed(() => {
  return themeStore.sidebarBgColor === lightTheme.bg ? 'light' : 'dark'
})

// 获取Header当前模式
const getHeaderMode = computed(() => {
  return themeStore.headerBgColor === lightTheme.bg ? 'light' : 'dark'
})

// 处理侧边栏模式切换
const handleSidebarModeChange = (mode: string | number | boolean | undefined) => {
  const themeMode = mode === 'light' ? 'light' : 'dark'
  const theme = themeMode === 'light' ? lightTheme : darkTheme
  themeStore.sidebarBgColor = theme.bg
  themeStore.sidebarTextColor = theme.text
}

// 处理Header模式切换
const handleHeaderModeChange = (mode: string | number | boolean | undefined) => {
  const themeMode = mode === 'light' ? 'light' : 'dark'
  const theme = themeMode === 'light' ? lightTheme : darkTheme
  themeStore.headerBgColor = theme.bg
  themeStore.headerTextColor = theme.text
}
</script>

<style scoped lang="scss">
.theme-config-content {
  padding: 0;
}

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
  color: #303133;
  margin-bottom: 12px;

  .el-icon {
    font-size: 14px;
    color: var(--primary-color);
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
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  background: #ffffff;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  .el-icon {
    font-size: 14px;
  }

  .chip-check {
    margin-left: auto;
    font-size: 12px;
    color: var(--primary-color);
  }

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    box-shadow: 0 3px 8px color-mix(in srgb, var(--primary-color) 20%, transparent);
    transform: translateY(-1px);
  }

  &.active {
    background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    border-color: var(--primary-color);
    color: var(--primary-color);
    box-shadow: 0 3px 12px color-mix(in srgb, var(--primary-color) 25%, transparent);
  }
}

.mode-radio-group {
  width: 100%;
  display: flex;
  gap: 6px;

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
      border: 1px solid #dcdfe6;
      background: #ffffff;
      transition: all 0.3s;
      font-size: 12px;

      .el-icon {
        font-size: 12px;
      }

      &:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
    }

    &.is-active .el-radio-button__inner {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: #ffffff;
      box-shadow: 0 2px 6px color-mix(in srgb, var(--primary-color) 25%, transparent);
    }
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
  border: 1px solid #e4e7ed;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  .layout-preview {
    width: 100%;
    aspect-ratio: 4/3;
    border-radius: 6px;
    border: 1px solid transparent;
    background: #f5f7fa;
    padding: 6px;
    transition: all 0.3s;
    margin-bottom: 8px;

    &.left-layout {
      display: flex;
      gap: 4px;

      .preview-sidebar {
        width: 28%;
        background: var(--primary-color);
        border-radius: 4px;
      }

      .preview-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .preview-header {
          height: 18%;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .preview-main {
          flex: 1;
          background: #f1f5f9;
          border-radius: 4px;
        }
      }
    }

    &.top-layout {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .preview-header {
        height: 22%;
        background: var(--primary-color);
        border-radius: 4px;
      }

      .preview-main {
        flex: 1;
        background: #f1f5f9;
        border-radius: 4px;
      }
    }
  }

  .layout-label {
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: #606266;
    transition: color 0.3s;
  }

  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 3px 10px color-mix(in srgb, var(--primary-color) 20%, transparent);
    transform: translateY(-1px);

    .layout-label {
      color: var(--primary-color);
    }
  }

  &.active {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--primary-color) 25%, transparent);

    .layout-label {
      color: var(--primary-color);
      font-weight: 600;
    }
  }
}

.color-presets {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.color-item {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: all 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  &.active {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color) 20%, transparent);

    .el-icon {
      color: #ffffff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.color-picker {
  width: 100%;
  height: 32px;

  :deep(.el-color-picker__trigger) {
    width: 100%;
    height: 32px;
    border-radius: 6px;
  }
}

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
  border-radius: 999px;
  border: 1px solid #e4e7ed;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;

  .chip-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .chip-check {
    font-size: 12px;
    color: #fff;
  }

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    transform: translateY(-1px);
  }

  &.active {
    background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    border-color: var(--primary-color);
    color: var(--primary-color);
    box-shadow: 0 2px 6px color-mix(in srgb, var(--primary-color) 20%, transparent);
  }
}

.custom-color {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #606266;
}

.dual-mode-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.dual-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .dual-label {
    font-size: 12px;
    color: #909399;
  }
}

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
  color: #606266;
  padding: 8px 10px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #fff;

  :deep(.el-switch__core) {
    width: 38px;
    height: 18px;
    border-color: var(--primary-color);
  }

  :deep(.el-switch.is-checked .el-switch__core) {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--primary-color) 30%, transparent);
  }
}

// 深色模式适配
:deep(.el-drawer) {
  .el-drawer__header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .el-drawer__body {
    padding: 16px;
  }
}
</style>
