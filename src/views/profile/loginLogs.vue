<!-- 登录日志 -->
<template>
  <BaseCard>
    <el-empty v-if="!userStore.userInfo?.loginLogs?.length" description="暂无登录日志" />
    <div v-else>
      <BasePage
        :tableData="userStore.userInfo?.loginLogs"
        :columns="columns"
        :show-pagination="false"
      >
        <template #status="{ row }">
          <BaseTag :type="row.status" :text="row.status === 'success' ? '成功' : '失败'" />
        </template>
      </BasePage>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
const userStore = useUserStore()

const list = [
  ...Array.from({ length: 100 }, (_, index) => ({
    device: `设备${index + 1}`,
    browser: `浏览器${index + 1}`,
    ip: `192.168.1.${index + 1}`,
    location: `位置${index + 1}`,
    time: `2026-01-01 12:00:00`,
    status: index % 2 === 0 ? 'success' : 'danger',
  })),
]
console.log(list)

// 表格列配置
const columns = ref([
  { type: 'selection', width: 55 },
  { type: 'index', label: '序号', width: 55, fixed: 'left' },
  { prop: 'device', label: '设备型号', minWidth: 150 },
  { prop: 'browser', label: '浏览器/版本', minWidth: 200 },
  { prop: 'ip', label: 'IP 地址', minWidth: 150 },
  { prop: 'location', label: '地理位置', minWidth: 180 },
  { prop: 'time', label: '登录时间', minWidth: 170 },
  { prop: 'status', label: '结果', width: 100 },
])
</script>

<style scoped lang="scss"></style>
