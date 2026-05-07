<template>
  <div class="form-content-inner">
    <h2 class="title">{{ $t('login.title') }}</h2>
    <p class="subtitle">{{ $t('login.subtitle') }}</p>

    <!-- 登录表单 -->
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      label-position="top"
      class="login-form"
      @keyup.enter="handleLogin"
    >
      <el-form-item>
        <el-select
          v-model="rolePreset"
          :placeholder="$t('login.loginRolePlaceholder')"
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
        <el-input v-model="loginForm.username" :placeholder="$t('login.usernamePlaceholder')" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          show-password
          :placeholder="$t('login.passwordPlaceholder')"
        />
      </el-form-item>

      <div class="form-options">
        <el-checkbox v-model="loginForm.remember" @change="handleRememberChange">{{
          $t('login.rememberMe')
        }}</el-checkbox>
        <el-link type="primary" :underline="false" @click="emits('goToMode', 'forgot')">{{
          $t('login.forgotPassword')
        }}</el-link>
      </div>

      <el-button type="primary" class="submit-btn" :loading="loading" @click="handleLogin">
        {{ $t('button.login') }}
      </el-button>
    </el-form>

    <!-- 其他登录方式 -->
    <div class="divider" v-if="APP_CONFIG.showPhoneLogin || APP_CONFIG.showQrLogin">
      <el-divider>
        <span class="divider-text">{{ $t('login.orUseOtherMethods') }}</span>
      </el-divider>
    </div>

    <div class="social-login">
      <el-button
        class="social-btn"
        @click="emits('goToMode', 'mobile')"
        v-if="APP_CONFIG.showPhoneLogin"
      >
        <template #icon>
          <el-icon>
            <component :is="menuStore.iconComponents['Element:Iphone']" />
          </el-icon>
        </template>
        {{ $t('button.phoneLogin') }}
      </el-button>
      <el-button class="social-btn" @click="emits('goToMode', 'qr')" v-if="APP_CONFIG.showQrLogin">
        <template #icon>
          <el-icon>
            <component :is="menuStore.iconComponents['Element:FullScreen']" />
          </el-icon>
        </template>
        {{ $t('button.scanLogin') }}
      </el-button>
    </div>

    <p class="register-link" v-if="APP_CONFIG.showRegister">
      <span>{{ $t('login.noAccount') }}</span>
      <el-link type="primary" :underline="false" @click="emits('goToMode', 'register')">{{
        $t('login.registerNow')
      }}</el-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { APP_CONFIG } from '@/config/app.config'
import platform from 'platform'
import { login, addLoginLog } from '@/api/login'
import { dayjs, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import type { FormInstance, FormRules } from 'element-plus'
import type { ILoginMode } from '@/types/login'

interface IEmits {
  (e: 'goToMode', mode: ILoginMode): void
}

const emits = defineEmits<IEmits>()

const { t } = useI18n()
const router = useRouter()
const menuStore = useMenuStore()
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
  {
    label: t('login.superAdmin'),
    value: 'super_admin',
    preset: { username: 'admin', password: 'admin' },
  },
  { label: t('login.admin'), value: 'normal', preset: { username: 'user2', password: 'user2' } },
  { label: t('login.guest'), value: 'noperm', preset: { username: 'user3', password: 'user3' } },
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
    if (loginForm.value.username) {
      localStorage.setItem(REMEMBER_USERNAME_KEY, loginForm.value.username)
    }
  } else {
    localStorage.removeItem(REMEMBER_USERNAME_KEY)
  }
}

/**
 * 添加登录日志
 * 使用 https://ipapi.co/json/ 获取ip 地理位置信息
 * 使用 platform 获取浏览器信息
 */
const handleAddLoginLog = async () => {
  const ipRes = await fetch('https://ipapi.co/json/').then((res) => res.json())

  const logData = {
    device: platform.os?.toString() || '未知',
    browser: `${platform.name || '未知'} ${platform.version || '未知'}`,
    ip: ipRes.ip || '未知',
    location: [ipRes.country_name, ipRes.region, ipRes.city],
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    status: 'success',
  }

  await addLoginLog(logData)
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
    ElMessage.success(t('login.loginSuccess'))
    router.push('/')
    // 添加登录日志
    await handleAddLoginLog()
  } finally {
    loading.value = false
  }
}

const loginRules = reactive<FormRules>({
  username: [{ required: true, message: t('login.usernamePlaceholder'), trigger: 'blur' }],
  password: [{ required: true, message: t('login.passwordPlaceholder'), trigger: 'blur' }],
})

onMounted(() => {
  loadRememberedUsername()
  applyPreset(rolePreset.value)
})
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
    margin-bottom: 1.7rem;
  }

  .login-form {
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
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .submit-btn {
      width: 100%;
      height: 2.75rem;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      letter-spacing: 0.5rem;
    }
  }

  .divider {
    margin-bottom: 2rem;
    .divider-text {
      font-size: 0.75rem;
      color: var(--el-text-color-placeholder);
    }
  }

  .social-login {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
    .social-btn {
      flex: 1;
      height: 2.75rem;
      border-radius: 8px;

      .social-icon {
        width: 18px;
        height: 18px;
      }
    }
  }

  .register-link {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.875rem;
    color: var(--el-text-color-secondary);
    .el-link {
      margin-left: 0.5rem;
      font-weight: 600;
    }
  }
}
</style>
