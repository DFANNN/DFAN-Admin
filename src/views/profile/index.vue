<template>
  <div class="profile-container">
    <div>
      <ProfileMenu />
    </div>
    <div class="profile-right">
      <Transition name="fade-slide" mode="out-in">
        <component :is="componentMap[userStore.currentMenu]" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import MyMessage from '@/views/profile/myMessage.vue'
import ProfileMenu from '@/views/profile/profileMenu.vue'
import ProfileInfo from '@/views/profile/profileInfo.vue'
import UpdatePassword from '@/views/profile/updatePassword.vue'

const userStore = useUserStore()

const componentMap: Record<string, Component> = {
  info: ProfileInfo,
  password: UpdatePassword,
  messages: MyMessage,
}

defineOptions({ name: 'ProfileView' })
</script>

<style scoped lang="scss">
.profile-container {
  display: flex;
  gap: 1rem;
  height: 100%;
  .profile-right {
    flex: 1;
  }
}
</style>
