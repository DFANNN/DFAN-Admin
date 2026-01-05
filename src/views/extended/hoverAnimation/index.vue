<template>
  <div class="hover-animation-doc-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">Hover 动画演示</span>
          <div class="card-description">
            <p>
              本项目基于 <code>@vueuse/motion</code> 封装了 15 种精美的 Hover
              动画效果，简化了使用方式，只需传入动画名称 <code>name</code>
              属性即可开箱即用。这些动画涵盖了弹性、变换、特效、动感和创意等多种类型，可以满足各种交互场景的悬停反馈需求。
            </p>
            <p class="description-text">
              所有动画都支持自定义时长、强度和标签类型。直接使用
              <code>HoverAnimateWrapper</code> 组件包裹需要添加悬停效果的元素即可。 如果想深入了解
              <code>@vueuse/motion</code> 的更多功能，请阅读
              <el-link
                href="https://motion.vueuse.org/"
                target="_blank"
                type="primary"
                :underline="false"
              >
                vueuse/motion 官网
              </el-link>
              。
            </p>
            <p class="description-text">
              <strong>与 Transition 内置动画的区别：</strong>
              <br />
              • <strong>Transition 动画</strong>：用于元素进入/离开页面时的过渡效果（基于
              <code>v-if</code>/<code>v-show</code> 的状态变化），适合页面切换、列表项出现等场景。
              <br />
              •
              <strong>Hover 动画</strong
              >：用于鼠标悬停时的交互反馈，增强用户体验和可点击性提示，适合按钮、卡片、图标等可交互元素。
              <br />
              两者解决不同的问题，可以同时使用，互不冲突。
            </p>
          </div>
        </div>
      </template>
      <div class="form-container">
        <!-- 效果预览 -->
        <div class="preview-section">
          <div class="section-title">效果预览</div>
          <div class="preview-content">
            <div class="preview-wrapper">
              <HoverAnimateWrapper
                :key="`${animationForm.type}-${animationForm.duration}-${animationForm.intensity}-${animationForm.tag}`"
                :name="animationForm.type"
                :duration="animationForm.duration"
                :intensity="animationForm.intensity"
                :tag="animationForm.tag"
              >
                <div class="preview-svg-container">
                  <img src="@/assets/logo.svg" alt="Logo" class="preview-logo" />
                </div>
              </HoverAnimateWrapper>
            </div>
            <div class="preview-hint">
              <p>将鼠标悬停在上方元素上即可看到动画效果</p>
            </div>
          </div>
        </div>

        <el-divider />

        <el-form :model="animationForm" label-width="auto">
          <!-- 基础配置 -->
          <div class="form-section">
            <div class="section-title">
              <span>基础配置</span>
              <el-button
                type="primary"
                size="small"
                :icon="CopyDocument"
                @click="copyCode"
                style="margin-left: 12px"
              >
                复制代码
              </el-button>
            </div>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item prop="type">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>动画类型</span>
                      <el-tooltip
                        content="选择要使用的动画效果类型，共 15 种内置动画可选"
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
                  <el-select v-model="animationForm.type" style="width: 100%">
                    <el-option-group label="基础动画">
                      <el-option label="scale（缩放效果）" value="scale" />
                      <el-option label="lift（抬起效果）" value="lift" />
                      <el-option label="tilt（倾斜效果）" value="tilt" />
                      <el-option label="rotate（旋转效果）" value="rotate" />
                      <el-option label="flip（翻转效果）" value="flip" />
                    </el-option-group>
                    <el-option-group label="弹性动画">
                      <el-option label="jelly（果冻效果）" value="jelly" />
                      <el-option label="bounce（弹跳效果）" value="bounce" />
                      <el-option label="rubber（橡胶效果）" value="rubber" />
                      <el-option label="elastic（弹性效果）" value="elastic" />
                    </el-option-group>
                    <el-option-group label="动感动画">
                      <el-option label="pulse（脉冲效果）" value="pulse" />
                      <el-option label="shake（震动效果）" value="shake" />
                      <el-option label="wobble（摆动效果）" value="wobble" />
                      <el-option label="swing（摇摆效果）" value="swing" />
                      <el-option label="magnet（磁吸效果）" value="magnet" />
                      <el-option label="squeeze（挤压效果）" value="squeeze" />
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item prop="duration">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>动画时长（毫秒）</span>
                      <el-tooltip content="动画持续的时间，单位：毫秒，默认：300" placement="top">
                        <el-icon class="label-tooltip-icon">
                          <component
                            :is="menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']"
                          />
                        </el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-input-number
                    v-model="animationForm.duration"
                    :min="100"
                    :max="2000"
                    :step="50"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item prop="intensity">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>动画强度</span>
                      <el-tooltip
                        content="控制动画的强度，light: 轻微，normal: 正常，strong: 强烈，默认：normal"
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
                  <el-select v-model="animationForm.intensity" style="width: 100%">
                    <el-option label="light（轻微）" value="light" />
                    <el-option label="normal（正常）" value="normal" />
                    <el-option label="strong（强烈）" value="strong" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item prop="tag">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>标签类型</span>
                      <el-tooltip content="组件渲染的 HTML 标签类型，默认：div" placement="top">
                        <el-icon class="label-tooltip-icon">
                          <component
                            :is="menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']"
                          />
                        </el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-select v-model="animationForm.tag" style="width: 100%">
                    <el-option label="div" value="div" />
                    <el-option label="span" value="span" />
                    <el-option label="button" value="button" />
                    <el-option label="a" value="a" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>

        <!-- 使用说明 -->
        <el-divider />
        <div class="usage-section">
          <div class="section-title">使用说明</div>
          <div class="usage-info">
            <div class="usage-item">
              <h4 class="usage-title">基本使用</h4>
              <p class="usage-description">
                直接使用 <code>HoverAnimateWrapper</code> 组件包裹需要添加悬停效果的元素即可。
              </p>
              <div class="usage-code">
                <pre><code>&lt;template&gt;
  &lt;HoverAnimateWrapper name="scale"&gt;
    &lt;div&gt;悬停我试试&lt;/div&gt;
  &lt;/HoverAnimateWrapper&gt;
&lt;/template&gt;</code></pre>
              </div>
            </div>

            <div class="usage-item">
              <h4 class="usage-title">自定义动画参数</h4>
              <p class="usage-description">
                可以通过 <code>duration</code>、<code>intensity</code> 和 <code>tag</code>
                属性自定义动画参数。
              </p>
              <div class="usage-code">
                <pre><code>&lt;template&gt;
  &lt;HoverAnimateWrapper
    name="bounce"
    :duration="500"
    intensity="strong"
    tag="button"
  &gt;
    &lt;button&gt;点击按钮&lt;/button&gt;
  &lt;/HoverAnimateWrapper&gt;
&lt;/template&gt;</code></pre>
              </div>
            </div>

            <div class="usage-item">
              <h4 class="usage-title">HoverAnimateWrapper 组件属性介绍</h4>
              <div class="comparison-table">
                <table>
                  <thead>
                    <tr>
                      <th>属性名</th>
                      <th>类型</th>
                      <th>默认值</th>
                      <th>说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>name</strong></td>
                      <td><code>HoverAnimationName</code></td>
                      <td><code>'scale'</code></td>
                      <td>
                        动画类型名称，可选值：jelly、bounce、rubber、elastic、scale、lift、tilt、rotate、flip、pulse、shake、wobble、swing、magnet、squeeze
                      </td>
                    </tr>
                    <tr>
                      <td><strong>tag</strong></td>
                      <td><code>string</code></td>
                      <td><code>'div'</code></td>
                      <td>组件渲染的 HTML 标签类型，如 div、span、button、a 等</td>
                    </tr>
                    <tr>
                      <td><strong>duration</strong></td>
                      <td><code>number</code></td>
                      <td><code>300</code></td>
                      <td>动画持续时长，单位：毫秒（ms）</td>
                    </tr>
                    <tr>
                      <td><strong>intensity</strong></td>
                      <td><code>'light' | 'normal' | 'strong'</code></td>
                      <td><code>'normal'</code></td>
                      <td>动画强度，light 为轻微，normal 为正常，strong 为强烈</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { HoverAnimationName } from '@/components/animation/HoverAnimateWrapper.vue'

defineOptions({ name: 'HoverAnimationView' })

const menuStore = useMenuStore()

interface AnimationForm {
  type: HoverAnimationName
  duration: number
  intensity: 'light' | 'normal' | 'strong'
  tag: string
}

const animationForm = ref<AnimationForm>({
  type: 'scale',
  duration: 300,
  intensity: 'normal',
  tag: 'div',
})

// 生成代码字符串
const generateCode = () => {
  const { type, duration, intensity, tag } = animationForm.value

  const props: string[] = [`name="${type}"`]
  if (duration !== 300) {
    props.push(`:duration="${duration}"`)
  }
  if (intensity !== 'normal') {
    props.push(`intensity="${intensity}"`)
  }
  if (tag !== 'div') {
    props.push(`tag="${tag}"`)
  }

  return `<HoverAnimateWrapper ${props.join(' ')}>
  <div>内容</div>
</HoverAnimateWrapper>`
}

// 复制代码到剪贴板
const copyCode = async () => {
  const code = generateCode()
  try {
    await navigator.clipboard.writeText(code)
    ElMessage.success('代码已复制到剪贴板')
  } catch {
    // 降级方案：使用传统方法
    const textarea = document.createElement('textarea')
    textarea.value = code
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      ElMessage.success('代码已复制到剪贴板')
    } catch {
      ElMessage.error('复制失败，请手动复制')
    }
    document.body.removeChild(textarea)
  }
}
</script>

<style scoped lang="scss">
.hover-animation-doc-container {
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
        margin-top: 8px;

        code {
          background-color: var(--el-fill-color-light);
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.875em;
          color: var(--el-color-primary);
        }
      }
    }
  }

  .form-container {
    .form-section {
      margin-bottom: 24px;

      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid var(--el-color-primary);
        display: flex;
        align-items: center;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    .el-divider {
      margin: 24px 0;
    }

    .preview-section {
      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid var(--el-color-primary);
      }

      .preview-content {
        padding: 2rem;
        background-color: var(--el-bg-color);
        border: 1px solid var(--el-border-color);
        border-radius: 0.25rem;

        .preview-wrapper {
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;

          .preview-svg-container {
            display: flex;
            align-items: center;
            justify-content: center;

            .preview-logo {
              width: 120px;
              height: 120px;
              object-fit: contain;
            }
          }
        }

        .preview-hint {
          text-align: center;
          color: var(--el-text-color-secondary);
          font-size: 0.875rem;

          p {
            margin: 0;
          }
        }
      }
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
            margin-bottom: 12px;
          }

          .usage-description {
            margin: 0 0 12px 0;
            color: var(--el-text-color-regular);
            font-size: 0.875rem;
            line-height: 1.6;

            code {
              background-color: var(--el-fill-color-light);
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 0.875em;
              color: var(--el-color-primary);
            }
          }

          .usage-code {
            pre {
              margin: 0;
              padding: 16px;
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

          .comparison-table {
            margin-top: 16px;
            overflow-x: auto;

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 0.875rem;

              thead {
                background-color: var(--el-fill-color-light);

                th {
                  padding: 12px;
                  text-align: left;
                  font-weight: 600;
                  color: var(--el-text-color-primary);
                  border-bottom: 2px solid var(--el-border-color);
                }
              }

              tbody {
                tr {
                  border-bottom: 1px solid var(--el-border-color);

                  &:hover {
                    background-color: var(--el-fill-color-lighter);
                  }

                  td {
                    padding: 12px;
                    color: var(--el-text-color-regular);
                    line-height: 1.6;

                    strong {
                      color: var(--el-text-color-primary);
                    }

                    code {
                      background-color: var(--el-fill-color-light);
                      padding: 2px 6px;
                      border-radius: 3px;
                      font-size: 0.875em;
                      color: var(--el-color-primary);
                    }
                  }
                }
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
