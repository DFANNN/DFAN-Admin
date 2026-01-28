<template>
  <!-- 我的资料 -->
  <el-row :gutter="20">
    <el-col :lg="6">
      <ArchivesPanel />
      <TeamMemberCard :title="`核心团队（${team.length}）`" :team-data="team" class="mt-4" />
    </el-col>
    <el-col :lg="18" class="mt-4 min-[1200px]:mt-0">
      <PersonalInfoPanel />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import ArchivesPanel from '@/views/profile/archivesPanel.vue'
import PersonalInfoPanel from '@/views/profile/personalInfoPanel.vue'
import type { ITeamItem } from '@/types/profile'

const team = ref<ITeamItem[]>([
  {
    name: 'Lucille Richards',
    role: 'UI Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucille',
    status: 'online',
  },
  {
    name: 'Ray Vaughn',
    role: 'Frontend Dev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ray',
    status: 'online',
  },
  {
    name: 'Nellie Powers',
    role: 'Product Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nellie',
    status: 'online',
  },
  {
    name: 'Sallie Henderson',
    role: 'QA Engineer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sallie',
    status: 'online',
  },
  {
    name: 'James Chen',
    role: '测试工程师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    status: 'offline',
  },
  {
    name: 'Lucy Wang',
    role: '前端开发',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
    status: 'offline',
  },
  {
    name: 'Tom Chen',
    role: '数据科学家',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    status: 'offline',
  },
])
</script>

<style></style>
