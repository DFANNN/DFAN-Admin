## 安装Element Plus

```shell
pnpm install element-plus
```

## 安装自动导入

```shell
pnpm install -D unplugin-vue-components unplugin-auto-import
```

```typescript
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'], // 指定导入模块
      dirs: ['src/stores'], // 指定导入目录
      dts: 'src/auto-imports.d.ts', // 指定生成文件路径
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```
