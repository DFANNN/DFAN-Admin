<!-- 表格打印组件 -->
<template>
  <div>
    <IconButton
      icon="HOutline:PrinterIcon"
      size="1.75rem"
      icon-size="18px"
      tooltip="打印"
      @click="openDialog"
    />
    <BaseDialog v-model="open" title="打印" width="500" @confirm="handlePrint" @close="close">
      <el-form :model="printForm" label-width="100px" label-position="right" ref="printFormRef">
        <el-form-item label="打印标题" prop="title">
          <el-input v-model="printForm.title" placeholder="请输入打印标题" />
        </el-form-item>
        <el-form-item label="选择数据" prop="data">
          <el-select v-model="printForm.data" placeholder="请选择数据">
            <el-option label="当前页数据" value="current" />
            <el-option label="选中数据" value="selected" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择字段" prop="fields">
          <div class="fields-wrap">
            <div class="fields-header">
              <el-checkbox
                :model-value="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="handleCheckAll"
              >
                全选
              </el-checkbox>
              <el-button type="primary" link @click="resetFields">恢复默认</el-button>
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
import dayjs from 'dayjs'
import printJS from 'print-js'
import { useCloned } from '@vueuse/core'
import { VueDraggable } from 'vue-draggable-plus'
import { ElMessage } from 'element-plus'
import { formatExportExcelData } from '@/utils/exportExcel'
import type { ITableColumns } from '@/types/components/page'
import type { FormInstance } from 'element-plus'

interface IProps {
  columns: ITableColumns[] // 表格列
  tableData?: Record<string, unknown>[] // 当前页数据
  selectedData?: Record<string, unknown>[] // 选中的数据
}

const props = defineProps<IProps>()

const menuStore = useMenuStore()

const printFormRef = useTemplateRef<FormInstance>('printFormRef')

// 选择要打印的字段
const { cloned: fieldsList } = useCloned<ITableColumns[]>(() =>
  props.columns.filter((col) => col.type !== 'selection' && col.prop !== 'operation'),
)

// dialog开关
const open = ref(false)

// 打印form
const printForm = ref({
  title: '',
  data: 'current',
})

// 全选状态计算
const isAllSelected = computed(() => fieldsList.value.every((item) => item.visible))
const isIndeterminate = computed(() => {
  const checkedCount = fieldsList.value.filter((item) => item.visible).length
  return checkedCount > 0 && checkedCount < fieldsList.value.length
})

// 全选切换
const handleCheckAll = (val: boolean | string | number) => {
  const value = val as boolean
  fieldsList.value = fieldsList.value.map((item) => ({ ...item, visible: value }))
}

// 恢复默认
const resetFields = () => {
  fieldsList.value = props.columns.filter(
    (col) => col.type !== 'selection' && col.prop !== 'operation',
  )
}

// 打开打印对话框
const openDialog = () => {
  // 赋值默认标题
  printForm.value.title = `打印数据_${dayjs().format('YYYY-MM-DD HH:mm:ss')}`
  open.value = true
}

// 关闭dialog
const close = () => {
  // 重置表单
  printFormRef.value?.resetFields()
  // 恢复默认字段选择
  resetFields()
}
// 打印
const handlePrint = () => {
  // 获取选中的字段
  const selectedFields = fieldsList.value.filter((item) => item.visible)
  if (selectedFields.length === 0) {
    ElMessage.warning('请至少选择一个字段')
    return
  }

  // 获取要打印的数据
  let dataToPrint: Record<string, unknown>[] = []
  switch (printForm.value.data) {
    case 'current':
      dataToPrint = props.tableData || []
      break
    case 'selected':
      dataToPrint = props.selectedData || []
      if (dataToPrint.length === 0) {
        ElMessage.warning('没有选中的数据')
        return
      }
      break
  }

  if (dataToPrint.length === 0) {
    ElMessage.warning('没有可打印的数据')
    return
  }

  // 格式化数据
  const { mapExcelData: mapPrintData } = formatExportExcelData(dataToPrint, selectedFields)
  // 格式化打印表格的表头
  const printTableHeader = selectedFields.map((item) => item.label)
  // 调用printJS打印
  printJS({
    printable: mapPrintData,
    type: 'json',
    properties: printTableHeader,
    header: printForm.value.title,
  })
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
    max-height: 300px;
    overflow-y: auto;
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
    }
  }
}
</style>
