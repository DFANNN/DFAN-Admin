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

在tsconfig.app.json 中添加

```json
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue", "components.d.ts", "auto-imports.d.ts"],
```

## 浅色模式/深色模式

### 实现原理

使用 `@vueuse/core` 的 `useDark` 和 `useToggle` 来实现主题模式切换。

### 核心代码

```typescript
import { useDark, useToggle } from '@vueuse/core'

// 在 store 中
const isDark = useDark()
const toggleDark = useToggle(isDark)

// 主题模式状态
const themeMode = ref<'light' | 'dark'>(
  (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light',
)

// 切换主题模式
const toggleThemeMode = (newVal: 'light' | 'dark') => {
  themeMode.value = newVal
  toggleDark(newVal === 'dark') // 调用 useDark 的切换函数
  localStorage.setItem('themeMode', newVal) // 持久化存储
}
```

### 工作原理

1. **useDark()**: 自动检测系统主题偏好，并在 `<html>` 标签上添加/移除 `dark` 类
2. **localStorage 持久化**: 用户选择的主题模式会保存到本地存储，刷新页面后自动恢复
3. **Element Plus 深色模式**: 需要在 `main.ts` 中引入深色模式 CSS：
   ```typescript
   import 'element-plus/theme-chalk/dark/css-vars.css'
   ```

### 使用方式

在组件中调用：

```typescript
const themeStore = useThemeStore()
themeStore.toggleThemeMode('dark') // 切换到深色模式
themeStore.toggleThemeMode('light') // 切换到浅色模式
```

---

## 主题色变化

### 实现原理

通过动态设置 CSS 变量来改变 Element Plus 的主题色，并自动计算相关的浅色和深色变体。

### 核心代码

```typescript
// 设置 Element Plus 主题色变量
const setPrimaryColor = (color: string) => {
  const root = document.documentElement
  root.style.setProperty('--el-color-primary', color)
  root.style.setProperty('--el-color-primary-light-3', `color-mix(in srgb, ${color} 70%, white)`)
  root.style.setProperty('--el-color-primary-light-5', `color-mix(in srgb, ${color} 50%, white)`)
  root.style.setProperty('--el-color-primary-light-7', `color-mix(in srgb, ${color} 30%, white)`)
  root.style.setProperty('--el-color-primary-light-8', `color-mix(in srgb, ${color} 20%, white)`)
  root.style.setProperty('--el-color-primary-light-9', `color-mix(in srgb, ${color} 10%, white)`)
  root.style.setProperty('--el-color-primary-dark-2', `color-mix(in srgb, ${color} 80%, black)`)
}

// 主题颜色状态
const primaryColor = ref(localStorage.getItem('theme-color-primary') || '#8B5CF6')
setPrimaryColor(primaryColor.value) // 初始化时设置

// 切换主题颜色
const togglePrimaryColor = (colorValue: string) => {
  primaryColor.value = colorValue
  localStorage.setItem('theme-color-primary', colorValue) // 持久化存储
  setPrimaryColor(colorValue) // 应用新颜色
}
```

### 工作原理

1. **CSS 变量设置**: 直接操作 `document.documentElement.style` 设置 CSS 变量
2. **颜色混合计算**: 使用 CSS `color-mix()` 函数自动计算主题色的浅色和深色变体：
   - `light-3` 到 `light-9`: 主色与白色混合，用于 hover、active 等状态
   - `dark-2`: 主色与黑色混合，用于深色模式或强调效果
3. **持久化存储**: 主题色保存到 localStorage，页面刷新后自动恢复
4. **Element Plus 适配**: Element Plus 组件会自动使用这些 CSS 变量，无需额外配置

### 使用方式

在组件中调用：

```typescript
const themeStore = useThemeStore()
themeStore.togglePrimaryColor('#10B981') // 切换到绿色主题
```

### 注意事项

- `color-mix()` 函数需要现代浏览器支持（Chrome 111+, Safari 16.4+）
- 如果浏览器不支持，可以考虑使用 JavaScript 颜色库（如 `tinycolor2`）来计算颜色变体
