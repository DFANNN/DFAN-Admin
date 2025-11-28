<template>
  <div>
    <el-card shadow="never" class="card-clear-mb">
      <el-form :model="queryForm" label-width="auto" ref="queryFormRef" @keyup.enter="getUserList">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="queryForm.username" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="queryForm.name" placeholder="请输入" />
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
              <el-button type="primary" :icon="menuStore.iconComponents.Search" @click="getUserList"
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
          @click="userCreateRef?.showDialog(undefined)"
          >新增用户</el-button
        >
        <el-popconfirm
          title="确定要删除选中的用户吗？"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="deleteUserHandle(deleteUserIds)"
        >
          <template #reference>
            <el-button
              type="danger"
              :icon="menuStore.iconComponents.Delete"
              :disabled="!deleteUserIds.length"
            >
              批量删除
            </el-button>
          </template>
        </el-popconfirm>
      </div>
      <el-table
        :data="userList"
        :border="TABLE_CONFIG.border"
        show-overflow-tooltip
        @selection-change="tableSelectionChange"
        @sort-change="tableSortChange"
      >
        <el-table-column type="selection" width="55" :align="TABLE_CONFIG.align" />
        <el-table-column type="index" label="序号" width="55" fixed :align="TABLE_CONFIG.align" />
        <el-table-column
          prop="username"
          label="用户名"
          min-width="160"
          fixed
          :align="TABLE_CONFIG.align"
        />
        <el-table-column prop="name" label="姓名" min-width="120" :align="TABLE_CONFIG.align" />
        <el-table-column prop="phone" label="手机号" min-width="120" :align="TABLE_CONFIG.align" />
        <el-table-column prop="email" label="邮箱" min-width="180" :align="TABLE_CONFIG.align" />
        <el-table-column prop="roleId" label="角色" min-width="150" :align="TABLE_CONFIG.align">
          <template #default="{ row }">
            <el-tag v-if="row.roleId">{{ getRoleName(row.roleId) }}</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
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
          <template #default="{ row }: { row: IUserItem }">
            <el-button
              type="primary"
              :icon="menuStore.iconComponents.Edit"
              link
              @click="userCreateRef?.showDialog(row.id)"
            >
              编辑
            </el-button>
            <el-popconfirm
              title="确定要删除选中的用户吗？"
              :placement="POPCONFIRM_CONFIG.placement"
              :width="POPCONFIRM_CONFIG.width"
              @confirm="deleteUserHandle([row.id])"
            >
              <template #reference>
                <el-button type="danger" :icon="menuStore.iconComponents.Delete" link>
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
          @change="getUserList"
        />
      </div>
    </el-card>

    <UserCreate ref="userCreateRef" @refresh="refresh" />
  </div>
</template>

<script setup lang="ts">
import { userPage, deleteUser } from '@/api/user'
import { rolePage } from '@/api/role'
import { PAGINATION_CONFIG, POPCONFIRM_CONFIG, TABLE_CONFIG } from '@/config/elementConfig'
import UserCreate from '@/views/system/user/create.vue'
import type { IUserItem } from '@/types/system/user'
import type { IRoleItem } from '@/types/system/role'
import type { FormInstance } from 'element-plus'

defineOptions({ name: 'UserPage' })

const menuStore = useMenuStore()
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const userCreateRef = useTemplateRef<InstanceType<typeof UserCreate> | null>('userCreateRef')

// 删除用户的ids
const deleteUserIds = ref<string[]>([])

// 角色列表（用于显示角色名称）
const roleList = ref<IRoleItem[]>([])

// 查询表单
const queryForm = ref({
  username: '',
  name: '',
  status: undefined,
  sortOrder: 'desc' as 'asc' | 'desc',
})

// 用户列表
const userList = ref<IUserItem[]>([])

// 分页
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
})

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

// 重置查询表单
const reset = () => {
  queryFormRef.value?.resetFields()
  getUserList()
}

// 获取用户列表
const getUserList = async () => {
  const params = {
    ...queryForm.value,
    page: pagination.value.page,
    pageSize: pagination.value.pageSize,
  }
  const { data: res } = await userPage(params)
  if (res.code !== 200) return
  userList.value = res.data?.list || []
  pagination.value.total = res.data?.total || 0
}

// 表格选择变化
const tableSelectionChange = (selection: IUserItem[]) => {
  deleteUserIds.value = selection.map((item) => item.id)
}

// 表格排序变化
const tableSortChange = ({ order }: { order: 'ascending' | 'descending' | null }) => {
  queryForm.value.sortOrder = order === 'ascending' ? 'asc' : 'desc'
  getUserList()
}

// 删除用户
const deleteUserHandle = async (ids: string[]) => {
  const { data: res } = await deleteUser(ids)
  if (res.code !== 200) return
  ElMessage.success('删除成功')
  getUserList()
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
  getUserList()
}

onMounted(() => {
  getRoleList()
  getUserList()
})
</script>

<style lang="scss" scoped></style>
