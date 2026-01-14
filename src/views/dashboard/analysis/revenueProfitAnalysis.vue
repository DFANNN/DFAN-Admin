<template>
  <el-card class="revenue-profit--analysis-card">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="text-[18px] font-bold">年度营收与净利润增长深度分析</div>
          <div
            class="ml-4 text-xs font-semibold text-(--el-color-primary) bg-(--el-color-primary-light-7) px-2 py-1 rounded-md"
          >
            数据已脱敏
          </div>
        </div>
        <div class="flex items-center gap-2">
          <el-radio-group v-model="analysisTimeRange" size="small">
            <el-radio-button label="1y">近1年</el-radio-button>
            <el-radio-button label="2y">近2年</el-radio-button>
          </el-radio-group>
          <el-divider direction="vertical" />
          <IconButton icon="HOutline:ArrowPathIcon" type="primary" @click="refreshData" />
        </div>
      </div>
    </template>
    <div class="h-113 w-full">
      <VChart :option="revenueProfitOption" autoresize />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'

type ITimeRange = '1y' | '2y'

// 触发器变量（仅仅用来主题或者颜色变化时触发revenueProfitOption 更新的变量）
const colorTrigger = ref(0)

// 当前时间范围
const analysisTimeRange = ref<ITimeRange>('1y')

// 原始数据（示例）
const rawData = ref<
  Record<
    ITimeRange,
    {
      months: string[]
      revenue: number[]
      profit: number[]
      lastYear: number[]
      profitRate: number[]
    }
  >
>({
  '1y': {
    months: Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
    revenue: [120, 132, 101, 134, 290, 230, 210, 250, 220, 280, 310, 330],
    profit: [80, 92, 70, 84, 150, 130, 110, 140, 120, 160, 190, 240],
    lastYear: [100, 110, 95, 120, 200, 180, 190, 210, 180, 230, 260, 300],
    profitRate: [66, 69, 69, 62, 52, 56, 52, 56, 54, 57, 61, 72],
  },
  '2y': {
    months: Array.from({ length: 24 }, (_, i) => `${i + 1}月`),
    revenue: Array.from({ length: 24 }, () => Math.floor(Math.random() * 300 + 50)),
    profit: Array.from({ length: 24 }, () => Math.floor(Math.random() * 200 + 50)),
    lastYear: Array.from({ length: 24 }, () => Math.floor(Math.random() * 250 + 50)),
    profitRate: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
  },
})

const revenueProfitOption = computed(() => {
  void colorTrigger.value

  const style = getComputedStyle(document.documentElement)
  const data = rawData.value[analysisTimeRange.value]

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: { backgroundColor: style.getPropertyValue('--el-color-primary') },
      },
      backgroundColor: style.getPropertyValue('--el-text-color-primary'),
      borderWidth: 0,
      borderRadius: 8,
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      textStyle: {
        color: style.getPropertyValue('--el-bg-color'),
        fontWeight: 400,
        fontSize: 12,
      },
    },
    legend: {
      data: ['年度营收', '净利润', '去年同期', '利润率'],
      bottom: 0,
      itemGap: 20,
      textStyle: { color: style.getPropertyValue('--el-text-color-regular') },
    },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data?.months,
      axisLine: { lineStyle: { color: style.getPropertyValue('--el-text-color-regular') } },
      axisTick: { show: false },
      axisLabel: { color: style.getPropertyValue('--el-text-color-regular') },
    },
    yAxis: [
      {
        type: 'value',
        name: '金额 (k)',
        axisLine: { show: false },
        splitLine: {
          lineStyle: { type: 'dashed', color: style.getPropertyValue('--el-border-color') },
        },
        axisLabel: { color: style.getPropertyValue('--el-text-color-regular') },
        nameTextStyle: { color: style.getPropertyValue('--el-text-color-regular') },
      },
      {
        type: 'value',
        name: '利润率 (%)',
        min: 0,
        max: 100,
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: { color: style.getPropertyValue('--el-text-color-regular') },
        nameTextStyle: { color: style.getPropertyValue('--el-text-color-regular') },
      },
    ],
    series: [
      {
        name: '年度营收',
        type: 'line',
        smooth: true,
        lineStyle: { width: 0 },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: style.getPropertyValue('--el-color-info') },
              { offset: 1, color: style.getPropertyValue('--el-color-primary') },
            ],
          },
        },
        data: data?.revenue,
      },
      {
        name: '去年同期',
        type: 'line',
        symbol: 'none',
        lineStyle: {
          type: 'dashed',
          width: 2,
          color: style.getPropertyValue('--el-text-color-placeholder'),
        },
        data: data?.lastYear,
      },
      {
        name: '净利润',
        type: 'line',
        smooth: true,
        lineStyle: { width: 4, color: style.getPropertyValue('--el-color-warning') },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: style.getPropertyValue('--el-color-warning'),
          borderColor: style.getPropertyValue('--el-color-white'),
          borderWidth: 2,
        },
        data: data?.profit,
      },
      {
        name: '利润率',
        type: 'line',
        yAxisIndex: 1,
        lineStyle: {
          type: 'dashed',
          color: style.getPropertyValue('--el-color-success'),
          width: 2,
        },
        symbol: 'none',
        data: data?.profitRate,
      },
    ],
  }
})

// 刷新数据函数（模拟随机刷新）
const refreshData = () => {
  const range = analysisTimeRange.value
  rawData.value[range] = {
    months: rawData.value[range].months,
    revenue: rawData.value[range].revenue.map((v) => v + Math.floor(Math.random() * 20 - 10)),
    profit: rawData.value[range].profit.map((v) => v + Math.floor(Math.random() * 10 - 5)),
    lastYear: rawData.value[range].lastYear.map((v) => v + Math.floor(Math.random() * 10 - 5)),
    profitRate: rawData.value[range].profitRate.map((v) =>
      Math.min(100, Math.max(0, v + Math.floor(Math.random() * 5 - 2))),
    ),
  }
}

// 触发颜色改变
const updateColorTrigger = () => colorTrigger.value++

defineExpose({ updateColorTrigger })
</script>

<style scoped lang="scss">
.revenue-profit--analysis-card {
  border: none;
  border-radius: 1rem;
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-extra-light);
}
</style>
