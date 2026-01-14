<template>
  <div class="flex-1 h-full flex flex-col gap-6">
    <OverviewHeader />
    <RevenueProfitAnalysis ref="revenueProfitAnalysisRef" />
    <el-row :gutter="20">
      <el-col :xs="24" :md="12" :lg="8">
        <MarketShare ref="marketShareRef" />
      </el-col>
      <el-col :xs="24" :md="12" :lg="8">
        <TopCategories ref="topCategoriesRef" />
      </el-col>
      <el-col :xs="24" :md="24" :lg="8" class="mt-4 min-[1200px]:mt-0">
        <GoalsAndTodayStart />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :lg="14">
        <ChannelSales />
      </el-col>
      <el-col :xs="24" :lg="10" class="mt-4 min-[1200px]:mt-0">
        <OperationalEvent />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import OverviewHeader from '@/views/dashboard/analysis/overviewHeader.vue'
import RevenueProfitAnalysis from '@/views/dashboard/analysis/revenueProfitAnalysis.vue'
import MarketShare from '@/views/dashboard/analysis/marketShare.vue'
import TopCategories from '@/views/dashboard/analysis/topCategories.vue'
import GoalsAndTodayStart from '@/views/dashboard/analysis/goalsAndTodayStart.vue'
import ChannelSales from '@/views/dashboard/analysis/channelSales.vue'
import OperationalEvent from '@/views/dashboard/analysis/operationalEvent.vue'

defineOptions({ name: 'AnalysisView' })

const themeStore = useThemeStore()
const marketShareRef = useTemplateRef<InstanceType<typeof MarketShare> | null>('marketShareRef')
const topCategoriesRef = useTemplateRef<InstanceType<typeof TopCategories> | null>(
  'topCategoriesRef',
)
const revenueProfitAnalysisRef = useTemplateRef<InstanceType<typeof RevenueProfitAnalysis> | null>(
  'revenueProfitAnalysisRef',
)

watch(
  [() => themeStore.themeMode, () => themeStore.primaryColor],
  async () => {
    await nextTick()
    marketShareRef.value?.updateColorTrigger()
    topCategoriesRef.value?.updateColorTrigger()
    revenueProfitAnalysisRef.value?.updateColorTrigger()
  },
  { immediate: true },
)
</script>

<style></style>
