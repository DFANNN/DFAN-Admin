<template>
  <div class="login-container">
    <div class="login-left">
      <!-- logo -->
      <div class="logo-section">
        <img src="@/assets/logo.svg" alt="logo" class="logo-img" />
        <h1 class="logo-title">CAT Admin</h1>
        <el-tooltip content="主题配置" placement="bottom" effect="dark">
          <div class="action-btn" @click="themeStore.themeConfigDrawerOpen = true">
            <el-icon><component :is="menuStore.iconComponents['Setting']" /></el-icon>
          </div>
        </el-tooltip>
      </div>

      <!--  登录 -->
      <div class="login-form-wrapper">
        <div class="form-header">
          <h2 class="welcome-title">欢迎回来</h2>
          <p class="welcome-subtitle">请输入您的账号信息登录系统</p>
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
              :prefix-icon="menuStore.iconComponents['User']"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="menuStore.iconComponents['Lock']"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="loginForm.remember" @change="handleRememberChange">
              记住我
            </el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>

          <el-button type="primary" :loading="loading" class="login-btn" @click="handleLogin">
            登录
          </el-button>

          <el-divider>
            <span class="divider-text">或使用以下方式登录</span>
          </el-divider>

          <div class="social-login">
            <div class="social-btn">
              <el-tooltip content="Google登录" placement="bottom" effect="dark">
                <el-icon><component :is="menuStore.iconComponents['ChromeFilled']" /></el-icon>
              </el-tooltip>
            </div>
            <div class="social-btn">
              <el-tooltip content="Element登录" placement="bottom" effect="dark">
                <el-icon><component :is="menuStore.iconComponents['ElemeFilled']" /></el-icon>
              </el-tooltip>
            </div>
            <div class="social-btn">
              <el-tooltip content="Switch登录" placement="bottom" effect="dark">
                <el-icon><component :is="menuStore.iconComponents['SwitchFilled']" /></el-icon>
              </el-tooltip>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="login-right">
      <div class="brand-background"></div>
      <div class="brand-content">
        <el-carousel
          :interval="5000"
          indicator-position="outside"
          height="100%"
          class="logo-carousel"
        >
          <el-carousel-item v-for="(logo, index) in userStore.cats" :key="index">
            <div class="logo-slide">
              <div class="logo-frame">
                <img :src="logo.src" :alt="logo.alt" class="logo-image" />
              </div>
              <h3 class="logo-title">{{ logo.title }}</h3>
              <p v-if="logo.description" class="logo-desc">{{ logo.description }}</p>
              <div v-if="logo.tags?.length" class="logo-tags">
                <span v-for="tag in logo.tags" :key="tag" class="logo-tag">{{ tag }}</span>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="brand-decoration">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
      </div>
    </div>

    <ThemeConfig />
  </div>
</template>

<script setup lang="ts">
import ThemeConfig from '@/layouts/themeConfig.vue'
import { login } from '@/api/login'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'LoginView' })

const router = useRouter()
const themeStore = useThemeStore()
const menuStore = useMenuStore()
const userStore = useUserStore()

const loginFormRef = useTemplateRef<FormInstance>('loginFormRef')

const loading = ref(false)

// 记住我的 localStorage key
const REMEMBER_USERNAME_KEY = 'remember_username'

const loginForm = ref({
  username: '',
  password: '',
  remember: false,
})

// 从 localStorage 读取记住的用户名
const loadRememberedUsername = () => {
  const rememberedUsername = localStorage.getItem(REMEMBER_USERNAME_KEY)
  if (rememberedUsername) {
    loginForm.value.username = rememberedUsername
    loginForm.value.remember = true
  }
}

// 保存或清除记住的用户名
const handleRememberChange = (value: boolean | string | number) => {
  const remember = Boolean(value)
  if (remember) {
    // 保存用户名
    if (loginForm.value.username) {
      localStorage.setItem(REMEMBER_USERNAME_KEY, loginForm.value.username)
    }
  } else {
    // 清除保存的用户名
    localStorage.removeItem(REMEMBER_USERNAME_KEY)
  }
}

const handleLogin = async () => {
  await loginFormRef.value?.validate()
  loading.value = true
  try {
    const { data: res } = await login(loginForm.value)
    if (res.code !== 200) return
    if (!res.data || !res.data.token) return
    localStorage.setItem('token', res.data.token)
    if (loginForm.value.remember) {
      localStorage.setItem(REMEMBER_USERNAME_KEY, loginForm.value.username)
    } else {
      localStorage.removeItem(REMEMBER_USERNAME_KEY)
    }
    ElMessage.success('登录成功')
    router.push('/')
  } finally {
    loading.value = false
  }
}

const loginRules = ref<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

// 页面加载时读取记住的用户名
onMounted(() => {
  loadRememberedUsername()
})
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background: var(--el-bg-color);
  overflow: hidden;
  position: relative;
  .login-left {
    flex: 0 0 45%;
    display: flex;
    flex-direction: column;
    background: var(--el-bg-color);
    padding: 40px 60px;
    position: relative;
    z-index: 2;
    // 异形右边缘 - 圆润的曲线
    clip-path: polygon(
      0% 0%,
      100% 0%,
      100% 3%,
      99.5% 6%,
      100% 10%,
      99% 15%,
      100% 20%,
      99.5% 25%,
      100% 30%,
      99% 35%,
      100% 40%,
      99.5% 45%,
      100% 50%,
      99% 55%,
      100% 60%,
      99.5% 65%,
      100% 70%,
      99% 75%,
      100% 80%,
      99.5% 85%,
      100% 90%,
      99% 93%,
      100% 96%,
      99.7% 98%,
      100% 100%,
      0% 100%
    );

    @media (max-width: 768px) {
      flex: 1;
      padding: 30px 24px;
      clip-path: none; // 移动端取消异形效果
    }

    .logo-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 60px;
      animation: slideDown 0.6s ease-out;
      .logo-img {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
        object-fit: contain;
      }
      .logo-title {
        font-size: 24px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        letter-spacing: 0.5px;
        flex: 1;
      }
      .action-btn {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--el-text-color-regular);
        background: transparent;
        &:hover {
          background: var(--el-fill-color-light);
          color: var(--el-color-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .el-icon {
          font-size: 18px;
        }
      }
    }
    .login-form-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: 420px;
      margin: 0 auto;
      width: 100%;
      animation: fadeInUp 0.8s ease-out 0.2s backwards;

      .form-header {
        margin-bottom: 40px;
        .welcome-title {
          font-size: 36px;
          font-weight: 800;
          color: var(--el-text-color-primary);
          margin-bottom: 12px;
          letter-spacing: 0.5px;
          line-height: 1.2;
        }
        .welcome-subtitle {
          font-size: 15px;
          color: var(--el-text-color-regular);
          line-height: 1.6;
        }
      }
      .login-form {
        .form-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .login-btn {
          width: 100%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 5px;
          margin-bottom: 32px;

          &:hover {
            transform: translateY(-2px);
          }
        }

        .divider-text {
          font-size: 12px;
          color: var(--el-text-color-placeholder);
        }

        .social-login {
          display: flex;
          justify-content: center;
          gap: 16px;
          .social-btn {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: var(--el-text-color-regular);
            font-size: 20px;

            &:hover {
              color: var(--el-color-primary);
              transform: translateY(-2px);
            }
          }
        }
      }
    }
  }
  .login-right {
    flex: 1;
    position: relative;
    background: var(--login-brand-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
    overflow: hidden;
    color: var(--login-brand-text-color);
    // 异形左边缘 - 与左侧互补的圆润曲线
    clip-path: polygon(
      0% 0%,
      0.3% 2%,
      0% 4%,
      0.5% 7%,
      0% 10%,
      1% 15%,
      0% 20%,
      0.5% 25%,
      0% 30%,
      1% 35%,
      0% 40%,
      0.5% 45%,
      0% 50%,
      1% 55%,
      0% 60%,
      0.5% 65%,
      0% 70%,
      1% 75%,
      0% 80%,
      0.5% 85%,
      0% 90%,
      1% 93%,
      0% 96%,
      0.3% 98%,
      0% 100%,
      100% 100%,
      100% 0%
    );

    @media (max-width: 768px) {
      display: none;
    }

    .brand-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: var(--login-brand-bg-pattern);
      animation: float 25s infinite ease-in-out alternate;
    }

    .brand-content {
      position: relative;
      z-index: 3;
      width: 100%;
      max-width: 500px;
      height: 100%;
      display: flex;
      align-items: center;

      .logo-carousel {
        width: 100%;
        height: 500px;

        :deep(.el-carousel__container) {
          height: 100%;
        }

        :deep(.el-carousel__item) {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .logo-slide {
        text-align: center;
        animation: fadeInScale 0.8s ease-out;

        .logo-frame {
          margin-bottom: 32px;
          display: inline-flex;
          padding: 0;
          background: transparent;
          border-radius: 0;
          border: none;
          max-width: 320px;
          transition: transform 0.3s ease;

          &:hover {
            transform: scale(1.05);
          }
        }

        .logo-image {
          width: 100%;
          height: auto;
        }

        .logo-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
          color: var(--login-brand-text-color);
        }

        .logo-desc {
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 32px;
          color: var(--login-brand-desc-color);
          opacity: 0.95;
        }

        .logo-tags {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;

          .logo-tag {
            padding: 8px 20px;
            background: var(--login-brand-tag-bg);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            border: 1px solid var(--login-brand-tag-border);
            color: var(--login-brand-text-color);
            transition: all 0.3s ease;

            &:hover {
              background: color-mix(in srgb, var(--login-brand-tag-bg) 60%, #ffffff);
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
          }
        }
      }
    }

    .brand-decoration {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 2;

      .decoration-circle {
        position: absolute;
        border-radius: 50%;
        background: var(--login-brand-decoration-bg);
        backdrop-filter: blur(20px);
        animation: floatCircle 20s infinite ease-in-out;

        &.circle-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          right: 10%;
          animation-delay: 0s;
        }

        &.circle-2 {
          width: 150px;
          height: 150px;
          bottom: 15%;
          left: 15%;
          animation-delay: 5s;
        }

        &.circle-3 {
          width: 100px;
          height: 100px;
          top: 50%;
          right: 20%;
          animation-delay: 10s;
        }
      }
    }
  }
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatCircle {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(20px, -20px) scale(1.1);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
