/**
 * 延迟函数
 * @param ms 延迟时间
 * @returns  Promise<void>
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
