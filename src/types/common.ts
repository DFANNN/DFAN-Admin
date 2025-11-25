// 通用类型文件

// 通用响应
export interface ICommonResponse<T> {
  code: number
  message: string
  data: T
}
