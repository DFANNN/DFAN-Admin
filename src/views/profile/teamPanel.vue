<template>
  <!-- 核心团队 -->
  <el-card class="team-section-card" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <el-icon>
            <component :is="menuStore.iconComponents['HOutline:UserGroupIcon']" />
          </el-icon>
          <span>核心团队（{{ team.length }}）</span>
        </div>
        <IconButton icon="HOutline:EllipsisHorizontalIcon" size="1.5rem" />
      </div>
    </template>
    <el-scrollbar :height="280">
      <div class="flex flex-col gap-4">
        <div
          v-for="item in team"
          :key="item.name"
          class="flex items-center gap-4 p-2 rounded-2xl hover:bg-(--el-bg-color-page) cursor-pointer"
        >
          <div class="relative w-10 h-10">
            <el-avatar :size="40" :src="item.avatar" />
            <span
              class="w-2.5 h-2.5 absolute right-0 bottom-0 bg-green-500 border-2 rounded-full border-(--el-bg-color)"
              :style="{
                backgroundColor:
                  item.status === 'online' ? 'var(--el-color-success)' : 'var(--el-color-info)',
              }"
            ></span>
          </div>
          <div class="flex-1">
            <div class="text-sm font-bold">{{ item.name }}</div>
            <div class="text-[12px] text-(--el-text-color-secondary) mt-1">{{ item.role }}</div>
          </div>
          <div>
            <el-button
              circle
              size="small"
              :icon="menuStore.iconComponents['Element:ChatDotRound']"
            />
          </div>
        </div>
      </div>
    </el-scrollbar>
  </el-card>
</template>

<script setup lang="ts">
const menuStore = useMenuStore()

const team = ref([
  {
    name: 'Lucille Richards',
    role: 'UI Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucille',
    status: 'online',
  },
  {
    name: 'Ray Vaughn',
    role: 'Frontend Dev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ray',
    status: 'online',
  },
  {
    name: 'Nellie Powers',
    role: 'Product Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nellie',
    status: 'online',
  },
  {
    name: 'Sallie Henderson',
    role: 'QA Engineer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sallie',
    status: 'online',
  },
  {
    name: 'James Chen',
    role: '测试工程师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    status: 'offline',
  },
  {
    name: 'Lucy Wang',
    role: '前端开发',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
    status: 'offline',
  },
  {
    name: 'Tom Chen',
    role: '数据科学家',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    status: 'offline',
  },
])
</script>

<style scoped lang="scss">
.el-icon {
  font-size: 1.25rem;
  color: var(--el-color-primary);
}
.team-section-card {
  border: none;
  border-radius: 1rem;
}
:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-extra-light);
}
</style>
