<template>
  <!-- 正在进行中的项目 -->
  <el-card class="project-section-card" shadow="never">
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <el-icon size="22">
            <component :is="menuStore.iconComponents['HOutline:SquaresPlusIcon']" />
          </el-icon>
          <span>正在进行的项目</span>
        </div>
        <el-button link type="primary">管理所有项目</el-button>
      </div>
    </template>
    <el-scrollbar :height="500">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
        <div
          v-for="item in projects"
          :key="item.id"
          class="flex flex-col gap-4 p-6 rounded-2xl bg-(--el-bg-color-page) border border-(--el-border-color-extra-light) cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-xl"
              :style="{ backgroundColor: item.color + '20' }"
            >
              <el-icon :style="{ color: item.color }">
                <component :is="menuStore.iconComponents[item.icon]" />
              </el-icon>
            </div>
            <div class="font-bold">{{ item.name }}</div>
          </div>
          <div class="text-sm text-(--el-text-color-secondary)">
            <TextEllipsis :text="item.desc" :line="2" />
          </div>
          <div>
            <div
              class="flex justify-between items-center mb-2 font-semibold text-xs text-(--el-text-color-secondary)"
            >
              <span>完成进度</span>
              <span>{{ item.progress }}%</span>
            </div>
            <el-progress
              :percentage="item.progress"
              :color="item.color"
              :show-text="false"
              :stroke-width="6"
            />
          </div>
          <div class="flex justify-between items-center text-sm text-(--el-text-color-secondary)">
            <div class="flex items-center">
              <el-avatar
                v-for="n in 3"
                :key="n"
                :size="24"
                :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name + n}`"
                class="border-2 -ml-2.5 first:ml-0"
              />
              <div class="text-(--el-text-color-placeholder)">
                +{{ Math.floor(Math.random() * 10) }}
              </div>
            </div>
            <div class="text-(--el-text-color-placeholder)">{{ item.time }}</div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </el-card>
</template>

<script setup lang="ts">
const menuStore = useMenuStore()

// 正在进行的项目
const projects = ref([
  {
    id: 1,
    name: 'Vue Admin Next',
    desc: '基于 Vue 3 + Element Plus 的中后台管理系统，目前进入 Beta 测试阶段。基于 Vue 3 + Element Plus 的中后台管理系统，目前进入 Beta 测试阶段。',
    group: '前端组',
    time: '2025-12-01',
    icon: 'HOutline:ComputerDesktopIcon',
    color: '#4f46e5',
    progress: 85,
  },
  {
    id: 2,
    name: 'AI 数据中心',
    desc: '利用 LLM 大模型进行深度数据清洗与多维度智能化分析平台。',
    group: '算法组',
    time: '2026-01-05',
    icon: 'HOutline:RocketLaunchIcon',
    color: '#10b981',
    progress: 45,
  },
  {
    id: 3,
    name: 'DFAN 移动端',
    desc: '全新的 React Native 跨平台应用，完美适配 iOS 和 Android。',
    group: '移动组',
    time: '2025-11-20',
    icon: 'HOutline:DevicePhoneMobileIcon',
    color: '#f59e0b',
    progress: 72,
  },
  {
    id: 4,
    name: '自动化测试云',
    desc: '基于 Playwright 的云端自动化测试框架，大幅提升 CI/CD 交付效率。',
    group: '测试组',
    time: '2026-01-08',
    icon: 'HOutline:Cog6ToothIcon',
    color: '#ef4444',
    progress: 94,
  },
  {
    id: 5,
    name: '低代码引擎',
    desc: '可视化图形化拖拽搭建工具，支持复杂业务逻辑配置。',
    group: '研发中心',
    time: '2025-10-15',
    icon: 'HOutline:RectangleStackIcon',
    color: '#8b5cf6',
    progress: 30,
  },
  {
    id: 6,
    name: '监控告警 2.0',
    desc: '全方位分布式系统性能监控，支持毫秒级异常预警与链路追踪。',
    group: '运维组',
    time: '2026-01-02',
    icon: 'HOutline:BellIcon',
    color: '#06b6d4',
    progress: 68,
  },
])
</script>

<style scoped lang="scss">
.el-icon {
  font-size: 1.25rem;
  color: var(--el-color-primary);
}
.project-section-card {
  border: none;
  border-radius: 1rem;
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-extra-light);
}
</style>
