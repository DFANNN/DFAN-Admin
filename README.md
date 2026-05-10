<div align="center">
  <img src="./public/logo.svg" alt="DFAN Admin Logo" width="120" />

# DFAN Admin

</div>

DFAN Admin 是一款基于 Vue 3、Element Plus 和 Vite 构建的现代化后台管理解决方案。采用了 MSW (Mock Service Worker) + IndexedDB 架构，在纯前端环境下实现了真实的数据拦截与持久化存储，为您提供无需后端支持即可进行完整 CRUD 操作的极致开发体验，适用于快速原型开发、演示系统搭建及 Vue 生态学习

**核心特色：** 使用 **MSW (Mock Service Worker) + IndexedDB** 架构，实现完全前端的数据拦截与持久化；既可作为无后端的演示模式运行，也能快速切换到真实 API。

> 🚧 **开发状态 (WIP)**
>
> - 核心架构（MSW + IndexedDB）已完成
> - 部分业务模块持续迭代中
> - 发现问题或缺少功能，欢迎提 Issue / Star 关注更新

## 🌐 在线演示

立即体验完整功能：

**🔗 [https://dfannn.github.io/DFAN-Admin/](https://dfannn.github.io/DFAN-Admin/)**

> **💡 提示**：演示环境的所有数据均存储在您浏览器的 **IndexedDB** 本地数据库中。刷新页面数据不丢失；如需重置数据，请清除浏览器缓存或删除 IndexedDB 数据。
>
> 如果遇到无法访问、页面一直加载或数据错乱，请清除 LocalStorage 和 IndexedDB 后再访问；如有重要数据请谨慎操作。

---

## ✨ 核心特性

### 🚀 灵活的架构设计

- **双模运行**：默认开启 MSW 拦截，模拟真实后端环境，实现完整的 CRUD；同时也支持关闭 Mock，直接对接真实 API 服务器。
- **纯前端闭环**：利用 Service Worker 拦截请求 + IndexedDB 本地存储，无需 Node.js 或数据库服务即可部署并运行完整的管理系统。

### 🎨 清爽规范的开发体验

- **零过度封装**：尽可能保持 Element Plus 原生写法，代码逻辑清晰，降低学习和二开成本。
- **统一配置**：通过 `src/config` 目录下的配置文件，即可快速调整系统标题、Logo、主题色及组件默认行为。
- **TypeScript**：全量使用 TypeScript，提供完整的类型推断。

### 🧩 完整的功能模块

- **用户/角色/菜单管理**：内置完善的 RBAC 权限管理模型。
- **个人中心**：支持资料修改、头像上传、密码变更。
- **高性能表格**：集成 VxeTable，支持虚拟滚动、右键菜单、表单搜索、拖拽排序、数据导入/导出等企业级功能。
- **UI 交互**：支持明暗主题切换、响应式布局、多标签页导航。
- **图标选择**：集成 Heroicons 与 Element Plus 图标库，支持丰富的图标选取体验。
- **移动端适配**：界面全面适配手机端，支持小屏设备流畅访问与操作。

## 🛠️ 技术栈

| 类别          | 技术                       | 版本      | 说明                                         |
| :------------ | :------------------------- | :-------- | :------------------------------------------- |
| **核心框架**  | Vue 3                      | ^3.5.22   | 组合式 API (Composition API)                 |
| **构建工具**  | Vite                       | ^7.1.11   | 极速的开发服务器与打包工具                   |
| **语言**      | TypeScript                 | ~5.9.0    | 强类型 JavaScript 超集                       |
| **UI 组件**   | Element Plus               | ^2.11.8   | 经典的 Vue 3 组件库                          |
| **表格组件**  | VxeTable + VxePC UI        | 4.17.29 / 4.11.5 | 企业级表格组件，支持虚拟滚动与高级功能 |
| **状态管理**  | Pinia                      | ^3.0.3    | Vue 官方推荐的状态管理库                     |
| **路由管理**  | Vue Router                 | ^4.6.3    | Vue 官方路由解决方案                         |
| **数据模拟**  | **MSW + IndexedDB**        | ^2.12.2   | **本项目核心亮点，实现浏览器端的数据持久化** |
| **样式方案**  | Tailwind CSS               | ^4.1.18   | 原子化 CSS 框架                              |
| **HTTP 请求** | Axios                      | ^1.13.2   | 基于 Promise 的 HTTP 客户端                  |
| **工具库**    | VueUse                     | ^14.0.0   | Vue 组合式 API 工具集                        |
| **日期处理**  | Day.js                     | ^1.11.19  | 轻量级日期处理库                             |
| **图表可视化** | ECharts + Vue-ECharts     | ^6.0.0 / ^8.0.1 | 强大的数据可视化图表库                |
| **动画效果**  | VueUse Motion + Lottie     | ^3.0.3 / ^5.13.0 | 动画与交互效果增强                    |
| **Canvas 绘图** | Konva + Vue-Konva        | ^10.2.5 / ^3.4.0 | 2D Canvas 图形编辑与标注              |
| **视频播放**  | HLS.js + mpegts.js         | ^1.6.16 / ^1.8.0 | 流媒体视频播放支持                    |
| **拖拽排序**  | Vue Draggable Plus         | ^0.6.1    | 拖拽排序组件                                 |
| **数据导出**  | XLSX + Print.js            | ^0.18.5 / ^1.6.0 | Excel 导出与打印功能                  |
| **国际化**    | Vue I18n                   | ^11.3.2   | 多语言国际化支持                             |
| **图标库**    | Heroicons + Element Icons  | ^2.2.0 / ^2.3.2 | 丰富的图标资源                        |
| **进度条**    | NProgress                  | ^0.2.0    | 页面加载进度提示                             |

## 🚀 快速开始

### 环境要求

- **Node.js**: `^20.19.0` 或 `>=22.12.0`
- **pnpm**: `>=10.4.1` (推荐)

### 1\. 安装依赖

```bash
pnpm install
```

### 2\. 启动开发服务器

```bash
pnpm dev
```

启动后访问 `http://localhost:3007`，MSW 会自动在浏览器中注册并拦截 `/DFAN-admin-api(可以自定义拦截地址)` 开头的请求。

### 3\. 构建生产版本

```bash
pnpm build
```

## ⚙️ 核心配置

项目秉持“约定优于配置”的原则，主要配置集中管理：

- **全局应用配置** (`src/config/app.config.ts`)
  - 是否开启MSW
  - 修改项目名称 (`name`)
  - 替换 Logo 和 Favicon
  - ...
- **UI 组件配置** (`src/config/elementConfig.ts`)
  - 统一设置表格边框、对齐方式
  - 全局定义分页器布局和页码大小
  - ...

## 📁 项目目录

```text
DFAN-Admin/
├── public/                 # 静态资源 (含 mockServiceWorker.js)
├── src/
│   ├── api/                # API 接口定义
│   ├── components/         # 公共组件
│   ├── config/             # 全局配置文件 (App & Element)
│   ├── mocks/              # MSW 数据模拟核心
│   │   ├── db/             # IndexedDB 数据库操作层
│   │   └── handlers/       # API 请求拦截处理器
│   ├── router/             # 路由配置
│   ├── stores/             # Pinia 状态仓库
│   ├── views/              # 页面视图
│   └── main.ts             # 入口文件
└── vite.config.ts          # Vite 配置
```

## 💡 开发指南

### 数据模拟机制 (Mock Mode)

1.  **拦截**：`src/mocks/handlers` 中的 Handler 拦截 API 请求。
2.  **处理**：调用 `src/mocks/db` 操作 IndexedDB 中的 `users`, `roles`, `menus` 表。
3.  **响应**：返回模拟的 JSON 数据，延迟和状态码均模拟真实网络环境。

### 内置组件与 Demo 案例

项目内置了丰富的扩展组件和完整的功能演示案例，开箱即用，方便学习和二次开发。

#### 📦 扩展组件 (`src/views/extended`)

提供了多个经过封装和优化的常用组件：

- **BasePage**：标准页面容器组件，统一页面布局风格
- **Button**：按钮组件扩展示例，展示各种按钮样式和交互
- **Card**：卡片组件示例，多种卡片布局和样式
- **Dialog**：对话框组件封装，简化弹窗使用
- **IconSelector**：图标选择器，支持 Heroicons 和 Element Plus 图标库
- **Tag**：标签组件示例，展示标签的多种用法
- **TextEllipsis**：文本省略组件，支持多行文本截断和 Tooltip 提示
- **HoverAnimation**：悬停动画效果组件
- **TransitionAnimation**：过渡动画效果组件

#### 🎯 功能演示 (`src/views/demo`)

提供了完整的功能实现案例，可直接参考或复用：

**1. VxeTable 高级表格** (`demo/vxeTable`)
- **虚拟滚动**：支持大数据量（1000+ 条）流畅渲染
- **表单搜索**：集成搜索表单，支持筛选和重置
- **CRUD 操作**：新增、编辑、删除（含确认框）
- **右键菜单**：支持复制单元格内容等自定义操作
- **工具栏功能**：打印、导入、导出、刷新、自定义列等
- **高级特性**：拖拽排序、列宽调整、复选框选择、分页等

**2. Konva 图像标注编辑器** (`demo/konva`)
- **图像标注**：支持矩形、圆形、多边形等多种标注形状
- **图层管理**：多图层支持，可自由切换和编辑
- **交互操作**：拖拽、缩放、旋转、删除等完整编辑功能
- **数据导出**：支持标注数据的导入导出

**3. 视频播放器集合** (`demo/video`)
- **HLS 播放器**：基于 HLS.js 的 HTTP Live Streaming 播放
- **MPEG-TS 播放器**：基于 mpegts.js 的流媒体播放
- **原生播放器**：HTML5 原生视频播放器封装
- **WebRTC 播放器**：实时音视频流播放支持

所有组件和案例均提供完整的源码和注释，可直接参考进行二次开发和功能扩展。

### 对接真实后端

若需对接真实后端，只需在 `src/config/app.config.ts` 中关闭 MSW 启用开关，或修改 `src/main.ts` 中移除 worker 启动代码，并配置 `.env.development/.env.production` 的 `VITE_API_BASE_URL` 指向您的服务器地址即可。

## 👥 适合人群

- 需要快速搭建**中后台原型**的前端开发者。
- 学习 **Vue 3 + TypeScript + Pinia** 全家桶的初学者。
- 希望研究 **MSW** 和 **IndexedDB** 前端数据模拟方案的进阶开发者。
- 寻找**纯前端**可部署演示系统的讲师或学生。

## 📄 许可证

Copyright (c) 2025 DFANNN

本项目采用 [MIT License](./LICENSE) 开源协议。

---

**⭐ 如果这个项目对你有帮助，欢迎点个 Star！**
