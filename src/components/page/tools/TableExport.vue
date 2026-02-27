<template>
  <div>
    <IconButton
      icon="HOutline:DocumentArrowDownIcon"
      size="1.75rem"
      icon-size="18px"
      tooltip="导出"
      @click="openDialog"
    />
    <BaseDialog v-model="open" title="导出" width="500">
      <el-form :model="exportForm" label-width="100px" label-position="right">
        <el-form-item label="文件名称" prop="name">
          <el-input v-model="exportForm.name" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item label="导出格式" prop="format">
          <el-select v-model="exportForm.format" placeholder="请选择导出格式">
            <el-option label="XLSX" value=".xlsx" />
            <el-option label="CSV" value=".csv" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择数据" prop="data">
          <el-select v-model="exportForm.data" placeholder="请选择数据">
            <el-option label="当前页数据" value="current" />
            <el-option label="选中数据" value="selected" />
            <el-option label="全部数据" value="all" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择字段" prop="fields">
          <div class="fields-wrap">
            <div class="fields-header">
              <el-checkbox> 全选 </el-checkbox>
              <el-button type="primary" link>恢复默认</el-button>
            </div>
            <div class="fields-content">
              <VueDraggable v-model="fieldsList" :animation="150" handle=".handle">
                <div
                  class="fields-item"
                  v-for="item in fieldsList"
                  :key="item.prop ? item.prop : item.type"
                >
                  <div class="fields-item-left">
                    <el-icon size="16" class="drag-wrap handle">
                      <component :is="menuStore.iconComponents['HSolid:Bars3Icon']" />
                    </el-icon>
                    <el-checkbox v-model="item.visible"> {{ item.label }} </el-checkbox>
                  </div>

                  <div class="fields-item-right">
                    <el-input-number
                      placeholder="列宽"
                      :controls="false"
                      size="small"
                      style="width: 100%"
                    />
                  </div>
                </div>
              </VueDraggable>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { useCloned } from '@vueuse/core'
import { VueDraggable } from 'vue-draggable-plus'
import type { ITableColumns } from '@/types/components/page'

interface IProps {
  columns: ITableColumns[]
}

const props = defineProps<IProps>()

// 选择要导出的字段
const { cloned: fieldsList } = useCloned(() => props.columns)

const menuStore = useMenuStore()

const open = ref(false)

const exportForm = ref({
  name: '',
  format: '.xlsx',
  data: 'current',
  fields: '',
})

const openDialog = () => {
  open.value = true
}
</script>

<style scoped lang="scss">
.fields-wrap {
  width: 100%;
  border-radius: 0.25rem;
  border: 1px solid var(--el-border-color);
  .fields-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--el-border-color);
    padding: 0 0.5rem 0 2rem;
  }
  .fields-content {
    padding: 0.25rem 0.25rem;
    .fields-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 0.25rem;
      padding: 0 0.5rem;
      &:hover {
        background: var(--el-color-primary-light-7);
      }
      .fields-item-left {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        .drag-wrap {
          cursor: grab;
        }
      }
      .fields-item-right {
        width: 60px;
      }
    }
  }
}
</style>
