<template>
  <el-card shadow="never" class="profile-menu-card">
    <div class="avatar-section">
      <div class="avatar-glow"></div>
      <div class="avatar-wrapper">
        <img :src="userStore.userInfo?.avatar" alt="头像" />
        <div class="avatar-overlay" @click="selectAvatarDialogRef?.showDialog()">
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
        <el-icon :size="20"><component :is="menuStore.iconComponents[menu.icon]" /></el-icon>
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
  <SelectAvatarDialog ref="selectAvatarDialogRef" />
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
    icon: 'HSolid:UserCircleIcon',
  },
  {
    key: 'password',
    label: '修改密码',
    icon: 'HSolid:LockClosedIcon',
  },
  {
    key: 'messages',
    label: '我的消息',
    icon: 'HSolid:BellAlertIcon',
  },
]
</script>

<style scoped lang="scss">
:deep(.el-card__body) {
  padding: 0;
}
.el-card {
  border-radius: 1rem;
}

.profile-menu-card {
  height: 100%;
  .avatar-section {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(
        circle at 20% 20%,
        color-mix(in srgb, var(--el-color-primary) 12%, transparent) 0,
        transparent 45%
      ),
      radial-gradient(
        circle at 80% 0%,
        color-mix(in srgb, #10b981 10%, transparent) 0,
        transparent 40%
      ),
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--el-color-primary) 16%, var(--el-bg-color) 84%),
        var(--el-bg-color)
      );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;

    .avatar-glow {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(
          circle at 30% 50%,
          color-mix(in srgb, var(--el-color-primary) 8%, transparent) 0,
          transparent 45%
        ),
        radial-gradient(
          circle at 80% 50%,
          color-mix(in srgb, #10b981 10%, transparent) 0,
          transparent 40%
        );
      filter: blur(24px);
      opacity: 0.7;
      pointer-events: none;
      z-index: 0;
    }
    .avatar-wrapper {
      position: relative;
      z-index: 1;
      width: 7.5rem;
      height: 7.5rem;
      border-radius: 50%;
      border: 4px solid #fff;
      margin-bottom: 1.25rem;
      overflow: hidden;
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
      position: relative;
      z-index: 1;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--el-text-color-primary);
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .user-email {
      position: relative;
      z-index: 1;
      font-size: 0.875rem;
      color: var(--el-text-color-regular);
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
