<template>
  <el-dialog
    v-model="open"
    :title="submitForm.id ? '编辑用户' : '新增用户'"
    width="600px"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form
      ref="submitFormRef"
      :model="submitForm"
      :rules="formRules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="submitForm.username"
          placeholder="请输入用户名（不允许中文）"
          :disabled="!!submitForm.id"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="submitForm.password"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="submitForm.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="submitForm.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="submitForm.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="用户角色" prop="roleId">
        <el-select v-model="submitForm.roleId" placeholder="请选择用户角色" style="width: 100%">
          <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="submitForm.status">
          <el-radio label="active">启用</el-radio>
          <el-radio label="inactive">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { createUser, userInfo, updateUser } from '@/api/user'
import { rolePage } from '@/api/role'
import { type FormInstance, type FormRules } from 'element-plus'
import type { IRoleItem } from '@/types/system/role'

defineOptions({ name: 'UserCreate' })

const emits = defineEmits(['refresh'])
const submitFormRef = useTemplateRef<FormInstance>('submitFormRef')

// 对话框开关
const open = ref(false)

// 提交按钮加载状态
const submitLoading = ref(false)

// 角色列表
const roleList = ref<IRoleItem[]>([])

// 表单数据
const submitForm = ref({
  id: undefined as string | undefined,
  username: '',
  password: '',
  name: '',
  phone: '',
  email: '',
  roleId: undefined as string | undefined,
  status: 'active' as 'active' | 'inactive',
})

// 取消
const close = () => {
  open.value = false
  submitFormRef.value?.resetFields()
  roleList.value = []
  submitForm.value.roleId = undefined
}

// 确定
const confirm = async () => {
  await submitFormRef.value?.validate()

  const { data: res } = submitForm.value.id
    ? await updateUser(submitForm.value)
    : await createUser(submitForm.value)
  if (res.code !== 200) return
  ElMessage.success(submitForm.value.id ? '编辑成功' : '新增成功')
  emits('refresh', submitForm.value.id ? 'update' : 'create')
  close()
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

// 获取用户信息
const getUserInfo = async () => {
  const { data: res } = await userInfo(submitForm.value.id as string)
  if (res.code !== 200) return
  const { id, username, name, phone, email, roleId, status, password } = res.data
  submitForm.value = {
    id,
    username,
    password,
    name: name || '',
    phone: phone || '',
    email: email || '',
    roleId,
    status,
  }
}

// 表单验证规则
const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      pattern: /^[^\u4e00-\u9fa5]+$/,
      message: '用户名不允许输入中文',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        // 新增时必填，编辑时可选
        if (!submitForm.value.id && !value) {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      },
    },
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// 显示对话框
const showDialog = async (id: string | undefined) => {
  submitForm.value.id = id
  open.value = true
  // 加载角色列表
  await getRoleList()
  if (id) await getUserInfo()
}

defineExpose({
  showDialog,
})
</script>

<style></style>
