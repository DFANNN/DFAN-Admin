<template>
  <div class="message-container">
    <!-- 发送新通知卡片 (保持不变) -->
    <el-card class="common-card mb-6" shadow="never">
      <div class="flex items-center gap-4 mb-4">
        <el-avatar :size="32" :src="userStore.userInfo?.avatar" />
        <span class="text-sm font-medium text-(--el-text-color-primary)">发送新通知</span>
      </div>
      <el-input
        v-model="newMessage"
        :rows="3"
        type="textarea"
        placeholder="输入消息内容..."
        resize="none"
      />
      <div class="flex items-center justify-between mt-4">
        <div class="text-xs text-(--el-text-color-secondary)">将推送给所有相关人员</div>
        <el-button type="primary" round @click="handlePublish" :disabled="!newMessage">
          发布消息
        </el-button>
      </div>
    </el-card>

    <!-- 标签页与批量操作栏 -->
    <div
      class="bg-white rounded-t-2xl px-4 pt-2 border-b border-gray-100 flex items-center justify-between"
    >
      <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="handleTabClick">
        <el-tab-pane name="all">
          <template #label>
            <div class="flex items-center gap-2">
              <span>全部消息</span>
              <el-tag type="info" round size="small" effect="plain" class="border-0 bg-gray-100">
                {{ messageList.length }}
              </el-tag>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="unread">
          <template #label>
            <div class="flex items-center gap-2">
              <span>未读消息</span>
              <el-tag v-if="unreadCount > 0" type="danger" round size="small" effect="dark">
                {{ unreadCount }}
              </el-tag>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>

      <!-- 批量操作按钮 -->
      <div class="flex gap-3 mb-2">
        <el-button link type="primary" :disabled="unreadCount === 0" @click="markAllAsRead">
          <el-icon class="mr-1"><Check /></el-icon> 一键已读
        </el-button>
        <el-divider direction="vertical" />
        <el-button
          link
          type="danger"
          :disabled="messageList.length === 0"
          @click="clearAllMessages"
        >
          <el-icon class="mr-1"><Delete /></el-icon> 清空全部
        </el-button>
      </div>
    </div>

    <!-- 消息列表区域 -->
    <div class="bg-white rounded-b-2xl p-4 min-h-[300px]">
      <el-empty
        v-if="displayList.length === 0"
        :description="activeTab === 'unread' ? '暂无未读消息' : '暂无消息'"
      />

      <transition-group name="list">
        <div
          v-for="msg in displayList"
          :key="msg.id"
          class="message-item group relative flex gap-4 p-4 mb-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300"
          :class="{ 'opacity-70 bg-gray-50': msg.isRead }"
        >
          <!-- 左侧：头像与未读点 -->
          <div class="relative shrink-0">
            <el-avatar :size="48" :src="msg.userAvatar" shape="square" class="rounded-xl" />
            <span v-if="!msg.isRead" class="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
              ></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>

          <!-- 右侧：内容与操作 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-1">
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-800">{{ msg.userName }}</span>
                <el-tag size="small" :type="getTagType(msg.type)" effect="light" round>
                  {{ msg.type }}
                </el-tag>
                <span class="text-xs text-gray-400">{{ msg.time }}</span>
              </div>

              <!-- 修改后的操作按钮组：使用文字链接风格 -->
              <div
                class="action-buttons flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <el-button
                  v-if="!msg.isRead"
                  type="primary"
                  link
                  size="small"
                  @click="markAsRead(msg.id)"
                >
                  设为已读
                </el-button>

                <el-popconfirm title="确定删除这条消息吗？" @confirm="deleteMessage(msg.id)">
                  <template #reference>
                    <el-button
                      type="info"
                      link
                      size="small"
                      class="!text-gray-400 hover:!text-red-500"
                    >
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>

            <p class="text-sm text-gray-600 leading-relaxed break-words">
              {{ msg.content }}
            </p>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Check, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 假设的 store，实际使用请确保已引入
const userStore = {
  userInfo: {
    name: 'Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  },
}

const newMessage = ref('')
const activeTab = ref('all') // 控制当前标签页: 'all' | 'unread'

// 模拟消息数据
const messageList = ref([
  {
    id: 1,
    userName: '系统通知',
    userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=system',
    time: '10 分钟前',
    type: '安全',
    content: '您的账号于 18:20 在新的设备登录，如非本人操作请及时修改密码。',
    isRead: false,
  },
  {
    id: 2,
    userName: '张小帅',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    time: '1 小时前',
    type: '回复',
    content: '回复了你在《Vue3 性能优化》中的评论：“这个点确实容易被忽略，感谢分享！”',
    isRead: false,
  },
  {
    id: 3,
    userName: '李思思',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucille',
    time: '昨天',
    type: '点赞',
    content: '赞了你的动态：本周项目进度总结。',
    isRead: true,
  },
])

// 计算属性
const unreadCount = computed(() => messageList.value.filter((m) => !m.isRead).length)

// 根据当前 Tab 过滤显示的列表
const displayList = computed(() => {
  if (activeTab.value === 'unread') {
    return messageList.value.filter((m) => !m.isRead)
  }
  return messageList.value
})

// 辅助方法：标签颜色
const getTagType = (type: string) => {
  const map: Record<string, string> = {
    安全: 'danger',
    回复: 'primary',
    点赞: 'success',
    发布: 'info',
  }
  return map[type] || 'info'
}

// --- 功能方法 ---

const handleTabClick = () => {
  // 可以在这里处理切换 Tab 的埋点等逻辑
}

const handlePublish = () => {
  const newMsg = {
    id: Date.now(),
    userName: userStore.userInfo?.name || '我',
    userAvatar: userStore.userInfo?.avatar || '',
    time: '刚刚',
    type: '发布',
    content: newMessage.value,
    isRead: false,
  }
  messageList.value.unshift(newMsg)
  newMessage.value = ''
  ElMessage.success('消息发布成功')
  // 如果当前在未读列表，发布新消息后自动切回全部，或者保留在未读（新消息默认未读）
  activeTab.value = 'all'
}

const markAsRead = (id: number) => {
  const msg = messageList.value.find((m) => m.id === id)
  if (msg) {
    msg.isRead = true
    // 如果在未读 Tab 下，标记已读后，该条目会因为 filteredList 的变化而自动移出，配合动画效果
  }
}

const markAllAsRead = () => {
  if (unreadCount.value === 0) return
  messageList.value.forEach((m) => (m.isRead = true))
  ElMessage.success('已全部标记为已读')
}

const deleteMessage = (id: number) => {
  messageList.value = messageList.value.filter((m) => m.id !== id)
  ElMessage.success('删除成功')
}

const clearAllMessages = () => {
  ElMessageBox.confirm('确定清空所有消息吗？此操作无法恢复。', '提示', {
    type: 'warning',
    confirmButtonText: '确定清空',
    cancelButtonText: '取消',
    confirmButtonClass: 'el-button--danger',
  }).then(() => {
    messageList.value = []
    ElMessage.info('消息已清空')
  })
}
</script>

<style scoped lang="scss">
.common-card {
  border: none;
  border-radius: 1rem;
}

/* 列表动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
  /* 离开时绝对定位，保证列表平滑收缩 */
  // position: absolute;
}

/* 自定义 tabs 样式微调，去掉底部灰线 */
:deep(.el-tabs__nav-wrap::after) {
  height: 0;
}

/* 移动端适配：始终显示操作按钮，PC端 hover 显示 */
@media (max-width: 768px) {
  .action-buttons {
    opacity: 1 !important;
  }
}
</style>
