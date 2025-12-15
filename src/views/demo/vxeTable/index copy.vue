<template>
  <div style="flex: 1; overflow: hidden; width: 100%; height: 100%">
    <!-- <el-button @click="getGirdInstance">gird实例</el-button> -->
    <vxe-grid
      v-bind="gridConfig"
      ref="gridRef"
      @page-change="handlePageChange"
      @form-submit="handleFormSubmit"
    >
      <template #loading>
        <img src="https://vxeui.com/resource/img/546.gif" style="width: 100px" />
        <div>正在加载中，请稍后...</div>
      </template>
    </vxe-grid>
  </div>
</template>

<script setup lang="ts">
import type { VxeGridProps, VxeGridInstance } from 'vxe-table'

defineOptions({ name: 'VxeTable' })

const gridRef = useTemplateRef<VxeGridInstance>('gridRef')

const getGirdInstance = () => {
  console.log(gridRef.value?.getCheckboxRecords(true))
}

const sexOptions = [
  { label: '男', value: '0' },
  { label: '女', value: '1' },
]

const ageOptions = [
  { label: '大于16岁', value: 16 },
  { label: '大于26岁', value: 26 },
  { label: '大于30岁', value: 30 },
]

const allList = ref([
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
])

const pagination = ref<VxeGridProps['pagerConfig']>({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  layouts: [
    'Home',
    'PrevJump',
    'PrevPage',
    'Number',
    'NextPage',
    'NextJump',
    'End',
    'Sizes',
    'FullJump',
    'Total',
  ],
})

const gridConfig = ref<VxeGridProps>({
  border: true,
  stripe: true,
  loading: false,
  autoResize: true,
  showHeaderOverflow: true,
  toolbarConfig: {
    // 方式1
    custom: true,
    print: true,
    zoom: true,
    import: true,
    export: true,
  },
  printConfig: {},
  importConfig: {},
  exportConfig: {},
  columnConfig: {
    resizable: true,
    minWidth: 100,
  },
  rowConfig: {
    isHover: true,
    drag: true,
  },
  checkboxConfig: {
    labelField: 'id',
    highlight: true,
    range: true,
    isShiftKey: true,
  },
  data: [],
  height: '100%',
  formConfig: {
    data: {
      name: '',
      sex: '',
      age: '',
    },
    items: [
      { field: 'name', title: '名称', span: 6, itemRender: { name: 'VxeInput' } },
      {
        field: 'sex',
        title: '性别',
        itemRender: { name: 'VxeSelect', options: sexOptions },
      },
      { field: 'age', title: '年龄', itemRender: { name: 'VxeNumberInput' } },
      {
        itemRender: {
          name: 'VxeButtonGroup',
          options: [
            { type: 'submit', content: '搜索', status: 'primary' },
            { type: 'reset', content: '重置' },
          ],
        },
      },
    ],
  },
  columns: [
    {
      type: 'seq',
      width: 70,
      fixed: 'left',
    },
    { type: 'checkbox', width: 140, title: 'ID' },
    { field: 'name', title: '名称', sortable: true, dragSort: true },
    {
      field: 'sex',
      title: '性别',
      filters: sexOptions,
      filterMultiple: false,
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
  seqConfig: {
    seqMethod({ rowIndex }) {
      const { pageSize, currentPage } = pagination.value!
      return (currentPage! - 1) * pageSize! + rowIndex + 1
    },
  },
  pagerConfig: pagination.value,
})

const loadList = async () => {
  gridConfig.value.loading = true
  const { pageSize, currentPage } = pagination.value!
  await delay(1000)
  gridConfig.value.data = allList.value.slice(
    (currentPage! - 1) * pageSize!,
    currentPage! * pageSize!,
  )
  pagination.value!.total = allList.value.length
  gridConfig.value.loading = false
}

const handlePageChange = async ({
  pageSize,
  currentPage,
}: {
  pageSize: number
  currentPage: number
}) => {
  console.log(`output->`, pageSize, currentPage)
  pagination.value!.pageSize = pageSize
  pagination.value!.currentPage = currentPage
  await loadList()
}

const handleFormSubmit = async ({ data }: { data: Record<string, unknown> }) => {
  console.log(`output->`, data)
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(() => {
  loadList()
})
</script>

<style></style>
