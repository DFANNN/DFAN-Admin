<template>
  <div>
    <el-card shadow="never" class="card-clear-mb">
      <el-form :model="queryForm" label-width="auto" ref="queryFormRef" @keyup.enter="getRoleList">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="queryForm.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item label="角色编码" prop="code">
              <el-input v-model="queryForm.code" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryForm.status" placeholder="请选择">
                <el-option label="启用" value="active" />
                <el-option label="禁用" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item>
              <el-button type="primary" :icon="menuStore.iconComponents.Search" @click="getRoleList"
                >搜索</el-button
              >
              <el-button :icon="menuStore.iconComponents.Refresh" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="never" class="card-mt-16">
      <div class="operation-container">
        <el-button
          type="primary"
          :icon="menuStore.iconComponents.Plus"
          @click="roleCreateRef?.showDialog(undefined)"
          v-permission="['role:add']"
          >新增角色</el-button
        >
        <el-popconfirm
          title="确定要删除选中的角色吗？"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="deleteRoleHandle(deleteRoleIds)"
        >
          <template #reference>
            <el-button
              type="danger"
              :icon="menuStore.iconComponents.Delete"
              :disabled="
                !useButtonPermission(['role:delete'], [() => !!deleteRoleIds.length]).value
              "
            >
              批量删除
            </el-button>
          </template>
        </el-popconfirm>
      </div>
      <el-table
        :data="roleList"
        :border="TABLE_CONFIG.border"
        show-overflow-tooltip
        @selection-change="tableSelectionChange"
        @sort-change="tableSortChange"
      >
        <el-table-column type="selection" width="55" :align="TABLE_CONFIG.align" />
        <el-table-column type="index" label="序号" width="55" fixed :align="TABLE_CONFIG.align" />
        <el-table-column
          prop="name"
          label="角色名称"
          min-width="160"
          fixed
          :align="TABLE_CONFIG.align"
        />
        <el-table-column prop="code" label="角色编码" min-width="160" :align="TABLE_CONFIG.align" />
        <el-table-column
          prop="description"
          label="角色描述"
          min-width="200"
          :align="TABLE_CONFIG.align"
        />
        <el-table-column prop="isBuiltIn" label="类型" :align="TABLE_CONFIG.align">
          <template #default="{ row }">
            <el-tag v-if="row.isBuiltIn" type="warning">内置</el-tag>
            <el-tag v-else type="success">自定义</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" :align="TABLE_CONFIG.align">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'active'" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          sortable="custom"
          min-width="180"
          :align="TABLE_CONFIG.align"
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
          min-width="180"
          :align="TABLE_CONFIG.align"
        />
        <el-table-column label="操作" width="150" fixed="right" :align="TABLE_CONFIG.align">
          <template #default="{ row }: { row: IRoleItem }">
            <el-button
              type="primary"
              :icon="menuStore.iconComponents.Edit"
              link
              @click="roleCreateRef?.showDialog(row.id)"
              v-permission="['role:edit']"
            >
              编辑
            </el-button>
            <el-popconfirm
              title="确定要删除选中的角色吗？"
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
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :layout="PAGINATION_CONFIG.layout"
          :page-sizes="PAGINATION_CONFIG.pageSizes"
          :total="pagination.total"
          @change="getRoleList"
        />
      </div>
    </el-card>

    <RoleCreate ref="roleCreateRef" @refresh="refresh" />
  </div>
</template>

<script setup lang="ts">
import { rolePage, deleteRole } from '@/api/role'
import { useButtonPermission } from '@/composables/useButtonPermission'
import { PAGINATION_CONFIG, POPCONFIRM_CONFIG, TABLE_CONFIG } from '@/config/elementConfig'
import RoleCreate from '@/views/system/role/create.vue'
import type { IRoleItem } from '@/types/system/role'
import type { FormInstance } from 'element-plus'

defineOptions({ name: 'RoleView' })

const menuStore = useMenuStore()
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const roleCreateRef = useTemplateRef<InstanceType<typeof RoleCreate> | null>('roleCreateRef')

// 删除角色的ids
const deleteRoleIds = ref<string[]>([])

// 查询表单
const queryForm = ref({
  name: '',
  code: '',
  status: undefined,
  sortOrder: 'desc' as 'asc' | 'desc',
})

// 角色列表
const roleList = ref<IRoleItem[]>([])

// 分页
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 重置查询表单
const reset = () => {
  queryFormRef.value?.resetFields()
  getRoleList()
}

// 获取角色列表
const getRoleList = async () => {
  const params = {
    ...queryForm.value,
    page: pagination.value.page,
    pageSize: pagination.value.pageSize,
  }
  const { data: res } = await rolePage(params)
  if (res.code !== 200) return
  roleList.value = res.data?.list || []
  pagination.value.total = res.data?.total || 0
}

// 表格选择变化
const tableSelectionChange = (selection: IRoleItem[]) => {
  deleteRoleIds.value = selection.map((item) => item.id)
}

// 表格排序变化
const tableSortChange = ({ order }: { order: 'ascending' | 'descending' | null }) => {
  queryForm.value.sortOrder = order === 'ascending' ? 'asc' : 'desc'
  getRoleList()
}

// 删除角色
const deleteRoleHandle = async (ids: string[]) => {
  const { data: res } = await deleteRole(ids)
  if (res.code !== 200) return
  ElMessage.success('删除成功')
  getRoleList()
}

// 刷新
const refresh = (type: 'create' | 'update') => {
  pagination.value.page = type === 'create' ? 1 : pagination.value.page
  // 如果排序为升序，则计算最后一页
  if (queryForm.value.sortOrder === 'asc' && type === 'create') {
    pagination.value.page = PAGINATION_CONFIG.calculateLastPage(
      pagination.value.total + 1,
      pagination.value.pageSize,
    )
  }
  getRoleList()
}

onMounted(() => {
  getRoleList()
})
</script>

<style lang="scss" scoped></style>
