import type { App } from 'vue'
import VxeUITable from 'vxe-table' // VXE Table
import { VxeButton, VxeTooltip } from 'vxe-pc-ui' // VXE PC
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
    cellConfig: {
      height: 40, // 设置表格行高度
    },
  },
})

export default (app: App) => {
  app.use(VxeButton)
  app.use(VxeTooltip)
  app.use(VxeUITable)
}
