<div align="center">
  <img src="./public/logo.svg" alt="DFAN Admin Logo" width="120" />

# DFAN Admin

</div>

DFAN Admin 是一款基于 Vue 3、Element Plus 和 Vite 构建的现代化后台管理解决方案。采用了 MSW (Mock Service Worker) + IndexedDB 架构，在纯前端环境下实现了真实的数据拦截与持久化存储，为您提供无需后端支持即可进行完整 CRUD 操作的极致开发体验，适用于快速原型开发、演示系统搭建及 Vue 生态学习

**核心特色：** 使用 **MSW (Mock Service Worker) + IndexedDB** 架构，实现完全前端的数据拦截与持久化；既可作为无后端的演示模式运行，也能快速切换到真实 API。

> ✅ **开发状态**
>
> - 功能基本完成，持续维护中
> - 核心架构（MSW + IndexedDB）稳定运行
> - 发现问题或需要新功能，欢迎提 Issue / Star 关注更新

## 🌐 在线演示

立即体验完整功能：**[https://dfannn.github.io/DFAN-Admin/](https://dfannn.github.io/DFAN-Admin/)**

> **提示**：演示环境的所有数据均存储在您浏览器的 **IndexedDB** 本地数据库中。刷新页面数据不丢失；如需重置数据，请清除浏览器缓存或删除 IndexedDB 数据。
>
> 如果遇到无法访问、页面一直加载或数据错乱，请清除 LocalStorage 和 IndexedDB 后再访问；如有重要数据请谨慎操作。

---

## ✨ 核心特性

### 🚀 灵活的架构设计

- **双模运行**：默认开启 MSW 拦截，模拟真实后端环境，实现完整的 CRUD；同时也支持关闭 Mock，直接对接真实 API 服务器。
- **纯前端闭环**：利用 Service Worker 拦截请求 + IndexedDB 本地存储，无需 Node.js 或数据库服务即可部署并运行完整的管理系统。

### 🎨 清爽规范的开发体验

- **合理的组件封装**：在保持 Element Plus 原生写法的基础上，对常用业务场景进行了适度封装（如 BaseDialog、BasePage、IconSelector 等），既提升开发效率，又保持代码清晰易懂。
- **统一配置管理**：通过 `src/config` 目录下的配置文件，即可快速调整系统标题、Logo、主题色及组件默认行为。
- **TypeScript 全覆盖**：全量使用 TypeScript，提供完整的类型推断和代码提示。

### 🧩 完整的功能模块

#### 系统管理

- **用户管理**：用户列表、新增/编辑/删除用户、用户状态管理、头像上传
- **角色管理**：角色列表、权限分配、角色状态管理
- **菜单管理**：菜单树形结构、动态路由配置、图标选择、菜单排序

#### 权限控制

- **RBAC 权限模型**：基于角色的访问控制，支持按钮级权限控制
- **动态路由**：根据用户角色动态生成菜单和路由
- **权限指令**：提供 `v-permission` 指令，便捷控制元素显示

#### 个人中心

- **个人信息**：资料修改、头像上传、密码变更
- **登录日志**：查看历史登录记录、设备信息、IP 地址
- **我的权限**：查看当前用户拥有的所有权限
- **我的消息**：消息通知列表

#### 数据展示

- **仪表盘**：
  - **工作台**：欢迎面板、快捷入口、项目统计、团队成员、活动动态
  - **分析页**：数据概览、收入利润分析、渠道销售、市场份额、运营事件
  - **监控页**：实时监控、资源使用、日志查看、节点状态、吞吐量统计
- **高性能表格**：集成 VxeTable，支持虚拟滚动、右键菜单、表单搜索、拖拽排序、数据导入/导出等企业级功能
- **图表可视化**：基于 ECharts 的多种图表展示

#### 功能演示

- **VxeTable 高级表格**：虚拟滚动、CRUD 操作、工具栏、右键菜单、拖拽排序
- **Konva 图像标注**：图像标注编辑器、多图层管理、标注数据导出
- **视频播放器**：HLS、MPEG-TS、WebRTC、原生播放器支持

#### UI 交互

- **主题切换**：支持明暗主题切换、自定义主题色
- **布局模式**：支持左侧菜单、顶部菜单两种布局模式
- **多标签页**：标签页导航、右键菜单、标签页缓存
- **国际化**：支持中文简体、中文繁体、英文三种语言
- **响应式布局**：全面适配桌面端和移动端

#### 扩展组件

- **页面容器**：BasePage 统一页面布局
- **对话框**：BaseDialog 封装、图标选择器、头像选择器
- **卡片组件**：BaseCard、ProjectCard、TeamMemberCard
- **按钮组件**：IconButton、LoadingButton
- **标签组件**：BaseTag 多种样式
- **文本组件**：TextEllipsis 文本省略与 Tooltip
- **动画组件**：HoverAnimation、TransitionAnimation、Lottie 动画

## 🛠️ 技术栈

| 类别            | 技术                      | 版本             | 说明                                         |
| :-------------- | :------------------------ | :--------------- | :------------------------------------------- |
| **核心框架**    | Vue 3                     | ^3.5.22          | 组合式 API (Composition API)                 |
| **构建工具**    | Vite                      | ^7.1.11          | 极速的开发服务器与打包工具                   |
| **语言**        | TypeScript                | ~5.9.0           | 强类型 JavaScript 超集                       |
| **UI 组件**     | Element Plus              | ^2.11.8          | 经典的 Vue 3 组件库                          |
| **表格组件**    | VxeTable + VxePC UI       | 4.17.29 / 4.11.5 | 企业级表格组件，支持虚拟滚动与高级功能       |
| **状态管理**    | Pinia                     | ^3.0.3           | Vue 官方推荐的状态管理库                     |
| **路由管理**    | Vue Router                | ^4.6.3           | Vue 官方路由解决方案                         |
| **数据模拟**    | **MSW + IndexedDB**       | ^2.12.2          | **本项目核心亮点，实现浏览器端的数据持久化** |
| **样式方案**    | Tailwind CSS              | ^4.1.18          | 原子化 CSS 框架                              |
| **HTTP 请求**   | Axios                     | ^1.13.2          | 基于 Promise 的 HTTP 客户端                  |
| **工具库**      | VueUse                    | ^14.0.0          | Vue 组合式 API 工具集                        |
| **日期处理**    | Day.js                    | ^1.11.19         | 轻量级日期处理库                             |
| **图表可视化**  | ECharts + Vue-ECharts     | ^6.0.0 / ^8.0.1  | 强大的数据可视化图表库                       |
| **动画效果**    | VueUse Motion + Lottie    | ^3.0.3 / ^5.13.0 | 动画与交互效果增强                           |
| **Canvas 绘图** | Konva + Vue-Konva         | ^10.2.5 / ^3.4.0 | 2D Canvas 图形编辑与标注                     |
| **视频播放**    | HLS.js + mpegts.js        | ^1.6.16 / ^1.8.0 | 流媒体视频播放支持                           |
| **拖拽排序**    | Vue Draggable Plus        | ^0.6.1           | 拖拽排序组件                                 |
| **数据导出**    | XLSX + Print.js           | ^0.18.5 / ^1.6.0 | Excel 导出与打印功能                         |
| **国际化**      | Vue I18n                  | ^11.3.2          | 多语言国际化支持                             |
| **图标库**      | Heroicons + Element Icons | ^2.2.0 / ^2.3.2  | 丰富的图标资源                               |
| **进度条**      | NProgress                 | ^0.2.0           | 页面加载进度提示                             |

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

## 📁 项目目录结构

```text
DFAN-Admin/
├── .github/                    # GitHub 配置
│   └── workflows/              # GitHub Actions 工作流
│       └── deploy.yml          # 自动部署配置
├── public/                     # 静态资源目录
│   ├── favicon.ico             # 网站图标
│   ├── logo.svg                # Logo 图标
│   └── mockServiceWorker.js    # MSW Service Worker 文件
├── src/                        # 源代码目录
│   ├── api/                    # API 接口定义
│   │   ├── login.ts            # 登录相关接口
│   │   ├── menu.ts             # 菜单相关接口
│   │   ├── role.ts             # 角色相关接口
│   │   └── user.ts             # 用户相关接口
│   ├── assets/                 # 静态资源
│   │   ├── images/             # 图片资源
│   │   ├── lotties/            # Lottie 动画文件
│   │   ├── defaultAvatar.svg   # 默认头像
│   │   └── logo.svg            # Logo
│   ├── components/             # 公共组件
│   │   ├── animation/          # 动画组件
│   │   ├── button/             # 按钮组件
│   │   ├── card/               # 卡片组件
│   │   ├── dialog/             # 对话框组件
│   │   ├── icons/              # 图标组件
│   │   ├── page/               # 页面容器组件
│   │   │   ├── tools/          # 表格工具组件
│   │   │   └── BasePage.vue    # 基础页面容器
│   │   ├── tabs/               # 标签页组件
│   │   ├── tag/                # 标签组件
│   │   ├── text/               # 文本组件
│   │   └── ThemeConfig.vue     # 主题配置组件
│   ├── composables/            # 组合式函数
│   │   ├── useButtonPermission.ts  # 按钮权限控制
│   │   ├── useIcon.ts          # 图标处理
│   │   └── useTableHeight.ts   # 表格高度计算
│   ├── config/                 # 全局配置
│   │   ├── defaultSeeds/       # 默认数据种子
│   │   │   ├── menus.ts        # 默认菜单数据
│   │   │   ├── roles.ts        # 默认角色数据
│   │   │   └── users.ts        # 默认用户数据
│   │   ├── app.config.ts       # 应用全局配置
│   │   └── elementConfig.ts    # Element Plus 组件配置
│   ├── constants/              # 常量定义
│   │   └── dict.ts             # 字典数据
│   ├── directives/             # 自定义指令
│   │   └── permission.ts       # 权限指令
│   ├── i18n/                   # 国际化配置
│   │   ├── en-US.json          # 英文语言包
│   │   ├── zh-CN.json          # 简体中文语言包
│   │   ├── zh-TW.json          # 繁体中文语言包
│   │   └── index.ts            # 国际化入口
│   ├── layouts/                # 布局组件
│   │   ├── breadcrumb.vue      # 面包屑导航
│   │   ├── header.vue          # 顶部栏
│   │   ├── i18nDropdown.vue    # 语言切换下拉菜单
│   │   ├── index.vue           # 布局主容器
│   │   ├── leftMode.vue        # 左侧菜单布局
│   │   ├── menu.vue            # 菜单组件
│   │   ├── menuItem.vue        # 菜单项组件
│   │   ├── notificationDropdown.vue  # 通知下拉菜单
│   │   ├── tabsView.vue        # 标签页视图
│   │   ├── topMode.vue         # 顶部菜单布局
│   │   └── userDropdown.vue    # 用户下拉菜单
│   ├── mocks/                  # MSW 数据模拟核心
│   │   ├── db/                 # IndexedDB 数据库操作层
│   │   │   ├── core.ts         # 数据库核心操作
│   │   │   ├── index.ts        # 数据库入口
│   │   │   ├── initData.ts     # 数据初始化
│   │   │   ├── menus.ts        # 菜单数据操作
│   │   │   ├── roles.ts        # 角色数据操作
│   │   │   ├── types.ts        # 类型定义
│   │   │   └── users.ts        # 用户数据操作
│   │   ├── handlers/           # API 请求拦截处理器
│   │   │   ├── auth.ts         # 认证相关处理器
│   │   │   ├── index.ts        # 处理器入口
│   │   │   ├── menus.ts        # 菜单相关处理器
│   │   │   ├── roles.ts        # 角色相关处理器
│   │   │   ├── users.ts        # 用户相关处理器
│   │   │   └── utils.ts        # 工具函数
│   │   └── browser.ts          # MSW 浏览器配置
│   ├── plugins/                # 插件配置
│   │   ├── echarts.ts          # ECharts 配置
│   │   └── vxeTable.ts         # VxeTable 配置
│   ├── router/                 # 路由配置
│   │   ├── index.ts            # 路由入口
│   │   └── route.ts            # 路由定义
│   ├── stores/                 # Pinia 状态管理
│   │   ├── lang.ts             # 语言状态
│   │   ├── menu.ts             # 菜单状态
│   │   ├── tabs.ts             # 标签页状态
│   │   ├── theme.ts            # 主题状态
│   │   └── user.ts             # 用户状态
│   ├── styles/                 # 样式文件
│   │   ├── common.scss         # 公共样式
│   │   ├── index.css           # 样式入口
│   │   ├── nprogress.css       # 进度条样式
│   │   ├── theme.css           # 主题样式
│   │   ├── transitionAnimation.css  # 过渡动画样式
│   │   └── vxeTable.css        # VxeTable 样式
│   ├── types/                  # TypeScript 类型定义
│   │   ├── components/         # 组件类型
│   │   ├── system/             # 系统模块类型
│   │   ├── app.config.ts       # 应用配置类型
│   │   ├── common.ts           # 公共类型
│   │   ├── lang.ts             # 语言类型
│   │   ├── login.ts            # 登录类型
│   │   ├── profile.ts          # 个人中心类型
│   │   └── themeConfig.ts      # 主题配置类型
│   ├── utils/                  # 工具函数
│   │   ├── dialog.ts           # 对话框工具
│   │   ├── exportExcel.ts      # Excel 导出
│   │   ├── menuToRoute.ts      # 菜单转路由
│   │   ├── request.ts          # HTTP 请求封装
│   │   ├── storage.ts          # 本地存储封装
│   │   └── utils.ts            # 通用工具函数
│   ├── views/                  # 页面视图
│   │   ├── dashboard/          # 仪表盘
│   │   │   ├── analysis/       # 分析页
│   │   │   ├── home/           # 工作台
│   │   │   └── monitor/        # 监控页
│   │   ├── demo/               # 功能演示
│   │   │   ├── konva/          # Konva 图像标注
│   │   │   ├── video/          # 视频播放器
│   │   │   └── vxeTable/       # VxeTable 高级表格
│   │   ├── exception/          # 异常页面
│   │   │   ├── 403/            # 无权限页面
│   │   │   └── 404/            # 页面不存在
│   │   ├── extended/           # 扩展组件示例
│   │   │   ├── basePage/       # 页面容器示例
│   │   │   ├── button/         # 按钮示例
│   │   │   ├── card/           # 卡片示例
│   │   │   ├── dialog/         # 对话框示例
│   │   │   ├── hoverAnimation/ # 悬停动画示例
│   │   │   ├── iconSelector/   # 图标选择器示例
│   │   │   ├── tag/            # 标签示例
│   │   │   ├── textEllipsis/   # 文本省略示例
│   │   │   └── transitionAnimation/  # 过渡动画示例
│   │   ├── login/              # 登录页面
│   │   │   ├── accountLogin.vue     # 账号登录
│   │   │   ├── forgotPassword.vue   # 忘记密码
│   │   │   ├── index.vue       # 登录主页
│   │   │   ├── mobileLogin.vue # 手机登录
│   │   │   ├── qrLogin.vue     # 扫码登录
│   │   │   └── register.vue    # 注册
│   │   ├── profile/            # 个人中心
│   │   │   ├── archivesPanel.vue    # 档案面板
│   │   │   ├── gradientHeader.vue   # 渐变头部
│   │   │   ├── index.vue       # 个人中心主页
│   │   │   ├── loginLogs.vue   # 登录日志
│   │   │   ├── myInformation.vue    # 我的信息
│   │   │   ├── myMessages.vue  # 我的消息
│   │   │   ├── myPermission.vue     # 我的权限
│   │   │   ├── myProject.vue   # 我的项目
│   │   │   ├── personalInfoPanel.vue  # 个人信息面板
│   │   │   └── userMainPanel.vue    # 用户主面板
│   │   ├── redirect/           # 重定向页面
│   │   └── system/             # 系统管理
│   │       ├── menu/           # 菜单管理
│   │       ├── role/           # 角色管理
│   │       └── user/           # 用户管理
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 应用入口
├── .editorconfig               # 编辑器配置
├── .env.development            # 开发环境变量
├── .env.production             # 生产环境变量
├── .gitattributes              # Git 属性配置
├── .gitignore                  # Git 忽略配置
├── .prettierrc.json            # Prettier 配置
├── clean-build.sh              # 清理构建脚本
├── env.d.ts                    # 环境变量类型定义
├── eslint.config.ts            # ESLint 配置
├── LICENSE                     # 开源协议
├── loading.html                # 加载页面
├── package.json                # 项目依赖配置
├── pnpm-lock.yaml              # pnpm 锁文件
├── Process.md                  # 开发流程文档
├── README.md                   # 项目说明文档
├── tsconfig.json               # TypeScript 配置
├── vite-env.d.ts               # Vite 环境类型定义
└── vite.config.ts              # Vite 配置文件
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
