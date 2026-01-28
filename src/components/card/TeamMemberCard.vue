<!-- 团队成员卡片 -->
<template>
  <BaseCard :title="title" :titleIcon="titleIcon">
    <el-scrollbar :height="height">
      <div class="team-list">
        <div v-for="item in teamData" :key="item.name">
          <HoverAnimateWrapper name="lift" style="width: 100%" intensity="light">
            <div class="team-item">
              <div class="avatar-wrap">
                <el-avatar :size="40" :src="item.avatar" />
                <span class="status-dot" :class="item.status" />
              </div>

              <div class="member-info">
                <div class="member-name">{{ item.name }}</div>
                <div class="member-role">{{ item.role }}</div>
              </div>

              <div class="action">
                <el-button circle :icon="menuStore.iconComponents['Element:ChatDotRound']" />
              </div>
            </div>
          </HoverAnimateWrapper>
        </div>
      </div>
    </el-scrollbar>
  </BaseCard>
</template>

<script setup lang="ts">
import type { ITeamItem } from '@/types/profile'

const menuStore = useMenuStore()

interface IProps {
  title?: string
  titleIcon?: string | Component
  height?: string | number
  teamData: ITeamItem[]
}

const props = withDefaults(defineProps<IProps>(), {
  title: '团队成员',
  titleIcon: 'HOutline:UserGroupIcon',
  height: '280',
})
</script>

<style scoped lang="scss">
.team-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 1rem;

  .team-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--el-bg-color-page);
    }

    .avatar-wrap {
      position: relative;
      width: 2.5rem;
      height: 2.5rem;

      el-avatar {
        width: 100%;
        height: 100%;
      }

      .status-dot {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 0.625rem;
        height: 0.625rem;
        border-radius: 50%;
        border: 2px solid var(--el-bg-color);

        &.online {
          background-color: var(--el-color-success);
        }

        &.offline {
          background-color: var(--el-color-info);
        }
      }
    }

    .member-info {
      flex: 1;

      .member-name {
        font-size: 0.875rem;
        font-weight: 700;
      }

      .member-role {
        margin-top: 0.25rem;
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }

    .action {
      display: flex;
      align-items: center;
    }
  }
}
</style>
