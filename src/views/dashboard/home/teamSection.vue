<template>
  <TeamMemberCard title="在线伙伴" :team-data="team" :height="293" />
</template>

<script setup lang="ts">
import type { ITeamItem } from '@/types/profile'

const team = ref<ITeamItem[]>([
  {
    name: 'David Fan',
    role: '高级研发工程师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    status: 'online',
  },
  {
    name: 'Alice Zhang',
    role: 'UI 设计师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    status: 'online',
  },
  {
    name: 'Mike Lee',
    role: '产品经理',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    status: 'offline',
  },
  {
    name: 'Sarah Sun',
    role: '后端架构师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
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

<style scoped lang="scss"></style>
