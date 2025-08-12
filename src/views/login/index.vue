<template>
  <div class="flex h-screen relative">
    <div class="absolute top-4 left-4 flex items-center z-11">
      <img src="@/assets/vite.svg" alt="logo" class="w-10 mr-2" />
      <div class="text-xl font-medium">Vite</div>
    </div>
    <div
      class="absolute top-4 right-4 flex items-center bg-white p-3 rounded-3xl text-gray-700 shadow-lg border border-gray-200 z-20"
    >
      <BgColorsOutlined class="text-xl mx-2 cursor-pointer hover:text-blue-500 transition-colors" />
      <LayoutOutlined class="text-xl mx-2 cursor-pointer hover:text-purple-500 transition-colors" />
      <CameraOutlined class="text-xl mx-2 cursor-pointer hover:text-green-500 transition-colors" />
      <CarOutlined class="text-xl mx-2 cursor-pointer hover:text-orange-500 transition-colors" />
    </div>
    <div
      class="flex-1 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center flex-col relative overflow-hidden"
    >
      <!-- 动态背景装饰 -->
      <div class="absolute inset-0">
        <div class="floating-circle circle-1"></div>
        <div class="floating-circle circle-2"></div>
        <div class="floating-circle circle-3"></div>
        <div class="floating-circle circle-4"></div>
      </div>

      <!-- 内容区域 -->
      <div class="w-1/3 animate-floatUpDown relative z-10 px-8">
        <img src="@/assets/images/logo-banner.png" alt="logo" class="w-full drop-shadow-2xl" />
        <div class="text-4xl text-gray-700 font-bold drop-shadow-lg text-center mt-4">欢迎使用</div>
        <!-- <div class="text-lg text-gray-600 text-center mt-2 opacity-80">DFAN Admin 管理系统</div> -->
      </div>
    </div>
    <div class="w-1/3 px-20 flex items-center bg-white/90 backdrop-blur-md shadow-xl border-l border-gray-100">
      <routerView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BgColorsOutlined, LayoutOutlined, CameraOutlined, CarOutlined } from '@ant-design/icons-vue'
</script>

<style scoped lang="less">
@keyframes floatUpDown {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-floatUpDown {
  animation: floatUpDown 4s ease-in-out infinite;
}

// 渐变背景动画
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

// 浮动圆圈动画
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.3;
  }
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.2);
  border: 2px solid rgba(59, 130, 246, 0.3);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.circle-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.circle-4 {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 30%;
  animation-delay: 1s;
}

// 为渐变背景添加动画
.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
}
</style>
