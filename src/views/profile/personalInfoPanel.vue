<template>
  <!-- 个人资料中心 -->
  <el-card class="update-personal-card" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <el-icon>
            <component :is="menuStore.iconComponents['HOutline:UserIcon']" />
          </el-icon>
          <div>个人资料中心</div>
        </div>
        <el-button type="primary" @click="saveUser">保存全部更改</el-button>
      </div>
    </template>
    <div>
      <div class="flex items-center gap-4">
        <el-avatar :size="110" :src="userInfoForm.avatar" class="shrink-0" />
        <div class="flex flex-col items-start gap-2">
          <h4>您的头像</h4>
          <p class="text-sm text-(--el-text-color-secondary)">
            内置多种头像。支持 JPG、PNG、GIF 等格式头像上传，建议大小不超过 2MB 。
          </p>
          <el-button size="small" type="primary" @click="selectAvatarDialogRef?.showDialog()"
            >修改头像</el-button
          >
        </div>
      </div>

      <el-divider />

      <el-form :model="userInfoForm" label-position="top" class="custom-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名">
              <el-input v-model="userInfoForm.username" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="userInfoForm.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号">
              <el-input v-model="userInfoForm.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="userInfoForm.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="个人简介/座右铭">
          <el-input
            v-model="userInfoForm.bio"
            type="textarea"
            :rows="4"
            placeholder="写点什么来展示你自己..."
          />
        </el-form-item>
        <el-form-item label="个人标签（用几个关键词介绍一下自己）">
          <el-input
            v-model="userInfoForm.tags"
            type="textarea"
            :rows="4"
            placeholder="多个标签请用英文逗号分隔, 例如：写代码的, 爱咖啡, 偶尔健身, 长期学习中"
          />
        </el-form-item>
      </el-form>

      <el-divider />

      <div
        class="card-float-up mt-6 p-5 border border-solid border-(--el-border-color-light) rounded-xl transition-all duration-300 hover:border-(--el-border-color) hover:bg-(--el-bg-color-page) cursor-pointer"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div
              class="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-(--el-color-info-light-7) text-(--el-color-primary) transition-colors duration-300"
            >
              <el-icon size="20">
                <component :is="menuStore.iconComponents['HOutline:KeyIcon']" />
              </el-icon>
            </div>

            <div>
              <div class="mb-1 text-sm font-bold text-(--el-text-color-primary)">修改密码</div>
              <div class="text-xs text-(--el-text-color-secondary)">
                定期更换强密码能显著提升账户安全性，建议包含字母与数字。
              </div>
            </div>
          </div>

          <el-button type="primary" plain @click="updatePasswordRef?.showDialog()">
            立即修改
          </el-button>
        </div>
      </div>

      <el-divider />

      <div
        class="card-float-up mt-7 p-4 bg-(--el-color-danger-light-9) border border-dashed border-(--el-color-danger-light-5) rounded-xl cursor-pointer transition-all duration-300 hover:bg-(--el-color-danger-light-7) hover:border-(--el-color-danger)"
      >
        <h4 class="mb-2 text-(--el-color-danger) font-bold">危险区域</h4>
        <div class="flex items-center justify-between gap-4">
          <div>
            <div class="mb-1 text-sm font-bold">注销账户</div>
            <div class="text-sm text-(--el-text-color-secondary)">
              一旦注销，所有数据将无法恢复，请谨慎操作。
            </div>
          </div>
          <el-button type="danger" plain @click="deleteUser">立即注销</el-button>
        </div>
      </div>
    </div>

    <SelectAvatarDialog ref="selectAvatarDialogRef" @get-avatar="getAvatar" />
    <UpdatePassword ref="updatePasswordRef" />
  </el-card>
</template>

<script setup lang="ts">
import { Dialog } from '@/utils/dialog'

const menuStore = useMenuStore()
const userStore = useUserStore()

const selectAvatarDialogRef = useTemplateRef('selectAvatarDialogRef')
const updatePasswordRef = useTemplateRef('updatePasswordRef')

// 个人资料Form
const userInfoForm = ref({
  avatar: '',
  username: '',
  name: '',
  phone: '',
  email: '',
  bio: '',
  tags: '',
})

// 获取头像
const getAvatar = (avatar: string) => {
  userInfoForm.value.avatar = avatar
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 保存修改
const saveUser = () => {
  Dialog.confirm({
    title: '确认保存个人资料',
    content: '小改动，大影响～确认保存当前修改吗？保存后将立即生效。',
    cancelText: '我再看看',
    confirmText: '确认保存',
    onConfirm: async () => {
      await delay(1000)
      userStore.updateUserProfile(userInfoForm.value)
    },
  })
}

// 注销用户
const deleteUser = () => {
  Dialog.confirm({
    title: '要清空数据了哦！',
    content: '一旦注销账户，所有数据都会消失，无法恢复，确认继续？',
    cancelText: '先不急',
    confirmText: '让我勇敢一次',
    onConfirm: async () => {
      await delay(1000)
      userStore.deleteUserAccount()
    },
  })
}

// 监听用户信息 赋值
watch(
  () => userStore.userInfo,
  (userInfo) => {
    userInfoForm.value.avatar = userInfo?.avatar || ''
    userInfoForm.value.username = userInfo?.username || ''
    userInfoForm.value.name = userInfo?.name || ''
    userInfoForm.value.phone = userInfo?.phone || ''
    userInfoForm.value.email = userInfo?.email || ''
    userInfoForm.value.bio = userInfo?.bio || ''
    userInfoForm.value.tags = userInfo?.tags || ''
  },
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
.update-personal-card {
  border: none;
  border-radius: 1rem;
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.el-icon {
  font-size: 1.25rem;
  color: var(--el-color-primary);
}
</style>
