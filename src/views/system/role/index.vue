<template>
  <div class="role-container">
    <el-card shadow="never">
      <!-- 搜索和操作栏 -->
      <div class="toolbar">
        <div class="search-form">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入角色名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-input
            v-model="searchForm.code"
            placeholder="请输入角色编码"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </div>
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增角色</el-button>
      </div>

      <!-- 角色列表表格 -->
      <el-table v-loading="loading" :data="roleList" border style="width: 100%; margin-top: 16px">
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="code" label="角色编码" width="150" />
        <el-table-column
          prop="description"
          label="角色描述"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column prop="isBuiltIn" label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.isBuiltIn" type="warning">内置</el-tag>
            <el-tag v-else type="success">自定义</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'active'" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button
              type="danger"
              link
              :icon="Delete"
              :disabled="row.isBuiltIn"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入角色编码" :disabled="isEdit" />
          <div class="form-tip">角色编码创建后不可修改</div>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  type Role,
  type RoleListParams,
  type CreateRoleParams,
  type UpdateRoleParams,
} from '@/api/role'

defineOptions({ name: 'RoleView' })

// 搜索表单
const searchForm = reactive<{
  name: string
  code: string
  status: 'active' | 'inactive' | ''
}>({
  name: '',
  code: '',
  status: '',
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 表格数据
const roleList = ref<Role[]>([])
const loading = ref(false)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增角色')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = useTemplateRef<FormInstance>('formRef')

// 表单数据
const formData = reactive<{
  name: string
  code: string
  description: string
  status: 'active' | 'inactive'
}>({
  name: '',
  code: '',
  description: '',
  status: 'active',
})

// 表单验证规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: '角色编码只能包含字母、数字和下划线，且以字母开头',
      trigger: 'blur',
    },
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// 当前编辑的角色ID
let currentEditId: string | null = null

// 获取角色列表
const fetchRoleList = async () => {
  loading.value = true
  try {
    const params: RoleListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
    }

    if (searchForm.name) {
      params.name = searchForm.name
    }
    if (searchForm.code) {
      params.code = searchForm.code
    }
    if (searchForm.status) {
      params.status = searchForm.status
    }

    const response = await getRoleList(params)
    const { data } = response.data

    roleList.value = data.list
    pagination.total = data.total
  } catch (error) {
    console.error('获取角色列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchRoleList()
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.code = ''
  searchForm.status = ''
  pagination.page = 1
  fetchRoleList()
}

// 分页大小改变
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchRoleList()
}

// 页码改变
const handlePageChange = (page: number) => {
  pagination.page = page
  fetchRoleList()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增角色'
  isEdit.value = false
  currentEditId = null
  resetForm()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Role) => {
  dialogTitle.value = '编辑角色'
  isEdit.value = true
  currentEditId = row.id
  formData.name = row.name
  formData.code = row.code
  formData.description = row.description || ''
  formData.status = row.status || 'active'
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: Role) => {
  try {
    await ElMessageBox.confirm(`确定要删除角色 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteRole(row.id)
    ElMessage.success('删除成功')
    fetchRoleList()
  } catch (error: unknown) {
    if ((error as { action?: string }).action !== 'cancel') {
      console.error('删除角色失败:', error)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (isEdit.value && currentEditId) {
          // 更新
          const updateParams: UpdateRoleParams = {
            name: formData.name,
            description: formData.description,
            status: formData.status,
          }
          await updateRole(currentEditId, updateParams)
          ElMessage.success('更新成功')
        } else {
          // 新增
          const createParams: CreateRoleParams = {
            name: formData.name,
            code: formData.code,
            description: formData.description,
            status: formData.status,
          }
          await createRole(createParams)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchRoleList()
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.code = ''
  formData.description = ''
  formData.status = 'active'
  formRef.value?.clearValidate()
}

// 对话框关闭
const handleDialogClose = () => {
  resetForm()
}

// 初始化
onMounted(() => {
  fetchRoleList()
})
</script>

<style scoped lang="scss">
.role-container {
  padding: 20px;
  background: var(--el-bg-color-page);
  min-height: 100%;

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .search-form {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }

  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}

.form-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}
</style>
