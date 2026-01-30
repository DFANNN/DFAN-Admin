<!-- 项目卡片组件 基于BaseCard组件封装 组要用于项目简介卡片展示 -->
<template>
  <HoverAnimateWrapper name="lift">
    <BaseCard class="project-card">
      <div class="project-title">
        <div class="project-icon" :style="{ backgroundColor: project.color + '20' }">
          <el-icon size="20">
            <component :is="projectIconComputed" :style="{ color: project.color }" />
          </el-icon>
        </div>
        <div class="title">{{ project.name }}</div>
        <BaseTag :text="projectStatusComputed.text" :type="projectStatusComputed.type" />
      </div>
      <div class="project-description">
        <TextEllipsis :text="project.desc" :line="descLine" />
      </div>

      <div class="project-progress">
        <div class="project-progress-title">
          <span>完成进度</span>
          <span>{{ project.progress }}%</span>
        </div>
        <el-progress
          :percentage="project.progress"
          :color="project.color"
          :show-text="false"
          :stroke-width="6"
        />
      </div>
      <div class="project-footer">
        <div class="project-member">
          <el-avatar
            v-for="avatar in projectMembersComputed"
            :key="avatar.name"
            :src="avatar.avatar"
            :size="24"
            class="avatar"
          />
          <div v-if="extraCount > 0">+{{ extraCount }}</div>
        </div>
        <div class="project-time">{{ project.time }}</div>
      </div>
    </BaseCard>
  </HoverAnimateWrapper>
</template>

<script setup lang="ts">
import type { IProjectItem } from '@/types/profile'

interface IProps {
  project: IProjectItem // 项目信息
  descLine?: number // 项目描述默认展示行数
  avatarLine?: number // 项目成员默认展示个数
}

const props = withDefaults(defineProps<IProps>(), {
  descLine: 2,
  avatarLine: 3,
})

const menuStore = useMenuStore()

// 项目图标计算
const projectIconComputed = computed(() => {
  if (typeof props.project.icon === 'string') return menuStore.iconComponents[props.project.icon]
  return props.project.icon
})

// 项目状态计算
const projectStatusComputed = computed(() => {
  switch (props.project.status) {
    case 'not_started':
      return { type: 'info', text: '待开始' }
    case 'in_progress':
      return { type: 'primary', text: '进行中' }
    case 'completed':
      return { type: 'success', text: '已完成' }
  }
})

// 项目成员计算
const projectMembersComputed = computed(() => {
  // 项目成员为空时返回空数组
  if (!props.project.members) return []
  // 返回指定展示行数的成员
  return props.project.members.slice(0, props.avatarLine)
})

// 剩余成员数量
const extraCount = computed(() => {
  // 项目成员为空时返回0
  if (!props.project.members) return 0
  // 剩余成员数量
  const count = props.project.members.length - props.avatarLine
  return count > 0 ? count : 0
})
</script>

<style scoped lang="scss">
.project-card {
  height: 100%;
  background: var(--el-bg-color-page);
  padding: 0.25rem;
  cursor: pointer;

  .project-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    .project-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
    }
    .title {
      font-weight: 700;
    }
  }
  .project-description {
    margin-top: 1rem;
    font-size: 0.875rem;
    color: var(--el-text-color-secondary);
  }
  .project-progress {
    margin-top: 1rem;
    .project-progress-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      color: var(--el-text-color-secondary);
      font-size: 0.75rem;
      font-weight: 600;
    }
  }
  .project-footer {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--el-text-color-placeholder);
    font-size: 0.875rem;
    .project-member {
      display: flex;
      align-items: center;
      .avatar {
        border-width: 2px;
        margin-left: -0.625rem;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
