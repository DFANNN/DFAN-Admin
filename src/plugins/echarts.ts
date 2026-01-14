import { use } from 'echarts/core' // echart 核心
import { CanvasRenderer } from 'echarts/renderers' // echart 渲染器
import { LineChart, RadarChart, PieChart, BarChart } from 'echarts/charts' // echart 图表
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components' // echart 组件

use([
  CanvasRenderer,
  LineChart,
  RadarChart,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
])
