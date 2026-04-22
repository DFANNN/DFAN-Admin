<template>
  <div>
    <BasePage
      ref="basePageRef"
      :formConfig="searchFormConfig"
      :table-data="userList"
      :columns="columns"
      :total="total"
      :table-loading="loading"
      @refresh="getUserList"
      @selection-change="selectionChange"
    >
      <template #tableOperationLeft>
        <el-button
          type="primary"
          :icon="menuStore.iconComponents.Plus"
          @click="userCreateRef?.showDialog(undefined)"
          v-permission="['user:add']"
          >{{ $t('button.addUser') }}</el-button
        >
        <el-button
          type="danger"
          :icon="menuStore.iconComponents.Delete"
          :disabled="!useButtonPermission(['user:delete'], [() => !!deleteUserIds.length]).value"
          @click="openDeleteDialog"
        >
          {{ $t('button.batchDelete') }}
        </el-button>
      </template>
      <template #roleId="{ row }">
        <BaseTag v-if="row.roleId" :text="getRoleName(row.roleId)" />
        <span v-else>-</span>
      </template>
      <template #isBuiltIn="{ row }">
        <BaseTag v-if="row.isBuiltIn" type="warning" text="内置" />
        <BaseTag v-else type="success" text="自定义" />
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
          @click="userCreateRef?.showDialog(row.id)"
          v-permission="['user:edit']"
        >
          {{ $t('button.edit') }}
        </el-button>
        <el-popconfirm
          title="确定要删除选中的用户吗？"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="deleteUserHandle([row.id])"
        >
          <template #reference>
            <el-button type="danger" link v-permission="['user:delete']">
              {{ $t('button.delete') }}
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>
    <UserCreate ref="userCreateRef" @refresh="refreshHandle" />
  </div>
</template>

<script setup lang="ts">
import { Dialog } from '@/utils/dialog'
import { delay } from '@/utils/utils'
import { rolePage } from '@/api/role'
import { userPage, deleteUser } from '@/api/user'
import UserCreate from '@/views/system/user/create.vue'
import { useButtonPermission } from '@/composables/useButtonPermission'
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
import type { IRoleItem } from '@/types/system/role'
import type { IUserItem } from '@/types/system/user'
import type { IFormConfig } from '@/types/components/page'
import type { IUserListParams } from '@/types/system/user'

defineOptions({ name: 'UserView' })

const menuStore = useMenuStore()
const userCreateRef = useTemplateRef<InstanceType<typeof UserCreate>>('userCreateRef')
const basePageRef = useTemplateRef('basePageRef')

// 搜索form配置
const searchFormConfig = ref<IFormConfig[]>([
  { label: '用户名', prop: 'username', type: 'elInput', attrs: { placeholder: '请输入' } },
  { label: '姓名', prop: 'name', type: 'elInput', attrs: { placeholder: '请输入' } },
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
  { type: 'selection', width: 55 },
  { type: 'index', label: '序号', width: 55, fixed: 'left' },
  { prop: 'username', label: '用户名', minWidth: 160 },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'phone', label: '手机号', minWidth: 120 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'roleId', label: '角色', minWidth: 150 },
  { prop: 'isBuiltIn', label: '类型', width: 100 },
  { prop: 'status', label: '状态' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, sortable: 'custom' },
  { prop: 'updateTime', label: '更新时间', minWidth: 180 },
  { prop: 'operation', label: '操作', width: 150, fixed: 'right' },
])

// 角色列表（用于显示角色名称）
const roleList = ref<IRoleItem[]>([])
// 删除用户的ids
const deleteUserIds = ref<string[]>([])

// 用户列表
const userList = ref<IUserItem[]>([])
// 数据总数
const total = ref(0)
// 表格loading
const loading = ref(false)
// 表格选中行的变化
const selectionChange = (rows: Record<string, unknown>[]) => {
  deleteUserIds.value = rows.map((r) => r.id) as string[]
}

// 获取角色名称
const getRoleName = (roleId: string): string => {
  const role = roleList.value.find((r) => r.id === roleId)
  return role?.name || roleId
}

// 获取角色列表
const getRoleList = async () => {
  const { data: res } = await rolePage({
    page: 1,
    pageSize: 1000, // 获取所有角色
    name: '',
    code: '',
    sortOrder: 'asc',
  })
  if (res.code !== 200) return
  roleList.value = res.data?.list || []
}
// 获取用户列表
const getUserList = async (
  queryForm: Record<string, unknown>,
  page: number,
  pageSize: number,
  sortField?: string,
  sortOrder?: 'asc' | 'desc' | '',
) => {
  loading.value = true
  const params: IUserListParams = {
    ...queryForm,
    page,
    pageSize,
    sortField,
    sortOrder,
  }
  try {
    await delay(1000)
    const { data: res } = await userPage(params)
    if (res.code !== 200) return
    userList.value = res.data?.list || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

// 批量删除用户dialog
const openDeleteDialog = () => {
  Dialog.confirm({
    title: '删除确认',
    content: `确定要删除选中的 ${deleteUserIds.value.length} 条数据吗？删除后无法恢复，请谨慎操作！`,
    confirmText: '确认删除',
    cancelText: '再想想',
    onConfirm: async () => {
      await deleteUserHandle(deleteUserIds.value)
    },
  })
}

// 删除用户
const deleteUserHandle = async (ids: string[]) => {
  const { data: res } = await deleteUser(ids)
  if (res.code !== 200) return
  ElMessage.success('删除成功')
  refreshHandle('delete', ids.length)
}

// 刷新数据的方法
const refreshHandle = (type: 'create' | 'update' | 'delete', deleteCount?: number) => {
  if (type === 'create') {
    // 新增成功：跳转到第一页
    basePageRef.value?.refreshToFirstPage()
  } else if (type === 'update') {
    // 编辑成功：停留在当前页
    basePageRef.value?.refreshCurrentPage()
  } else if (type === 'delete') {
    // 删除成功：智能刷新（传入删除的数量）
    basePageRef.value?.refreshAfterDelete(deleteCount || 1)
  }
}

onMounted(() => {
  getRoleList()
})
</script>

<style></style>
