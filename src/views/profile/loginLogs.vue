<!-- 登录日志 -->
<template>
  <BaseCard>
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
      <el-table
        :data="userStore.userInfo?.loginLogs"
        :border="TABLE_CONFIG.border"
        show-overflow-tooltip
        class="custom-modern-table"
      >
        <el-table-column prop="device" label="设备型号" min-width="150" />
        <el-table-column prop="browser" label="浏览器/版本" min-width="200" />
        <el-table-column prop="ip" label="IP 地址" min-width="150" />
        <el-table-column prop="location" label="地理位置" min-width="180" />
        <el-table-column prop="time" label="登录时间" min-width="170" />
        <el-table-column label="结果" width="100">
          <template #default="{ row }">
            <BaseTag :type="row.status" :text="row.status === 'success' ? '成功' : '失败'" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { TABLE_CONFIG } from '@/config/elementConfig'
import { exportToExcel } from '@/utils/exportExcel'

const userStore = useUserStore()

// 导出登录日志为Excel
const exportLoginLogsExcel = async () => {
  exportToExcel({
    fileName: '登录日志.xlsx',
    sheetName: '登录日志',
    data: userStore.userInfo?.loginLogs || [],
    columns: {
      device: '设备型号',
      browser: '浏览器/版本',
      ip: 'IP 地址',
      location: '地理位置',
      time: '登录时间',
      status: '结果',
    },
  })
}
</script>

<style scoped lang="scss"></style>
