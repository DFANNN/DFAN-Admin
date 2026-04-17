// 通用类型文件

// 通用响应
export interface ICommonResponse<T> {
  code: number
  message: string
  data: T
}

// 通用分页响应
export interface ICommonPageResponse<T> {
  code: number
  message: string
  data: {
    list: T
    total: number // 总条数
    page: number // 当前页码
    pageSize: number // 每页条数
  }
}
