<template>
  <!-- 系统实时流水日志 -->
  <el-card class="node-panel-card" shadow="never">
    <template #header>
      <div class="flex justify-between items-center gap-3 font-bold">
        <div class="flex items-center gap-3">
          <el-icon>
            <component :is="menuStore.iconComponents['HOutline:Squares2X2Icon']" />
          </el-icon>
          <span>服务集群健康状态</span>
        </div>
        <div class="text-sm font-semibold text-(--el-color-primary)">{{ nodes.length }} Nodes</div>
      </div>
    </template>

    <div>
      <el-scrollbar :height="363">
        <div class="grid grid-cols-[repeat(auto-fill,minmax(45px,1fr))] gap-2.5 py-5">
          <div
            v-for="item in nodes"
            :key="item.id"
            class="aspect-square rounded-lg transition-all duration-300"
            :class="[
              item.status === 'success' && 'bg-(--el-color-success)',
              item.status === 'warning' && 'bg-(--el-color-warning)',
              item.status === 'danger' && 'bg-(--el-color-danger) danger-blink',
            ]"
          ></div>
        </div>
      </el-scrollbar>

      <div
        class="pt-5 text-(--el-text-color-secondary) font-semibold flex justify-center gap-4 border-t border-dashed border-(--el-border-color-light)"
      >
        <span class="flex gap-2 items-center text-xs">
          <i class="w-2 h-2 rounded-full bg-(--el-color-success)"></i>
          运行中 （{{ successCount }}）
        </span>
        <span class="flex gap-2 items-center text-xs">
          <i class="w-2 h-2 rounded-full bg-(--el-color-warning)"></i>
          高延迟 （{{ warningCount }}）
        </span>
        <span class="flex gap-2 items-center text-xs">
          <i class="w-2 h-2 rounded-full bg-(--el-color-danger)"></i>
          故障 （{{ dangerCount }}）
        </span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
const menuStore = useMenuStore()

type NodeStatus = 'success' | 'warning' | 'danger'

interface INodeItem {
  id: number
  status: NodeStatus
}

// 定时器
let timer: ReturnType<typeof setInterval> | null = null

// 初始化节点数组
const nodes = ref<INodeItem[]>([])

// 计算各状态节点数量
const successCount = computed(() => nodes.value.filter((node) => node.status === 'success').length)
const warningCount = computed(() => nodes.value.filter((node) => node.status === 'warning').length)
const dangerCount = computed(() => nodes.value.filter((node) => node.status === 'danger').length)

/**
 * 随机生成节点状态
 */
const generateNodes = () => {
  nodes.value = Array.from({ length: 96 }, (_, i) => {
    const rand = Math.random()
    let status: NodeStatus = 'success'
    if (rand > 0.85) status = 'warning' // 约 10%
    if (rand > 0.95) status = 'danger' // 约 5%
    return { id: i, status }
  })
}

onMounted(() => {
  generateNodes()
  timer = setInterval(generateNodes, 5000)
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

.node-panel-card {
  border: none;
  border-radius: 1rem;
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

/* 故障闪烁动画 */
@keyframes dangerBlink {
  0% {
    background-color: var(--el-color-danger-light-5);
    transform: scale(1);
  }
  25% {
    background-color: var(--el-color-danger-light-7);
    transform: scale(1.05);
  }
  50% {
    background-color: var(--el-color-danger-light-3);
    transform: scale(1);
  }
  75% {
    background-color: var(--el-color-danger-light-7);
    transform: scale(1.05);
  }
  100% {
    background-color: var(--el-color-danger-light-5);
    transform: scale(1);
  }
}

.danger-blink {
  animation: dangerBlink 2s ease-in-out infinite;
  transition:
    background-color 0.3s,
    transform 0.3s;
}
</style>
