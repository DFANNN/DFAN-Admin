<template>
  <div class="dialog-doc-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">BaseDialog 组件演示</span>
          <div class="card-description">
            <p>基于 Element Plus 的 el-dialog 二次封装组件</p>
            <p class="description-text">
              以下功能为扩展功能，其余功能支持 Element Plus
              的相关属性（如：before-close、close-on-click-modal 等）， 更多详情请查看
              <el-link
                href="https://element-plus.org/zh-CN/component/dialog"
                target="_blank"
                type="primary"
                :underline="false"
              >
                Element Plus Dialog 文档
              </el-link>
            </p>
          </div>
        </div>
      </template>
      <div class="form-container">
        <!-- 操作按钮 -->
        <div class="action-bar">
          <el-button type="primary" size="large" @click="open = true">打开对话框</el-button>
        </div>

        <el-form :model="dialogForm" label-width="auto">
          <!-- 基础配置 -->
          <div class="form-section">
            <div class="section-title">基础配置</div>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="对话框标题" prop="title">
                  <el-input v-model="dialogForm.title" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="对话框宽度" prop="width">
                  <el-input v-model="dialogForm.width" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="确定按钮文本" prop="confirmText">
                  <el-input v-model="dialogForm.confirmText" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="取消按钮文本" prop="cancelText">
                  <el-input v-model="dialogForm.cancelText" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <el-divider />

          <!-- 交互功能 -->
          <div class="form-section">
            <div class="section-title">交互功能</div>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="是否启用拖拽移动" prop="draggable">
                  <el-switch v-model="dialogForm.draggable" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="resizable">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>是否启用拖拽调整大小</span>
                      <el-tooltip
                        content="启用后，用户可以通过拖拽对话框边缘来调整对话框的大小"
                        placement="top"
                      >
                        <el-icon class="label-tooltip-icon">
                          <component
                            :is="menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']"
                          />
                        </el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch v-model="dialogForm.resizable" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="是否全屏展示" prop="fullscreen">
                  <el-switch v-model="dialogForm.fullscreen" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <el-divider />

          <!-- 显示控制 -->
          <div class="form-section">
            <div class="section-title">显示控制</div>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="是否显示全屏按钮" prop="showFullscreenButton">
                  <el-switch v-model="dialogForm.showFullscreenButton" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="是否显示关闭按钮" prop="showClose">
                  <el-switch v-model="dialogForm.showClose" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="是否显示页脚" prop="showFooter">
                  <el-switch v-model="dialogForm.showFooter" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="是否显示取消按钮" prop="showCancelButton">
                  <el-switch v-model="dialogForm.showCancelButton" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="是否显示确定按钮" prop="showConfirmButton">
                  <el-switch v-model="dialogForm.showConfirmButton" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="showConfirmLoading">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>确认按钮加载状态</span>
                      <el-tooltip
                        content="启用后，点击确定按钮时会显示加载状态，防止重复提交"
                        placement="top"
                      >
                        <el-icon class="label-tooltip-icon">
                          <component
                            :is="menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']"
                          />
                        </el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch v-model="dialogForm.showConfirmLoading" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="closeIcon">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>关闭按钮图标</span>
                      <el-tooltip
                        content="支持传递字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件"
                        placement="top"
                      >
                        <el-icon class="label-tooltip-icon">
                          <component
                            :is="menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']"
                          />
                        </el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-input v-model="dialogForm.closeIcon" placeholder="如：HOutline:XMarkIcon" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="关闭按钮图标尺寸" prop="closeIconSize">
                  <el-input v-model="dialogForm.closeIconSize" placeholder="如：1.5rem" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="fullscreenIcon">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>全屏按钮图标</span>
                      <el-tooltip
                        content="支持传递字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件"
                        placement="top"
                      >
                        <el-icon class="label-tooltip-icon">
                          <component
                            :is="menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']"
                          />
                        </el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-input
                    v-model="dialogForm.fullscreenIcon"
                    placeholder="如：HOutline:ArrowsPointingOutIcon"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="全屏按钮图标尺寸" prop="fullscreenIconSize">
                  <el-input v-model="dialogForm.fullscreenIconSize" placeholder="如：1.25rem" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="exitFullscreenIcon">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>退出全屏按钮图标</span>
                      <el-tooltip
                        content="支持传递字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件"
                        placement="top"
                      >
                        <el-icon class="label-tooltip-icon">
                          <component
                            :is="menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']"
                          />
                        </el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-input
                    v-model="dialogForm.exitFullscreenIcon"
                    placeholder="如：HOutline:ArrowsPointingInIcon"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="退出全屏按钮图标尺寸" prop="exitFullscreenIconSize">
                  <el-input v-model="dialogForm.exitFullscreenIconSize" placeholder="如：1.25rem" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <el-divider />

          <!-- 移动端配置 -->
          <div class="form-section">
            <div class="section-title">移动端配置</div>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="mobileAdaptive">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>是否支持移动端适配</span>
                      <el-tooltip
                        content="启用后，当屏幕宽度小于移动端断点时，对话框宽度会自动调整为移动端宽度"
                        placement="top"
                      >
                        <el-icon class="label-tooltip-icon">
                          <component
                            :is="menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']"
                          />
                        </el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch v-model="dialogForm.mobileAdaptive" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="mobileWidth">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>移动端对话框宽度</span>
                      <el-tooltip
                        content="在移动端设备上对话框的宽度，支持百分比（如：90%）或固定像素值（如：320px）"
                        placement="top"
                      >
                        <el-icon class="label-tooltip-icon">
                          <component
                            :is="menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']"
                          />
                        </el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-input v-model="dialogForm.mobileWidth" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="mobileBreakpoint">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>移动端断点</span>
                      <el-tooltip
                        content="屏幕宽度小于此值时视为移动端设备，对话框会使用移动端宽度（单位：px，默认：992）"
                        placement="top"
                      >
                        <el-icon class="label-tooltip-icon">
                          <component
                            :is="menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']"
                          />
                        </el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-input v-model="dialogForm.mobileBreakpoint" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>

        <!-- Dialog 快捷调用演示 -->
        <el-divider />
        <div class="form-section">
          <div class="section-title">Dialog 快捷调用演示</div>
          <div class="dialog-demo-buttons">
            <el-button @click="showInfoDialog">info</el-button>
            <el-button @click="showSuccessDialog">success</el-button>
            <el-button @click="showWarningDialog">warning</el-button>
            <el-button @click="showErrorDialog">error</el-button>
            <el-button @click="showConfirmDialog">confirm</el-button>
          </div>
          <div class="dialog-demo-description">
            <span>Dialog 快捷调用支持 BaseDialog 组件的所有属性，新增属性：</span>
            <span class="property-item"><code>icon</code> 自定义图标</span>、
            <span class="property-item"><code>content</code> 对话框内容</span>、
            <span class="property-item"><code>onClose</code> 关闭回调</span>、
            <span class="property-item"><code>onConfirm</code> 确认回调</span>
          </div>
        </div>

        <!-- 事件说明 -->
        <el-divider />
        <div class="event-section">
          <div class="section-title">事件说明</div>
          <div class="event-item">
            <div class="event-name"><el-tag type="danger" size="small">close</el-tag></div>
            <span class="event-label">
              对话框关闭时触发（点击关闭按钮、取消按钮、遮罩层或 ESC 键）
            </span>
          </div>
          <div class="event-item">
            <div class="event-name"><el-tag type="success" size="small">confirm</el-tag></div>
            <span class="event-label"> 点击确定按钮时触发（仅在默认页脚模式下生效） </span>
          </div>
        </div>

        <!-- 插槽使用说明 -->
        <el-divider />
        <div class="slot-section">
          <div class="section-title">插槽使用说明</div>
          <div class="slot-info">
            <p class="slot-description">
              BaseDialog 组件支持以下插槽，可以自定义对话框的各个部分：
            </p>
            <div class="slot-list">
              <div class="slot-item">
                <div class="slot-name">
                  <el-tag type="primary" size="small">header</el-tag>
                  <span class="slot-label">
                    自定义头部内容（使用 header 插槽时，会覆盖 title 属性）
                  </span>
                </div>
                <div class="slot-code">
                  <pre><code>&lt;BaseDialog v-model="open"&gt;
  &lt;template #header&gt;
    &lt;div&gt;自定义标题&lt;/div&gt;
  &lt;/template&gt;
&lt;/BaseDialog&gt;</code></pre>
                </div>
              </div>
              <div class="slot-item">
                <div class="slot-name">
                  <el-tag type="success" size="small">default</el-tag>
                  <span class="slot-label">对话框主体内容（默认插槽）</span>
                </div>
                <div class="slot-code">
                  <pre><code>&lt;BaseDialog v-model="open"&gt;
  &lt;div&gt;这是对话框的内容&lt;/div&gt;
  &lt;p&gt;可以放置任何内容&lt;/p&gt;
&lt;/BaseDialog&gt;</code></pre>
                </div>
              </div>
              <div class="slot-item">
                <div class="slot-name">
                  <el-tag type="warning" size="small">footer</el-tag>
                  <span class="slot-label">
                    自定义页脚内容（使用 footer
                    插槽时，会覆盖自带的页脚内容，并且也不会有确定按钮loading状态，也无法触发confirm事件）
                  </span>
                </div>
                <div class="slot-code">
                  <pre><code>&lt;BaseDialog v-model="open" :show-footer="false"&gt;
  &lt;template #footer&gt;
    &lt;el-button&gt;自定义按钮&lt;/el-button&gt;
  &lt;/template&gt;
&lt;/BaseDialog&gt;</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BaseDialog
        v-model="open"
        :title="dialogForm.title"
        :width="dialogForm.width"
        :draggable="dialogForm.draggable"
        :resizable="dialogForm.resizable"
        :fullscreen="dialogForm.fullscreen"
        :showFullscreenButton="dialogForm.showFullscreenButton"
        :showClose="dialogForm.showClose"
        :showFooter="dialogForm.showFooter"
        :showCancelButton="dialogForm.showCancelButton"
        :showConfirmButton="dialogForm.showConfirmButton"
        :confirmText="dialogForm.confirmText"
        :cancelText="dialogForm.cancelText"
        :showConfirmLoading="dialogForm.showConfirmLoading"
        :close-icon="dialogForm.closeIcon"
        :close-icon-size="dialogForm.closeIconSize"
        :fullscreen-icon="dialogForm.fullscreenIcon"
        :fullscreen-icon-size="dialogForm.fullscreenIconSize"
        :exit-fullscreen-icon="dialogForm.exitFullscreenIcon"
        :exit-fullscreen-icon-size="dialogForm.exitFullscreenIconSize"
        @confirm="handleConfirm"
        @close="handleClose"
      >
        <div class="dialog-content">
          <div class="feature-list">
            <h4 style="margin: 0 0 12px 0; color: var(--el-text-color-primary)">主要特性：</h4>
            <ul style="margin: 0; padding-left: 20px; color: var(--el-text-color-regular)">
              <li>支持拖拽移动和调整大小</li>
              <li>支持全屏展示</li>
              <li>支持移动端自适应</li>
              <li>支持自定义图标和样式</li>
              <li>支持插槽自定义内容</li>
              <li>支持事件回调</li>
            </ul>
          </div>
        </div>
      </BaseDialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Dialog } from '@/utils/dialog'

defineOptions({ name: 'DialogView' })

const menuStore = useMenuStore()

const open = ref(false)

const dialogForm = ref({
  title: 'Dialog Title',
  width: '500px',
  draggable: true,
  resizable: true,
  fullscreen: false,
  showConfirmLoading: true,
  showFullscreenButton: true,
  showClose: true,
  showFooter: true,
  showCancelButton: true,
  showConfirmButton: true,
  confirmText: '确定',
  cancelText: '取消',
  mobileAdaptive: true,
  mobileWidth: '90%',
  mobileBreakpoint: 992,
  closeIcon: 'HOutline:XMarkIcon',
  closeIconSize: '1.5rem',
  fullscreenIcon: 'HOutline:ArrowsPointingOutIcon',
  fullscreenIconSize: '1.25rem',
  exitFullscreenIcon: 'HOutline:ArrowsPointingInIcon',
  exitFullscreenIconSize: '1.25rem',
})

const handleConfirm = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  ElMessage.success('点击了确定按钮')
  open.value = false
}

const handleClose = () => {
  ElMessage.success('关闭了对话框')
}

// Dialog 快捷调用演示
const showInfoDialog = () => {
  Dialog.info({
    title: '系统维护通知',
    content:
      '今晚 23:00 将进行例行维护，预计 2 小时。期间只读功能可用，写入操作将暂缓，请提前保存进度。',
    confirmText: '好的，知道了',
    onConfirm: () => {
      ElMessage.success('已知悉维护时间')
    },
  })
}

const showSuccessDialog = () => {
  Dialog.success({
    title: '批量任务完成',
    content: '批量清理完成：共处理 18 条记录，成功 17 条，跳过 1 条（已被锁定）。',
    confirmText: '查看日志',
    onConfirm: () => {
      ElMessage.success('已跳转到日志中心')
    },
  })
}

const showWarningDialog = () => {
  Dialog.warning({
    title: '数据异常提醒',
    content:
      '检测到 3 条待处理数据存在缺失字段，后续导出可能失败。建议先修复后再继续操作，是否忽略并继续？',
    showCancelButton: true,
    confirmText: '仍要继续',
    onConfirm: () => {
      ElMessage.success('选择继续执行')
    },
    onClose: () => {
      ElMessage.info('已返回修复数据')
    },
  })
}

const showErrorDialog = () => {
  Dialog.error({
    title: '导出失败',
    content:
      '导出失败：网络连接异常（超时 15s）。请检查网络后重试，或切换到“异步导出”模式稍后下载。',
    confirmText: '重试',
    showCancelButton: true,
    onConfirm: () => {
      ElMessage.success('已开始重试导出')
    },
    onClose: () => {
      ElMessage.info('已取消导出')
    },
  })
}

const showConfirmDialog = () => {
  Dialog.confirm({
    title: '删除确认',
    content: '确定要删除选中的 5 条数据吗？删除后无法恢复，相关报表将重新统计。',
    confirmText: '确认删除',
    cancelText: '再想想',
    showCancelButton: true,
    onConfirm: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      ElMessage.success('已删除并重新统计')
    },
    onClose: () => ElMessage.info('已取消删除'),
  })
}
</script>

<style scoped lang="scss">
.dialog-doc-container {
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
    }
  }

  .form-container {
    .action-bar {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    .dialog-demo-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
    }

    .dialog-demo-description {
      margin-top: 12px;
      color: var(--el-text-color-regular);
      font-size: 0.875rem;
      line-height: 1.8;

      code {
        padding: 2px 6px;
        margin: 0 2px;
        background-color: var(--el-fill-color-light);
        border-radius: 3px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
        font-size: 0.8125rem;
        color: var(--el-color-primary);
      }

      .property-item {
        margin: 0 2px;
      }
    }

    .form-section {
      margin-bottom: 24px;

      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid var(--el-color-primary);
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    .el-divider {
      margin: 24px 0;
    }

    .slot-section {
      margin-top: 24px;

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

    .event-section {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      .event-item {
        display: flex;
        .event-name {
          width: 5rem;
          flex-shrink: 0;
        }
        .event-label {
          font-size: 0.875rem;
          color: var(--el-text-color-regular);
        }
      }
    }

    .el-form {
      .el-row {
        .el-col {
          .el-form-item {
            margin-bottom: 18px;

            .label-with-tooltip {
              display: inline-flex;
              align-items: center;
              gap: 4px;
            }

            .label-tooltip-icon {
              color: var(--el-text-color-secondary);
              cursor: help;
              font-size: 14px;
              flex-shrink: 0;
            }
          }
        }
      }
    }
  }

  .dialog-content {
    padding: 8px 0;

    .feature-list {
      margin-bottom: 16px;

      ul {
        li {
          margin-bottom: 8px;
          line-height: 1.6;
        }
      }
    }
  }
}
</style>
