<template>
  <div class="home-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-glow"></div>
      <div class="welcome-body">
        <div class="welcome-left">
          <div class="welcome-avatar">
            <img :src="userStore.userInfo?.avatar" alt="用户头像" />
          </div>
          <div class="welcome-text">
            <h1 class="welcome-title">
              欢迎回来，<span class="username">{{ userName }}</span> 👋
            </h1>
            <p class="welcome-desc">今天是 {{ currentDate }}，祝您工作愉快！</p>
            <div class="welcome-tags">
              <div class="tag">
                <el-icon>
                  <component :is="menuStore.iconComponents['HSolid:IdentificationIcon']" />
                </el-icon>
                <span>{{ userRoleName }}</span>
              </div>
              <div class="tag">
                <el-icon>
                  <component :is="menuStore.iconComponents['HSolid:ClockIcon']" />
                </el-icon>
                <span>高效模式已开启</span>
              </div>
            </div>
          </div>
        </div>
        <div class="welcome-right">
          <div class="highlight-card">
            <div class="highlight-title">今日关键</div>
            <div class="highlight-values">
              <div class="highlight-value">
                <span class="label">未读消息</span>
                <span class="value">{{ unreadCount }}</span>
              </div>
              <div class="highlight-value">
                <span class="label">待办事项</span>
                <span class="value">{{ todoStats.unread }}</span>
              </div>
            </div>
            <div class="highlight-footer">保持专注，快速处理即可清空待办</div>
          </div>
        </div>
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
                <component
                  :is="
                    menuStore.iconComponents[
                      stat.trend.type === 'up'
                        ? 'HOutline:ArrowTrendingUpIcon'
                        : 'HOutline:ArrowTrendingDownIcon'
                    ]
                  "
                />
              </el-icon>
              <span>{{ stat.trend.value }}</span>
            </div>
          </div>
          <div class="stat-icon" :style="{ background: stat.color }">
            <el-icon :size="32">
              <component :is="menuStore.iconComponents[stat.icon]" />
            </el-icon>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 快捷操作 & 待办 -->
    <div class="content-grid">
      <el-card class="quick-actions-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon><component :is="menuStore.iconComponents['HSolid:BoltIcon']" /></el-icon>
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
                <component :is="menuStore.iconComponents[action.icon]" />
              </el-icon>
            </div>
            <div class="action-info">
              <div class="action-title">{{ action.title }}</div>
              <div class="action-desc">{{ action.desc }}</div>
            </div>
            <el-icon class="action-arrow">
              <component :is="menuStore.iconComponents['HOutline:ChevronRightIcon']" />
            </el-icon>
          </div>
        </div>
      </el-card>

      <el-card class="todo-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon><component :is="menuStore.iconComponents['HSolid:ClockIcon']" /></el-icon>
            <span>待办事项</span>
          </div>
        </template>
        <div class="todo-summary">
          <div class="todo-number">
            <div class="todo-value">{{ todoStats.total }}</div>
            <div class="todo-label">待处理</div>
          </div>
          <div class="todo-number">
            <div class="todo-value">{{ todoStats.unread }}</div>
            <div class="todo-label">未读</div>
          </div>
          <div class="todo-number">
            <div class="todo-value">{{ todoStats.finished }}</div>
            <div class="todo-label">已处理</div>
          </div>
        </div>
        <div class="todo-list">
          <div class="todo-item" v-for="todo in todoList" :key="todo.id">
            <div class="todo-icon">
              <el-icon
                ><component :is="menuStore.iconComponents['HSolid:ClipboardDocumentCheckIcon']"
              /></el-icon>
            </div>
            <div class="todo-info">
              <div class="todo-title">{{ todo.title }}</div>
              <div class="todo-time">{{ todo.time }}</div>
            </div>
            <el-tag size="small" type="warning" v-if="!todo.read">待处理</el-tag>
            <el-tag size="small" type="success" v-else>已处理</el-tag>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 最近动态 -->
    <el-card class="recent-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon
            ><component :is="menuStore.iconComponents['HSolid:ChartBarSquareIcon']"
          /></el-icon>
          <span>最近动态</span>
        </div>
      </template>
      <div class="activity-list wide">
        <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
          <div class="activity-avatar">
            <el-avatar :size="44" :style="{ background: activity.color }">
              <el-icon>
                <component :is="menuStore.iconComponents[activity.icon]" />
              </el-icon>
            </el-avatar>
          </div>
          <div class="activity-content">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
          <el-tag size="small" type="info">{{ activity.type }}</el-tag>
        </div>
      </div>
    </el-card>

    <!-- 消息 & 趋势 -->
    <div class="content-grid">
      <el-card class="messages-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon><component :is="menuStore.iconComponents['HSolid:BellAlertIcon']" /></el-icon>
            <span>消息通知</span>
          </div>
        </template>
        <div class="messages-summary">
          <div class="messages-value">{{ unreadCount }}</div>
          <div class="messages-label">未读消息</div>
          <el-button text type="primary" @click="goTo('/profile')">查看全部</el-button>
        </div>
        <div class="messages-list">
          <div class="message-item" v-for="msg in latestMessages" :key="msg.id">
            <div class="message-dot" :class="{ unread: !msg.read }"></div>
            <div class="message-info">
              <div class="message-title">{{ msg.title }}</div>
              <div class="message-time">{{ msg.time }}</div>
            </div>
            <el-tag size="small" :type="msg.read ? 'success' : 'warning'">
              {{ msg.read ? '已读' : '未读' }}
            </el-tag>
          </div>
        </div>
      </el-card>

      <el-card class="trend-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon
              ><component :is="menuStore.iconComponents['HSolid:ChartBarSquareIcon']"
            /></el-icon>
            <span>用户增长趋势（7天）</span>
          </div>
        </template>
        <div class="trend-chart">
          <div class="trend-row" v-for="item in trendData" :key="item.label">
            <div class="trend-label">{{ item.label }}</div>
            <div class="trend-bar-wrap">
              <div class="trend-bar" :style="{ width: item.percent + '%' }"></div>
            </div>
            <div class="trend-value">{{ item.value }}</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { userPage } from '@/api/user'
import { rolePage } from '@/api/role'
import { menuPage } from '@/api/menu'
import type { IMenuItem } from '@/types/system/menu'

defineOptions({ name: 'HomeView' })

const router = useRouter()
const userStore = useUserStore()
const menuStore = useMenuStore()

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

const userName = computed(
  () => userStore.userInfo?.name || userStore.userInfo?.username || '管理员',
)

// 用户角色名称
const userRoleName = computed(() => {
  return userStore.roleList.find((role) => role.id === userStore.userInfo?.roleId)?.name ?? '无权限'
})

// 统计数据
const stats = ref([
  {
    title: '用户总数',
    value: '--',
    trend: { type: 'up', value: '+0' },
    icon: 'HSolid:UserGroupIcon',
    color: 'var(--el-color-primary)',
  },
  {
    title: '角色数量',
    value: '--',
    trend: { type: 'up', value: '+0' },
    icon: 'HSolid:ShieldCheckIcon',
    color: '#10B981',
  },
  {
    title: '菜单数量',
    value: '--',
    trend: { type: 'up', value: '+0' },
    icon: 'HSolid:Squares2X2Icon',
    color: '#F59E0B',
  },
  {
    title: '未读消息',
    value: '--',
    trend: { type: 'up', value: '待处理' },
    icon: 'HSolid:BellAlertIcon',
    color: '#EF4444',
  },
])

// 快捷操作
const quickActions = ref([
  {
    title: '用户管理',
    desc: '管理系统用户',
    icon: 'HSolid:UserPlusIcon',
    color: 'var(--el-color-primary)',
    path: '/system/user',
  },
  {
    title: '角色管理',
    desc: '分配权限角色',
    icon: 'HSolid:UserGroupIcon',
    color: '#10B981',
    path: '/system/role',
  },
  {
    title: '菜单管理',
    desc: '配置菜单权限',
    icon: 'HSolid:WrenchScrewdriverIcon',
    color: '#F59E0B',
    path: '/system/menu',
  },
  {
    title: '个人中心',
    desc: '查看个人信息与消息',
    icon: 'HSolid:UserCircleIcon',
    color: '#6366F1',
    path: '/profile',
  },
])

// 待办事项（复用 userMessages 中的 todo）
const todoList = computed(() =>
  userStore.userMessages
    .filter((item) => item.type === 'todo')
    .sort((a, b) => dayjs(b.time).valueOf() - dayjs(a.time).valueOf())
    .slice(0, 4),
)

const todoStats = computed(() => {
  const total = userStore.userMessages.filter((msg) => msg.type === 'todo').length
  const unread = userStore.userMessages.filter((msg) => msg.type === 'todo' && !msg.read).length
  const finished = total - unread
  return { total, unread, finished }
})

// 消息
const unreadCount = computed(() => userStore.unreadCount)
const latestMessages = computed(() =>
  [...userStore.userMessages]
    .sort((a, b) => dayjs(b.time).valueOf() - dayjs(a.time).valueOf())
    .slice(0, 5),
)

// 最近动态
const recentActivities = ref<
  { id: string; title: string; time: string; icon: string; color: string; type: string }[]
>([])

// 用户增长趋势
const trendData = ref<{ label: string; value: number; percent: number }[]>([])

// 路由跳转
const goTo = (path: string) => {
  router.push(path)
}

// 处理快捷操作
interface QuickAction {
  title: string
  desc: string
  icon: string
  color: string
  path?: string
}

const handleAction = (action: QuickAction) => {
  if (action.path) {
    router.push(action.path)
  }
}

// 加载数据
const loadDashboardData = async () => {
  const [userRes, roleRes, menuRes] = await Promise.all([
    userPage({ page: 1, pageSize: 100, username: '', name: '', sortOrder: 'desc' }),
    rolePage({ page: 1, pageSize: 100, sortOrder: 'desc' }),
    menuPage(),
  ])

  // 用户
  const userList = userRes.data.data?.list ?? []
  const userTotal = userRes.data.data?.total ?? 0
  const todayNew = userList.filter((item) => dayjs(item.createTime).isSame(dayjs(), 'day')).length

  // 角色
  const roleList = roleRes.data.data?.list ?? []
  const roleTotal = roleRes.data.data?.total ?? 0

  // 菜单
  const menuList: IMenuItem[] = menuRes.data.data ?? []
  const flattenMenu = (menus: IMenuItem[]): IMenuItem[] =>
    menus.reduce<IMenuItem[]>((acc, cur) => {
      acc.push(cur)
      if (cur.children?.length) acc.push(...flattenMenu(cur.children))
      return acc
    }, [])
  const menuTotal = flattenMenu(menuList).length

  // 最近动态（用户、角色）
  const recentUsers = [...userList]
    .sort((a, b) => dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf())
    .slice(0, 3)
    .map((u) => ({
      id: `user-${u.id}`,
      title: `新用户：${u.name || u.username}`,
      time: u.createTime || '刚刚',
      icon: 'HSolid:UserCircleIcon',
      color: 'var(--el-color-primary)',
      type: '用户',
    }))

  const recentRoles = [...roleList]
    .sort((a, b) => dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf())
    .slice(0, 2)
    .map((r) => ({
      id: `role-${r.id}`,
      title: `新角色：${r.name}`,
      time: r.createTime || '刚刚',
      icon: 'HSolid:ShieldCheckIcon',
      color: '#10B981',
      type: '角色',
    }))

  recentActivities.value = [...recentUsers, ...recentRoles]

  // 用户趋势（最近7天新增）
  const last7Days = Array.from({ length: 7 })
    .map((_, idx) => dayjs().subtract(6 - idx, 'day'))
    .map((day) => {
      const count = userList.filter((u) => dayjs(u.createTime).isSame(day, 'day')).length
      return { label: day.format('MM-DD'), value: count }
    })
  const maxValue = Math.max(...last7Days.map((i) => i.value), 1)
  trendData.value = last7Days.map((i) => ({
    ...i,
    percent: Math.round((i.value / maxValue) * 100),
  }))

  // 统计卡片
  stats.value = [
    {
      title: '用户总数',
      value: formatNumber(userTotal),
      trend: { type: todayNew >= 0 ? 'up' : 'down', value: `今日 +${todayNew}` },
      icon: 'HSolid:UserGroupIcon',
      color: 'var(--el-color-primary)',
    },
    {
      title: '角色数量',
      value: formatNumber(roleTotal),
      trend: { type: 'up', value: '最新角色' },
      icon: 'HSolid:ShieldCheckIcon',
      color: '#10B981',
    },
    {
      title: '菜单数量',
      value: formatNumber(menuTotal),
      trend: { type: 'up', value: '含子菜单' },
      icon: 'HSolid:Squares2X2Icon',
      color: '#F59E0B',
    },
    {
      title: '未读消息',
      value: formatNumber(unreadCount.value),
      trend: { type: unreadCount.value > 0 ? 'up' : 'down', value: `${unreadCount.value} 条` },
      icon: 'HSolid:BellAlertIcon',
      color: '#EF4444',
    },
  ]
}

const formatNumber = (num: number) => {
  return num > 9999 ? `${(num / 10000).toFixed(1)}w` : `${num}`
}

onMounted(async () => {
  if (!userStore.userInfo) {
    await userStore.getUserInfo()
  }
  await loadDashboardData()
})
</script>

<style scoped lang="scss">
.home-container {
  background: var(--el-bg-color-page);
  min-height: 100%;
}

// 欢迎区域
.welcome-section {
  position: relative;
  overflow: hidden;
  margin-bottom: 24px;
  padding: 24px;
  border-radius: 14px;
  background:
    radial-gradient(
      circle at 20% 20%,
      color-mix(in srgb, var(--el-color-primary) 12%, transparent) 0,
      transparent 45%
    ),
    radial-gradient(
      circle at 80% 0%,
      color-mix(in srgb, #10b981 10%, transparent) 0,
      transparent 40%
    ),
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--el-color-primary) 16%, var(--el-bg-color) 84%),
      var(--el-bg-color)
    );
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);

  .welcome-glow {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        circle at 30% 50%,
        color-mix(in srgb, var(--el-color-primary) 8%, transparent) 0,
        transparent 45%
      ),
      radial-gradient(
        circle at 80% 50%,
        color-mix(in srgb, #10b981 10%, transparent) 0,
        transparent 40%
      );
    filter: blur(24px);
    opacity: 0.7;
    pointer-events: none;
  }

  .welcome-body {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 18px;
    align-items: stretch;
    z-index: 1;
  }

  .welcome-left {
    display: flex;
    gap: 16px;
    align-items: center;

    .welcome-avatar {
      width: 72px;
      height: 72px;
      overflow: hidden;
      border-radius: 50%;
      border: 1px solid color-mix(in srgb, var(--el-color-primary) 25%, transparent);
      background: #fff;
      box-shadow: 0 10px 26px color-mix(in srgb, var(--el-color-primary) 20%, transparent);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }

    .welcome-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .welcome-title {
      font-size: 30px;
      font-weight: 800;
      color: var(--el-text-color-primary);
      margin: 0;
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

    .welcome-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 10px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--el-color-primary) 8%, var(--el-bg-color));
        border: 1px solid color-mix(in srgb, var(--el-color-primary) 16%, transparent);
        color: var(--el-text-color-primary);
        font-size: 12px;

        .el-icon {
          color: var(--el-color-primary);
        }
      }
    }
  }

  .welcome-right {
    display: flex;
    align-items: stretch;

    .highlight-card {
      flex: 1;
      background: color-mix(in srgb, var(--el-bg-color) 70%, var(--el-color-primary) 30%);
      border-radius: 12px;
      padding: 16px;
      border: 1px solid color-mix(in srgb, var(--el-color-primary) 24%, transparent);
      box-shadow: 0 10px 26px color-mix(in srgb, var(--el-color-primary) 15%, transparent);
      display: flex;
      flex-direction: column;
      gap: 12px;

      .highlight-title {
        font-size: 14px;
        font-weight: 700;
        color: var(--el-text-color-primary);
      }

      .highlight-values {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 10px;

        .highlight-value {
          padding: 12px;
          border-radius: 10px;
          background: var(--el-bg-color);
          border: 1px solid var(--el-border-color-lighter);
          display: flex;
          justify-content: space-between;
          align-items: center;

          .label {
            color: var(--el-text-color-regular);
            font-size: 12px;
          }

          .value {
            font-size: 20px;
            font-weight: 800;
            color: var(--el-color-primary);
          }
        }
      }

      .highlight-footer {
        font-size: 12px;
        color: var(--el-text-color-regular);
      }
    }
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

.todo-card {
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);

  :deep(.el-card__body) {
    padding: 16px;
  }

  .todo-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
    margin-bottom: 12px;

    .todo-number {
      padding: 12px;
      background: var(--el-fill-color-light);
      border-radius: 8px;
      text-align: center;
      border: 1px solid var(--el-border-color-lighter);

      .todo-value {
        font-size: 22px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        margin-bottom: 4px;
      }

      .todo-label {
        font-size: 12px;
        color: var(--el-text-color-regular);
      }
    }
  }

  .todo-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .todo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      background: var(--el-bg-color);
      border: 1px solid var(--el-border-color-lighter);

      .todo-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: color-mix(in srgb, var(--el-color-primary) 12%, transparent);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--el-color-primary);
      }

      .todo-info {
        flex: 1;

        .todo-title {
          font-size: 14px;
          color: var(--el-text-color-primary);
          margin-bottom: 4px;
        }

        .todo-time {
          font-size: 12px;
          color: var(--el-text-color-placeholder);
        }
      }
    }
  }
}

.recent-card {
  margin-bottom: 24px;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);

  :deep(.el-card__body) {
    padding: 16px;
  }
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 14px;

  &.wide .activity-item {
    padding: 12px 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: 12px;

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

.messages-card,
.trend-card {
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);

  :deep(.el-card__body) {
    padding: 16px;
  }
}

.messages-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  .messages-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--el-color-primary);
  }

  .messages-label {
    color: var(--el-text-color-primary);
  }
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .message-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-lighter);

    .message-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--el-border-color);

      &.unread {
        background: var(--el-color-primary);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--el-color-primary) 20%, transparent);
      }
    }

    .message-info {
      flex: 1;

      .message-title {
        font-size: 14px;
        color: var(--el-text-color-primary);
        margin-bottom: 4px;
      }

      .message-time {
        font-size: 12px;
        color: var(--el-text-color-placeholder);
      }
    }
  }
}

.trend-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .trend-row {
    display: grid;
    grid-template-columns: 70px 1fr 50px;
    align-items: center;
    gap: 10px;

    .trend-label {
      font-size: 12px;
      color: var(--el-text-color-regular);
    }

    .trend-bar-wrap {
      background: var(--el-fill-color-light);
      border-radius: 999px;
      overflow: hidden;
      height: 8px;
      border: 1px solid var(--el-border-color-lighter);

      .trend-bar {
        height: 100%;
        background: linear-gradient(
          90deg,
          var(--el-color-primary),
          var(--el-color-primary-light-5)
        );
      }
    }

    .trend-value {
      font-size: 12px;
      color: var(--el-text-color-primary);
      text-align: right;
    }
  }
}
</style>
