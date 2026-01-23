<template>
  <!-- 带徽标的tabs menu组件 -->
  <el-tabs
    :model-value="modelValue"
    @update:model-value="handleUpdate"
    class="badge-tabs-menu"
    v-bind="attrs"
  >
    <el-tab-pane
      :name="tab.key"
      v-for="tab in tabsMenuData"
      :key="tab.key"
      :disabled="tab.disabled"
    >
      <template #label>
        <el-badge
          :value="tab.badge"
          :max="badgeMax"
          :show-zero="badgeShowZero"
          :offset="[10, 5]"
          :is-dot="badgeIsDot"
          :type="badgeType"
        >
          <div class="title-wrap">
            <el-icon size="18" v-if="tab.icon">
              <component :is="titleIconComponent(tab.icon)" />
            </el-icon>
            <div>{{ tab.label }}</div>
          </div>
        </el-badge>
      </template>
      <template #default>
        <!--  每个pane插槽内容  -->
        <slot :name="tab.key"></slot>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
// 禁用自动属性继承，手动控制属性透传
defineOptions({ inheritAttrs: false })

// tab 菜单数据类型
interface ITabsMenuData {
  key: string // 绑定值，选中选项卡的 name
  label: string // 标题
  badge?: number | string // 徽标数量
  disabled?: boolean // 是否禁用
  icon?: string | Component // 标题前的图标名称或图标组件
}

// 组件属性
interface IProps {
  // 绑定值，选中选项卡的 name
  modelValue: string | number
  // tab 菜单数据
  tabsMenuData: ITabsMenuData[]
  // 是否启用徽章小圆点
  badgeIsDot?: boolean
  // 徽标最大值
  badgeMax?: number
  // 值为零时是否显示 Badge
  badgeShowZero?: boolean
  // 徽标的类型
  badgeType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  // tabs menu 每一项的高度
  tabsItemHeight?: string | number
}

// 组件事件
interface IEmits {
  (e: 'update:modelValue', value: string | number): void
}

// 定义属性
const props = withDefaults(defineProps<IProps>(), {
  badgeIsDot: false,
  badgeMax: 99,
  badgeShowZero: false,
  badgeType: 'danger',
})

// 定义事件
const emits = defineEmits<IEmits>()

const menuStore = useMenuStore()
const attrs = useAttrs()

// 计算title icon 组件 (如果自己使用 可替换为自己的图标库 或者直接传递图标组件)
const titleIconComponent = (icon: string | Component) => {
  if (typeof icon === 'string') {
    return menuStore.iconComponents[icon]
  }
  return icon
}

// 计算 tabs item 高度
const tabsItemHeightComputed = computed(() => {
  const height = props.tabsItemHeight

  if (typeof height === 'number') {
    // 数字直接加 px
    return `${height}px`
  } else if (typeof height === 'string') {
    // 字符串，检查是否带单位
    // 简单正则判断结尾是否有单位，比如 px / em / rem / %
    const unitRegex = /(px|em|rem|%)$/i
    return unitRegex.test(height) ? height : `${height}px`
  } else {
    // 兜底
    return '40px'
  }
})

// 更新 modelValue
const handleUpdate = (value: string | number) => {
  emits('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.badge-tabs-menu {
  .title-wrap {
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

// 去掉tabs与底部的margin
:deep(.el-tabs__header) {
  margin-bottom: 0;
}

// tabs item 高度
:deep(.el-tabs__item) {
  height: v-bind(tabsItemHeightComputed);
}

// 去掉底部灰线
:deep(.el-tabs__nav-wrap::after) {
  height: 0;
}
</style>
