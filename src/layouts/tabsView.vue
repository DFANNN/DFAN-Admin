<template>
  <div class="tabs-container">
    <div class="tabs-left-icon" @click="slideLeft">
      <el-icon>
        <component :is="menuStore.iconComponents['ArrowLeft']" />
      </el-icon>
    </div>
    <div class="tabs-pages" ref="tabsPagesRef">
      <div
        class="tabs-page-item"
        :class="{ active: tab.path === tabsStore.activePath }"
        v-for="tab in tabsStore.tabs"
        :key="tab.path"
        @click="navigation(tab.path)"
      >
        <el-icon>
          <component :is="menuStore.iconComponents[tab.icon as string]" />
        </el-icon>
        <div>{{ tab.title }}</div>
        <el-icon v-if="tab.closable" class="close-icon" @click.stop="handleClose(tab)">
          <component :is="menuStore.iconComponents['Close']" />
        </el-icon>
      </div>
    </div>
    <div class="tabs-right-icon" @click="slideRight">
      <el-icon>
        <component :is="menuStore.iconComponents['ArrowRight']" />
      </el-icon>
    </div>
    <div class="tabs-dropdown">
      <el-dropdown trigger="click" class="tabs-dropdown-wrapper">
        <div class="tabs-dropdown-icon">
          <el-icon>
            <component :is="menuStore.iconComponents['MoreFilled']" />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              :icon="menuStore.iconComponents['CircleClose']"
              @click="tabsStore.closeOtherTabs(tabsStore.activePath)"
            >
              关闭其他标签页
            </el-dropdown-item>
            <el-dropdown-item
              :icon="menuStore.iconComponents['Delete']"
              @click="(tabsStore.closeAllTabs(), router.push(tabsStore.activePath))"
            >
              关闭所有标签页
            </el-dropdown-item>
            <el-dropdown-item
              :icon="menuStore.iconComponents['ArrowRight']"
              @click="tabsStore.closeRightTabs(tabsStore.activePath)"
            >
              关闭右侧标签页
            </el-dropdown-item>
            <el-dropdown-item
              :icon="menuStore.iconComponents['ArrowLeft']"
              @click="tabsStore.closeLeftTabs(tabsStore.activePath)"
            >
              关闭左侧标签页
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TabsView' })

const router = useRouter()
const menuStore = useMenuStore()
const tabsStore = useTabsStore()
const tabsPagesRef = useTemplateRef<HTMLDivElement>('tabsPagesRef')

// 导航到指定路径
const navigation = (path: string) => {
  router.push(path)
  tabsStore.activePath = path
}

// 关闭标签页
const handleClose = (item: TabItem) => {
  tabsStore.removeTab(item.path)
  router.push(tabsStore.activePath)
}

// 滚动步进值（容器宽度的80%）
const SCROLL_STEP_RATIO = 0.8

// 获取滚动容器信息
const getScrollInfo = () => {
  const container = tabsPagesRef.value
  if (!container) return null

  return {
    container,
    containerWidth: container.offsetWidth,
    contentWidth: container.scrollWidth,
    scrollLeft: container.scrollLeft,
    maxScrollLeft: container.scrollWidth - container.offsetWidth,
  }
}

// 向左滑动
const slideLeft = () => {
  const info = getScrollInfo()
  if (!info) return

  // 检查是否需要滚动（内容超出容器）
  if (info.containerWidth >= info.contentWidth) return

  // 计算滚动距离（容器宽度的80%）
  const scrollDistance = info.containerWidth * SCROLL_STEP_RATIO

  // 计算目标滚动位置
  const targetScrollLeft = Math.max(0, info.scrollLeft - scrollDistance)

  // 如果已经在最左边，不执行滚动
  if (info.scrollLeft <= 0) return

  info.container.scrollTo({
    left: targetScrollLeft,
    behavior: 'smooth',
  })
}

// 向右滑动
const slideRight = () => {
  const info = getScrollInfo()
  if (!info) return

  // 检查是否需要滚动（内容超出容器）
  if (info.containerWidth >= info.contentWidth) return

  // 计算滚动距离（容器宽度的80%）
  const scrollDistance = info.containerWidth * SCROLL_STEP_RATIO

  // 计算目标滚动位置
  const targetScrollLeft = Math.min(info.maxScrollLeft, info.scrollLeft + scrollDistance)

  // 如果已经在最右边，不执行滚动
  if (info.scrollLeft >= info.maxScrollLeft) return

  info.container.scrollTo({
    left: targetScrollLeft,
    behavior: 'smooth',
  })
}
</script>

<style scoped lang="scss">
.tabs-container {
  padding-top: 0.1rem;
  height: 2.5rem;
  padding-left: 1.25rem;
  display: flex;
  align-items: center;

  .tabs-left-icon {
    padding: 0 0.5rem;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: var(--el-text-color-regular);
    &:hover {
      color: var(--el-color-primary);
    }
  }
  .tabs-right-icon {
    padding: 0 0.5rem;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: var(--el-text-color-regular);
    &:hover {
      color: var(--el-color-primary);
    }
  }
  .tabs-pages {
    padding: 0 1.25rem;
    height: 2.5rem;
    flex: 1;
    display: flex;
    font-size: 0.875rem;
    overflow-x: auto;
    gap: 0.2rem;
    &::-webkit-scrollbar {
      display: none;
    }
    .tabs-page-item {
      padding: 0 0.75rem;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      gap: 0.5rem;
      cursor: pointer;

      .close-icon {
        margin-left: 0.25rem;
        font-size: 0.75rem;
        width: 0.875rem;
        height: 0.875rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20%;
        transition: all 0.2s ease;
        flex-shrink: 0;
        color: var(--el-text-color-regular);
        cursor: pointer;
        &:hover {
          background-color: var(--el-fill-color-darker);
          color: var(--el-color-danger);
          transform: scale(1.1);
        }
      }

      &:hover {
        background-color: var(--el-fill-color-light);
        border-radius: 0.625rem 0.625rem 0.875rem 0.875rem;
      }

      &.active {
        position: relative;
        border-radius: 0.625rem 0.625rem 0 0;
        background-color: color-mix(in srgb, var(--el-color-primary) 20%, transparent);
        color: var(--el-color-primary);
        font-weight: bold;

        &::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          left: -20px;
          bottom: 0;
          background: #000;
          background: radial-gradient(
            circle at 0 0,
            transparent 20px,
            color-mix(in srgb, var(--el-color-primary) 20%, transparent) 21px
          );
        }
        &::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          right: -20px;
          bottom: 0;
          background: #000;
          background: radial-gradient(
            circle at 100% 0,
            transparent 20px,
            color-mix(in srgb, var(--el-color-primary) 20%, transparent) 21px
          );
        }
      }
    }
  }
  .tabs-dropdown {
    height: 100%;
    .tabs-dropdown-wrapper {
      height: 100%;
      cursor: pointer;
      .tabs-dropdown-icon {
        padding: 0 0.5rem;
        display: flex;
        align-items: center;
        color: var(--el-text-color-regular);
        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover {
    background: var(--el-fill-color-light) !important;
    color: var(--el-color-primary);
  }

  &:focus,
  &:focus-visible {
    background: var(--el-fill-color-light) !important;
    color: var(--el-color-primary);
  }
}
</style>
