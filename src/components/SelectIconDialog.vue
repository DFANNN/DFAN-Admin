<template>
  <el-dialog
    v-model="open"
    title="选择图标"
    :width="menuStore.isMobile ? '90%' : '950px'"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="icon-container" :class="{ 'is-mobile': menuStore.isMobile }">
      <div class="icon-menu">
        <div
          class="icon-menu-item"
          :class="{ active: activeMenu === 'element' }"
          @click="switchMenu('element')"
        >
          <el-icon :size="20"><component :is="menuStore.iconComponents['ElementPlus']" /></el-icon>
          <span>Element Plus</span>
        </div>
        <div
          class="icon-menu-item"
          :class="{ active: activeMenu === 'outline' }"
          @click="switchMenu('outline')"
        >
          <el-icon :size="19">
            <component :is="menuStore.iconComponents['HOutline:ShieldCheckIcon']" />
          </el-icon>
          <span>Heroicons Outline</span>
        </div>
        <div
          class="icon-menu-item"
          :class="{ active: activeMenu === 'solid' }"
          @click="switchMenu('solid')"
        >
          <el-icon :size="19">
            <component :is="menuStore.iconComponents['HSolid:ShieldCheckIcon']" />
          </el-icon>
          <span>Heroicons Solid</span>
        </div>
      </div>
      <div class="icon-content">
        <transition name="fade-slide" mode="out-in">
          <div :key="activeMenu">
            <el-input v-model="iconSearchText" placeholder="搜索图标名称" clearable>
              <template #prefix>
                <el-icon><component :is="menuStore.iconComponents['Search']" /></el-icon>
              </template>
            </el-input>

            <el-scrollbar :height="menuStore.isMobile ? '300' : '410'">
              <div class="icon-list">
                <div
                  v-for="iconName in filteredIconNames"
                  :key="iconName"
                  class="icon-item"
                  :class="{ active: currentSelectIcon === iconName }"
                  @click="selectIcon(iconName)"
                >
                  <div class="icon-image">
                    <el-icon :size="24">
                      <component :is="menuStore.iconComponents[iconName]" />
                    </el-icon>
                  </div>
                  <div class="icon-name">{{ getDisplayName(iconName) }}</div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </transition>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({ name: 'SelectIconDialog' })

const emits = defineEmits(['getSelectIcon'])
const menuStore = useMenuStore()

const open = ref(false)
const iconSearchText = ref('')
const currentSelectIcon = ref('')

// 当前选中的菜单
const activeMenu = ref<'element' | 'outline' | 'solid'>('element')

// 获取当前分类的所有图标名称
const currentCategoryIcons = computed(() => {
  const allIcons = Object.keys(menuStore.iconComponents)

  switch (activeMenu.value) {
    case 'element':
      return allIcons.filter((name) => !name.startsWith('HOutline:') && !name.startsWith('HSolid:'))
    case 'outline':
      return allIcons.filter((name) => name.startsWith('HOutline:'))
    case 'solid':
      return allIcons.filter((name) => name.startsWith('HSolid:'))
    default:
      return []
  }
})

// 过滤后的图标名称（在当前分类中搜索）
const filteredIconNames = computed(() => {
  if (!iconSearchText.value) {
    return currentCategoryIcons.value
  }
  const search = iconSearchText.value.toLowerCase()
  return currentCategoryIcons.value.filter((name) => name.toLowerCase().includes(search))
})

// 显示名称（去除前缀）
const getDisplayName = (name: string) => name.replace(/^HOutline:/, '').replace(/^HSolid:/, '')

// 切换菜单
const switchMenu = (menu: 'element' | 'outline' | 'solid') => {
  if (activeMenu.value === menu) return
  activeMenu.value = menu
  iconSearchText.value = ''
}

// 选择图标
const selectIcon = (iconName: string) => {
  emits('getSelectIcon', iconName)
  close()
}

const close = () => {
  open.value = false
  iconSearchText.value = ''
  currentSelectIcon.value = ''
}

const showDialog = (iconName: string) => {
  currentSelectIcon.value = iconName

  // 根据传入的图标名称确定应该显示哪个分类
  if (iconName.startsWith('HOutline:')) {
    activeMenu.value = 'outline'
  } else if (iconName.startsWith('HSolid:')) {
    activeMenu.value = 'solid'
  } else {
    activeMenu.value = 'element'
  }

  open.value = true
}

defineExpose({
  showDialog,
})
</script>

<style scoped lang="scss">
.icon-container {
  display: flex;
  gap: 1rem;
  min-height: 30rem;

  // 移动端布局
  &.is-mobile {
    flex-direction: column;
    gap: 0.5rem;
    min-height: auto;
    max-height: calc(100vh - 200px);
    overflow: hidden;

    .icon-menu {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid var(--el-border-color-lighter);
      padding: 0.5rem;
      flex-direction: row;
      justify-content: space-around;
      gap: 0.25rem;

      .icon-menu-item {
        flex: 1;
        justify-content: center;
        padding: 0.75rem 0.5rem;
        font-size: 0.875rem;
      }
    }

    .icon-content {
      padding: 0.25rem;
    }
  }

  .icon-menu {
    width: 12.5rem;
    border-right: 1px solid var(--el-border-color-lighter);
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .icon-menu-item {
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: 0.75rem;
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
    gap: 1rem;

    @media (max-width: 992px) {
      gap: 0.75rem;
    }

    .icon-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1rem;
      padding: 0.5rem 0;

      @media (max-width: 992px) {
        grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
        gap: 0.75rem;
        padding: 0.25rem 0;
      }

      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--el-border-color);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 0.5rem;

        @media (max-width: 992px) {
          padding: 0.375rem;
          border-width: 1.5px;
        }

        &:hover {
          border-color: var(--el-color-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        // 移动端点击效果
        @media (max-width: 992px) {
          &:active {
            transform: scale(0.95);
          }
        }

        &.active {
          border-color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .icon-image {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 60px;
          color: var(--el-text-color-primary);

          @media (max-width: 992px) {
            min-height: 50px;
          }
        }

        .icon-name {
          font-size: 0.75rem;
          margin-top: 0.25rem;
          text-align: center;
          word-break: break-all;
          color: var(--el-text-color-regular);

          @media (max-width: 992px) {
            font-size: 0.625rem;
            margin-top: 0.125rem;
          }
        }

        &.active .icon-name {
          color: var(--el-color-primary);
          font-weight: 500;
        }
      }
    }
  }
}
</style>
