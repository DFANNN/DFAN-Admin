<!-- API 实时吞吐量 -->
<template>
  <BaseCard title="API 实时吞吐量 (Req/s)" title-icon="HOutline:ArrowTrendingUpIcon">
    <div class="h-76">
      <VChart class="chart" :option="throughputOption" autoresize />
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'

const menuStore = useMenuStore()

// 触发器变量（仅仅用来主题或者颜色变化时触发revenueProfitOption 更新的变量）
const colorTrigger = ref(0)
// 定时器
let timer: ReturnType<typeof setInterval> | null = null

// 吞吐量图表
const throughputData = ref<number[]>(
  new Array(20).fill(0).map(() => Math.floor(Math.random() * 400 + 100)),
)

const throughputOption = computed(() => {
  void colorTrigger.value
  const style = getComputedStyle(document.documentElement)

  return {
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: new Array(20).fill(''),
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { color: style.getPropertyValue('--el-border-color'), type: 'dashed' },
      },
      axisLabel: { color: style.getPropertyValue('--el-text-color-regular') },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 3, color: style.getPropertyValue('--el-color-primary') },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: style.getPropertyValue('--el-color-primary') },
              { offset: 1, color: 'transparent' },
            ],
          },
        },
        data: throughputData.value,
      },
    ],
  }
})

onMounted(() => {
  timer = setInterval(() => {
    throughputData.value.push(Math.floor(Math.random() * 400 + 100))
    throughputData.value.shift()
  }, 2000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 触发颜色改变
const updateColorTrigger = () => colorTrigger.value++

defineExpose({ updateColorTrigger })
</script>

<style scoped lang="scss"></style>
