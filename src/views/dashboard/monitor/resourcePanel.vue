<!-- 资源面板 -->
<template>
  <el-row :gutter="20">
    <el-col :sm="12" :lg="6" v-for="item in resourceStatsWithOption" :key="item.label" class="mt-4">
      <BaseCard>
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-3">
            <div class="text-sm font-medium text-(--el-text-color-regular)">
              {{ item.label }}
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-extrabold">{{ item.value }}</span>
              <span class="text-sm font-semibold text-(--el-text-color-secondary)">{{
                item.unit
              }}</span>
            </div>
            <div class="flex gap-2 text-xs">
              <span
                class="font-bold"
                :class="
                  item.trend.startsWith('+')
                    ? 'text-(--el-color-success)'
                    : 'text-(--el-color-danger)'
                "
                >{{ item.trend }}</span
              >
              <span class="text-(--el-text-color-secondary)">vs last hour</span>
            </div>
          </div>
          <div class="h-23 w-23">
            <VChart :option="item.option" />
          </div>
        </div>
      </BaseCard>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'

// 触发器变量（仅仅用来主题或者颜色变化时触发revenueProfitOption 更新的变量）
const colorTrigger = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

/**
 * 创建迷你仪表盘图表配置
 * @param value  值
 * @param color  颜色
 */
const createMiniGauge = (value: number, color: string) => {
  const style = getComputedStyle(document.documentElement)
  return {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: { show: false },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: { color: style.getPropertyValue(color) },
        },
        axisLine: {
          lineStyle: { width: 8, color: [[1, style.getPropertyValue('--el-bg-color-page')]] },
        },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        data: [{ value }],
        detail: { show: false },
      },
    ],
  }
}

// 资源仪表盘(现代风格)
const resourceStats = ref([
  { label: 'CPU Usage', value: 38.01, unit: '%', color: '--el-color-primary', trend: '+2.1%' },
  { label: 'Memory', value: 62.45, unit: '%', color: '--el-color-success', trend: '-0.5%' },
  { label: 'Network', value: 75.01, unit: 'Mbps', color: '--el-color-warning', trend: '+12.4' },
  {
    label: 'Active Tasks',
    value: 12,
    unit: 'Proc',
    color: '--el-color-danger',
    trend: 'Stable',
  },
])

//  动态创建图表配置
const resourceStatsWithOption = computed(() => {
  void colorTrigger.value
  return resourceStats.value.map((item) => ({
    ...item,
    option: createMiniGauge(item.value, item.color),
  }))
})

// 随机改变数值
const generateValue = () => {
  resourceStats.value = resourceStats.value.map((item) => {
    const oldValue = item.value
    const newValue = Number((Math.random() * 100).toFixed(2))

    // 根据变化计算趋势
    let trend = ''

    const diff = Number((newValue - oldValue).toFixed(2))
    if (diff > 0) trend = `+${diff}%`
    else if (diff < 0) trend = `${diff}%`
    else trend = 'Stable'

    return {
      ...item,
      value: newValue,
      trend,
    }
  })
}

// 触发颜色改变
const updateColorTrigger = () => colorTrigger.value++

defineExpose({ updateColorTrigger })

onMounted(() => {
  timer = setInterval(generateValue, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss"></style>
