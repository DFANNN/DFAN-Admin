<template>
  <el-card shadow="never" class="profile-menu-card">
    <div class="avatar-section">
      <div class="avatar-wrapper">
        <img src="@/assets/cats/白猫.svg" alt="头像" />
        <div class="avatar-overlay">
          <el-icon><component :is="menuStore.iconComponents['Camera']" /></el-icon>
          <span>更换头像</span>
        </div>
      </div>
      <div class="user-name">{{ userStore.userInfo?.name || userStore.userInfo?.username }}</div>
      <div class="user-email">{{ userStore.userInfo?.email }}</div>
    </div>
    <div class="menu-list">
      <div
        v-for="menu in menuList"
        :key="menu.key"
        class="menu-item"
        :class="{ active: userStore.currentMenu === menu.key }"
        @click="userStore.currentMenu = menu.key"
      >
        <el-icon><component :is="menuStore.iconComponents[menu.icon]" /></el-icon>
        <span>{{ menu.label }}</span>
        <el-badge
          v-if="menu.key === 'messages'"
          :value="userStore.unreadCount"
          :hidden="userStore.unreadCount === 0"
          :max="99"
          class="menu-badge"
        />
      </div>
    </div>
  </el-card>
  <SelectAvatarDialog ref="selectAvatarDialogRef" @getSelectAvatar="handleSelectAvatar" />
</template>

<script setup lang="ts">
import SelectAvatarDialog from '@/components/SelectAvatarDialog.vue'

const userStore = useUserStore()
const menuStore = useMenuStore()
const selectAvatarDialogRef = useTemplateRef<InstanceType<typeof SelectAvatarDialog> | null>(
  'selectAvatarDialogRef',
)

// 菜单列表
const menuList: Array<{ key: string; label: string; icon: string }> = [
  {
    key: 'info',
    label: '基本信息',
    icon: 'User',
  },
  {
    key: 'password',
    label: '修改密码',
    icon: 'Lock',
  },
  {
    key: 'messages',
    label: '我的消息',
    icon: 'Bell',
  },
]

const handleSelectAvatar = (avatar: string) => {
  console.log(`output->`, avatar)
}
</script>

<style scoped lang="scss">
:deep(.el-card__body) {
  padding: 0;
}
.el-card {
  border-radius: 1rem;
}

.profile-menu-card {
  width: 18.75rem;
  height: 100%;
  .avatar-section {
    background: linear-gradient(
      135deg,
      var(--el-color-primary-light-7) 0%,
      var(--el-color-primary-dark-2) 100%
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 0;
    .avatar-wrapper {
      width: 7.5rem;
      height: 7.5rem;
      border-radius: 50%;
      border: 4px solid #fff;
      margin-bottom: 1.25rem;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      transition: all 0.3s ease;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .avatar-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        opacity: 0;
        transition: opacity 0.3s ease;
        .el-icon {
          font-size: 1.75rem;
        }
        span {
          font-size: 0.875rem;
          font-weight: 500;
        }
      }

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        .avatar-overlay {
          opacity: 1;
        }
      }
    }
    .user-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.5rem;
    }

    .user-email {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.9);
    }
  }
  .menu-list {
    padding: 1rem;
    .menu-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      cursor: pointer;
      color: var(--el-text-color-primary);
      font-weight: 500;
      transition: all 0.3s ease;

      .menu-badge {
        display: flex;
        align-items: center;
      }

      &:hover {
        background: var(--el-fill-color-light);
        color: var(--el-color-primary);
      }
      &.active {
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--el-color-primary) 20%, transparent) 0%,
          color-mix(in srgb, var(--el-color-primary) 20%, transparent) 100%
        );
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
