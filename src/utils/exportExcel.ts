// 导出excel的工具

// 参数类型
interface IExportToExcelParams {
  fileName: string // 文件名
  sheetName?: string // 工作表名称
  data: Record<string, unknown>[] // 数据
  // 列名称定义
  columns: Record<string, string>
}

/**
 *  导出excel的工具函数
 * @param data  参数
 */
export const exportToExcel = async (data: IExportToExcelParams) => {
  // 动态导入 xlsx 模块
  const XLSX = await import('xlsx')

  // 获取数据
  const excelData = data.data || []

  // 将列头名称映射为中文，并且处理数据是空或者数组或者对象的情况
  const mapExcelData = excelData.map((item) => {
    // 创建一个空对象
    const obj: Record<string, unknown> = {}

    // 遍历列头名称
    for (const key of Object.keys(data.columns)) {
      // 列头名称
      const columnName = data.columns[key]
      // 列头名称对应的值
      if (columnName) {
        let value = item[key]

        // 如果是 null/undefined，设为空字符串
        if (value === null || value === undefined) {
          value = ''
        }

        // 如果是对象或数组，转成 JSON 字符串
        if (typeof value === 'object') {
          value = JSON.stringify(value)
        }

        obj[columnName] = value
      }
    }
    return obj
  })

  // 把 JS 对象数组转换成 Excel 的“工作表（Worksheet）”
  const sheet = XLSX.utils.json_to_sheet(mapExcelData)
  // 创建 Excel 的“工作簿（Book）”
  const book = XLSX.utils.book_new()
  // 把工作表添加到工作簿
  XLSX.utils.book_append_sheet(book, sheet, data.sheetName)
  // 导出 Excel
  XLSX.writeFile(book, data.fileName)
}
