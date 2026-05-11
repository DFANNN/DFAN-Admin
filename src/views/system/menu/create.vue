<template>
  <BaseDialog
    v-model="open"
    :title="submitForm.id ? $t('menu.editMenu') : $t('menu.addMenu')"
    width="600"
    @close="close"
  >
    <el-form
      ref="submitFormRef"
      :model="submitForm"
      :rules="rules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item :label="$t('menu.type')" prop="type">
        <el-radio-group v-model="submitForm.type" @change="submitFormRef?.clearValidate()">
          <el-radio label="directory">{{ $t('menu.directory') }}</el-radio>
          <el-radio label="menu">{{ $t('menu.menu') }}</el-radio>
          <el-radio label="button">{{ $t('menu.button') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('menu.parentMenu')" prop="parentId">
        <el-tree-select
          v-model="submitForm.parentId"
          :data="menuList"
          :props="{ label: 'title', value: 'id', children: 'children' }"
          :placeholder="$t('menu.parentMenuPlaceholder')"
          clearable
          check-strictly
        />
      </el-form-item>
      <el-form-item :label="titleLabel" prop="title">
        <el-input
          v-model="submitForm.title"
          :placeholder="`${$t('placeholder.input')}${titleLabel}`"
        />
      </el-form-item>
      <el-form-item :label="$t('menu.path')" prop="path" v-if="submitForm.type === 'menu'">
        <el-input v-model="submitForm.path" :placeholder="$t('menu.pathPlaceholder')" />
      </el-form-item>
      <el-form-item
        v-if="submitForm.type === 'button'"
        :label="$t('menu.permission')"
        prop="permission"
      >
        <el-input v-model="submitForm.permission" :placeholder="$t('menu.permissionPlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('menu.icon')" prop="icon" v-if="submitForm.type !== 'button'">
        <div class="icon-selector-wrapper">
          <el-input v-model="submitForm.icon" :placeholder="$t('menu.iconPlaceholder')" clearable>
            <template #prefix>
              <el-icon v-if="submitForm.icon && menuStore.iconComponents[submitForm.icon]">
                <component :is="menuStore.iconComponents[submitForm.icon]" />
              </el-icon>
            </template>
          </el-input>
          <el-button
            :icon="menuStore.iconComponents['Element:Search']"
            @click="iconSelectorDialogRef?.showDialog(submitForm.icon)"
          >
            <template #default v-if="!menuStore.isMobile">选择图标</template>
          </el-button>
        </div>
      </el-form-item>
      <el-form-item :label="$t('menu.sort')" prop="order">
        <el-input-number v-model="submitForm.order" :min="0" :max="999" style="width: 100%" />
      </el-form-item>
      <el-form-item :label="$t('menu.status')" prop="status">
        <el-radio-group v-model="submitForm.status">
          <el-radio v-for="item in STATUS_OPTIONS" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" :loading="submitLoading" @click="confirm">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </BaseDialog>

  <IconSelectorDialog ref="iconSelectorDialogRef" @selectIcon="getSelectIcon" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { menuPage, createMenu, updateMenu, menuInfo } from '@/api/menu'
import IconSelectorDialog from '@/components/dialog/IconSelectorDialog.vue'
import { STATUS_OPTIONS } from '@/constants/dict'
import type { FormInstance, FormRules } from 'element-plus'
import type { IMenuItem, IMenuType } from '@/types/system/menu'

defineOptions({ name: 'MenuCreate' })

const { t } = useI18n()
const menuStore = useMenuStore()
const emits = defineEmits(['refresh'])
const submitFormRef = useTemplateRef<FormInstance>('submitFormRef')
const iconSelectorDialogRef = useTemplateRef<InstanceType<typeof IconSelectorDialog> | null>(
  'iconSelectorDialogRef',
)

const open = ref(false)
const submitLoading = ref(false)
const menuList = ref<IMenuItem[]>([])

const titleLabel = computed(() => {
  if (submitForm.value.type === 'directory') return t('menu.directoryTitle')
  if (submitForm.value.type === 'menu') return t('menu.menuTitle')
  if (submitForm.value.type === 'button') return t('menu.buttonTitle')
  return t('menu.menuTitle')
})

const submitForm = ref({
  id: undefined as string | undefined,
  type: 'directory' as IMenuType,
  title: '',
  path: '',
  icon: '',
  parentId: null as string | null,
  order: 0,
  status: 'active' as 'active' | 'inactive',
  permission: '',
})

const close = () => {
  open.value = false
  submitFormRef.value?.resetFields()
  submitLoading.value = false
  menuList.value = []
  submitForm.value = {
    id: undefined,
    type: 'directory',
    title: '',
    path: '',
    icon: '',
    parentId: null,
    order: 0,
    status: 'active',
    permission: '',
  }
}

const confirm = async () => {
  await submitFormRef.value?.validate()
  submitLoading.value = true

  try {
    const { data: res } = submitForm.value.id
      ? await updateMenu(submitForm.value)
      : await createMenu(submitForm.value)

    if (res.code !== 200) return
    ElMessage.success(submitForm.value.id ? t('message.editSuccess') : t('message.addSuccess'))
    emits('refresh')
    close()
  } finally {
    submitLoading.value = false
  }
}

// 获取菜单列表
const getMenuList = async () => {
  const { data: res } = await menuPage()
  if (res.code !== 200) return
  menuList.value = res.data || []
}

// 获取用户选择的图标
const getSelectIcon = (iconName: string) => {
  submitForm.value.icon = iconName
}

// 获取菜单详情
const getMenuInfo = async () => {
  const { data: res } = await menuInfo(submitForm.value.id as string)
  if (res.code !== 200) return
  const { id, type, title, path, icon, parentId, order, status, permission } = res.data
  submitForm.value = { id, type, title, path, icon, parentId, order, status, permission }
}

// 显示对话框
const showDialog = (id: string | undefined) => {
  getMenuList()
  submitForm.value.id = id
  if (id) getMenuInfo()
  open.value = true
}

// 标题验证器
const titleValidator = (
  _rule: unknown,
  value: string,
  callback: (error?: string | Error | undefined) => void,
) => {
  if (value === '') {
    callback(new Error(`${t('placeholder.input')}${titleLabel.value}`))
  } else {
    callback()
  }
}

const rules: FormRules = {
  type: [{ required: true, message: t('menu.typePlaceholder'), trigger: 'blur' }],
  title: [{ required: true, validator: titleValidator, trigger: 'blur' }],
  path: [{ required: true, message: t('menu.pathPlaceholder'), trigger: 'blur' }],
  status: [{ required: true, message: t('menu.statusPlaceholder'), trigger: 'blur' }],
}

defineExpose({
  showDialog,
})
</script>

<style scoped lang="scss">
.icon-selector-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;

  .el-input {
    flex: 1;
  }
}
</style>
