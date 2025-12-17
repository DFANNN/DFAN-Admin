import { useWindowSize, useResizeObserver } from '@vueuse/core'
import { useThemeStore } from '@/stores/theme'

/**
 * 动态计算表格高度的 hook
 * @param queryFormRef 查询表单容器的 ref（可选）
 * @param paginationRef 分页组件的 ref（可选）
 * @param operationRef 操作栏组件的 ref（可选）
 * @param options 配置选项
 * @returns 响应式的表格高度
 */
export const useTableHeight = (
  queryFormRef?: Ref<HTMLElement | null | undefined>,
  paginationRef?: Ref<HTMLElement | null | undefined>,
  operationRef?: Ref<HTMLElement | null | undefined>,
  options?: {
    /** 额外的高度偏移量（默认：0） */
    extraHeight?: number
    /** 查询表单与表格之间的间距（默认：16） */
    queryFormGap?: number
    /** 表格卡片的内边距（默认：16） */
    tableCardPadding?: number
    /** 分页组件与表格之间的间距（默认：16） */
    paginationGap?: number
    /** 全屏状态的 ref（可选），当全屏时会自动排除 header、tabs、mainPadding 和 queryFormHeight 的高度 */
    isFullscreenRef?: Ref<boolean> | Readonly<Ref<boolean>>
  },
) => {
  const themeStore = useThemeStore()
  const { height: windowHeight } = useWindowSize()

  // 查询表单高度
  const queryFormHeight = ref(0)
  // 分页组件高度
  const paginationHeight = ref(0)
  // 操作栏组件高度
  const operationHeight = ref(0)
  // 默认配置
  const config = {
    extraHeight: options?.extraHeight ?? 0,
    queryFormGap: options?.queryFormGap ?? 16, // 查询表单与表格之间的间距
    tableCardPadding: options?.tableCardPadding ?? 16, // 表格卡片的内边距
    paginationGap: options?.paginationGap ?? 16, // 分页组件与表格之间的间距
  }

  // 获取 DOM 元素
  const getElement = (Element: HTMLElement | ComponentPublicInstance | null | undefined) => {
    if (!Element) return null
    // 如果是组件实例，获取其根元素
    if ('$el' in Element) {
      return Element.$el as HTMLElement
    }
    // 如果已经是 DOM 元素，直接返回
    if (Element instanceof HTMLElement) {
      return Element
    }
    return null
  }

  // 监听查询表单容器的高度变化
  if (queryFormRef) {
    watchEffect((onInvalidate) => {
      const element = getElement(queryFormRef.value)
      // 如果元素不存在，则设置查询表单高度为 0
      if (!element) {
        queryFormHeight.value = 0
        return
      }

      // 初始化查询表单高度
      nextTick(() => {
        const rect = element.getBoundingClientRect()
        queryFormHeight.value = rect.height
      })

      // 监听尺寸变化
      const { stop } = useResizeObserver(element, () => {
        const rect = element.getBoundingClientRect()
        queryFormHeight.value = rect.height
      })

      // 清理函数
      onInvalidate(() => {
        stop()
      })
    })
  }

  // 监听操作栏组件的高度变化

  if (operationRef) {
    watchEffect((onInvalidate) => {
      const element = getElement(operationRef.value)
      if (!element) {
        operationHeight.value = 0
        return
      }

      // 初始化操作栏组件高度
      nextTick(() => {
        const rect = element.getBoundingClientRect()
        operationHeight.value = rect.height
      })

      // 监听尺寸变化
      const { stop } = useResizeObserver(element, () => {
        const rect = element.getBoundingClientRect()
        operationHeight.value = rect.height
      })

      // 清理函数
      onInvalidate(() => {
        stop()
      })
    })
  }
  // 监听分页组件的高度变化
  if (paginationRef) {
    // 使用 watchEffect 来监听元素变化并设置 ResizeObserver
    watchEffect((onInvalidate) => {
      const element = getElement(paginationRef.value)
      if (!element) {
        paginationHeight.value = 0
        return
      }

      // 初始化分页组件高度
      nextTick(() => {
        const rect = element.getBoundingClientRect()
        paginationHeight.value = rect.height
      })

      // 监听尺寸变化
      // 注意：contentRect.height 不包含 padding，但我们需要包含 padding 的高度
      // 所以使用 getBoundingClientRect().height 来保持一致性
      const { stop } = useResizeObserver(element, () => {
        const rect = element.getBoundingClientRect()
        paginationHeight.value = rect.height
      })

      // 清理函数
      onInvalidate(() => {
        stop()
      })
    })
  }

  // 计算高度
  const tableHeight = computed(() => {
    // 1. 窗口高度
    const height = windowHeight.value || window.innerHeight

    // 2. 判断是否全屏
    const isFullscreen = options?.isFullscreenRef?.value ?? false

    // 3. Header 高度（全屏时为 0，否则固定 50px）
    const headerHeight = isFullscreen ? 0 : 50

    // 4. Tabs 高度（全屏时为 0，否则根据配置显示）
    const tabsHeight = isFullscreen ? 0 : themeStore.showTabs ? 40 : 0

    // 5. Main 容器的 padding（全屏时为 0，否则上下各 16px，共 32px）
    const mainPadding = isFullscreen ? 0 : 32

    // 6. 查询表单高度（全屏时为 0）
    const effectiveQueryFormHeight = isFullscreen ? 0 : queryFormHeight.value || 0
    // 查询表单与表格之间的间距（全屏时为 0）
    const effectiveQueryFormGap = isFullscreen ? 0 : config.queryFormGap

    // 7. 计算表格可用高度
    const availableHeight =
      height -
      headerHeight -
      tabsHeight -
      mainPadding -
      effectiveQueryFormHeight -
      effectiveQueryFormGap -
      config.tableCardPadding * 2 -
      (operationHeight.value || 0) -
      (paginationHeight.value || 0) -
      config.paginationGap -
      config.extraHeight

    //  最小高度为 300px，防止表格高度过低
    return Math.max(availableHeight, 300)
  })

  return tableHeight
}
