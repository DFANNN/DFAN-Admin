<template>
  <el-dropdown @command="handleCommand" trigger="click" placement="bottom-end">
    <div class="user-card">
      <div class="avatar-wrapper">
        <div class="user-avatar">
          <img :src="userStore.userInfo?.avatar" alt="avatar" />
        </div>
        <span class="status-badge"></span>
      </div>
      <div class="user-info">
        <span class="username ellipsis-text">{{
          userStore.userInfo?.name || userStore.userInfo?.username
        }}</span>
        <span class="user-role-badge ellipsis-text">{{ userRoleName }}</span>
      </div>
      <el-icon class="arrow-icon">
        <component :is="menuStore.iconComponents['HOutline:ChevronDownIcon']" />
      </el-icon>
    </div>
    <template #dropdown>
      <div class="user-menu-wrapper">
        <!-- 用户信息头部 -->
        <div class="user-header">
          <div class="avatar-wrapper">
            <div class="header-avatar">
              <img :src="userStore.userInfo?.avatar" alt="avatar" />
            </div>
            <span class="status-badge"></span>
          </div>
          <div class="user-info">
            <div class="name-row">
              <span class="user-name ellipsis-text">{{
                userStore.userInfo?.name || userStore.userInfo?.username
              }}</span>
              <span class="pro-badge ellipsis-text">{{ userRoleName }}</span>
            </div>
            <div class="user-email">{{ userStore.userInfo?.email || '' }}</div>
          </div>
        </div>

        <!-- 菜单项 -->
        <el-dropdown-menu class="user-menu">
          <el-dropdown-item command="profile">
            <el-icon>
              <component :is="menuStore.iconComponents['HOutline:UserCircleIcon']" />
            </el-icon>
            <span>个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item command="docs">
            <el-icon>
              <component :is="menuStore.iconComponents['HOutline:DocumentTextIcon']" />
            </el-icon>
            <span>文档</span>
          </el-dropdown-item>
          <el-dropdown-item command="github">
            <el-icon><IconGithub /></el-icon>
            <span>GitHub</span>
          </el-dropdown-item>
          <el-dropdown-item command="help">
            <el-icon>
              <component :is="menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']" />
            </el-icon>
            <span>问题 & 帮助</span>
          </el-dropdown-item>
          <el-dropdown-item divided command="lock">
            <el-icon>
              <component :is="menuStore.iconComponents['HOutline:LockClosedIcon']" />
            </el-icon>
            <span>锁定屏幕</span>
            <span class="shortcut">⌥ L</span>
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <el-icon>
              <component :is="menuStore.iconComponents['HOutline:ArrowRightOnRectangleIcon']" />
            </el-icon>
            <span>退出登录</span>
            <span class="shortcut">⌥ Q</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </div>
    </template>
  </el-dropdown>

  <el-dialog v-model="logoutDialogVisible" width="400px" title="系统提示">
    <div class="logout-dialog-content">
      <el-icon class="warning-icon">
        <component :is="menuStore.iconComponents['WarningFilled']" />
      </el-icon>
      <span class="dialog-text">确定要退出登录吗？</span>
    </div>
    <template #footer>
      <el-button @click="logoutDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="(userStore.logout(), (logoutDialogVisible = false))"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import IconGithub from '@/components/icons/IconGithub.vue'

const router = useRouter()
const menuStore = useMenuStore()
const userStore = useUserStore()

const logoutDialogVisible = ref(false)

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
      window.open('https://github.com/DFANNN/DFAN-Admin', '_blank')
      break
    case 'github':
      window.open('https://github.com/DFANNN/DFAN-Admin', '_blank')
      break
    case 'help':
      window.open('https://github.com/DFANNN/DFAN-Admin', '_blank')
      break
    case 'lock':
      console.log('锁定屏幕')
      break
    case 'logout':
      logoutDialogVisible.value = true
      break
  }
}

// 监听快捷键：Alt/Option + Q 触发退出登录弹窗
const handleKeydown = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null
  const isTyping =
    (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) ||
    target?.getAttribute('contenteditable') === 'true'

  if (isTyping) return

  // Mac 上 Option+Q 常返回 Dead key，改用 code 判断物理键位
  if (event.altKey && event.code === 'KeyQ') {
    event.preventDefault()
    logoutDialogVisible.value = true
  }
}

onMounted(() => {
  userStore.getUserInfo()
  userStore.getUserRoleName()
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
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
      animation: jello;
      animation-duration: 1s;
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
      max-width: 100px;
    }

    .user-role-badge {
      display: inline-block;
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
      max-width: 100px;
    }
  }

  .arrow-icon {
    font-size: 1rem;
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
        max-width: 100px;
      }

      .pro-badge {
        display: inline-block;
        align-items: center;
        padding: 3px 10px;
        background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
        color: var(--el-color-primary);
        font-size: 11px;
        font-weight: 500;
        border-radius: 12px;
        line-height: 1.2;
        border: 1px solid color-mix(in srgb, var(--el-color-primary) 20%, transparent);
        max-width: 100px;
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
      font-size: 1.25rem;
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

.logout-dialog-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;

  .warning-icon {
    font-size: 24px;
    color: var(--el-color-warning);
    flex-shrink: 0;
  }

  .dialog-text {
    font-size: 14px;
    color: var(--el-text-color-primary);
    line-height: 1.5;
  }
}
</style>
