<template>
  <div class="redirect-container">
    <div class="redirect-loading">
      <img src="@/assets/logo.svg" alt="logo" class="loading-logo" />
      <div class="loading-text">正在跳转...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'RedirectComponent' })

const route = useRoute()
const router = useRouter()

const { params, query, hash } = route
const path = params.path as string

// 延迟一下，确保路由已完全加载
nextTick(() => {
  setTimeout(() => {
    router.replace({
      path: '/' + path,
      query,
      hash,
    })
  }, 100)
})
</script>

<style scoped>
.redirect-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  z-index: 9999;
}

.redirect-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-logo {
  width: 60px;
  height: 60px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.loading-text {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}
</style>
