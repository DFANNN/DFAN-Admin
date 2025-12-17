<template>
  <el-dialog
    v-model="open"
    :title="submitForm.id ? '编辑数据' : '新增数据'"
    :width="menuStore.isMobile ? '90%' : '600px'"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-scrollbar max-height="60vh">
      <el-form ref="submitFormRef" :model="submitForm" label-width="100px" label-position="right">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="submitForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-input v-model="submitForm.role" placeholder="请输入角色" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="submitForm.sex" placeholder="请选择性别">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number
            v-model="submitForm.age"
            placeholder="请输入年龄"
            :controls="false"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="submitForm.address" placeholder="请输入地址" />
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
import type { FormInstance } from 'element-plus'

defineOptions({ name: 'VxeTableCreate' })

const emits = defineEmits(['refresh'])
const menuStore = useMenuStore()
const submitFormRef = useTemplateRef<FormInstance>('submitFormRef')

const open = ref(false)
const submitLoading = ref(false)

const submitForm = ref({
  id: undefined as string | undefined,
  name: '',
  role: '',
  sex: '0',
  age: null as number | null,
  address: '',
})

const confirm = () => {
  ElMessage.success(submitForm.value.id ? '编辑成功' : '新增成功')
  emits('refresh', submitForm.value.id ? 'update' : 'create')
  close()
}

const close = () => {
  submitFormRef.value?.resetFields()
  submitForm.value.id = undefined
  submitForm.value = {
    id: undefined,
    name: '',
    role: '',
    sex: '0',
    age: null,
    address: '',
  }
  open.value = false
}

interface IData {
  id: string | undefined
  name: string
  role: string
  sex: string
  age: number | null
  address: string
}

const showDialog = (data: IData | undefined) => {
  if (data) submitForm.value = JSON.parse(JSON.stringify(data))
  open.value = true
}

defineExpose({
  showDialog,
})
</script>

<style></style>
