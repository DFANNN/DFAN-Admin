<template>
  <div class="konva-demo-page">
    <BaseCard class="konva-demo-card">
      <template #header>
        <div class="konva-demo-header">
          <div>
            <div class="konva-demo-title">Konva 图片点位标注演示</div>
            <div class="konva-demo-desc">
              Konva 是一个基于 Canvas 的
              2D图形绘制库，适合做图片标注、拖拽编辑、区域绘制等交互场景。 本示例使用
              Konva在原图坐标系中绘制矩形、线段、多边形；也可以导入点位数据进行还原。
            </div>
          </div>
          <el-upload
            :show-file-list="false"
            :auto-upload="false"
            accept="image/*"
            :on-change="handleImageChange"
          >
            <el-button type="primary">上传图片</el-button>
          </el-upload>
        </div>
      </template>

      <KonvaImageAnnotationEditor
        ref="editorRef"
        v-model="annotations"
        :image-src="imageSrc"
        :height="630"
      />
    </BaseCard>

    <BaseCard class="konva-data-card">
      <template #header>
        <div class="konva-data-header">
          <div class="konva-data-title">点位数据</div>
        </div>
      </template>

      <div class="simple-data-panel">
        <div class="data-input-section">
          <div class="section-header">
            <span class="section-title">输入点位</span>
            <el-button type="primary" size="small" @click="restoreAnnotations">
              添加到画布
            </el-button>
          </div>
          <el-radio-group v-model="restoreShapeType" size="small">
            <el-radio-button value="line">线段</el-radio-button>
            <el-radio-button value="rect">矩形</el-radio-button>
            <el-radio-button value="polygon">多边形</el-radio-button>
          </el-radio-group>
          <el-input
            v-model="restorePointsJson"
            type="textarea"
            :rows="4"
            placeholder='格式：[{"x":120,"y":100},{"x":360,"y":260}]'
          />
        </div>

        <div class="data-output-section">
          <div class="section-header">
            <span class="section-title">当前点位</span>
            <div class="stats">
              <span>总数: {{ annotations.length }}</span>
              <span class="stat-rect">矩形: {{ shapeCountMap.rect }}</span>
              <span class="stat-line">线段: {{ shapeCountMap.line }}</span>
              <span class="stat-polygon">多边形: {{ shapeCountMap.polygon }}</span>
            </div>
          </div>
          <div class="output-list">
            <div v-if="!annotations.length" class="empty-tip">暂无点位数据</div>
            <div
              v-for="(item, index) in annotations"
              :key="index"
              :class="['output-item', item.type]"
            >
              <span class="item-label">{{ shapeLabelMap[item.type] }} {{ index + 1 }}</span>
              <span class="item-points">{{ JSON.stringify(item.point) }}</span>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, type UploadFile } from 'element-plus'
import KonvaImageAnnotationEditor from './KonvaImageAnnotationEditor.vue'

defineOptions({ name: 'KonvaView' })

// 图形类型：线段、矩形、多边形
type ShapeType = 'line' | 'rect' | 'polygon'

// 标注点位接口：包含 x、y 坐标
interface IAnnotationPoint {
  x: number
  y: number
}

// 标注项接口：包含图形类型和点位数组
interface IAnnotationItem {
  type: ShapeType
  point: IAnnotationPoint[]
}

// 编辑器组件引用
const editorRef = useTemplateRef<InstanceType<typeof KonvaImageAnnotationEditor>>('editorRef')
// 当前加载的图片地址
const imageSrc = ref('')
// 画布上的所有标注数据
const annotations = ref<IAnnotationItem[]>([])
// 用户选择的要还原的图形类型
const restoreShapeType = ref<ShapeType>('line')
// 用户输入的点位 JSON 字符串
const restorePointsJson = ref('')
// 图片的 Object URL，用于在组件卸载时释放
let objectUrl = ''

// 图形类型配置选项
const shapeOptions: Array<{
  value: ShapeType
  label: string
  desc: string
  pointRule: string
}> = [
  {
    value: 'rect',
    label: '矩形',
    desc: '左上角 + 右下角',
    pointRule: '需要 2 个点',
  },
  {
    value: 'line',
    label: '线段',
    desc: '起点 + 终点',
    pointRule: '需要 2 个点',
  },
  {
    value: 'polygon',
    label: '多边形',
    desc: '按顺序连接并闭合',
    pointRule: '至少 3 个点',
  },
]

// 形状类型与标签的映射关系，用于在界面上显示中文名称
const shapeLabelMap = shapeOptions.reduce(
  (map, item) => {
    map[item.value] = item.label
    return map
  },
  {} as Record<ShapeType, string>,
)

/**
 * 计算当前画布中各类型图形的数量
 * @returns 包含 line、rect、polygon 三种类型数量的对象
 */
const shapeCountMap = computed(() => {
  return annotations.value.reduce(
    (map, item) => {
      map[item.type] += 1
      return map
    },
    { line: 0, rect: 0, polygon: 0 } as Record<ShapeType, number>,
  )
})

/**
 * 处理图片上传变化事件
 * @param uploadFile - Element Plus 上传组件返回的文件对象
 * 功能：
 * 1. 验证文件类型是否为图片
 * 2. 创建图片的 Object URL 用于预览
 * 3. 清空之前的标注数据
 * 4. 释放旧的 Object URL 避免内存泄漏
 */
const handleImageChange = (uploadFile: UploadFile) => {
  const file = uploadFile.raw
  if (!file) return
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请上传图片文件')
    return
  }

  // 释放之前的 Object URL
  if (objectUrl) URL.revokeObjectURL(objectUrl)
  objectUrl = URL.createObjectURL(file)
  imageSrc.value = objectUrl
  annotations.value = []
  ElMessage.success('图片已加载，可以开始标注')
}

/**
 * 类型守卫：验证数据是否为有效的点位数组
 * @param value - 待验证的数据
 * @returns 如果是有效的点位数组返回 true，否则返回 false
 * 验证规则：
 * 1. 必须是数组
 * 2. 数组中每个元素必须是对象
 * 3. 每个对象必须包含 x 和 y 两个数字属性
 */
const isAnnotationPointList = (value: unknown): value is IAnnotationPoint[] => {
  if (!Array.isArray(value)) return false
  return value.every((point) => {
    if (!point || typeof point !== 'object') return false
    const data = point as IAnnotationPoint
    return typeof data.x === 'number' && typeof data.y === 'number'
  })
}

/**
 * 验证点位数量是否符合图形类型要求
 * @param type - 图形类型（line、rect、polygon）
 * @param points - 点位数组
 * @returns 如果点位数量符合要求返回 true，否则返回 false
 * 规则：
 * - 矩形和线段：需要恰好 2 个点
 * - 多边形：至少需要 3 个点
 */
const isValidPointCount = (type: ShapeType, points: IAnnotationPoint[]) => {
  if (type === 'polygon') return points.length >= 3
  return points.length === 2
}

/**
 * 将用户输入的点位数据还原到画布上
 * 功能流程：
 * 1. 解析用户输入的 JSON 字符串
 * 2. 验证数据格式是否正确
 * 3. 验证点位数量是否符合所选图形类型
 * 4. 将新的标注添加到画布中
 * 错误处理：
 * - JSON 解析失败：提示格式错误
 * - 数据格式不正确：提示正确的格式
 * - 点位数量不符合：提示所需点位数量
 */
const restoreAnnotations = () => {
  try {
    const value = JSON.parse(restorePointsJson.value)
    if (!isAnnotationPointList(value)) {
      ElMessage.warning('点位数据格式不正确，请输入 [{x:1,y:2}] 这种数组格式')
      return
    }
    if (!isValidPointCount(restoreShapeType.value, value)) {
      ElMessage.warning('矩形/线段需要 2 个点，多边形至少需要 3 个点')
      return
    }

    annotations.value = [
      ...annotations.value,
      {
        type: restoreShapeType.value,
        point: value,
      },
    ]
    ElMessage.success('点位已添加到画布')
  } catch {
    ElMessage.error('JSON 解析失败，请检查格式')
  }
}

/**
 * 组件卸载时的清理工作
 * 释放通过 URL.createObjectURL 创建的 Object URL，避免内存泄漏
 */
onUnmounted(() => {
  if (objectUrl) URL.revokeObjectURL(objectUrl)
})
</script>

<style scoped lang="scss">
.konva-demo-page {
  .konva-demo-card,
  .konva-data-card {
    margin-bottom: 20px;
  }

  .konva-demo-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .konva-data-header {
    margin-bottom: 0;
  }

  .konva-demo-title,
  .konva-data-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--el-text-color-primary);
  }

  .konva-demo-desc {
    margin-top: 8px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
    line-height: 1.7;
  }

  .simple-data-panel {
    display: grid;
    grid-template-columns: 400px minmax(0, 1fr);
    gap: 20px;
  }

  .data-input-section,
  .data-output-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .section-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--el-text-color-primary);
  }

  .stats {
    display: flex;
    gap: 12px;
    color: var(--el-text-color-secondary);
    font-size: 13px;

    .stat-rect {
      color: var(--el-color-success);
    }

    .stat-line {
      color: var(--el-color-primary);
    }

    .stat-polygon {
      color: var(--el-color-warning);
    }
  }

  .output-list {
    max-height: 180px;
    overflow-y: auto;
    padding: 12px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 8px;
    background: var(--el-fill-color-extra-light);
  }

  .empty-tip {
    padding: 20px;
    color: var(--el-text-color-secondary);
    text-align: center;
  }

  .output-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 8px 12px;
    margin-bottom: 8px;
    border-radius: 6px;
    background: var(--el-bg-color);
    font-size: 13px;

    &:last-child {
      margin-bottom: 0;
    }

    &.rect {
      border-left: 3px solid var(--el-color-success);
    }

    &.line {
      border-left: 3px solid var(--el-color-primary);
    }

    &.polygon {
      border-left: 3px solid var(--el-color-warning);
    }
  }

  .item-label {
    flex-shrink: 0;
    font-weight: 700;
    color: var(--el-text-color-primary);
  }

  .item-points {
    flex: 1;
    min-width: 0;
    color: var(--el-text-color-regular);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    word-break: break-all;
  }
}

@media (max-width: 992px) {
  .konva-demo-page {
    .simple-data-panel {
      grid-template-columns: 1fr;
    }

    .konva-demo-header {
      flex-direction: column;
    }
  }
}
</style>
