<template>
  <div class="button-doc-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">Button 组件演示</span>
          <div class="card-description">
            <p>
              本页面展示了两个实用的按钮组件：
              <code>IconButton</code>（图标按钮）和 <code>LoadingButton</code>（加载按钮）。
            </p>
            <p class="description-text">
              <strong>IconButton 组件：</strong>
              纯图标按钮组件，主要用于展示图标 + Tooltip
              提示的场景。在工作中，我们经常会需要这种纯图标的操作按钮（如刷新、删除、编辑等），但很多
              UI
              框架并没有提供这种专门的图标按钮组件。该组件支持多种类型（default、primary、success、warning、danger）、禁用状态、加载状态、自定义尺寸等功能，并且内置了
              Tooltip 提示，使用起来非常方便。
            </p>
            <p class="description-text">
              <strong>LoadingButton 组件：</strong>
              是否还在为一个页面需要多个 loading 按钮而写多个 loading
              变量控制而烦恼？这个组件就解决了这个问题。无需设置 loading 变量，组件内部直接提供了
              loading 状态管理。如果你的 click 事件是一个异步函数，组件会自动显示 loading
              状态，并在异步操作完成后自动隐藏。这很好地解决了需要写很多 loading
              变量的问题，也给大家提供了一些封装思路。
            </p>
            <p class="description-text">
              <strong>独立使用：</strong>
              如果你不想使用整个项目，也可以直接复制组件源码到自己的项目中使用。
              <code>IconButton</code> 组件主要依赖于 <code>element-plus</code>（使用
              <code>el-tooltip</code> 和 <code>el-icon</code>
              组件），使用前请确保已安装该依赖。
              <code>LoadingButton</code> 组件主要依赖于 <code>element-plus</code>（使用
              <code>el-button</code>
              组件），使用前请确保已安装该依赖。组件源码地址：
              <el-link
                href="https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/button/IconButton.vue"
                target="_blank"
                type="primary"
                :underline="false"
              >
                IconButton.vue
              </el-link>
              、
              <el-link
                href="https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/button/LoadingButton.vue"
                target="_blank"
                type="primary"
                :underline="false"
              >
                LoadingButton.vue
              </el-link>
              ，欢迎直接使用或根据需求进行二次开发。
            </p>
          </div>
        </div>
      </template>
      <div class="form-container">
        <!-- IconButton 效果预览 -->
        <div class="preview-section">
          <div class="section-title">
            <span>IconButton 效果预览</span>
          </div>
          <div class="preview-content">
            <div class="demo-group">
              <div class="demo-label">类型演示：</div>
              <div class="demo-buttons">
                <IconButton icon="HOutline:HandRaisedIcon" tooltip="默认类型" type="default" />
                <IconButton icon="HOutline:HandRaisedIcon" tooltip="主要类型" type="primary" />
                <IconButton icon="HOutline:HandRaisedIcon" tooltip="成功类型" type="success" />
                <IconButton icon="HOutline:HandRaisedIcon" tooltip="警告类型" type="warning" />
                <IconButton icon="HOutline:HandRaisedIcon" tooltip="危险类型" type="danger" />
              </div>
            </div>
            <div class="demo-group">
              <div class="demo-label">实际使用场景：</div>
              <div class="demo-buttons">
                <IconButton
                  icon="HOutline:ArrowPathIcon"
                  tooltip="刷新"
                  type="primary"
                  @click="handleClick('refresh')"
                />
                <IconButton
                  icon="HOutline:TrashIcon"
                  tooltip="删除"
                  type="danger"
                  @click="handleClick('delete')"
                />
                <IconButton
                  icon="HOutline:CheckCircleIcon"
                  tooltip="确认"
                  type="success"
                  @click="handleClick('confirm')"
                />
                <IconButton
                  icon="HOutline:ExclamationTriangleIcon"
                  tooltip="警告"
                  type="warning"
                  @click="handleClick('warning')"
                />
                <IconButton
                  :disabled="true"
                  icon="HOutline:HandRaisedIcon"
                  tooltip="禁用状态"
                  type="primary"
                  @click="handleClick('disabled')"
                />
              </div>
            </div>
            <div class="demo-group">
              <div class="demo-label">Loading 状态演示（点击查看 loading）：</div>
              <div class="demo-buttons">
                <IconButton
                  icon="HOutline:ArrowPathIcon"
                  tooltip="刷新"
                  type="primary"
                  :loading="refreshLoading"
                  @click="handleRefresh"
                />
                <IconButton
                  icon="HOutline:ArrowDownTrayIcon"
                  tooltip="下载"
                  type="success"
                  :loading="downloadLoading"
                  @click="handleDownload"
                />
                <IconButton
                  icon="HOutline:TrashIcon"
                  tooltip="删除"
                  type="danger"
                  :loading="deleteLoading"
                  @click="handleDelete"
                />
                <IconButton
                  icon="HOutline:ArrowPathIcon"
                  tooltip="自定义加载图标"
                  type="warning"
                  :loading="customLoading"
                  loading-icon="HOutline:SparklesIcon"
                  @click="handleCustom"
                />
              </div>
            </div>
          </div>
        </div>

        <el-divider />

        <!-- LoadingButton 效果预览 -->
        <div class="preview-section">
          <div class="section-title">
            <span>LoadingButton 效果预览</span>
          </div>
          <div class="preview-content">
            <div class="demo-group">
              <div class="demo-label">基础使用（点击按钮，自动显示 loading）：</div>
              <div class="demo-buttons">
                <LoadingButton type="primary" @click="handleAsyncClick">
                  点击我（异步操作）
                </LoadingButton>
                <LoadingButton type="success" @click="handleAsyncClick"> 成功按钮 </LoadingButton>
                <LoadingButton type="warning" @click="handleAsyncClick"> 警告按钮 </LoadingButton>
                <LoadingButton type="danger" @click="handleAsyncClick"> 危险按钮 </LoadingButton>
              </div>
            </div>
            <div class="demo-group">
              <div class="demo-label">
                延迟显示 loading（设置 loading-delay）：
                <span
                  style="
                    font-size: 0.75rem;
                    color: var(--el-text-color-secondary);
                    font-weight: normal;
                    margin-left: 8px;
                  "
                >
                  如果操作在延迟时间内完成，则不显示 loading，避免闪烁
                </span>
              </div>
              <div class="demo-buttons">
                <LoadingButton type="primary" :loading-delay="100" @click="handleQuickClick">
                  快速操作（100ms 延迟，会显示 loading）
                </LoadingButton>
                <LoadingButton type="primary" :loading-delay="500" @click="handleQuickClick">
                  快速操作（500ms 延迟，不会显示 loading）
                </LoadingButton>
              </div>
            </div>
            <div class="demo-group">
              <div class="demo-label">使用插槽自定义内容：</div>
              <div class="demo-buttons">
                <LoadingButton type="primary" @click="handleAsyncClick">
                  <template #icon>
                    <el-icon>
                      <component :is="menuStore.iconComponents['HOutline:HandRaisedIcon']" />
                    </el-icon>
                  </template>
                  <template #loading>
                    <el-icon class="is-loading">
                      <component :is="menuStore.iconComponents['HOutline:ArrowPathIcon']" />
                    </el-icon>
                  </template>
                  自定义按钮文本
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>

        <el-divider />

        <!-- IconButton 使用说明 -->
        <div class="usage-section">
          <div class="section-title">IconButton 使用说明</div>
          <div class="usage-info">
            <div class="usage-item">
              <h4 class="usage-title">基础用法</h4>
              <div class="usage-code">
                <pre><code>&lt;!-- 基础使用 --&gt;
&lt;IconButton icon="HOutline:ArrowPathIcon" tooltip="刷新" @click="handleRefresh" /&gt;

&lt;!-- 指定类型 --&gt;
&lt;IconButton icon="HOutline:TrashIcon" tooltip="删除" type="danger" @click="handleDelete" /&gt;

&lt;!-- 禁用状态 --&gt;
&lt;IconButton icon="HOutline:EditIcon" tooltip="编辑" :disabled="true" /&gt;

&lt;!-- 加载状态 --&gt;
&lt;IconButton
  icon="HOutline:ArrowPathIcon"
  tooltip="刷新"
  :loading="loading"
  @click="handleRefresh"
/&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <el-divider />

        <!-- IconButton 组件属性说明 -->
        <div class="usage-section">
          <div class="section-title">IconButton 组件属性介绍</div>
          <div class="usage-info">
            <div class="usage-item">
              <p class="usage-description">
                以下为组件的扩展属性，其余属性（如 <code>placement</code>、<code>effect</code>
                等）支持 Element Plus Tooltip 的相关属性，更多详情请查看
                <el-link
                  href="https://element-plus.org/zh-CN/component/tooltip"
                  target="_blank"
                  type="primary"
                  :underline="false"
                >
                  Element Plus Tooltip 文档
                </el-link>
                。
              </p>
              <div class="comparison-table">
                <el-table :data="iconButtonPropsTableData" border style="width: 100%">
                  <el-table-column prop="name" label="属性名" width="150">
                    <template #default="{ row }">
                      <strong>{{ row.name }}</strong>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="类型" width="200">
                    <template #default="{ row }">
                      <code>{{ row.type }}</code>
                    </template>
                  </el-table-column>
                  <el-table-column prop="default" label="默认值" width="120">
                    <template #default="{ row }">
                      <code>{{ row.default }}</code>
                    </template>
                  </el-table-column>
                  <el-table-column prop="description" label="说明" min-width="200" />
                </el-table>
              </div>
            </div>
          </div>
        </div>

        <el-divider />

        <!-- LoadingButton 使用说明 -->
        <div class="usage-section">
          <div class="section-title">LoadingButton 使用说明</div>
          <div class="usage-info">
            <div class="usage-item">
              <h4 class="usage-title">基础用法</h4>
              <div class="usage-code">
                <pre><code>&lt;!-- 基础使用，自动管理 loading 状态 --&gt;
&lt;LoadingButton type="primary" @click="handleSubmit"&gt;
  提交
&lt;/LoadingButton&gt;

&lt;!-- 异步操作会自动显示 loading --&gt;
&lt;script setup&gt;
const handleSubmit = async () => {
  await api.submit()
  // loading 状态会自动管理，无需手动设置
}
&lt;/script&gt;

&lt;!-- 设置延迟显示 loading --&gt;
&lt;LoadingButton type="primary" :loading-delay="500" @click="handleQuickAction"&gt;
  快速操作
&lt;/LoadingButton&gt;</code></pre>
              </div>
              <div class="usage-description" style="margin-top: 12px">
                传统方式需要为每个按钮单独维护 loading 变量；LoadingButton
                只写异步函数即可，多个按钮也无需额外状态：
              </div>
              <div class="usage-code">
                <pre><code>&lt;!-- 传统方式（3 个按钮需要 3 个 loading 变量） --&gt;
const loading1 = ref(false)
const loading2 = ref(false)
const loading3 = ref(false)

const handleSubmit = async () => { loading1.value = true; await api.submit(); loading1.value = false }
const handleSave = async () => { loading2.value = true; await api.save(); loading2.value = false }
const handleExport = async () => { loading3.value = true; await api.export(); loading3.value = false }

&lt;el-button :loading="loading1" @click="handleSubmit"&gt;提交表单&lt;/el-button&gt;
&lt;el-button :loading="loading2" @click="handleSave"&gt;保存数据&lt;/el-button&gt;
&lt;el-button :loading="loading3" @click="handleExport"&gt;导出数据&lt;/el-button&gt;

&lt;!-- LoadingButton（无需创建任何 loading 变量） --&gt;
const handleSubmit = async () => { await api.submit() }
const handleSave = async () => { await api.save() }
const handleExport = async () => { await api.export() }

&lt;LoadingButton @click="handleSubmit"&gt;提交表单&lt;/LoadingButton&gt;
&lt;LoadingButton @click="handleSave"&gt;保存数据&lt;/LoadingButton&gt;
&lt;LoadingButton @click="handleExport"&gt;导出数据&lt;/LoadingButton&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <el-divider />

        <!-- LoadingButton 组件属性说明 -->
        <div class="usage-section">
          <div class="section-title">LoadingButton 组件属性介绍</div>
          <div class="usage-info">
            <div class="usage-item">
              <p class="usage-description">
                该组件基于 Element Plus 的 <code>el-button</code> 组件封装，支持
                <code>el-button</code> 的所有属性和插槽（如
                <code>type</code
                >、<code>size</code>、<code>disabled</code>、<code>icon</code>、<code>loading</code>
                等），更多详情请查看
                <el-link
                  href="https://element-plus.org/zh-CN/component/button"
                  target="_blank"
                  type="primary"
                  :underline="false"
                >
                  Element Plus Button 文档
                </el-link>
                。
              </p>
              <p class="usage-description">
                另外，在插槽的参数中，组件会将
                <code>loading</code>
                状态也抛出来，你可以在插槽中读取这个状态来自定义显示内容。例如：
                <code
                  >&lt;template #default="{ loading }"&gt;&#123;&#123; loading ? '加载中...' :
                  '点击我' &#125;&#125;&lt;/template&gt;</code
                >
              </p>
              <p class="usage-description">
                <strong>提示：</strong>在使用
                <code>loading</code> 插槽自定义加载图标时，如果图标无法旋转，可以在图标上添加
                <code>is-loading</code> 类名来实现旋转效果。这是 Element Plus 用于 loading
                旋转的类名。例如：
                <code
                  >&lt;template #loading&gt;&lt;el-icon class="is-loading"&gt;&lt;Loading
                  /&gt;&lt;/el-icon&gt;&lt;/template&gt;</code
                >
              </p>
              <div class="comparison-table">
                <el-table :data="loadingButtonPropsTableData" border style="width: 100%">
                  <el-table-column prop="name" label="属性名" width="150">
                    <template #default="{ row }">
                      <strong>{{ row.name }}</strong>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="类型" width="200">
                    <template #default="{ row }">
                      <code>{{ row.type }}</code>
                    </template>
                  </el-table-column>
                  <el-table-column prop="default" label="默认值" width="120">
                    <template #default="{ row }">
                      <code>{{ row.default }}</code>
                    </template>
                  </el-table-column>
                  <el-table-column prop="description" label="说明" min-width="200" />
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

defineOptions({ name: 'ButtonView' })

const menuStore = useMenuStore()

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// IconButton loading 状态
const refreshLoading = ref(false)
const downloadLoading = ref(false)
const deleteLoading = ref(false)
const customLoading = ref(false)

// IconButton 事件处理
const handleClick = async (type: string) => {
  await delay(600)
  ElMessage.success(`${type} 操作完成`)
}

const handleRefresh = async () => {
  refreshLoading.value = true
  try {
    await delay(2000)
    ElMessage.success('刷新完成')
  } finally {
    refreshLoading.value = false
  }
}

const handleDownload = async () => {
  downloadLoading.value = true
  try {
    await delay(2000)
    ElMessage.success('下载完成')
  } finally {
    downloadLoading.value = false
  }
}

const handleDelete = async () => {
  deleteLoading.value = true
  try {
    await delay(2000)
    ElMessage.success('删除完成')
  } finally {
    deleteLoading.value = false
  }
}

const handleCustom = async () => {
  customLoading.value = true
  try {
    await delay(2000)
    ElMessage.success('自定义操作完成')
  } finally {
    customLoading.value = false
  }
}

// LoadingButton 事件处理
const handleAsyncClick = async () => {
  await delay(2000)
  ElMessage.success('异步操作完成')
}

const handleQuickClick = async () => {
  await delay(500)
  ElMessage.success('快速操作完成')
}

// IconButton 组件属性表格数据
const iconButtonPropsTableData = [
  {
    name: 'icon',
    type: 'string | Component',
    default: '-',
    description: '图标：可以是字符串（从 iconComponents 中获取）或直接传入图标组件（必需）',
  },
  {
    name: 'tooltip',
    type: 'string',
    default: '-',
    description: 'Tooltip 提示内容（可选，不传则不显示 tooltip）',
  },
  {
    name: 'placement',
    type: "'top' | 'bottom' | 'left' | 'right'",
    default: "'bottom'",
    description: 'Tooltip 位置',
  },
  {
    name: 'effect',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Tooltip 主题',
  },
  {
    name: 'showAfter',
    type: 'number',
    default: '200',
    description: 'Tooltip 显示延迟时间（毫秒）',
  },
  {
    name: 'size',
    type: 'string',
    default: "'2rem'",
    description: '按钮尺寸（默认：2rem / 32px）',
  },
  {
    name: 'iconSize',
    type: 'string',
    default: "'1.25rem'",
    description: '图标尺寸（默认：1.25rem）',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: '是否禁用',
  },
  {
    name: 'type',
    type: "'default' | 'primary' | 'success' | 'warning' | 'danger'",
    default: "'default'",
    description: '按钮类型',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: '是否加载中',
  },
  {
    name: 'loadingIcon',
    type: 'string | Component',
    default: "'HOutline:ArrowPathIcon'",
    description: '加载图标（可选，默认使用 ArrowPathIcon）',
  },
]

// LoadingButton 组件属性表格数据
const loadingButtonPropsTableData = [
  {
    name: 'loadingDelay',
    type: 'number',
    default: '0',
    description:
      '延迟显示 loading 的时间（毫秒）。如果异步操作在延迟时间内完成，则不显示 loading。这可以避免快速操作时出现闪烁的 loading 状态',
  },
]

// 注意：LoadingButton 支持 el-button 的所有属性，如 type、size、disabled、icon 等
</script>

<style scoped lang="scss">
.button-doc-container {
  .card-header {
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .card-description {
      margin-top: 8px;
      font-size: 0.875rem;
      color: var(--el-text-color-regular);
      line-height: 1.6;

      p {
        margin: 4px 0;
      }

      .description-text {
        color: var(--el-text-color-secondary);
        font-size: 0.8125rem;
      }

      code {
        padding: 2px 6px;
        background-color: var(--el-fill-color-light);
        border-radius: 3px;
        font-size: 0.8125rem;
        color: var(--el-color-primary);
      }
    }
  }

  .form-container {
    .preview-section {
      margin-bottom: 24px;

      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid var(--el-color-primary);
      }

      .preview-content {
        padding: 1rem;
        background-color: var(--el-bg-color);
        border: 1px solid var(--el-border-color);
        border-radius: 0.25rem;

        .demo-group {
          margin-bottom: 24px;

          &:last-child {
            margin-bottom: 0;
          }

          .demo-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--el-text-color-regular);
            margin-bottom: 12px;
          }

          .demo-buttons {
            display: flex;
            gap: 12px;
            align-items: center;
            flex-wrap: wrap;
          }
        }
      }
    }

    .el-divider {
      margin: 24px 0;
    }

    .usage-section {
      margin-top: 24px;

      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid var(--el-color-primary);
      }

      .usage-info {
        .usage-item {
          margin-bottom: 32px;

          &:last-child {
            margin-bottom: 0;
          }

          .usage-title {
            font-size: 0.9375rem;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin: 0 0 12px 0;
          }

          .usage-description {
            margin: 0 0 12px 0;
            color: var(--el-text-color-regular);
            font-size: 0.875rem;
            line-height: 1.6;

            code {
              padding: 2px 6px;
              background-color: var(--el-fill-color-light);
              border-radius: 3px;
              font-size: 0.8125rem;
              color: var(--el-color-primary);
            }
          }

          .usage-code {
            margin: 12px 0;
            pre {
              margin: 0;
              padding: 12px;
              background-color: var(--el-fill-color-dark);
              border-radius: 4px;
              overflow-x: auto;
              font-size: 0.8125rem;
              line-height: 1.6;

              code {
                color: var(--el-text-color-primary);
                font-family:
                  'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
              }
            }
          }

          .usage-list {
            margin: 12px 0;
            padding-left: 20px;
            color: var(--el-text-color-regular);
            font-size: 0.875rem;
            line-height: 1.8;

            li {
              margin-bottom: 8px;

              &:last-child {
                margin-bottom: 0;
              }

              code {
                padding: 2px 6px;
                background-color: var(--el-fill-color-light);
                border-radius: 3px;
                font-size: 0.8125rem;
                color: var(--el-color-primary);
              }
            }
          }

          .comparison-content {
            margin: 12px 0;

            p {
              margin: 0 0 8px 0;
              color: var(--el-text-color-regular);
              font-size: 0.875rem;
              font-weight: 500;
            }
          }

          .comparison-table {
            margin-top: 16px;

            :deep(.el-table) {
              .el-table__cell {
                padding: 12px 0;

                code {
                  padding: 2px 6px;
                  background-color: var(--el-fill-color-light);
                  border-radius: 3px;
                  font-size: 0.8125rem;
                  color: var(--el-color-primary);
                  font-family:
                    'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
                }
              }
            }
          }
        }
      }
    }

    .slot-section {
      margin-top: 24px;

      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid var(--el-color-primary);
      }

      .slot-info {
        .slot-description {
          margin: 0 0 16px 0;
          color: var(--el-text-color-regular);
          font-size: 0.875rem;
        }

        .slot-list {
          display: flex;
          flex-direction: column;
          gap: 20px;

          .slot-item {
            border: 1px solid var(--el-border-color-lighter);
            border-radius: 4px;
            padding: 16px;
            background-color: var(--el-bg-color-page);

            .slot-name {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 12px;

              .slot-label {
                font-size: 0.875rem;
                color: var(--el-text-color-regular);
                font-weight: 500;
              }
            }

            .slot-code {
              pre {
                margin: 0;
                padding: 12px;
                background-color: var(--el-fill-color-dark);
                border-radius: 4px;
                overflow-x: auto;
                font-size: 0.8125rem;
                line-height: 1.6;

                code {
                  color: var(--el-text-color-primary);
                  font-family:
                    'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
