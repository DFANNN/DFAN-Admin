<template>
  <el-card class="my-message-card" shadow="never">
    <template #header>
      <div class="card-header">
        <div class="header-left">
          <el-icon class="header-icon">
            <component :is="menuStore.iconComponents['BellFilled']" />
          </el-icon>
          <span class="header-title">我的消息</span>
        </div>
        <div class="header-actions">
          <el-button
            type="primary"
            link
            size="small"
            :disabled="userStore.unreadCount === 0"
            @click="userStore.markAllAsRead()"
          >
            <el-icon class="button-icon"
              ><component :is="menuStore.iconComponents['Check']"
            /></el-icon>
            全部已读
          </el-button>
          <el-popconfirm
            title="确定要删除所有消息吗？"
            @confirm="(userStore.deleteAllMessages(), ElMessage.success('全部消息已删除'))"
          >
            <template #reference>
              <el-button
                type="danger"
                link
                size="small"
                :disabled="userStore.userMessages.length === 0"
              >
                <el-icon class="button-icon"
                  ><component :is="menuStore.iconComponents['Delete']"
                /></el-icon>
                全部删除
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </template>
    <div class="message-container">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="item in messagesList" :name="item.value" :key="item.value">
          <template #label>
            <div class="tab-label">
              <span>{{ item.label }}</span>
              <el-badge
                :value="item.UnreadCount"
                :hidden="item.UnreadCount === 0"
                :max="99"
                class="tab-badge"
              />
            </div>
          </template>
          <div class="message-list">
            <div
              v-for="message in item.messages"
              :key="message.id"
              class="message-item"
              :class="{ unread: !message.read }"
            >
              <div class="message-icon-wrapper">
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
                <div v-if="!message.read" class="unread-dot"></div>
              </div>
              <div class="message-content">
                <div class="message-header">
                  <div class="message-title">{{ message.title }}</div>
                  <div class="message-time">{{ message.time }}</div>
                </div>
                <div class="message-content">{{ message.content }}</div>
              </div>
              <div class="message-actions">
                <el-button
                  type="primary"
                  link
                  size="small"
                  v-if="!message.read"
                  @click="userStore.markAsRead(message.id)"
                >
                  <el-icon class="button-icon"
                    ><component :is="menuStore.iconComponents['Check']"
                  /></el-icon>
                  标记已读
                </el-button>
                <el-popconfirm
                  title="确定要删除这条消息吗？"
                  @confirm="(userStore.deleteMessage(message.id), ElMessage.success('消息已删除'))"
                >
                  <template #reference>
                    <el-button type="danger" link size="small">
                      <el-icon class="button-icon"
                        ><component :is="menuStore.iconComponents['Delete']"
                      /></el-icon>
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
            <el-empty v-if="item.messages.length === 0" description="暂无消息" :image-size="120" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
const userStore = useUserStore()
const menuStore = useMenuStore()

const activeName = ref('system')

const messagesList = computed(() => {
  const systemMessages = userStore.userMessages.filter((item) => item.type === 'system')
  const userMessages = userStore.userMessages.filter((item) => item.type === 'user')
  const todoMessages = userStore.userMessages.filter((item) => item.type === 'todo')
  return [
    {
      label: '系统通知',
      value: 'system',
      UnreadCount: systemMessages.filter((item) => !item.read).length,
      messages: systemMessages,
    },
    {
      label: '用户消息',
      value: 'user',
      UnreadCount: userMessages.filter((item) => !item.read).length,
      messages: userMessages,
    },
    {
      label: '代办事项',
      value: 'todo',
      UnreadCount: todoMessages.filter((item) => !item.read).length,
      messages: todoMessages,
    },
  ]
})
</script>

<style scoped lang="scss">
:deep(.el-card__body) {
  padding: 0;
}
.el-card {
  border-radius: 1rem;
}
.my-message-card {
  width: 100%;
  height: 100%;
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    .header-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      .header-icon {
        font-size: 1.25rem;
        color: var(--el-color-primary);
      }
      .header-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      .button-icon {
        margin-right: 0.25rem;
      }
    }
  }
  .message-container {
    padding: 2rem;
    .tab-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      .tab-badge {
        display: flex;
      }
    }
    .message-list {
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .message-item {
        padding: 1rem;
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border: 1px solid var(--el-border-color-lighter);
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
          border-color: var(--el-color-primary);
        }
        &.unread {
          border-left: 0.25rem solid var(--el-color-primary);
        }
        .message-icon-wrapper {
          position: relative;
          flex-shrink: 0;
          .message-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            transition: all 0.3s ease;
            background: linear-gradient(
              135deg,
              var(--el-color-primary-light-7) 0%,
              var(--el-color-primary-dark-2) 100%
            );
            color: #fff;
          }
          .unread-dot {
            position: absolute;
            top: -0.25rem;
            right: -0.25rem;
            width: 0.75rem;
            height: 0.75rem;
            border-radius: 50%;
            background: var(--el-color-danger);
            border: 2px solid var(--el-bg-color);
          }
        }
        .message-content {
          flex: 1;
          .message-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 0.8rem;
            .message-title {
              font-size: 1rem;
              font-weight: 600;
              color: var(--el-text-color-primary);
            }
            .message-time {
              font-size: 0.8rem;
              color: var(--el-text-color-placeholder);
              white-space: nowrap;
            }
          }
          .message-content {
            font-size: 0.875rem;
            color: var(--el-text-color-regular);
            line-height: 1.5;
          }
        }
        .message-actions {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          .button-icon {
            margin-right: 0.25rem;
          }
        }
      }
    }
  }
}
</style>
