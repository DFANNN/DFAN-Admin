<template>
  <el-card class="update-password-card" shadow="never">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><component :is="menuStore.iconComponents['Lock']" /></el-icon>
        <span class="header-title">修改密码</span>
      </div>
    </template>
    <el-form
      ref="passwordFormRef"
      :model="passwordForm"
      :rules="passwordRules"
      label-width="100px"
      class="password-form"
    >
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          v-model="passwordForm.oldPassword"
          type="password"
          placeholder="请输入旧密码"
          size="large"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="passwordForm.newPassword"
          type="password"
          placeholder="请输入新密码（至少6位）"
          size="large"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="passwordForm.confirmPassword"
          type="password"
          placeholder="请再次输入新密码"
          size="large"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="large" :loading="passwordLoading" @click="updatePassword">
          <el-icon class="icon-lock"><component :is="menuStore.iconComponents['Lock']" /></el-icon>
          修改密码
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
const menuStore = useMenuStore()

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordLoading = ref(false)

const updatePassword = async () => {}

const passwordRules = ref({
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
})
</script>

<style scoped lang="scss">
:deep(.el-card__body) {
  padding: 0;
}
.el-card {
  border-radius: 1rem;
}
.update-password-card {
  width: 100%;
  height: 100%;
  .card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    .header-icon {
      font-size: 1.25rem;
      color: var(--el-color-primary);
    }
    .header-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }
  .password-form {
    padding: 2rem;
    .el-form-item {
      margin-bottom: 24px;
    }

    .el-button {
      padding: 12px 24px;
      .icon-lock {
        margin-right: 0.5rem;
      }
    }
  }
}
</style>
