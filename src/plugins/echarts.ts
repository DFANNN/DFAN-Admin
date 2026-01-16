import { use } from 'echarts/core' // echart 核心
import { CanvasRenderer } from 'echarts/renderers' // echart 渲染器
import {
  LineChart,
  RadarChart,
  PieChart,
  BarChart,
  GaugeChart,
  EffectScatterChart,
} from 'echarts/charts' // echart 图表
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  GeoComponent,
} from 'echarts/components' // echart 组件

use([
  CanvasRenderer,
  LineChart,
  RadarChart,
  PieChart,
  BarChart,
  GaugeChart,
  EffectScatterChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  GeoComponent,
])
