<template>
  <el-dialog
    v-model="open"
    :title="submitForm.id ? '编辑角色' : '新增角色'"
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
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="submitForm.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input
          v-model="submitForm.code"
          placeholder="请输入角色编码"
          :disabled="!!submitForm.id"
        />
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input
          v-model="submitForm.description"
          type="textarea"
          :rows="3"
          placeholder="请输入角色描述"
        />
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
import { createRole, roleInfo, updateRole } from '@/api/role'
import { type FormInstance, type FormRules } from 'element-plus'
defineOptions({ name: 'RoleCreate' })

const emits = defineEmits(['refresh'])
const submitFormRef = useTemplateRef<FormInstance>('submitFormRef')

const open = ref(false)
const submitLoading = ref(false)

const submitForm = ref({
  id: undefined as string | undefined,
  name: '',
  code: '',
  description: '',
  status: 'active' as 'active' | 'inactive',
})

// 取消
const close = () => {
  open.value = false
  submitFormRef.value?.resetFields()
}

// 确定
const confirm = async () => {
  await submitFormRef.value?.validate()
  const { data: res } = submitForm.value.id
    ? await updateRole(submitForm.value)
    : await createRole(submitForm.value)
  if (res.code !== 200) return
  ElMessage.success(submitForm.value.id ? '编辑成功' : '创建成功')
  emits('refresh')
  close()
}

const getRoleInfo = async () => {
  const { data: res } = await roleInfo(submitForm.value.id as string)
  if (res.code !== 200) return
  const { id, name, code, description, status } = res.data
  submitForm.value = { id, name, code, description, status }
}

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

const showDialog = (id: string | undefined) => {
  submitForm.value.id = id
  if (id) getRoleInfo()
  open.value = true
}

defineExpose({
  showDialog,
})
</script>

<style></style>
