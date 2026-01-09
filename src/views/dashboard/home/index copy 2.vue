<template>
  <div class="workbench-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration-orange"></div>
    <div class="bg-decoration-blue"></div>
    <div class="bg-decoration-purple"></div>

    <div class="workbench-content">
      <!-- 顶部：一体化超级欢迎看板 -->
      <el-row :gutter="20" class="row-gap">
        <el-col :span="24">
          <el-card class="hero-card" shadow="never">
            <div class="hero-inner">
              <!-- 左侧：欢迎与丰富信息 -->
              <div class="hero-left">
                <div class="welcome-section">
                  <div class="user-info-box">
                    <HoverAnimateWrapper name="scale" intensity="light">
                      <el-avatar
                        :size="80"
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        class="hero-avatar"
                      />
                    </HoverAnimateWrapper>
                    <div class="text-content">
                      <h2 class="greeting">
                        {{ userName }}，欢迎回来！
                        <span class="wave">👋</span>
                      </h2>
                      <p class="motto">“ 凡事豫则立，不豫则废。” —— 开启您高效的一天。</p>
                      <div class="info-badges">
                        <div class="info-tag weather">
                          <el-icon><Orange /></el-icon>
                          <span>晴 22℃</span>
                        </div>
                        <div class="info-tag location">
                          <el-icon><Monitor /></el-icon>
                          <span>上海 · 研发中心</span>
                        </div>
                        <div class="info-tag date">
                          <el-icon><Calendar /></el-icon>
                          <span>2026年1月8日</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="hero-lottie-container">
                    <LottieAnimation :animationData="helloLottie" :width="180" :height="140" />
                  </div>
                </div>

                <!-- 新增：丰富内容区 -->
                <div class="hero-rich-content">
                  <div class="rich-item">
                    <div class="item-label">今日任务进度</div>
                    <div class="item-value-box">
                      <span class="current">12</span><span class="total">/ 16</span>
                      <el-progress
                        :percentage="75"
                        :stroke-width="8"
                        color="#6366f1"
                        class="mini-progress"
                      />
                    </div>
                  </div>
                  <el-divider direction="vertical" />
                  <div class="rich-item">
                    <div class="item-label">待处理审批</div>
                    <div class="item-value-box">
                      <span class="highlight">4</span><span class="unit">个任务</span>
                      <div class="avatar-stack-mini">
                        <el-avatar
                          :size="20"
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=1"
                        />
                        <el-avatar
                          :size="20"
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=2"
                        />
                        <span class="more">+2</span>
                      </div>
                    </div>
                  </div>
                  <el-divider direction="vertical" />
                  <div class="rich-item">
                    <div class="item-label">团队活跃度</div>
                    <div class="item-value-box">
                      <span class="highlight">98%</span>
                      <span class="status-badge">High</span>
                    </div>
                  </div>
                </div>

                <div class="hero-actions">
                  <el-button type="primary" size="large" round class="btn-main">
                    工作台概览 <el-icon class="el-icon--right"><Right /></el-icon>
                  </el-button>
                  <el-button size="large" round class="btn-sub">任务管理</el-button>
                  <el-button size="large" circle class="btn-icon"
                    ><el-icon><Notification /></el-icon
                  ></el-button>
                </div>
              </div>

              <!-- 中间装饰分割 -->
              <div class="hero-divider"></div>

              <!-- 右侧：集成核心指标 -->
              <div class="hero-right">
                <div class="stats-integrated-grid">
                  <div v-for="item in statCards" :key="item.label" class="integrated-stat-item">
                    <div
                      class="stat-icon"
                      :style="{ color: item.color, backgroundColor: item.color + '10' }"
                    >
                      <el-icon><component :is="item.icon" /></el-icon>
                    </div>
                    <div class="stat-info">
                      <div class="stat-label">{{ item.label }}</div>
                      <div class="stat-value-wrap">
                        <span class="stat-value">{{ item.value }}</span>
                        <span class="stat-trend" :class="item.trendType">
                          {{ item.trend }}
                        </span>
                      </div>
                    </div>
                    <div class="stat-mini-chart">
                      <VChart class="mini-v-chart" :option="item.chartOption" autoresize />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 中部主要内容 -->
      <el-row :gutter="20">
        <!-- 左侧：项目与动态 -->
        <el-col :xs="24" :lg="16">
          <!-- 正在进行的项目 -->
          <el-card class="modern-card project-section" shadow="never">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon class="header-icon"><Collection /></el-icon>
                  <span class="title">正在进行的项目</span>
                </div>
                <el-button link type="primary">管理所有项目</el-button>
              </div>
            </template>
            <div class="project-grid-premium">
              <div v-for="item in projects" :key="item.id" class="project-item-premium">
                <HoverAnimateWrapper name="lift" intensity="light" class="w-full h-full">
                  <div class="project-inner">
                    <div class="item-header">
                      <div class="icon-wrap" :style="{ backgroundColor: item.color + '15' }">
                        <el-icon :style="{ color: item.color }"
                          ><component :is="item.icon"
                        /></el-icon>
                      </div>
                      <span class="project-name">{{ item.name }}</span>
                    </div>
                    <p class="desc">{{ item.desc }}</p>
                    <div class="progress-wrap">
                      <div class="progress-header">
                        <span>完成进度</span>
                        <span>{{ item.progress }}%</span>
                      </div>
                      <el-progress
                        :percentage="item.progress"
                        :color="item.color"
                        :show-text="false"
                        :stroke-width="6"
                      />
                    </div>
                    <div class="item-footer">
                      <div class="avatar-group">
                        <el-avatar
                          v-for="n in 3"
                          :key="n"
                          :size="24"
                          :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name + n}`"
                        />
                        <div class="more-avatars">+{{ Math.floor(Math.random() * 10) }}</div>
                      </div>
                      <span class="time">{{ item.time }}</span>
                    </div>
                  </div>
                </HoverAnimateWrapper>
              </div>
            </div>
          </el-card>

          <!-- 动态追踪 (仿参考图列表) -->
          <el-card class="modern-card activity-section" shadow="never">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon class="header-icon"><StarFilled /></el-icon>
                  <span class="title">团队动态与最新评价</span>
                </div>
              </div>
            </template>
            <div class="activity-list-premium">
              <div v-for="item in activities" :key="item.id" class="activity-item-premium">
                <div class="user-avatar-box">
                  <el-avatar :size="40" :src="item.avatar" />
                  <div class="status-dot" :class="item.online ? 'online' : ''"></div>
                </div>
                <div class="activity-content">
                  <div class="activity-header">
                    <span class="name">{{ item.name }}</span>
                    <span class="time">{{ item.time }}</span>
                  </div>
                  <div class="activity-body">
                    <span class="action">{{ item.action }}</span>
                    <span class="target">{{ item.target }}</span>
                    <div v-if="item.comment" class="comment-box">"{{ item.comment }}"</div>
                  </div>
                  <div class="activity-footer">
                    <el-tag size="small" :type="item.tagType" effect="plain" round>{{
                      item.tag
                    }}</el-tag>
                    <div class="actions">
                      <el-icon><ChatDotRound /></el-icon>
                      <span>回复</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧：快捷工具与效能 -->
        <el-col :xs="24" :lg="8">
          <!-- 便捷工具 -->
          <el-card class="modern-card shortcut-section" shadow="never">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon class="header-icon"><Monitor /></el-icon>
                  <span class="title">便捷工具</span>
                </div>
              </div>
            </template>
            <div class="shortcut-grid-premium">
              <div v-for="item in shortcuts" :key="item.label" class="shortcut-wrapper">
                <HoverAnimateWrapper name="jelly" intensity="normal">
                  <div class="shortcut-item-premium">
                    <div class="icon-box" :style="{ '--icon-color': item.color }">
                      <el-icon><component :is="item.icon" /></el-icon>
                    </div>
                    <span class="label">{{ item.label }}</span>
                  </div>
                </HoverAnimateWrapper>
              </div>
            </div>
          </el-card>

          <!-- 工作效能分析 -->
          <el-card class="modern-card efficiency-section" shadow="never">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon class="header-icon"><ElPieChart /></el-icon>
                  <span class="title">本周工作效能</span>
                </div>
              </div>
            </template>
            <div class="efficiency-content">
              <div class="chart-wrap-premium">
                <VChart class="chart" :option="efficiencyOption" autoresize />
              </div>
              <div class="efficiency-stats">
                <div class="stat-row">
                  <span class="lab">任务完成率</span>
                  <span class="val">92%</span>
                </div>
                <el-progress :percentage="92" color="#6366f1" :show-text="false" />
                <div class="stat-row mt-12">
                  <span class="lab">代码质量评分</span>
                  <span class="val">A+</span>
                </div>
                <el-progress :percentage="88" color="#10b981" :show-text="false" />
              </div>
            </div>
          </el-card>

          <!-- 团队伙伴 -->
          <el-card class="modern-card team-section" shadow="never">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon class="header-icon"><UserFilled /></el-icon>
                  <span class="title">在线伙伴</span>
                </div>
                <el-button link type="primary"
                  ><el-icon><Plus /></el-icon> 邀请</el-button
                >
              </div>
            </template>
            <div class="team-list-premium">
              <div v-for="item in team" :key="item.name" class="team-item-premium">
                <div class="avatar-wrap">
                  <el-avatar :size="38" :src="item.avatar" />
                  <div class="status-indicator" :class="item.status"></div>
                </div>
                <div class="info">
                  <div class="name">{{ item.name }}</div>
                  <div class="role">{{ item.role }}</div>
                </div>
                <div class="team-actions">
                  <el-button circle size="small"
                    ><el-icon><ChatDotRound /></el-icon
                  ></el-button>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 装饰插画 -->
          <div class="decorative-illustration">
            <img src="@/assets/animals/小狗.svg" alt="decoration" class="floating-img" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { THEME_KEY } from 'vue-echarts'
import LottieAnimation from '@/components/animation/LottieAnimation.vue'
import HoverAnimateWrapper from '@/components/animation/HoverAnimateWrapper.vue'
import helloLottie from '@/assets/lotties/hello.json'
import {
  Collection,
  Monitor,
  Setting,
  User,
  ChatDotRound,
  Notification,
  Document,
  PieChart as ElPieChart,
  Calendar,
  Opportunity,
  VideoPlay,
  Orange,
  Plus,
  Right,
  UserFilled,
  StarFilled,
} from '@element-plus/icons-vue'

// ECharts 核心
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  LineChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

defineOptions({ name: 'WorkbenchView' })

const themeStore = useThemeStore()
provide(
  THEME_KEY,
  computed(() => themeStore.themeMode),
)

const userName = ref('David Fan')

// 核心指标小卡片数据
const statCards = computed(() => [
  {
    label: '本周任务完成',
    value: '52',
    trend: '+12%',
    trendType: 'up',
    color: '#6366f1',
    icon: Calendar,
    chartOption: createMiniLineChart([30, 40, 35, 50, 49, 60, 52], '#6366f1'),
  },
  {
    label: '项目活跃度',
    value: '84%',
    trend: '+5%',
    trendType: 'up',
    color: '#10b981',
    icon: Opportunity,
    chartOption: createMiniLineChart([70, 75, 72, 80, 78, 85, 84], '#10b981'),
  },
  {
    label: '待办处理率',
    value: '92%',
    trend: '-2%',
    trendType: 'down',
    color: '#f59e0b',
    icon: Document,
    chartOption: createMiniLineChart([95, 94, 96, 92, 93, 91, 92], '#f59e0b'),
  },
  {
    label: '团队协作值',
    value: '76',
    trend: '+18%',
    trendType: 'up',
    color: '#ef4444',
    icon: UserFilled,
    chartOption: createMiniLineChart([50, 55, 60, 65, 70, 75, 76], '#ef4444'),
  },
])

function createMiniLineChart(data: number[], color: string) {
  return {
    grid: { left: 0, right: 0, top: 10, bottom: 0 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false },
    series: [
      {
        data,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color, width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: color + '30' },
              { offset: 1, color: 'transparent' },
            ],
          },
        },
      },
    ],
  }
}

// 正在进行的项目
const projects = [
  {
    id: 1,
    name: 'Vue Admin Next',
    desc: '基于 Vue 3 + Element Plus 的中后台管理系统，目前进入 Beta 测试阶段。',
    group: '前端组',
    time: '2025-12-01',
    icon: Monitor,
    color: '#4f46e5',
    progress: 85,
  },
  {
    id: 2,
    name: 'AI 数据中心',
    desc: '利用 LLM 大模型进行深度数据清洗与多维度智能化分析平台。',
    group: '算法组',
    time: '2026-01-05',
    icon: Opportunity,
    color: '#10b981',
    progress: 45,
  },
  {
    id: 3,
    name: 'DFAN 移动端',
    desc: '全新的 React Native 跨平台应用，完美适配 iOS 和 Android。',
    group: '移动组',
    time: '2025-11-20',
    icon: VideoPlay,
    color: '#f59e0b',
    progress: 72,
  },
  {
    id: 4,
    name: '自动化测试云',
    desc: '基于 Playwright 的云端自动化测试框架，大幅提升 CI/CD 交付效率。',
    group: '测试组',
    time: '2026-01-08',
    icon: Setting,
    color: '#ef4444',
    progress: 94,
  },
  {
    id: 5,
    name: '低代码引擎',
    desc: '可视化图形化拖拽搭建工具，支持复杂业务逻辑配置。',
    group: '研发中心',
    time: '2025-10-15',
    icon: Collection,
    color: '#8b5cf6',
    progress: 30,
  },
  {
    id: 6,
    name: '监控告警 2.0',
    desc: '全方位分布式系统性能监控，支持毫秒级异常预警与链路追踪。',
    group: '运维组',
    time: '2026-01-02',
    icon: Notification,
    color: '#06b6d4',
    progress: 68,
  },
]

interface Activity {
  id: number
  name: string
  avatar: string
  action: string
  target: string
  comment?: string
  time: string
  online: boolean
  tag: string
  tagType: 'success' | 'primary' | 'warning' | 'info' | 'danger'
}

// 动态追踪
const activities = ref<Activity[]>([
  {
    id: 1,
    name: '林东东',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky',
    action: '在',
    target: '项目组 007',
    comment: '这个界面的阴影处理得非常棒，很有质感！',
    time: '刚刚',
    online: true,
    tag: 'UI 评价',
    tagType: 'success',
  },
  {
    id: 2,
    name: '张三',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    action: '发表了关于',
    target: 'UI 优化的建议',
    comment: '建议在移动端把侧边栏改为底部导航栏，用户体验会更好。',
    time: '10 分钟前',
    online: false,
    tag: '产品建议',
    tagType: 'primary',
  },
  {
    id: 3,
    name: '李四',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
    action: '提交了代码到',
    target: 'main 分支',
    time: '1 小时前',
    online: true,
    tag: '代码提交',
    tagType: 'warning',
  },
  {
    id: 4,
    name: '王五',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
    action: '创建了新任务',
    target: '周报系统对接',
    time: '3 小时前',
    online: true,
    tag: '任务管理',
    tagType: 'info',
  },
])

const shortcuts = [
  { label: '主页', icon: Monitor, color: '#4f46e5' },
  { label: '管理', icon: Setting, color: '#10b981' },
  { label: '用户', icon: User, color: '#f59e0b' },
  { label: '分析', icon: ElPieChart, color: '#ef4444' },
  { label: '消息', icon: ChatDotRound, color: '#8b5cf6' },
  { label: '文档', icon: Document, color: '#06b6d4' },
  { label: '日程', icon: Calendar, color: '#ec4899' },
  { label: '设置', icon: Orange, color: '#f97316' },
]

const team = [
  {
    name: 'David Fan',
    role: '高级研发工程师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    status: 'online',
  },
  {
    name: 'Alice Zhang',
    role: 'UI 设计师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    status: 'online',
  },
  {
    name: 'Mike Lee',
    role: '产品经理',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    status: 'busy',
  },
  {
    name: 'Sarah Sun',
    role: '后端架构师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'online',
  },
]

// 效能图表配置 (雷达图更适合展示多维度效能)
const efficiencyOption = computed(() => ({
  radar: {
    indicator: [
      { name: '代码质量', max: 100 },
      { name: '交付速度', max: 100 },
      { name: '沟通协作', max: 100 },
      { name: '技术深度', max: 100 },
      { name: '业务理解', max: 100 },
    ],
    splitArea: { show: false },
    axisLine: { lineStyle: { color: '#e2e8f0' } },
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: [85, 90, 80, 95, 88],
          name: '个人能力',
          itemStyle: { color: '#6366f1' },
          areaStyle: { color: 'rgba(99, 102, 241, 0.2)' },
        },
      ],
    },
  ],
}))
</script>

<style scoped lang="scss">
.workbench-container {
  min-height: calc(100vh - 80px);
  background-color: #f6f8fc;
  position: relative;
  overflow-x: hidden;
  padding: 24px;

  // 背景装饰
  .bg-decoration-orange {
    position: absolute;
    bottom: -150px;
    left: -100px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(249, 156, 125, 0.15) 0%, transparent 70%);
    filter: blur(60px);
    z-index: 0;
    animation: float-orange 20s infinite ease-in-out;
  }
  .bg-decoration-blue {
    position: absolute;
    top: -150px;
    right: -100px;
    width: 450px;
    height: 550px;
    background: radial-gradient(circle, rgba(91, 191, 249, 0.15) 0%, transparent 70%);
    filter: blur(60px);
    z-index: 0;
    animation: float-blue 25s infinite ease-in-out;
  }
  .bg-decoration-purple {
    position: absolute;
    top: 20%;
    left: 40%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%);
    filter: blur(50px);
    z-index: 0;
  }

  .workbench-content {
    position: relative;
    z-index: 1;
  }

  .row-gap {
    margin-bottom: 24px;
  }

  // 1. 一体化超级欢迎看板 (Hero Card)
  .hero-card {
    border: none;
    border-radius: 28px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 255, 255, 0.8) 100%
    );
    backdrop-filter: blur(20px);
    box-shadow: 0 12px 40px -8px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.7);
    overflow: hidden;

    .hero-inner {
      display: flex;
      padding: 32px;
      gap: 40px;
      min-height: 320px;

      .hero-left {
        flex: 1.8;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .welcome-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;

          .user-info-box {
            display: flex;
            gap: 24px;
            .hero-avatar {
              border: 4px solid #fff;
              box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.15);
            }
            .text-content {
              .greeting {
                font-size: 28px;
                font-weight: 900;
                color: #1e293b;
                margin: 0 0 10px 0;
                display: flex;
                align-items: center;
                gap: 12px;
                .wave {
                  animation: wave 2.5s infinite;
                  transform-origin: 70% 70%;
                }
              }
              .motto {
                color: #64748b;
                font-size: 15px;
                font-style: italic;
                margin: 0 0 16px 0;
              }
              .info-badges {
                display: flex;
                gap: 12px;
                .info-tag {
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                  padding: 4px 12px;
                  background: #f1f5f9;
                  border-radius: 10px;
                  font-size: 12px;
                  color: #475569;
                  font-weight: 600;
                  &.weather .el-icon {
                    color: #f97316;
                  }
                  &.location .el-icon {
                    color: #6366f1;
                  }
                  &.date .el-icon {
                    color: #10b981;
                  }
                }
              }
            }
          }
          .hero-lottie-container {
            margin-top: -30px;
            margin-right: -20px;
          }
        }

        .hero-rich-content {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.5);
          padding: 20px 24px;
          border-radius: 20px;
          margin: 24px 0;
          border: 1px solid rgba(255, 255, 255, 0.5);

          .rich-item {
            flex: 1;
            .item-label {
              font-size: 12px;
              color: #94a3b8;
              font-weight: 600;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .item-value-box {
              display: flex;
              align-items: center;
              gap: 8px;
              .current {
                font-size: 22px;
                font-weight: 800;
                color: #1e293b;
              }
              .total {
                font-size: 14px;
                color: #94a3b8;
                font-weight: 600;
              }
              .highlight {
                font-size: 22px;
                font-weight: 800;
                color: #6366f1;
              }
              .unit {
                font-size: 13px;
                color: #64748b;
                font-weight: 600;
              }
              .mini-progress {
                flex: 1;
                max-width: 100px;
              }
              .status-badge {
                font-size: 11px;
                padding: 2px 8px;
                background: #dcfce7;
                color: #10b981;
                border-radius: 6px;
                font-weight: 700;
              }

              .avatar-stack-mini {
                display: flex;
                align-items: center;
                .el-avatar {
                  border: 2px solid #fff;
                  margin-left: -8px;
                  &:first-child {
                    margin-left: 0;
                  }
                }
                .more {
                  margin-left: 6px;
                  font-size: 11px;
                  color: #94a3b8;
                  font-weight: 700;
                }
              }
            }
          }
          .el-divider--vertical {
            height: 40px;
            margin: 0 30px;
            opacity: 0.5;
          }
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          .btn-main {
            padding: 12px 32px;
            font-weight: 700;
            box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.4);
          }
          .btn-sub {
            padding: 12px 32px;
            font-weight: 600;
            background: #fff;
            border-color: #e2e8f0;
            &:hover {
              border-color: #6366f1;
              color: #6366f1;
            }
          }
          .btn-icon {
            border-color: #e2e8f0;
            color: #64748b;
            &:hover {
              border-color: #6366f1;
              color: #6366f1;
              background: #f5f7ff;
            }
          }
        }
      }

      .hero-divider {
        width: 1px;
        background: linear-gradient(to bottom, transparent, #e2e8f0, transparent);
      }

      .hero-right {
        flex: 0.7;
        .stats-integrated-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          height: 100%;

          .integrated-stat-item {
            background: rgba(255, 255, 255, 0.6);
            border-radius: 20px;
            padding: 16px;
            border: 1px solid rgba(255, 255, 255, 0.5);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;

            &:hover {
              background: #fff;
              transform: translateY(-4px);
              box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.05);
            }

            .stat-icon {
              width: 36px;
              height: 36px;
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              margin-bottom: 12px;
            }

            .stat-info {
              .stat-label {
                font-size: 13px;
                color: #94a3b8;
                font-weight: 600;
                margin-bottom: 4px;
              }
              .stat-value-wrap {
                display: flex;
                align-items: baseline;
                gap: 8px;
                .stat-value {
                  font-size: 20px;
                  font-weight: 800;
                  color: #1e293b;
                }
                .stat-trend {
                  font-size: 11px;
                  font-weight: 700;
                  padding: 2px 6px;
                  border-radius: 6px;
                  &.up {
                    background: #dcfce7;
                    color: #10b981;
                  }
                  &.down {
                    background: #fee2e2;
                    color: #ef4444;
                  }
                }
              }
            }

            .stat-mini-chart {
              position: absolute;
              bottom: -5px;
              right: -5px;
              width: 80px;
              height: 40px;
              opacity: 0.6;
              .mini-v-chart {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }

  // 3. 通用现代卡片
  .modern-card {
    border: none;
    border-radius: 24px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
        .header-icon {
          font-size: 20px;
          color: #6366f1;
        }
        .title {
          font-weight: 800;
          font-size: 17px;
          color: #1e293b;
        }
      }
    }
  }

  // 4. 项目网格 (高级版)
  .project-grid-premium {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 10px 0;

    .project-inner {
      background: #f8fafc;
      padding: 24px;
      border-radius: 20px;
      border: 1px solid #f1f5f9;
      height: 100%;
      display: flex;
      flex-direction: column;

      .item-header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 16px;
        .icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .project-name {
          font-weight: 700;
          color: #1e293b;
          font-size: 16px;
        }
      }
      .desc {
        color: #64748b;
        font-size: 14px;
        line-height: 1.6;
        height: 44px;
        overflow: hidden;
        margin-bottom: 20px;
      }
      .progress-wrap {
        margin-bottom: 20px;
        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
          margin-bottom: 8px;
        }
      }
      .item-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        .avatar-group {
          display: flex;
          align-items: center;
          .el-avatar {
            border: 2px solid #fff;
            margin-left: -10px;
            &:first-child {
              margin-left: 0;
            }
          }
          .more-avatars {
            margin-left: 8px;
            font-size: 12px;
            color: #94a3b8;
            font-weight: 600;
          }
        }
        .time {
          font-size: 12px;
          color: #cbd5e1;
        }
      }
    }
  }

  // 5. 动态列表 (高级版)
  .activity-list-premium {
    .activity-item-premium {
      display: flex;
      gap: 20px;
      padding: 24px 0;
      border-bottom: 1px solid #f1f5f9;
      &:last-child {
        border-bottom: none;
      }

      .user-avatar-box {
        position: relative;
        flex-shrink: 0;
        .status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #cbd5e1;
          border: 2px solid #fff;
          &.online {
            background: #10b981;
          }
        }
      }

      .activity-content {
        flex: 1;
        .activity-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          .name {
            font-weight: 700;
            color: #1e293b;
            font-size: 15px;
          }
          .time {
            font-size: 12px;
            color: #94a3b8;
          }
        }
        .activity-body {
          margin-bottom: 12px;
          .action {
            color: #64748b;
            margin-right: 6px;
          }
          .target {
            color: #6366f1;
            font-weight: 600;
          }
          .comment-box {
            margin-top: 10px;
            background: #f8fafc;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            color: #475569;
            font-style: italic;
            border-left: 4px solid #e2e8f0;
          }
        }
        .activity-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .actions {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #94a3b8;
            font-size: 13px;
            cursor: pointer;
            &:hover {
              color: #6366f1;
            }
          }
        }
      }
    }
  }

  // 6. 快捷导航 (高级版)
  .shortcut-grid-premium {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 10px 0;

    .shortcut-wrapper {
      width: 100%;
    }

    .shortcut-item-premium {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 12px 0;
      border-radius: 16px;
      transition: all 0.3s;

      &:hover {
        background: #f1f5f9;
        .icon-box {
          background: #fff;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
      }

      .icon-box {
        width: 54px;
        height: 54px;
        background: #f8fafc;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        color: var(--icon-color);
        transition: all 0.3s;
      }
      .label {
        font-size: 13px;
        color: #475569;
        font-weight: 600;
      }
    }
  }

  // 7. 效能分析与进度
  .efficiency-content {
    .chart-wrap-premium {
      height: 260px;
      width: 100%;
      margin-bottom: 20px;
    }
    .efficiency-stats {
      padding: 0 10px;
      .stat-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        .lab {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
        .val {
          font-size: 14px;
          color: #1e293b;
          font-weight: 700;
        }
      }
      .mt-12 {
        margin-top: 16px;
      }
    }
  }

  // 8. 团队列表 (高级版)
  .team-list-premium {
    display: flex;
    flex-direction: column;
    gap: 18px;
    .team-item-premium {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 8px;
      border-radius: 14px;
      transition: background 0.2s;
      &:hover {
        background: #f8fafc;
      }

      .avatar-wrap {
        position: relative;
        .status-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #fff;
          &.online {
            background: #10b981;
          }
          &.busy {
            background: #ef4444;
          }
          &.offline {
            background: #cbd5e1;
          }
        }
      }
      .info {
        flex: 1;
        .name {
          font-weight: 700;
          color: #1e293b;
          font-size: 14px;
        }
        .role {
          font-size: 12px;
          color: #94a3b8;
        }
      }
    }
  }

  // 9. 装饰元素
  .decorative-illustration {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    .floating-img {
      width: 180px;
      animation: float 4s infinite ease-in-out;
      opacity: 0.8;
    }
  }
}

// 动画
@keyframes wave {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(14deg);
  }
  20% {
    transform: rotate(-8deg);
  }
  30% {
    transform: rotate(14deg);
  }
  40% {
    transform: rotate(-4deg);
  }
  50% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes float-orange {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(40px, -30px);
  }
}
@keyframes float-blue {
  0%,
  100% {
    transform: rotate(15deg) translate(0, 0);
  }
  50% {
    transform: rotate(20deg) translate(-30px, 40px);
  }
}

:deep(.el-card__header) {
  border-bottom: 1px solid #f8fafc;
  padding: 20px 24px;
}

.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
</style>
