import type { App } from 'vue'
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css' // VXE Table 样式
import '@/styles/vxeTable.css' // VXE Table 变量覆盖

// // 全局配置
VxeUITable.setConfig({
  table: {
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
  app.use(VxeUITable)
}
