<template>
  <div class="base-page-doc-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">BasePage 组件演示</span>
          <div class="card-description">
            <p>
              <code>BasePage</code>
              是一个面向后台列表页的页面级封装组件，内置查询表单、表格工具栏、数据表格、分页器，以及刷新、导出、打印、列设置、密度切换等常用能力。
            </p>
            <p class="description-text">
              适用于“搜索 + 表格 + 分页”的标准管理页面。父组件只需要传入
              <code>formConfig</code>、<code>columns</code>、<code>tableData</code>、<code
                >total</code
              >
              等配置，并监听 <code>refresh</code> 事件即可。
            </p>
          </div>
        </div>
      </template>

      <div class="form-container">
        <div class="section-title">BasePage 效果预览</div>
        <p class="preview-description">
          下方演示了一个完整列表页：包含搜索、重置、搜索区域展开/折叠、工具栏插槽、表格列插槽、分页、排序和
          selection-change 事件。
        </p>

        <BasePage
          ref="basePageRef"
          :form-config="searchFormConfig"
          :form-initial-visible-count="2"
          :table-data="tableData"
          :columns="columns"
          :total="total"
          :table-loading="loading"
          @refresh="getList"
          @selection-change="handleSelectionChange"
        >
          <template #tableOperationLeft>
            <el-button type="primary" @click="handleCreate">新增数据</el-button>
            <el-button type="danger" :disabled="!selectedIds.length" @click="handleBatchDelete">
              批量删除
            </el-button>
          </template>

          <template #tableOperationRight>
            <BaseTag type="info" :text="`已选 ${selectedIds.length} 项`" />
          </template>

          <template #status="{ row }">
            <BaseTag
              :type="row.status === 'active' ? 'success' : 'danger'"
              :text="row.status === 'active' ? '启用' : '禁用'"
            />
          </template>

          <template #operation="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </BasePage>

        <el-divider />

        <div class="usage-section">
          <div class="section-title">基础用法</div>
          <div class="usage-code">
            <pre><code>&lt;BasePage
  ref="basePageRef"
  :form-config="searchFormConfig"
  :form-initial-visible-count="2"
  :table-data="tableData"
  :columns="columns"
  :total="total"
  :table-loading="loading"
  @refresh="getList"
  @selection-change="handleSelectionChange"
&gt;
  &lt;template #tableOperationLeft&gt;
    &lt;el-button type="primary" @click="handleCreate"&gt;新增数据&lt;/el-button&gt;
    &lt;el-button type="danger" :disabled="!selectedIds.length" @click="handleBatchDelete"&gt;
      批量删除
    &lt;/el-button&gt;
  &lt;/template&gt;

  &lt;template #tableOperationRight&gt;
    &lt;el-tag type="info"&gt;已选 &#123;&#123; selectedIds.length &#125;&#125; 项&lt;/el-tag&gt;
  &lt;/template&gt;

  &lt;template #status="{ row }"&gt;
    &lt;el-tag :type="row.status === 'active' ? 'success' : 'danger'"&gt;
      &#123;&#123; row.status === 'active' ? '启用' : '禁用' &#125;&#125;
    &lt;/el-tag&gt;
  &lt;/template&gt;

  &lt;template #operation="{ row }"&gt;
    &lt;el-button link type="primary" @click="handleEdit(row)"&gt;编辑&lt;/el-button&gt;
    &lt;el-button link type="danger" @click="handleDelete(row)"&gt;删除&lt;/el-button&gt;
  &lt;/template&gt;
&lt;/BasePage&gt;</code></pre>
          </div>

          <p class="usage-description">
            <code>formConfig</code> 决定搜索区域展示内容；<code>columns</code> 决定表格列；<code
              >refresh</code
            >
            事件统一承接数据请求。
          </p>

          <div class="usage-code">
            <pre><code>const searchFormConfig = ref([
  { label: '用户名', prop: 'username', type: 'elInput', attrs: { placeholder: '请输入用户名' } },
  { label: '昵称', prop: 'nickname', type: 'elInput', attrs: { placeholder: '请输入昵称' } },
  {
    label: '状态',
    prop: 'status',
    type: 'elSelect',
    attrs: {
      placeholder: '请选择状态',
      clearable: true,
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
      ],
    },
  },
])

// 配合 :form-initial-visible-count="2" 使用时
// 默认先展示前 2 个搜索项，可点击“展开/收起”查看第 3 个搜索项
const columns = ref([
  { type: 'selection', width: 55 },
  { type: 'index', label: '序号', width: 60 },
  { prop: 'username', label: '用户名', minWidth: 160 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'createTime', label: '创建时间', minWidth: 180, sortable: 'custom' },
  { prop: 'operation', label: '操作', width: 140 },
])

const getList = async (queryForm, page, pageSize, sortField, sortOrder) =&gt; {
  const params = { ...queryForm, page, pageSize, sortField, sortOrder }
  // 请求列表数据
}</code></pre>
          </div>
        </div>

        <el-divider />

        <div class="usage-section">
          <div class="section-title">事件说明</div>
          <p class="usage-description">
            <code>BasePage</code> 对外提供了两个核心事件，用于统一承接列表数据请求和表格选中项变化。
          </p>
          <div class="comparison-table">
            <el-table :data="eventsTableData" border style="width: 100%">
              <el-table-column prop="name" label="事件名" width="180">
                <template #default="{ row }"
                  ><strong>{{ row.name }}</strong></template
                >
              </el-table-column>
              <el-table-column prop="params" label="回调参数" min-width="280">
                <template #default="{ row }"
                  ><code>{{ row.params }}</code></template
                >
              </el-table-column>
              <el-table-column prop="description" label="说明" min-width="260" />
            </el-table>
          </div>
        </div>

        <el-divider />

        <div class="usage-section">
          <div class="section-title">插槽说明</div>
          <p class="usage-description">
            <code>BasePage</code> 支持页面工具栏插槽和表格列插槽，满足大部分后台列表页的自定义需求。
          </p>
          <div class="comparison-table">
            <el-table :data="slotsTableData" border style="width: 100%">
              <el-table-column prop="name" label="插槽名" width="180">
                <template #default="{ row }"
                  ><strong>{{ row.name }}</strong></template
                >
              </el-table-column>
              <el-table-column prop="params" label="插槽参数" width="220">
                <template #default="{ row }"
                  ><code>{{ row.params }}</code></template
                >
              </el-table-column>
              <el-table-column prop="description" label="说明" min-width="320" />
            </el-table>
          </div>
        </div>

        <el-divider />

        <div class="usage-section">
          <div class="section-title">组件方法说明</div>
          <p class="usage-description">
            通过 <code>ref</code> 可以调用
            <code>BasePage</code> 暴露出来的方法，常用于新增、编辑、删除成功后的页面刷新。
          </p>
          <div class="comparison-table">
            <el-table :data="methodsTableData" border style="width: 100%">
              <el-table-column prop="name" label="方法名" width="220">
                <template #default="{ row }"
                  ><strong>{{ row.name }}</strong></template
                >
              </el-table-column>
              <el-table-column prop="params" label="参数" width="180">
                <template #default="{ row }"
                  ><code>{{ row.params }}</code></template
                >
              </el-table-column>
              <el-table-column prop="description" label="说明" min-width="300" />
            </el-table>
          </div>

          <div class="usage-code">
            <pre><code>const basePageRef = useTemplateRef('basePageRef')

const refreshHandle = (type: 'create' | 'update' | 'delete', deleteCount?: number) =&gt; {
  if (type === 'create') {
    basePageRef.value?.refreshToFirstPage()
  } else if (type === 'update') {
    basePageRef.value?.refreshCurrentPage()
  } else {
    basePageRef.value?.refreshAfterDelete(deleteCount || 1)
  }
}</code></pre>
          </div>
        </div>

        <el-divider />

        <div class="usage-section">
          <div class="section-title">formConfig 配置项介绍</div>
          <p class="usage-description">
            <code>formConfig</code> 的每一项都对应一个查询表单字段，类型定义来自
            <code>IFormConfig</code>。
          </p>
          <div class="comparison-table">
            <el-table :data="formConfigTableData" border style="width: 100%">
              <el-table-column prop="name" label="属性名" width="180">
                <template #default="{ row }"
                  ><strong>{{ row.name }}</strong></template
                >
              </el-table-column>
              <el-table-column prop="type" label="类型" width="220">
                <template #default="{ row }"
                  ><code>{{ row.type }}</code></template
                >
              </el-table-column>
              <el-table-column prop="default" label="默认值" width="150">
                <template #default="{ row }"
                  ><code>{{ row.default }}</code></template
                >
              </el-table-column>
              <el-table-column prop="description" label="说明" min-width="240" />
            </el-table>
          </div>
        </div>

        <el-divider />

        <div class="usage-section">
          <div class="section-title">columns 配置项介绍</div>
          <p class="usage-description">
            <code>columns</code> 用于描述表格列配置，类型定义来自 <code>ITableColumns</code>。
            除了下面这些常用字段外，也支持继续透传 Element Plus <code>el-table-column</code>
            的其他属性。
          </p>
          <div class="comparison-table">
            <el-table :data="columnsTableData" border style="width: 100%">
              <el-table-column prop="name" label="属性名" width="180">
                <template #default="{ row }"
                  ><strong>{{ row.name }}</strong></template
                >
              </el-table-column>
              <el-table-column prop="type" label="类型" width="220">
                <template #default="{ row }"
                  ><code>{{ row.type }}</code></template
                >
              </el-table-column>
              <el-table-column prop="default" label="默认值" width="150">
                <template #default="{ row }"
                  ><code>{{ row.default }}</code></template
                >
              </el-table-column>
              <el-table-column prop="description" label="说明" min-width="240" />
            </el-table>
          </div>
        </div>

        <el-divider />

        <div class="usage-section">
          <div class="section-title">组件属性介绍</div>
          <div class="comparison-table">
            <el-table :data="propsTableData" border style="width: 100%">
              <el-table-column prop="name" label="属性名" width="180">
                <template #default="{ row }"
                  ><strong>{{ row.name }}</strong></template
                >
              </el-table-column>
              <el-table-column prop="type" label="类型" width="220">
                <template #default="{ row }"
                  ><code>{{ row.type }}</code></template
                >
              </el-table-column>
              <el-table-column prop="default" label="默认值" width="150">
                <template #default="{ row }"
                  ><code>{{ row.default }}</code></template
                >
              </el-table-column>
              <el-table-column prop="description" label="说明" min-width="240" />
            </el-table>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { IFormConfig } from '@/types/components/page'

defineOptions({ name: 'BasePageDocView' })

interface IUserItem {
  id: number
  username: string
  nickname: string
  status: 'active' | 'inactive'
  age: number
  createTime: string
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const sourceData: IUserItem[] = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  username: `user_${String(index + 1).padStart(2, '0')}`,
  nickname: `演示用户${index + 1}`,
  status: index % 3 === 0 ? 'inactive' : 'active',
  age: 20 + (index % 10),
  createTime: `2026-04-${String((index % 28) + 1).padStart(2, '0')} 10:${String(index % 60).padStart(2, '0')}:00`,
}))

const searchFormConfig = ref<IFormConfig[]>([
  { label: '用户名', prop: 'username', type: 'elInput', attrs: { placeholder: '请输入用户名' } },
  { label: '昵称', prop: 'nickname', type: 'elInput', attrs: { placeholder: '请输入昵称' } },
  {
    label: '状态',
    prop: 'status',
    type: 'elSelect',
    attrs: {
      placeholder: '请选择状态',
      clearable: true,
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
      ],
    },
  },
])

const columns = ref([
  { type: 'selection', width: 55 },
  { type: 'index', label: '序号', width: 60 },
  { prop: 'username', label: '用户名', minWidth: 160 },
  { prop: 'nickname', label: '昵称', minWidth: 140 },
  { prop: 'age', label: '年龄', width: 100 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'createTime', label: '创建时间', minWidth: 180, sortable: 'custom' },
  { prop: 'operation', label: '操作', width: 140, fixed: 'right' },
])

const tableData = ref<IUserItem[]>([])
const total = ref(0)
const loading = ref(false)
const selectedIds = ref<number[]>([])

const getList = async (
  queryForm: Record<string, unknown>,
  page: number,
  pageSize: number,
  sortField?: string,
  sortOrder?: 'asc' | 'desc' | '',
) => {
  loading.value = true
  try {
    await delay(500)
    let list = [...sourceData]
    if (queryForm.username)
      list = list.filter((item) => item.username.includes(String(queryForm.username)))
    if (queryForm.nickname)
      list = list.filter((item) => item.nickname.includes(String(queryForm.nickname)))
    if (queryForm.status) list = list.filter((item) => item.status === queryForm.status)
    if (sortField === 'createTime' && sortOrder) {
      list.sort((a, b) => {
        const timeA = new Date(a.createTime).getTime()
        const timeB = new Date(b.createTime).getTime()
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA
      })
    }
    total.value = list.length
    tableData.value = list.slice((page - 1) * pageSize, page * pageSize)
  } finally {
    loading.value = false
  }
}

const handleSelectionChange = (rows: Record<string, unknown>[]) => {
  selectedIds.value = rows.map((item) => Number(item.id))
}

const handleCreate = () => ElMessage.success('这里可以打开新增弹窗')
const handleEdit = (row: IUserItem) => ElMessage.success(`模拟编辑：${row.username}`)
const handleDelete = (row: IUserItem) => ElMessage.success(`模拟删除：${row.username}`)
const handleBatchDelete = () => ElMessage.success(`当前选中了 ${selectedIds.value.length} 条数据`)

const eventsTableData = [
  {
    name: 'refresh',
    params:
      'queryForm(当前的form表单数据), page(当前页码), pageSize(每页条数), sortField(排序字段), sortOrder(排序方向)',
    description:
      '组件挂载、点击查询/重置/刷新、分页变化、表格排序变化时触发，通常用于统一请求列表数据',
  },
  {
    name: 'selection-change',
    params: 'selection(当前选中的行数据数组)',
    description: '表格勾选项变化时触发，返回当前选中的行数据数组',
  },
]

const slotsTableData = [
  {
    name: 'tableOperationLeft',
    params: '-',
    description: '表格顶部工具栏左侧区域，通常放新增、批量删除等操作按钮',
  },
  {
    name: 'tableOperationRight',
    params: '-',
    description: '表格顶部工具栏右侧自定义区域，位于内置工具按钮左侧',
  },
  {
    name: '[列 prop 名]',
    params: 'scope',
    description:
      "表格列插槽，插槽名与列配置中的 prop 对应，例如列配置为 { prop: 'status', label: '状态' } 时，可使用 <template #status=\"{ row }\">...</template> 自定义该列内容",
  },
]

const methodsTableData = [
  {
    name: 'refreshCurrentPage',
    params: '-',
    description: '保持当前查询条件、页码和排序状态刷新，适合编辑成功后使用',
  },
  {
    name: 'refreshAfterDelete',
    params: 'deleteCount = 1',
    description: '删除后智能刷新；如果当前页删空且不是第一页，会自动回退到上一页',
  },
  {
    name: 'refreshToFirstPage',
    params: '-',
    description: '回到第一页并刷新，适合新增成功后使用',
  },
  {
    name: 'resetAndRefresh',
    params: '-',
    description: '重置查询条件，回到第一页并刷新',
  },
]

const formConfigTableData = [
  {
    name: 'label',
    type: 'string',
    default: '-',
    description: '表单项 label 文本',
  },
  {
    name: 'type',
    type: "'elInput' | 'elInputNumber' | 'elSelect' | 'elDatePicker'",
    default: '-',
    description: '当前查询项要渲染的组件类型',
  },
  {
    name: 'prop',
    type: 'string',
    default: '-',
    description: '字段名，对应 queryForm 中的 key',
  },
  {
    name: 'defaultValue',
    type: 'unknown',
    default: '-',
    description: '字段默认值，不传则初始化为 undefined',
  },
  {
    name: 'attrs',
    type: 'Record<string, unknown>',
    default: '{}',
    description:
      '透传给当前表单组件的属性，支持透传 elInput | elInputNumber | elSelect | elDatePicker 的组件属性，例如 placeholder、clearable、options 等',
  },
]

const columnsTableData = [
  {
    name: 'visible',
    type: 'boolean',
    default: 'true',
    description: '当前列是否显示，BasePage 内部会为每列补充该字段用于列显隐控制',
  },
  {
    name: 'prop',
    type: 'string',
    default: '-',
    description: '列字段名；如果需要自定义单元格插槽，插槽名通常与该字段一致',
  },
  {
    name: 'type',
    type: 'string',
    default: '-',
    description: '列类型，如 selection（选择列）、index（序号列）、expand（展开列）等',
  },
  {
    name: 'fixed',
    type: "'left' | 'right' | boolean",
    default: 'false',
    description: '列是否固定在左侧或右侧',
  },
  {
    name: 'label',
    type: 'string',
    default: '-',
    description: '列表头显示文本',
  },
  {
    name: 'width',
    type: 'number',
    default: '-',
    description: '列宽度',
  },
  {
    name: '[key: string]',
    type: 'unknown',
    default: '-',
    description: '支持继续传入其他 el-table-column 属性，如 minWidth、sortable、align 等',
  },
]

const propsTableData = [
  {
    name: 'formConfig',
    type: 'IFormConfig[]',
    default: '-',
    description: '查询表单配置，不传则不展示搜索表单',
  },
  {
    name: 'tableData',
    type: 'Record<string, unknown>[]',
    default: '-',
    description: '表格数据源（必传）',
  },
  {
    name: 'columns',
    type: 'Record<string, unknown>[]',
    default: '-',
    description: '表格列配置（必传）',
  },
  { name: 'tableLoading', type: 'boolean', default: 'false', description: '表格加载状态' },
  { name: 'loadingDelay', type: 'number', default: '300', description: 'loading 延迟显示时间' },
  { name: 'total', type: 'number', default: '0', description: '分页总条数' },
  {
    name: 'pageSizes',
    type: 'number[]',
    default: '[10, 20, 30, 40, 50]',
    description: '分页器每页条数选项',
  },
  {
    name: 'tableAttrs',
    type: 'Record<string, unknown>',
    default: '{}',
    description: '透传 el-table 属性',
  },
  {
    name: 'paginationAttrs',
    type: 'Record<string, unknown>',
    default: '{}',
    description: '透传 el-pagination 属性',
  },
  {
    name: 'formCollapsible',
    type: 'boolean',
    default: 'true',
    description: '搜索表单是否支持展开/收起',
  },
  {
    name: 'formInitialVisibleCount',
    type: 'number',
    default: '3',
    description: '搜索表单收起时显示的查询项数量',
  },
  {
    name: 'showSearchToggle',
    type: 'boolean',
    default: 'true',
    description: '是否显示搜索显隐按钮',
  },
  { name: 'showRefresh', type: 'boolean', default: 'true', description: '是否显示刷新按钮' },
  { name: 'showExport', type: 'boolean', default: 'true', description: '是否显示导出按钮' },
  { name: 'showPrint', type: 'boolean', default: 'true', description: '是否显示打印按钮' },
  { name: 'showSize', type: 'boolean', default: 'true', description: '是否显示密度切换按钮' },
  { name: 'showColumn', type: 'boolean', default: 'true', description: '是否显示列设置按钮' },
  { name: 'showPagination', type: 'boolean', default: 'true', description: '是否显示分页器' },
]
</script>

<style scoped lang="scss">
.base-page-doc-container {
  .card-header {
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .card-description {
      margin-top: 8px;
      font-size: 0.875rem;
      color: var(--el-text-color-regular);
      line-height: 1.6;

      p {
        margin: 4px 0;
      }

      .description-text {
        color: var(--el-text-color-secondary);
        font-size: 0.8125rem;
      }

      code {
        padding: 2px 6px;
        background-color: var(--el-fill-color-light);
        border-radius: 3px;
        font-size: 0.8125rem;
        color: var(--el-color-primary);
      }
    }
  }

  .form-container {
    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 16px;
      padding-left: 8px;
      border-left: 3px solid var(--el-color-primary);
    }

    .preview-description {
      margin: 0 0 16px 0;
      color: var(--el-text-color-regular);
      font-size: 0.875rem;
      line-height: 1.6;
    }

    .el-divider {
      margin: 24px 0;
    }

    .usage-section {
      margin-top: 24px;

      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid var(--el-color-primary);
      }

      .usage-description {
        margin: 0 0 12px 0;
        color: var(--el-text-color-regular);
        font-size: 0.875rem;
        line-height: 1.6;

        code {
          padding: 2px 6px;
          background-color: var(--el-fill-color-light);
          border-radius: 3px;
          font-size: 0.8125rem;
          color: var(--el-color-primary);
        }
      }

      .usage-code {
        margin: 12px 0;

        pre {
          margin: 0;
          padding: 12px;
          background-color: var(--el-fill-color-dark);
          border-radius: 4px;
          overflow-x: auto;
          font-size: 0.8125rem;
          line-height: 1.6;

          code {
            color: var(--el-text-color-primary);
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
          }
        }
      }

      .usage-list {
        margin: 12px 0;
        padding-left: 20px;
        color: var(--el-text-color-regular);
        font-size: 0.875rem;
        line-height: 1.8;

        li {
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }

          code {
            padding: 2px 6px;
            background-color: var(--el-fill-color-light);
            border-radius: 3px;
            font-size: 0.8125rem;
            color: var(--el-color-primary);
          }
        }
      }

      .comparison-table {
        margin-top: 16px;

        :deep(.el-table) {
          .el-table__cell {
            padding: 12px 0;

            code {
              padding: 2px 6px;
              background-color: var(--el-fill-color-light);
              border-radius: 3px;
              font-size: 0.8125rem;
              color: var(--el-color-primary);
              font-family:
                'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
            }
          }
        }
      }
    }
  }
}
</style>
