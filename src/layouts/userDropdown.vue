<template>
  <el-dropdown @command="handleCommand" trigger="click" placement="bottom-end">
    <div class="user-card">
      <div class="avatar-wrapper">
        <div class="user-avatar">
          <img src="@/assets/avatar.svg" alt="avatar" />
        </div>
        <span class="status-badge"></span>
      </div>
      <div class="user-info">
        <span class="username">{{ userStore.userInfo?.name || userStore.userInfo?.username }}</span>
        <span class="user-role-badge">{{ userRoleName }}</span>
      </div>
      <el-icon class="arrow-icon">
        <component :is="menuStore.iconComponents['ArrowDown']" />
      </el-icon>
    </div>
    <template #dropdown>
      <div class="user-menu-wrapper">
        <!-- 用户信息头部 -->
        <div class="user-header">
          <div class="avatar-wrapper">
            <div class="header-avatar">
              <img src="@/assets/avatar.svg" alt="avatar" />
            </div>
            <span class="status-badge"></span>
          </div>
          <div class="user-info">
            <div class="name-row">
              <span class="user-name">{{
                userStore.userInfo?.name || userStore.userInfo?.username
              }}</span>
              <span class="pro-badge">{{ userRoleName }}</span>
            </div>
            <div class="user-email">{{ userStore.userInfo?.email || '' }}</div>
          </div>
        </div>

        <!-- 菜单项 -->
        <el-dropdown-menu class="user-menu">
          <el-dropdown-item command="profile">
            <el-icon><component :is="menuStore.iconComponents['Avatar']" /></el-icon>
            <span>个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item command="docs">
            <el-icon><component :is="menuStore.iconComponents['Document']" /></el-icon>
            <span>文档</span>
          </el-dropdown-item>
          <el-dropdown-item command="github">
            <el-icon><component :is="menuStore.iconComponents['Link']" /></el-icon>
            <span>GitHub</span>
          </el-dropdown-item>
          <el-dropdown-item command="help">
            <el-icon><component :is="menuStore.iconComponents['QuestionFilled']" /></el-icon>
            <span>问题 & 帮助</span>
          </el-dropdown-item>
          <el-dropdown-item divided command="lock">
            <el-icon><component :is="menuStore.iconComponents['Lock']" /></el-icon>
            <span>锁定屏幕</span>
            <span class="shortcut">⇧ L</span>
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <el-icon><component :is="menuStore.iconComponents['SwitchButton']" /></el-icon>
            <span>退出登录</span>
            <span class="shortcut">⇧ Q</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
const router = useRouter()
const menuStore = useMenuStore()
const userStore = useUserStore()

// 用户角色名称
const userRoleName = computed(() => {
  return userStore.roleList.find((role) => role.id === userStore.userInfo?.roleId)?.name ?? '无权限'
})

// 用户菜单命令处理
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      userStore.currentMenu = 'info'
      router.push('/profile')
      break
    case 'docs':
      console.log('文档')
      break
    case 'github':
      window.open('https://github.com', '_blank')
      break
    case 'help':
      console.log('问题 & 帮助')
      break
    case 'lock':
      console.log('锁定屏幕')
      break
    case 'logout':
      userStore.logout()
      break
  }
}

onMounted(() => {
  userStore.getUserInfo()
  userStore.getUserRoleName()
})
</script>

<style scoped lang="scss">
.user-card {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 4px 8px 4px 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    .arrow-icon {
      color: var(--el-color-primary);
    }
  }

  .avatar-wrapper {
    position: relative;
    flex-shrink: 0;

    .status-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      background: #52c41a;
      border: 2px solid var(--el-bg-color);
      border-radius: 50%;
    }
  }

  .user-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;

    .username {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      line-height: 1.2;
    }

    .user-role-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
      color: var(--el-color-primary);
      font-size: 11px;
      font-weight: 500;
      border-radius: 10px;
      border: 1px solid color-mix(in srgb, var(--el-color-primary) 20%, transparent);
      white-space: nowrap;
      line-height: 1.2;
    }
  }

  .arrow-icon {
    font-size: 16px;
    color: var(--el-text-color-regular);
    transition: color 0.2s;
    margin-left: 4px;
  }
}

.user-menu-wrapper {
  margin-top: 8px;
  background: var(--el-bg-color);
  border-radius: 8px;
  overflow: hidden;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);

  .avatar-wrapper {
    position: relative;
    flex-shrink: 0;

    .status-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 12px;
      height: 12px;
      background: #52c41a;
      border: 2px solid var(--el-bg-color);
      border-radius: 50%;
    }
  }

  .user-info {
    flex: 1;
    min-width: 0;

    .name-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;

      .user-name {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        line-height: 1.2;
      }

      .pro-badge {
        display: inline-flex;
        align-items: center;
        padding: 3px 10px;
        background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
        color: var(--el-color-primary);
        font-size: 11px;
        font-weight: 500;
        border-radius: 12px;
        line-height: 1.2;
        border: 1px solid color-mix(in srgb, var(--el-color-primary) 20%, transparent);
      }
    }

    .user-email {
      font-size: 13px;
      color: var(--el-text-color-regular);
      opacity: 0.8;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.avatar-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-wrapper .user-avatar,
.avatar-wrapper .header-avatar {
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.avatar-wrapper .user-avatar {
  width: 36px;
  height: 36px;
}

.avatar-wrapper .header-avatar {
  width: 48px;
  height: 48px;
}

:deep(.user-menu) {
  padding: 4px 0;
  min-width: 200px;
  background: var(--el-bg-color);

  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    transition: background-color 0.2s;
    background: transparent;

    &:hover {
      background: var(--el-fill-color-light);
      color: var(--el-color-primary);
    }

    .el-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    span:not(.shortcut) {
      font-size: 14px;
      flex: 1;
    }

    .shortcut {
      font-size: 12px;
      color: var(--el-text-color-placeholder);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      opacity: 0.6;
    }
  }
}
</style>
