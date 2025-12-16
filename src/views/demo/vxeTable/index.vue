<template>
  <div style="flex: 1; overflow: hidden; width: 100%; height: 100%">
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

    <el-card shadow="never" class="card-mt-16">
      <vxe-grid v-bind="gridConfig" ref="gridRef">
        <template #operation-left>
          <el-button type="primary" :icon="menuStore.iconComponents.Plus">新增数据</el-button>
          <el-popconfirm
            title="确定要删除选中的数据吗？"
            :placement="POPCONFIRM_CONFIG.placement"
            :width="POPCONFIRM_CONFIG.width"
          >
            <template #reference>
              <el-button type="danger" :icon="menuStore.iconComponents.Delete">
                批量删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
        <!-- 工具栏按钮自定义slot -->
        <!-- <template #operation-right>
          <el-button
            :icon="menuStore.iconComponents['HOutline:ArrowUpTrayIcon']"
            circle
            @click="gridRef?.openImport()"
          />
          <el-button
            :icon="menuStore.iconComponents['HOutline:ArrowDownTrayIcon']"
            circle
            @click="gridRef?.openExport()"
          />
          <el-button
            :icon="menuStore.iconComponents['HOutline:PrinterIcon']"
            circle
            @click="gridRef?.openPrint()"
          />
          <el-button
            :icon="menuStore.iconComponents['HOutline:ArrowPathIcon']"
            circle
            @click="getList"
          />
          <el-button
            :icon="menuStore.iconComponents['HOutline:ArrowsPointingOutIcon']"
            circle
            @click="(gridRef?.zoom(), console.log(gridRef?.isMaximized()))"
          />
          <el-button
            :icon="menuStore.iconComponents['HOutline:Cog6ToothIcon']"
            circle
            @click="gridRef?.openCustom()"
          />
        </template> -->
      </vxe-grid>
      <div class="pagination-container" ref="paginationRef">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :layout="PAGINATION_CONFIG.layout"
          :page-sizes="PAGINATION_CONFIG.pageSizes"
          :total="pagination.total"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { POPCONFIRM_CONFIG, PAGINATION_CONFIG } from '@/config/elementConfig'
import type { VxeGridProps, VxeGridInstance } from 'vxe-table'
import { useTableHeight } from '@/composables/useTableHeight'

defineOptions({ name: 'VxeTableView' })

const menuStore = useMenuStore()

const gridRef = useTemplateRef<VxeGridInstance>('gridRef')
const queryFormCardRef = useTemplateRef<HTMLElement>('queryFormCardRef')
const paginationRef = useTemplateRef<HTMLElement>('paginationRef')

// 动态计算表格高度
const tableHeight = useTableHeight(queryFormCardRef, paginationRef, { tableCardPadding: 22 })

// 性别选项
const sexOptions = [
  { label: '男', value: '0' },
  { label: '女', value: '1' },
]

// 年龄选项
const ageOptions = [
  { label: '大于16岁', value: 16 },
  { label: '大于30岁', value: 30 },
]

const queryForm = ref({
  name: '',
  sex: '',
  age: undefined,
})

// 分页
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
})

const gridConfig = ref<VxeGridProps>({
  height: tableHeight.value, // 表格高度
  printConfig: {}, // 打印配置
  importConfig: {}, // 导入数据配置
  exportConfig: {}, // 导出数据配置
  // 工具栏配置
  toolbarConfig: {
    custom: true, //
    zoom: true, // 最大化显示
    print: true, // 打印
    import: true, // 导入数据
    export: true, // 导出数据
    refresh: true, // 刷新数据
    slots: {
      buttons: 'operation-left',
      // tools: 'operation-right', // 工具栏按钮自定义slot
    },
  },
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
      width: 70,
      fixed: 'left', // 固定在左侧
    },
    { type: 'checkbox', width: 140, title: 'ID' },
    {
      field: 'name',
      title: '姓名',
      sortable: true, // 支持排序
      dragSort: true, // 支持拖拽排序
    },
    {
      field: 'sex',
      title: '性别',
      filters: sexOptions, // 支持过滤
      filterMultiple: false, // 支持单选过滤
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
    },
    { field: 'address', title: '地址地址地址地址地址', showOverflow: true, fixed: 'right' },
  ],
  data: [
    {
      id: 10001,
      name: 'Test1',
      role: 'Develop',
      sex: '0',
      age: 28,
      address: 'test abctest abctest abctest abctest abctest abctest abc',
    },
    { id: 10002, name: 'Test2', role: 'Test', sex: '1', age: 22, address: 'Guangzhou' },
    { id: 10003, name: 'Test3', role: 'PM', sex: '0', age: 32, address: 'Shanghai' },
    { id: 10004, name: 'Test4', role: 'Designer', sex: '1', age: 23, address: 'test abc' },
    { id: 10005, name: 'Test5', role: 'Develop', sex: '1', age: 30, address: 'Shanghai' },
    { id: 10006, name: 'Test6', role: 'Designer', sex: '1', age: 21, address: 'test abc' },
    { id: 10007, name: 'Test7', role: 'Test', sex: '0', age: 29, address: 'test abc' },
    { id: 10008, name: 'Test8', role: 'Develop', sex: '0', age: 35, address: 'test abc' },
    { id: 10009, name: 'Test9', role: 'Test', sex: '1', age: 21, address: 'test abc' },
    { id: 10010, name: 'Test10', role: 'Develop', sex: '0', age: 28, address: 'test abc' },
    { id: 10011, name: 'Test11', role: 'Test', sex: '0', age: 29, address: 'test abc' },
    { id: 10012, name: 'Test12', role: 'Develop', sex: '1', age: 27, address: 'test abc' },
    { id: 10013, name: 'Test13', role: 'Test', sex: '0', age: 24, address: 'test abc' },
    { id: 10014, name: 'Test14', role: 'Develop', sex: '1', age: 34, address: 'test abc' },
    { id: 10015, name: 'Test15', role: 'Test', sex: '1', age: 21, address: 'test abc' },
    { id: 10016, name: 'Test16', role: 'Develop', sex: '0', age: 20, address: 'test abc' },
    { id: 10017, name: 'Test17', role: 'Test', sex: '1', age: 31, address: 'test abc' },
    { id: 10018, name: 'Test18', role: 'Develop', sex: '0', age: 32, address: 'test abc' },
    { id: 10019, name: 'Test19', role: 'Test', sex: '1', age: 37, address: 'test abc' },
    { id: 10020, name: 'Test20', role: 'Develop', sex: '1', age: 41, address: 'test abc' },
  ],
})

const getList = async () => {}

const reset = () => {}

// 监听表格高度变化，更新 gridConfig
watch(tableHeight, (newHeight) => {
  gridConfig.value.height = newHeight
})
</script>

<style></style>
