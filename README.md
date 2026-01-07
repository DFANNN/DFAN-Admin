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

| 类别          | 技术                  | 说明                                         |
| :------------ | :-------------------- | :------------------------------------------- |
| **核心框架**  | Vue 3                 | 组合式 API (Composition API)                 |
| **构建工具**  | Vite                  | 极速的开发服务器与打包工具                   |
| **语言**      | TypeScript            | 强类型 JavaScript 超集                       |
| **UI 组件**   | Element Plus          | 经典的 Vue 3 组件库                          |
| **表格组件**  | VxeTable + VxePC UI   | 企业级表格组件，支持虚拟滚动与高级功能       |
| **状态/路由** | Pinia + Vue Router    | 官方推荐的状态与路由管理                     |
| **数据模拟**  | **MSW + IndexedDB**   | **本项目核心亮点，实现浏览器端的数据持久化** |
| **工具库**    | Axios, Day.js, VueUse | HTTP 请求与常用工具函数                      |

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
  - 配置首页轮播图
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

### VxeTable 表格示例

项目内置了完整的 VxeTable 使用示例（`src/views/demo/vxeTable`），展示了以下功能：

- **虚拟滚动**：支持大数据量（1000+ 条）流畅渲染
- **表单搜索**：集成搜索表单，支持筛选和重置
- **CRUD 操作**：新增、编辑、删除（含确认框）
- **右键菜单**：支持复制单元格内容等自定义操作
- **工具栏功能**：打印、导入、导出、刷新、自定义列等
- **高级特性**：拖拽排序、列宽调整、复选框选择、分页等

可直接参考该示例进行二次开发和功能扩展。

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
