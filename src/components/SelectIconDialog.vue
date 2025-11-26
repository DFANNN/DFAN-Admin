<template>
  <el-dialog
    v-model="open"
    title="选择图标"
    width="800px"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="icon-selector">
      <el-input v-model="iconSearchText" placeholder="搜索图标名称" clearable class="mb-16">
        <template #prefix>
          <el-icon><menuStore.iconComponents.Search /></el-icon>
        </template>
      </el-input>
      <div class="icon-list">
        <div
          v-for="iconName in filteredIconNames"
          :key="iconName"
          class="icon-item"
          :class="{ active: currentSelectIcon === iconName }"
          @click="selectIcon(iconName)"
        >
          <el-icon :size="24">
            <component :is="menuStore.iconComponents[iconName]" />
          </el-icon>
          <div class="icon-name">{{ iconName }}</div>
        </div>
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

// 获取所有图标名称
const allIconNames = computed(() => {
  return Object.keys(menuStore.iconComponents)
})

// 过滤后的图标名称
const filteredIconNames = computed(() => {
  if (!iconSearchText.value) {
    return allIconNames.value
  }
  const search = iconSearchText.value.toLowerCase()
  return allIconNames.value.filter((name) => name.toLowerCase().includes(search))
})

// 选择图标
const selectIcon = (iconName: string) => {
  emits('getSelectIcon', iconName)
  close()
}

const close = () => {
  open.value = false
  currentSelectIcon.value = ''
}

const showDialog = (iconName: string) => {
  currentSelectIcon.value = iconName
  open.value = true
}

defineExpose({
  showDialog,
})
</script>

<style scoped lang="scss">
.icon-selector {
  .icon-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
    max-height: 500px;
    overflow-y: auto;
    padding: 8px;

    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px 8px;
      border: 1px solid var(--el-border-color);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--el-bg-color);
      min-height: 80px;

      &:hover {
        border-color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &.active {
        border-color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }

      .icon-name {
        margin-top: 8px;
        font-size: 12px;
        text-align: center;
        word-break: break-all;
        color: var(--el-text-color-regular);
      }

      &.active .icon-name {
        color: var(--el-color-primary);
        font-weight: 500;
      }
    }
  }
}
</style>
