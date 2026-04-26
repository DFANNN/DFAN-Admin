<template>
  <div class="konva-demo-page">
    <BaseCard class="konva-demo-card">
      <template #header>
        <div class="konva-demo-header">
          <div>
            <div class="konva-demo-title">Konva 图片点位标注演示</div>
            <div class="konva-demo-desc">
              Konva 是一个基于 Canvas 的 2D 图形绘制库，适合做图片标注、拖拽编辑、区域绘制等交互场景。
              本示例使用 Konva 在原图坐标系中绘制矩形、线段、多边形；也可以导入点位数据进行还原。
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

      <div class="konva-format-panel">
        <div class="format-item">
          <div class="format-type rect">rect</div>
          <div class="format-desc">矩形：两个点，分别表示左上角与右下角。</div>
        </div>
        <div class="format-item">
          <div class="format-type line">line</div>
          <div class="format-desc">线段：两个点，分别表示起点与终点。</div>
        </div>
        <div class="format-item">
          <div class="format-type polygon">polygon</div>
          <div class="format-desc">多边形：三个及以上点，按顺序连接并闭合。</div>
        </div>
      </div>

      <KonvaImageAnnotationEditor
        ref="editorRef"
        v-model="annotations"
        :image-src="imageSrc"
        :height="620"
      />
    </BaseCard>

    <BaseCard class="konva-data-card">
      <template #header>
        <div class="konva-data-header">
          <div>
            <div class="konva-data-title">点位数据面板</div>
            <div class="konva-data-desc">
              左侧用于粘贴 JSON 并还原到画布，右侧实时查看或导出当前画布点位。
            </div>
          </div>
          <div class="konva-data-actions">
            <el-button @click="fillExampleJson">填入示例</el-button>
            <el-button type="primary" @click="restoreAnnotations">添加到画布</el-button>
            <el-button type="success" @click="exportAnnotations">刷新当前点位</el-button>
            <el-button type="danger" plain @click="clearAnnotations">清空</el-button>
          </div>
        </div>
      </template>

      <div class="point-workbench">
        <section class="restore-board">
          <div class="board-title-row">
            <div>
              <div class="board-title">还原点位</div>
              <div class="board-desc">先选择要还原的形状，再填入该形状的坐标点数组。</div>
            </div>
            <el-tag effect="plain">输入格式：[{ x, y }]</el-tag>
          </div>

          <div class="shape-picker">
            <button
              v-for="shape in shapeOptions"
              :key="shape.value"
              type="button"
              :class="['shape-option', shape.value, { active: restoreShapeType === shape.value }]"
              @click="restoreShapeType = shape.value"
            >
              <span class="shape-option-icon">
                <span :class="['shape-mini', shape.value]"></span>
              </span>
              <span class="shape-option-main">
                <span class="shape-option-label">{{ shape.label }}</span>
                <span class="shape-option-desc">{{ shape.desc }}</span>
              </span>
            </button>
          </div>

          <div class="restore-input-card">
            <div class="restore-input-head">
              <span>点位坐标数组</span>
              <span>{{ selectedShapeOption?.pointRule }}</span>
            </div>
            <el-input
              v-model="restorePointsJson"
              type="textarea"
              :rows="8"
              resize="none"
              placeholder='例如：[{"x":120,"y":100},{"x":360,"y":260}]'
            />
            <div class="restore-preview">
              <span>将还原为</span>
              <el-tag :class="['shape-tag', restoreShapeType]" effect="dark">
                {{ selectedShapeOption?.label }}
              </el-tag>
              <span>{{ restorePointCountText }}</span>
            </div>
          </div>
        </section>

        <section class="current-board">
          <div class="board-title-row">
            <div>
              <div class="board-title">当前点位</div>
              <div class="board-desc">按图形展示当前画布中的点位和坐标，可直接复制下方 JSON。</div>
            </div>
            <div class="summary-pills">
              <span class="summary-pill">总数 {{ annotations.length }}</span>
              <span class="summary-pill rect">矩形 {{ shapeCountMap.rect }}</span>
              <span class="summary-pill line">线段 {{ shapeCountMap.line }}</span>
              <span class="summary-pill polygon">多边形 {{ shapeCountMap.polygon }}</span>
            </div>
          </div>

          <el-empty
            v-if="!currentAnnotationCards.length"
            description="暂无点位，请在画布绘制或从左侧还原"
          />
          <div v-else class="annotation-visual-list">
            <article
              v-for="item in currentAnnotationCards"
              :key="item.index"
              :class="['annotation-visual-card', item.type]"
            >
              <div class="annotation-card-side">
                <span :class="['shape-mini', item.type]"></span>
              </div>
              <div class="annotation-card-content">
                <div class="annotation-card-head">
                  <div>
                    <div class="annotation-card-title">{{ item.label }} {{ item.index + 1 }}</div>
                    <div class="annotation-card-subtitle">{{ item.desc }}</div>
                  </div>
                  <el-tag :class="['shape-tag', item.type]" effect="dark">{{ item.type }}</el-tag>
                </div>

                <div class="coordinate-grid">
                  <div
                    v-for="(point, pointIndex) in item.point"
                    :key="pointIndex"
                    class="coordinate-chip"
                  >
                    <span class="coordinate-index">P{{ pointIndex + 1 }}</span>
                    <span>x: {{ point.x }}</span>
                    <span>y: {{ point.y }}</span>
                  </div>
                </div>

                <div class="annotation-json-line">
                  <span>输出：</span>
                  <code>{{ item.outputText }}</code>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, type UploadFile } from 'element-plus'
import KonvaImageAnnotationEditor from './KonvaImageAnnotationEditor.vue'

defineOptions({ name: 'KonvaView' })

type ShapeType = 'line' | 'rect' | 'polygon'

interface IAnnotationPoint {
  x: number
  y: number
}

interface IAnnotationItem {
  type: ShapeType
  point: IAnnotationPoint[]
}

const editorRef = useTemplateRef<InstanceType<typeof KonvaImageAnnotationEditor>>('editorRef')
const imageSrc = ref('')
const annotations = ref<IAnnotationItem[]>([])
const restoreShapeType = ref<ShapeType>('rect')
const restorePointsJson = ref('')
let objectUrl = ''

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

const shapeLabelMap = shapeOptions.reduce(
  (map, item) => {
    map[item.value] = item.label
    return map
  },
  {} as Record<ShapeType, string>,
)

const selectedShapeOption = computed(() => {
  return shapeOptions.find((item) => item.value === restoreShapeType.value)
})

const parsedRestorePoints = computed(() => {
  try {
    const value = JSON.parse(restorePointsJson.value || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
})

const restorePointCountText = computed(() => {
  return `当前 ${parsedRestorePoints.value.length} 个点`
})

const shapeCountMap = computed(() => {
  return annotations.value.reduce(
    (map, item) => {
      map[item.type] += 1
      return map
    },
    { line: 0, rect: 0, polygon: 0 } as Record<ShapeType, number>,
  )
})

const currentAnnotationCards = computed(() => {
  return annotations.value.map((item, index) => ({
    ...item,
    index,
    label: shapeLabelMap[item.type],
    desc: shapeOptions.find((shape) => shape.value === item.type)?.desc || '',
    outputText: JSON.stringify({ type: item.type, point: item.point }),
  }))
})

const exampleAnnotations: IAnnotationItem[] = [
  {
    type: 'rect',
    point: [
      { x: 120, y: 100 },
      { x: 360, y: 260 },
    ],
  },
  {
    type: 'line',
    point: [
      { x: 420, y: 120 },
      { x: 620, y: 280 },
    ],
  },
  {
    type: 'polygon',
    point: [
      { x: 180, y: 360 },
      { x: 320, y: 330 },
      { x: 420, y: 430 },
      { x: 260, y: 500 },
    ],
  },
]

const handleImageChange = (uploadFile: UploadFile) => {
  const file = uploadFile.raw
  if (!file) return
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请上传图片文件')
    return
  }

  if (objectUrl) URL.revokeObjectURL(objectUrl)
  objectUrl = URL.createObjectURL(file)
  imageSrc.value = objectUrl
  annotations.value = []
  ElMessage.success('图片已加载，可以开始标注')
}

const fillExampleJson = () => {
  restoreShapeType.value = 'rect'
  restorePointsJson.value = JSON.stringify(exampleAnnotations[0]?.point || [], null, 2)
}

const isAnnotationPointList = (value: unknown): value is IAnnotationPoint[] => {
  if (!Array.isArray(value)) return false
  return value.every((point) => {
    if (!point || typeof point !== 'object') return false
    const data = point as IAnnotationPoint
    return typeof data.x === 'number' && typeof data.y === 'number'
  })
}

const isValidPointCount = (type: ShapeType, points: IAnnotationPoint[]) => {
  if (type === 'polygon') return points.length >= 3
  return points.length === 2
}

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

const exportAnnotations = () => {
  const data = editorRef.value?.getOutputData?.()
  if (!data) return
  annotations.value = data
  ElMessage.success('已刷新当前点位')
}

const clearAnnotations = () => {
  annotations.value = []
}

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

  .konva-demo-header,
  .konva-data-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .konva-demo-title,
  .konva-data-title {
    margin-bottom: 8px;
    font-size: 18px;
    font-weight: 700;
    color: var(--el-text-color-primary);
  }

  .konva-demo-desc,
  .konva-data-desc {
    max-width: 820px;
    color: var(--el-text-color-secondary);
    line-height: 1.7;
  }

  .konva-format-panel {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }

  .format-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 12px;
    background: var(--el-fill-color-extra-light);
  }

  .format-type {
    flex-shrink: 0;
    min-width: 72px;
    padding: 4px 10px;
    border-radius: 999px;
    color: var(--el-color-white);
    text-align: center;
    font-weight: 700;

    &.rect {
      background: var(--el-color-success);
    }

    &.line {
      background: var(--el-color-primary);
    }

    &.polygon {
      background: var(--el-color-warning);
    }
  }

  .format-desc {
    color: var(--el-text-color-secondary);
    line-height: 1.6;
  }

  .konva-data-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 10px;
  }

  .point-workbench {
    display: grid;
    gap: 18px;
    grid-template-columns: 420px minmax(0, 1fr);
  }

  .restore-board,
  .current-board {
    min-width: 0;
    padding: 18px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 18px;
    background:
      linear-gradient(180deg, rgb(255 255 255 / 72%), rgb(255 255 255 / 36%)),
      var(--el-bg-color-page);
  }

  .board-title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 16px;
  }

  .board-title {
    margin-bottom: 6px;
    color: var(--el-text-color-primary);
    font-size: 17px;
    font-weight: 700;
  }

  .board-desc {
    color: var(--el-text-color-secondary);
    line-height: 1.6;
  }

  .shape-picker {
    display: grid;
    gap: 12px;
    margin-bottom: 16px;
  }

  .shape-option {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 14px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 16px;
    background: var(--el-bg-color);
    color: var(--el-text-color-primary);
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .shape-option:hover,
  .shape-option.active {
    border-color: var(--el-color-primary);
    box-shadow: 0 10px 24px rgb(64 158 255 / 12%);
    transform: translateY(-1px);
  }

  .shape-option-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    border-radius: 14px;
    background: var(--el-fill-color-light);
  }

  .shape-option-main {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 4px;
  }

  .shape-option-label {
    font-size: 15px;
    font-weight: 700;
  }

  .shape-option-desc {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  .shape-mini {
    display: inline-block;
    width: 24px;
    height: 24px;

    &.rect {
      border: 3px solid var(--el-color-success);
      border-radius: 5px;
      background: rgb(103 194 58 / 12%);
    }

    &.line {
      position: relative;
    }

    &.line::before {
      position: absolute;
      top: 11px;
      left: 1px;
      width: 25px;
      height: 3px;
      border-radius: 999px;
      background: var(--el-color-primary);
      content: '';
      transform: rotate(-35deg);
      transform-origin: center;
    }

    &.polygon {
      background: var(--el-color-warning);
      clip-path: polygon(50% 0, 100% 36%, 82% 100%, 18% 100%, 0 36%);
    }
  }

  .restore-input-card {
    padding: 14px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 16px;
    background: var(--el-bg-color);
  }

  .restore-input-head,
  .restore-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  .restore-input-head span:first-child {
    color: var(--el-text-color-primary);
    font-size: 14px;
    font-weight: 700;
  }

  .restore-preview {
    justify-content: flex-start;
    margin: 12px 0 0;
  }

  .summary-pills {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    max-width: 540px;
  }

  .summary-pill {
    padding: 5px 10px;
    border-radius: 999px;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 12px;
    font-weight: 700;

    &.rect {
      color: var(--el-color-success);
    }

    &.line {
      color: var(--el-color-primary);
    }

    &.polygon {
      color: var(--el-color-warning);
    }
  }

  .annotation-visual-list {
    display: grid;
    gap: 12px;
    max-height: 420px;
    overflow: auto;
    padding-right: 4px;
  }

  .annotation-visual-card {
    display: grid;
    overflow: hidden;
    border: 1px solid var(--el-border-color-light);
    border-radius: 18px;
    background: var(--el-bg-color);
    grid-template-columns: 68px minmax(0, 1fr);

    &.rect {
      border-left: 4px solid var(--el-color-success);
    }

    &.line {
      border-left: 4px solid var(--el-color-primary);
    }

    &.polygon {
      border-left: 4px solid var(--el-color-warning);
    }
  }

  .annotation-card-side {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--el-fill-color-extra-light);
  }

  .annotation-card-content {
    min-width: 0;
    padding: 14px;
  }

  .annotation-card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .annotation-card-title {
    margin-bottom: 4px;
    color: var(--el-text-color-primary);
    font-weight: 700;
  }

  .annotation-card-subtitle {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  .shape-tag {
    border-color: transparent;

    &.rect {
      background: var(--el-color-success);
    }

    &.line {
      background: var(--el-color-primary);
    }

    &.polygon {
      background: var(--el-color-warning);
    }
  }

  .coordinate-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .coordinate-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 999px;
    background: var(--el-fill-color-extra-light);
    color: var(--el-text-color-regular);
    font-size: 13px;
  }

  .coordinate-index {
    color: var(--el-color-primary);
    font-weight: 800;
  }

  .annotation-json-line {
    overflow: hidden;
    padding: 10px 12px;
    border-radius: 12px;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 13px;
    line-height: 1.6;
  }

  .annotation-json-line code {
    color: var(--el-text-color-primary);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    word-break: break-all;
  }

  .data-panel {
    height: 100%;
    padding: 14px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 14px;
    background: var(--el-bg-color-page);
  }

  .data-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
    color: var(--el-text-color-primary);
    font-weight: 700;
  }

  .output-preview {
    min-height: 320px;
    max-height: 320px;
    overflow: auto;
    margin: 0;
    padding: 12px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    background: var(--el-bg-color);
    color: var(--el-text-color-regular);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 13px;
    line-height: 1.6;
    white-space: pre-wrap;
  }
}

@media (max-width: 992px) {
  .konva-demo-page {
    .konva-format-panel,
    .point-workbench {
      grid-template-columns: 1fr;
    }

    .konva-demo-header,
    .konva-data-header {
      flex-direction: column;
    }

    .konva-data-actions {
      justify-content: flex-start;
    }
  }
}
</style>
