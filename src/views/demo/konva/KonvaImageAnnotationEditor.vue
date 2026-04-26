<!--
  Konva 图片点位标注编辑器

  组件用途：
  - 接收一张图片并在图片上进行点位标注。
  - 支持矩形、线段、多边形三种标注类型。
  - 支持通过 v-model 还原外部点位，也会实时输出基于原图像素坐标的点位数据。
  - 适合用于摄像头区域标定、目标检测框修正、图片巡检点位配置等业务场景。

  数据格式：
  [{ type: 'rect' | 'line' | 'polygon', point: [{ x: number, y: number }] }]
-->

<template>
  <div class="annotation-editor">
    <div class="annotation-editor__stage-panel">
      <div ref="stageWrapperRef" class="annotation-editor__stage-wrapper">
        <div v-if="props.loading" class="annotation-editor__empty">
          <el-icon class="is-loading"><Loading /></el-icon>
          <div class="annotation-editor__empty-title">图片加载中</div>
          <div class="annotation-editor__empty-desc">正在获取当前摄像头截图，请稍候。</div>
        </div>

        <div v-else-if="!imageElement || !props.imageSrc" class="annotation-editor__empty">
          <PhotoIcon class="annotation-editor__empty-icon" />
          <div class="annotation-editor__empty-title">当前摄像头暂无图片</div>
          <div class="annotation-editor__empty-desc">暂未获取到可用截图，请检查摄像头状态。</div>
        </div>

        <div v-else class="annotation-editor__stage-center">
          <v-stage
            ref="stageRef"
            :config="stageConfig"
            @mousedown="handleStagePointerDown"
            @mousemove="handleStagePointerMove"
            @mouseup="handleStagePointerUp"
            @mouseleave="handleStagePointerLeave"
          >
            <v-layer>
              <v-image :config="imageConfig" />

              <template v-for="shape in shapes" :key="shape.id">
                <template v-if="shape.type === 'line'">
                  <v-line
                    :config="getLineHitConfig(shape)"
                    @click="handleShapeClick(shape.id)"
                    @dblclick="handleShapeDoubleClick(shape.id)"
                    @dragstart="handleShapeDragStart(shape.id)"
                    @dragmove="handleLineDragMove($event, shape.id)"
                    @dragend="handleShapeDragEnd($event, shape)"
                  />
                  <v-line :config="getLineConfig(shape, shape.id === selectedShapeId)" />
                </template>

                <v-rect
                  v-else-if="shape.type === 'rect'"
                  :config="getRectConfig(shape, shape.id === selectedShapeId)"
                  @click="handleShapeClick(shape.id)"
                  @dblclick="handleShapeDoubleClick(shape.id)"
                  @dragstart="handleShapeDragStart(shape.id)"
                  @dragend="handleShapeDragEnd($event, shape)"
                />

                <v-line
                  v-else
                  :config="getPolygonConfig(shape, shape.id === selectedShapeId)"
                  @click="handleShapeClick(shape.id)"
                  @dblclick="handleShapeDoubleClick(shape.id)"
                  @dragstart="handleShapeDragStart(shape.id)"
                  @dragend="handleShapeDragEnd($event, shape)"
                />
              </template>

              <v-line v-if="linePreviewConfig" :config="linePreviewConfig" />
              <v-rect v-if="rectPreviewConfig" :config="rectPreviewConfig" />
              <v-line v-if="polygonPreviewConfig" :config="polygonPreviewConfig" />

              <v-circle
                v-for="draftHandle in polygonDraftHandles"
                :key="draftHandle.id"
                :config="draftHandle"
                @click="handlePolygonDraftHandleClick(draftHandle)"
              />

              <v-circle
                v-for="editHandle in editableHandles"
                :key="editHandle.id"
                :config="editHandle"
                @dragmove="handleEditHandleDrag($event, editHandle)"
                @dragend="handleEditHandleDrag($event, editHandle)"
              />

              <v-transformer ref="transformerRef" :config="transformerConfig" />
            </v-layer>
          </v-stage>
        </div>
      </div>
    </div>

    <div class="annotation-editor__action-panel">
      <div class="annotation-editor__action-group">
        <div v-for="action in toolActions" :key="action.key" class="annotation-editor__action-row">
          <el-button
            class="annotation-editor__action-button"
            :type="action.active ? 'primary' : action.danger ? 'danger' : 'default'"
            :disabled="action.disabled"
            @click="action.onClick"
          >
            {{ action.label }}
          </el-button>
          <el-tooltip :content="action.description" placement="top">
            <el-icon class="annotation-editor__action-info"><InfoFilled /></el-icon>
          </el-tooltip>
        </div>
      </div>

      <div class="annotation-editor__action-group">
        <div
          v-for="action in commandActions"
          :key="action.key"
          class="annotation-editor__action-row"
        >
          <el-button
            class="annotation-editor__action-button"
            :type="action.danger ? 'danger' : 'default'"
            :disabled="action.disabled"
            @click="action.onClick"
          >
            {{ action.label }}
          </el-button>
          <el-tooltip :content="action.description" placement="top">
            <el-icon class="annotation-editor__action-info"><InfoFilled /></el-icon>
          </el-tooltip>
        </div>
      </div>

      <el-card shadow="never" class="annotation-editor__card">
        <template #header>当前状态</template>
        <div class="annotation-editor__status-list">
          <div>当前工具：{{ activeToolLabel }}</div>
          <div v-if="props.loading">图片状态：加载中</div>
          <div v-if="imageMeta.width && imageMeta.height">
            原图尺寸：{{ imageMeta.width }} x {{ imageMeta.height }}
          </div>
          <div v-if="renderMetrics.renderWidth && renderMetrics.renderHeight">
            显示尺寸：{{ Math.round(renderMetrics.renderWidth) }} x
            {{ Math.round(renderMetrics.renderHeight) }}
          </div>
          <div>图形数量：{{ shapes.length }}</div>
          <!-- <div v-if="pendingDraftMessage" class="annotation-editor__warning">
            {{ pendingDraftMessage }}
          </div> -->
          <!-- <div v-if="editingShapeId">当前正在编辑点位，双击图形进入，点击空白退出。</div> -->
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading, InfoFilled } from '@element-plus/icons-vue'
import { PhotoIcon } from '@heroicons/vue/24/outline'
import { useEventListener, useResizeObserver } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import {
  Circle as VCircle,
  Image as VImage,
  Layer as VLayer,
  Line as VLine,
  Rect as VRect,
  Stage as VStage,
  Transformer as VTransformer,
} from 'vue-konva'

defineOptions({ name: 'KonvaImageAnnotationEditor' })

/** 标注支持的图形类型。 */
type ShapeType = 'line' | 'rect' | 'polygon'

/** 对外暴露的点位结构，坐标基于原图像素。 */
interface AnnotationPoint {
  x: number
  y: number
}

/** 对外暴露的标注结构。 */
interface AnnotationValueItem {
  type: ShapeType
  point: AnnotationPoint[]
}

/** 组件内部使用的图形结构，额外带唯一 id。 */
interface InternalShape extends AnnotationValueItem {
  id: string
}

/** 画布显示坐标。 */
interface DisplayPoint {
  x: number
  y: number
}

/** 绘制中的矩形草稿。 */
interface RectDraft {
  start: AnnotationPoint | null
  current: AnnotationPoint | null
  isDrawing: boolean
}

/** 编辑手柄的类型。 */
type EditHandleKind = 'line-point' | 'polygon-point' | 'rect-corner'

/** 编辑手柄元数据。 */
interface EditHandle {
  id: string
  shapeId: string
  kind: EditHandleKind
  pointIndex?: number
  corner?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'
  x: number
  y: number
  radius: number
  fill: string
  stroke: string
  strokeWidth: number
  draggable: boolean
}

/** Konva Vue 事件的最小使用类型。 */
interface KonvaLikeNode {
  x: () => number
  y: () => number
  position: (value: DisplayPoint) => void
}

interface KonvaLikeEvent {
  target?: KonvaLikeNode
}

interface KonvaStageLike {
  getPointerPosition?: () => DisplayPoint | null
  findOne?: (selector: string) => unknown
}

interface KonvaLayerLike {
  batchDraw: () => void
}

interface KonvaTransformerLike {
  nodes: (nodes: unknown[]) => void
  getLayer: () => KonvaLayerLike | null
  getStage: () => KonvaStageLike | null
}

interface KonvaComponentRef<TNode> {
  getNode: () => TNode
}

/** 右侧操作按钮的数据结构。 */
interface ActionButtonItem {
  key: string
  label: string
  description: string
  disabled: boolean
  active?: boolean
  danger?: boolean
  onClick: () => void
}

interface IProps {
  // 图片
  imageSrc: string
  // 图片是否仍在外部加载中
  loading?: boolean
  // 只读模式，开启后无法进行任何编辑操作，仅展示图片和标注
  readonly?: boolean
  // 禁用模式，开启后无法进行任何操作，且标注以灰色展示，适用于审核场景
  disabled?: boolean
  // 组件高度
  height?: number
  // 最小舞台高度，组件整体高度会优先使用外部传入的 height，若未传入则使用 minStageHeight，确保舞台有足够空间展示图片和标注
  minStageHeight?: number
}

/** 组件属性，图片建议由外部传入，组件只负责渲染与编辑。 */
const props = withDefaults(defineProps<IProps>(), {
  loading: false,
  readonly: false,
  disabled: false,
  height: 600,
  minStageHeight: 600,
})

/** 组件双向绑定的标注数据。 */
const modelValue = defineModel<AnnotationValueItem[]>({ required: true })

/** Element Plus CSS 变量在 Konva 配置中需要作为真实颜色值使用。 */
const getCssVar = (name: string, fallback: string) => {
  if (typeof window === 'undefined') return fallback
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

const elementColors = computed(() => ({
  primary: getCssVar('--el-color-primary', '#409eff'),
  primaryLight: getCssVar('--el-color-primary-light-3', '#79bbff'),
  success: getCssVar('--el-color-success', '#67c23a'),
  successDark: getCssVar('--el-color-success-dark-2', '#529b2e'),
  warning: getCssVar('--el-color-warning', '#e6a23c'),
  warningDark: getCssVar('--el-color-warning-dark-2', '#b88230'),
  bg: getCssVar('--el-bg-color', '#ffffff'),
}))

/** Stage 实例引用。 */
const stageRef = ref<KonvaComponentRef<KonvaStageLike>>()

/** Transformer 实例引用。 */
const transformerRef = ref<KonvaComponentRef<KonvaTransformerLike>>()

/** 画布外层容器引用。 */
const stageWrapperRef = ref<HTMLElement>()

/** 当前加载完成的图片元素。 */
const imageElement = ref<HTMLImageElement>()

/** 当前激活的绘制工具。 */
const activeTool = ref<ShapeType>('rect')

/** 当前选中的图形 id。 */
const selectedShapeId = ref<string>()

/** 当前处于点位编辑模式的图形 id。 */
const editingShapeId = ref<string>()

/** 线段拖拽时的临时偏移，用于保证视觉跟手。 */
const lineDragOffsetMap = ref<Record<string, DisplayPoint>>({})

/** 组件内部维护的图形列表。 */
const shapes = ref<InternalShape[]>([])

/** 多边形绘制中的草稿点。 */
const polygonDraft = ref<AnnotationPoint[]>([])

/** 鼠标当前在原图坐标系中的位置。 */
const currentPointer = ref<AnnotationPoint>()

/** 图片原始尺寸信息。 */
const imageMeta = reactive({
  width: 0,
  height: 0,
})

/** 画布容器尺寸信息。 */
const wrapperSize = reactive({
  width: 0,
  height: 0,
})

/** 矩形绘制过程中的草稿状态。 */
const rectDraft = reactive<RectDraft>({
  start: null,
  current: null,
  isDrawing: false,
})

/** 标记当前 model 是否由组件内部主动回写，避免 watch 循环。 */
const syncingModelFromInner = ref(false)

/** 线段草稿的首点。 */
const lineDraftFirstPoint = ref<AnnotationPoint | null>(null)

/** 图形类型与按钮文案的映射。 */
const toolLabelMap: Record<ShapeType, string> = {
  line: '线段',
  rect: '矩形',
  polygon: '多边形',
}

/** 不同图形使用的 token 颜色。 */
const shapeColorMap = computed(() => ({
  line: {
    stroke: elementColors.value.primary,
    strokeActive: elementColors.value.primaryLight,
  },
  rect: {
    stroke: elementColors.value.success,
    strokeActive: elementColors.value.successDark,
    fill: 'rgba(82, 196, 26, 0.14)',
    fillActive: 'rgba(82, 196, 26, 0.24)',
    fillPreview: 'rgba(82, 196, 26, 0.12)',
  },
  polygon: {
    stroke: elementColors.value.warning,
    strokeActive: elementColors.value.warningDark,
    fill: 'rgba(250, 140, 22, 0.14)',
    fillActive: 'rgba(250, 140, 22, 0.24)',
  },
}))

/** 右侧显示的当前工具名称。 */
const activeToolLabel = computed(() => toolLabelMap[activeTool.value])

/** 标注组件整体高度，优先使用外部传入的 height。 */
const editorHeight = computed(() => props.height || props.minStageHeight)

/** 标注组件整体高度的 CSS 值。 */
const editorHeightCssValue = computed(() => `${editorHeight.value}px`)

/** 根据容器尺寸和原图尺寸计算实际渲染参数。 */
const renderMetrics = computed(() => {
  const containerWidth = wrapperSize.width || 960
  const containerHeight = wrapperSize.height || editorHeight.value

  if (!imageMeta.width || !imageMeta.height) {
    return {
      stageWidth: containerWidth,
      stageHeight: containerHeight,
      renderWidth: 0,
      renderHeight: 0,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    }
  }

  const scale = Math.min(containerWidth / imageMeta.width, containerHeight / imageMeta.height)
  const renderWidth = imageMeta.width * scale
  const renderHeight = imageMeta.height * scale

  return {
    stageWidth: containerWidth,
    stageHeight: containerHeight,
    renderWidth,
    renderHeight,
    scale,
    offsetX: (containerWidth - renderWidth) / 2,
    offsetY: (containerHeight - renderHeight) / 2,
  }
})

/** Stage 的尺寸配置。 */
const stageConfig = computed(() => ({
  width: renderMetrics.value.stageWidth,
  height: renderMetrics.value.stageHeight,
}))

/** 图片节点配置。 */
const imageConfig = computed(() => ({
  image: imageElement.value,
  x: renderMetrics.value.offsetX,
  y: renderMetrics.value.offsetY,
  width: renderMetrics.value.renderWidth,
  height: renderMetrics.value.renderHeight,
  listening: false,
}))

/** Transformer 配置，当前只作为选中框与移动辅助，不开启缩放锚点。 */
const transformerConfig = computed(() => ({
  rotateEnabled: false,
  resizeEnabled: false,
  enabledAnchors: [],
  borderStroke: elementColors.value.primary,
  borderStrokeWidth: 1,
  borderDash: [6, 4],
  padding: 4,
  ignoreStroke: true,
}))

/** 是否可完成多边形闭合。 */
const canFinishPolygon = computed(() => polygonDraft.value.length >= 3)

/** 是否允许点击起点闭合多边形。 */
const canClosePolygonByStartPoint = computed(() => polygonDraft.value.length >= 3)

/** 当前是否允许撤销草稿点。 */
const canUndoDraft = computed(() => {
  if (activeTool.value === 'polygon') return polygonDraft.value.length > 0
  if (activeTool.value === 'line') return !!lineDraftFirstPoint.value
  if (activeTool.value === 'rect') return rectDraft.isDrawing || !!rectDraft.start
  return false
})

/** 当前未完成草稿的提示文案。 */
const pendingDraftMessage = computed(() => {
  if (polygonDraft.value.length > 0) {
    return `存在未闭合多边形草稿，提交前必须先闭合或撤销。当前点数：${polygonDraft.value.length}`
  }

  if (lineDraftFirstPoint.value) {
    return '存在未完成线段草稿，提交前必须先完成或撤销。'
  }

  if (rectDraft.isDrawing || rectDraft.start) {
    return '存在未完成矩形草稿，提交前必须先完成或撤销。'
  }

  return ''
})

/** 编辑中的图形对象。 */
const editingShape = computed(() => {
  return shapes.value.find((item) => item.id === editingShapeId.value)
})

/** 右侧工具按钮列表。 */
const toolActions = computed<ActionButtonItem[]>(() => {
  const commonDisabled = props.disabled || props.readonly

  return [
    {
      key: 'line',
      label: '线段工具',
      description: '点击两次落点生成一条线段。',
      disabled: commonDisabled,
      active: activeTool.value === 'line',
      onClick: () => setActiveTool('line'),
    },
    {
      key: 'rect',
      label: '矩形工具',
      description: '按下并拖拽生成矩形区域。',
      disabled: commonDisabled,
      active: activeTool.value === 'rect',
      onClick: () => setActiveTool('rect'),
    },
    {
      key: 'polygon',
      label: '多边形工具',
      description: '连续点击落点，点击起点或按 Enter 完成闭合。',
      disabled: commonDisabled,
      active: activeTool.value === 'polygon',
      onClick: () => setActiveTool('polygon'),
    },
  ]
})

/** 右侧命令按钮列表。 */
const commandActions = computed<ActionButtonItem[]>(() => {
  const commonDisabled = props.disabled || props.readonly

  return [
    {
      key: 'edit',
      label: '编辑选中',
      description: '选中一个已绘制图形后，点击进入点位编辑模式，也可以通过双击图形进入编辑模式。',
      disabled: commonDisabled || !selectedShapeId.value,
      onClick: enterSelectedShapeEditMode,
    },
    {
      key: 'finish',
      label: '完成多边形',
      description:
        '当多边形已经有至少 3 个点时，手动执行闭合，也可以通过点击起点或按 Enter 键完成闭合。',
      disabled: commonDisabled || !canFinishPolygon.value,
      onClick: finishPolygon,
    },
    {
      key: 'undo',
      label: '撤销草稿',
      description: '撤销当前未完成绘制中的最后一步，也可以通过按 Esc 键触发。',
      disabled: commonDisabled || !canUndoDraft.value,
      onClick: undoCurrentDraft,
    },
    {
      key: 'delete',
      label: '删除选中',
      description: '删除当前选中的图形。',
      disabled: commonDisabled || !selectedShapeId.value,
      danger: true,
      onClick: removeSelectedShape,
    },
    {
      key: 'clear',
      label: '清空全部',
      description: '清空当前组件中的所有标注图形。',
      disabled: commonDisabled || shapes.value.length === 0,
      danger: true,
      onClick: clearAllShapes,
    },
  ]
})

/** 多边形草稿的可点击闭合点。 */
const polygonDraftHandles = computed(() => {
  return polygonDraft.value.map((point, index) => {
    const displayPoint = originalToDisplayPoint(point)
    const isStartPoint = index === 0
    const canClose = isStartPoint && canClosePolygonByStartPoint.value

    return {
      id: `polygon-draft-${index}`,
      index,
      x: displayPoint.x,
      y: displayPoint.y,
      radius: canClose ? 7 : 4,
      fill: canClose ? elementColors.value.warning : elementColors.value.warningDark,
      stroke: elementColors.value.bg,
      strokeWidth: canClose ? 2 : 1,
      listening: canClose,
    }
  })
})

/** 当前编辑模式下的顶点手柄列表。 */
const editableHandles = computed<EditHandle[]>(() => {
  const shape = editingShape.value
  if (!shape) return []

  if (shape.type === 'line') {
    return shape.point.map((point, pointIndex) => {
      const displayPoint = originalToDisplayPoint(point)
      return {
        id: `${shape.id}-line-${pointIndex}`,
        shapeId: shape.id,
        kind: 'line-point',
        pointIndex,
        x: displayPoint.x,
        y: displayPoint.y,
        radius: 7,
        fill: elementColors.value.bg,
        stroke: elementColors.value.primary,
        strokeWidth: 2,
        draggable: !props.disabled && !props.readonly,
      }
    })
  }

  if (shape.type === 'polygon') {
    return shape.point.map((point, pointIndex) => {
      const displayPoint = originalToDisplayPoint(point)
      return {
        id: `${shape.id}-polygon-${pointIndex}`,
        shapeId: shape.id,
        kind: 'polygon-point',
        pointIndex,
        x: displayPoint.x,
        y: displayPoint.y,
        radius: 7,
        fill: elementColors.value.bg,
        stroke: elementColors.value.warning,
        strokeWidth: 2,
        draggable: !props.disabled && !props.readonly,
      }
    })
  }

  const rectBox = getRectBox(shape.point)
  const corners = [
    { corner: 'top-left' as const, point: { x: rectBox.left, y: rectBox.top } },
    { corner: 'top-right' as const, point: { x: rectBox.right, y: rectBox.top } },
    { corner: 'bottom-right' as const, point: { x: rectBox.right, y: rectBox.bottom } },
    { corner: 'bottom-left' as const, point: { x: rectBox.left, y: rectBox.bottom } },
  ]

  return corners.map((item) => {
    const displayPoint = originalToDisplayPoint(item.point)
    return {
      id: `${shape.id}-${item.corner}`,
      shapeId: shape.id,
      kind: 'rect-corner',
      corner: item.corner,
      x: displayPoint.x,
      y: displayPoint.y,
      radius: 7,
      fill: elementColors.value.bg,
      stroke: elementColors.value.success,
      strokeWidth: 2,
      draggable: !props.disabled && !props.readonly,
    }
  })
})

/** 线段绘制预览。 */
const linePreviewConfig = computed(() => {
  if (!lineDraftFirstPoint.value) return null

  const start = originalToDisplayPoint(lineDraftFirstPoint.value)
  const end = originalToDisplayPoint(currentPointer.value || lineDraftFirstPoint.value)

  return {
    points: [start.x, start.y, end.x, end.y],
    stroke: elementColors.value.primary,
    strokeWidth: 2,
    dash: [8, 6],
    lineCap: 'round',
    lineJoin: 'round',
    listening: false,
  }
})

/** 矩形绘制预览。 */
const rectPreviewConfig = computed(() => {
  if (!rectDraft.start || !rectDraft.current) return null

  const start = originalToDisplayPoint(rectDraft.start)
  const current = originalToDisplayPoint(rectDraft.current)

  return {
    x: Math.min(start.x, current.x),
    y: Math.min(start.y, current.y),
    width: Math.abs(current.x - start.x),
    height: Math.abs(current.y - start.y),
    stroke: elementColors.value.success,
    strokeWidth: 2,
    dash: [8, 6],
    fill: shapeColorMap.value.rect.fillPreview,
    listening: false,
  }
})

/** 多边形绘制预览。 */
const polygonPreviewConfig = computed(() => {
  if (!polygonDraft.value.length) return null

  const previewPoints = [...polygonDraft.value]
  if (currentPointer.value) previewPoints.push(currentPointer.value)

  return {
    points: convertPointsToDisplayArray(previewPoints),
    stroke: elementColors.value.warning,
    strokeWidth: 2,
    dash: currentPointer.value ? [8, 6] : undefined,
    lineCap: 'round',
    lineJoin: 'round',
    closed: false,
    listening: false,
  }
})

/** 监听组件尺寸变化，以便重新计算图片绘制区域。 */
useResizeObserver(stageWrapperRef, (entries) => {
  const rect = entries[0]?.contentRect
  if (!rect) return
  wrapperSize.width = rect.width
  wrapperSize.height = rect.height
})

/** 监听外部的 v-model 变化并同步到内部 shapes。 */
watch(
  modelValue,
  (value) => {
    if (syncingModelFromInner.value) {
      syncingModelFromInner.value = false
      return
    }
    syncShapesFromModel(value || [])
  },
  { deep: true, immediate: true },
)

/** 监听图片地址变化并重新加载图片。 */
watch(
  () => props.imageSrc,
  async (value) => {
    await loadImageFromProp(value)
  },
  { immediate: true },
)

/** 切换工具时清空当前草稿，避免跨工具遗留状态。 */
watch(activeTool, () => {
  clearDraftState()
  editingShapeId.value = undefined
})

/** 选中图形和编辑模式变化时，刷新 Transformer 绑定。 */
watch(
  [selectedShapeId, editingShapeId, shapes],
  async () => {
    await nextTick()
    updateTransformer()
  },
  { deep: true },
)

/** 监听键盘快捷键，支持 Enter 完成多边形、Esc 撤销草稿或退出编辑。 */
useEventListener(window, 'keydown', (event) => {
  const target = event.target as HTMLElement | null
  const tagName = target?.tagName
  const isEditableTarget =
    tagName === 'INPUT' || tagName === 'TEXTAREA' || target?.isContentEditable === true
  if (isEditableTarget) return

  if (event.key === 'Enter') {
    if (canFinishPolygon.value) {
      event.preventDefault()
      finishPolygon()
    }
    return
  }

  if (event.key !== 'Escape') return

  if (editingShapeId.value) {
    editingShapeId.value = undefined
    return
  }

  if (canUndoDraft.value) {
    undoCurrentDraft()
  }
})

/** 切换当前工具。 */
function setActiveTool(tool: ShapeType) {
  if (props.disabled || props.readonly) return
  activeTool.value = tool
}

/** 从外部图片地址加载原图。 */
async function loadImageFromProp(src: string) {
  if (!src) {
    imageElement.value = undefined
    imageMeta.width = 0
    imageMeta.height = 0
    return
  }

  try {
    const image = await loadImage(src)
    imageElement.value = image
    imageMeta.width = image.naturalWidth || image.width
    imageMeta.height = image.naturalHeight || image.height
  } catch {
    imageElement.value = undefined
    imageMeta.width = 0
    imageMeta.height = 0
    ElMessage.error('图片加载失败，请检查外部传入的 imageSrc')
  }
}

/** 处理画布按下事件，根据当前工具进入不同绘制分支。 */
function handleStagePointerDown(event: { target?: unknown }) {
  if (props.disabled || props.readonly) return

  const stage = stageRef.value?.getNode?.()
  if (event?.target !== stage) return

  if (editingShapeId.value) {
    editingShapeId.value = undefined
    selectedShapeId.value = undefined
    return
  }

  selectedShapeId.value = undefined
  editingShapeId.value = undefined

  const point = getCurrentOriginalPointer(false)
  if (!point || !imageElement.value) return

  if (activeTool.value === 'line') {
    if (!lineDraftFirstPoint.value) {
      lineDraftFirstPoint.value = point
      currentPointer.value = point
      return
    }

    if (!hasEnoughDistance(lineDraftFirstPoint.value, point)) return

    appendShape({
      type: 'line',
      point: [lineDraftFirstPoint.value, point],
    })
    lineDraftFirstPoint.value = null
    currentPointer.value = undefined
    return
  }

  if (activeTool.value === 'polygon') {
    polygonDraft.value = [...polygonDraft.value, point]
    currentPointer.value = point
    return
  }

  rectDraft.isDrawing = true
  rectDraft.start = point
  rectDraft.current = point
}

/** 处理画布移动事件，用于更新草稿预览。 */
function handleStagePointerMove() {
  const point = getCurrentOriginalPointer(false)
  currentPointer.value = point || undefined

  if (!point) return
  if (!rectDraft.isDrawing) return
  rectDraft.current = point
}

/** 处理画布抬起事件，用于完成矩形绘制。 */
function handleStagePointerUp() {
  if (!rectDraft.isDrawing || !rectDraft.start || !rectDraft.current) {
    resetRectDraft()
    return
  }

  if (!hasEnoughDistance(rectDraft.start, rectDraft.current)) {
    resetRectDraft()
    return
  }

  const rectBox = getRectBox([rectDraft.start, rectDraft.current])
  appendShape({
    type: 'rect',
    point: [
      { x: rectBox.left, y: rectBox.top },
      { x: rectBox.right, y: rectBox.bottom },
    ],
  })
  resetRectDraft()
}

/** 鼠标离开画布时结束当前矩形草稿。 */
function handleStagePointerLeave() {
  currentPointer.value = undefined
  if (rectDraft.isDrawing) {
    handleStagePointerUp()
  }
}

/** 点击多边形草稿起点时尝试闭合多边形。 */
function handlePolygonDraftHandleClick(handle: { index: number }) {
  if (handle.index !== 0) return
  if (!canClosePolygonByStartPoint.value) return
  finishPolygon()
}

/** 完成多边形闭合并写回图形列表。 */
function finishPolygon() {
  if (props.disabled || props.readonly) return
  if (polygonDraft.value.length < 3) {
    ElMessage.warning('多边形至少需要 3 个点')
    return
  }

  appendShape({
    type: 'polygon',
    point: [...polygonDraft.value],
  })
  polygonDraft.value = []
  currentPointer.value = undefined
}

/** 撤销当前工具对应的草稿步骤。 */
function undoCurrentDraft() {
  if (activeTool.value === 'polygon') {
    polygonDraft.value = polygonDraft.value.slice(0, -1)
    return
  }

  if (activeTool.value === 'line') {
    lineDraftFirstPoint.value = null
    currentPointer.value = undefined
    return
  }

  resetRectDraft()
}

/** 点击图形时切换选中态。 */
function handleShapeClick(shapeId: string) {
  selectedShapeId.value = shapeId
}

/** 双击图形时进入点位编辑模式。 */
function handleShapeDoubleClick(shapeId: string) {
  if (props.disabled || props.readonly) return
  selectedShapeId.value = shapeId
  editingShapeId.value = shapeId
}

/** 通过按钮进入当前选中图形的点位编辑模式。 */
function enterSelectedShapeEditMode() {
  if (!selectedShapeId.value) return
  handleShapeDoubleClick(selectedShapeId.value)
}

/** 拖拽开始时同步选中图形。 */
function handleShapeDragStart(shapeId: string) {
  selectedShapeId.value = shapeId
}

/** 处理线段拖拽中的临时偏移，使可见线实时跟手。 */
function handleLineDragMove(event: KonvaLikeEvent, shapeId: string) {
  const target = event?.target
  if (!target) return

  lineDragOffsetMap.value = {
    ...lineDragOffsetMap.value,
    [shapeId]: {
      x: target.x(),
      y: target.y(),
    },
  }
}

/** 处理图形整体拖拽结束，将显示坐标换算回原图像素坐标。 */
function handleShapeDragEnd(event: KonvaLikeEvent, shape: InternalShape) {
  const nextPoints = getDraggedShapePoints(event, shape)
  if (!nextPoints) return
  updateShapePoints(shape.id, nextPoints)

  if (shape.type === 'line') {
    const rest = { ...lineDragOffsetMap.value }
    delete rest[shape.id]
    lineDragOffsetMap.value = rest
  }
}

/** 处理编辑手柄拖拽，按图形类型更新具体点位。 */
function handleEditHandleDrag(event: KonvaLikeEvent, handle: EditHandle) {
  const target = event?.target
  if (!target) return

  const nextPoint = displayToOriginalPoint({ x: target.x(), y: target.y() }, true)
  if (!nextPoint) return

  const shape = shapes.value.find((item) => item.id === handle.shapeId)
  if (!shape) return

  if (handle.kind === 'line-point' || handle.kind === 'polygon-point') {
    if (handle.pointIndex === undefined) return
    updateShapePoints(
      shape.id,
      shape.point.map((point, index) => {
        return index === handle.pointIndex ? nextPoint : point
      }),
    )
    return
  }

  updateRectCorner(shape.id, handle.corner, nextPoint)
}

/** 构造可见线段的配置。 */
function getLineConfig(shape: InternalShape, selected: boolean) {
  const offset = getLineDragOffset(shape.id)
  const palette = shapeColorMap.value.line

  return {
    id: shape.id,
    points: convertPointsToDisplayArray(shape.point),
    x: offset.x,
    y: offset.y,
    stroke: selected ? palette.strokeActive : palette.stroke,
    strokeWidth: selected ? 4 : 3,
    lineCap: 'round',
    lineJoin: 'round',
    listening: false,
  }
}

/** 构造线段热区的配置，用于稳定点击和拖拽命中。 */
function getLineHitConfig(shape: InternalShape) {
  const offset = getLineDragOffset(shape.id)

  return {
    id: getTransformerTargetId(shape),
    points: convertPointsToDisplayArray(shape.point),
    x: offset.x,
    y: offset.y,
    stroke: elementColors.value.primary,
    opacity: 0.01,
    strokeWidth: 20,
    hitStrokeWidth: 28,
    strokeHitEnabled: true,
    lineCap: 'round',
    lineJoin: 'round',
    draggable: isShapeMovable(shape.id),
  }
}

/** 构造矩形配置。 */
function getRectConfig(shape: InternalShape, selected: boolean) {
  const rectBox = getRectBox(shape.point)
  const topLeft = originalToDisplayPoint({ x: rectBox.left, y: rectBox.top })
  const bottomRight = originalToDisplayPoint({ x: rectBox.right, y: rectBox.bottom })
  const palette = shapeColorMap.value.rect

  return {
    id: shape.id,
    x: topLeft.x,
    y: topLeft.y,
    width: Math.abs(bottomRight.x - topLeft.x),
    height: Math.abs(bottomRight.y - topLeft.y),
    stroke: selected ? palette.strokeActive : palette.stroke,
    strokeWidth: selected ? 3 : 2,
    fill: selected ? palette.fillActive : palette.fill,
    draggable: isShapeMovable(shape.id),
  }
}

/** 构造多边形配置。 */
function getPolygonConfig(shape: InternalShape, selected: boolean) {
  const palette = shapeColorMap.value.polygon

  return {
    id: shape.id,
    points: convertPointsToDisplayArray(shape.point),
    x: 0,
    y: 0,
    stroke: selected ? palette.strokeActive : palette.stroke,
    strokeWidth: selected ? 3 : 2,
    fill: selected ? palette.fillActive : palette.fill,
    closed: true,
    lineCap: 'round',
    lineJoin: 'round',
    draggable: isShapeMovable(shape.id),
  }
}

/** 计算图形整体拖拽后的新点位。 */
function getDraggedShapePoints(event: KonvaLikeEvent, shape: InternalShape) {
  const target = event?.target
  if (!target) return null

  if (shape.type === 'rect') {
    const rectBox = getRectBox(shape.point)
    const topLeftDisplay = originalToDisplayPoint({ x: rectBox.left, y: rectBox.top })
    const offsetX = target.x() - topLeftDisplay.x
    const offsetY = target.y() - topLeftDisplay.y
    return translateShapePoints(shape.point, offsetX, offsetY)
  }

  const offsetX = target.x()
  const offsetY = target.y()
  target.position({ x: 0, y: 0 })
  return translateShapePoints(shape.point, offsetX, offsetY)
}

/** 根据显示位移量平移图形点位，并做原图边界约束。 */
function translateShapePoints(points: AnnotationPoint[], offsetX: number, offsetY: number) {
  const deltaX = offsetX / renderMetrics.value.scale
  const deltaY = offsetY / renderMetrics.value.scale
  const constrainedDelta = constrainShapeDelta(points, deltaX, deltaY)

  return points.map((point) => ({
    x: roundCoordinate(point.x + constrainedDelta.x),
    y: roundCoordinate(point.y + constrainedDelta.y),
  }))
}

/** 对图形移动增量做边界限制，避免拖出原图。 */
function constrainShapeDelta(points: AnnotationPoint[], deltaX: number, deltaY: number) {
  const xValues = points.map((point) => point.x)
  const yValues = points.map((point) => point.y)
  const minX = Math.min(...xValues)
  const maxX = Math.max(...xValues)
  const minY = Math.min(...yValues)
  const maxY = Math.max(...yValues)

  return {
    x: Math.min(imageMeta.width - maxX, Math.max(-minX, deltaX)),
    y: Math.min(imageMeta.height - maxY, Math.max(-minY, deltaY)),
  }
}

/** 更新矩形某个角点，并继续输出为左上与右下两个点。 */
function updateRectCorner(
  shapeId: string,
  corner: EditHandle['corner'],
  nextPoint: AnnotationPoint,
) {
  if (!corner) return

  const shape = shapes.value.find((item) => item.id === shapeId)
  if (!shape) return

  const rectBox = getRectBox(shape.point)
  let left = rectBox.left
  let right = rectBox.right
  let top = rectBox.top
  let bottom = rectBox.bottom

  if (corner === 'top-left') {
    left = nextPoint.x
    top = nextPoint.y
  }

  if (corner === 'top-right') {
    right = nextPoint.x
    top = nextPoint.y
  }

  if (corner === 'bottom-right') {
    right = nextPoint.x
    bottom = nextPoint.y
  }

  if (corner === 'bottom-left') {
    left = nextPoint.x
    bottom = nextPoint.y
  }

  const normalizedLeft = Math.min(left, right)
  const normalizedRight = Math.max(left, right)
  const normalizedTop = Math.min(top, bottom)
  const normalizedBottom = Math.max(top, bottom)

  updateShapePoints(shapeId, [
    { x: normalizedLeft, y: normalizedTop },
    { x: normalizedRight, y: normalizedBottom },
  ])
}

/** 将当前 shapes 写回 v-model。 */
function emitModelValue() {
  syncingModelFromInner.value = true
  modelValue.value = shapes.value.map((shape) => ({
    type: shape.type,
    point: shape.point.map((point) => ({
      x: roundCoordinate(point.x),
      y: roundCoordinate(point.y),
    })),
  }))
}

/** 从外部 v-model 同步内部 shapes。 */
function syncShapesFromModel(value: AnnotationValueItem[]) {
  shapes.value = (value || []).map((item) => ({
    id: createShapeId(),
    type: item.type,
    point: item.point.map((point) => ({
      x: roundCoordinate(point.x),
      y: roundCoordinate(point.y),
    })),
  }))
  selectedShapeId.value = undefined
  editingShapeId.value = undefined
  lineDragOffsetMap.value = {}
}

/** 新增一个图形并立即写回外部 v-model。 */
function appendShape(shape: AnnotationValueItem) {
  const nextShape: InternalShape = {
    id: createShapeId(),
    type: shape.type,
    point: shape.point.map((point) => ({
      x: roundCoordinate(point.x),
      y: roundCoordinate(point.y),
    })),
  }
  shapes.value = [...shapes.value, nextShape]
  selectedShapeId.value = nextShape.id
  emitModelValue()
}

/** 更新指定图形的点位并同步外部数据。 */
function updateShapePoints(shapeId: string, nextPoints: AnnotationPoint[]) {
  const shapeIndex = shapes.value.findIndex((shape) => shape.id === shapeId)
  if (shapeIndex < 0) return

  const currentShape = shapes.value[shapeIndex]
  if (!currentShape) return

  const nextShapes = [...shapes.value]
  nextShapes.splice(shapeIndex, 1, {
    ...currentShape,
    point: nextPoints.map((point) => ({
      x: roundCoordinate(clamp(point.x, 0, imageMeta.width)),
      y: roundCoordinate(clamp(point.y, 0, imageMeta.height)),
    })),
  })
  shapes.value = nextShapes
  emitModelValue()
}

/** 删除当前选中的图形。 */
function removeSelectedShape() {
  if (!selectedShapeId.value) return
  shapes.value = shapes.value.filter((shape) => shape.id !== selectedShapeId.value)
  if (editingShapeId.value === selectedShapeId.value) {
    editingShapeId.value = undefined
  }
  selectedShapeId.value = undefined
  emitModelValue()
}

/** 清空所有图形和草稿状态。 */
function clearAllShapes() {
  shapes.value = []
  selectedShapeId.value = undefined
  editingShapeId.value = undefined
  lineDragOffsetMap.value = {}
  clearDraftState()
  emitModelValue()
}

/** 校验当前是否允许提交。 */
function validateBeforeSubmit() {
  if (!pendingDraftMessage.value) return true
  ElMessage.warning(pendingDraftMessage.value)
  return false
}

/** 对外返回当前可提交的数据。 */
function getOutputData() {
  if (!validateBeforeSubmit()) return null
  return modelValue.value
}

/** 根据选中状态刷新 Transformer 绑定。 */
function updateTransformer() {
  const transformerNode = transformerRef.value?.getNode?.()
  if (!transformerNode) return

  if (!selectedShapeId.value || editingShapeId.value) {
    transformerNode.nodes([])
    transformerNode.getLayer()?.batchDraw()
    return
  }

  const stage = transformerNode.getStage()
  const selectedNode = stage?.findOne?.(
    `#${getTransformerTargetIdByShapeId(selectedShapeId.value)}`,
  )
  transformerNode.nodes(selectedNode ? [selectedNode] : [])
  transformerNode.getLayer()?.batchDraw()
}

/** 判断指定图形当前是否允许整体拖拽。 */
function isShapeMovable(shapeId: string) {
  return !props.disabled && !props.readonly && editingShapeId.value !== shapeId
}

/** 获取线段实时拖拽偏移。 */
function getLineDragOffset(shapeId: string) {
  return lineDragOffsetMap.value[shapeId] || { x: 0, y: 0 }
}

/** 通过图形对象获取 Transformer 绑定目标 id。 */
function getTransformerTargetId(shape: InternalShape) {
  return shape.type === 'line' ? `${shape.id}__hit` : shape.id
}

/** 通过图形 id 获取 Transformer 绑定目标 id。 */
function getTransformerTargetIdByShapeId(shapeId: string) {
  const shape = shapes.value.find((item) => item.id === shapeId)
  return shape ? getTransformerTargetId(shape) : shapeId
}

/** 把原图点位转换为画布显示坐标。 */
function originalToDisplayPoint(point?: AnnotationPoint | null): DisplayPoint {
  if (!point) {
    return { x: renderMetrics.value.offsetX, y: renderMetrics.value.offsetY }
  }

  return {
    x: renderMetrics.value.offsetX + point.x * renderMetrics.value.scale,
    y: renderMetrics.value.offsetY + point.y * renderMetrics.value.scale,
  }
}

/** 把画布显示坐标转换回原图坐标。 */
function displayToOriginalPoint(point: DisplayPoint, clampToImage: boolean) {
  if (!imageMeta.width || !imageMeta.height) return null

  const x = (point.x - renderMetrics.value.offsetX) / renderMetrics.value.scale
  const y = (point.y - renderMetrics.value.offsetY) / renderMetrics.value.scale

  if (clampToImage) {
    return {
      x: roundCoordinate(clamp(x, 0, imageMeta.width)),
      y: roundCoordinate(clamp(y, 0, imageMeta.height)),
    }
  }

  if (x < 0 || y < 0 || x > imageMeta.width || y > imageMeta.height) return null

  return {
    x: roundCoordinate(x),
    y: roundCoordinate(y),
  }
}

/** 获取当前鼠标在原图坐标系中的位置。 */
function getCurrentOriginalPointer(clampToImage: boolean) {
  const stage = stageRef.value?.getNode?.()
  const pointer = stage?.getPointerPosition?.()
  if (!pointer) return null
  return displayToOriginalPoint(pointer, clampToImage)
}

/** 把点位数组转换为 Konva Line 所需的一维数组。 */
function convertPointsToDisplayArray(points: AnnotationPoint[]) {
  return points.flatMap((point) => {
    const displayPoint = originalToDisplayPoint(point)
    return [displayPoint.x, displayPoint.y]
  })
}

/** 计算矩形的左上和右下边界。 */
function getRectBox(points: AnnotationPoint[]) {
  const [firstPoint, secondPoint] = points
  const left = Math.min(firstPoint?.x || 0, secondPoint?.x || 0)
  const right = Math.max(firstPoint?.x || 0, secondPoint?.x || 0)
  const top = Math.min(firstPoint?.y || 0, secondPoint?.y || 0)
  const bottom = Math.max(firstPoint?.y || 0, secondPoint?.y || 0)

  return {
    left,
    right,
    top,
    bottom,
  }
}

/** 判断两个点之间的距离是否足够形成有效图形。 */
function hasEnoughDistance(start: AnnotationPoint, end: AnnotationPoint) {
  return Math.hypot(end.x - start.x, end.y - start.y) > 6
}

/** 清空所有绘制草稿状态。 */
function clearDraftState() {
  polygonDraft.value = []
  lineDraftFirstPoint.value = null
  currentPointer.value = undefined
  resetRectDraft()
}

/** 重置矩形绘制草稿。 */
function resetRectDraft() {
  rectDraft.isDrawing = false
  rectDraft.start = null
  rectDraft.current = null
}

/** 加载图片元素。 */
function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('load failed'))
    image.src = src
  })
}

/** 生成内部图形 id。 */
function createShapeId() {
  return `annotation-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/** 坐标统一保留为整数像素。 */
function roundCoordinate(value: number) {
  return Math.round(value)
}

/** 数值边界裁剪。 */
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** 对外暴露提交前校验与数据读取方法。 */
defineExpose({
  validateBeforeSubmit,
  getOutputData,
})
</script>

<style scoped lang="scss">
.annotation-editor {
  display: grid;
  height: v-bind('editorHeightCssValue');
  gap: 16px;
  grid-template-columns: minmax(0, 1fr) 220px;
}

.annotation-editor__stage-panel {
  min-width: 0;
  height: 100%;
}

.annotation-editor__stage-wrapper {
  position: relative;
  overflow: hidden;
  height: 100%;
  border: 1px dashed var(--el-border-color);
  border-radius: 16px;
  background: var(--el-fill-color-extra-light);
}

.annotation-editor__stage-center {
  position: relative;
  width: 100%;
  height: 100%;
}

.annotation-editor__empty {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
}

.annotation-editor__empty-icon {
  width: 40px;
  height: 40px;
  color: var(--el-text-color-secondary);
}

.annotation-editor__empty-title {
  margin-bottom: 10px;
  color: var(--el-text-color-secondary);
  font-size: 20px;
  font-weight: 500;
}

.annotation-editor__empty-desc {
  max-width: 420px;
  color: var(--el-text-color-secondary);
  line-height: 1.7;
}

.annotation-editor__action-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.annotation-editor__action-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 16px;
  padding: 12px;
  background: var(--el-bg-color);
}

.annotation-editor__action-row {
  display: grid;
  align-items: center;
  gap: 10px;
  grid-template-columns: minmax(0, 1fr) 18px;
}

.annotation-editor__action-button {
  width: 100%;
}

.annotation-editor__action-info {
  color: var(--el-text-color-placeholder);
  font-size: 16px;
  cursor: pointer;
}

.annotation-editor__action-info:hover {
  color: var(--el-color-primary);
}

.annotation-editor__card {
  border-radius: 16px;
}

.annotation-editor__status-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.annotation-editor__warning {
  color: var(--el-color-danger);
  font-weight: 600;
}

@media (max-width: 1200px) {
  .annotation-editor {
    grid-template-columns: 1fr;
  }
}
</style>
