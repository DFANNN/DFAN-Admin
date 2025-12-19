<template>
  <div class="dialog-doc-container">
    <el-card shadow="never" class="main-card">
      <!-- 页面头部说明 -->
      <div class="intro-section">
        <h1 class="intro-title">BaseDialog</h1>
        <p class="intro-subtitle">基于 Element Plus Dialog 封装的增强型对话框组件</p>
        <div class="intro-features">
          <el-tag type="success" size="large" effect="plain">全屏功能</el-tag>
          <el-tag type="success" size="large" effect="plain">可拖拽</el-tag>
          <el-tag type="success" size="large" effect="plain">可调整大小</el-tag>
          <el-tag type="success" size="large" effect="plain">移动端自适应</el-tag>
          <el-tag type="success" size="large" effect="plain">自定义图标</el-tag>
          <el-tag type="success" size="large" effect="plain">加载状态</el-tag>
          <el-tag type="info" size="large" effect="plain">完全兼容 Element Plus API</el-tag>
        </div>
      </div>

      <!-- 示例部分 -->
      <div class="examples-section">
        <!-- 基础用法 -->
        <el-card shadow="never" class="example-card">
          <template #header>
            <h3>基础用法</h3>
          </template>
          <p class="example-desc">最简单的对话框用法，包含标题和内容。</p>
          <div class="example-demo">
            <el-button type="primary" @click="basicVisible = true">打开对话框</el-button>
            <BaseDialog v-model="basicVisible" title="基础对话框">
              <p>这是一个基础的对话框示例。</p>
              <p>你可以在这里放置任何内容。</p>
            </BaseDialog>
          </div>
          <el-collapse v-model="activeCollapse" class="code-collapse">
            <el-collapse-item name="basic">
              <template #title>
                <span>查看代码</span>
                <el-button
                  text
                  type="primary"
                  size="small"
                  class="copy-btn"
                  @click.stop="copyCode('basic')"
                >
                  <el-icon><DocumentCopy /></el-icon>
                  复制
                </el-button>
              </template>
              <pre><code>{{ codeExamples.basic }}</code></pre>
            </el-collapse-item>
          </el-collapse>
        </el-card>

        <!-- 自定义插槽 -->
        <el-card shadow="never" class="example-card">
          <template #header>
            <h3>自定义插槽</h3>
          </template>
          <p class="example-desc">使用 header 和 footer 插槽自定义标题和页脚内容。</p>

          <div class="example-demo-group">
            <div class="example-demo-item">
              <h4 class="demo-item-title">自定义标题</h4>
              <div class="example-demo">
                <el-button type="primary" @click="customHeaderVisible = true">打开对话框</el-button>
                <BaseDialog v-model="customHeaderVisible">
                  <template #header>
                    <div style="display: flex; align-items: center; gap: 8px">
                      <el-icon><Warning /></el-icon>
                      <span>自定义标题</span>
                    </div>
                  </template>
                  <p>使用 header 插槽可以完全自定义标题区域的内容和样式。</p>
                </BaseDialog>
              </div>
            </div>

            <div class="example-demo-item">
              <h4 class="demo-item-title">自定义页脚</h4>
              <div class="example-demo">
                <el-button type="primary" @click="customFooterVisible = true">打开对话框</el-button>
                <BaseDialog v-model="customFooterVisible" title="自定义页脚">
                  <p>使用 footer 插槽可以完全自定义页脚按钮。</p>
                  <template #footer>
                    <el-button @click="customFooterVisible = false">取消</el-button>
                    <el-button type="success" @click="customFooterVisible = false">保存</el-button>
                    <el-button type="warning" @click="customFooterVisible = false"
                      >另存为</el-button
                    >
                  </template>
                </BaseDialog>
              </div>
            </div>
          </div>

          <el-collapse v-model="activeCollapse" class="code-collapse">
            <el-collapse-item name="customHeader">
              <template #title>
                <span>查看代码 - 自定义标题</span>
                <el-button
                  text
                  type="primary"
                  size="small"
                  class="copy-btn"
                  @click.stop="copyCode('customHeader')"
                >
                  <el-icon><DocumentCopy /></el-icon>
                  复制
                </el-button>
              </template>
              <pre><code>{{ codeExamples.customHeader }}</code></pre>
            </el-collapse-item>
            <el-collapse-item name="customFooter">
              <template #title>
                <span>查看代码 - 自定义页脚</span>
                <el-button
                  text
                  type="primary"
                  size="small"
                  class="copy-btn"
                  @click.stop="copyCode('customFooter')"
                >
                  <el-icon><DocumentCopy /></el-icon>
                  复制
                </el-button>
              </template>
              <pre><code>{{ codeExamples.customFooter }}</code></pre>
            </el-collapse-item>
          </el-collapse>
        </el-card>

        <!-- 交互功能组 -->
        <div class="example-group">
          <el-card shadow="never" class="example-card">
            <template #header>
              <h3>全屏功能</h3>
            </template>
            <p class="example-desc">点击标题栏的全屏按钮可以全屏显示对话框，适合展示大量内容。</p>
            <div class="example-demo">
              <el-button type="primary" @click="fullscreenVisible = true">打开对话框</el-button>
              <BaseDialog v-model="fullscreenVisible" title="全屏对话框" width="600px">
                <div>
                  <p>点击标题栏右侧的全屏按钮可以全屏显示对话框。</p>
                  <p>全屏模式下，对话框会占据整个屏幕，提供更好的内容展示体验。</p>
                  <el-divider />
                  <p>你可以在这里放置大量内容，比如表格、表单、图表等。</p>
                </div>
              </BaseDialog>
            </div>
            <el-collapse v-model="activeCollapse" class="code-collapse">
              <el-collapse-item name="fullscreen">
                <template #title>
                  <span>查看代码</span>
                  <el-button
                    text
                    type="primary"
                    size="small"
                    class="copy-btn"
                    @click.stop="copyCode('fullscreen')"
                  >
                    <el-icon><DocumentCopy /></el-icon>
                    复制
                  </el-button>
                </template>
                <pre><code>{{ codeExamples.fullscreen }}</code></pre>
              </el-collapse-item>
            </el-collapse>
          </el-card>

          <el-card shadow="never" class="example-card">
            <template #header>
              <h3>拖拽功能</h3>
            </template>
            <p class="example-desc">对话框支持拖拽移动位置，提升用户体验。</p>
            <div class="example-demo">
              <el-button type="primary" @click="draggableVisible = true">打开对话框</el-button>
              <BaseDialog
                v-model="draggableVisible"
                title="可拖拽对话框"
                :draggable="true"
                width="500px"
              >
                <p>你可以通过拖拽标题栏来移动对话框的位置。</p>
                <p>
                  默认情况下，拖拽功能是开启的，你也可以通过设置
                  <code>draggable="false"</code> 来关闭。
                </p>
              </BaseDialog>
            </div>
            <el-collapse v-model="activeCollapse" class="code-collapse">
              <el-collapse-item name="draggable">
                <template #title>
                  <span>查看代码</span>
                  <el-button
                    text
                    type="primary"
                    size="small"
                    class="copy-btn"
                    @click.stop="copyCode('draggable')"
                  >
                    <el-icon><DocumentCopy /></el-icon>
                    复制
                  </el-button>
                </template>
                <pre><code>{{ codeExamples.draggable }}</code></pre>
              </el-collapse-item>
            </el-collapse>
          </el-card>

          <el-card shadow="never" class="example-card">
            <template #header>
              <h3>移动端适配</h3>
            </template>
            <p class="example-desc">对话框会自动适配移动端屏幕，在小屏设备上自动调整宽度。</p>
            <div class="example-demo">
              <el-button type="primary" @click="mobileVisible = true">打开对话框</el-button>
              <BaseDialog
                v-model="mobileVisible"
                title="移动端适配"
                width="600px"
                :mobile-adaptive="true"
                mobile-width="90%"
                :mobile-breakpoint="992"
              >
                <p>在桌面端，对话框宽度为 600px。</p>
                <p>在移动端（屏幕宽度小于 992px），对话框宽度会自动调整为 90%。</p>
                <p>你可以通过调整浏览器窗口大小来查看效果。</p>
              </BaseDialog>
            </div>
            <el-collapse v-model="activeCollapse" class="code-collapse">
              <el-collapse-item name="mobile">
                <template #title>
                  <span>查看代码</span>
                  <el-button
                    text
                    type="primary"
                    size="small"
                    class="copy-btn"
                    @click.stop="copyCode('mobile')"
                  >
                    <el-icon><DocumentCopy /></el-icon>
                    复制
                  </el-button>
                </template>
                <pre><code>{{ codeExamples.mobile }}</code></pre>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </div>

        <!-- 行为控制组 -->
        <div class="example-group">
          <el-card shadow="never" class="example-card">
            <template #header>
              <h3>确认按钮加载状态</h3>
            </template>
            <p class="example-desc">确认按钮支持异步操作，自动显示加载状态。</p>
            <div class="example-demo">
              <el-button type="primary" @click="loadingVisible = true">打开对话框</el-button>
              <BaseDialog
                v-model="loadingVisible"
                title="异步确认"
                :show-confirm-loading="true"
                :onConfirm="handleAsyncConfirm"
              >
                <p>点击确定按钮会执行异步操作，按钮会自动显示加载状态。</p>
                <p>操作完成后，对话框会自动关闭。</p>
              </BaseDialog>
            </div>
            <el-collapse v-model="activeCollapse" class="code-collapse">
              <el-collapse-item name="loading">
                <template #title>
                  <span>查看代码</span>
                  <el-button
                    text
                    type="primary"
                    size="small"
                    class="copy-btn"
                    @click.stop="copyCode('loading')"
                  >
                    <el-icon><DocumentCopy /></el-icon>
                    复制
                  </el-button>
                </template>
                <pre><code>{{ codeExamples.loading }}</code></pre>
              </el-collapse-item>
            </el-collapse>
          </el-card>

          <el-card shadow="never" class="example-card">
            <template #header>
              <h3>关闭前确认</h3>
            </template>
            <p class="example-desc">使用 before-close 可以在关闭前进行确认，防止误操作。</p>
            <div class="example-demo">
              <el-button type="primary" @click="beforeCloseVisible = true">打开对话框</el-button>
              <BaseDialog
                v-model="beforeCloseVisible"
                title="关闭前确认"
                :before-close="handleBeforeClose"
              >
                <p>尝试关闭对话框（点击关闭按钮、ESC 键或点击遮罩层），会弹出确认提示。</p>
                <p>只有确认后才会关闭对话框。</p>
              </BaseDialog>
            </div>
            <el-collapse v-model="activeCollapse" class="code-collapse">
              <el-collapse-item name="beforeClose">
                <template #title>
                  <span>查看代码</span>
                  <el-button
                    text
                    type="primary"
                    size="small"
                    class="copy-btn"
                    @click.stop="copyCode('beforeClose')"
                  >
                    <el-icon><DocumentCopy /></el-icon>
                    复制
                  </el-button>
                </template>
                <pre><code>{{ codeExamples.beforeClose }}</code></pre>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </div>

        <!-- UI 自定义组 -->
        <div class="example-group">
          <el-card shadow="never" class="example-card">
            <template #header>
              <h3>自定义图标</h3>
            </template>
            <p class="example-desc">可以自定义关闭按钮和全屏按钮的图标。</p>
            <div class="example-demo">
              <el-button type="primary" @click="customIconVisible = true">打开对话框</el-button>
              <BaseDialog
                v-model="customIconVisible"
                title="自定义图标"
                close-icon="HOutline:XCircleIcon"
                fullscreen-icon="HOutline:ArrowsExpandIcon"
                exit-fullscreen-icon="HOutline:ArrowsCollapseIcon"
              >
                <p>
                  你可以通过 <code>close-icon</code>、<code>fullscreen-icon</code>、<code
                    >exit-fullscreen-icon</code
                  >
                  属性来自定义图标。
                </p>
                <p>图标可以是字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件。</p>
              </BaseDialog>
            </div>
            <el-collapse v-model="activeCollapse" class="code-collapse">
              <el-collapse-item name="customIcon">
                <template #title>
                  <span>查看代码</span>
                  <el-button
                    text
                    type="primary"
                    size="small"
                    class="copy-btn"
                    @click.stop="copyCode('customIcon')"
                  >
                    <el-icon><DocumentCopy /></el-icon>
                    复制
                  </el-button>
                </template>
                <pre><code>{{ codeExamples.customIcon }}</code></pre>
              </el-collapse-item>
            </el-collapse>
          </el-card>

          <el-card shadow="never" class="example-card">
            <template #header>
              <h3>隐藏功能按钮</h3>
            </template>
            <p class="example-desc">可以隐藏关闭按钮、全屏按钮或页脚。</p>
            <div class="example-demo">
              <el-button type="primary" @click="hiddenVisible = true">打开对话框</el-button>
              <BaseDialog
                v-model="hiddenVisible"
                title="隐藏功能按钮"
                :show-close="false"
                :show-fullscreen-button="false"
                :show-footer="false"
              >
                <p>这个对话框隐藏了关闭按钮、全屏按钮和页脚。</p>
                <p>你可以通过点击遮罩层或按 ESC 键来关闭对话框。</p>
              </BaseDialog>
            </div>
            <el-collapse v-model="activeCollapse" class="code-collapse">
              <el-collapse-item name="hidden">
                <template #title>
                  <span>查看代码</span>
                  <el-button
                    text
                    type="primary"
                    size="small"
                    class="copy-btn"
                    @click.stop="copyCode('hidden')"
                  >
                    <el-icon><DocumentCopy /></el-icon>
                    复制
                  </el-button>
                </template>
                <pre><code>{{ codeExamples.hidden }}</code></pre>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </div>

        <!-- Element Plus 属性透传 -->
        <el-card shadow="never" class="example-card">
          <template #header>
            <h3>Element Plus 属性透传</h3>
          </template>
          <p class="example-desc">完全支持 Element Plus Dialog 的所有原生属性。</p>
          <div class="example-demo">
            <el-button type="primary" @click="attrsVisible = true">打开对话框</el-button>
            <BaseDialog
              v-model="attrsVisible"
              title="属性透传示例"
              :close-on-click-modal="false"
              :close-on-press-escape="true"
              :append-to-body="true"
              :lock-scroll="true"
              modal-class="custom-modal-class"
            >
              <p>这个对话框设置了以下 Element Plus 原生属性：</p>
              <ul>
                <li><code>close-on-click-modal="false"</code> - 点击遮罩层不关闭</li>
                <li><code>close-on-press-escape="true"</code> - 按 ESC 键关闭</li>
                <li><code>append-to-body="true"</code> - 追加到 body</li>
                <li><code>lock-scroll="true"</code> - 锁定滚动</li>
                <li><code>modal-class="custom-modal-class"</code> - 自定义遮罩层类名</li>
              </ul>
              <p>你可以像使用原生 Element Plus Dialog 一样使用本组件的所有属性。</p>
            </BaseDialog>
          </div>
          <el-collapse v-model="activeCollapse" class="code-collapse">
            <el-collapse-item name="attrs">
              <template #title>
                <span>查看代码</span>
                <el-button
                  text
                  type="primary"
                  size="small"
                  class="copy-btn"
                  @click.stop="copyCode('attrs')"
                >
                  <el-icon><DocumentCopy /></el-icon>
                  复制
                </el-button>
              </template>
              <pre><code>{{ codeExamples.attrs }}</code></pre>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>

      <!-- API 文档部分 -->
      <div class="api-section">
        <h2 class="api-section-title">API</h2>

        <!-- Props -->
        <el-card shadow="never" class="api-card">
          <template #header>
            <h3>Props</h3>
          </template>
          <el-table :data="propsData" border style="width: 100%">
            <el-table-column prop="name" label="参数" width="200" />
            <el-table-column prop="desc" label="说明" />
            <el-table-column prop="type" label="类型" width="200" />
            <el-table-column prop="default" label="默认值" width="150" />
          </el-table>
        </el-card>

        <!-- Events -->
        <el-card shadow="never" class="api-card" style="margin-top: 24px">
          <template #header>
            <h3>Events</h3>
          </template>
          <el-table :data="eventsData" border style="width: 100%">
            <el-table-column prop="name" label="事件名" width="200" />
            <el-table-column prop="desc" label="说明" />
            <el-table-column prop="params" label="参数" width="200" />
          </el-table>
        </el-card>

        <!-- Slots -->
        <el-card shadow="never" class="api-card" style="margin-top: 24px">
          <template #header>
            <h3>Slots</h3>
          </template>
          <el-table :data="slotsData" border style="width: 100%">
            <el-table-column prop="name" label="插槽名" width="200" />
            <el-table-column prop="desc" label="说明" />
          </el-table>
        </el-card>

        <!-- 特殊说明 -->
        <el-card shadow="never" class="api-card" style="margin-top: 24px">
          <template #header>
            <h3>特殊说明</h3>
          </template>
          <div class="special-notes">
            <h4>1. onConfirm 事件</h4>
            <p>
              确认按钮的点击事件需要通过 <code>onConfirm</code> 属性传递（不是通过
              emit），这样可以支持异步操作并自动管理加载状态。
            </p>
            <pre><code>{{ codeExamples.onConfirm }}</code></pre>

            <h4 style="margin-top: 24px">2. Element Plus 属性透传</h4>
            <p>
              所有未在 Props 中定义的属性都会通过 <code>v-bind="attrs"</code> 透传给 Element Plus
              Dialog，包括但不限于：
            </p>
            <ul>
              <li><code>close-on-click-modal</code> - 点击遮罩层是否关闭对话框</li>
              <li><code>close-on-press-escape</code> - 按 ESC 键是否关闭对话框</li>
              <li><code>append-to-body</code> - 是否追加到 body</li>
              <li><code>lock-scroll</code> - 是否锁定滚动</li>
              <li><code>modal-class</code> - 遮罩层自定义类名</li>
              <li><code>modal-append-to-body</code> - 遮罩层是否追加到 body</li>
              <li>等等...</li>
            </ul>
            <p>
              更多属性请参考
              <a href="https://element-plus.org/zh-CN/component/dialog.html" target="_blank"
                >Element Plus Dialog 文档</a
              >。
            </p>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import { Warning, DocumentCopy } from '@element-plus/icons-vue'
import { useClipboard } from '@vueuse/core'

defineOptions({ name: 'DialogView' })

// 复制功能
const { copy } = useClipboard()

// 对话框显示状态
const basicVisible = ref(false)
const customHeaderVisible = ref(false)
const customFooterVisible = ref(false)
const fullscreenVisible = ref(false)
const draggableVisible = ref(false)
const mobileVisible = ref(false)
const loadingVisible = ref(false)
const beforeCloseVisible = ref(false)
const customIconVisible = ref(false)
const hiddenVisible = ref(false)
const attrsVisible = ref(false)

// 折叠面板激活项
const activeCollapse = ref<string[]>([])

// 异步确认处理
const handleAsyncConfirm = async () => {
  // 模拟异步操作
  await new Promise((resolve) => setTimeout(resolve, 2000))
  ElMessage.success('操作成功！')
  loadingVisible.value = false
}

// 关闭前确认
const handleBeforeClose = (done: () => void) => {
  ElMessageBox.confirm('确定要关闭对话框吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      done()
    })
    .catch(() => {
      // 取消关闭
    })
}

// 复制代码
const copyCode = async (key: keyof typeof codeExamples) => {
  try {
    await copy(codeExamples[key])
    ElMessage.success('代码已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

// 代码示例
const codeExamples = {
  basic: `<template>
  <el-button type="primary" @click="visible = true">打开对话框</el-button>
  <BaseDialog v-model="visible" title="基础对话框">
    <p>这是一个基础的对话框示例。</p>
    <p>你可以在这里放置任何内容。</p>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/dialog/BaseDialog.vue'

const visible = ref(false)
<\/script>`,

  customHeader: `<template>
  <BaseDialog v-model="visible">
    <template #header>
      <div style="display: flex; align-items: center; gap: 8px">
        <el-icon><Warning /></el-icon>
        <span>自定义标题</span>
      </div>
    </template>
    <p>使用 header 插槽可以完全自定义标题区域的内容和样式。</p>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import { Warning } from '@element-plus/icons-vue'

const visible = ref(false)
<\/script>`,

  customFooter: `<template>
  <BaseDialog v-model="visible" title="自定义页脚">
    <p>使用 footer 插槽可以完全自定义页脚按钮。</p>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="success" @click="visible = false">保存</el-button>
      <el-button type="warning" @click="visible = false">另存为</el-button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/dialog/BaseDialog.vue'

const visible = ref(false)
<\/script>`,

  fullscreen: `<template>
  <BaseDialog v-model="visible" title="全屏对话框" width="600px">
    <div>
      <p>点击标题栏右侧的全屏按钮可以全屏显示对话框。</p>
      <p>全屏模式下，对话框会占据整个屏幕，提供更好的内容展示体验。</p>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/dialog/BaseDialog.vue'

const visible = ref(false)
<\/script>`,

  draggable: `<template>
  <BaseDialog v-model="visible" title="可拖拽对话框" :draggable="true" width="500px">
    <p>你可以通过拖拽标题栏来移动对话框的位置。</p>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/dialog/BaseDialog.vue'

const visible = ref(false)
<\/script>`,

  mobile: `<template>
  <BaseDialog
    v-model="visible"
    title="移动端适配"
    width="600px"
    :mobile-adaptive="true"
    mobile-width="90%"
    :mobile-breakpoint="992"
  >
    <p>在桌面端，对话框宽度为 600px。</p>
    <p>在移动端（屏幕宽度小于 992px），对话框宽度会自动调整为 90%。</p>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/dialog/BaseDialog.vue'

const visible = ref(false)
<\/script>`,

  loading: `<template>
  <BaseDialog
    v-model="visible"
    title="异步确认"
    :show-confirm-loading="true"
    :onConfirm="handleAsyncConfirm"
  >
    <p>点击确定按钮会执行异步操作，按钮会自动显示加载状态。</p>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/dialog/BaseDialog.vue'

const visible = ref(false)

const handleAsyncConfirm = async () => {
  // 模拟异步操作
  await new Promise((resolve) => setTimeout(resolve, 2000))
  ElMessage.success('操作成功！')
  visible.value = false
}
<\/script>`,

  beforeClose: `<template>
  <BaseDialog
    v-model="visible"
    title="关闭前确认"
    :before-close="handleBeforeClose"
  >
    <p>尝试关闭对话框，会弹出确认提示。</p>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/dialog/BaseDialog.vue'

const visible = ref(false)

const handleBeforeClose = (done: () => void) => {
  ElMessageBox.confirm('确定要关闭对话框吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      done()
    })
    .catch(() => {
      // 取消关闭
    })
}
<\/script>`,

  customIcon: `<template>
  <BaseDialog
    v-model="visible"
    title="自定义图标"
    close-icon="HOutline:XCircleIcon"
    fullscreen-icon="HOutline:ArrowsExpandIcon"
    exit-fullscreen-icon="HOutline:ArrowsCollapseIcon"
  >
    <p>你可以通过属性来自定义图标。</p>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/dialog/BaseDialog.vue'

const visible = ref(false)
<\/script>`,

  hidden: `<template>
  <BaseDialog
    v-model="visible"
    title="隐藏功能按钮"
    :show-close="false"
    :show-fullscreen-button="false"
    :show-footer="false"
  >
    <p>这个对话框隐藏了关闭按钮、全屏按钮和页脚。</p>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/dialog/BaseDialog.vue'

const visible = ref(false)
<\/script>`,

  attrs: `<template>
  <BaseDialog
    v-model="visible"
    title="属性透传示例"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :append-to-body="true"
    :lock-scroll="true"
    modal-class="custom-modal-class"
  >
    <p>完全支持 Element Plus Dialog 的所有原生属性。</p>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/dialog/BaseDialog.vue'

const visible = ref(false)
<\/script>`,

  onConfirm: `<template>
  <BaseDialog
    v-model="visible"
    title="异步确认"
    :onConfirm="handleConfirm"
  >
    <p>内容</p>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/dialog/BaseDialog.vue'

const visible = ref(false)

const handleConfirm = async () => {
  // 异步操作
  await someAsyncOperation()
  // 操作完成后，对话框会自动关闭（需要手动设置 visible = false）
  visible.value = false
}
<\/script>`,
}

// Props 数据
const propsData = [
  {
    name: 'modelValue',
    desc: '是否显示对话框',
    type: 'boolean',
    default: '-',
  },
  {
    name: 'title',
    desc: '对话框标题',
    type: 'string',
    default: '-',
  },
  {
    name: 'fullscreen',
    desc: '是否全屏显示',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'showFullscreenButton',
    desc: '是否显示全屏按钮',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'showClose',
    desc: '是否显示关闭按钮',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'showFooter',
    desc: '是否显示页脚',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'cancelText',
    desc: '取消按钮文本',
    type: 'string',
    default: "'取消'",
  },
  {
    name: 'confirmText',
    desc: '确定按钮文本',
    type: 'string',
    default: "'确定'",
  },
  {
    name: 'resizable',
    desc: '是否可调整大小（通过拖拽边缘）',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'closeIcon',
    desc: '关闭按钮图标（字符串或组件）',
    type: 'string | Component',
    default: "'HOutline:XMarkIcon'",
  },
  {
    name: 'closeIconSize',
    desc: '关闭按钮图标尺寸',
    type: 'string',
    default: "'1.5rem'",
  },
  {
    name: 'fullscreenIcon',
    desc: '全屏按钮图标（字符串或组件）',
    type: 'string | Component',
    default: "'HOutline:ArrowsPointingOutIcon'",
  },
  {
    name: 'fullscreenIconSize',
    desc: '全屏按钮图标尺寸',
    type: 'string',
    default: "'1.25rem'",
  },
  {
    name: 'exitFullscreenIcon',
    desc: '退出全屏按钮图标（字符串或组件）',
    type: 'string | Component',
    default: "'HOutline:ArrowsPointingInIcon'",
  },
  {
    name: 'exitFullscreenIconSize',
    desc: '退出全屏按钮图标尺寸',
    type: 'string',
    default: "'1.25rem'",
  },
  {
    name: 'showConfirmLoading',
    desc: '是否显示确认按钮加载状态',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'width',
    desc: '对话框宽度',
    type: 'string',
    default: '-',
  },
  {
    name: 'mobileAdaptive',
    desc: '是否支持移动端适配',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'mobileWidth',
    desc: '移动端对话框宽度',
    type: 'string',
    default: "'90%'",
  },
  {
    name: 'mobileBreakpoint',
    desc: '移动端断点（单位：px）',
    type: 'number',
    default: '992',
  },
  {
    name: 'defaultSlotMaxHeight',
    desc: '默认插槽的最大高度',
    type: 'string | number',
    default: "'60vh'",
  },
  {
    name: 'draggable',
    desc: '是否可拖拽',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'onConfirm',
    desc: '确认按钮点击事件（异步函数，支持自动加载状态）',
    type: '() => Promise&lt;void&gt;',
    default: '-',
  },
]

// Events 数据
const eventsData = [
  {
    name: 'update:modelValue',
    desc: '对话框显示状态更新时触发',
    params: '(value: boolean)',
  },
  {
    name: 'close',
    desc: '对话框关闭时触发',
    params: '-',
  },
]

// Slots 数据
const slotsData = [
  {
    name: 'header',
    desc: '自定义标题内容',
  },
  {
    name: 'default',
    desc: '对话框主要内容',
  },
  {
    name: 'footer',
    desc: '自定义页脚内容',
  },
]
</script>

<style scoped lang="scss">
.dialog-doc-container {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.el-card__body) {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }
}

// 介绍部分
.intro-section {
  padding: 32px 0 40px;
  text-align: center;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 40px;

  .intro-title {
    margin: 0 0 12px 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--el-text-color-primary);
    letter-spacing: -0.02em;
  }

  .intro-subtitle {
    margin: 0 0 24px 0;
    font-size: 1rem;
    color: var(--el-text-color-regular);
    line-height: 1.6;
  }

  .intro-features {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    align-items: center;
  }
}

// 示例部分
.examples-section {
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// 示例分组
.example-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 32px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--el-border-color-lighter);
}

.example-card {
  margin-bottom: 32px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: var(--el-bg-color);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: var(--el-border-color);
  }

  :deep(.el-card__header) {
    padding: 20px 24px;
    background: var(--el-bg-color-page);
    border-bottom: 1px solid var(--el-border-color-lighter);

    h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  :deep(.el-card__body) {
    padding: 24px;
  }
}

.example-desc {
  margin: 0 0 20px 0;
  color: var(--el-text-color-regular);
  line-height: 1.7;
  font-size: 0.9375rem;
}

.example-demo {
  padding: 32px;
  background: linear-gradient(
    135deg,
    var(--el-bg-color-page) 0%,
    var(--el-fill-color-lighter) 100%
  );
  border-radius: 8px;
  margin-bottom: 20px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--el-border-color-lighter);

  code {
    background: var(--el-fill-color-light);
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.875em;
    color: var(--el-color-primary);
    font-weight: 500;
  }

  ul {
    text-align: left;
    margin: 16px 0;
    padding-left: 24px;

    li {
      margin-bottom: 10px;
      line-height: 1.8;
      color: var(--el-text-color-regular);
    }
  }
}

.example-demo-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 20px;
}

.example-demo-item {
  .demo-item-title {
    margin: 0 0 12px 0;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .example-demo {
    margin-bottom: 0;
    min-height: 100px;
  }
}

// 代码折叠面板
.code-collapse {
  margin-top: 0;

  :deep(.el-collapse-item) {
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    overflow: hidden;
    background: var(--el-bg-color);
  }

  :deep(.el-collapse-item__header) {
    padding: 12px 16px;
    font-weight: 500;
    color: var(--el-text-color-regular);
    background: var(--el-bg-color-page);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.2s;

    &:hover {
      background: var(--el-fill-color-lighter);
    }

    .copy-btn {
      margin-left: auto;
      opacity: 0.7;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }

  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }

  :deep(.el-collapse-item__content) {
    padding: 0;
  }

  pre {
    margin: 0;
    padding: 20px;
    background: var(--el-fill-color-darker);
    border-radius: 0;
    overflow-x: auto;
    border-top: 1px solid var(--el-border-color-lighter);

    code {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
      font-size: 0.875rem;
      line-height: 1.7;
      color: var(--el-text-color-primary);
      white-space: pre;
      display: block;
    }
  }
}

// API 文档部分
.api-section {
  margin-bottom: 60px;
}

.api-section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 32px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--el-border-color-lighter);
}

.api-card {
  margin-bottom: 24px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  overflow: hidden;
  background: var(--el-bg-color);

  :deep(.el-card__header) {
    padding: 20px 24px;
    background: var(--el-bg-color-page);
    border-bottom: 1px solid var(--el-border-color-lighter);

    h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  :deep(.el-card__body) {
    padding: 24px;
  }

  :deep(.el-table) {
    border-radius: 8px;
    overflow: hidden;

    th {
      background: var(--el-bg-color-page);
      font-weight: 600;
    }
  }
}

.special-notes {
  h4 {
    margin: 0 0 16px 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--el-text-color-primary);
    padding-bottom: 8px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  p {
    margin-bottom: 16px;
    line-height: 1.8;
    color: var(--el-text-color-regular);
    font-size: 0.9375rem;
  }

  ul {
    margin: 16px 0;
    padding-left: 24px;
    line-height: 2;

    li {
      margin-bottom: 10px;
      color: var(--el-text-color-regular);

      code {
        background: var(--el-fill-color-light);
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 0.875em;
        color: var(--el-color-primary);
        font-weight: 500;
      }
    }
  }

  pre {
    margin: 20px 0;
    padding: 20px;
    background: var(--el-fill-color-darker);
    border-radius: 8px;
    overflow-x: auto;
    border: 1px solid var(--el-border-color-lighter);

    code {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
      font-size: 0.875rem;
      line-height: 1.7;
      color: var(--el-text-color-primary);
      white-space: pre;
    }
  }

  a {
    color: var(--el-color-primary);
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
  }
}
</style>
