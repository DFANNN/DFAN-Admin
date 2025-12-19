<template>
  <BaseDialog
    v-model="open"
    :title="submitForm.id ? '编辑菜单' : '新增菜单'"
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
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="submitForm.type" @change="submitFormRef?.clearValidate()">
          <el-radio label="directory">目录</el-radio>
          <el-radio label="menu">菜单</el-radio>
          <el-radio label="button">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="父级菜单" prop="parentId">
        <el-tree-select
          v-model="submitForm.parentId"
          :data="menuList"
          :props="{ label: 'title', value: 'id', children: 'children' }"
          placeholder="请选择父菜单（不选则为顶级菜单）"
          clearable
          check-strictly
        />
      </el-form-item>
      <el-form-item :label="titleLabel" prop="title">
        <el-input v-model="submitForm.title" :placeholder="`请输入${titleLabel}`" />
      </el-form-item>
      <el-form-item label="菜单路径" prop="path" v-if="submitForm.type === 'menu'">
        <el-input v-model="submitForm.path" placeholder="请输入菜单路径" />
      </el-form-item>
      <el-form-item v-if="submitForm.type === 'button'" label="权限标识" prop="permission">
        <el-input v-model="submitForm.permission" placeholder="请输入权限标识" />
      </el-form-item>
      <el-form-item label="图标" prop="icon" v-if="submitForm.type !== 'button'">
        <div class="icon-selector-wrapper">
          <el-input v-model="submitForm.icon" placeholder="请选择图标或输入图标名称" clearable>
            <template #prefix>
              <el-icon v-if="submitForm.icon && menuStore.iconComponents[submitForm.icon]">
                <component :is="menuStore.iconComponents[submitForm.icon]" />
              </el-icon>
            </template>
          </el-input>
          <el-button
            :icon="menuStore.iconComponents.Search"
            @click="selectIconDialogRef?.showDialog(submitForm.icon)"
            >{{ menuStore.isMobile ? null : '选择图标' }}</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="submitForm.order" :min="0" :max="999" style="width: 100%" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="submitForm.status">
          <el-radio label="active">启用</el-radio>
          <el-radio label="inactive">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="confirm">确定</el-button>
    </template>
  </BaseDialog>

  <SelectIconDialog ref="selectIconDialogRef" @getSelectIcon="getSelectIcon" />
</template>

<script setup lang="ts">
import { menuPage, createMenu, updateMenu, menuInfo } from '@/api/menu'
import SelectIconDialog from '@/components/SelectIconDialog.vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { IMenuItem, IMenuType } from '@/types/system/menu'

defineOptions({ name: 'MenuCreate' })

const menuStore = useMenuStore()
const emits = defineEmits(['refresh'])
const submitFormRef = useTemplateRef<FormInstance>('submitFormRef')
const selectIconDialogRef = useTemplateRef<InstanceType<typeof SelectIconDialog> | null>(
  'selectIconDialogRef',
)

const open = ref(false)
const submitLoading = ref(false)
const menuList = ref<IMenuItem[]>([])

const titleLabel = computed(() => {
  if (submitForm.value.type === 'directory') return '目录标题'
  if (submitForm.value.type === 'menu') return '菜单标题'
  if (submitForm.value.type === 'button') return '按钮标题'
  return '菜单标题'
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
    ElMessage.success(submitForm.value.id ? '编辑成功' : '新增成功')
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
    callback(new Error(`请输入${titleLabel.value}`))
  } else {
    callback()
  }
}

const rules: FormRules = {
  type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
  title: [{ required: true, validator: titleValidator, trigger: 'blur' }],
  path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
}

// const rules = computed(() => {
//   return {
//     type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
//     title: [{ required: true, message: `请输入${titleLabel.value}`, trigger: 'blur' }],
//     path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
//     status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
//   } as FormRules
// })

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
