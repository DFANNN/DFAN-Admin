// 导出excel的工具
import type { ITableColumns } from '@/types/components/page'

// 要导出的数据
type IExportData = Record<string, unknown>[]
// excel表格列宽
type IColWidth = { wch: number }[]
// 支出导出的格式
export type IExportFormat = '.xlsx' | '.csv' | '.html'

/**
 * 格式化导出 Excel 的数据
 * @description 将原始数据和表格列配置转换为适合导出 Excel 的格式
 * @param exportData - 要导出的原始数据数组
 * @param exportColumns - 表格列配置数组
 * @returns 返回格式化后的数据和列宽配置
 * @returns mapExcelData - 格式化后的数据，键名为列的 label
 * @returns colWidth - 列宽配置数组
 * @example
 * ```ts
 * const data = [{ id: 1, name: '张三', age: 20 }]
 * const columns = [
 *   { prop: 'id', label: 'ID', width: 80 },
 *   { prop: 'name', label: '姓名', width: 120 },
 *   { prop: 'age', label: '年龄', width: 100 }
 * ]
 * const { mapExcelData, colWidth } = formatExportExcelData(data, columns)
 * // mapExcelData: [{ 'ID': 1, '姓名': '张三', '年龄': 20 }]
 * // colWidth: [{ wch: 10 }, { wch: 15 }, { wch: 12 }]
 * ```
 */
export const formatExportExcelData = (exportData: IExportData, exportColumns: ITableColumns[]) => {
  // 把json数据整理导出Excel的数据
  const mapExcelData = exportData.map((item, index) => {
    // 创建一个空对象
    const obj: Record<string, unknown> = {}
    // 遍历列头名称
    exportColumns.forEach((col) => {
      if (col.type === 'index') {
        obj[col.label!] = index + 1
      } else {
        obj[col.label!] = item[col.prop ?? '']
      }
    })
    return obj
  })

  // 整理列宽度
  const colWidth = exportColumns.map((col) => {
    return { wch: Math.floor((col.width || 120) / 8) }
  })

  return {
    mapExcelData,
    colWidth,
  }
}

/**
 * 导出数据为 Excel 文件
 * @description 将格式化后的数据导出为 Excel 或 CSV 文件，支持自定义列宽
 * @param exportData - 格式化后的导出数据数组（键名为列标题）
 * @param fileName - 导出的文件名（不含扩展名）
 * @param fileFormat - 导出的文件格式，支持 .xlsx 和 .csv
 * @param colWidth - 可选的列宽配置数组，格式为 [{ wch: number }]
 * @returns Promise<void>
 * @example
 * ```ts
 * // 基础用法
 * const data = [{ '姓名': '张三', '年龄': 20 }]
 * await exportToExcel(data, '用户列表', '.xlsx')
 *
 * // 带列宽配置
 * const colWidth = [{ wch: 15 }, { wch: 10 }]
 * await exportToExcel(data, '用户列表', '.xlsx', colWidth)
 *
 * // 配合 formatExportExcelData 使用
 * const rawData = [{ id: 1, name: '张三', age: 20 }]
 * const columns = [{ prop: 'name', label: '姓名' }, { prop: 'age', label: '年龄' }]
 * const { mapExcelData, colWidth } = formatExportExcelData(rawData, columns)
 * await exportToExcel(mapExcelData, '用户列表', '.xlsx', colWidth)
 * ```
 */
export const exportToExcel = async (
  exportData: IExportData,
  fileName: string,
  fileFormat: IExportFormat,
  colWidth?: IColWidth,
) => {
  // 动态导入 xlsx 模块
  const XLSX = await import('xlsx')

  // 把 JS 对象数组转换成 Excel 的“工作表（Worksheet）”
  const sheet = XLSX.utils.json_to_sheet(exportData)
  // 设置列宽
  if (colWidth) sheet['!cols'] = colWidth
  // 创建 Excel 的“工作簿（Book）”
  const book = XLSX.utils.book_new()
  // 把工作表添加到工作簿
  XLSX.utils.book_append_sheet(book, sheet, fileName)
  // 导出 Excel
  XLSX.writeFile(book, fileName + fileFormat)
}
