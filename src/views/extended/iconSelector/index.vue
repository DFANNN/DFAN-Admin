<template>
  <div class="icon-selector-container">
    <el-card shadow="never">
      <el-button type="primary" @click="openIconSelectorDialog">打开图标选择器</el-button>
      <IconSelectorDialog @close="close" @confirm="confirm" ref="iconSelectorDialogRef" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import IconSelectorDialog from '@/components/dialog/IconSelectorDialog.vue'

defineOptions({ name: 'IconSelectorView' })

const iconSelectorDialogRef = useTemplateRef<InstanceType<typeof IconSelectorDialog> | null>(
  'iconSelectorDialogRef',
)
const openIconSelectorDialog = () => {
  iconSelectorDialogRef.value?.showDialog()
}

const close = () => {
  console.log(`output->1`)
}

const confirm = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log(`output->2`)
}
</script>

<style scoped lang="scss">
.icon-selector-container {
  flex: 1;
  display: flex;
  .el-card {
    flex: 1;
  }
}
</style>
