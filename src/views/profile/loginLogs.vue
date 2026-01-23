<template>
  <el-card class="login-logs-card" shadow="never">
    <el-empty v-if="logList.length === 0" description="暂无登录日志" />
    <el-table :data="logList" class="custom-modern-table">
      <el-table-column prop="device" label="设备型号" min-width="150" />
      <el-table-column prop="browser" label="浏览器/版本" min-width="150" />
      <el-table-column prop="ip" label="IP 地址" min-width="150" />
      <el-table-column prop="location" label="地理位置" min-width="150" />
      <el-table-column prop="time" label="登录时间" min-width="150" />
      <el-table-column label="结果" width="100">
        <template #default="{ row }">
          <span :class="['status-pill', row.status]">
            {{ row.status === 'success' ? '成功' : '失败' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
// 登录日志
const logList = [
  {
    device: 'MacBook Pro 16"',
    browser: 'Chrome 122.0.x',
    ip: '192.168.1.101',
    location: '上海市 · 浦东',
    time: '2023-11-20 10:24',
    status: 'success',
    type: 'PC',
  },
  {
    device: 'iPhone 15 Pro',
    browser: 'Safari Mobile',
    ip: '114.92.3.15',
    location: '上海市 · 静安',
    time: '2023-11-19 18:12',
    status: 'success',
    type: 'Mobile',
  },
  {
    device: 'Windows Desktop',
    browser: 'Edge 119.x',
    ip: '10.22.4.91',
    location: '北京市 · 朝阳',
    time: '2023-11-18 09:45',
    status: 'warning',
    type: 'PC',
  },
  {
    device: 'Ubuntu Server',
    browser: 'CLI / Curl',
    ip: '221.4.12.7',
    location: '香港 · 阿里云',
    time: '2023-11-17 23:10',
    status: 'success',
    type: 'PC',
  },
  {
    device: 'iPad Air 5',
    browser: 'Chrome Mobile',
    ip: '192.168.1.105',
    location: '上海市 · 浦东',
    time: '2023-11-17 14:05',
    status: 'success',
    type: 'Mobile',
  },
]

// fetch('https://ipapi.co/json/') 获取公网ip
// Platform.js  获取浏览器设备等信息
// window.navigator.userAgent 也能获得 但是不好解析
</script>

<style scoped lang="scss">
.login-logs-card {
  border: none;
  border-radius: 1rem;
}
</style>
