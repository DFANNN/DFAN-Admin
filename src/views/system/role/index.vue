<template>
  <div>
    <BasePage
      ref="basePageRef"
      :formConfig="searchFromConfig"
      :tableData="roleList"
      :columns="columns"
      :total="total"
      :tableLoading="loading"
      @refresh="getRoleList"
      @selection-change="selectionChange"
    >
      <template #tableOperationLeft>
        <el-button
          type="primary"
          :icon="menuStore.iconComponents.Plus"
          @click="roleCreateRef?.showDialog(undefined)"
          v-permission="['role:add']"
          >{{ $t('role.addRole') }}</el-button
        >
        <el-button
          type="danger"
          :icon="menuStore.iconComponents.Delete"
          :disabled="!useButtonPermission(['role:delete'], [() => !!deleteRoleIds.length]).value"
          @click="openDeleteDialog"
        >
          {{ $t('button.batchDelete') }}
        </el-button>
      </template>
      <template #isBuiltIn="{ row }">
        <BaseTag
          :type="row.isBuiltIn ? 'warning' : 'success'"
          :text="row.isBuiltIn ? $t('tag.builtIn') : $t('tag.custom')"
        />
      </template>
      <template #status="{ row }">
        <BaseTag
          :type="row.status === 'active' ? 'success' : 'danger'"
          :text="row.status === 'active' ? $t('tag.enabled') : $t('tag.disabled')"
        />
      </template>
      <template #operation="{ row }">
        <el-button
          type="primary"
          :icon="menuStore.iconComponents.Edit"
          link
          @click="roleCreateRef?.showDialog(row.id)"
          v-permission="['role:edit']"
        >
          {{ $t('button.edit') }}
        </el-button>
        <el-popconfirm
          :title="$t('role.deleteRolePopconfirm')"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="deleteRoleHandle([row.id])"
        >
          <template #reference>
            <el-button
              type="danger"
              :icon="menuStore.iconComponents.Delete"
              link
              v-permission="['role:delete']"
            >
              {{ $t('button.delete') }}
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <RoleCreate ref="roleCreateRef" @refresh="refreshHandle" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Dialog } from '@/utils/dialog'
import { delay } from '@/utils/utils'
import { rolePage, deleteRole } from '@/api/role'
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
import { useButtonPermission } from '@/composables/useButtonPermission'
import RoleCreate from '@/views/system/role/create.vue'
import type { IRoleItem } from '@/types/system/role'
import type { IFormConfig } from '@/types/components/page'

defineOptions({ name: 'RoleView' })
const { t } = useI18n()
const menuStore = useMenuStore()
const basePageRef = useTemplateRef('basePageRef')
const roleCreateRef = useTemplateRef('roleCreateRef')

// 搜索form配置
const searchFromConfig = ref<IFormConfig[]>([
  {
    label: t('role.name'),
    prop: 'name',
    type: 'elInput',
    attrs: { placeholder: t('role.namePlaceholder') },
  },
  {
    label: t('role.code'),
    prop: 'code',
    type: 'elInput',
    attrs: { placeholder: t('role.codePlaceholder') },
  },
  {
    label: t('role.status'),
    prop: 'status',
    type: 'elSelect',
    attrs: {
      placeholder: t('role.statusPlaceholder'),
      options: [
        { label: t('tag.enabled'), value: 'active' },
        { label: t('tag.disabled'), value: 'inactive' },
      ],
    },
  },
])

// 表格列配置
const columns = ref([
  { type: 'selection', width: 55 },
  { type: 'index', label: t('user.index'), width: 55, fixed: 'left' },
  { prop: 'name', label: t('role.name'), minWidth: 160 },
  { prop: 'code', label: t('role.code'), minWidth: 160 },
  { prop: 'isBuiltIn', label: t('role.type') },
  { prop: 'status', label: t('role.status') },
  { prop: 'createTime', label: t('user.createdAt'), minWidth: 180, sortable: 'custom' },
  { prop: 'updateTime', label: t('user.updatedAt'), minWidth: 180 },
  { prop: 'operation', label: t('user.actions'), width: 150, fixed: 'right' },
])

// 角色列表
const roleList = ref<IRoleItem[]>([])
// 删除角色的ids
const deleteRoleIds = ref<string[]>([])
const total = ref(0)
const loading = ref(false)

// 表格选择行的变化
const selectionChange = (rows: Record<string, unknown>[]) => {
  deleteRoleIds.value = rows.map((row) => row.id as string)
}
// 获取角色列表
const getRoleList = async (
  queryForm: Record<string, unknown>,
  page: number,
  pageSize: number,
  sortField: string,
  sortOrder: 'asc' | 'desc' | '',
) => {
  loading.value = true
  const params = {
    ...queryForm,
    page,
    pageSize,
    sortField,
    sortOrder,
  }
  try {
    await delay(1000)
    const { data: res } = await rolePage(params)
    if (res.code !== 200) return
    roleList.value = res.data?.list || []
    total.value = res.data.total || 0
  } finally {
    loading.value = false
  }
}

// 批量删除用户dialog
const openDeleteDialog = () => {
  Dialog.confirm({
    title: t('role.deleteRoleDialogTitle'),
    content: `${t('role.deleteRoleDialogContent1')} ${deleteRoleIds.value.length} ${t('role.deleteRoleDialogContent2')}`,
    confirmText: t('role.deleteRoleConfirmText'),
    cancelText: t('role.deleteRoleCancelText'),
    onConfirm: async () => {
      await deleteRoleHandle(deleteRoleIds.value)
    },
  })
}
// 删除角色
const deleteRoleHandle = async (ids: string[]) => {
  const { data: res } = await deleteRole(ids)
  if (res.code !== 200) return
  ElMessage.success(t('message.deleteSuccess'))
  refreshHandle('delete', ids.length)
}

// 刷新的方法
const refreshHandle = (type: 'create' | 'update' | 'delete', deleteCount: number) => {
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
</script>

<style></style>
