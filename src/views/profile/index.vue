<template>
  <div>
    <GradientHeader />
    <div class="relative left-0 -top-50 px-2 md:px-10">
      <userMainPanel />
      <el-row :gutter="20" class="mt-4">
        <el-col :lg="6">
          <ArchivesPanel />
          <teamPanel class="mt-4" />
        </el-col>
        <el-col :lg="18" class="mt-4 min-[1200px]:mt-0">
          <ActivityPanel />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import GradientHeader from '@/views/profile/gradientHeader.vue'
import userMainPanel from '@/views/profile/userMainPanel.vue'
import ArchivesPanel from '@/views/profile/archivesPanel.vue'
import teamPanel from '@/views/profile/teamPanel.vue'
import ActivityPanel from '@/views/profile/activityPanel.vue'

defineOptions({ name: 'ProfileView' })
</script>

<style scoped lang="scss"></style>
