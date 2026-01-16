<template>
  <div class="flex flex-col gap-4">
    <ResourcePanel ref="resourcePanelRef" />
    <el-row :gutter="20">
      <el-col :lg="16">
        <MapPanel ref="mapPanelRef" />
      </el-col>
      <el-col :lg="8" class="mt-4 min-[1200px]:mt-0">
        <NodePanel />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :lg="16">
        <logsPanel />
      </el-col>
      <el-col :lg="8" class="mt-4 min-[1200px]:mt-0">
        <ThroughputPanel ref="throughputPanelRef" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import ResourcePanel from '@/views/dashboard/monitor/resourcePanel.vue'
import logsPanel from '@/views/dashboard/monitor/logsPanel.vue'
import ThroughputPanel from '@/views/dashboard/monitor/throughputPanel.vue'
import NodePanel from '@/views/dashboard/monitor/nodePanel.vue'
import MapPanel from '@/views/dashboard/monitor/mapPanel.vue'

defineOptions({ name: 'MonitorView' })

const themeStore = useThemeStore()
const mapPanelRef = useTemplateRef<InstanceType<typeof MapPanel> | null>('mapPanelRef')
const resourcePanelRef = useTemplateRef<InstanceType<typeof ResourcePanel> | null>(
  'resourcePanelRef',
)
const throughputPanelRef = useTemplateRef<InstanceType<typeof ThroughputPanel> | null>(
  'throughputPanelRef',
)

//  监听主题色和主题模式变化，更新图表颜色
watch(
  [() => themeStore.themeMode, () => themeStore.primaryColor],
  async () => {
    await nextTick()
    mapPanelRef.value?.updateColorTrigger()
    resourcePanelRef.value?.updateColorTrigger()
    throughputPanelRef.value?.updateColorTrigger()
  },
  { immediate: true },
)
</script>

<style scoped lang="scss"></style>
