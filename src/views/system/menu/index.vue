<template>
  <div>
    <BasePage
      ref="basePageRef"
      :formConfig="searchFormConfig"
      :table-data="menuList"
      :columns="columns"
      :show-pagination="false"
      :show-export="false"
      :show-print="false"
      :table-loading="loading"
      :tableAttrs="{
        rowKey: 'id',
        defaultExpandAll: true,
        treeProps: { children: 'children', hasChildren: 'hasChildren' },
      }"
      @refresh="getMenuList"
    >
      <template #tableOperationLeft>
        <el-button
          type="primary"
          :icon="menuStore.iconComponents.Plus"
          @click="menuCreateRef?.showDialog(undefined)"
          v-permission="['menu:add']"
          >新增菜单</el-button
        >
      </template>
      <template #type="{ row }">
        <BaseTag v-if="row.type === 'directory'" type="info" text="目录" />
        <BaseTag v-else-if="row.type === 'menu'" type="primary" text="菜单" />
        <BaseTag v-else-if="row.type === 'button'" type="warning" text="按钮" />
      </template>
      <template #icon="{ row }">
        <el-icon v-if="row.icon">
          <component :is="menuStore.iconComponents[row.icon]" />
        </el-icon>
      </template>
      <template #status="{ row }">
        <BaseTag
          :type="row.status === 'active' ? 'success' : 'danger'"
          :text="row.status === 'active' ? '启用' : '禁用'"
        />
      </template>
      <template #operation="{ row }">
        <el-button
          type="primary"
          link
          :icon="menuStore.iconComponents.Edit"
          @click="menuCreateRef?.showDialog(row.id)"
          v-permission="['menu:edit']"
          >编辑</el-button
        >
        <el-popconfirm
          title="确定要删除选中的菜单吗？"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="deleteMenuHandle(row.id)"
        >
          <template #reference>
            <el-button
              type="danger"
              link
              :icon="menuStore.iconComponents.Delete"
              v-permission="['menu:delete']"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <MenuCreate ref="menuCreateRef" @refresh="refreshHandle" />
  </div>
</template>

<script setup lang="ts">
import { delay } from '@/utils/utils'
import { menuPage, deleteMenu } from '@/api/menu'
import MenuCreate from '@/views/system/menu/create.vue'
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
import type { IMenuItem } from '@/types/system/menu'
import type { IFormConfig } from '@/types/components/page'

defineOptions({ name: 'UserView' })
const menuStore = useMenuStore()
const basePageRef = useTemplateRef('basePageRef')
const menuCreateRef = useTemplateRef('menuCreateRef')

// 搜索form配置
const searchFormConfig = ref<IFormConfig[]>([
  { label: '菜单标题', prop: 'title', type: 'elInput', attrs: { placeholder: '请输入' } },
  { label: '菜单路径', prop: 'path', type: 'elInput', attrs: { placeholder: '请输入' } },
  {
    label: '类型',
    prop: 'type',
    type: 'elSelect',
    attrs: {
      placeholder: '请选择',
      options: [
        { label: '目录', value: 'directory' },
        { label: '菜单', value: 'menu' },
        { label: '按钮', value: 'button' },
      ],
    },
  },
  {
    label: '状态',
    prop: 'status',
    type: 'elSelect',
    attrs: {
      placeholder: '请选择',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
      ],
    },
  },
])

// 表格列配置
const columns = ref([
  { label: '菜单标题', prop: 'title', minWidth: 200 },
  { label: '菜单路径', prop: 'path', minWidth: 250 },
  { label: '类型', prop: 'type', minWidth: 100 },
  { label: '图标', prop: 'icon', minWidth: 100 },
  { label: '排序', prop: 'order', minWidth: 100 },
  { label: '状态', prop: 'status', minWidth: 100 },
  { label: '创建时间', prop: 'createTime', minWidth: 180 },
  { label: '操作', prop: 'operation', width: 150, fixed: 'right' },
])

// 菜单列表
const menuList = ref<IMenuItem[]>([])
const loading = ref(false)

// 获取菜单列表
const getMenuList = async (queryForm: Record<string, unknown>) => {
  loading.value = true
  try {
    await delay(1000)
    const { data: res } = await menuPage(queryForm)
    if (res.code !== 200) return
    menuList.value = res.data || []
  } finally {
    loading.value = false
  }
}

// 删除菜单
const deleteMenuHandle = async (id: string) => {
  const { data: res } = await deleteMenu(id)
  if (res.code !== 200) return
  ElMessage.success('删除成功')
  refreshHandle()
}

// 刷新数据的方法
const refreshHandle = () => {
  basePageRef.value?.refreshCurrentPage()
}
</script>

<style></style>
