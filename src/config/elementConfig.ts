// element-plus 组件相关 公共配置

// 表格配置
export const TABLE_CONFIG = {
  border: true, // 是否显示边框
  align: 'left', // 对齐方式
}

// 页码配置
export const PAGINATION_CONFIG = {
  // 页码布局pc端
  desktopLayout: 'total, sizes, prev, pager, next, jumper',
  // 页码布局移动端
  mobileLayout: 'total, prev, pager, next',
  // 页码按钮数量pc端
  desktopPagerCount: 7,
  // 页码按钮数量移动端
  mobilePagerCount: 5,
  pageSizes: [10, 20, 30, 40, 50],
  // 计算删除后当前页码
  calculatePageAfterDelete: (
    currentPage: number, // 当前页
    pageSize: number, // 每页条数
    totalCount: number, // 总条数
    deleteCount: number = 1, // 删除条数
  ) => {
    const remainingItems = totalCount - deleteCount
    const maxPage = Math.ceil(remainingItems / pageSize)

    // 如果删除后当前页没有数据了，则返回上一页
    if (currentPage > maxPage) {
      return Math.max(1, maxPage)
    }

    // 如果有数据，停留在当前页
    return currentPage
  },
  // 计算最后一页
  calculateLastPage: (total: number, pageSize: number) => {
    return Math.max(1, Math.ceil(total / pageSize))
  },
}

// popconfirm 气泡框配置
export const POPCONFIRM_CONFIG = {
  width: 220,
  placement: 'top',
  showAfter: 200,
}
