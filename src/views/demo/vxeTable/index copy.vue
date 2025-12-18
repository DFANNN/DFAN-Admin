<template>
  <div class="vxe-table-view-container">
    <el-card shadow="never" class="card-clear-mb" ref="queryFormCardRef">
      <el-form :model="queryForm" label-width="auto" ref="queryFormRef" @keyup.enter="getList">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="queryForm.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="queryForm.sex" placeholder="请选择">
                <el-option label="男" value="0" />
                <el-option label="女" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item label="年龄" prop="age">
              <el-input-number
                v-model="queryForm.age"
                :controls="false"
                align="left"
                placeholder="请输入"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item>
              <el-button type="primary" :icon="menuStore.iconComponents.Search" @click="getList"
                >搜索</el-button
              >
              <el-button :icon="menuStore.iconComponents.Refresh" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="card-mt-16" ref="vxeTableCardRef">
      <div class="operation-container">
        <div class="operation-container-left" ref="operationContainerRef">
          <el-button
            type="primary"
            :icon="menuStore.iconComponents.Plus"
            @click="vxeTableCreateRef?.showDialog(undefined)"
          >
            <template #default v-if="!menuStore.isMobile">新增数据</template>
          </el-button>
          <el-popconfirm
            title="确定要删除选中的数据吗？"
            :placement="POPCONFIRM_CONFIG.placement"
            :width="POPCONFIRM_CONFIG.width"
            @confirm="deleteDataHandle(selectedIds)"
          >
            <template #reference>
              <el-button
                type="danger"
                :icon="menuStore.iconComponents.Delete"
                :disabled="!selectedIds.length"
              >
                <template #default v-if="!menuStore.isMobile">批量删除</template>
              </el-button>
            </template>
          </el-popconfirm>
        </div>
        <div class="operation-container-right">
          <IconButton
            icon="HOutline:ArrowsPointingOutIcon"
            tooltip="全屏"
            placement="top"
            @click="toggleFullscreen"
            v-if="!menuStore.isMobile"
          />
          <IconButton
            icon="HOutline:ArrowUpTrayIcon"
            tooltip="导入"
            placement="top"
            @click="gridRef?.openImport()"
          />
          <IconButton
            icon="HOutline:ArrowDownTrayIcon"
            tooltip="导出"
            placement="top"
            @click="gridRef?.openExport()"
          />
          <IconButton
            icon="HOutline:PrinterIcon"
            tooltip="打印"
            placement="top"
            @click="gridRef?.openPrint()"
          />
          <IconButton
            icon="HOutline:ArrowPathIcon"
            tooltip="刷新"
            placement="top"
            @click="getList()"
          />
          <IconButton
            icon="HOutline:Cog6ToothIcon"
            tooltip="列设置"
            placement="top"
            @click="gridRef?.openCustom()"
          />
        </div>
      </div>

      <vxe-grid v-bind="gridConfig" ref="gridRef" @checkbox-change="handleCheckboxChange">
        <template #column-operation="{ row }">
          <el-button
            type="primary"
            :icon="menuStore.iconComponents.Edit"
            link
            @click="vxeTableCreateRef?.showDialog(row)"
            v-permission="['role:edit']"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="确定要删除选中的数据吗？"
            :placement="POPCONFIRM_CONFIG.placement"
            :width="POPCONFIRM_CONFIG.width"
            :teleported="!isFullscreen"
            @confirm="deleteDataHandle([row.id])"
          >
            <template #reference>
              <el-button type="danger" :icon="menuStore.iconComponents.Delete" link>
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
        <!-- 操作按钮自定义slot -->
        <!-- <template #operation-left>
          <el-button type="primary" :icon="menuStore.iconComponents.Plus">新增数据 </el-button>
          <el-popconfirm
            title="确定要删除选中的数据吗？"
            :placement="POPCONFIRM_CONFIG.placement"
            :width="POPCONFIRM_CONFIG.width"
          >
            <template #reference>
              <el-button type="danger" :icon="menuStore.iconComponents.Delete">批量删除 </el-button>
            </template>
          </el-popconfirm>
        </template> -->
        <!-- 工具栏按钮自定义slot -->
        <!-- <template #operation-right>
          <vxe-button
            circle
            :icon="isFullscreen ? 'vxe-icon-minimize' : 'vxe-icon-fullscreen'"
            class="operation-right-button"
            @click="toggleFullscreen"
            v-if="!menuStore.isMobile"
          />
        </template> -->
      </vxe-grid>
      <div class="pagination-container" ref="paginationRef">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :layout="
            menuStore.isMobile ? PAGINATION_CONFIG.mobileLayout : PAGINATION_CONFIG.desktopLayout
          "
          :page-sizes="PAGINATION_CONFIG.pageSizes"
          :total="pagination.total"
          @change="getList"
          :teleported="!isFullscreen"
          :pager-count="
            menuStore.isMobile
              ? PAGINATION_CONFIG.mobilePagerCount
              : PAGINATION_CONFIG.desktopPagerCount
          "
        />
      </div>

      <VxeTableCreate ref="vxeTableCreateRef" @refresh="refresh" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { useTableHeight } from '@/composables/useTableHeight'
import { POPCONFIRM_CONFIG, PAGINATION_CONFIG } from '@/config/elementConfig'
import IconButton from '@/components/button/IconButton.vue'
import VxeTableCreate from '@/views/demo/vxeTable/create.vue'
import type { VxeGridProps, VxeGridInstance } from 'vxe-table'
import type { FormInstance } from 'element-plus'

defineOptions({ name: 'VxeTableView' })

const menuStore = useMenuStore()

const gridRef = useTemplateRef<VxeGridInstance>('gridRef')
const vxeTableCardRef = useTemplateRef('vxeTableCardRef')
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const queryFormCardRef = useTemplateRef<HTMLElement>('queryFormCardRef')
const paginationRef = useTemplateRef<HTMLElement>('paginationRef')
const operationContainerRef = useTemplateRef<HTMLElement>('operationContainerRef')
const vxeTableCreateRef = useTemplateRef<InstanceType<typeof VxeTableCreate> | null>(
  'vxeTableCreateRef',
)
// 全屏功能
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(vxeTableCardRef)

// 动态计算表格高度
const tableHeight = useTableHeight(queryFormCardRef, paginationRef, operationContainerRef, {
  tableCardPadding: 21,
  isFullscreenRef: isFullscreen,
})

// 性别选项
const sexOptions = [
  { label: '男', value: '0' },
  { label: '女', value: '1' },
]

// 年龄选项
const ageOptions = [
  { label: '大于18岁', value: 18 },
  { label: '大于30岁', value: 30 },
  { label: '大于50岁', value: 50 },
]

const queryForm = ref({
  name: '',
  sex: '',
  age: undefined,
})

// 分页
const pagination = ref({
  page: 1,
  pageSize: 20,
  total: 0,
})

// 表格数据类型
interface TableRowData {
  id: number
  name: string
  role: string
  sex: string
  age: number
  address: string
}

// 选中的记录（响应式）
const selectedRecords = ref<TableRowData[]>([])

// 选中的 ID 数组（计算属性）
const selectedIds = computed(() => {
  return selectedRecords.value.map((item) => String(item.id))
})

// 处理复选框变化事件
const handleCheckboxChange = ({ records }: { records: TableRowData[] }) => {
  selectedRecords.value = records
}

const gridConfig = ref<VxeGridProps>({
  loading: false,
  height: tableHeight.value, // 表格高度
  printConfig: {}, // 打印配置
  importConfig: {}, // 导入数据配置
  exportConfig: {}, // 导出数据配置
  // // 工具栏配置
  // toolbarConfig: {
  //   custom: true, // 自定义工具栏
  //   zoom: false, // 最大化显示
  //   print: true, // 打印
  //   import: true, // 导入数据
  //   export: true, // 导出数据
  //   refresh: true, // 刷新数据
  //   slots: {
  //     buttons: 'operation-left', // 操作按钮自定义slot
  //     tools: 'operation-right', // 工具栏按钮自定义slot
  //   },
  // },
  // 复选框配置
  checkboxConfig: {
    labelField: 'id', // 复选框的值
    highlight: true, // 高亮选中行
    range: true, // 支持范围选择
    isShiftKey: true, // 支持shift键选择
  },
  // 行配置
  rowConfig: {
    isHover: true, // 支持鼠标悬停
    drag: true, // 支持拖拽
  },
  columns: [
    {
      type: 'seq',
      width: 50,
      fixed: 'left', // 固定在左侧
    },
    { type: 'checkbox', width: 140, title: 'ID' },
    {
      field: 'name',
      title: '姓名',
      sortable: true, // 支持排序
      dragSort: true, // 支持拖拽排序
      minWidth: 120,
    },
    {
      field: 'sex',
      title: '性别',
      filters: sexOptions, // 支持过滤
      filterMultiple: false, // 支持单选过滤
      minWidth: 120,
      // 格式化性别
      formatter({ cellValue }) {
        const item = sexOptions.find((item) => item.value === cellValue)
        return item ? item.label : ''
      },
    },
    {
      field: 'age',
      title: '年龄',
      sortable: true,
      filters: ageOptions,
      filterMultiple: false,
      filterMethod: ({ value, row }) => row.age >= value,
      minWidth: 120,
    },
    { field: 'address', title: '地址', minWidth: 120, showOverflow: true },
    {
      title: '操作',
      minWidth: 150,
      fixed: 'right',
      slots: {
        default: 'column-operation',
      },
    },
  ],
  data: [],
})

// 监听表格高度变化，更新 gridConfig
watch(tableHeight, (newHeight) => {
  gridConfig.value.height = newHeight
})

// 随机工具函数
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const roleOptions = ['Develop', 'Test', 'PM', 'Designer']
const addressOptions = [
  'GuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhou',
  'Shanghai',
  'Shenzhen',
  'Beijing',
  'Hangzhou',
  'Chengdu',
]

// 模拟请求接口，随机生成数据
const getList = async () => {
  gridConfig.value.loading = true

  try {
    // 模拟接口耗时
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { page, pageSize } = pagination.value

    const list = Array.from({ length: pageSize }, (_, index) => {
      const id = (page - 1 + 1000) * pageSize + index + 1

      return {
        id,
        name: `Test${id}`,
        role: roleOptions[randomInt(0, roleOptions.length - 1)],
        sex: Math.random() > 0.5 ? '0' : '1', // 0: 男, 1: 女
        age: randomInt(8, 60),
        address: addressOptions[randomInt(0, addressOptions.length - 1)],
      }
    })

    gridConfig.value.data = list
    pagination.value.total = 200
  } finally {
    gridConfig.value.loading = false
  }
}

// 重置查询条件并重新获取数据
const reset = () => {
  queryFormRef.value?.resetFields()
  pagination.value.page = 1
  getList()
}

// 删除数据
const deleteDataHandle = (ids: string[]) => {
  ElMessage.success(`删除成功${ids}`)
  // 清空选中状态
  selectedRecords.value = []
  gridRef.value?.clearCheckboxRow()
  getList()
}

// 刷新
const refresh = (type: 'create' | 'update') => {
  pagination.value.page = type === 'create' ? 1 : pagination.value.page
  getList()
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.vxe-table-view-container {
  flex: 1;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.operation-right-button {
  margin-right: 0.5rem !important;
}

.operation-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .operation-container-right {
    display: flex;
    align-items: center;
  }
}
</style>
