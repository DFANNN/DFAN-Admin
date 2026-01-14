<template>
  <el-card class="market-share-card">
    <template #header>
      <div class="flex justify-between items-center gap-3 font-bold">
        <span>全球市场份额分布</span>
        <el-icon>
          <component :is="menuStore.iconComponents['HOutline:ChartPieIcon']" />
        </el-icon>
      </div>
    </template>
    <div class="h-65 w-full">
      <VChart :option="marketShareOption" autoresize />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'

const menuStore = useMenuStore()

// 触发器变量（仅仅用来主题或者颜色变化时触发revenueProfitOption 更新的变量）
const colorTrigger = ref(0)

// 全球市场份额饼图
const marketShareOption = computed(() => {
  colorTrigger.value
  const style = getComputedStyle(document.documentElement)

  return {
    tooltip: {
      trigger: 'item',
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
      bottom: '5%',
      icon: 'circle',
      itemGap: 15,
      textStyle: { color: style.getPropertyValue('--el-text-color-regular') },
    },
    series: [
      {
        name: '市场份额',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: style.getPropertyValue('--el-bg-color-overlay'),
          borderWidth: 4,
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold',
            color: style.getPropertyValue('--el-text-color-regular'),
          },
        },
        data: [
          {
            value: 45,
            name: '北美地区',
            itemStyle: { color: style.getPropertyValue('--el-color-primary') },
          },
          {
            value: 25,
            name: '欧洲市场',
            itemStyle: { color: style.getPropertyValue('--el-color-warning') },
          },
          {
            value: 20,
            name: '亚太地区',
            itemStyle: { color: style.getPropertyValue('--el-color-success') },
          },
          {
            value: 10,
            name: '其他',
            itemStyle: { color: style.getPropertyValue('--el-color-info') },
          },
        ],
      },
    ],
  }
})

// 触发颜色改变
const updateColorTrigger = () => colorTrigger.value++

defineExpose({ updateColorTrigger })
</script>

<style scoped lang="scss">
.el-icon {
  font-size: 1.25rem;
  color: var(--el-color-primary);
}

.market-share-card {
  border: none;
  border-radius: 1rem;
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-extra-light);
}
</style>
