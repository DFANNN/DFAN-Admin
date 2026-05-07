<template>
  <div class="form-content-inner">
    <h2 class="title">{{ $t('button.phoneLogin') }}</h2>
    <p class="subtitle">{{ $t('login.mobileLoginSubtitle') }}</p>

    <el-form :model="mobileLoginForm" label-position="top" class="mobile-login-form">
      <el-form-item>
        <el-input v-model="mobileLoginForm.phone" :placeholder="$t('login.phonePlaceholder')">
          <template #prepend>+86</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="code-input">
          <el-input v-model="mobileLoginForm.code" :placeholder="$t('login.codePlaceholder')" />
          <el-button class="send-code-btn" @click="sendCode">{{ $t('button.getCode') }}</el-button>
        </div>
      </el-form-item>
      <el-button type="primary" class="submit-btn" @click="handleLogin">{{
        $t('button.verifyAndLogin')
      }}</el-button>
      <div class="back-link">
        <el-link :underline="false" @click="emits('goToMode', 'login')">
          <el-icon><component :is="menuStore.iconComponents['Element:ArrowLeft']" /></el-icon>
          {{ $t('login.backToLogin') }}
        </el-link>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import type { IEmits } from '@/types/login'

const { t } = useI18n()
const emits = defineEmits<IEmits>()
const menuStore = useMenuStore()

const mobileLoginForm = ref({
  phone: '',
  code: '',
})

const sendCode = () => {
  ElMessage.success(t('login.comingSoon'))
}

const handleLogin = () => {
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

  .mobile-login-form {
    :deep {
      .el-input-group__prepend {
        border-radius: 0.5rem 0 0 0.5rem;
      }
      .el-input__wrapper {
        padding: 0.5rem 1rem;
        border-radius: 0 0.5rem 0.5rem 0;
        box-shadow: 0 0 0 1px var(--el-border-color) inset;
        min-height: 2.75rem;

        &.is-focus {
          box-shadow: 0 0 0 1px var(--el-color-primary) inset;
        }
      }
    }

    .code-input {
      display: flex;
      gap: 0.75rem;
      width: 100%;

      :deep(.el-input__wrapper) {
        border-radius: 0.5rem;
      }

      .send-code-btn {
        border-radius: 0.5rem;
        height: 2.75rem;
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

      .el-link {
        font-size: 0.875rem;
        color: var(--el-text-color-secondary);
        font-weight: 500;
        transition: all 0.3s;

        &:hover {
          color: var(--el-color-primary);
          transform: translateX(-4px);
        }
      }
    }
  }
}
</style>
