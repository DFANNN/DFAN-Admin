<!-- 系统实时流水日志 -->
<template>
  <BaseCard title="全球请求实时分布" title-icon="HOutline:GlobeAsiaAustraliaIcon">
    <template #header-right>
      <div class="flex items-center gap-2 text-(--el-color-primary) font-semibold text-sm">
        <span class="w-2 h-2 bg-(--el-color-primary) rounded-full pulsating"></span>
        <span>LIVE DATA</span>
      </div>
    </template>

    <div
      class="h-100"
      v-loading="!isMapRegistered"
      element-loading-text="Loading..."
      :element-loading-spinner="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
    >
      <VChart v-if="isMapRegistered" class="chart" :option="worldMapOption" autoresize />
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { registerMap } from 'echarts/core'
import VChart from 'vue-echarts'

const menuStore = useMenuStore()

// 触发器变量（仅仅用来主题或者颜色变化时触发revenueProfitOption 更新的变量）
const colorTrigger = ref(0)

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `

// 地图数据加载状态
const isMapRegistered = ref(false)

// ECharts 地图 (真实地理坐标)
const worldMapOption = computed(() => {
  void colorTrigger.value
  const style = getComputedStyle(document.documentElement)

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}',
      axisPointer: {
        type: 'shadow',
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
    geo: {
      map: 'world', // 注意：项目中若无地图 JSON，这里会显示空白，实际开发需引入 registerMap
      roam: false,
      emphasis: {
        itemStyle: { areaColor: style.getPropertyValue('--el-border-color') },
        label: { show: false },
      },
      itemStyle: {
        areaColor: style.getPropertyValue('--el-bg-color-page'),
        borderColor: style.getPropertyValue('--el-border-color'),
        borderWidth: 1,
      },
      left: '10%',
      right: '10%',
      top: '5%',
      bottom: '5%',
    },
    series: [
      {
        name: 'Realtime Requests',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: [
          { name: 'Shanghai', value: [121.47, 31.23, 100] },
          { name: 'San Francisco', value: [-122.41, 37.77, 80] },
          { name: 'London', value: [-0.12, 51.5, 60] },
          { name: 'Frankfurt', value: [8.68, 50.11, 40] },
          { name: 'Singapore', value: [103.85, 1.28, 90] },
        ],
        symbolSize: (val: [number, number, number]) => val[2] / 8,
        showEffectOn: 'render',
        rippleEffect: { brushType: 'stroke', scale: 4 },
        itemStyle: {
          color: style.getPropertyValue('--el-color-primary'),
          shadowBlur: 10,
          shadowColor: 'rgba(99, 102, 241, 0.5)',
        },
        zlevel: 1,
      },
    ],
  }
})

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 异步加载世界地图 GeoJSON
const initMap = async () => {
  try {
    await delay(2000)
    const response = await fetch('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json')
    const worldJson = await response.json()
    registerMap('world', worldJson)
    isMapRegistered.value = true
  } catch (error) {
    console.error('Failed to register world map:', error)
  }
}

// 触发颜色改变
const updateColorTrigger = () => colorTrigger.value++

defineExpose({ updateColorTrigger })

onMounted(() => {
  initMap()
})
</script>

<style scoped lang="scss">
.pulsating {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 var(--el-color-primary);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}
</style>
