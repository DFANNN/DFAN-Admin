<template>
  <div class="analysis-container">
    <!-- 背景装饰圆圈 (保留登录页风格) -->
    <div class="bg-decoration-orange"></div>
    <div class="bg-decoration-blue"></div>

    <div class="analysis-content">
      <!-- 第一行：业务简报 + 核心运营指标 -->
      <el-row :gutter="20" class="row-gap">
        <el-col :xs="24" :lg="10">
          <el-card class="welcome-card" shadow="never">
            <div class="welcome-inner">
              <div class="welcome-text">
                <span class="greeting">Business Overview</span>
                <h2>全球业务运营中心</h2>
                <p>
                  本月业绩增长势头强劲，已完成季度目标的 76%，建议加大对移动端大促活动的资源投入。
                </p>
                <div class="action-group">
                  <el-button type="primary" class="main-btn">生成月报</el-button>
                  <el-button link class="secondary-btn">业绩预测</el-button>
                </div>
              </div>
              <div class="welcome-lottie">
                <LottieAnimation :animationData="helloLottie" :width="180" :height="140" />
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="8" :lg="4" v-for="item in businessStats" :key="item.label">
          <el-card class="top-stat-card" :class="item.type" shadow="never">
            <div class="stat-icon-bg">
              <el-icon><component :is="item.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">
                {{ item.value }} <span class="trend">{{ item.trend }}</span>
              </div>
              <div class="stat-label">{{ item.label }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 全新的巨幕深度分析图表：营收与利润全景 -->
      <el-row :gutter="20" class="row-gap">
        <el-col :span="24">
          <el-card class="big-analysis-card" shadow="never">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <span class="title">年度营收与净利润增长深度分析</span>
                  <el-tag size="small" type="primary" effect="plain" class="ml-10"
                    >数据已脱敏</el-tag
                  >
                </div>
                <div class="header-right">
                  <el-radio-group v-model="analysisTimeRange" size="small">
                    <el-radio-button label="1y">近1年</el-radio-button>
                    <el-radio-button label="2y">近2年</el-radio-button>
                  </el-radio-group>
                  <el-divider direction="vertical" />
                  <el-button :icon="HSolidArrowPathIcon" circle size="small" />
                </div>
              </div>
            </template>
            <div class="big-chart-container">
              <VChart class="chart" :option="revenueProfitOption" autoresize />
            </div>
            <div class="big-chart-footer">
              <div class="footer-item" v-for="f in revenueInsights" :key="f.label">
                <div class="item-top">
                  <div class="dot" :style="{ backgroundColor: f.color }"></div>
                  <span class="lab">{{ f.label }}</span>
                </div>
                <div class="item-bottom">
                  <span class="val">{{ f.value }}</span>
                  <span class="trend" :class="f.trendType">{{ f.trend }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 第三行：市场份额 + 热销品类 + 业绩目标 -->
      <el-row :gutter="20" class="row-gap">
        <el-col :xs="24" :md="12" :lg="8">
          <el-card class="chart-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="title">全球市场份额分布</span>
                <el-icon class="more-icon"><HSolidChartIcon /></el-icon>
              </div>
            </template>
            <div class="donut-chart-wrap small">
              <VChart class="chart" :option="marketShareOption" autoresize />
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="12" :lg="8">
          <el-card class="chart-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="title">热销商品类目 TOP 5</span>
                <el-icon class="more-icon"><HSolidCartIcon /></el-icon>
              </div>
            </template>
            <div class="donut-chart-wrap small">
              <VChart class="chart" :option="topCategoriesOption" autoresize />
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="24" :lg="8">
          <div class="vertical-stack">
            <el-card class="goals-card" shadow="never">
              <div class="goals-inner">
                <div class="icon-box">
                  <el-icon><HSolidTrophyIcon /></el-icon>
                </div>
                <div class="goal-info">
                  <div class="title">Q1 销售额目标</div>
                  <div class="percent">76.4%</div>
                </div>
                <el-progress :percentage="76.4" color="#f99c7d" :show-text="false" />
              </div>
            </el-card>
            <el-card class="profile-card" shadow="never">
              <div class="profile-inner">
                <div class="badge">Today's Operation Manager</div>
                <el-avatar
                  :size="64"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Operation"
                />
                <div class="name">David Fan</div>
                <div class="role">高级运营专家 / 增长黑客</div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>

      <!-- 第四行：排行榜 + 运营大事件 -->
      <el-row :gutter="20" class="row-gap">
        <el-col :xs="24" :lg="16">
          <el-card class="employees-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="title">各渠道销售表现实时榜单</span>
                <el-icon class="more-icon"><HSolidEllipsisVerticalIcon /></el-icon>
              </div>
            </template>
            <el-table :data="channelSales" style="width: 100%" class="custom-table">
              <el-table-column label="渠道名称" width="250">
                <template #default="{ row }">
                  <div class="profile-cell">
                    <div class="project-icon" :style="{ backgroundColor: row.color }">
                      {{ row.name.charAt(0) }}
                    </div>
                    <div class="name-role">
                      <div class="name">{{ row.name }}</div>
                      <div class="role">负责人: {{ row.owner }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="revenue" label="销售额">
                <template #default="{ row }">
                  <div class="font-bold">￥{{ row.revenue }}</div>
                </template>
              </el-table-column>
              <el-table-column label="达成率">
                <template #default="{ row }">
                  <el-progress
                    :percentage="row.achievement"
                    :color="row.achievement > 90 ? '#10b981' : '#5bbff9'"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态">
                <template #default="{ row }">
                  <el-tag :type="row.statusType" effect="dark" round>{{ row.status }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :lg="8">
          <el-card class="schedules-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="title">近期运营大事件</span>
                <el-icon class="more-icon"><HSolidEllipsisVerticalIcon /></el-icon>
              </div>
            </template>
            <div class="date-tabs">
              <el-button-group>
                <el-button type="primary" size="small">待开启</el-button>
                <el-button size="small">进行中</el-button>
                <el-button size="small">回顾</el-button>
              </el-button-group>
            </div>
            <div class="schedule-list">
              <div class="schedule-item" v-for="item in events" :key="item.id">
                <div class="time">{{ item.date }}</div>
                <div class="event-card" :style="{ borderLeftColor: item.color }">
                  <div class="event-title">{{ item.title }}</div>
                  <div class="event-time">
                    <el-icon><HSolidCalendarIcon /></el-icon> 时间: {{ item.range }}
                  </div>
                  <div class="event-participants">
                    <div class="custom-avatar-group">
                      <el-avatar
                        :size="24"
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=prom"
                      />
                    </div>
                    <span class="more">策划中...</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 第五行：特色营销推荐 (全宽展现) -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card class="featured-card full-banner" shadow="never">
            <div class="featured-img">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
                alt="marketing"
              />
            </div>
            <div class="featured-content">
              <div class="content-left">
                <h3>2026 年货节全球营销方案</h3>
                <p>深挖跨境电商增长潜力，通过 AI 精准投放实现 GMV 翻倍增长。</p>
              </div>
              <div class="participants">
                <div class="custom-avatar-group">
                  <el-avatar :size="32" src="https://api.dicebear.com/7.x/avataaars/svg?seed=m1" />
                  <el-avatar :size="32" src="https://api.dicebear.com/7.x/avataaars/svg?seed=m2" />
                  <el-avatar :size="32" src="https://api.dicebear.com/7.x/avataaars/svg?seed=m3" />
                </div>
                <span class="more">+35 团队成员在线讨论</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 第四行：渠道排行 + 运营大事件 -->
      <el-row :gutter="20">
        <el-col :xs="24" :lg="16">
          <el-card class="employees-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="title">各渠道销售表现实时榜单</span>
                <el-icon class="more-icon"><HSolidEllipsisVerticalIcon /></el-icon>
              </div>
            </template>
            <el-table :data="channelSales" style="width: 100%" class="custom-table">
              <el-table-column label="渠道名称" width="250">
                <template #default="{ row }">
                  <div class="profile-cell">
                    <div class="project-icon" :style="{ backgroundColor: row.color }">
                      {{ row.name.charAt(0) }}
                    </div>
                    <div class="name-role">
                      <div class="name">{{ row.name }}</div>
                      <div class="role">负责人: {{ row.owner }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="revenue" label="销售额">
                <template #default="{ row }">
                  <div class="font-bold">￥{{ row.revenue }}</div>
                </template>
              </el-table-column>
              <el-table-column label="达成率">
                <template #default="{ row }">
                  <el-progress
                    :percentage="row.achievement"
                    :color="row.achievement > 90 ? '#10b981' : '#5bbff9'"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态">
                <template #default="{ row }">
                  <el-tag :type="row.statusType" effect="dark" round>{{ row.status }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :lg="8">
          <el-card class="schedules-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="title">近期运营大事件</span>
                <el-icon class="more-icon"><HSolidEllipsisVerticalIcon /></el-icon>
              </div>
            </template>
            <div class="date-tabs">
              <el-button-group>
                <el-button type="primary" size="small">待开启</el-button>
                <el-button size="small">进行中</el-button>
                <el-button size="small">回顾</el-button>
              </el-button-group>
            </div>
            <div class="schedule-list">
              <div class="schedule-item" v-for="item in events" :key="item.id">
                <div class="time">{{ item.date }}</div>
                <div class="event-card" :style="{ borderLeftColor: item.color }">
                  <div class="event-title">{{ item.title }}</div>
                  <div class="event-time">
                    <el-icon><HSolidCalendarIcon /></el-icon> 时间: {{ item.range }}
                  </div>
                  <div class="event-participants">
                    <div class="custom-avatar-group">
                      <el-avatar
                        :size="24"
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=prom"
                      />
                    </div>
                    <span class="more">策划中...</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
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
import helloLottie from '@/assets/lotties/hello.json'
import {
  BanknotesIcon as HSolidBanknotesIcon,
  ShoppingCartIcon as HSolidCartIcon,
  UserPlusIcon as HSolidUserPlusIcon,
  EllipsisVerticalIcon as HSolidEllipsisVerticalIcon,
  TrophyIcon as HSolidTrophyIcon,
  CalendarIcon as HSolidCalendarIcon,
  ArrowPathIcon as HSolidArrowPathIcon,
} from '@heroicons/vue/20/solid'

// ECharts 相关的引入
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart, FunnelChart, RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  FunnelChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
])

const themeStore = useThemeStore()
provide(
  THEME_KEY,
  computed(() => themeStore.themeMode),
)

defineOptions({ name: 'AnalysisView' })

// 1. 核心运营指标
const businessStats = [
  {
    label: 'Total Revenue',
    value: '￥1,284,500',
    trend: '+15.2%',
    icon: HSolidBanknotesIcon,
    type: 'blue',
  },
  { label: 'Total Orders', value: '8,429', trend: '+8.4%', icon: HSolidCartIcon, type: 'orange' },
  {
    label: 'New Members',
    value: '1,562',
    trend: '+22.1%',
    icon: HSolidUserPlusIcon,
    type: 'indigo',
  },
]

// 2. 巨幕图表：营收与利润 (硬核工业视觉版)
const analysisTimeRange = ref('1y')
const revenueProfitOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 0,
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  },
  legend: { data: ['年度营收', '净利润', '去年同期', '利润率'], bottom: 0, itemGap: 20 },
  grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLine: { lineStyle: { color: '#9ca3af' } },
    axisTick: { show: false },
  },
  yAxis: [
    {
      type: 'value',
      name: '金额 (k)',
      axisLine: { show: false },
      splitLine: { lineStyle: { type: 'dashed', color: '#e5e7eb' } },
    },
    {
      type: 'value',
      name: '利润率 (%)',
      min: 0,
      max: 100,
      axisLine: { show: false },
      splitLine: { show: false },
    },
  ],
  series: [
    {
      name: '年度营收',
      type: 'line',
      smooth: true,
      lineStyle: { width: 0 },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#5bbff9' },
            { offset: 1, color: '#2563eb' },
          ],
        },
      },
      data: [120, 132, 101, 134, 290, 230, 210, 250, 220, 280, 310, 330],
    },
    {
      name: '去年同期',
      type: 'line',
      symbol: 'none',
      lineStyle: { type: 'dashed', width: 2, color: '#94a3b8' },
      data: [100, 110, 95, 120, 200, 180, 190, 210, 180, 230, 260, 300],
    },
    {
      name: '净利润',
      type: 'line',
      smooth: true,
      lineStyle: { width: 4, color: '#f99c7d' },
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: { color: '#f99c7d', borderColor: '#fff', borderWidth: 2 },
      data: [80, 92, 70, 84, 150, 130, 110, 140, 120, 160, 190, 240],
    },
    {
      name: '利润率',
      type: 'line',
      yAxisIndex: 1,
      lineStyle: { type: 'dashed', color: '#10b981', width: 2 },
      symbol: 'none',
      data: [66, 69, 69, 62, 52, 56, 52, 56, 54, 57, 61, 72],
    },
  ],
}))

const revenueInsights = [
  { label: '年度平均利润率', value: '64.5%', trend: '+3.2%', trendType: 'up', color: '#10b981' },
  { label: '最高月营收', value: '￥330k', trend: '12月', trendType: 'neutral', color: '#5bbff9' },
  { label: '营销成本 (CAC)', value: '￥42k', trend: '-5.1%', trendType: 'up', color: '#f99c7d' },
]

// 3. 全球市场份额饼图
const marketShareOption = computed(() => ({
  tooltip: { trigger: 'item', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderWidth: 0 },
  legend: { bottom: '5%', icon: 'circle', itemGap: 15, textStyle: { color: '#64748b' } },
  series: [
    {
      name: '市场份额',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: '14', fontWeight: 'bold' } },
      data: [
        { value: 45, name: '北美地区', itemStyle: { color: '#6366f1' } },
        { value: 25, name: '欧洲市场', itemStyle: { color: '#f99c7d' } },
        { value: 20, name: '亚太地区', itemStyle: { color: '#10b981' } },
        { value: 10, name: '其他', itemStyle: { color: '#94a3b8' } },
      ],
    },
  ],
}))

// 4. 热销品类柱状图
const topCategoriesOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '8%', bottom: '3%', top: '5%', containLabel: true },
  xAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { type: 'dashed' } } },
  yAxis: {
    type: 'category',
    data: ['电子产品', '户外运动', '居家生活', '美妆个护', '服装鞋帽'],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#64748b' },
  },
  series: [
    {
      name: '销量 (k)',
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        borderRadius: [0, 20, 20, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#5bbff9' },
            { offset: 1, color: '#2563eb' },
          ],
        },
      },
      data: [820, 732, 601, 534, 490],
    },
  ],
}))

// 4. 渠道销售数据
const channelSales = [
  {
    name: '移动端 App',
    owner: 'David Fan',
    revenue: '542,800',
    achievement: 92,
    status: '引领增长',
    statusType: 'success',
    color: '#8b5cf6',
  },
  {
    name: '天猫旗舰店',
    owner: 'Alice Zhang',
    revenue: '320,400',
    achievement: 88,
    status: '稳健运行',
    statusType: 'primary',
    color: '#ef4444',
  },
  {
    name: '抖音直播间',
    owner: 'Mike Lee',
    revenue: '281,000',
    achievement: 105,
    status: '爆发期',
    statusType: 'warning',
    color: '#f59e0b',
  },
]

// 5. 运营事件
const events = [
  { id: 1, date: '1月20日', title: '2026 年货节启动', range: '01.20 - 02.10', color: '#ef4444' },
  { id: 2, date: '2月14日', title: '情人节专项大促', range: '02.10 - 02.15', color: '#f99c7d' },
]
</script>

<style scoped lang="scss">
.analysis-container {
  min-height: calc(100vh - 80px);
  background-color: #f4f7fa;
  position: relative;
  overflow-x: hidden;
  padding: 24px;

  .bg-decoration-orange {
    position: absolute;
    bottom: -150px;
    left: -100px;
    width: 500px;
    height: 500px;
    background-color: #f99c7d;
    border-radius: 50%;
    opacity: 0.12;
    z-index: 0;
    animation: float-orange 20s infinite ease-in-out;
    filter: blur(40px);
  }

  .bg-decoration-blue {
    position: absolute;
    top: -150px;
    right: -100px;
    width: 450px;
    height: 550px;
    background-color: #5bbff9;
    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
    opacity: 0.12;
    z-index: 0;
    transform: rotate(15deg);
    animation: float-blue 25s infinite ease-in-out;
    filter: blur(40px);
  }

  .analysis-content {
    position: relative;
    z-index: 1;
  }
  .row-gap {
    margin-bottom: 24px;
  }
  .el-card {
    border: none;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  }

  // Welcome Card
  .welcome-card {
    background: #fff;
    height: 100%;
    .welcome-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      .welcome-text {
        .greeting {
          font-size: 14px;
          color: var(--el-color-primary);
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
        }
        h2 {
          font-size: 26px;
          color: #1f2937;
          margin: 0 0 12px 0;
          font-weight: 700;
        }
        p {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 24px;
          line-height: 1.6;
          max-width: 320px;
        }
        .action-group {
          display: flex;
          gap: 16px;
          align-items: center;
          .main-btn {
            border-radius: 12px;
            padding: 10px 24px;
          }
        }
      }
    }
  }

  // Top Stats
  .top-stat-card {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 24px;
    color: #fff;
    position: relative;
    overflow: hidden;

    &.blue {
      background: linear-gradient(135deg, #5bbff9 0%, #2563eb 100%);
    }
    &.orange {
      background: linear-gradient(135deg, #f99c7d 0%, #ea580c 100%);
    }
    &.indigo {
      background: linear-gradient(135deg, #818cf8 0%, #4f46e5 100%);
    }

    .stat-icon-bg {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-right: 16px;
    }

    .stat-info {
      .stat-value {
        font-size: 22px;
        font-weight: 700;
        .trend {
          font-size: 12px;
          font-weight: normal;
          margin-left: 4px;
          opacity: 0.8;
        }
      }
      .stat-label {
        font-size: 14px;
        opacity: 0.8;
        margin-top: 4px;
      }
    }
  }

  // Big Chart Card
  .big-analysis-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header-left {
        display: flex;
        align-items: center;
        .title {
          font-weight: 700;
          font-size: 18px;
        }
        .ml-10 {
          margin-left: 10px;
        }
      }
    }
    .big-chart-container {
      height: 450px;
      width: 100%;
      margin: 20px 0;
    }
    .big-chart-footer {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      padding: 24px;
      border-top: 1px dashed #e5e7eb;
      background: #f9fafb;
      border-radius: 0 0 20px 20px;

      .footer-item {
        background: #fff;
        padding: 16px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .item-top {
          display: flex;
          align-items: center;
          gap: 8px;
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
          .lab {
            color: #64748b;
            font-size: 13px;
            font-weight: 500;
          }
        }

        .item-bottom {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          .val {
            font-weight: 700;
            color: #1e293b;
            font-size: 20px;
          }
          .trend {
            font-size: 12px;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 20px;
            &.up {
              color: #10b981;
              background: #f0fdf4;
            }
            &.down {
              color: #ef4444;
              background: #fef2f2;
            }
            &.neutral {
              color: #64748b;
              background: #f1f5f9;
            }
          }
        }
      }
    }
  }

  .chart-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }
  }

  // Funnel
  .traffic-dist-card {
    .card-header {
      font-weight: 600;
    }
    .donut-chart-wrap {
      height: 320px;
    }
  }

  // Vertical Stack
  .vertical-stack {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
    .goals-card {
      background: #fff7ed;
      .goals-inner {
        .icon-box {
          width: 40px;
          height: 40px;
          background: #f97316;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .goal-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 8px;
          .title {
            font-weight: 600;
            font-size: 14px;
          }
          .percent {
            font-size: 18px;
            font-weight: 700;
          }
        }
      }
    }
    .profile-card {
      text-align: center;
      flex: 1;
      .profile-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 0;
        .badge {
          color: #f97316;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .name {
          font-size: 18px;
          font-weight: 700;
          margin: 12px 0 4px 0;
        }
        .role {
          color: #6b7280;
          font-size: 13px;
        }
      }
    }
  }

  // Featured
  .featured-card {
    padding: 0;
    overflow: hidden;
    height: 100%;
    &.full-banner {
      .featured-img {
        height: 240px;
      }
      .featured-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .content-left {
          flex: 1;
        }
      }
    }
    .featured-img {
      height: 180px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .featured-content {
      padding: 20px;
      h3 {
        font-size: 18px;
        margin: 0 0 10px 0;
        font-weight: 700;
      }
      p {
        color: #6b7280;
        font-size: 14px;
        margin-bottom: 20px;
        line-height: 1.5;
      }
      .participants {
        display: flex;
        align-items: center;
        .more {
          margin-left: 10px;
          color: #6b7280;
          font-size: 13px;
        }
      }
    }
  }

  .donut-chart-wrap {
    height: 320px;
    &.small {
      height: 260px;
    }
  }

  // Table
  .custom-table {
    :deep(.el-table__header) th {
      background: #f9fafb;
      color: #4b5563;
      font-weight: 600;
    }
    .profile-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      .project-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
      }
      .name {
        font-weight: 600;
        color: #1f2937;
      }
      .role {
        font-size: 12px;
        color: #6b7280;
      }
    }
  }

  // Schedules
  .schedules-card {
    .card-header {
      font-weight: 600;
    }
    .date-tabs {
      margin-bottom: 24px;
      .el-button-group {
        width: 100%;
        display: flex;
        .el-button {
          flex: 1;
          border-radius: 8px;
        }
      }
    }
    .schedule-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      .schedule-item {
        display: flex;
        gap: 16px;
        .time {
          width: 60px;
          color: #9ca3af;
          font-size: 13px;
          padding-top: 4px;
        }
        .event-card {
          flex: 1;
          border-left: 4px solid;
          background: #f9fafb;
          border-radius: 0 12px 12px 0;
          padding: 16px;
          .event-title {
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .event-time {
            font-size: 12px;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 12px;
          }
          .event-participants {
            display: flex;
            align-items: center;
            .more {
              margin-left: 8px;
              color: #9ca3af;
              font-size: 11px;
            }
          }
        }
      }
    }
  }

  .custom-avatar-group {
    display: flex;
    align-items: center;
    .el-avatar {
      border: 2px solid #fff;
      margin-left: -12px;
      &:first-child {
        margin-left: 0;
      }
    }
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
</style>
