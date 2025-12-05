<template>
  <el-dialog
    v-model="open"
    title="选择头像"
    width="800px"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="avatar-selector">
      <el-input v-model="avatarSearchText" placeholder="搜索头像名称" clearable class="mb-16">
        <template #prefix>
          <el-icon><component :is="menuStore.iconComponents['Search']" /></el-icon>
        </template>
      </el-input>
      <div class="avatar-list">
        <div
          v-for="avatar in filteredAvatars"
          :key="avatar.id"
          class="avatar-item"
          :class="{ active: currentSelectAvatar === avatar.src }"
          @click="selectAvatar(avatar)"
        >
          <div class="avatar-image">
            <img :src="avatar.src" :alt="avatar.alt" />
          </div>
          <div class="avatar-name">{{ avatar.title }}</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { APP_CONFIG } from '@/config/app.config'

defineOptions({ name: 'SelectAvatarDialog' })

const emits = defineEmits(['getSelectAvatar'])
const menuStore = useMenuStore()

const open = ref(false)
const avatarSearchText = ref('')
const currentSelectAvatar = ref('')

// 获取所有头像
const allAvatars = computed(() => {
  return APP_CONFIG.carousel.items
})

// 过滤后的头像列表
const filteredAvatars = computed(() => {
  if (!avatarSearchText.value) {
    return allAvatars.value
  }
  const search = avatarSearchText.value.toLowerCase()
  return allAvatars.value.filter(
    (avatar) =>
      avatar.title.toLowerCase().includes(search) ||
      avatar.alt.toLowerCase().includes(search) ||
      avatar.description.toLowerCase().includes(search)
  )
})

// 选择头像
const selectAvatar = (avatar: { src: string }) => {
  emits('getSelectAvatar', avatar.src)
  close()
}

const close = () => {
  open.value = false
  currentSelectAvatar.value = ''
  avatarSearchText.value = ''
}

const showDialog = (avatarSrc: string) => {
  currentSelectAvatar.value = avatarSrc
  open.value = true
}

defineExpose({
  showDialog,
})
</script>

<style scoped lang="scss">
.avatar-selector {
  .avatar-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 16px;
    max-height: 500px;
    overflow-y: auto;
    padding: 8px;

    .avatar-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px 8px;
      border: 2px solid var(--el-border-color);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--el-bg-color);

      &:hover {
        border-color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &.active {
        border-color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
        border-width: 3px;
      }

      .avatar-image {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 8px;
        border: 2px solid var(--el-border-color-lighter);
        transition: all 0.3s ease;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      }

      &.active .avatar-image {
        border-color: var(--el-color-primary);
      }

      .avatar-name {
        font-size: 12px;
        text-align: center;
        color: var(--el-text-color-regular);
        font-weight: 500;
      }

      &.active .avatar-name {
        color: var(--el-color-primary);
        font-weight: 600;
      }
    }
  }
}
</style>

