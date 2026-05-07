<template>
  <div class="form-content-inner">
    <h2 class="title">{{ $t('button.scanLogin') }}</h2>
    <p class="subtitle">
      {{ $t('login.scanTip') }} {{ APP_CONFIG.name }} {{ $t('login.scanAction') }}
    </p>

    <div class="qr-container">
      <div class="qr-placeholder">
        <el-icon :size="120" color="var(--el-text-color-placeholder)">
          <component :is="menuStore.iconComponents['Element:FullScreen']" />
        </el-icon>
        <div class="qr-mask" v-if="qrExpired">
          <p>{{ $t('login.expired') }}</p>
          <el-button type="primary" link @click="qrExpired = false">{{
            $t('button.refresh')
          }}</el-button>
        </div>
      </div>
      <p class="qr-tip">{{ $t('login.scanLoginDescription') }}</p>
      <div class="back-link">
        <el-link :underline="false" @click="emits('goToMode', 'login')">
          <el-icon><component :is="menuStore.iconComponents['Element:ArrowLeft']" /></el-icon>
          {{ $t('login.backToLogin') }}
        </el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { APP_CONFIG } from '@/config/app.config'
import type { IEmits } from '@/types/login'

const emits = defineEmits<IEmits>()
const menuStore = useMenuStore()

const qrExpired = ref(false)
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

  .qr-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.25rem 0;

    .qr-placeholder {
      position: relative;
      width: 12.5rem;
      height: 12.5rem;
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;

      .qr-mask {
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 1rem;
        p {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--el-text-color-primary);
        }
      }
    }

    .qr-tip {
      font-size: 0.9rem;
      color: var(--el-text-color-secondary);
      margin-bottom: 1.25rem;
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
