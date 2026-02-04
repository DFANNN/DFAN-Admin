<template>
  <el-dropdown
    trigger="click"
    :show-arrow="false"
    popper-class="table-size-dropdown-popper"
    @command="command"
  >
    <div>
      <IconButton
        icon="HOutline:ViewColumnsIcon"
        tooltip="表格尺寸"
        size="1.75rem"
        icon-size="18px"
      />
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="large" :class="{ 'is-active': modelValue === 'large' }">
          <div class="size-menu-item">
            <el-icon size="16">
              <component :is="menuStore.iconComponents['HOutline:Bars4Icon']" />
            </el-icon>
            <span>宽 松</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item command="default" :class="{ 'is-active': modelValue === 'default' }">
          <div class="size-menu-item">
            <el-icon size="16">
              <component :is="menuStore.iconComponents['HOutline:Bars3Icon']" />
            </el-icon>
            <span>默 认</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item command="small" :class="{ 'is-active': modelValue === 'small' }">
          <div class="size-menu-item">
            <el-icon size="16">
              <component :is="menuStore.iconComponents['HOutline:Bars2Icon']" />
            </el-icon>
            <span>紧 凑</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
const menuStore = useMenuStore()

interface IProps {
  modelValue: 'large' | 'default' | 'small'
}

interface IEmits {
  (e: 'update:modelValue', value: string): void
}

defineProps<IProps>()

const emits = defineEmits<IEmits>()

const command = (value: string) => {
  emits('update:modelValue', value)
}
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
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

  &.is-active {
    background: var(--el-fill-color-light) !important;
    color: var(--el-color-primary);

    .size-menu-item {
      color: var(--el-color-primary);
      font-weight: 700;
    }
  }
}

.size-menu-item {
  display: flex;
  align-items: center;
  span {
    margin-left: 0.5rem;
  }
}

:deep(.el-dropdown-menu__item:hover) {
  .size-menu-item {
    color: var(--el-color-primary);
  }
}
</style>

<style lang="scss">
.table-size-dropdown-popper {
  border-radius: 8px !important;
  .el-dropdown-menu {
    border-radius: 8px !important;
  }
}
</style>
