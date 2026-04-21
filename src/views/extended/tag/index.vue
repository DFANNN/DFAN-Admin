<template>
  <div class="tag-doc-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">BaseTag 组件演示</span>
          <div class="card-description">
            <p>
              <code>BaseTag</code> 是对 Element Plus 的 <code>el-tag</code>
              做的一层轻量样式封装，保留了标签组件常用的交互能力，同时统一了项目中的视觉表现。
            </p>
            <p class="description-text">
              组件本身没有重新发明新的交互逻辑，主要做了圆角、边框、内边距、字重等样式优化，因此你可以像使用
              <code>el-tag</code> 一样使用它。
            </p>
            <p class="description-text">
              <strong>独立使用：</strong>
              如果你不想使用整个项目，也可以直接复制组件源码到自己的项目中使用。
              <code>BaseTag</code> 主要依赖于 <code>element-plus</code>（使用
              <code>el-tag</code> 组件），使用前请确保已安装该依赖。组件源码地址：
              <el-link
                href="https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/tag/BaseTag.vue"
                target="_blank"
                type="primary"
                :underline="false"
              >
                BaseTag.vue
              </el-link>
              ，欢迎直接使用或根据需求进行二次开发。
            </p>
          </div>
        </div>
      </template>

      <div class="form-container">
        <div class="preview-section">
          <div class="section-title">BaseTag 效果预览</div>
          <div class="preview-content">
            <div class="demo-group">
              <div class="demo-label">基础类型：</div>
              <div class="demo-tags">
                <BaseTag text="默认标签" />
                <BaseTag type="primary" text="主要标签" />
                <BaseTag type="success" text="成功标签" />
                <BaseTag type="info" text="信息标签" />
                <BaseTag type="warning" text="警告标签" />
                <BaseTag type="danger" text="危险标签" />
              </div>
            </div>

            <div class="demo-group">
              <div class="demo-label">主题风格：</div>
              <div class="demo-tags">
                <BaseTag type="primary" effect="dark" text="dark" />
                <BaseTag type="success" effect="light" text="light" />
                <BaseTag type="warning" effect="plain" text="plain" />
              </div>
            </div>

            <div class="demo-group">
              <div class="demo-label">圆角标签：</div>
              <div class="demo-tags">
                <BaseTag round text="默认圆角" />
                <BaseTag round type="primary" text="主要圆角" />
                <BaseTag round type="success" effect="dark" text="成功圆角" />
                <BaseTag round type="warning" effect="plain" text="警告圆角" />
              </div>
            </div>

            <div class="demo-group">
              <div class="demo-label">可关闭标签：</div>
              <div class="demo-tags">
                <BaseTag closable type="primary" text="点击关闭" @close="handleClose('primary')" />
                <BaseTag closable type="success" text="操作完成" @close="handleClose('success')" />
                <BaseTag closable type="warning" text="待处理" @close="handleClose('warning')" />
              </div>
            </div>

            <div class="demo-group">
              <div class="demo-label">自定义内容：</div>
              <div class="demo-tags">
                <BaseTag type="primary">
                  <span class="tag-content-with-icon">
                    <el-icon>
                      <component :is="menuStore.iconComponents['HOutline:SparklesIcon']" />
                    </el-icon>
                    推荐
                  </span>
                </BaseTag>
                <BaseTag type="success">
                  <span class="tag-content-with-icon">
                    <el-icon>
                      <component :is="menuStore.iconComponents['HOutline:CheckBadgeIcon']" />
                    </el-icon>
                    已认证
                  </span>
                </BaseTag>
                <BaseTag type="danger">
                  <span class="tag-content-with-icon">
                    <el-icon>
                      <component :is="menuStore.iconComponents['HOutline:ExclamationCircleIcon']" />
                    </el-icon>
                    高风险
                  </span>
                </BaseTag>
              </div>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="usage-section">
          <div class="section-title">基础用法</div>
          <div class="usage-info">
            <div class="usage-item">
              <h4 class="usage-title">1. 通过 text 属性传入内容</h4>
              <div class="usage-code">
                <pre><code>&lt;BaseTag text="默认标签" /&gt;
&lt;BaseTag type="success" text="审核通过" /&gt;
&lt;BaseTag type="danger" effect="plain" text="已禁用" /&gt;</code></pre>
              </div>
            </div>

            <div class="usage-item">
              <h4 class="usage-title">2. 通过默认插槽自定义内容</h4>
              <div class="usage-code">
                <pre><code>&lt;BaseTag type="primary"&gt;
  &lt;span class="tag-content-with-icon"&gt;
    &lt;el-icon&gt;&lt;Star /&gt;&lt;/el-icon&gt;
    推荐
  &lt;/span&gt;
&lt;/BaseTag&gt;</code></pre>
              </div>
            </div>

            <div class="usage-item">
              <h4 class="usage-title">3. 圆角标签</h4>
              <div class="usage-code">
                <pre><code>&lt;BaseTag round text="圆角标签" /&gt;
&lt;BaseTag round type="success" text="审核通过" /&gt;
&lt;BaseTag round type="warning" effect="plain" text="待处理" /&gt;</code></pre>
              </div>
            </div>

            <div class="usage-item">
              <h4 class="usage-title">4. 直接继承 el-tag 的能力</h4>
              <div class="usage-code">
                <pre><code>&lt;BaseTag
  type="warning"
  effect="dark"
  round
  size="large"
  closable
  disable-transitions
  @close="handleClose"
&gt;
  待处理
&lt;/BaseTag&gt;</code></pre>
              </div>
              <p class="usage-description">
                除了额外提供的 <code>text</code> 属性外，其余属性、事件和插槽都可以按照
                <code>el-tag</code> 的方式继续使用。
              </p>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="usage-section">
          <div class="section-title">组件属性说明</div>
          <div class="usage-info">
            <div class="usage-item">
              <p class="usage-description">
                <code>BaseTag</code> 只是对 <code>el-tag</code> 的简单封装，完整支持
                <code>el-tag</code> 的全部属性、事件和插槽。更多详情请查看
                <el-link
                  href="https://element-plus.org/zh-CN/component/tag"
                  target="_blank"
                  type="primary"
                  :underline="false"
                >
                  Element Plus Tag 文档
                </el-link>
                。
              </p>
              <p class="usage-description">
                下表仅列出该组件额外补充或最常用的能力，帮助你快速上手。
              </p>
              <div class="comparison-table">
                <el-table :data="tagPropsTableData" border style="width: 100%">
                  <el-table-column prop="name" label="属性名" width="160">
                    <template #default="{ row }">
                      <strong>{{ row.name }}</strong>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="类型" width="220">
                    <template #default="{ row }">
                      <code>{{ row.type }}</code>
                    </template>
                  </el-table-column>
                  <el-table-column prop="default" label="默认值" width="140">
                    <template #default="{ row }">
                      <code>{{ row.default }}</code>
                    </template>
                  </el-table-column>
                  <el-table-column prop="description" label="说明" min-width="260" />
                </el-table>
              </div>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="usage-section">
          <div class="section-title">事件说明</div>
          <div class="usage-info">
            <div class="comparison-table">
              <el-table :data="tagEventsTableData" border style="width: 100%">
                <el-table-column prop="name" label="事件名" width="180">
                  <template #default="{ row }">
                    <strong>{{ row.name }}</strong>
                  </template>
                </el-table-column>
                <el-table-column prop="params" label="回调参数" width="200">
                  <template #default="{ row }">
                    <code>{{ row.params }}</code>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="说明" min-width="320" />
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

defineOptions({ name: 'TagView' })

const menuStore = useMenuStore()

const handleClose = (type: string) => {
  ElMessage.success(`已关闭 ${type} 标签`)
}

const tagPropsTableData = [
  {
    name: 'text',
    type: 'string',
    default: "''",
    description: 'BaseTag 额外提供的文本属性；当未使用默认插槽时，会渲染该内容',
  },
  {
    name: 'type',
    type: "'success' | 'info' | 'warning' | 'danger' | 'primary'",
    default: "'primary'",
    description: '标签类型，继承自 el-tag',
  },
  {
    name: 'effect',
    type: "'dark' | 'light' | 'plain'",
    default: "'light'",
    description: '标签主题样式，继承自 el-tag',
  },
  {
    name: 'size',
    type: "'large' | 'default' | 'small'",
    default: "'default'",
    description: '标签尺寸，继承自 el-tag',
  },
  {
    name: 'round',
    type: 'boolean',
    default: 'false',
    description: '是否为圆角标签，继承自 el-tag',
  },
  {
    name: 'closable',
    type: 'boolean',
    default: 'false',
    description: '是否可关闭，继承自 el-tag',
  },
  {
    name: 'disable-transitions',
    type: 'boolean',
    default: 'false',
    description: '是否禁用渐变动画，继承自 el-tag',
  },
  {
    name: '...attrs',
    type: 'ElTag props / events / slots',
    default: '-',
    description: '其余未声明属性会自动透传给 el-tag，因此支持 el-tag 的所有能力',
  },
]

const tagEventsTableData = [
  {
    name: 'close',
    params: 'event: MouseEvent',
    description: '当 closable 为 true 且点击关闭按钮时触发，继承自 el-tag',
  },
]
</script>

<style scoped lang="scss">
.tag-doc-container {
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
    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 16px;
      padding-left: 8px;
      border-left: 3px solid var(--el-color-primary);
    }

    .el-divider {
      margin: 24px 0;
    }

    .preview-content,
    .usage-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .demo-group,
    .usage-item {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .demo-label,
    .usage-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .demo-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .tag-content-with-icon {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .usage-description {
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.7;
      color: var(--el-text-color-regular);
    }

    .usage-code {
      pre {
        margin: 0;
        padding: 16px;
        background-color: var(--el-fill-color-dark);
        border-radius: 6px;
        overflow-x: auto;
        font-size: 0.8125rem;
        line-height: 1.7;

        code {
          color: var(--el-text-color-primary);
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
        }
      }
    }
  }
}
</style>
