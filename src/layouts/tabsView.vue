<template>
  <div class="tabs-container">
    <el-scrollbar>
      <div class="tabs-wrapper">
        <div
          v-for="item in tabsStore.tabs"
          :key="item.path"
          :class="{ active: item.path === tabsStore.activePath }"
          class="tab-item"
          @click="navigation(item.path)"
        >
          <el-icon><component :is="menuStore.iconComponents[item.icon as string]" /></el-icon>
          <div>{{ item.title }}</div>
          <el-icon class="close-icon" @click.stop="handleClose(item)" v-if="item.closable">
            <Close />
          </el-icon>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'
import type { TabItem } from '@/stores/tabs'

defineOptions({ name: 'TabsView' })

const router = useRouter()
const tabsStore = useTabsStore()
const menuStore = useMenuStore()

// 导航到指定路径
const navigation = (path: string) => {
  router.push(path)
  tabsStore.activePath = path
}

const handleClose = (item: TabItem) => {
  tabsStore.removeTab(item.path)
  router.push(tabsStore.activePath)
}
</script>

<style scoped lang="scss">
.tabs-container {
  height: 2.5rem; // 40px
  padding: 0 1.25rem;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);

  .tabs-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    margin-top: 0.15rem;

    .tab-item {
      flex-shrink: 0;
      padding: 0.35rem 0.75rem; // 调整内边距，让它像个按钮
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-right: 0.15rem;
      border-radius: 6px; // 稍微圆润的边角
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); // 丝滑过渡
      color: var(--el-text-color-regular);
      border: 1px solid transparent; // 预留边框位置防止跳动
      background: transparent;
      position: relative;

      &:hover {
        background-color: var(--el-fill-color-light); // 悬停微反馈
        color: var(--el-text-color-primary);
      }

      &.active {
        background-color: color-mix(
          in srgb,
          var(--el-color-primary) 20%,
          transparent
        ); // 极淡的主题色背景
        color: var(--el-color-primary); // 主题色文字
        border-color: color-mix(in srgb, var(--el-color-primary) 20%, transparent); // 极淡的边框
        font-weight: 500;
      }

      .close-icon {
        margin-left: 0.25rem;
        font-size: 0.75rem;
        width: 0.875rem;
        height: 0.875rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
        flex-shrink: 0;
        color: var(--el-text-color-regular);
        cursor: pointer;

        &:hover {
          background-color: var(--el-fill-color-darker);
          color: var(--el-color-danger);
          transform: scale(1.1);
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }
  }
}
</style>
