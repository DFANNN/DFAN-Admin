<template>
  <div class="login-container">
    <!-- Left Side: Branding/Visual -->
    <div class="login-left">
      <div class="login-bg-decoration"></div>
      <div class="brand-content">
        <div class="logo-wrapper">
          <img src="@/assets/logo.svg" alt="logo" class="logo-img" />
          <h1 class="brand-title">CAT Admin</h1>
        </div>
        <p class="brand-desc">
          新一代管理后台系统<br />
          现代、快速、美观。
        </p>
        <div class="feature-tags">
          <span>Vue 3</span>
          <span>TypeScript</span>
          <span>Element Plus</span>
        </div>
      </div>
      <div class="glass-card"></div>
    </div>

    <!-- Right Side: Login Form -->
    <div class="login-right">
      <div class="login-form-wrapper">
        <div class="form-header">
          <h2 class="welcome-title">欢迎回来</h2>
          <p class="welcome-subtitle">请输入您的账号信息登录</p>
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          size="large"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              class="custom-input"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              class="custom-input"
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>

          <el-button type="primary" :loading="loading" class="login-btn" @click="handleLogin">
            登录
          </el-button>

          <div class="divider">
            <span>或使用以下方式登录</span>
          </div>

          <div class="social-login">
            <div class="social-btn google">
              <el-icon><Platform /></el-icon>
            </div>
            <div class="social-btn github">
              <el-icon><Link /></el-icon>
            </div>
            <div class="social-btn wechat">
              <el-icon><ChatDotRound /></el-icon>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { User, Lock, Platform, Link, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

defineOptions({ name: 'LoginView' })

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const themeStore = useThemeStore()

const loginForm = reactive({
  username: '',
  password: '',
  remember: false,
})

const loginRules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

// 确保主题色在登录页面加载时被应用
onMounted(() => {
  // 重新应用主题色，确保 CSS 变量被正确设置
  themeStore.togglePrimaryColor(themeStore.primaryColor)
})

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // Simulate login request
      setTimeout(() => {
        loading.value = false
        ElMessage.success('登录成功')
        router.push('/')
      }, 1500)
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background: var(--el-bg-color);
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

/* Left Side Styling */
.login-left {
  position: relative;
  flex: 1;
  background: linear-gradient(
    135deg,
    var(--el-color-primary) 0%,
    color-mix(in srgb, var(--el-color-primary) 60%, #000) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  overflow: hidden;
  color: #fff;

  @media (max-width: 768px) {
    display: none;
  }

  .login-bg-decoration {
    position: absolute;
    top: -20%;
    left: -20%;
    width: 140%;
    height: 140%;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 20%);
    animation: float 20s infinite ease-in-out alternate;
    z-index: 0;
  }

  .brand-content {
    position: relative;
    z-index: 2;
    max-width: 480px;
  }

  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    animation: slideUp 0.8s ease-out;

    .logo-img {
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      object-fit: contain;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
      transition: transform 0.3s ease;
    }

    .brand-title {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #fff;
    }

    &:hover .logo-img {
      transform: scale(1.05);
    }
  }

  .brand-desc {
    font-size: 16px;
    line-height: 1.8;
    opacity: 0.85;
    margin-bottom: 40px;
    animation: slideUp 0.8s ease-out 0.2s backwards;
    color: rgba(255, 255, 255, 0.9);
  }

  .feature-tags {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    animation: slideUp 0.8s ease-out 0.4s backwards;

    span {
      padding: 8px 18px;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      color: rgba(255, 255, 255, 0.95);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .glass-card {
    position: absolute;
    bottom: -50px;
    right: -50px;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border-radius: 50%;
    z-index: 1;
  }
}

/* Right Side Styling */
.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: var(--el-bg-color);
  position: relative;

  .login-form-wrapper {
    width: 100%;
    max-width: 420px;
    animation: fadeIn 1s ease-out;
  }

  .form-header {
    text-align: center;
    margin-bottom: 40px;

    .welcome-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      margin-bottom: 8px;
      letter-spacing: 0.3px;
    }

    .welcome-subtitle {
      font-size: 14px;
      color: var(--el-text-color-placeholder);
      line-height: 1.5;
    }
  }

  .login-form {
    .custom-input {
      :deep(.el-input__wrapper) {
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 0 0 1px var(--el-border-color-lighter) inset;
        transition: all 0.3s ease;
        background: var(--el-fill-color-blank);

        &:hover {
          box-shadow: 0 0 0 1px var(--el-border-color) inset;
        }

        &.is-focus {
          box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
          background: color-mix(in srgb, var(--el-color-primary) 4%, var(--el-fill-color-blank));
        }
      }

      :deep(.el-input__inner) {
        height: 24px;
        font-size: 14px;
      }

      :deep(.el-input__prefix) {
        .el-icon {
          color: var(--el-text-color-placeholder);
        }
      }
    }

    .form-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;

      :deep(.el-checkbox) {
        .el-checkbox__label {
          font-size: 14px;
          color: var(--el-text-color-regular);
        }
      }

      :deep(.el-link) {
        font-size: 14px;
      }
    }

    .login-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
      margin-bottom: 30px;
      transition: all 0.3s ease;
      letter-spacing: 0.5px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px color-mix(in srgb, var(--el-color-primary) 30%, transparent);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  .divider {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--el-border-color-lighter);
    }

    span {
      padding: 0 16px;
      font-size: 12px;
      color: var(--el-text-color-placeholder);
    }
  }

  .social-login {
    display: flex;
    justify-content: center;
    gap: 20px;

    .social-btn {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      border: 1px solid var(--el-border-color-lighter);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: var(--el-text-color-regular);
      font-size: 20px;
      background: var(--el-fill-color-blank);

      &:hover {
        background: var(--el-fill-color-light);
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px color-mix(in srgb, var(--el-color-primary) 15%, transparent);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

/* Animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(-20px, 20px) rotate(5deg);
  }
}
</style>
