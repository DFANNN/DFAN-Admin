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

## 全局loading

### 实现原理

使用 `vite-plugin-app-loading` 插件在应用启动前显示全局 loading 动画，避免页面刷新时出现白屏。该插件会在 HTML 中自动注入 loading 元素，覆盖应用启动阶段（MSW worker、IndexedDB 初始化、Vue 挂载、路由初始化）。

### 安装插件

```shell
pnpm add -D vite-plugin-app-loading
```

### 配置 Vite

在 `vite.config.ts` 中添加插件：

```typescript
import { defineConfig } from 'vite'
import AppLoading from 'vite-plugin-app-loading'

export default defineConfig({
  plugins: [
    // ... 其他插件
    AppLoading(),
  ],
})
```

### 创建 loading.html

在项目根目录（与 `index.html` 同级）创建 `loading.html` 文件，插件会自动读取并注入该文件的内容。

**重要**: `loading.html` 中必须包含 `id="__app-loading__"` 的元素。

示例 `loading.html`：

```html
<div id="__app-loading__" class="app-loading">
  <div class="app-loading-content">
    <img src="/logo.svg" alt="logo" class="loading-logo" />
    <div class="loading-text">正在加载...</div>
  </div>
</div>
```

### 在 main.ts 中使用

在应用完全加载后，调用 `loadingFadeOut()` 隐藏 loading：

```typescript
import { loadingFadeOut } from 'virtual:app-loading'
import { createApp } from 'vue'

const app = createApp(App)
app.mount('#app')

// 等待路由完全准备好（包括动态路由加载）
await router.isReady()
// 再等待一个 tick，确保首次路由导航完成
await nextTick()
// 此时路由已完全加载，可以安全地隐藏 loading
loadingFadeOut()
```

告诉 TypeScript 虚拟导入的类型，在你的 tsconfig.app.json 中，将以下内容添加到你的 compilerOptions.types 数组中

```typescript
{
  // ...
  "compilerOptions": {
    // ...
    "types": [
      "vite-plugin-app-loading/client"
    ]
  }
}
```

### 工作原理

1. **插件注入**: `vite-plugin-app-loading` 会在 HTML 中自动注入 `loading.html` 的内容
2. **应用启动阶段**: Loading 覆盖从页面刷新到 Vue 应用挂载完成的整个过程
3. **路由初始化**: 等待 `router.isReady()` 确保动态路由加载完成
4. **隐藏时机**: 在路由完全准备好后调用 `loadingFadeOut()` 隐藏 loading

## Heroicons

### 安装

```shell
npm install @heroicons/vue
# 或
pnpm install @heroicons/vue
# 或
yarn add @heroicons/vue
```

### 图标样式和尺寸

Heroicons 提供了多种样式和尺寸：

- **24x24 Outline 图标**: `@heroicons/vue/24/outline`
- **24x24 Solid 图标**: `@heroicons/vue/24/solid`
- **20x20 Solid 图标**: `@heroicons/vue/20/solid`
- **16x16 Solid 图标**: `@heroicons/vue/16/solid`

### 基本使用

在 Vue 组件中导入并使用图标：

```vue
<template>
  <div>
    <!-- 使用 24x24 Solid 样式 -->
    <BeakerIcon class="h-6 w-6 text-blue-500" />

    <!-- 使用 24x24 Outline 样式 -->
    <HomeIcon class="h-6 w-6 text-gray-600" />
  </div>
</template>

<script setup>
import { BeakerIcon } from '@heroicons/vue/24/solid'
import { HomeIcon } from '@heroicons/vue/24/outline'
</script>
```

### 图标尺寸设置

**重要提示：** Heroicons 是 **SVG 图标**，不是字体图标，因此：

- ❌ **不能使用 `font-size`** 设置图标大小（这是字体图标才有的特性）
- ✅ **只能使用 `width` 和 `height`** 来设置图标大小

#### 正确的方式

```vue
<template>
  <!-- 使用 width 和 height -->
  <HomeIcon style="width: 24px; height: 24px;" />

  <!-- 使用 Tailwind CSS 类 -->
  <HomeIcon class="w-6 h-6" />

  <!-- 使用 CSS 类 -->
  <HomeIcon class="icon-size" />
</template>

<style scoped>
.icon-size {
  width: 24px;
  height: 24px;
}
</style>
```

#### 如果需要使用 font-size

如果需要像字体图标一样使用 `font-size` 来控制大小，有两种解决方案：

**方案 1: 使用 el-icon 包裹**

```vue
<template>
  <el-icon :size="20">
    <Cog6ToothIcon />
  </el-icon>
</template>

<script setup>
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
</script>
```

`el-icon` 会自动将 `size` 属性转换为 `width` 和 `height`。

**方案 2: 自己封装组件**

```vue
<!-- IconWrapper.vue -->
<template>
  <component :is="icon" :style="{ width: size, height: size }" />
</template>

<script setup>
defineProps({
  icon: {
    type: Object,
    required: true,
  },
  size: {
    type: [String, Number],
    default: '1em',
  },
})
</script>
```

使用封装组件：

```vue
<template>
  <IconWrapper :icon="Cog6ToothIcon" size="20px" />
  <!-- 或者使用 em 单位，这样可以通过父元素的 font-size 控制 -->
  <div style="font-size: 20px;">
    <IconWrapper :icon="Cog6ToothIcon" size="1em" />
  </div>
</template>

<script setup>
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import IconWrapper from './IconWrapper.vue'
</script>
```
