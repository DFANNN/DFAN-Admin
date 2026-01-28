<!-- 本周工作效能 -->
<template>
  <BaseCard title="本周工作效能" title-icon="HOutline:PresentationChartBarIcon">
    <div>
      <div class="h-70 w-full mb-5">
        <VChart class="chart" :option="efficiencyOption" autoresize />
      </div>
      <div class="py-2 flex flex-col gap-4">
        <div v-for="item in stats" :key="item.label">
          <div class="flex justify-between mb-2">
            <span class="text-[13px] font-medium text-(--el-text-color-regular)">{{
              item.label
            }}</span>
            <span class="text-xs font-bold">{{ item.value }}</span>
          </div>
          <el-progress :percentage="item.percentage" :color="item.color" :show-text="false" />
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'

const menuStore = useMenuStore()

interface IStatItem {
  label: string
  value: string | number
  percentage: number
  color: string
}

const stats = ref<IStatItem[]>([
  { label: '任务完成率', value: '92%', percentage: 92, color: '#6366f1' },
  { label: '代码质量评分', value: 'A+', percentage: 88, color: '#10b981' },
])

// 效能图表配置 (雷达图更适合展示多维度效能)
const efficiencyOption = computed(() => ({
  radar: {
    indicator: [
      { name: '代码质量', max: 100 },
      { name: '交付速度', max: 100 },
      { name: '沟通协作', max: 100 },
      { name: '技术深度', max: 100 },
      { name: '业务理解', max: 100 },
    ],
    splitArea: { show: false },
    axisLine: { lineStyle: { color: '#e2e8f0' } },
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: [85, 90, 80, 95, 88],
          name: '个人能力',
          itemStyle: {
            color: getComputedStyle(document.documentElement)
              .getPropertyValue('--el-color-primary')
              .trim(),
          },
          areaStyle: {
            color:
              getComputedStyle(document.documentElement)
                .getPropertyValue('--el-color-primary')
                .trim() + '33',
          },
        },
      ],
    },
  ],
}))
</script>

<style scoped lang="scss"></style>
