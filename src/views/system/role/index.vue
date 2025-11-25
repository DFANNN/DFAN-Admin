<template>
  <div>
    <el-card shadow="never" class="card-clear-mb">
      <el-form :model="queryForm" label-width="auto">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item label="角色名称">
              <el-input v-model="queryForm.name" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item label="角色编码">
              <el-input v-model="queryForm.code" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item label="状态">
              <el-select v-model="queryForm.status" placeholder="请选择状态">
                <el-option label="启用" value="active" />
                <el-option label="禁用" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item>
              <el-button
                type="primary"
                :icon="menuStore.iconComponents.Search"
                @click="handleSearch"
                >搜索</el-button
              >
              <el-button :icon="menuStore.iconComponents.Refresh" @click="handleReset"
                >重置</el-button
              >
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
          >新增角色</el-button
        >
      </div>
      <el-table :data="roleList" border show-overflow-tooltip>
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="description" label="角色描述" />
        <el-table-column prop="isBuiltIn" label="类型">
          <template #default="{ row }">
            <el-tag v-if="row.isBuiltIn" type="warning">内置</el-tag>
            <el-tag v-else type="success">自定义</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'active'" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作">
          <template #default="{ row }: { row: IRoleItem }">
            <el-button
              type="primary"
              :icon="menuStore.iconComponents.Edit"
              link
              @click="roleCreateRef?.showDialog(row.id)"
            >
              编辑
            </el-button>
            <el-popconfirm
              title="确定要删除该角色吗？"
              placement="top"
              width="200"
              @confirm="handleDelete(row)"
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
          @change="getRoleList"
        />
      </div>
    </el-card>

    <RoleCreate ref="roleCreateRef" @refresh="refresh" />
  </div>
</template>

<script setup lang="ts">
import { rolePage } from '@/api/role'
import { PAGINATION_CONFIG } from '@/config/elementConfig'
import RoleCreate from '@/views/system/role/create.vue'
import type { IRoleItem } from '@/types/system/role'

defineOptions({ name: 'RolePage' })

const menuStore = useMenuStore()
const roleCreateRef = useTemplateRef<InstanceType<typeof RoleCreate> | null>('roleCreateRef')

const queryForm = ref({
  name: '',
  code: '',
  status: undefined,
})

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
})

const roleList = ref<IRoleItem[]>([])

const handleSearch = () => {
  console.log(queryForm.value)
}

const handleReset = () => {}

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

// 删除角色
const deleteRoleHandle = async () => {}

// 刷新
const refresh = () => {
  getRoleList()
}

onMounted(() => {
  getRoleList()
})
</script>

<style lang="scss" scoped></style>
