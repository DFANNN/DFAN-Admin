<template>
  <div class="card-doc-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">BaseCard 组件演示</span>
          <div class="card-description">
            <p>
              <code>BaseCard</code> 是对 Element Plus 的 <code>el-card</code>
              做的一层轻量封装，主要统一了卡片头部结构、标题图标、右侧操作区和整体样式，适合在后台页面中快速搭建内容区块。
            </p>
            <p class="description-text">
              组件支持通过 <code>title</code>、<code>titleIcon</code>、<code>header-right</code>
              等方式快速构建常见卡片头部，同时保留了 <code>el-card</code> 的基础能力，使用成本很低。
            </p>
            <p class="description-text">
              <strong>独立使用：</strong>
              如果你不想使用整个项目，也可以直接复制组件源码到自己的项目中使用。
              <code>BaseCard</code> 主要依赖于 <code>element-plus</code>（使用
              <code>el-card</code> 和 <code>el-icon</code> 组件），使用前请确保已安装该依赖。组件源码地址：
              <el-link
                href="https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/card/BaseCard.vue"
                target="_blank"
                type="primary"
                :underline="false"
              >
                BaseCard.vue
              </el-link>
              ，欢迎直接使用或根据需求进行二次开发。
            </p>
          </div>
        </div>
      </template>

      <div class="form-container">
        <div class="preview-section">
          <div class="section-title">BaseCard 效果预览</div>
          <div class="preview-showcase">
            <div class="preview-grid">
              <BaseCard title="基础卡片" title-icon="HOutline:RectangleGroupIcon">
                <div class="demo-content">
                  适合承载表单、图表、统计卡片、说明块等常见后台内容区域。
                </div>
              </BaseCard>

              <BaseCard title="带边框卡片" title-icon="HOutline:Square2StackIcon" bordered>
                <div class="demo-content">
                  通过 <code>bordered</code> 属性可以控制卡片是否显示边框，默认不显示。
                </div>
              </BaseCard>

              <BaseCard
                title="带操作区卡片"
                title-icon="HOutline:AdjustmentsHorizontalIcon"
                shadow="hover"
              >
                <template #header-right>
                  <el-button type="primary" link>编辑</el-button>
                  <el-button type="danger" link>删除</el-button>
                </template>
                <div class="demo-content">
                  通过 <code>header-right</code> 插槽可以在右侧放按钮、状态、筛选器等操作内容。
                </div>
              </BaseCard>

              <BaseCard title="自定义圆角" border-radius="0.5rem" title-icon="HOutline:SparklesIcon">
                <div class="demo-content">通过 <code>borderRadius</code> 可以控制卡片圆角大小。</div>
              </BaseCard>

              <BaseCard title="带页脚卡片" title-icon="HOutline:DocumentTextIcon">
                <div class="demo-content">
                  除默认内容区域外，还支持 <code>footer</code> 插槽，适合放操作按钮或补充说明。
                </div>
                <template #footer>
                  <div class="footer-actions">
                    <el-button>取消</el-button>
                    <el-button type="primary">保存</el-button>
                  </div>
                </template>
              </BaseCard>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="usage-section">
          <div class="section-title">基础用法</div>
          <div class="usage-info">
            <div class="usage-item">
              <h4 class="usage-title">1. 基础标题卡片</h4>
              <div class="usage-code">
                <pre><code>&lt;BaseCard title="用户信息" title-icon="HOutline:UserIcon"&gt;
  &lt;div&gt;这里放你的内容&lt;/div&gt;
&lt;/BaseCard&gt;</code></pre>
              </div>
            </div>

            <div class="usage-item">
              <h4 class="usage-title">2. 右侧操作区</h4>
              <div class="usage-code">
                <pre><code>&lt;BaseCard title="列表操作" title-icon="HOutline:AdjustmentsHorizontalIcon"&gt;
  &lt;template #header-right&gt;
    &lt;el-button type="primary" link&gt;新增&lt;/el-button&gt;
    &lt;el-button link&gt;刷新&lt;/el-button&gt;
  &lt;/template&gt;

  &lt;div&gt;这里放列表、图表或其它内容&lt;/div&gt;
&lt;/BaseCard&gt;</code></pre>
              </div>
            </div>

            <div class="usage-item">
              <h4 class="usage-title">3. 显示边框</h4>
              <div class="usage-code">
                <pre><code>&lt;BaseCard title="边框卡片" bordered&gt;
  &lt;div&gt;通过 bordered 控制是否显示边框&lt;/div&gt;
&lt;/BaseCard&gt;</code></pre>
              </div>
            </div>

            <div class="usage-item">
              <h4 class="usage-title">4. 自定义圆角</h4>
              <div class="usage-code">
                <pre><code>&lt;BaseCard
  title="自定义样式"
  border-radius="12px"
  shadow="hover"
&gt;
  &lt;div&gt;支持通过 borderRadius 控制卡片圆角&lt;/div&gt;
&lt;/BaseCard&gt;</code></pre>
              </div>
            </div>

            <div class="usage-item">
              <h4 class="usage-title">5. 自定义 header / footer 插槽</h4>
              <div class="usage-code">
                <pre><code>&lt;BaseCard&gt;
  &lt;template #header&gt;
    &lt;div class="custom-header"&gt;完全自定义头部&lt;/div&gt;
  &lt;/template&gt;

  &lt;div&gt;主体内容&lt;/div&gt;

  &lt;template #footer&gt;
    &lt;div class="custom-footer"&gt;完全自定义页脚&lt;/div&gt;
  &lt;/template&gt;
&lt;/BaseCard&gt;</code></pre>
              </div>
              <p class="usage-description">
                当你需要完全接管头部结构时，可以直接使用 <code>header</code> 插槽覆盖默认头部。
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
                <code>BaseCard</code> 基于 <code>el-card</code> 进行封装，适合快速构建统一风格的卡片区域。
                下表列出该组件的主要扩展属性；其余与卡片容器相关的能力可以继续基于
                <code>el-card</code> 的思路进行扩展。
              </p>
              <div class="comparison-table">
                <el-table :data="cardPropsTableData" border style="width: 100%">
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
                  <el-table-column prop="description" label="说明" min-width="280" />
                </el-table>
              </div>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="usage-section">
          <div class="section-title">插槽说明</div>
          <div class="usage-info">
            <div class="comparison-table">
              <el-table :data="cardSlotsTableData" border style="width: 100%">
                <el-table-column prop="name" label="插槽名" width="180">
                  <template #default="{ row }">
                    <strong>{{ row.name }}</strong>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="说明" min-width="400" />
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'CardView' })

const cardPropsTableData = [
  {
    name: 'title',
    type: 'string',
    default: "''",
    description: '卡片标题；当未使用 header 插槽时，会展示默认头部标题',
  },
  {
    name: 'titleIcon',
    type: 'string | Component',
    default: '-',
    description: '标题图标；支持传入图标名称字符串，或直接传入图标组件',
  },
  {
    name: 'titleIconSize',
    type: 'string | number',
    default: '20',
    description: '标题图标尺寸，会透传给 el-icon 的 size 属性',
  },
  {
    name: 'shadow',
    type: "'never' | 'always' | 'hover'",
    default: "'never'",
    description: '卡片阴影显示时机，继承自 el-card',
  },
  {
    name: 'bordered',
    type: 'boolean',
    default: 'false',
    description: '是否显示卡片边框，默认不显示',
  },
  {
    name: 'borderRadius',
    type: 'string',
    default: "'1rem'",
    description: '自定义卡片圆角，例如 12px、0.75rem、var(--card-radius)',
  },
]

const cardSlotsTableData = [
  {
    name: 'default',
    description: '卡片主体内容区域',
  },
  {
    name: 'header',
    description: '自定义整个头部区域；使用后会覆盖默认的标题 + 图标 + header-right 布局',
  },
  {
    name: 'header-right',
    description: '默认头部右侧操作区，适合放操作按钮、状态信息、筛选器等内容',
  },
  {
    name: 'footer',
    description: '卡片底部区域，适合放表单按钮、补充说明或统计信息',
  },
]
</script>

<style scoped lang="scss">
.card-doc-container {
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

    .preview-showcase {
      padding: 20px;
      border-radius: 12px;
      background:
        linear-gradient(135deg, var(--el-fill-color-light) 0%, var(--el-bg-color-page) 100%);
      border: 1px solid var(--el-border-color-lighter);
    }

    .preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }

    .demo-content {
      color: var(--el-text-color-regular);
      line-height: 1.7;
      font-size: 0.875rem;
      min-height: 80px;
    }

    .footer-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .usage-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .usage-item {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .usage-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
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
          font-family:
            'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
        }
      }
    }
  }
}
</style>
