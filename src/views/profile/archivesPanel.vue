<!-- 详细档案 -->
<template>
  <BaseCard title="详细档案" title-icon="HOutline:IdentificationIcon">
    <div>
      <div class="info-cell">
        <label>账号ID</label>
        <span>{{ userStore.userInfo?.id }}</span>
      </div>
      <div class="info-cell">
        <label>账号状态</label>
        <span>{{ userStore.userInfo?.status === 'active' ? '启用' : '禁用' }}</span>
      </div>
      <div class="info-cell">
        <label>加入时间</label>
        <span>{{ userStore.userInfo?.createTime }}</span>
      </div>
      <div class="info-cell">
        <label>联系邮箱</label>
        <span>{{ userStore.userInfo?.email || '暂无邮箱~' }}</span>
      </div>

      <el-divider />

      <div>
        <div class="text-sm font-bold text-(--el-text-color-secondary) mb-2">个人标签</div>
        <div class="flex flex-wrap gap-2" v-if="skills.length">
          <BaseTag
            v-for="skill in skills"
            :key="skill.name"
            :type="skill.type"
            :text="skill.name"
          />
        </div>
        <div class="text-sm" v-else>暂无标签~</div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
const userStore = useUserStore()

type TagType = 'success' | 'info' | 'warning' | 'danger' | 'primary'

// 技能标签
const skills = computed(() => {
  const tags = userStore.userInfo?.tags
  if (!tags) return []
  return tags.split(',').map((tag) => ({
    name: tag.trim(),
    // 随机type
    type: ['success', 'info', 'warning', 'danger', 'primary'][
      Math.floor(Math.random() * 5)
    ] as TagType,
  }))
})
</script>

<style scoped lang="scss">
.info-cell {
  margin-bottom: 1.25rem;
  label {
    display: block;
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin-bottom: 0.25rem;
  }
  span {
    font-size: 14px;
    font-weight: 600;
  }
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
