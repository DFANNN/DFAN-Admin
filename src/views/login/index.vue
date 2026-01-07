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
            <!-- 标题 -->
            <h2 class="title">欢迎回来</h2>
            <p class="subtitle">请输入您的账号信息登录系统</p>

            <!-- 登录表单 -->
            <el-form
              ref="loginFormRef"
              :model="loginForm"
              :rules="loginRules"
              label-position="top"
              class="login-form"
            >
              <el-form-item>
                <el-select
                  v-model="rolePreset"
                  placeholder="请选择登录身份"
                  class="preset-select"
                  @change="applyPreset"
                >
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="username">
                <el-input v-model="loginForm.username" placeholder="请输入用户名/邮箱" />
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  show-password
                  placeholder="请输入密码"
                />
              </el-form-item>

              <div class="form-options">
                <el-checkbox v-model="loginForm.remember" @change="handleRememberChange"
                  >记住我</el-checkbox
                >
                <el-link type="primary" :underline="false">忘记密码？</el-link>
              </div>

              <el-button type="primary" class="submit-btn" :loading="loading" @click="handleLogin">
                登录
              </el-button>
            </el-form>

            <!-- 其他登录方式 -->
            <div class="divider">
              <el-divider>
                <span class="divider-text">或使用以下方式登录</span>
              </el-divider>
            </div>

            <div class="social-login">
              <el-button class="social-btn">
                <template #icon>
                  <el-icon><Iphone /></el-icon>
                </template>
                手机号登录
              </el-button>
              <el-button class="social-btn">
                <template #icon>
                  <el-icon><FullScreen /></el-icon>
                </template>
                扫码登录
              </el-button>
            </div>

            <p class="register-link">
              还没有账号？
              <el-link type="primary" :underline="false">立即注册</el-link>
            </p>
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
import ThemeConfig from '@/components/ThemeConfig.vue'
import I18nDropdown from '@/layouts/i18nDropdown.vue'
import { login } from '@/api/login'
import { ElMessage } from 'element-plus'
import { Iphone, FullScreen } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'LoginView' })

const router = useRouter()
const themeStore = useThemeStore()

const loginFormRef = useTemplateRef<FormInstance>('loginFormRef')

const loading = ref(false)

// 记住我的 localStorage key
const REMEMBER_USERNAME_KEY = 'remember_username'

const loginForm = ref({
  username: '',
  password: '',
  remember: false,
})

type RolePreset = 'super_admin' | 'normal' | 'noperm'

// 默认角色
const rolePreset = ref<RolePreset>('super_admin')
// 角色选项
const roleOptions: Array<{
  label: string
  value: RolePreset
  preset: { username: string; password: string }
}> = [
  { label: '超级管理员', value: 'super_admin', preset: { username: 'admin', password: 'admin' } },
  { label: '普通用户', value: 'normal', preset: { username: 'user2', password: 'user2' } },
  { label: '无权限用户', value: 'noperm', preset: { username: 'user3', password: 'user3' } },
]

// 切换角色
const applyPreset = (value: RolePreset) => {
  const target = roleOptions.find((item) => item.value === value)
  if (!target) return
  loginForm.value.username = target.preset.username
  loginForm.value.password = target.preset.password
}

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

// 登录
const handleLogin = async () => {
  await loginFormRef.value?.validate()
  loading.value = true
  try {
    const { data: res } = await login(loginForm.value)
    if (res.code !== 200) return
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

const loginRules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

// 页面加载时读取记住的用户名
onMounted(() => {
  loadRememberedUsername()
  applyPreset(rolePreset.value)
})
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
    width: 1200px;
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
        display: flex;
        flex-direction: column;
        justify-content: center;

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
      }
    }
  }

  .social-login {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;

    .social-btn {
      flex: 1;
      height: 2.75rem;
      border-radius: 8px;
      font-size: 0.85rem;

      .social-icon {
        width: 18px;
        height: 18px;
      }
    }
  }

  .divider {
    margin-bottom: 2rem;

    .divider-text {
      font-size: 12px;
      color: var(--el-text-color-placeholder);
    }
  }

  .login-form {
    :deep(.el-form-item__label) {
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 8px;
      padding: 0;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select__wrapper) {
      padding: 8px 16px;
      border-radius: 8px;
      box-shadow: 0 0 0 1px var(--el-border-color) inset;
      min-height: 44px;

      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }

    :deep(.el-select) {
      width: 100%;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      :deep(.el-checkbox__label) {
        color: var(--el-text-color-regular);
        font-size: 0.85rem;
      }
    }

    .submit-btn {
      width: 100%;
      height: 3rem;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
  }

  .register-link {
    text-align: center;
    font-size: 0.9rem;
    color: var(--el-text-color-secondary);

    .el-link {
      font-weight: 600;
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
