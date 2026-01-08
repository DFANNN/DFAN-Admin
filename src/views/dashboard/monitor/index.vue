<template>
  <div class="monitor-container">
    <!-- 背景装饰 (同步分析页风格) -->
    <div class="bg-decoration-orange"></div>
    <div class="bg-decoration-blue"></div>

    <!-- 顶部标题栏 -->
    <div class="monitor-header">
      <div class="header-left">
        <div class="status-indicator">
          <span class="status-dot pulsating"></span>
          <span class="status-text">SYSTEM LIVE</span>
        </div>
        <h2 class="title">系统实时监控中心</h2>
      </div>
      <div class="header-right">
        <div class="real-time-clock">{{ currentTime }}</div>
        <el-divider direction="vertical" />
        <el-button type="primary" size="default" plain round>
          <template #icon
            ><el-icon><Refresh /></el-icon
          ></template>
          强制刷新
        </el-button>
      </div>
    </div>

    <div class="monitor-content">
      <!-- 第一行：资源仪表盘 (改为更精致的卡片) -->
      <el-row :gutter="20" class="row-gap">
        <el-col :xs="24" :sm="12" :lg="6" v-for="item in resourceStats" :key="item.label">
          <el-card class="stat-card-modern" shadow="hover">
            <div class="card-content">
              <div class="info">
                <span class="label">{{ item.label }}</span>
                <div class="value-wrap">
                  <span class="value" :style="{ color: item.color }">{{ item.value }}</span>
                  <span class="unit">{{ item.unit }}</span>
                </div>
              </div>
              <div class="mini-chart">
                <VChart class="chart" :option="item.option" autoresize />
              </div>
            </div>
            <div class="card-footer">
              <span class="trend" :class="item.trend.startsWith('+') ? 'up' : 'down'">
                {{ item.trend }}
              </span>
              <span class="sub-text">vs last hour</span>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 第二行：地图 + 健康矩阵 -->
      <el-row :gutter="20" class="row-gap">
        <!-- 全球请求实时分布 (真实 ECharts 地图) -->
        <el-col :xs="24" :lg="16">
          <el-card class="modern-card map-section" shadow="hover">
            <template #header>
              <div class="card-header">
                <div class="title-wrap">
                  <el-icon class="header-icon"><MapLocation /></el-icon>
                  <span>全球请求实时分布</span>
                </div>
                <div class="live-badge">
                  <span class="pulse-ring"></span>
                  LIVE DATA
                </div>
              </div>
            </template>
            <div class="map-container">
              <VChart v-if="isMapRegistered" class="chart" :option="worldMapOption" autoresize />
              <div v-else class="map-loading">
                <el-icon class="is-loading"><Loading /></el-icon>
                <span>Loading Map...</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <!-- 节点健康矩阵 -->
        <el-col :xs="24" :lg="8">
          <el-card class="modern-card health-section" shadow="hover">
            <template #header>
              <div class="card-header">
                <div class="title-wrap">
                  <el-icon class="header-icon"><Grid /></el-icon>
                  <span>服务集群健康状态</span>
                </div>
                <el-tag type="info" size="small" effect="plain">48 Nodes</el-tag>
              </div>
            </template>
            <div class="health-grid-wrap">
              <div class="grid">
                <div
                  v-for="n in 48"
                  :key="n"
                  class="node"
                  :class="getNodeStatus(n)"
                  :title="'Node-' + n"
                ></div>
              </div>
              <div class="grid-footer">
                <div class="legend">
                  <span class="item"><i class="dot ok"></i> 运行中</span>
                  <span class="item"><i class="dot warn"></i> 高延迟</span>
                  <span class="item"><i class="dot error"></i> 故障</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 第三行：实时日志 + 吞吐量 -->
      <el-row :gutter="20">
        <el-col :xs="24" :lg="14">
          <el-card class="modern-card log-section" shadow="hover">
            <template #header>
              <div class="card-header">
                <div class="title-wrap">
                  <el-icon class="header-icon"><Document /></el-icon>
                  <span>系统实时流水日志</span>
                </div>
                <span class="session-id">Session: #DF{{ sessionHash }}</span>
              </div>
            </template>
            <div class="log-viewport" ref="logContainer">
              <div v-for="(log, index) in logs" :key="index" class="log-item" :class="log.level">
                <span class="time">{{ log.time }}</span>
                <span class="level-tag">{{ log.level }}</span>
                <span class="content">{{ log.content }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :lg="10">
          <el-card class="modern-card throughput-section" shadow="hover">
            <template #header>
              <div class="card-header">
                <div class="title-wrap">
                  <el-icon class="header-icon"><TrendCharts /></el-icon>
                  <span>API 实时吞吐量 (Req/s)</span>
                </div>
              </div>
            </template>
            <div class="throughput-chart">
              <VChart class="chart" :option="throughputOption" autoresize />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import dayjs from 'dayjs'
import { Refresh, MapLocation, Grid, Document, TrendCharts, Loading } from '@element-plus/icons-vue'

// ECharts 核心
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, GaugeChart, EffectScatterChart, ScatterChart, MapChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  GeoComponent,
  VisualMapComponent,
  LegendComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

echarts.use([
  CanvasRenderer,
  LineChart,
  GaugeChart,
  EffectScatterChart,
  ScatterChart,
  MapChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  GeoComponent,
  VisualMapComponent,
  LegendComponent,
])

defineOptions({ name: 'MonitorView' })

// 1. 实时逻辑
const currentTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const sessionHash = ref(Math.random().toString(16).substring(2, 8).toUpperCase())
let timer: ReturnType<typeof setInterval> | null = null

// 地图数据加载状态
const isMapRegistered = ref(false)

// 异步加载世界地图 GeoJSON
async function initMap() {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json')
    const worldJson = await response.json()
    echarts.registerMap('world', worldJson)
    isMapRegistered.value = true
  } catch (error) {
    console.error('Failed to register world map:', error)
  }
}

// 2. 资源仪表盘 (现代风格)
const resourceStats = ref([
  {
    label: 'CPU Usage',
    value: 38,
    unit: '%',
    color: '#4f46e5',
    trend: '+2.1%',
    option: createMiniGauge(38, '#4f46e5'),
  },
  {
    label: 'Memory',
    value: 62,
    unit: '%',
    color: '#10b981',
    trend: '-0.5%',
    option: createMiniGauge(62, '#10b981'),
  },
  {
    label: 'Network',
    value: 124,
    unit: 'Mbps',
    color: '#f59e0b',
    trend: '+12.4',
    option: createMiniGauge(45, '#f59e0b'),
  },
  {
    label: 'Active Tasks',
    value: 12,
    unit: 'Proc',
    color: '#ef4444',
    trend: 'Stable',
    option: createMiniGauge(25, '#ef4444'),
  },
])

function createMiniGauge(value: number, color: string) {
  return {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: { show: false },
        progress: { show: true, overlap: false, roundCap: true, clip: false, itemStyle: { color } },
        axisLine: { lineStyle: { width: 4, color: [[1, '#f1f5f9']] } },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        data: [{ value }],
        detail: { show: false },
      },
    ],
  }
}

// 3. ECharts 地图 (真实地理坐标)
const worldMapOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}',
  },
  geo: {
    map: 'world', // 注意：项目中若无地图 JSON，这里会显示空白，实际开发需引入 registerMap
    roam: false,
    emphasis: {
      itemStyle: { areaColor: '#e2e8f0' },
      label: { show: false },
    },
    itemStyle: {
      areaColor: '#f8fafc',
      borderColor: '#cbd5e1',
      borderWidth: 1,
    },
    left: '10%',
    right: '10%',
    top: '5%',
    bottom: '5%',
  },
  series: [
    {
      name: 'Realtime Requests',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: [
        { name: 'Shanghai', value: [121.47, 31.23, 100] },
        { name: 'San Francisco', value: [-122.41, 37.77, 80] },
        { name: 'London', value: [-0.12, 51.5, 60] },
        { name: 'Frankfurt', value: [8.68, 50.11, 40] },
        { name: 'Singapore', value: [103.85, 1.28, 90] },
      ],
      symbolSize: (val: [number, number, number]) => val[2] / 8,
      showEffectOn: 'render',
      rippleEffect: { brushType: 'stroke', scale: 4 },
      itemStyle: {
        color: '#6366f1',
        shadowBlur: 10,
        shadowColor: 'rgba(99, 102, 241, 0.5)',
      },
      zlevel: 1,
    },
  ],
}))

// 4. 健康矩阵
const getNodeStatus = (n: number) => {
  if (n === 15 || n === 32) return 'error'
  if (n % 8 === 0) return 'warn'
  return 'ok'
}

// 5. 实时日志
interface ILog {
  time: string
  level: 'INFO' | 'WARN' | 'ERROR'
  content: string
}
const logs = ref<ILog[]>([])
const logPresets = [
  'Gateway: Incoming request from 182.16.4.21',
  'Auth: Token validation successful',
  'Service: Node-14 reported latency > 200ms',
  'DB: Slow query detected (152ms)',
  'Cache: Purge successful for key: user_profile_882',
  'Security: Multiple login attempts detected',
]

function addLog() {
  const level = (Math.random() > 0.85 ? (Math.random() > 0.5 ? 'WARN' : 'ERROR') : 'INFO') as
    | 'INFO'
    | 'WARN'
    | 'ERROR'
  const randomContent = logPresets[Math.floor(Math.random() * logPresets.length)]
  logs.value.unshift({
    time: dayjs().format('HH:mm:ss.SSS'),
    level,
    content: randomContent || '',
  })
  if (logs.value.length > 50) logs.value.pop()
}

// 6. 吞吐量图表
const throughputData = ref<number[]>(
  new Array(20).fill(0).map(() => Math.floor(Math.random() * 400 + 100)),
)
const throughputOption = computed(() => ({
  grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: new Array(20).fill(''),
    axisLine: { show: false },
    axisTick: { show: false },
  },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } } },
  series: [
    {
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 3, color: '#6366f1' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(99, 102, 241, 0.2)' },
            { offset: 1, color: 'transparent' },
          ],
        },
      },
      data: throughputData.value,
    },
  ],
}))

onMounted(() => {
  initMap()
  timer = setInterval(() => {
    currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
    addLog()
    throughputData.value.push(Math.floor(Math.random() * 400 + 100))
    throughputData.value.shift()
  }, 2000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
.monitor-container {
  min-height: calc(100vh - 100px);
  padding: 24px;
  position: relative;
  overflow: hidden;
  background-color: #f8fafc;

  // 背景装饰 (复制分析页)
  .bg-decoration-orange {
    position: absolute;
    top: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 171, 142, 0.15) 0%, transparent 70%);
    filter: blur(60px);
    z-index: 0;
  }
  .bg-decoration-blue {
    position: absolute;
    bottom: -150px;
    left: -150px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(91, 191, 249, 0.15) 0%, transparent 70%);
    filter: blur(80px);
    z-index: 0;
  }

  .monitor-header {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .header-left {
      .status-indicator {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
        }
        .pulsating {
          animation: pulse 2s infinite;
        }
        .status-text {
          font-size: 12px;
          font-weight: 700;
          color: #10b981;
          letter-spacing: 1px;
        }
      }
      .title {
        font-size: 26px;
        font-weight: 800;
        color: #1e293b;
        margin: 0;
      }
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
      .real-time-clock {
        font-family: monospace;
        font-size: 16px;
        color: #64748b;
        font-weight: 600;
      }
    }
  }

  .monitor-content {
    position: relative;
    z-index: 1;
    .row-gap {
      margin-bottom: 20px;
    }
  }

  // 现代卡片通用样式
  .modern-card {
    border: none;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title-wrap {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
        color: #334155;
        .header-icon {
          font-size: 18px;
          color: #6366f1;
        }
      }
    }
  }

  // 仪表盘卡片
  .stat-card-modern {
    border: none;
    border-radius: 16px;
    .card-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info {
        .label {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }
        .value-wrap {
          margin-top: 4px;
          display: flex;
          align-items: baseline;
          gap: 4px;
          .value {
            font-size: 28px;
            font-weight: 800;
          }
          .unit {
            font-size: 14px;
            color: #94a3b8;
            font-weight: 600;
          }
        }
      }
      .mini-chart {
        width: 60px;
        height: 60px;
      }
    }
    .card-footer {
      margin-top: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      .trend {
        font-weight: 700;
        &.up {
          color: #10b981;
        }
        &.down {
          color: #ef4444;
        }
      }
      .sub-text {
        color: #94a3b8;
      }
    }
  }

  // 地图区域
  .map-section {
    .live-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: #eef2ff;
      color: #4f46e5;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      .pulse-ring {
        width: 6px;
        height: 6px;
        background: #4f46e5;
        border-radius: 50%;
      }
    }
    .map-container {
      height: 400px;
      padding: 10px;
      position: relative;
      .map-loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        color: #6366f1;
        font-size: 14px;
        .is-loading {
          font-size: 24px;
        }
      }
    }
  }

  // 健康矩阵
  .health-section {
    .health-grid-wrap {
      .grid {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 10px;
        padding: 15px 0;
        .node {
          aspect-ratio: 1;
          border-radius: 6px;
          transition: all 0.3s;
          &.ok {
            background: #10b981;
            box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
          }
          &.warn {
            background: #f59e0b;
            animation: soft-blink 2s infinite;
          }
          &.error {
            background: #ef4444;
          }
        }
      }
      .grid-footer {
        margin-top: 20px;
        border-top: 1px dashed #e2e8f0;
        padding-top: 15px;
        .legend {
          display: flex;
          gap: 15px;
          justify-content: center;
          .item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: #64748b;
            font-weight: 600;
          }
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
          .ok {
            background: #10b981;
          }
          .warn {
            background: #f59e0b;
          }
          .error {
            background: #ef4444;
          }
        }
      }
    }
  }

  // 日志区域 (改为明亮设计)
  .log-section {
    .session-id {
      font-family: monospace;
      font-size: 12px;
      color: #94a3b8;
      background: #f1f5f9;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .log-viewport {
      height: 280px;
      overflow-y: auto;
      padding: 10px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      .log-item {
        margin-bottom: 8px;
        font-size: 13px;
        font-family: 'JetBrains Mono', monospace;
        display: flex;
        gap: 10px;
        padding: 6px;
        border-radius: 6px;
        .time {
          color: #94a3b8;
          flex-shrink: 0;
        }
        .level-tag {
          font-weight: 800;
          font-size: 11px;
          padding: 1px 4px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .content {
          color: #334155;
        }
        &.INFO .level-tag {
          background: #dcfce7;
          color: #166534;
        }
        &.WARN .level-tag {
          background: #fef9c3;
          color: #854d0e;
        }
        &.ERROR .level-tag {
          background: #fee2e2;
          color: #991b1b;
        }
        &:hover {
          background: #f1f5f9;
        }
      }
    }
  }

  .throughput-section {
    .throughput-chart {
      height: 280px;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}
@keyframes soft-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

:deep(.el-card__header) {
  border-bottom: 1px solid #f1f5f9;
  padding: 16px 20px;
}
</style>
