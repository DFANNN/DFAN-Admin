<template>
  <BaseDialog
    v-model="open"
    :title="submitForm.id ? $t('user.editUser') : $t('user.addUser')"
    width="600"
    @close="close"
  >
    <el-form
      ref="submitFormRef"
      :model="submitForm"
      :rules="formRules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item :label="$t('user.username')" prop="username">
        <el-input
          v-model="submitForm.username"
          :placeholder="$t('user.usernamePlaceholder')"
          :disabled="!!submitForm.id"
        />
      </el-form-item>
      <el-form-item :label="$t('user.password')" prop="password">
        <el-input
          v-model="submitForm.password"
          type="password"
          :placeholder="$t('user.passwordPlaceholder')"
          show-password
        />
      </el-form-item>
      <el-form-item :label="$t('user.name')" prop="name">
        <el-input v-model="submitForm.name" :placeholder="$t('user.namePlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('user.phone')" prop="phone">
        <el-input v-model="submitForm.phone" :placeholder="$t('user.phonePlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('user.email')" prop="email">
        <el-input v-model="submitForm.email" :placeholder="$t('user.emailPlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('user.role')" prop="roleId">
        <el-select
          v-model="submitForm.roleId"
          :placeholder="$t('user.rolePlaceholder')"
          style="width: 100%"
        >
          <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('user.status')" prop="status">
        <el-radio-group v-model="submitForm.status">
          <el-radio v-for="item in STATUS_OPTIONS" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" :loading="submitLoading" @click="confirm">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { rolePage } from '@/api/role'
import { createUser, userInfo, updateUser } from '@/api/user'
import { STATUS_OPTIONS } from '@/constants/dict'
import type { IRoleItem } from '@/types/system/role'
import { type FormInstance, type FormRules } from 'element-plus'

const { t } = useI18n()

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
  ElMessage.success(submitForm.value.id ? t('message.editSuccess') : t('message.addSuccess'))
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
    { required: true, message: t('user.usernamePlaceholder'), trigger: 'blur' },
    {
      pattern: /^[^\u4e00-\u9fa5]+$/,
      message: t('user.usernamePlaceholder'),
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: t('user.passwordPlaceholder'),
      trigger: 'blur',
      validator: (rule, value, callback) => {
        // 新增时必填，编辑时可选
        if (!submitForm.value.id && !value) {
          callback(new Error(t('user.passwordPlaceholder')))
        } else {
          callback()
        }
      },
    },
  ],
  status: [{ required: true, message: t('user.statusPlaceholder'), trigger: 'change' }],
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
