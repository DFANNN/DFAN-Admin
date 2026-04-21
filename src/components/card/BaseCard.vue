<template>
  <el-card class="base-card" :shadow="shadow" :style="cardStyle">
    <template #header v-if="slots.header || title || titleIcon || slots['header-right']">
      <slot name="header">
        <div class="card-header-wrap">
          <div class="header-left">
            <el-icon v-if="titleIcon" class="header-icon" :size="titleIconSize">
              <component :is="iconComponent" />
            </el-icon>
            <span class="header-title">{{ title }}</span>
          </div>
          <div class="header-right">
            <slot name="header-right" />
          </div>
        </div>
      </slot>
    </template>

    <div class="card-body-wrap">
      <slot />
    </div>

    <template #footer v-if="slots.footer">
      <slot name="footer" />
    </template>
  </el-card>
</template>

<script setup lang="ts">
interface IProps {
  title?: string
  titleIcon?: string | Component
  titleIconSize?: string | number
  shadow?: 'never' | 'always' | 'hover'
  borderRadius?: string
  bordered?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  shadow: 'never',
  titleIconSize: 20,
  borderRadius: '1rem',
  bordered: false,
})

const slots = useSlots()
const menuStore = useMenuStore()

const iconComponent = computed(() => {
  if (typeof props.titleIcon === 'string') {
    return menuStore.iconComponents[props.titleIcon]
  }
  return props.titleIcon
})

const cardStyle = computed(() => ({
  '--base-card-border-radius': props.borderRadius,
  '--base-card-border-width': props.bordered ? '1px' : '0px',
}))
</script>

<style scoped lang="scss">
.base-card {
  border-style: solid;
  border-width: var(--base-card-border-width);
  border-color: var(--el-border-color-light);
  border-radius: var(--base-card-border-radius);

  .card-body-wrap {
    height: 100%;
  }

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
