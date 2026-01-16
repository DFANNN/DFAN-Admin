<template>
  <!-- 团队动态与最新评价 -->
  <el-card class="activity-section-card" shadow="never">
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <el-icon>
            <component :is="menuStore.iconComponents['HOutline:SparklesIcon']" />
          </el-icon>
          <span>团队动态与最新评价</span>
        </div>
        <IconButton icon="HOutline:EllipsisHorizontalIcon" size="1.5rem" />
      </div>
    </template>
    <el-scrollbar :height="540">
      <div
        v-for="item in activities"
        :key="item.id"
        class="flex gap-5 py-6 border-b border-(--el-border-color-extra-light) last:border-none"
      >
        <div class="relative shrink h-10 w-10">
          <el-avatar :size="40" :src="item.avatar" />
          <span
            class="absolute w-2.5 h-2.5 bottom-0 right-0 border-2 rounded-full border-(--el-bg-color)"
            :style="{
              backgroundColor: item.online ? 'var(--el-color-success)' : 'var(--el-color-info)',
            }"
          ></span>
        </div>
        <div class="flex-1 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold">{{ item.name }}</span>
            <span class="text-xs text-(--el-text-color-placeholder)">{{ item.time }}</span>
          </div>
          <div>
            <span class="mr-2">{{ item.action }}</span>
            <span class="text-(--el-color-primary) font-semibold">{{ item.target }}</span>
            <div
              v-if="item.comment"
              class="mt-2 py-3 px-4 rounded-xl text-sm border-l-4 italic text-(--el-text-color-secondary) border-(--el-border-color) bg-(--el-bg-color-page)"
            >
              "{{ item.comment }}"
            </div>
          </div>
          <div class="flex items-center justify-between">
            <el-tag :type="item.tagType">{{ item.tag }}</el-tag>
            <div
              class="group flex gap-2 items-center text-xs cursor-pointer text-(--el-text-color-placeholder) hover:text-(--el-color-primary)"
            >
              <el-icon size="14">
                <component
                  :is="menuStore.iconComponents['Element:ChatDotRound']"
                  class="text-(--el-text-color-placeholder) group-hover:text-(--el-color-primary)"
                />
              </el-icon>
              <span class="">回复</span>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </el-card>
</template>

<script setup lang="ts">
const menuStore = useMenuStore()

interface IActivity {
  id: number
  name: string
  avatar: string
  action: string
  target: string
  comment?: string
  time: string
  online: boolean
  tag: string
  tagType: 'success' | 'primary' | 'warning' | 'info' | 'danger'
}

// 动态
const activities = ref<IActivity[]>([
  {
    id: 1,
    name: '林东东',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky',
    action: '在',
    target: '项目组 007',
    comment: '这个界面的阴影处理得非常棒，很有质感！',
    time: '刚刚',
    online: true,
    tag: 'UI 评价',
    tagType: 'success',
  },
  {
    id: 2,
    name: '张三',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    action: '发表了关于',
    target: 'UI 优化的建议',
    comment: '建议在移动端把侧边栏改为底部导航栏，用户体验会更好。',
    time: '10 分钟前',
    online: false,
    tag: '产品建议',
    tagType: 'primary',
  },
  {
    id: 3,
    name: '李四',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
    action: '提交了代码到',
    target: 'main 分支',
    time: '1 小时前',
    online: true,
    tag: '代码提交',
    tagType: 'warning',
  },
  {
    id: 5,
    name: '赵六',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neo',
    action: '在',
    target: '性能优化讨论中',
    comment: '首屏加载速度明显提升了，特别是在弱网环境下体验改善很明显。',
    time: '5 小时前',
    online: false,
    tag: '性能优化',
    tagType: 'success',
  },
  {
    id: 6,
    name: '周七',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    action: '评论了',
    target: '代码规范文档',
    comment: '统一了组件命名和目录结构后，新同事上手速度快了不少，建议继续完善。',
    time: '昨天',
    online: true,
    tag: '技术规范',
    tagType: 'primary',
  },
  {
    id: 7,
    name: '孙八',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    action: '在',
    target: '需求评审会议中',
    comment: '这个功能如果能加上默认值配置，会减少很多重复操作。',
    time: '2 天前',
    online: false,
    tag: '需求评审',
    tagType: 'info',
  },
  {
    id: 4,
    name: '王五',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
    action: '创建了新任务',
    target: '周报系统对接',
    time: '3 小时前',
    online: true,
    tag: '任务管理',
    tagType: 'info',
  },
])
</script>

<style scoped lang="scss">
.el-icon {
  font-size: 1.25rem;
  color: var(--el-color-primary);
}
.activity-section-card {
  border: none;
  border-radius: 1rem;
}
:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-extra-light);
}
</style>
