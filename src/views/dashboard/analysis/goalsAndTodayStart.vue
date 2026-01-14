<template>
  <!-- 营销目标和今日之星 -->
  <el-card class="common-card">
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-[#f97316]">
        <el-icon size="20">
          <component :is="menuStore.iconComponents['HSolid:TrophyIcon']" class="text-white" />
        </el-icon>
      </div>
      <div class="flex items-center justify-between">
        <div class="font-semibold text-sm">Q1 销售额目标</div>
        <div class="font-bold text-[18px]">76.4%</div>
      </div>
      <el-progress
        :percentage="76.4"
        :stroke-width="15"
        color="#f97316"
        striped
        striped-flow
        :duration="50"
        :show-text="false"
      />
    </div>
  </el-card>
  <el-card class="common-card mt-2">
    <div class="flex flex-col items-center justify-center gap-4">
      <div class="text-[#f97316] text-xs font-semibold">Today's Operation Manager</div>
      <el-avatar :size="64" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Operation" />
      <div class="text-[18px] font-bold">David Fan</div>
      <div class="text-[13px] text-(--el-text-color-regular)">高级运营专家 / 增长黑客</div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
// linear-gradient(135deg, #f99c7d 0%, #ea580c 100%
const menuStore = useMenuStore()
</script>
<style scoped lang="scss">
.common-card {
  border: none;
  border-radius: 1rem;
}
</style>
