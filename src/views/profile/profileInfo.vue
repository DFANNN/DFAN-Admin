<template>
  <el-card class="profile-info-card" shadow="never">
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"
          ><component :is="menuStore.iconComponents['HSolid:UserCircleIcon']"
        /></el-icon>
        <span class="header-title">基本信息</span>
      </div>
    </template>

    <el-form ref="profileFormRef" :model="profileForm" label-width="60px" class="profile-form">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="profileForm.name" placeholder="请输入姓名" size="large" clearable />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="profileForm.phone" placeholder="请输入手机号" size="large" clearable />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="profileForm.email" placeholder="请输入邮箱" size="large" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="large" :loading="profileLoading" @click="updateProfile">
          <el-icon class="icon-check"
            ><component :is="menuStore.iconComponents['Check']"
          /></el-icon>
          保存修改
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const menuStore = useMenuStore()

const profileLoading = ref(false)

const profileForm = ref({
  name: '',
  phone: '',
  email: '',
})

watchEffect(() => {
  profileForm.value.name = userStore.userInfo?.name || ''
  profileForm.value.phone = userStore.userInfo?.phone || ''
  profileForm.value.email = userStore.userInfo?.email || ''
})

const updateProfile = async () => {
  profileLoading.value = true
  try {
    await userStore.updateUserProfile(profileForm.value)
  } finally {
    profileLoading.value = false
  }
}
</script>

<style scoped lang="scss">
:deep(.el-card__body) {
  padding: 0;
}
.el-card {
  border-radius: 1rem;
}

.profile-info-card {
  width: 100%;
  height: 100%;
  .card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    .header-icon {
      font-size: 2rem;
      color: var(--el-color-primary);
    }
    .header-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }
  .profile-form {
    padding: 2rem;
    .el-form-item {
      margin-bottom: 24px;
    }

    .el-button {
      padding: 12px 24px;
      .icon-check {
        margin-right: 0.5rem;
      }
    }
  }
}

@media (max-width: 992px) {
  .profile-info-card {
    .profile-form {
      padding: 1rem;
    }
  }
}
</style>
