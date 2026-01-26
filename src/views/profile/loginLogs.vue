<template>
  <el-card class="login-logs-card" shadow="never">
    <el-empty v-if="!userStore.userInfo?.loginLogs?.length" description="暂无登录日志" />
    <div v-else>
      <div class="flex justify-end mb-4">
        <el-button
          type="primary"
          :disabled="!userStore.userInfo?.loginLogs.length"
          @click="exportLoginLogsExcel"
          >导出日志</el-button
        >
      </div>
      <el-table :data="userStore.userInfo?.loginLogs" class="custom-modern-table">
        <el-table-column prop="device" label="设备型号" min-width="150" />
        <el-table-column prop="browser" label="浏览器/版本" min-width="200" />
        <el-table-column prop="ip" label="IP 地址" min-width="150" />
        <el-table-column prop="location" label="地理位置" min-width="180" />
        <el-table-column prop="time" label="登录时间" min-width="170" />
        <el-table-column label="结果" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status"> {{ row.status === 'success' ? '成功' : '失败' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'

const userStore = useUserStore()

// 导出登录日志为Excel
const exportLoginLogsExcel = async () => {
  const logList = userStore.userInfo?.loginLogs || []

  const data = logList.map((log) => ({
    设备型号: log.device,
    浏览器: log.browser,
    IP: log.ip,
    地理位置: log.location.toString(),
    登录时间: log.time,
    结果: log.status === 'success' ? '成功' : '失败',
  }))

  const sheet = XLSX.utils.json_to_sheet(data)
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, sheet, '登录日志')

  XLSX.writeFile(book, '登录日志.xlsx')
}
</script>

<style scoped lang="scss">
.login-logs-card {
  border: none;
  border-radius: 1rem;
}
</style>
