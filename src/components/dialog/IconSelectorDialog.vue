<template>
  <BaseDialog
    v-model="open"
    :title="title"
    :width="width"
    :show-footer="false"
    style="height: 60vh"
  >
    <div
      class="icon-selector-dialog-container"
      :class="{
        'is-mobile': menuStore.isMobile,
        'is-spacious': props.density === 'spacious',
      }"
      ref="iconSelectorDialogContainerRef"
    >
      <div class="icon-menu">
        <div
          class="item-menu-item"
          :class="{ active: activeMenu === menu.value }"
          v-for="menu in iconMenu"
          :key="menu.value"
          @click="activeMenu = menu.value"
        >
          <el-icon :size="20">
            <component :is="menuStore.iconComponents[menu.icon]" />
          </el-icon>
          <span>{{ menu.label }}</span>
        </div>
      </div>
      <div class="icon-content">
        <transition name="fade-slide" mode="out-in">
          <div :key="activeMenu" style="height: 100%">
            <el-input v-model="searchValue" placeholder="搜索图标名称" clearable>
              <template #prefix>
                <el-icon><component :is="menuStore.iconComponents['Element:Search']" /></el-icon>
              </template>
            </el-input>
            <el-scrollbar
              :class="menuStore.isMobile ? 'icon-list-scrollbar-mobile' : 'icon-list-scrollbar'"
            >
              <div class="icon-list">
                <template v-for="icon in filteredIconList" :key="icon">
                  <!-- 紧凑模式：使用 tooltip -->
                  <el-tooltip
                    v-if="props.density === 'compact'"
                    :content="icon"
                    :placement="POPCONFIRM_CONFIG.placement"
                    :width="POPCONFIRM_CONFIG.width"
                    :show-after="POPCONFIRM_CONFIG.showAfter"
                  >
                    <div
                      class="icon-item"
                      :class="{ active: currentIcon === icon }"
                      @click="selectIcon(icon)"
                    >
                      <el-icon :size="22">
                        <component :is="menuStore.iconComponents[icon]" />
                      </el-icon>
                    </div>
                  </el-tooltip>
                  <!-- 宽松模式：不使用 tooltip，显示名称 -->
                  <div
                    v-else
                    class="icon-item"
                    :class="{ active: currentIcon === icon }"
                    @click="selectIcon(icon)"
                  >
                    <el-icon :size="24">
                      <component :is="menuStore.iconComponents[icon]" />
                    </el-icon>
                    <span class="icon-name" :title="icon">{{ icon }}</span>
                  </div>
                </template>
              </div>
            </el-scrollbar>
          </div>
        </transition>
      </div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
defineOptions({ name: 'IconSelectorDialog', inheritAttrs: false })

interface IProps {
  // 标题
  title?: string
  // 宽度
  width?: string | number
  // 密度
  density?: 'compact' | 'spacious'
}

interface IEmits {
  (e: 'selectIcon', icon: string, component: Component): void
}

type IActiveMenu = 'Element:' | 'HOutline:' | 'HSolid:'

interface IIconMenuItem {
  label: string
  value: IActiveMenu
  icon: string
}

const props = withDefaults(defineProps<IProps>(), {
  title: '图标选择',
  width: '900px',
  density: 'compact',
})

const emits = defineEmits<IEmits>()

const open = ref(false)
const menuStore = useMenuStore()

// 当前选中的图标
const currentIcon = ref('')

// 搜索框的值
const searchValue = ref('')

// 当前选中的菜单
const activeMenu = ref<IActiveMenu>('Element:')

// 菜单
const iconMenu = ref<IIconMenuItem[]>([
  { label: 'Element Plus', value: 'Element:', icon: 'Element:ElementPlus' },
  { label: 'HeroIcons Outline', value: 'HOutline:', icon: 'HOutline:ShieldCheckIcon' },
  { label: 'HeroIcons Solid', value: 'HSolid:', icon: 'HSolid:ShieldCheckIcon' },
])

// 当前菜单的图标列表
const activeIconList = computed(() => {
  const allIcons = Object.keys(menuStore.iconComponents)
  return allIcons.filter((icon) => icon.startsWith(activeMenu.value))
})

// 过滤后的图标列表
const filteredIconList = computed(() => {
  if (!searchValue.value) return activeIconList.value
  const search = searchValue.value.toLowerCase()
  return activeIconList.value.filter((name) => name.toLowerCase().includes(search))
})

const selectIcon = (icon: string) => {
  currentIcon.value = icon
  emits('selectIcon', icon, menuStore.iconComponents[icon] as Component)
  closeDialog()
}

/**
 * 打开图标选择器
 * @param currentIconValue 当前选中的图标
 */
const showDialog = (currentIconValue: string = '') => {
  currentIcon.value = currentIconValue
  open.value = true
}

/**
 * 关闭图标选择器
 */
const closeDialog = () => {
  open.value = false
  searchValue.value = ''
}

/**
 * 清除数据
 */
const clearData = () => {
  currentIcon.value = ''
  searchValue.value = ''
  activeMenu.value = 'Element:'
}
defineExpose({
  showDialog,
  closeDialog,
  clearData,
})
</script>

<style scoped lang="scss">
.icon-selector-dialog-container {
  height: 100%;
  display: flex;
  gap: 1rem;
  .icon-menu {
    width: 12.5rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border-right: 1px solid var(--el-border-color-lighter);
    .item-menu-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      color: var(--el-text-color-primary);
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        background: var(--el-fill-color-light);
        color: var(--el-color-primary);
      }

      &.active {
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--el-color-primary) 20%, transparent) 0%,
          color-mix(in srgb, var(--el-color-primary) 20%, transparent) 100%
        );
        color: var(--el-color-primary);
      }
    }
  }
  .icon-content {
    flex: 1;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    .icon-list {
      margin-top: 1rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
      gap: 1rem;
      padding: 0.25rem 0;

      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--el-border-color);
        border-radius: 0.5rem;
        cursor: pointer;
        padding: 0.5rem 0;
        transition: all 0.3s ease;

        &:hover {
          border-color: var(--el-color-primary);
          transform: translateY(-2px);
          background: var(--el-fill-color-light);
        }

        &.active {
          border-color: var(--el-color-primary);
          background: var(--el-fill-color-light);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        // 图标名称样式
        .icon-name {
          width: 100%;
          margin-top: 0.5rem;
          text-align: center;
          font-size: 0.8125rem;
          color: var(--el-text-color-regular);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 0.25rem;
          line-height: 1.4;
        }
      }
    }
  }

  // 宽松模式样式
  &.is-spacious {
    .icon-content {
      .icon-list {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 1.25rem;
        padding: 0.5rem 0;

        .icon-item {
          padding: 0.75rem 0.5rem;
          border-radius: 0.625rem;

          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 14px rgba(0, 0, 0, 0.1);
          }

          &.active {
            box-shadow: 0 5px 14px rgba(0, 0, 0, 0.08);
          }

          .icon-name {
            color: var(--el-text-color-primary);
            font-weight: 500;
            font-size: 0.75rem;
            margin-top: 0.375rem;
          }
        }
      }
    }
  }

  &.is-mobile {
    flex-direction: column;
    gap: 0.5rem;
    .icon-menu {
      width: 100%;
      border-right: none;
      flex-direction: row;
      justify-content: space-between;
      border-bottom: 1px solid var(--el-border-color-lighter);
      gap: 0.25rem;
      .item-menu-item {
        flex: 1;
        justify-content: center;
        padding: 0.75rem 0.5rem;
      }
    }
    .icon-content {
      height: 100%;
      padding: 0.25rem;
    }
  }
}
.icon-list-scrollbar {
  height: calc(100% - 2rem);
}
.icon-list-scrollbar-mobile {
  height: calc(100% - 6rem);
}
</style>
