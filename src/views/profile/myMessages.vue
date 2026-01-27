<template>
  <!-- 我的消息 -->
  <div>
    <el-card class="common-card" shadow="never">
      <div class="flex items-center gap-4">
        <el-avatar :size="32" :src="userStore.userInfo?.avatar" />
        <span class="text-sm font-medium text-(--el-text-color-secondary)"
          >Hi, {{ userStore.userInfo?.name }}，可以在这里发送新通知哦。</span
        >
      </div>
      <el-input
        v-model="postContent"
        :rows="3"
        type="textarea"
        placeholder="输入消息内容..."
        class="mt-4"
      />
      <div class="flex items-center justify-between mt-4">
        <div class="text-xs text-(--el-text-color-secondary)">将推送给所有相关人员</div>
        <el-button type="primary" :disabled="!postContent.trim()" @click="sendMessage"
          >发布消息</el-button
        >
      </div>
    </el-card>

    <el-card class="common-card mt-4" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <BadgeTabsMenu v-model="activeName" :tabs-menu-data="tabsMenu" :tabs-item-height="30" />
          </div>
          <div class="flex items-center">
            <IconButton
              icon="Element:Check"
              type="primary"
              tooltip="一键已读"
              size="1.5rem"
              iconSize="1rem"
              v-if="menuStore.isMobile"
              :disabled="!userStore.unreadCount"
              @click="userStore.markAllAsRead()"
            />
            <el-button
              type="primary"
              link
              :disabled="!userStore.unreadCount"
              @click="userStore.markAllAsRead()"
              v-else
            >
              一键已读
            </el-button>
            <el-divider direction="vertical" />
            <IconButton
              icon="Element:Delete"
              type="danger"
              tooltip="清空全部"
              size="1.5rem"
              iconSize="1rem"
              :disabled="!userStore.userMessages.length"
              v-if="menuStore.isMobile"
              @click="clearAllMessages"
            />
            <el-button
              type="danger"
              link
              :disabled="!userStore.userMessages.length"
              @click="clearAllMessages"
              v-else
            >
              清空全部
            </el-button>
          </div>
        </div>
      </template>
      <div>
        <Transition name="zoom" mode="out-in">
          <el-empty
            v-if="messageList.length === 0"
            :description="activeName === 'unread' ? '暂无未读消息' : '暂无消息'"
          />
          <TransitionGroup name="group-slide-fade-right" tag="div" v-else>
            <div
              v-for="message in messageList"
              :key="message.id"
              class="card-float-up group p-4 mb-3 flex items-center gap-4 border border-(--el-border-color-light) rounded-xl cursor-pointer hover:border-(--el-border-color) hover:bg-(--el-bg-color-page)"
            >
              <div class="relative">
                <el-avatar :size="48" :src="message.avatar" />
                <span
                  class="absolute h-3 w-3 bottom-1.5 right-0.5 rounded-full border-3 border-(--el-bg-color) bg-(--el-color-danger)"
                  v-if="!message.read"
                ></span>
              </div>

              <div class="flex-1">
                <div class="flex justify-between">
                  <TextEllipsis :text="message.title" :clickable="false" tooltipType="none" />
                  <div class="flex items-center opacity-100 lg:opacity-0 group-hover:opacity-100">
                    <IconButton
                      icon="Element:Check"
                      type="primary"
                      tooltip="设为已读"
                      size="1.5rem"
                      iconSize="1rem"
                      @click="userStore.markAsRead(message.id)"
                      v-if="!message.read"
                    />
                    <el-divider direction="vertical" v-if="!message.read" />
                    <el-popconfirm
                      title="确定删除这条消息吗？"
                      @confirm="
                        (userStore.deleteMessage(message.id), ElMessage.success('删除成功'))
                      "
                    >
                      <template #reference>
                        <div>
                          <IconButton
                            icon="Element:Delete"
                            type="danger"
                            size="1.5rem"
                            iconSize="1rem"
                            tooltip="删除"
                          />
                        </div>
                      </template>
                    </el-popconfirm>
                  </div>
                </div>
                <div
                  class="mt-2 text-sm text-(--el-text-color-regular) leading-relaxed wrap-break-word"
                >
                  {{ message.content }}
                </div>
                <div class="text-xs text-(--el-text-color-secondary) mt-2">{{ message.time }}</div>
              </div>
            </div>
          </TransitionGroup>
        </Transition>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Dialog } from '@/utils/dialog'
import { delay } from '@/utils/utils'
import BadgeTabsMenu from '@/components/tabs/BadgeTabsMenu.vue'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const menuStore = useMenuStore()

// 消息内容
const postContent = ref('')
// 当前菜单
const activeName = ref<'all' | 'unread'>('all')

// 菜单
const tabsMenu = computed(() => [
  { key: 'all', label: '全部消息', badge: 0 },
  { key: 'unread', label: '未读消息', badge: userStore.unreadCount },
])

// 消息列表
const messageList = computed(() => {
  if (activeName.value === 'unread') {
    return userStore.userMessages.filter((item) => !item.read)
  }
  return userStore.userMessages
})

// 发送消息
const sendMessage = () => {
  userStore.sendMessage(postContent.value)
  ElMessage.success('发送成功')
  postContent.value = ''
}

// 清空全部消息
const clearAllMessages = () => {
  Dialog.confirm({
    title: '确认清空？',
    content: '这一操作会删除所有消息，手滑之后可就找不回来了哦～',
    onConfirm: async () => {
      await delay(1000)
      userStore.deleteAllMessages()
      ElMessage.success('消息清空完成')
    },
  })
}
</script>

<style scoped lang="scss">
.group-slide-fade-right-enter-active,
.group-slide-fade-right-leave-active {
  transition: all 0.5s ease;
}
.group-slide-fade-right-enter-from,
.group-slide-fade-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.common-card {
  border: none;
  border-radius: 1rem;
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-extra-light);
}
</style>
