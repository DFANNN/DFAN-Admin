<template>
  <div>
    <GradientHeader />
    <div class="relative left-0 -top-50 px-2 md:px-10">
      <userMainPanel />
      <div class="mt-4">
        <Transition name="slide-up" :style="{ '--animation-duration': '0.6s' }" mode="out-in">
          <div :key="userStore.currentTab">
            <MyInformation v-if="userStore.currentTab === 'personalInfo'" />
            <MyProject v-else-if="userStore.currentTab === 'projects'" />
            <MyPermission v-else-if="userStore.currentTab === 'permissions'" />
            <MyMessages v-else-if="userStore.currentTab === 'messages'" />
            <LoginLogs v-else />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GradientHeader from '@/views/profile/gradientHeader.vue'
import userMainPanel from '@/views/profile/userMainPanel.vue'
import MyInformation from '@/views/profile/myInformation.vue'
import MyProject from '@/views/profile/myProject.vue'
import MyPermission from '@/views/profile/myPermission.vue'
import MyMessages from '@/views/profile/myMessages.vue'
import LoginLogs from '@/views/profile/loginLogs.vue'

defineOptions({ name: 'ProfileView' })

const userStore = useUserStore()
</script>

<style scoped lang="scss"></style>
