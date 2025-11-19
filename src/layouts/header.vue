<template>
  <div class="header-container">
    <!-- 左侧区域 -->
    <div class="header-left">
      <div v-if="themeStore.showLogo" class="logo" @click="$router.push('/')">
        <!-- <div class="logo-icon">
          <span class="logo-text">D</span>
        </div>
        <div class="logo-content">
          <span class="logo-title">DFAN</span>
          <span class="logo-subtitle">Admin</span>
        </div> -->
      </div>
    </div>

    <!-- 右侧操作区 -->
    <div class="header-right">
      <div class="action-buttons">
        <el-tooltip content="主题配置" placement="bottom" effect="dark">
          <div class="action-btn" @click="themeStore.themeConfigDrawerOpen = true">
            <el-icon><Setting /></el-icon>
          </div>
        </el-tooltip>

        <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom" effect="dark">
          <div class="action-btn" @click="toggleFullscreen">
            <el-icon><component :is="isFullscreen ? FullScreen : Aim" /></el-icon>
          </div>
        </el-tooltip>
      </div>

      <!-- 用户信息 -->
      <el-dropdown @command="handleCommand" trigger="click" placement="bottom-end">
        <div class="user-card">
          <div class="avatar-wrapper">
            <el-avatar :size="32" class="user-avatar">
              <el-icon><UserFilled /></el-icon>
            </el-avatar>
            <span class="status-badge"></span>
          </div>
          <div class="user-info">
            <div class="name-row">
              <span class="username">管理员</span>
              <span class="pro-badge">Pro</span>
            </div>
          </div>
          <el-icon class="arrow-icon"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <div class="user-menu-wrapper">
            <!-- 用户信息头部 -->
            <div class="user-header">
              <div class="avatar-wrapper">
                <el-avatar :size="48" class="header-avatar">
                  <el-icon><UserFilled /></el-icon>
                </el-avatar>
                <span class="status-badge"></span>
              </div>
              <div class="user-info">
                <div class="name-row">
                  <span class="user-name">管理员</span>
                  <span class="pro-badge">Pro</span>
                </div>
                <div class="user-email">admin@dfan.com</div>
              </div>
            </div>

            <!-- 菜单项 -->
            <el-dropdown-menu class="user-menu">
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                <span>个人中心</span>
              </el-dropdown-item>
              <el-dropdown-item command="docs">
                <el-icon><Document /></el-icon>
                <span>文档</span>
              </el-dropdown-item>
              <el-dropdown-item command="github">
                <el-icon><Link /></el-icon>
                <span>GitHub</span>
              </el-dropdown-item>
              <el-dropdown-item command="help">
                <el-icon><QuestionFilled /></el-icon>
                <span>问题 & 帮助</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="lock">
                <el-icon><Lock /></el-icon>
                <span>锁定屏幕</span>
                <span class="shortcut">⇧ L</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
                <span class="shortcut">⇧ Q</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </div>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Setting,
  UserFilled,
  User,
  ArrowDown,
  SwitchButton,
  FullScreen,
  Aim,
  Document,
  Link,
  QuestionFilled,
  Lock,
} from '@element-plus/icons-vue'
import { useFullscreen } from '@vueuse/core'

defineOptions({ name: 'HeaderView' })

const themeStore = useThemeStore()

// 全屏功能
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// 用户菜单命令处理
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      console.log('个人中心')
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
      console.log('退出登录')
      break
  }
}
</script>

<style scoped lang="scss">
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  background: var(--el-bg-color);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--el-fill-color-light);
    transform: translateY(-1px);

    .logo-icon {
      transform: scale(1.05) rotate(5deg);
    }
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      135deg,
      var(--el-color-primary) 0%,
      var(--el-color-primary-light-3) 100%
    );
    border-radius: 10px;
    box-shadow: 0 4px 12px color-mix(in srgb, var(--el-color-primary) 25%, transparent);
    transition: all 0.3s ease;

    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.5px;
    }
  }

  .logo-content {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .logo-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      letter-spacing: 0.5px;
      line-height: 1.2;
    }

    .logo-subtitle {
      font-size: 12px;
      color: var(--el-text-color-regular);
      font-weight: 400;
      opacity: 0.8;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 16px;
  border-right: 1px solid var(--el-border-color-lighter);
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--el-text-color-regular);
  background: transparent;

  &:hover {
    background: var(--el-fill-color-light);
    color: var(--el-color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .el-icon {
    font-size: 18px;
  }
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px 4px 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: var(--el-fill-color-light);

    .arrow-icon {
      color: var(--el-color-primary);
    }
  }

  .avatar-wrapper {
    position: relative;
    flex-shrink: 0;

    .user-avatar {
      background: var(--el-color-primary);
      color: #fff;
    }

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

    .name-row {
      display: flex;
      align-items: center;
      gap: 6px;

      .username {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        line-height: 1.2;
      }

      .pro-badge {
        display: inline-flex;
        align-items: center;
        padding: 1px 6px;
        background: #52c41a;
        color: #fff;
        font-size: 10px;
        font-weight: 600;
        border-radius: 10px;
        line-height: 1.2;
      }
    }
  }

  .arrow-icon {
    font-size: 12px;
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

    .header-avatar {
      background: var(--el-color-primary);
      color: #fff;
    }

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
        padding: 2px 8px;
        background: #52c41a;
        color: #fff;
        font-size: 11px;
        font-weight: 600;
        border-radius: 12px;
        line-height: 1.2;
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

:deep(.user-menu) {
  padding: 4px 0;
  min-width: 200px;

  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    transition: background-color 0.2s;

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
