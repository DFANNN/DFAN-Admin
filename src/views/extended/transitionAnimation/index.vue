<template>
  <div class="transition-animation-doc-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">内置 Transition 动画演示</span>
          <div class="card-description">
            <p>
              本项目内置了 20 种精美的 Transition 动画效果，基于 Vue 3 的 Transition
              组件实现，开箱即用。 这些动画涵盖了淡入淡出、滑动、缩放、旋转、3D
              效果等多种类型，可以满足各种场景的过渡需求。
            </p>
            <p class="description-text">
              所有动画都支持自定义时长、延迟、缓动函数和过渡模式，通过 CSS 变量实现动态配置。
              直接使用 Vue 的 <code>Transition</code> 组件配合内置的动画类名即可，开箱即用。
              如果不熟悉 Transition 的使用，请阅读
              <el-link
                href="https://cn.vuejs.org/guide/built-ins/transition.html"
                target="_blank"
                type="primary"
                :underline="false"
              >
                Vue 官方 Transition 文档
              </el-link>
              。
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
              <Transition
                :name="animationForm.type"
                :mode="animationForm.mode === 'default' ? undefined : animationForm.mode"
                :style="animationStyle"
              >
                <div v-if="showLogo" class="logo-container">
                  <img src="@/assets/logo.svg" alt="Logo" class="preview-logo" />
                </div>
              </Transition>
            </div>
            <div class="preview-controls">
              <el-button type="primary" @click="toggleLogo">
                {{ showLogo ? '隐藏 Logo' : '显示 Logo' }}
              </el-button>
              <el-button @click="resetAnimation">重置动画</el-button>
            </div>
          </div>
        </div>

        <el-divider />

        <el-form :model="animationForm" label-width="auto">
          <!-- 基础配置 -->
          <div class="form-section">
            <div class="section-title">基础配置</div>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item prop="type">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>动画类型</span>
                      <el-tooltip
                        content="选择要使用的动画效果类型，共 20 种内置动画可选"
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
                      <el-option label="fade-slide（淡入淡出 + 水平滑动）" value="fade-slide" />
                      <el-option label="fade（纯淡入淡出）" value="fade" />
                      <el-option label="slide-up（向上滑动）" value="slide-up" />
                      <el-option label="slide-down（向下滑动）" value="slide-down" />
                      <el-option label="slide-left（向左滑动）" value="slide-left" />
                      <el-option label="slide-right（向右滑动）" value="slide-right" />
                    </el-option-group>
                    <el-option-group label="缩放动画">
                      <el-option label="zoom（缩放效果）" value="zoom" />
                      <el-option label="zoom-in-top（从顶部缩放进入）" value="zoom-in-top" />
                      <el-option label="zoom-in-bottom（从底部缩放进入）" value="zoom-in-bottom" />
                      <el-option label="zoom-in-left（从左侧缩放进入）" value="zoom-in-left" />
                      <el-option label="zoom-in-right（从右侧缩放进入）" value="zoom-in-right" />
                      <el-option label="scale（缩放 + 淡入淡出）" value="scale" />
                    </el-option-group>
                    <el-option-group label="特效动画">
                      <el-option label="rotate（旋转效果）" value="rotate" />
                      <el-option label="bounce（弹跳效果）" value="bounce" />
                      <el-option label="flip-3d（3D 翻转效果）" value="flip-3d" />
                      <el-option label="rotate-3d（3D 旋转效果）" value="rotate-3d" />
                      <el-option label="blur-fade（模糊淡入淡出）" value="blur-fade" />
                      <el-option label="elastic（弹性效果）" value="elastic" />
                      <el-option label="glow（发光效果）" value="glow" />
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item prop="duration">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>动画时长（秒）</span>
                      <el-tooltip content="动画持续的时间，单位：秒，默认：0.3" placement="top">
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
                    :min="0.1"
                    :max="5"
                    :step="0.1"
                    :precision="1"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item prop="delay">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>动画延迟（秒）</span>
                      <el-tooltip content="动画开始前的延迟时间，单位：秒，默认：0" placement="top">
                        <el-icon class="label-tooltip-icon">
                          <component
                            :is="menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']"
                          />
                        </el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-input-number
                    v-model="animationForm.delay"
                    :min="0"
                    :max="3"
                    :step="0.1"
                    :precision="1"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item prop="easing">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>缓动函数</span>
                      <el-tooltip
                        content="控制动画的速度曲线，可以使用 CSS 缓动函数，默认：cubic-bezier(0.4, 0, 0.2, 1)"
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
                  <el-select v-model="animationForm.easing" style="width: 100%">
                    <el-option
                      label="cubic-bezier(0.4, 0, 0.2, 1)（默认）"
                      value="cubic-bezier(0.4, 0, 0.2, 1)"
                    />
                    <el-option
                      label="cubic-bezier(0.68, -0.55, 0.265, 1.55)（弹性）"
                      value="cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                    />
                    <el-option label="ease（缓入缓出）" value="ease" />
                    <el-option label="ease-in（缓入）" value="ease-in" />
                    <el-option label="ease-out（缓出）" value="ease-out" />
                    <el-option label="ease-in-out（缓入缓出）" value="ease-in-out" />
                    <el-option label="linear（线性）" value="linear" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item prop="mode">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>过渡模式</span>
                      <el-tooltip
                        content="out-in: 先离开后进入；in-out: 先进入后离开；default: 同时进行"
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
                  <el-select v-model="animationForm.mode" style="width: 100%">
                    <el-option label="default（同时进行）" value="default" />
                    <el-option label="out-in（先离开后进入）" value="out-in" />
                    <el-option label="in-out（先进入后离开）" value="in-out" />
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
                直接使用 Vue 的 <code>Transition</code> 组件，配合内置的动画类名即可。
              </p>
              <div class="usage-code">
                <pre><code>&lt;template&gt;
  &lt;Transition name="fade-slide"&gt;
    &lt;div v-if="show"&gt;内容&lt;/div&gt;
  &lt;/Transition&gt;
&lt;/template&gt;

&lt;style&gt;
/* 动画样式已全局引入，无需额外导入 */
&lt;/style&gt;</code></pre>
              </div>
            </div>

            <div class="usage-item">
              <h4 class="usage-title">自定义动画参数</h4>
              <p class="usage-description">通过 CSS 变量可以动态设置动画的时长、延迟和缓动函数。</p>
              <div class="usage-code">
                <pre><code>&lt;template&gt;
  &lt;Transition
    name="fade-slide"
    :style="{
      '--animation-duration': '0.5s',
      '--animation-delay': '0.1s',
      '--animation-easing': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }"
  &gt;
    &lt;div v-if="show"&gt;内容&lt;/div&gt;
  &lt;/Transition&gt;
&lt;/template&gt;</code></pre>
              </div>
            </div>

            <div class="usage-item">
              <h4 class="usage-title">过渡模式</h4>
              <p class="usage-description">
                可以通过 <code>mode</code> 属性控制过渡模式，实现不同的动画效果。
              </p>
              <div class="usage-code">
                <pre><code>&lt;template&gt;
  &lt;!-- out-in: 先离开后进入 --&gt;
  &lt;Transition name="fade-slide" mode="out-in"&gt;
    &lt;div v-if="show"&gt;内容&lt;/div&gt;
  &lt;/Transition&gt;

  &lt;!-- in-out: 先进入后离开 --&gt;
  &lt;Transition name="fade-slide" mode="in-out"&gt;
    &lt;div v-if="show"&gt;内容&lt;/div&gt;
  &lt;/Transition&gt;
&lt;/template&gt;</code></pre>
              </div>
            </div>

            <div class="usage-item">
              <h4 class="usage-title">动画类型说明</h4>
              <div class="animation-types">
                <div class="type-group">
                  <h5>基础动画</h5>
                  <ul>
                    <li><strong>fade-slide</strong>：淡入淡出 + 水平滑动，适合大多数场景</li>
                    <li><strong>fade</strong>：纯淡入淡出，简洁优雅</li>
                    <li><strong>slide-up/down/left/right</strong>：各方向的滑动效果</li>
                  </ul>
                </div>
                <div class="type-group">
                  <h5>缩放动画</h5>
                  <ul>
                    <li><strong>zoom</strong>：中心缩放效果</li>
                    <li><strong>zoom-in-*</strong>：从指定方向缩放进入</li>
                    <li><strong>scale</strong>：缩放 + 淡入淡出</li>
                  </ul>
                </div>
                <div class="type-group">
                  <h5>特效动画</h5>
                  <ul>
                    <li><strong>rotate</strong>：旋转效果，富有动感</li>
                    <li><strong>bounce</strong>：弹跳效果，活泼有趣</li>
                    <li><strong>flip-3d / rotate-3d</strong>：3D 效果，视觉冲击力强</li>
                    <li><strong>blur-fade</strong>：模糊淡入淡出，朦胧美感</li>
                    <li><strong>elastic</strong>：弹性效果，自然流畅</li>
                    <li><strong>glow</strong>：发光效果，科技感十足</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TransitionAnimationView' })

const menuStore = useMenuStore()

type AnimationType =
  | 'fade-slide'
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom'
  | 'zoom-in-top'
  | 'zoom-in-bottom'
  | 'zoom-in-left'
  | 'zoom-in-right'
  | 'scale'
  | 'rotate'
  | 'bounce'
  | 'flip-3d'
  | 'rotate-3d'
  | 'blur-fade'
  | 'elastic'
  | 'glow'

interface AnimationForm {
  type: AnimationType
  duration: number
  delay: number
  easing: string
  mode: 'out-in' | 'in-out' | 'default'
}

const animationForm = ref<AnimationForm>({
  type: 'fade-slide',
  duration: 0.3,
  delay: 0,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  mode: 'default',
})

const showLogo = ref(true)

// 计算动画样式，通过 CSS 变量传递动画参数
const animationStyle = computed(() => {
  return {
    '--animation-duration': `${animationForm.value.duration}s`,
    '--animation-delay': `${animationForm.value.delay}s`,
    '--animation-easing': animationForm.value.easing,
  }
})

const toggleLogo = () => {
  showLogo.value = !showLogo.value
}

const resetAnimation = () => {
  showLogo.value = false
  setTimeout(() => {
    showLogo.value = true
  }, 100)
}
</script>

<style scoped lang="scss">
.transition-animation-doc-container {
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

          .logo-container {
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

        .preview-controls {
          display: flex;
          gap: 12px;
          justify-content: center;
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

          .animation-types {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 16px;

            .type-group {
              h5 {
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--el-text-color-primary);
                margin-bottom: 8px;
              }

              ul {
                margin: 0;
                padding-left: 20px;
                color: var(--el-text-color-regular);
                font-size: 0.875rem;
                line-height: 1.8;

                li {
                  margin-bottom: 4px;

                  strong {
                    color: var(--el-color-primary);
                    font-weight: 600;
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
