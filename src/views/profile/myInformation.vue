<template>
  <!-- 我的资料 -->
  <el-row :gutter="20">
    <el-col :lg="6">
      <ArchivesPanel />
      <teamPanel class="mt-4" />
    </el-col>
    <el-col :lg="18" class="mt-4 min-[1200px]:mt-0">
      <PersonalInfoPanel />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import teamPanel from '@/views/profile/teamPanel.vue'
import ArchivesPanel from '@/views/profile/archivesPanel.vue'
import PersonalInfoPanel from '@/views/profile/personalInfoPanel.vue'
</script>

<style></style>
