import type { App } from 'vue'
import VxeUITable from 'vxe-table' // VXE Table
import { VxeButton, VxeTooltip, VxeNumberInput, VxeInput, VxeSelect } from 'vxe-pc-ui' // VXE PC
import 'vxe-pc-ui/es/style.css' // VXE PC UI 样式
import 'vxe-table/lib/style.css' // VXE Table 样式
import '@/styles/vxeTable.css' // VXE Table 变量覆盖

// 全局配置
VxeUITable.setConfig({
  table: {
    showHeaderOverflow: true, // 是否显示表头溢出
    border: true, // 是否显示边框
    headerCellConfig: {
      height: 40, // 设置表头高度
    },
    // 单元格配置
    cellConfig: {
      height: 40, // 设置表格行高度
    },
    // 列配置
    columnConfig: {
      resizable: true, // 支持列宽拖拽
    },
  },
})

export default (app: App) => {
  app.use(VxeButton)
  app.use(VxeTooltip)
  app.use(VxeInput)
  app.use(VxeSelect)
  app.use(VxeNumberInput)
  app.use(VxeUITable)
}
