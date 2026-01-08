<template>
  <div class="login-container">
    <div class="card-wrapper">
      <!-- 背景装饰圆圈 -->
      <div class="bg-decoration-orange"></div>
      <div class="bg-decoration-blue"></div>

      <div class="login-card">
        <!-- 顶部区域 -->
        <div class="login-card-top">
          <!-- logo -->
          <div class="brand">
            <img :src="APP_CONFIG.logoSrc" alt="logo" class="logo" />
            <span class="brand-name">{{ APP_CONFIG.name }}</span>
          </div>
          <!-- 操作按钮 -->
          <div class="top-actions">
            <I18nDropdown />
            <HoverAnimateWrapper name="rotate">
              <IconButton
                icon="HOutline:Cog6ToothIcon"
                tooltip="主题配置"
                @click="themeStore.themeConfigDrawerOpen = true"
              />
            </HoverAnimateWrapper>
          </div>
        </div>

        <!-- 底部区域 -->
        <div class="login-card-bottom">
          <!-- 左侧动画区域 -->
          <div class="lottie-animation-wrap">
            <LottieAnimation :animationData="helloLottie" width="100%" height="100%" />
          </div>

          <!-- 右侧表单区域 -->
          <div class="login-form-wrap">
            <Transition name="fade-slide" mode="out-in">
              <AccountLogin v-if="loginMode === 'login'" @goToMode="goToMode" />
              <ForgotPassword v-else-if="loginMode === 'forgot'" @goToMode="goToMode" />
              <MobileLogin v-else-if="loginMode === 'mobile'" @goToMode="goToMode" />
              <QrLogin v-else-if="loginMode === 'qr'" @goToMode="goToMode" />
              <Register v-else-if="loginMode === 'register'" @goToMode="goToMode" />
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <ThemeConfig />

    <!-- 版权信息 -->
    <div class="login-copyright">Copyright &copy; 2025 DFANNN</div>
  </div>
</template>

<script setup lang="ts">
import { APP_CONFIG } from '@/config/app.config'
import helloLottie from '@/assets/lotties/hello.json'
import LottieAnimation from '@/components/animation/LottieAnimation.vue'
import AccountLogin from '@/views/login/accountLogin.vue'
import ForgotPassword from '@/views/login/forgotPassword.vue'
import MobileLogin from '@/views/login/mobileLogin.vue'
import QrLogin from '@/views/login/qrLogin.vue'
import Register from '@/views/login/register.vue'
import ThemeConfig from '@/components/ThemeConfig.vue'
import I18nDropdown from '@/layouts/i18nDropdown.vue'
import type { ILoginMode } from '@/types/login'

defineOptions({ name: 'LoginView' })

const themeStore = useThemeStore()

// 登录模式：login | forgot | mobile | qr | register
const loginMode = ref<ILoginMode>('login')

//  切换登录模式
const goToMode = (mode: ILoginMode) => {
  loginMode.value = mode
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: var(--el-bg-color-page);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;

  .card-wrapper {
    width: 100%;
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;

    // 背景装饰 (保留原始颜色)
    .bg-decoration-orange {
      position: absolute;
      bottom: -100px;
      left: -100px;
      width: 400px;
      height: 400px;
      background-color: #f99c7d;
      border-radius: 50%;
      opacity: 0.8;
      z-index: -1;
      animation: float-orange 20s infinite ease-in-out;
      filter: blur(20px);
    }

    .bg-decoration-blue {
      position: absolute;
      top: -120px;
      right: -100px;
      width: 350px;
      height: 450px;
      background-color: #5bbff9;
      border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
      opacity: 0.8;
      z-index: -1;
      transform: rotate(15deg);
      animation: float-blue 25s infinite ease-in-out;
      filter: blur(20px);
    }
  }

  .login-card {
    width: 68.75rem;
    max-width: 95%;
    background: var(--el-bg-color-overlay);
    border-radius: 16px;
    box-shadow: var(--el-box-shadow-light);
    display: flex;
    flex-direction: column;
    z-index: 10;
    overflow: hidden;
    padding: 2.5rem;

    .login-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        .logo {
          width: 2.5rem;
          height: 2.5rem;
        }
        .brand-name {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }
      }

      .top-actions {
        display: flex;
        align-items: center;
        .el-link {
          font-size: 0.9rem;
          color: var(--el-text-color-secondary);
        }
      }
    }

    .login-card-bottom {
      display: flex;
      gap: 2rem;

      .lottie-animation-wrap {
        flex: 1.1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
      }

      .login-form-wrap {
        flex: 1;
        min-height: 34.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }

  .login-copyright {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 0.85rem;
    color: var(--el-text-color-placeholder);
    z-index: 20;
  }
}

@keyframes float-orange {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -20px);
  }
}

@keyframes float-blue {
  0%,
  100% {
    transform: rotate(15deg) translate(0, 0);
  }
  50% {
    transform: rotate(20deg) translate(-20px, 30px);
  }
}

:deep(.el-divider__text) {
  background-color: var(--el-bg-color-overlay);
}

@media (max-width: 992px) {
  .login-container {
    padding: 10px;

    .card-wrapper {
      width: 100%;
    }

    .login-card {
      width: 98%;
      max-width: 98%;
      padding: 2rem 1.5rem;

      .login-card-bottom {
        flex-direction: column; // 移动端垂直排列

        .lottie-animation-wrap {
          display: none;
        }
      }
    }
  }
}
</style>
