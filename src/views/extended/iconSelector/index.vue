<template>
  <div class="icon-selector-doc-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">IconSelectorDialog 组件演示</span>
          <div class="card-description">
            <p>基于 BaseDialog 的图标选择器组件</p>
            <p class="description-text">
              支持从 Element Plus 和 HeroIcons 图标库中选择图标，支持紧凑和宽松两种显示模式
            </p>
          </div>
        </div>
      </template>
      <div class="form-container">
        <!-- 操作按钮 -->
        <div class="action-bar">
          <el-button type="primary" size="large" @click="openIconSelectorDialog">
            打开图标选择器
          </el-button>
        </div>

        <el-form :model="iconSelectorForm" label-width="auto">
          <!-- 基础配置 -->
          <div class="form-section">
            <div class="section-title">基础配置</div>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="对话框标题" prop="title">
                  <el-input v-model="iconSelectorForm.title" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="对话框宽度" prop="width">
                  <el-input v-model="iconSelectorForm.width" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item prop="density">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>显示密度</span>
                      <el-tooltip
                        content="compact：紧凑模式，图标较小，使用 tooltip 显示名称；spacious：宽松模式，图标较大，直接显示名称"
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
                  <el-select v-model="iconSelectorForm.density" style="width: 100%">
                    <el-option label="紧凑模式" value="compact" />
                    <el-option label="宽松模式" value="spacious" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>

        <!-- 选中结果展示 -->
        <el-divider />
        <div class="form-section">
          <div class="section-title">选中结果展示</div>
          <div class="result-display">
            <div class="result-item" v-if="currentIcon">
              <div class="result-label">图标预览：</div>
              <div class="result-icon">
                <el-icon :size="24">
                  <component :is="currentIconComponent" />
                </el-icon>
              </div>
              <div class="result-label">图标名称：</div>
              <div class="result-value">{{ currentIcon }}</div>
            </div>

            <el-empty
              description="暂未选择图标，请点击上方按钮打开图标选择器"
              :image-size="50"
              v-if="!currentIcon"
            />
          </div>
        </div>

        <!-- 事件说明 -->
        <el-divider />
        <div class="event-section">
          <div class="section-title">事件说明</div>
          <div class="event-item">
            <div class="event-name"><el-tag type="success" size="small">selectIcon</el-tag></div>
            <span class="event-label">
              选择图标时触发，回调参数为 (iconName: string, iconComponent: Component)
            </span>
          </div>
        </div>

        <!-- 方法说明 -->
        <el-divider />
        <div class="method-section">
          <div class="section-title">方法说明</div>
          <div class="method-list">
            <div class="method-item">
              <div class="method-name">
                <el-tag type="primary" size="small">showDialog</el-tag>
                <span class="method-description">
                  打开图标选择器对话框。可选参数 currentIconValue 用于设置当前选中的图标名称。
                </span>
              </div>
              <div class="method-code">
                <pre><code>iconSelectorDialogRef.value?.showDialog('Element:Search')</code></pre>
              </div>
            </div>
            <div class="method-item">
              <div class="method-name">
                <el-tag type="warning" size="small">closeDialog</el-tag>
                <span class="method-description">关闭图标选择器对话框。</span>
              </div>
              <div class="method-code">
                <pre><code>iconSelectorDialogRef.value?.closeDialog()</code></pre>
              </div>
            </div>
            <div class="method-item">
              <div class="method-name">
                <el-tag type="info" size="small">clearData</el-tag>
                <span class="method-description"
                  >清除图标选择器的数据，包括当前选中的图标、搜索框的值和菜单选择。</span
                >
              </div>
              <div class="method-code">
                <pre><code>iconSelectorDialogRef.value?.clearData()</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <IconSelectorDialog
        :title="iconSelectorForm.title"
        :width="iconSelectorForm.width"
        :density="iconSelectorForm.density"
        @selectIcon="handleSelectIcon"
        ref="iconSelectorDialogRef"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import IconSelectorDialog from '@/components/dialog/IconSelectorDialog.vue'

defineOptions({ name: 'IconSelectorView' })

const menuStore = useMenuStore()

const iconSelectorDialogRef = useTemplateRef<InstanceType<typeof IconSelectorDialog> | null>(
  'iconSelectorDialogRef',
)

const iconSelectorForm = ref({
  title: '图标选择',
  width: '900px',
  density: 'compact' as 'compact' | 'spacious',
})

const currentIcon = ref('')
const currentIconComponent = shallowRef<Component | null>(null)

const openIconSelectorDialog = () => {
  iconSelectorDialogRef.value?.showDialog(currentIcon.value)
}

const handleSelectIcon = (iconName: string, iconComponent: Component) => {
  currentIcon.value = iconName
  currentIconComponent.value = iconComponent
  ElMessage.success(`已选择图标：${iconName}`)
}
</script>

<style scoped lang="scss">
.icon-selector-doc-container {
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

    .result-display {
      .result-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 16px;
        padding: 12px;
        background-color: var(--el-bg-color-page);
        border-radius: 4px;
        border: 1px solid var(--el-border-color-lighter);

        .result-label {
          flex-shrink: 0;
          font-size: 0.875rem;
          color: var(--el-text-color-regular);
          font-weight: 500;
        }

        .result-value {
          font-size: 0.875rem;
          color: var(--el-text-color-primary);
        }

        .result-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--el-color-primary);
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
          width: 6rem;
          flex-shrink: 0;
        }

        .event-label {
          font-size: 0.875rem;
          color: var(--el-text-color-regular);
        }
      }
    }

    .method-section {
      margin-top: 24px;

      .method-list {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .method-item {
          border: 1px solid var(--el-border-color-lighter);
          border-radius: 4px;
          padding: 16px;
          background-color: var(--el-bg-color-page);

          .method-name {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            .method-description {
              font-size: 0.875rem;
              color: var(--el-text-color-regular);
              font-weight: 500;
            }
          }

          .method-code {
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
}
</style>
