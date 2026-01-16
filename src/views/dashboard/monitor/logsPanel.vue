<template>
  <!-- 系统实时流水日志 -->
  <el-card class="logs-panel-card" shadow="never">
    <template #header>
      <div class="flex justify-between items-center gap-3 font-bold">
        <div class="flex items-center gap-3">
          <el-icon>
            <component :is="menuStore.iconComponents['HOutline:DocumentTextIcon']" />
          </el-icon>
          <span>系统实时流水日志</span>
        </div>
        <IconButton icon="HOutline:EllipsisHorizontalIcon" size="1.5rem" />
      </div>
    </template>

    <div
      class="bg-(--el-bg-color-page) p-3 rounded-2xl border border-(--el-border-color-extra-light)"
    >
      <el-scrollbar :height="280">
        <div
          v-for="(log, index) in logs"
          :key="index"
          class="flex items-center gap-3 text-sm text-(--el-text-color-secondary) hover:bg-(--el-bg-color-overlay) p-1.5 rounded-lg cursor-pointer"
        >
          <span class="shrink-0">{{ log.time }}</span>
          <span
            class="text-xs text-white font-medium px-2 py-1 rounded-md uppercase"
            :class="tags(log.level)"
            >{{ log.level }}</span
          >
          <span class="text-(--el-text-color-regular)">{{ log.content }}</span>
        </div>
      </el-scrollbar>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

interface ILog {
  time: string
  level: 'INFO' | 'WARN' | 'ERROR'
  content: string
}

const menuStore = useMenuStore()
// 定时器
let timer: ReturnType<typeof setInterval> | null = null

// 系统日志
const logs = ref<ILog[]>([])

// 日志预设
const logPresets = [
  'Gateway: Incoming request from 182.16.4.21',
  'Auth: Token validation successful',
  'Service: Node-14 reported latency > 200ms',
  'DB: Slow query detected (152ms)',
  'Cache: Purge successful for key: user_profile_882',
  'Security: Multiple login attempts detected',
]
// 定时添加日志
const addLog = () => {
  const level = (Math.random() > 0.85 ? (Math.random() > 0.5 ? 'WARN' : 'ERROR') : 'INFO') as
    | 'INFO'
    | 'WARN'
    | 'ERROR'
  const randomContent = logPresets[Math.floor(Math.random() * logPresets.length)]
  logs.value.unshift({
    time: dayjs().format('HH:mm:ss.SSS'),
    level,
    content: randomContent || '',
  })
  if (logs.value.length > 50) logs.value.pop()
}

const tags = (level: 'INFO' | 'WARN' | 'ERROR') => {
  switch (level) {
    case 'INFO':
      return 'bg-(--el-color-success)'
    case 'WARN':
      return 'bg-(--el-color-warning)'
    case 'ERROR':
      return 'bg-(--el-color-danger)'
    default:
      return 'bg-(--el-color-primary)'
  }
}

onMounted(() => {
  timer = setInterval(() => {
    addLog()
  }, 2000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
.el-icon {
  font-size: 1.25rem;
  color: var(--el-color-primary);
}

.logs-panel-card {
  border: none;
  border-radius: 1rem;
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-extra-light);
}
</style>
