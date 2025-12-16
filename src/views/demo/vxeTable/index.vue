<template>
  <div style="flex: 1; overflow: hidden; width: 100%; height: 100%">
    <el-card shadow="never" class="card-clear-mb">
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
    <el-button @click="aaa">gird实例导出</el-button>

    <el-card shadow="never" class="card-mt-16">
      <vxe-grid v-bind="gridConfig" ref="gridRef" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { VxeGridProps, VxeGridInstance } from 'vxe-table'

defineOptions({ name: 'VxeTableView' })

const menuStore = useMenuStore()

const gridRef = useTemplateRef<VxeGridInstance>('gridRef')

const aaa = () => {
  console.log(gridRef.value)
  gridRef.value?.openCustom()
}

const queryForm = ref({
  name: '',
  sex: '',
  age: undefined,
})

const sexOptions = [
  { label: '男', value: '0' },
  { label: '女', value: '1' },
]

const ageOptions = [
  { label: '大于16岁', value: 16 },
  { label: '大于26岁', value: 26 },
  { label: '大于30岁', value: 30 },
]

const gridConfig = ref<VxeGridProps>({
  id: 'toolbar_demo_1',
  toolbarConfig: {
    // 方式1
    custom: true,
    buttons: [
      // 方式2
      { name: '自定义个性化列按钮', code: 'custom', round: true, status: 'primary' },
    ],
    tools: [
      // 方式3
      { name: '自定义个性化列按钮', code: 'custom', status: 'success' },
    ],
  },

  checkboxConfig: {
    labelField: 'id',
    highlight: true,
    range: true,
    isShiftKey: true,
  },
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
  columns: [
    {
      type: 'seq',
      width: 70,
      fixed: 'left',
    },
    { type: 'checkbox', width: 140, title: 'ID' },
    { field: 'name', title: '菜单标题', sortable: true, dragSort: true },
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
})

const getList = async () => {}

const reset = () => {}
</script>

<style></style>
