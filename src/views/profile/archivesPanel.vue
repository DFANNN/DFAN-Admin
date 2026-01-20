<template>
  <!-- 详细档案 -->
  <el-card shadow="never" class="archives-panel-card">
    <template #header>
      <div class="flex items-center gap-3">
        <el-icon>
          <component :is="menuStore.iconComponents['HOutline:IdentificationIcon']" />
        </el-icon>
        <span>详细档案</span>
      </div>
    </template>
    <div>
      <div class="info-cell">
        <label>账号ID</label>
        <span>{{ userStore.userInfo?.id }}</span>
      </div>
      <div class="info-cell">
        <label>账号状态</label>
        <span>{{ userStore.userInfo?.status }}</span>
      </div>
      <div class="info-cell">
        <label>加入时间</label>
        <span>{{ userStore.userInfo?.createTime }}</span>
      </div>
      <div class="info-cell">
        <label>联系邮箱</label>
        <span>{{ userStore.userInfo?.email ?? '未设置' }}</span>
      </div>

      <el-divider />

      <div class="flex flex-wrap gap-2">
        <el-tag v-for="skill in skills" :key="skill.name" :type="skill.type">{{
          skill.name
        }}</el-tag>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
const menuStore = useMenuStore()
const userStore = useUserStore()

type TagType = 'success' | 'info' | 'warning' | 'danger' | 'primary'

// 技能标签
const skills = ref<{ name: string; type: TagType }[]>([
  { name: 'Vue 3.x', type: 'primary' },
  { name: 'TypeScript', type: 'success' },
  { name: 'Element Plus', type: 'warning' },
  { name: 'SCSS/Less', type: 'info' },
  { name: 'Node.js', type: 'danger' },
  { name: 'Docker', type: 'primary' },
  { name: 'Micro-Frontend', type: 'success' },
])
</script>

<style scoped lang="scss">
.el-icon {
  font-size: 1.25rem;
  color: var(--el-color-primary);
}

.archives-panel-card {
  border: none;
  border-radius: 1rem;
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.info-cell {
  margin-bottom: 1.25rem;
  label {
    display: block;
    font-size: 0.75rem;
    color: var(--el-text-color-secondary);
    margin-bottom: 0.25rem;
  }
  span {
    font-size: 15px;
    font-weight: 600;
  }
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
