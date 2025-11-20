<template>
  <div class="login-container">
    <!-- Left Side: Login Form (40-50%) -->
    <div class="login-left">
      <div class="logo-section">
        <img src="@/assets/logo.svg" alt="logo" class="logo-img" />
        <h1 class="logo-title">CAT Admin</h1>
      </div>

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
              :prefix-icon="User"
              class="soft-input"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              class="soft-input"
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
            <div class="social-btn">
              <el-icon><Platform /></el-icon>
            </div>
            <div class="social-btn">
              <el-icon><Link /></el-icon>
            </div>
            <div class="social-btn">
              <el-icon><ChatDotRound /></el-icon>
            </div>
          </div>
        </el-form>
      </div>
    </div>

    <!-- Right Side: Brand Experience (50-60%) -->
    <div class="login-right">
      <div class="brand-background"></div>
      <div class="brand-content">
        <el-carousel
          :interval="4000"
          :arrow="carouselArrow"
          indicator-position="none"
          height="100%"
          class="feature-carousel"
        >
          <el-carousel-item v-for="(feature, index) in features" :key="index">
            <div class="feature-slide">
              <div class="feature-icon-wrapper">
                <el-icon :size="80" class="feature-icon">
                  <component :is="feature.icon" />
                </el-icon>
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-desc">{{ feature.description }}</p>
              <div class="feature-tags">
                <span v-for="tag in feature.tags" :key="tag" class="feature-tag">{{ tag }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  User,
  Lock,
  Platform,
  Link,
  ChatDotRound,
  DataAnalysis,
  Lock as SecurityIcon,
  Cloudy,
} from '@element-plus/icons-vue'
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

// 轮播图箭头显示控制（桌面端显示，移动端隐藏右侧）
const carouselArrow = 'hover'

// 功能特性轮播数据
const features = [
  {
    title: '数据分析',
    description: '强大的数据可视化与分析能力，帮助您快速洞察业务趋势',
    icon: DataAnalysis,
    tags: ['实时监控', '智能分析', '可视化报表'],
  },
  {
    title: '安全可靠',
    description: '企业级安全防护，多重加密保障，让您的数据安全无忧',
    icon: SecurityIcon,
    tags: ['数据加密', '权限控制', '安全审计'],
  },
  {
    title: '云端部署',
    description: '支持云端部署，弹性扩展，随时随地访问您的管理系统',
    icon: Cloudy,
    tags: ['弹性扩展', '高可用', '云端同步'],
  },
]

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
  background: #ffffff;
  overflow: hidden;
  position: relative;
}

/* Left Side: Login Form (40-50%) */
.login-left {
  flex: 0 0 45%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
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
      margin: 0;
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
  }

  .form-header {
    margin-bottom: 40px;

    .welcome-title {
      font-size: 36px;
      font-weight: 800;
      color: var(--el-text-color-primary);
      margin-bottom: 12px;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }

    .welcome-subtitle {
      font-size: 15px;
      color: var(--el-text-color-regular);
      line-height: 1.6;
    }
  }

  .login-form {
    .soft-input {
      :deep(.el-input__wrapper) {
        padding: 14px 18px;
        border-radius: 12px;
        border: none;
        box-shadow: none;
        background: var(--el-fill-color-light);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          background: var(--el-fill-color);
        }

        &.is-focus {
          background: var(--el-fill-color-blank);
          box-shadow: 0 0 0 2px var(--el-color-primary-light-8) inset !important;
        }
      }

      :deep(.el-input__inner) {
        height: 24px;
        font-size: 15px;
        color: var(--el-text-color-primary);
      }

      :deep(.el-input__prefix) {
        .el-icon {
          color: var(--el-text-color-placeholder);
          font-size: 18px;
        }
      }
    }

    .form-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;

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
      height: 50px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px;
      margin-bottom: 32px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      letter-spacing: 0.3px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px color-mix(in srgb, var(--el-color-primary) 35%, transparent);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .divider {
      display: flex;
      align-items: center;
      margin-bottom: 28px;

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
      gap: 16px;

      .social-btn {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        border: 1px solid var(--el-border-color-lighter);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
}

/* Right Side: Brand Experience (50-60%) */
.login-right {
  flex: 1;
  position: relative;
  background:
    linear-gradient(
      120deg,
      color-mix(in srgb, var(--el-color-primary) 35%, #ffffff) 0%,
      color-mix(in srgb, var(--el-color-primary) 50%, #ffffff) 25%,
      color-mix(in srgb, var(--el-color-primary) 70%, #6b46ff) 50%,
      color-mix(in srgb, var(--el-color-primary) 75%, #6b46ff) 75%,
      color-mix(in srgb, var(--el-color-primary) 80%, #2b27ff) 100%
    ),
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.25), transparent 55%),
    radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.2), transparent 45%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  overflow: hidden;
  color: #fff;
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
    background-image:
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 60%);
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
  }

  .feature-carousel {
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

  .feature-slide {
    text-align: center;
    animation: fadeInScale 0.8s ease-out;

    .feature-icon-wrapper {
      margin-bottom: 32px;
      display: inline-flex;
      padding: 24px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: scale(1.1) rotate(5deg);
        background: rgba(255, 255, 255, 0.2);
      }
    }

    .feature-icon {
      color: #fff;
    }

    .feature-title {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 16px;
      letter-spacing: 0.5px;
      color: #fff;
    }

    .feature-desc {
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 32px;
      color: rgba(255, 255, 255, 0.9);
      opacity: 0.95;
    }

    .feature-tags {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;

      .feature-tag {
        padding: 8px 20px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
        border: 1px solid rgba(255, 255, 255, 0.25);
        color: rgba(255, 255, 255, 0.95);
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
      background: rgba(255, 255, 255, 0.05);
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
    transform: scale(0.95);
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
    transform: translate(-30px, 30px) rotate(5deg);
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
</style>
