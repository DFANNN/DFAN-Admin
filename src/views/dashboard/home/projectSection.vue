<!-- 正在进行中的项目 -->
<template>
  <BaseCard title="正在进行的项目" title-icon="HOutline:SquaresPlusIcon">
    <el-scrollbar :height="520">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 pt-3">
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </div>
    </el-scrollbar>
  </BaseCard>
</template>

<script setup lang="ts">
import type { IProjectItem } from '@/types/profile'

// 正在进行的项目
const projects = ref<IProjectItem[]>([
  {
    id: 1,
    name: 'Vue Admin Next',
    desc: '基于 Vue 3 + Element Plus 的中后台管理系统，目前进入 Beta 测试阶段。基于 Vue 3 + Element Plus 的中后台管理系统，目前进入 Beta 测试阶段。',
    time: '2025-12-01',
    icon: 'HOutline:ComputerDesktopIcon',
    color: '#4f46e5',
    progress: 85,
    status: 'in_progress',
    members: [
      { name: 'Oliver', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver0' },
      { name: 'Sophia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia1' },
      { name: 'Liam', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam2' },
      { name: 'Emma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma3' },
      { name: 'Alexander', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander2' },
      { name: 'Lucas', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas2' },
    ],
  },
  {
    id: 2,
    name: 'AI 数据中心',
    desc: '利用 LLM 大模型进行深度数据清洗与多维度智能化分析平台。',
    time: '2026-01-05',
    icon: 'HOutline:RocketLaunchIcon',
    color: '#10b981',
    progress: 45,
    status: 'in_progress',
    members: [
      { name: 'Emma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma0' },
      { name: 'Noah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah1' },
      { name: 'Ava', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava2' },
      { name: 'Charlotte', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte0' },
      { name: 'Henry', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry1' },
      { name: 'Alexander', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander2' },
    ],
  },
  {
    id: 3,
    name: 'DFAN 移动端',
    desc: '全新的 React Native 跨平台应用，完美适配 iOS 和 Android。',
    time: '2025-11-20',
    icon: 'HOutline:DevicePhoneMobileIcon',
    color: '#f59e0b',
    progress: 72,
    status: 'in_progress',
    members: [
      { name: 'Elijah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elijah0' },
      { name: 'Isabella', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella1' },
    ],
  },
  {
    id: 4,
    name: '自动化测试云',
    desc: '基于 Playwright 的云端自动化测试框架，大幅提升 CI/CD 交付效率。',
    time: '2026-01-08',
    icon: 'HOutline:Cog6ToothIcon',
    color: '#ef4444',
    progress: 94,
    status: 'in_progress',
    members: [
      { name: 'Mia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia0' },
      { name: 'Mason', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mason1' },
      { name: 'Amelia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amelia2' },
    ],
  },
  {
    id: 5,
    name: '低代码引擎',
    desc: '可视化图形化拖拽搭建工具，支持复杂业务逻辑配置。',
    time: '2025-10-15',
    icon: 'HOutline:RectangleStackIcon',
    color: '#8b5cf6',
    progress: 30,
    status: 'in_progress',
    members: [
      { name: 'Ethan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan0' },
      { name: 'Harper', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harper1' },
      { name: 'Logan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Logan2' },
      { name: 'Emma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma0' },
      { name: 'Noah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah1' },
      { name: 'Ava', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava2' },
      { name: 'Charlotte', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte0' },
      { name: 'Henry', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry1' },
      { name: 'Alexander', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander2' },
    ],
  },
  {
    id: 6,
    name: '监控告警 2.0',
    desc: '全方位分布式系统性能监控，支持毫秒级异常预警与链路追踪。',
    time: '2026-01-02',
    icon: 'HOutline:BellIcon',
    color: '#06b6d4',
    progress: 68,
    status: 'in_progress',
    members: [
      { name: 'Evelyn', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evelyn0' },
      { name: 'James', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James1' },
      { name: 'Abigail', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abigail2' },
    ],
  },
])
</script>

<style scoped lang="scss"></style>
