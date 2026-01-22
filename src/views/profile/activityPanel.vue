<template>
  <!-- 动态 -->
  <div>
    <el-card class="common-card" shadow="never">
      <div class="flex items-center gap-4">
        <el-avatar :size="32" :src="userStore.userInfo?.avatar" />
        <span class="text-sm font-medium text-(--el-text-color-secondary)"
          >Hi, {{ userStore.userInfo?.name }}，今天有什么新的技术发现？</span
        >
      </div>
      <el-input
        v-model="postContent"
        :rows="3"
        type="textarea"
        placeholder="在此分享技术心得或项目周报..."
        class="mt-4"
      />
      <div class="flex items-center justify-between mt-4">
        <div class="flex items-center gap-4">
          <IconButton icon="HOutline:PhotoIcon" tooltip="上传图片" />
          <IconButton icon="HOutline:CodeBracketIcon" tooltip="插入代码" />
          <IconButton icon="HOutline:FaceSmileIcon" tooltip="表情" />
        </div>
        <el-button type="primary" round>发布动态</el-button>
      </div>
    </el-card>
    <el-card
      class="common-card mt-4"
      shadow="never"
      v-for="(act, index) in activityList"
      :key="index"
    >
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-4">
          <el-avatar :size="44" :src="act.userAvatar" />
          <div>
            <div>{{ act.userName }}</div>
            <div class="text-xs text-(--el-text-color-secondary) mt-1">
              于 {{ act.time }} 发布了 {{ act.type }}
            </div>
          </div>
        </div>
        <IconButton icon="HOutline:EllipsisHorizontalIcon" />
      </div>
      <div>
        <p class="text-[15px] mb-4 text-(--el-text-color-regular)">{{ act.content }}</p>
        <img
          v-if="act.image"
          :src="act.image"
          alt="image"
          class="w-full max-h-87.5 rounded-2xl object-cover"
        />
      </div>
      <el-divider />
      <div class="flex items-center justify-between">
        <div class="flex gap-4">
          <div
            class="flex items-center gap-2 text-(--el-text-color-secondary) cursor-pointer hover:text-(--el-color-primary)"
          >
            <el-icon size="18">
              <component :is="menuStore.iconComponents['HOutline:HeartIcon']" />
            </el-icon>
            <span class="text-sm">{{ act.likes }}</span>
          </div>
          <div
            class="flex items-center gap-2 text-(--el-text-color-secondary) cursor-pointer hover:text-(--el-color-primary)"
          >
            <el-icon size="18">
              <component :is="menuStore.iconComponents['HOutline:ChatBubbleBottomCenterIcon']" />
            </el-icon>
            <span class="text-sm">{{ act.comments }}</span>
          </div>
        </div>
        <IconButton icon="HOutline:ShareIcon" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const menuStore = useMenuStore()

const postContent = ref('')

// 动态列表
const activityList = ref([
  {
    userName: '张小帅',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    time: '15 分钟前',
    type: '技术分享',
    content:
      '今天深入研究了 Vue3 的 Diff 算法，发现了一些有趣的优化点。特别是在处理长列表更新时，Key 的合理使用能极大减少 Patch 次数。',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    likes: 128,
    comments: 24,
  },
  {
    userName: '李思思',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucille',
    time: '2 小时前',
    type: '设计稿更新',
    content: '后台系统 3.0 的 UI 套件已经上传到 Figma 仓库，请大家根据新的色值规范进行组件适配。',
    image: null,
    likes: 56,
    comments: 12,
  },
  {
    userName: '张小帅',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    time: '昨天 18:30',
    type: '周报发布',
    content:
      '本周完成了权限管理系统的重构，修复了 12 个历史遗留的 CSS 兼容性问题，目前系统在 Safari 下的表现已经趋于稳定。',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    likes: 89,
    comments: 3,
  },
])
</script>

<style scoped lang="scss">
.common-card {
  border: none;
  border-radius: 1rem;
}
</style>
