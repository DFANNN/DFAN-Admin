<template>
  <div>
    <BasePage
      :formConfig="pageSearchConfig"
      :table-data="roleList"
      :columns="columns"
      :total="total"
      @refresh="getRole"
    >
      <template #status="{ row }">
        <BaseTag
          :type="row.status === 'active' ? 'success' : 'danger'"
          :text="row.status === 'active' ? '启用' : '禁用'"
        />
      </template>
      <template #description="{ row }">
        <div>{{ row.description ? row.description : '/' }}</div>
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link>编辑</el-button>
        <el-button type="danger" link>删除</el-button>
      </template>
    </BasePage>
  </div>
</template>

<script setup lang="ts">
import { rolePage } from '@/api/role'

defineOptions({
  name: '403View',
})

// 表单配置类型
interface IPageSearchConfig {
  label: string // 表单label
  type: 'elInput' | 'elInputNumber' | 'elSelect' | 'elDatePicker' // 要渲染的表单组件
  prop: string // 表单字段名
  defaultValue?: unknown // 表单字段默认值
  attrs?: Record<string, unknown> // 组件属性
}

const pageSearchConfig: IPageSearchConfig[] = [
  { label: '输入框', type: 'elInput', prop: 'name', defaultValue: '1' },
  { label: '数字输入框', type: 'elInputNumber', prop: 'number', defaultValue: 0 },
  {
    label: '下拉框/多选',
    type: 'elSelect',
    prop: 'status',
    defaultValue: 1,
    attrs: {
      placeholder: '请选择',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 2 },
      ],
    },
  },
]

const roleList = ref([])
const total = ref(0)

const columns = ref([
  { type: 'selection' },
  { type: 'index', label: '序号' },
  { prop: 'name', label: '角色名称', fixed: false },
  { prop: 'code', label: '角色编码' },
  { prop: 'status', label: '状态' },
  { prop: 'description', label: '角色描述' },
  { prop: 'createTime', label: '创建时间' },
  { prop: 'operation', label: '操作', width: 150, fixed: 'right' },
])

const getRole = async (queryForm: unknown, page: number, pageSize: number) => {
  const params = {
    page,
    pageSize,
  }
  const { data: res } = await rolePage(params)
  console.log(`output->res`, res)
  if (res.code !== 200) return
  roleList.value = res.data?.list || []
  total.value = res.data?.total || 0
}
</script>

<style></style>
