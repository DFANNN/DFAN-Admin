<template>
  <div class="form-content-inner">
    <h2 class="title">{{ $t('login.createAccountTitle') }}</h2>
    <p class="subtitle">
      {{ $t('login.createAccountJoin') }} {{ APP_CONFIG.name }}{{ $t('login.createAccountSlogan') }}
    </p>

    <el-form :model="registerForm" label-position="top" class="register-form">
      <el-form-item>
        <el-input
          v-model="registerForm.username"
          :placeholder="$t('login.registerUsernamePlaceholder')"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="registerForm.email"
          :placeholder="$t('login.registerEmailPlaceholder')"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="registerForm.password"
          type="password"
          show-password
          :placeholder="$t('login.registerPasswordPlaceholder')"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          show-password
          :placeholder="$t('login.confirmPasswordPlaceholder')"
        />
      </el-form-item>
      <el-button type="primary" class="submit-btn" @click="handleRegister">
        {{ $t('button.registerNow') }}
      </el-button>
      <div class="back-link">
        <span class="have-account">{{ $t('login.noAccount') }}</span>
        <el-link :underline="false" @click="emits('goToMode', 'login')">
          <el-icon><component :is="menuStore.iconComponents['Element:ArrowLeft']" /></el-icon>
          {{ $t('login.backToLogin') }}
        </el-link>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { APP_CONFIG } from '@/config/app.config'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import type { IEmits } from '@/types/login'

defineOptions({ name: 'RegisterComponent' })

const { t } = useI18n()
const emits = defineEmits<IEmits>()
const menuStore = useMenuStore()

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const handleRegister = () => {
  ElMessage.success(t('login.comingSoon'))
}
</script>

<style scoped lang="scss">
.form-content-inner {
  .title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--el-text-color-primary);
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 0.95rem;
    color: var(--el-text-color-secondary);
    margin-bottom: 2rem;
  }

  .register-form {
    :deep(.el-input__wrapper),
    :deep(.el-select__wrapper) {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 0 0 1px var(--el-border-color) inset;
      min-height: 2.75rem;

      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }

    .submit-btn {
      width: 100%;
      height: 2.75rem;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      margin-top: 0.9rem;
      margin-bottom: 1.5rem;
    }

    .back-link {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;

      .have-account {
        font-size: 0.875rem;
        color: var(--el-text-color-secondary);
      }

      .el-link {
        font-size: 0.9rem;
        font-weight: 600;
        transition: all 0.3s;
        color: var(--el-text-color-secondary);

        &:hover {
          color: var(--el-color-primary);
          transform: translateX(-4px);
        }
      }
    }
  }
}
</style>
