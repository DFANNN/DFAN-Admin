<template>
  <el-dialog
    v-model="open"
    :title="submitForm.id ? '编辑角色' : '新增角色'"
    :width="menuStore.isMobile ? '90%' : '600px'"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-scrollbar max-height="60vh">
      <el-form
        ref="submitFormRef"
        :model="submitForm"
        :rules="formRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="submitForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input
            v-model="submitForm.code"
            placeholder="请输入角色编码"
            :disabled="!!submitForm.id"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="submitForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="submitForm.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限" prop="menuIds">
          <el-tree
            ref="menuTreeRef"
            :data="menuList"
            :props="{ label: 'title', children: 'children' }"
            show-checkbox
            default-expand-all
            node-key="id"
            @check="handleMenuCheck as unknown"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
    </el-scrollbar>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { createRole, roleInfo, updateRole } from '@/api/role'
import { menuPage } from '@/api/menu'
import { type FormInstance, type FormRules, type ElTree } from 'element-plus'
import type { IMenuItem } from '@/types/system/menu'

defineOptions({ name: 'RoleCreate' })

const emits = defineEmits(['refresh'])
const menuStore = useMenuStore()

const submitFormRef = useTemplateRef<FormInstance>('submitFormRef')
const menuTreeRef = useTemplateRef<InstanceType<typeof ElTree> | null>('menuTreeRef')

// 对话框开关
const open = ref(false)

// 提交按钮加载状态
const submitLoading = ref(false)

// 菜单列表
const menuList = ref<IMenuItem[]>([])

// 表单数据
const submitForm = ref({
  id: undefined as string | undefined,
  name: '',
  code: '',
  description: '',
  status: 'active' as 'active' | 'inactive',
  menuIds: [] as string[],
})

// 取消
const close = () => {
  open.value = false
  menuTreeRef.value?.setCheckedKeys([])
  submitFormRef.value?.resetFields()
  menuList.value = []
  submitForm.value.menuIds = []
}

// 确定
const confirm = async () => {
  await submitFormRef.value?.validate()
  const { data: res } = submitForm.value.id
    ? await updateRole(submitForm.value)
    : await createRole(submitForm.value)
  if (res.code !== 200) return
  ElMessage.success(submitForm.value.id ? '编辑成功' : '新增成功')
  emits('refresh', submitForm.value.id ? 'update' : 'create')
  close()
}

// 获取菜单列表
const getMenuList = async () => {
  const { data: res } = await menuPage()
  if (res.code !== 200) return
  menuList.value = res.data || []
}

// 获取角色信息
const getRoleInfo = async () => {
  const { data: res } = await roleInfo(submitForm.value.id as string)
  if (res.code !== 200) return
  const { id, name, code, description, status, menuIds } = res.data
  submitForm.value = { id, name, code, description, status, menuIds: menuIds || [] }

  // 等待菜单列表和 DOM 都更新后设置选中的菜单
  await nextTick()
  // 确保菜单树已经渲染
  if (menuTreeRef.value && menuList.value.length > 0) {
    const menuIdsToSet = menuIds && menuIds.length > 0 ? menuIds : []
    menuTreeRef.value.setCheckedKeys(menuIdsToSet)
  }
}

// 处理菜单选择
const handleMenuCheck = (
  data: IMenuItem,
  checked: { checkedKeys: string[]; halfCheckedKeys: string[] },
) => {
  submitForm.value.menuIds = checked.checkedKeys
}

// 表单验证规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: '角色编码只能包含字母、数字和下划线，且以字母开头',
      trigger: 'blur',
    },
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// 显示对话框
const showDialog = async (id: string | undefined) => {
  submitForm.value.id = id
  submitForm.value.menuIds = []
  open.value = true
  // 加载菜单列表
  await getMenuList()
  if (id) await getRoleInfo()
}

defineExpose({
  showDialog,
})
</script>

<style></style>
