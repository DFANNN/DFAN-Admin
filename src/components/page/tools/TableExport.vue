<template>
  <div>
    <IconButton
      icon="HOutline:DocumentArrowDownIcon"
      size="1.75rem"
      icon-size="18px"
      tooltip="导出"
      @click="openDialog"
    />
    <BaseDialog v-model="open" title="导出" width="500" @confirm="handleExport" @close="close">
      <el-form
        :model="exportForm"
        :rules="formRules"
        ref="exportFormRef"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="文件名称" prop="name">
          <el-input v-model="exportForm.name" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item label="导出格式" prop="format">
          <el-select v-model="exportForm.format" placeholder="请选择导出格式">
            <el-option label="XLSX" value=".xlsx" />
            <el-option label="CSV" value=".csv" />
            <el-option label="HTML" value=".html" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择数据" prop="data">
          <el-select v-model="exportForm.data" placeholder="请选择数据">
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

                  <div class="fields-item-right">
                    <el-input-number
                      v-model="item.width"
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
import dayjs from 'dayjs'
import { useCloned } from '@vueuse/core'
import { VueDraggable } from 'vue-draggable-plus'
import type { ITableColumns } from '@/types/components/page'
import { type FormInstance, type FormRules } from 'element-plus'
import { formatExportExcelData, exportToExcel, type IExportFormat } from '@/utils/exportExcel'

interface IProps {
  columns: ITableColumns[] // 表格列
  currentPageData: Record<string, unknown>[] // 当前页的数据
  selectedData: Record<string, unknown>[] // 选中的数据
}

const props = defineProps<IProps>()
const menuStore = useMenuStore()

const exportFormRef = useTemplateRef<FormInstance>('exportFormRef')

// 选择要导出的字段
const { cloned: fieldsList } = useCloned(() =>
  props.columns.filter((col) => col.type !== 'selection' && col.prop !== 'operation'),
)

// dialog开关
const open = ref(false)

// 导出form
const exportForm = ref({
  name: '',
  format: '.xlsx',
  data: 'current',
  fields: '',
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
  const newCols = fieldsList.value.map((item) => ({ ...item, visible: value }))
  fieldsList.value = newCols
}

// 恢复默认
const resetFields = () => {
  // 使用深拷贝，避免引用原始数据
  fieldsList.value = props.columns
    .filter((col) => col.type !== 'selection' && col.prop !== 'operation')
    .map((col) => ({ ...col }))
}

// 导出
const handleExport = async () => {
    await exportFormRef.value?.validate()

    // 获取要导出的字段
    const selectedFields = fieldsList.value.filter((item) => item.visible)
    if (selectedFields.length === 0) {
      ElMessage.warning('请至少选择一个字段')
      return
    }

    // 获取要导出的数据
    let dataToExport: Record<string, unknown>[] = []

    // 根据选择的数据类型获取数据
    switch (exportForm.value.data) {
      case 'current':
        dataToExport = props.currentPageData
        break
      case 'selected':
        dataToExport = props.selectedData || []
        if (dataToExport.length === 0) {
          ElMessage.warning('没有选中的数据')
          return
        }
        break
    }

    if (dataToExport.length === 0) {
      ElMessage.warning('没有可导出的数据')
      return
    }

    // 格式化数据
    const { mapExcelData, colWidth } = formatExportExcelData(dataToExport, selectedFields)
    // 导出Excel
    await exportToExcel(
      mapExcelData,
      exportForm.value.name,
      exportForm.value.format as IExportFormat,
      colWidth,
    )

    // 导出成功
    ElMessage.success('导出成功')
    // 关闭对话框
    open.value = false
}

// 表单验证规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入文件名称', trigger: 'blur' }],
}

// 打开导出对话框
const openDialog = () => {
  // 赋值默认文件名称
  exportForm.value.name = `导出数据_${dayjs().format('YYYYMMDDHHmmss')}`
  open.value = true
}

// 关闭对话框
const close = () => {
  // 重置表单
  exportFormRef.value?.resetFields()
  // 恢复默认字段选择
  resetFields()
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
