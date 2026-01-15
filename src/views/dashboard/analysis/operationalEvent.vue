<template>
  <!-- 各渠道销售表现实时榜单 -->
  <el-card class="operational-event-card" shadow="never">
    <template #header>
      <div class="flex justify-between items-center gap-3 font-bold">
        <span>近期运营大事件</span>
        <!-- <el-icon size="20">
          <component
            :is="menuStore.iconComponents['HOutline:ChartPieIcon']"
            class="text-(--el-color-primary)"
          />
        </el-icon> -->
        <IconButton icon="HOutline:EllipsisHorizontalIcon" size="1.5rem" />
      </div>
    </template>

    <el-scrollbar :height="260">
      <div class="flex items-center justify-between gap-4">
        <el-button
          :type="currentEventTab === 'toBeOpened' ? 'primary' : ''"
          size="small"
          class="flex-1 btn"
          @click="currentEventTab = 'toBeOpened'"
          >待开启</el-button
        >
        <el-button
          :type="currentEventTab === 'inProgress' ? 'primary' : ''"
          size="small"
          class="flex-1 btn"
          @click="currentEventTab = 'inProgress'"
          >进行中</el-button
        >
        <el-button
          :type="currentEventTab === 'review' ? 'primary' : ''"
          size="small"
          class="flex-1 btn"
          @click="currentEventTab = 'review'"
          >回顾</el-button
        >
      </div>
      <div>
        <div v-for="item in events" :key="item.id" class="flex gap-4 mt-4">
          <div class="w-15 text-sm text-(--el-text-color-regular)">{{ item.date }}</div>
          <div
            class="flex-1 flex flex-col gap-3 border-l-4 px-4 py-2 bg-(--el-bg-color-page) rounded-2xl"
            :style="{ borderLeftColor: item.color }"
          >
            <div class="text-sm font-semibold">{{ item.title }}</div>
            <div class="text-xs text-(--el-text-color-secondary) flex items-center gap-2">
              <el-icon size="14">
                <component :is="menuStore.iconComponents['HOutline:CalendarIcon']" />
              </el-icon>
              时间: {{ item.range }}
            </div>
            <div class="flex items-center gap-4">
              <el-avatar :size="24" src="https://api.dicebear.com/7.x/avataaars/svg?seed=prom" />
              <span class="text-xs text-(--el-text-color-secondary)">策划中...</span>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </el-card>
</template>

<script setup lang="ts">
type IEventTab = 'toBeOpened' | 'inProgress' | 'review'
interface IEvent {
  id: number
  date: string
  title: string
  range: string
  color: string
}

const menuStore = useMenuStore()

// 当前事件
const currentEventTab = ref<IEventTab>('toBeOpened')

// 所有事件
const allEvents = ref<Record<IEventTab, IEvent[]>>({
  toBeOpened: [
    { id: 1, date: '1月20日', title: '2026 年货节启动', range: '01.20 - 02.10', color: '#ef4444' },
    { id: 2, date: '2月14日', title: '情人节专项大促', range: '02.10 - 02.15', color: '#f99c7d' },
    { id: 5, date: '3月01日', title: '春季新品发布会', range: '03.01 - 03.05', color: '#3b82f6' },
  ],
  inProgress: [
    { id: 3, date: '3月01日', title: '春季新品发布会', range: '03.01 - 03.05', color: '#3b82f6' },
  ],
  review: [
    {
      id: 4,
      date: '12月25日',
      title: '圣诞节促销活动总结',
      range: '12.20 - 12.26',
      color: '#10b981',
    },
  ],
})

const events = computed(() => {
  return allEvents.value[currentEventTab.value]
})
</script>

<style scoped lang="scss">
.operational-event-card {
  border: none;
  border-radius: 1rem;
}

.btn {
  border-radius: 1rem;
  padding: 0.75rem 1.5rem;
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-extra-light);
}
</style>
