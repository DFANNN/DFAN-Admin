<template>
  <div class="home-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <div class="welcome-avatar">
          <img :src="userStore.userInfo?.avatar" alt="用户头像" />
        </div>
        <div class="welcome-text">
          <h1 class="welcome-title">欢迎回来，<span class="username">管理员</span> 👋</h1>
          <p class="welcome-desc">今天是 {{ currentDate }}，祝您工作愉快！</p>
        </div>
      </div>
      <div class="welcome-actions">
        <el-button type="primary" :icon="Plus">新建项目</el-button>
        <el-button :icon="Document">查看文档</el-button>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card" shadow="hover" v-for="stat in stats" :key="stat.title">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-trend" :class="stat.trend.type">
              <el-icon>
                <component :is="stat.trend.type === 'up' ? ArrowUp : ArrowDown" />
              </el-icon>
              <span>{{ stat.trend.value }}</span>
            </div>
          </div>
          <div class="stat-icon" :style="{ background: stat.color }">
            <el-icon :size="32">
              <component :is="stat.icon" />
            </el-icon>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-grid">
      <!-- 左侧：快捷操作 -->
      <el-card class="quick-actions-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon><Lightning /></el-icon>
            <span>快捷操作</span>
          </div>
        </template>
        <div class="quick-actions">
          <div
            class="action-item"
            v-for="action in quickActions"
            :key="action.title"
            @click="handleAction(action)"
          >
            <div class="action-icon" :style="{ background: action.color }">
              <el-icon :size="20">
                <component :is="action.icon" />
              </el-icon>
            </div>
            <div class="action-info">
              <div class="action-title">{{ action.title }}</div>
              <div class="action-desc">{{ action.desc }}</div>
            </div>
            <el-icon class="action-arrow"><ArrowRight /></el-icon>
          </div>
        </div>
      </el-card>

      <!-- 右侧：最近活动 -->
      <el-card class="recent-activity-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon><Clock /></el-icon>
            <span>最近活动</span>
          </div>
        </template>
        <div class="activity-list">
          <div class="activity-item" v-for="activity in activities" :key="activity.id">
            <div class="activity-avatar">
              <el-avatar :size="40" :style="{ background: activity.color }">
                <el-icon>
                  <component :is="activity.icon" />
                </el-icon>
              </el-avatar>
            </div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <el-card class="chart-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据概览</span>
        </div>
      </template>
      <div class="chart-placeholder">
        <el-icon :size="64" class="chart-icon">
          <DataAnalysis />
        </el-icon>
        <p>图表区域（可集成 ECharts 或其他图表库）</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import {
  Plus,
  Document,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Lightning,
  Clock,
  DataAnalysis,
  User,
  ShoppingCart,
  Money,
  TrendCharts,
  Setting,
  Files,
  Bell,
  Message,
  DocumentAdd,
} from '@element-plus/icons-vue'

defineOptions({ name: 'HomeView' })

const userStore = useUserStore()

// 当前日期
const currentDate = computed(() => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekday = weekdays[date.getDay()]
  return `${year}年${month}月${day}日 ${weekday}`
})

// 统计数据
const stats = ref([
  {
    title: '总用户数',
    value: '12,345',
    trend: { type: 'up', value: '+12.5%' },
    icon: User,
    color: 'var(--el-color-primary)',
  },
  {
    title: '今日订单',
    value: '1,234',
    trend: { type: 'up', value: '+8.2%' },
    icon: ShoppingCart,
    color: '#10B981',
  },
  {
    title: '总收入',
    value: '¥89,234',
    trend: { type: 'up', value: '+15.3%' },
    icon: Money,
    color: '#F59E0B',
  },
  {
    title: '增长率',
    value: '23.5%',
    trend: { type: 'down', value: '-2.1%' },
    icon: TrendCharts,
    color: '#EF4444',
  },
])

// 快捷操作
const quickActions = ref([
  {
    title: '系统设置',
    desc: '配置系统参数',
    icon: Setting,
    color: 'var(--el-color-primary)',
  },
  {
    title: '文件管理',
    desc: '查看和管理文件',
    icon: Files,
    color: '#10B981',
  },
  {
    title: '消息通知',
    desc: '查看最新消息',
    icon: Bell,
    color: '#F59E0B',
  },
  {
    title: '新建文档',
    desc: '创建新文档',
    icon: DocumentAdd,
    color: '#6366F1',
  },
])

// 最近活动
const activities = ref([
  {
    id: 1,
    title: '用户 张三 创建了新订单',
    time: '2 分钟前',
    icon: ShoppingCart,
    color: 'var(--el-color-primary)',
  },
  {
    id: 2,
    title: '系统更新了配置',
    time: '15 分钟前',
    icon: Setting,
    color: '#10B981',
  },
  {
    id: 3,
    title: '收到新的消息',
    time: '1 小时前',
    icon: Message,
    color: '#F59E0B',
  },
  {
    id: 4,
    title: '用户 李四 完成了任务',
    time: '2 小时前',
    icon: User,
    color: '#6366F1',
  },
])

// 处理快捷操作
interface QuickAction {
  title: string
  desc: string
  icon: Component
  color: string
}

const handleAction = (action: QuickAction) => {
  console.log('执行操作:', action.title)
}
</script>

<style scoped lang="scss">
.home-container {
  background: var(--el-bg-color-page);
  min-height: 100%;
}

// 欢迎区域
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .welcome-content {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 16px;

    .welcome-avatar {
      width: 64px;
      height: 64px;
      overflow: hidden;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }

    .welcome-text {
      flex: 1;
    }

    .welcome-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      margin-bottom: 8px;
      letter-spacing: 0.3px;

      .username {
        color: var(--el-color-primary);
      }
    }

    .welcome-desc {
      font-size: 14px;
      color: var(--el-text-color-regular);
      margin: 0;
    }
  }

  .welcome-actions {
    display: flex;
    gap: 12px;
  }
}

// 统计卡片网格
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  .stat-card {
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid var(--el-border-color-lighter);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    :deep(.el-card__body) {
      padding: 20px;
    }

    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .stat-info {
        flex: 1;

        .stat-title {
          font-size: 14px;
          color: var(--el-text-color-regular);
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--el-text-color-primary);
          margin-bottom: 8px;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;

          &.up {
            color: #10b981;
          }

          &.down {
            color: #ef4444;
          }

          .el-icon {
            font-size: 14px;
          }
        }
      }

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
    }
  }
}

// 内容网格
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

// 卡片通用样式
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);

  .el-icon {
    color: var(--el-color-primary);
  }
}

// 快捷操作卡片
.quick-actions-card {
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);

  :deep(.el-card__body) {
    padding: 16px;
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .action-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 8px;
      background: var(--el-fill-color-light);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: var(--el-fill-color);
        transform: translateX(4px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .action-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        flex-shrink: 0;
      }

      .action-info {
        flex: 1;

        .action-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin-bottom: 4px;
        }

        .action-desc {
          font-size: 13px;
          color: var(--el-text-color-regular);
        }
      }

      .action-arrow {
        color: var(--el-text-color-placeholder);
        transition: all 0.3s ease;
      }

      &:hover .action-arrow {
        color: var(--el-color-primary);
        transform: translateX(4px);
      }
    }
  }
}

// 最近活动卡片
.recent-activity-card {
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);

  :deep(.el-card__body) {
    padding: 16px;
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .activity-avatar {
        flex-shrink: 0;

        :deep(.el-avatar) {
          color: #fff;
        }
      }

      .activity-content {
        flex: 1;

        .activity-title {
          font-size: 14px;
          color: var(--el-text-color-primary);
          margin-bottom: 4px;
        }

        .activity-time {
          font-size: 12px;
          color: var(--el-text-color-placeholder);
        }
      }
    }
  }
}

// 图表卡片
.chart-card {
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);

  .chart-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: var(--el-text-color-placeholder);

    .chart-icon {
      margin-bottom: 16px;
      opacity: 0.5;
    }

    p {
      margin: 0;
      font-size: 14px;
    }
  }
}
</style>
