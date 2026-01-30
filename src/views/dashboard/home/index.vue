<template>
  <div class="flex-1 h-full flex flex-col gap-6">
    <WelcomePanel />
    <el-row :gutter="20">
      <el-col :xs="24" :lg="16">
        <div class="flex flex-col gap-5">
          <ProjectSection />
          <ActivitySection />
        </div>
      </el-col>
      <el-col :xs="24" :lg="8" class="mt-5 lg:mt-0">
        <div class="flex flex-col gap-5">
          <ShortcutSection class="mt-4 min-[1200px]:mt-0" />
          <EfficiencySection />
          <TeamSection />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import WelcomePanel from '@/views/dashboard/home/welcomePanel.vue'
import ProjectSection from '@/views/dashboard/home/projectSection.vue'
import ShortcutSection from '@/views/dashboard/home/shortcutSection.vue'
import ActivitySection from '@/views/dashboard/home/activitySection.vue'
import TeamSection from '@/views/dashboard/home/teamSection.vue'
import EfficiencySection from '@/views/dashboard/home/efficiencySection.vue'

defineOptions({ name: 'HomeView' })
</script>

<style></style>
