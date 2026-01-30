<!-- 基础card组件 基于el-card组件封装 -->
<template>
  <el-card class="base-card" :shadow="shadow">
    <template #header v-if="slots.header || title || titleIcon || slots['header-right']">
      <slot name="header">
        <div class="card-header-wrap">
          <div class="header-left">
            <el-icon size="20" class="header-icon" v-if="titleIcon">
              <component :is="iconComponent" />
            </el-icon>
            <span class="header-title">{{ title }}</span>
          </div>
          <div class="header-right">
            <!-- header 操作项插槽 -->
            <slot name="header-right" />
          </div>
        </div>
      </slot>
    </template>

    <div style="height: 100%">
      <!-- 内容 插槽 -->
      <slot></slot>
    </div>
    <template #footer v-if="slots.footer">
      footer 页脚插槽
      <slot name="footer"></slot>
    </template>
  </el-card>
</template>

<script setup lang="ts">
interface IProps {
  title?: string // 标题
  titleIcon?: string | Component // 标题图标
  titleIconSize?: string // 标题图标大小
  shadow?: 'never' | 'always' | 'hover' // 卡片阴影
}

const props = withDefaults(defineProps<IProps>(), {
  shadow: 'never',
})

// 获取插槽
const slots = useSlots()
const menuStore = useMenuStore()

// 计算title图标组件
const iconComponent = computed(() => {
  if (typeof props.titleIcon === 'string') {
    return menuStore.iconComponents[props.titleIcon]
  }
  return props.titleIcon
})
</script>

<style scoped lang="scss">
.base-card {
  border: none;
  border-radius: 1rem;
  .card-header-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    .header-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      .header-icon {
        color: var(--el-color-primary);
      }
      .header-title {
        font-weight: 700;
      }
    }
  }
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-extra-light);
}
:deep(.el-card__footer) {
  border-top: 1px solid var(--el-border-color-extra-light);
}
</style>
