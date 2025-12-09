<template>
  <el-dropdown trigger="click" placement="bottom-end" ref="notificationDropdownRef">
    <el-badge
      :value="userStore.unreadCount"
      :hidden="userStore.unreadCount === 0"
      :max="99"
      :offset="[-5, 5]"
    >
      <div class="action-btn">
        <el-icon><component :is="menuStore.iconComponents['HOutline:BellAlertIcon']" /></el-icon>
      </div>
    </el-badge>

    <template #dropdown>
      <div class="notification-dropdown">
        <div class="notification-header">
          <span class="title">消息通知</span>
          <el-button
            v-if="userStore.unreadCount > 0"
            type="primary"
            link
            size="small"
            @click.stop="userStore.markAllAsRead()"
          >
            <el-icon class="button-icon"
              ><component :is="menuStore.iconComponents['Check']"
            /></el-icon>
            全部已读
          </el-button>
        </div>
        <div class="notification-list">
          <el-scrollbar max-height="400px">
            <TransitionGroup name="list">
              <div
                v-for="message in unreadMessageList"
                :key="message.id"
                class="notification-item"
                @click="userStore.markAsRead(message.id)"
              >
                <div class="message-icon">
                  <el-icon>
                    <component
                      :is="
                        message.type === 'system'
                          ? menuStore.iconComponents['InfoFilled']
                          : message.type === 'user'
                            ? menuStore.iconComponents['User']
                            : menuStore.iconComponents['Document']
                      "
                    />
                  </el-icon>
                </div>
                <div class="message-content">
                  <div class="message-title">{{ message.title }}</div>
                  <div class="message-text">{{ message.content }}</div>
                  <div class="message-time">{{ message.time }}</div>
                </div>
              </div>
            </TransitionGroup>

            <div v-if="unreadMessageList.length === 0" class="empty-message">
              <el-empty description="暂无消息" :image-size="80" />
            </div>
          </el-scrollbar>
        </div>
        <div class="notification-footer">
          <el-button type="primary" link @click="goToProfile">查看全部消息</el-button>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import type { ElDropdown } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const menuStore = useMenuStore()
const notificationDropdownRef = ref<InstanceType<typeof ElDropdown>>()
// 未读消息列表
const unreadMessageList = computed(() => {
  return userStore.userMessages.filter((msg) => !msg.read)
})

// 跳转到个人中心
const goToProfile = () => {
  router.push('/profile')
  userStore.currentMenu = 'messages'
  notificationDropdownRef.value?.handleClose()
}
</script>

<style scoped lang="scss">
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    animation: jello;
    animation-duration: 1s;
  }

  .el-icon {
    font-size: 1.25rem;
  }
}
.notification-dropdown {
  width: 22rem;
  background: var(--el-bg-color);
  .notification-header {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--el-border-color-lighter);
    .title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
    .button-icon {
      margin-right: 0.25rem;
    }
  }
  .notification-list {
    max-height: 25rem;
    .notification-item {
      display: flex;
      gap: 12px;
      padding: 1rem;
      border-bottom: 1px solid var(--el-border-color-lighter);
      cursor: pointer;

      .message-icon {
        flex-shrink: 0;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        .el-icon {
          font-size: 1rem;
        }
      }

      &:hover {
        background: var(--el-fill-color-light);
      }

      .message-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;

        .message-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .message-text {
          font-size: 13px;
          color: var(--el-text-color-regular);
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .message-time {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          line-height: 1.4;
        }
      }
    }
  }
  .notification-footer {
    padding: 1rem;
    border-top: 1px solid var(--el-border-color-lighter);
    text-align: center;
  }
}
</style>
