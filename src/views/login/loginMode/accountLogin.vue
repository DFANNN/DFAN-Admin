<template>
  <div class="w-full">
    <div class="text-3xl">欢迎回来 👋🏻</div>
    <div class="text-sm text-gray-500 my-4">请输入您的帐户信息以开始管理您的项目</div>
    <a-form :model="loginForm" layout="vertical" autocomplete="off">
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="loginForm.username" />
      </a-form-item>
      <a-form-item label="账号" name="password">
        <a-input-password v-model:value="loginForm.password" />
      </a-form-item>
      <a-form-item label="验证码" name="password">
        <a-input-password v-model:value="loginForm.password" />
      </a-form-item>
      <a-form-item>
        <div class="flex justify-between text-sm">
          <a-checkbox v-model:checked="remember">记住账户</a-checkbox>
          <div class="text-[#1677FF] cursor-pointer">忘记密码？</div>
        </div>
      </a-form-item>
      <a-form-item>
        <div class="flex flex-col">
          <a-button type="primary">登录</a-button>
          <div class="flex justify-between mt-4 gap-4">
            <a-button class="flex-1">手机号登录</a-button>
            <a-button class="flex-1">扫码登录</a-button>
          </div>
        </div>
      </a-form-item>
    </a-form>
    <a-divider :plain="true">其他登录方式</a-divider>
    <div class="flex gap-4 items-center justify-center">
      <WechatOutlined class="cursor-pointer" />
      <QqOutlined class="cursor-pointer" />
      <GithubOutlined class="cursor-pointer" />
      <TwitterOutlined class="cursor-pointer" />
    </div>
    <div class="text-sm text-center mt-4">
      <span>还没有账号？</span>
      <span class="text-[#1677FF] cursor-pointer">创建账号</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WechatOutlined, QqOutlined, TwitterOutlined, GithubOutlined } from '@ant-design/icons-vue'

const loginForm = ref({
  username: '',
  password: ''
})

const remember = ref(false)
</script>

<style scoped lang="less">
:deep(.ant-divider-inner-text) {
  color: oklch(55.1% 0.027 264.364);
}
</style>
