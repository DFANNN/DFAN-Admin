<template>
  <div class="text-ellipsis-doc-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">TextEllipsis 组件演示</span>
          <div class="card-description">
            <p>文本省略器组件，支持多行文本截断、点击展开/收起、一键复制、Tooltip 提示等功能</p>
            <p class="description-text">
              以下功能为扩展功能，其余功能支持 Element Plus Tooltip
              的相关属性（如：placement、effect、popper-class 等）， 更多详情请查看
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
            <p class="description-text">
              <strong>独立使用：</strong>
              如果你不想使用整个项目，也可以直接复制
              <code>TextEllipsis</code> 组件源码到自己的项目中使用。该组件主要依赖于
              <code>element-plus</code>（使用 <code>el-tooltip</code> 组件）和
              <code>@vueuse/core</code>（使用
              <code>useClipboard</code>，用于复制功能），使用前请确保已安装这些依赖。组件源码地址：
              <el-link
                href="https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/text/TextEllipsis.vue"
                target="_blank"
                type="primary"
                :underline="false"
              >
                TextEllipsis.vue
              </el-link>
              ，欢迎直接使用或根据需求进行二次开发。
            </p>
          </div>
        </div>
      </template>
      <div class="form-container">
        <!-- 效果预览 -->
        <div class="preview-section">
          <div class="section-title">
            <span>效果预览</span>
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
          <div class="preview-content">
            <TextEllipsis
              :text="ellipsisForm.text"
              :line="ellipsisForm.line"
              :width="ellipsisForm.width"
              :clickable="ellipsisForm.clickable"
              :copyable="ellipsisForm.copyable"
              :tooltip-type="ellipsisForm.tooltipType"
              :placement="ellipsisForm.placement"
              :effect="ellipsisForm.effect"
              :show-after="ellipsisForm.showAfter"
              :hide-after="ellipsisForm.hideAfter"
              :offset="ellipsisForm.offset"
            />
          </div>
        </div>

        <el-divider />

        <el-form :model="ellipsisForm" label-width="auto">
          <!-- 基础配置 -->
          <div class="form-section">
            <div class="section-title">基础配置</div>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="line">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>展示行数</span>
                      <el-tooltip content="超过此行数后省略，默认：1" placement="top">
                        <el-icon class="label-tooltip-icon">
                          <component
                            :is="menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']"
                          />
                        </el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-input-number v-model="ellipsisForm.line" :min="1" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="width">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>宽度</span>
                      <el-tooltip
                        content="支持字符串（vh, rem, px, 百分比）或数字（默认 px），默认：100%"
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
                  <el-input v-model="ellipsisForm.width" placeholder="如：500px 或 500" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="是否可点击展开" prop="clickable">
                  <el-switch v-model="ellipsisForm.clickable" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item label="是否可复制" prop="copyable">
                  <el-switch v-model="ellipsisForm.copyable" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="tooltipType">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>Tooltip 类型</span>
                      <el-tooltip
                        content="element: Element Plus Tooltip（默认）; native: 原生 title 属性; none: 不显示"
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
                  <el-select v-model="ellipsisForm.tooltipType">
                    <el-option label="element" value="element" />
                    <el-option label="native" value="native" />
                    <el-option label="none" value="none" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <el-divider />

          <!-- Element Plus 原生属性 -->
          <div class="form-section">
            <div class="section-title">Element Plus Tooltip 原生属性</div>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="placement">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>Tooltip 出现位置</span>
                      <el-tooltip
                        content="Tooltip 的出现位置，仅在 tooltipType 为 'element' 时生效"
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
                  <el-select v-model="ellipsisForm.placement">
                    <el-option label="top" value="top" />
                    <el-option label="top-start" value="top-start" />
                    <el-option label="top-end" value="top-end" />
                    <el-option label="bottom" value="bottom" />
                    <el-option label="bottom-start" value="bottom-start" />
                    <el-option label="bottom-end" value="bottom-end" />
                    <el-option label="left" value="left" />
                    <el-option label="left-start" value="left-start" />
                    <el-option label="left-end" value="left-end" />
                    <el-option label="right" value="right" />
                    <el-option label="right-start" value="right-start" />
                    <el-option label="right-end" value="right-end" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="effect">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>Tooltip 主题</span>
                      <el-tooltip
                        content="Tooltip 的主题样式，仅在 tooltipType 为 'element' 时生效"
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
                  <el-select v-model="ellipsisForm.effect">
                    <el-option label="dark" value="dark" />
                    <el-option label="light" value="light" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="showAfter">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>显示延迟（毫秒）</span>
                      <el-tooltip
                        content="Tooltip 出现前的延迟时间，仅在 tooltipType 为 'element' 时生效"
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
                  <el-input-number v-model="ellipsisForm.showAfter" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="hideAfter">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>隐藏延迟（毫秒）</span>
                      <el-tooltip
                        content="Tooltip 消失前的延迟时间，仅在 tooltipType 为 'element' 时生效"
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
                  <el-input-number v-model="ellipsisForm.hideAfter" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <el-form-item prop="offset">
                  <template #label>
                    <span class="label-with-tooltip">
                      <span>出现位置的偏移量</span>
                      <el-tooltip
                        content="Tooltip 出现位置的偏移量，仅在 tooltipType 为 'element' 时生效"
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
                  <el-input-number v-model="ellipsisForm.offset" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>

        <!-- 插槽使用说明 -->
        <el-divider />
        <div class="slot-section">
          <div class="section-title">插槽使用说明</div>
          <div class="slot-info">
            <p class="slot-description">
              TextEllipsis 组件支持以下插槽，可以自定义组件的各个部分：
            </p>
            <div class="slot-list">
              <div class="slot-item">
                <div class="slot-name">
                  <el-tag type="primary" size="small">content</el-tag>
                  <span class="slot-label">
                    自定义 Tooltip 内容（使用 content 插槽时，会覆盖默认的 Tooltip 内容，仅在
                    tooltipType 为 'element' 时生效）
                  </span>
                </div>
                <div class="slot-code">
                  <pre><code>&lt;TextEllipsis :text="text" tooltip-type="element"&gt;
  &lt;template #content&gt;
    &lt;div&gt;自定义 Tooltip 内容&lt;/div&gt;
  &lt;/template&gt;
&lt;/TextEllipsis&gt;</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 组件属性说明 -->
        <el-divider />
        <div class="usage-section">
          <div class="section-title">组件属性介绍</div>
          <div class="usage-info">
            <div class="usage-item">
              <h4 class="usage-title">TextEllipsis 组件属性介绍</h4>
              <p class="usage-description">
                以下为组件的扩展属性，其余属性（如
                <code>placement</code>、<code>effect</code>、<code>popper-class</code>
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
                <el-table :data="propsTableData" border style="width: 100%">
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
import { CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'TextEllipsisView' })

const menuStore = useMenuStore()

// 写死的文本内容
const fixedText =
  '在一个宁静而古老的小镇上，少年李安每天放学后都会经过那棵矗立在街角的古老橡树。这棵橡树已有百年历史，枝干粗壮，枝叶繁茂，仿佛一位沉默的守护者，见证着小镇的变迁。夕阳西下时，金色的光芒透过层层叠叠的叶片洒落下来，为整个街道蒙上一层温暖的光晕。一天傍晚，当李安像往常一样经过这里时，他突然注意到树根旁有一个闪着微光的木盒子，盒子表面雕刻着精美的花纹，在夕阳的照耀下显得格外神秘。李安小心翼翼地打开盒子，发现里面静静地躺着一张泛黄的旧地图和一把小巧精致的铜钥匙。地图上标注着一条蜿蜒的路线，最终指向小镇另一端的一座废弃磨坊。怀着强烈的好奇心，李安决定跟随地图的指引去探索这个秘密。他穿过几条熟悉的小巷，来到那座已经荒废多年的磨坊前。推开吱呀作响的大门，里面布满了厚厚的尘埃，阳光从破碎的窗户斜射进来，在空气中形成一道道明亮的光柱。在磨坊的角落里，李安发现了一个古朴的木箱子，箱子上有一个锁孔，正好与手中的钥匙匹配。当他转动钥匙，箱子缓缓打开的那一刻，一束阳光恰好透过窗户洒在箱子里的金色信封上，信封在光线下闪闪发光。李安颤抖着双手打开信封，里面是一张精美的信纸，上面用优雅的字体写着："勇敢的人，终会找到属于自己的奇迹。每一次探索都是成长的足迹，每一份勇气都会照亮前行的路。"读完这段话，李安心里涌起一股暖流，他深深明白，这次冒险的意义不仅在于发现了什么，更在于他敢于踏出第一步的勇气，以及在这个过程中收获的希望与成长。'

interface EllipsisForm {
  text: string
  line: number
  width: string | number
  clickable: boolean
  copyable: boolean
  tooltipType: 'element' | 'native' | 'none'
  placement: string
  effect: 'dark' | 'light'
  showAfter: number
  hideAfter: number
  offset: number
}

const ellipsisForm = ref<EllipsisForm>({
  text: fixedText,
  line: 2,
  width: '100%',
  clickable: true,
  copyable: false,
  tooltipType: 'element',
  placement: 'top',
  effect: 'dark',
  showAfter: 0,
  hideAfter: 200,
  offset: 12,
})

// 组件属性表格数据
const propsTableData = [
  {
    name: 'text',
    type: 'string | number',
    default: '-',
    description: '要展示的文本内容（必需）',
  },
  {
    name: 'line',
    type: 'number',
    default: '1',
    description: '展示行数，超过此行数后省略',
  },
  {
    name: 'width',
    type: 'string | number',
    default: "'100%'",
    description: '宽度，超过此宽度后省略，支持字符串（vh, rem, px, 百分比）或数字（默认 px）',
  },
  {
    name: 'clickable',
    type: 'boolean',
    default: 'false',
    description: '是否允许点击展开/收起',
  },
  {
    name: 'copyable',
    type: 'boolean',
    default: 'false',
    description: '是否显示复制按钮',
  },
  {
    name: 'tooltipType',
    type: "'element' | 'native' | 'none'",
    default: "'element'",
    description:
      'Tooltip 提示类型，element: Element Plus Tooltip（默认），native: 原生 title 属性，none: 不显示',
  },
]

// 生成代码字符串
const generateCode = () => {
  const {
    line,
    width,
    clickable,
    copyable,
    tooltipType,
    placement,
    effect,
    showAfter,
    hideAfter,
    offset,
  } = ellipsisForm.value

  const props: string[] = []

  // text 属性（使用示例）
  props.push(`text="你的文本内容"`)

  // 其他属性
  if (line !== 1) {
    props.push(`:line="${line}"`)
  }
  if (width !== '100%') {
    if (typeof width === 'number') {
      props.push(`:width="${width}"`)
    } else {
      props.push(`width="${width}"`)
    }
  }
  if (!clickable) {
    props.push(`:clickable="false"`)
  }
  if (copyable) {
    props.push(`:copyable="true"`)
  }
  if (tooltipType !== 'element') {
    props.push(`tooltip-type="${tooltipType}"`)
  }
  if (placement !== 'top') {
    props.push(`placement="${placement}"`)
  }
  if (effect !== 'dark') {
    props.push(`effect="${effect}"`)
  }
  if (showAfter !== 0) {
    props.push(`:show-after="${showAfter}"`)
  }
  if (hideAfter !== 200) {
    props.push(`:hide-after="${hideAfter}"`)
  }
  if (offset !== 12) {
    props.push(`:offset="${offset}"`)
  }

  return `<TextEllipsis ${props.join(' ')} />`
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
.text-ellipsis-doc-container {
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
              padding: 2px 6px;
              background-color: var(--el-fill-color-light);
              border-radius: 3px;
              font-size: 0.8125rem;
              color: var(--el-color-primary);
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

    .preview-section {
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

      .preview-content {
        font-size: 0.875rem;
        padding: 1rem;
        background-color: var(--el-bg-color);
        border: 1px solid var(--el-border-color);
        border-radius: 0.25rem;
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
