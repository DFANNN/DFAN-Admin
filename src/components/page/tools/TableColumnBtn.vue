<template>
  <el-dropdown
    trigger="click"
    :show-arrow="false"
    placement="bottom-end"
    popper-class="table-column-dropdown-popper"
  >
    <div>
      <IconButton
        icon="HOutline:AdjustmentsHorizontalIcon"
        tooltip="列设置"
        size="1.75rem"
        icon-size="18px"
      />
    </div>

    <template #dropdown>
      <div class="menu-wrap">
        <div class="menu-item-top">
          <el-checkbox
            :model-value="isAllSelected"
            :indeterminate="isIndeterminate"
            @change="handleCheckAll"
          >
            全选
          </el-checkbox>
          <el-button type="primary" link @click="resetColumns">恢复默认</el-button>
        </div>
        <VueDraggable v-model="columnList" :animation="150" handle=".handle">
          <div
            class="menu-item"
            v-for="item in columnList"
            :key="item.prop ? item.prop : item.type"
          >
            <div class="menu-item-left">
              <div class="handle drag-wrap">
                <el-icon>
                  <component :is="menuStore.iconComponents['HSolid:Bars3Icon']" />
                </el-icon>
              </div>
              <el-checkbox v-model="item.visible">{{
                item.label ? item.label : item.type
              }}</el-checkbox>
            </div>
            <div class="menu-item-right">
              <div
                class="fixed-wrap"
                :class="{ 'is-active': item.fixed === 'left' || item.fixed === true }"
                @click="toggleFixed(item, 'left')"
              >
                <el-icon>
                  <component :is="menuStore.iconComponents['HSolid:ChevronDoubleLeftIcon']" />
                </el-icon>
              </div>
              <div
                class="fixed-wrap"
                :class="{ 'is-active': item.fixed === 'right' }"
                @click="toggleFixed(item, 'right')"
              >
                <el-icon>
                  <component :is="menuStore.iconComponents['HSolid:ChevronDoubleRightIcon']" />
                </el-icon>
              </div>
            </div>
          </div>
        </VueDraggable>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { VueDraggable } from 'vue-draggable-plus'
import type { ITableColumns } from '@/types/components/page'

interface IProps {
  modelValue: ITableColumns[]
  originalColumns: ITableColumns[]
}

interface IEmits {
  (e: 'update:modelValue', value: ITableColumns[]): void
}

const props = defineProps<IProps>()

const emits = defineEmits<IEmits>()

const menuStore = useMenuStore()

/**
 * 使用 useVModel 代理 props.modelValue
 * 当columnList 被重新赋值（排序）时，会自动触发 emits('update:modelValue', newValue)
 */
const columnList = useVModel(props, 'modelValue', emits)

// 全选状态计算
const isAllSelected = computed(() => props.modelValue.every((item) => item.visible))
const isIndeterminate = computed(() => {
  const checkedCount = props.modelValue.filter((item) => item.visible).length
  return checkedCount > 0 && checkedCount < props.modelValue.length
})

// 全选切换
const handleCheckAll = (val: boolean | string | number) => {
  const value = val as boolean
  const newCols = props.modelValue.map((item) => ({ ...item, visible: value }))
  columnList.value = newCols
}

// 切换固定列
const toggleFixed = (item: ITableColumns, direction: 'left' | 'right') => {
  const fixed = item.fixed

  if (direction === 'left') {
    // 当前已经是 left（或 true）→ 取消
    if (fixed === 'left' || fixed === true) {
      item.fixed = false
    } else {
      // 其他情况（未固定 / right）→ 固定到 left
      item.fixed = 'left'
    }
    return
  }

  if (direction === 'right') {
    // 当前已经是 right → 取消
    if (fixed === 'right') {
      item.fixed = false
    } else {
      // 其他情况（未固定 / left / true）→ 固定到 right
      item.fixed = 'right'
    }
  }
}

// 重置列
const resetColumns = () => {
  const columns = props.originalColumns.map((item) => {
    return {
      ...item,
      visible: true,
    }
  })
  columnList.value = columns
}
</script>

<style scoped lang="scss">
.menu-wrap {
  padding: 0.5rem 0;
  .menu-item-top {
    padding: 0 0.25rem 0 2rem;
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--el-border-color-light);
  }
  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    margin: 0 0.25rem;
    padding: 0 0.25rem;
    border-radius: 0.25rem;
    .menu-item-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      .drag-wrap {
        display: flex;
        align-items: center;
        color: var(--el-text-color-secondary);
        font-size: 1rem;
        cursor: grab;
      }
    }
    .menu-item-right {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      .fixed-wrap {
        display: flex;
        align-items: center;
        font-size: 12px;
        padding: 0.25rem;
        border-radius: 0.25rem;
        cursor: pointer;
        &:hover {
          background: var(--el-color-primary-light-7);
        }
        &.is-active {
          background: var(--el-color-primary-light-7);
          color: var(--el-color-primary);
        }
      }
    }
  }
}
</style>

<style lang="scss">
.table-column-dropdown-popper {
  border-radius: 8px !important;
}
</style>
