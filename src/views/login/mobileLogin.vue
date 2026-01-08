<template>
  <div class="form-content-inner">
    <h2 class="title">手机号登录</h2>
    <p class="subtitle">使用您的移动设备快速登录系统</p>

    <el-form :model="mobileLoginForm" label-position="top" class="mobile-login-form">
      <el-form-item>
        <el-input v-model="mobileLoginForm.phone" placeholder="请输入手机号码">
          <template #prepend>+86</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="code-input">
          <el-input v-model="mobileLoginForm.code" placeholder="验证码" />
          <el-button class="send-code-btn" @click="sendCode">获取验证码</el-button>
        </div>
      </el-form-item>
      <el-button type="primary" class="submit-btn" @click="handleLogin"> 验证并登录 </el-button>
      <div class="back-link">
        <el-link :underline="false" @click="emits('goToMode', 'login')">
          <el-icon><component :is="menuStore.iconComponents['Element:ArrowLeft']" /></el-icon>
          返回登录
        </el-link>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { IEmits } from '@/types/login'

const emits = defineEmits<IEmits>()
const menuStore = useMenuStore()

const mobileLoginForm = ref({
  phone: '',
  code: '',
})

const sendCode = () => {
  ElMessage.success('敬请期待👀')
}

const handleLogin = () => {
  ElMessage.success('敬请期待👀')
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
