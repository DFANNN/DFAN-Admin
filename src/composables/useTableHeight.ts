import { useWindowSize, useResizeObserver } from '@vueuse/core'
import { useThemeStore } from '@/stores/theme'

/**
 * 动态计算表格高度的 hook
 * @param queryFormRef 查询表单容器的 ref（可选）
 * @param paginationRef 分页组件的 ref（可选）
 * @param options 配置选项
 * @returns 响应式的表格高度
 */
export const useTableHeight = (
  queryFormRef?:
    | Ref<HTMLElement | null | undefined>
    | Readonly<Ref<HTMLElement | null | undefined>>,
  paginationRef?:
    | Ref<HTMLElement | null | undefined>
    | Readonly<Ref<HTMLElement | null | undefined>>,
  options?: {
    /** 额外的高度偏移量（默认：0） */
    extraHeight?: number
    /** 查询表单与表格之间的间距（默认：16） */
    queryFormGap?: number
    /** 表格卡片的内边距（默认：16） */
    tableCardPadding?: number
    /** 分页组件与表格之间的间距（默认：16） */
    paginationGap?: number
  },
) => {
  const themeStore = useThemeStore()
  const { height: windowHeight } = useWindowSize()

  // 查询表单高度（响应式）
  const queryFormHeight = ref(0)
  // 分页组件高度（响应式）
  const paginationHeight = ref(0)

  // 默认配置
  const config = {
    extraHeight: options?.extraHeight ?? 0,
    queryFormGap: options?.queryFormGap ?? 16, // card-mt-16 的间距
    tableCardPadding: options?.tableCardPadding ?? 16, // el-card 的默认 padding
    paginationGap: options?.paginationGap ?? 0, // 分页组件与表格之间的间距
  }

  // 获取 DOM 元素的辅助函数
  const getElement = (
    value: HTMLElement | ComponentPublicInstance | null | undefined,
  ): HTMLElement | null => {
    if (!value) return null
    // 如果是组件实例，获取其根元素
    if ('$el' in value) {
      return value.$el as HTMLElement
    }
    // 如果已经是 DOM 元素，直接返回
    if (value instanceof HTMLElement) {
      return value
    }
    return null
  }

  // 监听查询表单容器的高度变化
  if (queryFormRef) {
    // 使用 watchEffect 来监听元素变化并设置 ResizeObserver
    watchEffect((onInvalidate) => {
      const element = getElement(queryFormRef.value)
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
      // 注意：contentRect.height 不包含 padding，但我们需要包含 padding 的高度
      // 所以使用 getBoundingClientRect().height 来保持一致性
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

  // 计算表格高度
  const tableHeight = computed(() => {
    // 1. 窗口高度
    const height = windowHeight.value || window.innerHeight

    // 2. Header 高度（固定 50px）
    const headerHeight = 50

    // 3. Tabs 高度（如果显示则为 40px，否则为 0）
    const tabsHeight = themeStore.showTabs ? 40 : 0

    // 4. Main 容器的 padding（上下各 16px，共 32px）
    const mainPadding = 32

    // 5. 计算表格可用高度
    const availableHeight =
      height -
      headerHeight -
      tabsHeight -
      mainPadding -
      (queryFormHeight.value || 0) -
      config.queryFormGap -
      config.tableCardPadding * 2 - // 表格卡片上下 padding
      (paginationHeight.value || 0) -
      config.paginationGap -
      config.extraHeight

    // 确保最小高度为 300px
    return Math.max(availableHeight, 300)
  })

  return tableHeight
}
