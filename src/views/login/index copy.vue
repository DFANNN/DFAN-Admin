<template>
  <div class="login-container">
    <!-- 背景装饰圆圈 -->
    <div class="bg-decoration-orange"></div>
    <div class="bg-decoration-blue"></div>

    <div class="login-card">
      <!-- 左侧插画区域 -->
      <div class="login-left">
        <div class="brand">
          <img src="@/assets/logo.svg" alt="logo" class="logo" />
          <span class="brand-name">Spike Admin</span>
        </div>
        <div class="illustration-wrapper">
          <!-- 使用 Lottie 3D 动态插画 -->
          <lottie-player
            src="/src/assets/lotties/hello.json"
            background="transparent"
            speed="1"
            style="width: 100%; height: 100%; max-width: 500px"
            loop
            autoplay
          ></lottie-player>
        </div>
      </div>

      <!-- 右侧表单区域 -->
      <div class="login-right">
        <div class="login-form-wrapper">
          <h2 class="title">Welcome to Spike Admin</h2>
          <p class="subtitle">Your Admin Dashboard</p>

          <!-- 社交登录 -->
          <div class="social-login">
            <el-button class="social-btn">
              <template #icon>
                <img src="https://www.google.com/favicon.ico" alt="google" class="social-icon" />
              </template>
              Sign in with Google
            </el-button>
            <el-button class="social-btn">
              <template #icon>
                <img src="https://www.facebook.com/favicon.ico" alt="fb" class="social-icon" />
              </template>
              Sign in with FB
            </el-button>
          </div>

          <div class="divider">
            <span class="divider-text">or sign in with</span>
          </div>

          <!-- 登录表单 -->
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-position="top"
            class="login-form"
          >
            <el-form-item label="Username" prop="username">
              <el-input v-model="loginForm.username" placeholder="info@wrappixel.com" />
            </el-form-item>

            <el-form-item label="Password" prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                show-password
                placeholder="........"
              />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="rememberMe">Remeber this Device</el-checkbox>
              <el-link type="primary" :underline="false">Forgot Password ?</el-link>
            </div>

            <el-button type="primary" class="submit-btn" :loading="loading" @click="handleLogin">
              Sign In
            </el-button>
          </el-form>

          <p class="register-link">
            New to Spike? <el-link type="primary" :underline="false">Create an account</el-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { login } from '@/api/login'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'LoginView',
})

onMounted(() => {
  // 加载 Lottie Player 脚本
  if (!document.getElementById('lottie-player-script')) {
    const script = document.createElement('script')
    script.id = 'lottie-player-script'
    script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'
    document.head.appendChild(script)
  }
})

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
})

const loginRules = reactive<FormRules>({
  username: [{ required: true, message: 'Please input username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please input password', trigger: 'blur' }],
})

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const { data: res } = await login(loginForm)
        if (res.code === 200) {
          localStorage.setItem('token', res.data.token)
          ElMessage.success('Login successful')
          router.push('/')
        } else {
          ElMessage.error(res.message || 'Login failed')
        }
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: #f0f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;

  // 背景装饰
  .bg-decoration-orange {
    position: absolute;
    bottom: -150px;
    left: -50px;
    width: 400px;
    height: 400px;
    background-color: #f99c7d;
    border-radius: 50%;
    opacity: 0.8;
    z-index: 1;
  }

  .bg-decoration-blue {
    position: absolute;
    top: -50px;
    right: -20px;
    width: 250px;
    height: 350px;
    background-color: #5bbff9;
    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
    opacity: 0.8;
    z-index: 1;
    transform: rotate(15deg);
  }
}

.login-card {
  width: 1000px;
  max-width: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  display: flex;
  z-index: 10;
  overflow: hidden;
  min-height: 600px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
}

.login-left {
  flex: 1.1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 40px;

    .logo {
      width: 32px;
      height: 32px;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
    }
  }

  .illustration-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .illustration {
      max-width: 90%;
      height: auto;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
}

.login-right {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-form-wrapper {
    width: 100%;
    max-width: 400px;

    .title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #2a3547;
      margin-bottom: 8px;
    }

    .subtitle {
      font-size: 0.95rem;
      color: #7c8fac;
      margin-bottom: 32px;
    }
  }
}

.social-login {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;

  .social-btn {
    flex: 1;
    height: 44px;
    border: 1px solid #e5eaef;
    border-radius: 8px;
    font-size: 0.85rem;
    color: #2a3547;

    .social-icon {
      width: 18px;
      height: 18px;
    }

    &:hover {
      background-color: #f8fafc;
      border-color: #d1d9e2;
    }
  }
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 32px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #e5eaef;
    z-index: 1;
  }

  .divider-text {
    position: relative;
    z-index: 2;
    background-color: #fff;
    padding: 0 16px;
    font-size: 0.85rem;
    color: #7c8fac;
  }
}

.login-form {
  :deep(.el-form-item__label) {
    font-weight: 600;
    color: #2a3547;
    margin-bottom: 8px;
    padding: 0;
  }

  :deep(.el-input__wrapper) {
    padding: 8px 16px;
    border-radius: 8px;
    box-shadow: 0 0 0 1px #e5eaef inset;

    &.is-focus {
      box-shadow: 0 0 0 1px var(--el-color-primary) inset;
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    :deep(.el-checkbox__label) {
      color: #2a3547;
      font-size: 0.85rem;
    }
  }

  .submit-btn {
    width: 100%;
    height: 48px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    background-color: #3182ce;
    border: none;
    margin-bottom: 24px;

    &:hover {
      background-color: #2b6cb0;
    }
  }
}

.register-link {
  text-align: center;
  font-size: 0.9rem;
  color: #7c8fac;

  .el-link {
    font-weight: 600;
  }
}
</style>
