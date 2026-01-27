<template>
  <BaseDialog v-model="open" title="修改密码" width="500" @confirm="updatePassword">
    <el-form
      ref="passwordFormRef"
      :model="passwordForm"
      :rules="passwordRules"
      label-width="80px"
      class="password-form"
    >
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          v-model.trim="passwordForm.oldPassword"
          type="password"
          placeholder="请输入旧密码"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model.trim="passwordForm.newPassword"
          type="password"
          placeholder="请输入新密码（至少6位）"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model.trim="passwordForm.confirmPassword"
          type="password"
          placeholder="请再次输入新密码"
          show-password
          clearable
        />
      </el-form-item>
    </el-form>
  </BaseDialog>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'

const userStore = useUserStore()
const passwordFormRef = useTemplateRef<FormInstance>('passwordFormRef')

const open = ref(false)

// 密码表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 修改密码
const updatePassword = async () => {
  await passwordFormRef.value?.validate()
  await userStore.delay(1000)
  await userStore.updatePassword(passwordForm.value)
  open.value = false
}

// 新密码验证
/* eslint-disable @typescript-eslint/no-explicit-any */
const validateNewPassword = (rule: any, value: string, callback: any) => {
  if (value.trim() === '') return callback(new Error('请输入新密码'))
  if (value.length < 6) return callback(new Error('新密码长度至少6位'))
  callback()
}

// 确认密码验证
/* eslint-disable @typescript-eslint/no-explicit-any */
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value.trim() === '') return callback(new Error('请输入确认密码'))
  if (value !== passwordForm.value.newPassword) return callback(new Error('确认密码与新密码不一致'))
  callback()
}

// rules
const passwordRules = ref({
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, validator: validateNewPassword, trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
})

const showDialog = () => {
  open.value = true
}

defineExpose({
  showDialog,
})
</script>

<style></style>
