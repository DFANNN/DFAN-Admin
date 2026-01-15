<template>
  <!-- 各渠道销售表现实时榜单 -->
  <el-card class="channel-sales-card" shadow="never">
    <template #header>
      <div class="flex justify-between items-center gap-3 font-bold">
        <span>各渠道销售表现实时榜单</span>
        <IconButton icon="HOutline:EllipsisHorizontalIcon" size="1.5rem" />
      </div>
    </template>

    <el-scrollbar :height="260">
      <el-table :data="channelSales" style="width: 100%">
        <el-table-column label="渠道名称" width="250">
          <template #default="{ row }">
            <div class="profile-cell">
              <div class="project-icon" :style="{ backgroundColor: row.color }">
                {{ row.name.charAt(0) }}
              </div>
              <div class="name-role">
                <div class="name">{{ row.name }}</div>
                <div class="role">负责人: {{ row.owner }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="revenue" label="销售额" min-width="150">
          <template #default="{ row }">
            <div class="font-bold">￥{{ row.revenue }}</div>
          </template>
        </el-table-column>
        <el-table-column label="达成率" min-width="180">
          <template #default="{ row }">
            <el-progress
              :percentage="row.achievement"
              :color="row.achievement > 90 ? '#10b981' : '#5bbff9'"
            />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.statusType" effect="dark" round>{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
  </el-card>
</template>

<script setup lang="ts">
// 渠道销售数据
const channelSales = ref([
  {
    name: '移动端 App',
    owner: 'David Fan',
    revenue: '542,800',
    achievement: 92,
    status: '引领增长',
    statusType: 'success',
    color: '#8b5cf6',
  },
  {
    name: '天猫旗舰店',
    owner: 'Alice Zhang',
    revenue: '320,400',
    achievement: 88,
    status: '稳健运行',
    statusType: 'primary',
    color: '#ef4444',
  },
  {
    name: '抖音直播间',
    owner: 'Mike Lee',
    revenue: '281,000',
    achievement: 100,
    status: '爆发期',
    statusType: 'warning',
    color: '#f59e0b',
  },
  {
    name: '京东商城',
    owner: 'Lisa Wang',
    revenue: '240,000',
    achievement: 80,
    status: '新店开张',
    statusType: 'info',
    color: '#3b82f6',
  },
])
</script>

<style scoped lang="scss">
.el-icon {
  font-size: 1.25rem;
  color: var(--el-color-primary);
}

.channel-sales-card {
  border: none;
  border-radius: 1rem;
}

.profile-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  .project-icon {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.5rem;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }
  .name {
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
  .role {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-extra-light);
}
</style>
