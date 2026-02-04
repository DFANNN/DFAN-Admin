<template>
  <div>
    <BaseCard class="query-card" v-if="formConfig?.length">
      <el-form :model="queryForm" :label-width="formLabelWidth" :label-position="formLabelPosition">
        <el-row :gutter="gutter">
          <el-col
            :xs="xs"
            :sm="sm"
            :md="md"
            :lg="lg"
            :xl="xl"
            v-for="col in visibleSearchConfig"
            :key="col.prop"
          >
            <el-form-item :label="col.label">
              <component
                :is="componentsMap[col.type]"
                v-model="queryForm[col.prop]"
                v-bind="col.attrs"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="xs" :sm="sm" :md="md" :lg="lg" :xl="xl">
            <el-form-item label-width="0">
              <el-button type="primary" @click="query">查询</el-button>
              <el-button @click="reset">重置</el-button>
              <div class="expand" v-if="visibleIsExpandDiv" @click="isExpand = !isExpand">
                <span>{{ isExpand ? '收起' : '展开' }}</span>
                <el-icon class="expand-icon">
                  <component
                    :is="
                      menuStore.iconComponents[isExpand ? 'Element:ArrowUp' : 'Element:ArrowDown']
                    "
                  />
                </el-icon>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </BaseCard>

    <BaseCard class="table-card">
      <div class="table-operation">
        <div class="operation-left">1</div>
        <div class="operation-right">
          <div></div>
          <div class="operation-tool">
            <IconButton
              icon="HOutline:ArrowPathIcon"
              tooltip="刷新"
              size="1.75rem"
              icon-size="18px"
              @click="refresh"
            />
            <IconButton icon="HOutline:DocumentArrowDownIcon" size="1.75rem" icon-size="18px" />
            <IconButton icon="HOutline:PrinterIcon" size="1.75rem" icon-size="18px" />
            <TableSizeBtn v-model="tableSize" />
            <TableColumnBtn v-model="tableColumns" :original-columns="columns" />
          </div>
        </div>
      </div>
      <el-table :data="tableData" :border="true" :size="tableSize" v-bind="tableAttrs">
        <template v-for="col in tableColumns" :key="col.prop">
          <el-table-column v-bind="col" v-if="col.visible">
            <template #default="scope" v-if="$slots[col.prop as string]">
              <slot :name="col.prop" v-bind="scope" />
            </template>
          </el-table-column>
        </template>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          :layout="paginationLayout"
          :total="total"
          v-bind="paginationAttrs"
          @change="paginationChange"
        />
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import type { IFormConfig, ITableColumns } from '@/types/components/page'

// props 类型
interface IProps {
  // ---------------- 表单配置 --------------------
  formConfig?: IFormConfig[] // 表单配置
  gutter?: number // 栅格间距
  xl?: number // ≥1920px
  lg?: number // ≥1200px
  md?: number // ≥992px
  sm?: number // ≥768px
  xs?: number // <768px
  formLabelWidth?: string | number // 表单 label 宽度
  formLabelPosition?: 'left' | 'right' // 表单 label 位置
  formCollapsible?: boolean // 表单是否支持折叠
  formInitialVisibleCount?: number // 表单支持折叠的时候，默认展示的个数
  formDefaultIsExpand?: boolean // 表单支持折叠的时候，默认展开状态
  // ---------------- 表格配置 --------------------
  tableData: Record<string, unknown>[] // 表格数据
  columns: Record<string, unknown>[] // 表格列配置
  tableAttrs?: Record<string, unknown> // 表格属性  支持el-table的所有属性
  // ---------------- 页码配置 --------------------
  total: number // 总条数
  pageSizes?: number[] // 分页器
  paginationLayout?: string //
  paginationAttrs?: Record<string, unknown> // 分页属性  支持el-pagination的所有属性
}

// emits 类型
interface IEmits {
  // 刷新方法，暴露queryForm，page,pageSize
  (e: 'refresh', queryForm: Record<string, unknown>, page: number, pageSize: number): void
}

const props = withDefaults(defineProps<IProps>(), {
  // ---------------- 表单配置 --------------------
  gutter: 20,
  xl: 6,
  lg: 6,
  md: 12,
  sm: 12,
  xs: 24,
  formLabelWidth: 'auto',
  formLabelPosition: 'right',
  formCollapsible: true,
  formInitialVisibleCount: 3,
  formDefaultIsExpand: false,
  // ---------------- 页码配置 --------------------
  paginationLayout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: () => [10, 20, 30, 40, 50],
})

const emits = defineEmits<IEmits>()

// 组件映射
const componentsMap: Record<string, Component> = {
  elInput: ElInput,
  elInputNumber: ElInputNumber,
  elSelect: ElSelect,
  elDatePicker: ElDatePicker,
}

const menuStore = useMenuStore()

// -----------------------  表单配置 -----------------------

// 查询表单form
const queryForm = ref<Record<string, unknown>>({})

// 展开/收缩 状态
const isExpand = ref(props.formDefaultIsExpand)

// 显示的表单项
const visibleSearchConfig = computed(() => {
  // 如果不支持折叠 则返回所有表单项
  if (!props.formCollapsible) return props.formConfig
  // 如果是展开状态 则返回所有表单项
  if (isExpand.value) return props.formConfig
  // 如果是收起状态 则计算需要展示的表单项
  return props.formConfig?.slice(0, props.formInitialVisibleCount)
})

// 是否显示展开/收起按钮
const visibleIsExpandDiv = computed(() => {
  //如果没有传递formConfig 则隐藏
  if (!props.formConfig) return false
  // 如果不支持折叠，则隐藏
  if (!props.formCollapsible) return false
  // 如果支持折叠，并且formConfig长度大于formInitialVisibleCount 则显示
  if (props.formConfig?.length > props.formInitialVisibleCount) return true
  return false
})

// 初始化表单值（如果有默认值的情况下）
const initForm = () => {
  const form: Record<string, unknown> = {}

  props?.formConfig?.forEach((item) => {
    form[item.prop] = item.defaultValue ?? undefined
  })

  queryForm.value = form
}

const query = () => {
  emits('refresh', queryForm.value, currentPage.value, pageSize.value)
}

const reset = () => {
  // 重置表单
  initForm()
  emits('refresh', queryForm.value, currentPage.value, pageSize.value)
}

// -----------------------  表格和页码配置 -----------------------

// 表格尺寸
const tableSize = ref<'large' | 'default' | 'small'>('default')

// 表格的column
const tableColumns = ref<ITableColumns[]>(
  props.columns.map((item) => ({
    ...item,
    visible: true,
  })),
)

// 当前页码
const currentPage = ref(1)
// 每页条数
const pageSize = ref(props.pageSizes[0] || 10)

// 页码改变
const paginationChange = (page: number, pageSize: number) => {
  emits('refresh', queryForm.value, page, pageSize)
}

// 刷新（表格工具）
const refresh = () => {
  emits('refresh', queryForm.value, currentPage.value, pageSize.value)
}

onMounted(() => {
  // 初始化form
  initForm()
  // 当组件挂载时，直接触发一次refresh事件
  emits('refresh', queryForm.value, currentPage.value, pageSize.value)
})
</script>

<style scoped lang="scss">
.query-card {
  .expand {
    display: flex;
    align-items: center;
    margin-left: 0.75rem;
    cursor: pointer;
    color: var(--el-color-primary);
    .expand-icon {
      margin-left: 0.25rem;
    }
  }

  :deep(.el-card__body) {
    padding-bottom: 0.25rem;
  }
}

.table-card {
  margin-top: 1rem;
  .table-operation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.25rem;
    border: 1px solid var(--el-border-color-lighter);
    border-bottom: none;
    border-radius: 0.5rem 0.5rem 0 0;
    .operation-right {
      display: flex;
      align-items: center;
      .operation-tool {
        display: flex;
        align-items: center;
      }
    }
  }
  .pagination-wrap {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
