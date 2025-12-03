<template>
  <div class="tabs-container" v-if="themeStore.showTabs && tabsStore.tabs.length > 0">
    <el-tabs
      v-model="activePath"
      type="card"
      @tab-remove="handleRemove"
      @tab-click="handleClick"
      class="tabs-wrapper"
    >
      <el-tab-pane
        v-for="tab in tabsStore.tabs"
        :key="tab.path"
        :label="tab.title"
        :name="tab.path"
        :closable="tab.closable"
      >
        <template #label>
          <div class="tab-label">
            <el-icon v-if="tab.icon" class="tab-icon">
              <component :is="menuStore.iconComponents[tab.icon]" />
            </el-icon>
            <span class="tab-title">{{ tab.title }}</span>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { useTabsStore } from '@/stores/tabs'

defineOptions({ name: 'TabsView' })

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()
const themeStore = useThemeStore()
const menuStore = useMenuStore()

// 当前激活的标签页路径
const activePath = computed({
  get: () => tabsStore.activePath,
  set: (val: string) => {
    tabsStore.setActive(val)
  },
})

// 点击标签页
const handleClick = (pane: any) => {
  const targetPath = pane.paneName as string
  // 如果点击的不是当前路由，则跳转
  if (targetPath !== route.path) {
    router.push(targetPath)
  }
}

// 关闭标签页
const handleRemove = (name: string) => {
  const targetPath = name as string
  const currentPath = route.path

  tabsStore.removeTab(targetPath)

  // 如果关闭的是当前激活的标签页，需要跳转
  if (targetPath === currentPath && tabsStore.tabs.length > 0) {
    router.push(tabsStore.activePath)
  }
}
</script>

<style scoped lang="scss">
.tabs-container {
  background: var(--el-bg-color);
  padding: 8px 12px 0;
  margin-bottom: 8px;
  border-radius: 4px;

  .tabs-wrapper {
    :deep(.el-tabs__header) {
      margin: 0;
      border: none;

      .el-tabs__nav-wrap {
        &::after {
          display: none;
        }
      }

      .el-tabs__nav {
        border: none;
      }

      .el-tabs__item {
        height: 36px;
        line-height: 36px;
        padding: 0 16px;
        margin-right: 4px;
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 4px 4px 0 0;
        background: var(--el-fill-color-light);
        color: var(--el-text-color-regular);
        transition: all 0.3s;

        .tab-label {
          display: flex;
          align-items: center;
          gap: 6px;

          .tab-icon {
            font-size: 14px;
          }

          .tab-title {
            font-size: 13px;
          }
        }

        &:hover {
          color: var(--el-color-primary);
          background: var(--el-fill-color);
        }

        &.is-active {
          background: var(--el-bg-color);
          color: var(--el-color-primary);
          border-bottom-color: var(--el-bg-color);
          font-weight: 500;
        }

        .el-icon-close {
          width: 14px;
          height: 14px;
          font-size: 14px;
          margin-left: 8px;
          border-radius: 50%;
          transition: all 0.3s;

          &:hover {
            background: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
          }
        }
      }
    }
  }
}
</style>
