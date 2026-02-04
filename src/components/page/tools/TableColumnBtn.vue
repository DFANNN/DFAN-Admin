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
        <div class="menu-item" v-for="item in modelValue" :key="item.prop ? item.prop : item.type">
          <div class="menu-item-left">
            <IconButton tooltip="拖拽排序" icon="HSolid:Bars3Icon" size="20px" icon-size="12px" />
            <el-checkbox v-model="item.visible">{{
              item.label ? item.label : item.type
            }}</el-checkbox>
          </div>
          <div class="menu-item-right">
            <IconButton
              tooltip="固定在左侧"
              icon="HOutline:ChevronDoubleLeftIcon"
              :type="item.fixed === 'left' || item.fixed === true ? 'primary' : 'default'"
              size="20px"
              icon-size="12px"
              @click="toggleFixed(item, 'left')"
            />
            <IconButton
              tooltip="固定在右侧"
              icon="HOutline:ChevronDoubleRightIcon"
              :type="item.fixed === 'right' ? 'primary' : 'default'"
              size="20px"
              icon-size="12px"
              @click="toggleFixed(item, 'right')"
            />
          </div>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
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

// 全选状态计算
const isAllSelected = computed(() => props.modelValue.every((item) => item.visible))
const isIndeterminate = computed(() => {
  const checkedCount = props.modelValue.filter((item) => item.visible).length
  return checkedCount > 0 && checkedCount < props.modelValue.length
})

const handleCheckAll = (val: boolean | string | number) => {
  const newCols = props.modelValue.map((item) => ({ ...item, visible: val }))
  emits('update:modelValue', JSON.parse(JSON.stringify(newCols)))
}

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

const resetColumns = () => {
  const columns = props.originalColumns.map((item) => {
    return {
      ...item,
      visible: true,
    }
  })
  // 深度克隆原始配置
  emits('update:modelValue', JSON.parse(JSON.stringify(columns)))
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
      gap: 0.25rem;
      .drag-icon {
        color: var(--el-text-color-secondary);
      }
    }
    .menu-item-right {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }
}
</style>

<style lang="scss">
.table-column-dropdown-popper {
  border-radius: 8px !important;
}
</style>
