<template>
  <div class="flex h-screen relative">
    <div class="absolute top-4 left-4 flex items-center">
      <img src="@/assets/vite.svg" alt="logo" class="w-10 mr-2" />
      <div class="text-xl font-medium">Vite</div>
    </div>
    <div class="absolute top-4 right-4 flex items-center bg-gray-200 p-2 rounded-3xl text-gray-500">
      <BgColorsOutlined class="text-xl mx-2 cursor-pointer" />
      <LayoutOutlined class="text-xl mx-2 cursor-pointer" />
      <CameraOutlined class="text-xl mx-2 cursor-pointer" />
      <CarOutlined class="text-xl mx-2 cursor-pointer" />
    </div>
    <div></div>
    <div class="flex-1 bg-gray-100"></div>
    <div class="w-1/3">
      右
      <!-- <routerView /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { BgColorsOutlined, LayoutOutlined, CameraOutlined, CarOutlined } from '@ant-design/icons-vue'
</script>

<style scoped lang="less"></style>
