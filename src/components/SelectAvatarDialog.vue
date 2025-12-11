<template>
  <el-dialog
    v-model="open"
    title="选择头像"
    :width="menuStore.isMobile ? '90%' : '800px'"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="avatar-container" :class="{ 'is-mobile': menuStore.isMobile }">
      <div class="avatar-menu">
        <div
          class="avatar-menu-item"
          :class="{ active: activeMenu === 'upload' }"
          @click="switchMenu('upload')"
        >
          <el-icon size="20"
            ><component :is="menuStore.iconComponents['HSolid:CameraIcon']"
          /></el-icon>
          <span>上传头像</span>
        </div>
        <div
          class="avatar-menu-item"
          :class="{ active: activeMenu === 'cat' }"
          @click="switchMenu('cat')"
        >
          <el-icon size="20"
            ><component :is="menuStore.iconComponents['HSolid:SparklesIcon']"
          /></el-icon>
          <span>系统头像</span>
        </div>
      </div>
      <div class="avatar-content">
        <transition name="fade-slide" mode="out-in">
          <div :key="activeMenu">
            <div v-if="activeMenu === 'upload'" class="upload-container">
              <el-upload
                drag
                accept="image/*"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="uploadFile"
                class="upload-drag"
              >
                <div v-if="!selectedAvatar" class="upload-content">
                  <el-icon class="upload-icon">
                    <component :is="menuStore.iconComponents['HSolid:PhotoIcon']" />
                  </el-icon>
                  <div class="upload-text">
                    <div class="upload-text-main">拖拽图片到此处或点击上传</div>
                    <div class="upload-text-tip">支持 JPG、PNG、GIF 等格式，建议大小不超过 2MB</div>
                  </div>
                </div>
                <div v-else class="upload-preview-content">
                  <div class="preview-image-container">
                    <img :src="selectedAvatar as string" alt="预览头像" class="preview-image" />
                    <div class="preview-overlay">
                      <el-button
                        type="danger"
                        :icon="menuStore.iconComponents['Delete']"
                        circle
                        @click.stop="selectedAvatar = null"
                        class="clear-btn"
                      />
                    </div>
                  </div>
                  <div class="preview-hint">点击重新上传或拖拽替换图片</div>
                </div>
              </el-upload>
            </div>
            <div v-else-if="activeMenu === 'cat'" class="cat-container">
              <el-input v-model="avatarSearchText" placeholder="搜索头像名称" clearable>
                <template #prefix>
                  <el-icon><component :is="menuStore.iconComponents['Search']" /></el-icon>
                </template>
              </el-input>

              <el-scrollbar :height="menuStore.isMobile ? '300' : '410'">
                <div class="cat-avatar-list">
                  <div
                    class="cat-avatar-item"
                    v-for="cat in filteredAvatars"
                    :key="cat.id"
                    :class="{ active: selectedAvatarId === cat.id }"
                    @click="selectAvatar(cat)"
                  >
                    <div class="cat-avatar-image">
                      <img :src="cat.src" :alt="cat.alt" />
                    </div>
                    <div class="cat-avatar-name">{{ cat.title }}</div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button
        type="primary"
        :disabled="!selectedAvatar"
        :loading="updateAvatarLoading"
        @click="updateAvatar"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { APP_CONFIG } from '@/config/app.config'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'

defineOptions({ name: 'SelectAvatarDialog' })

const menuStore = useMenuStore()
const userStore = useUserStore()

const open = ref(false)
const updateAvatarLoading = ref(false)

// 当前选中的菜单
const activeMenu = ref<'upload' | 'cat'>('upload')
// 当前选中的头像id
const selectedAvatarId = ref<string | number | null>(null)
// 当前选中的头像
const selectedAvatar = ref<string | number | null>(null)

// 搜索框内容
const avatarSearchText = ref('')

// 获取所有头像
const allAvatars = computed(() => {
  return APP_CONFIG.systemAvatar
})

// 过滤后的头像列表
const filteredAvatars = computed(() => {
  if (!avatarSearchText.value) {
    return allAvatars.value
  }
  const search = avatarSearchText.value.toLowerCase()
  return allAvatars.value.filter((avatar) => avatar.title.toLowerCase().includes(search))
})

// 切换菜单
const switchMenu = (menu: 'upload' | 'cat') => {
  if (activeMenu.value === menu) return
  activeMenu.value = menu
  selectedAvatarId.value = null
  selectedAvatar.value = null
}
// 选择头像
const selectAvatar = (avatar: { src: string; id?: string | number }) => {
  selectedAvatarId.value = avatar.id ?? null
  selectedAvatar.value = avatar.src
}

// 上传头像
const uploadFile = (uploadFile: UploadFile) => {
  const file = uploadFile.raw
  if (!file) return

  // 验证文件大小（2MB）
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.warning('图片大小不能超过 2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    selectedAvatar.value = reader.result as string
  }
  reader.readAsDataURL(file)
}

// 修改头像
const updateAvatar = async () => {
  if (!selectedAvatar.value) return
  updateAvatarLoading.value = true
  try {
    await userStore.updateAvatar(selectedAvatar.value as string)
    close()
  } finally {
    updateAvatarLoading.value = false
  }
}

const close = () => {
  open.value = false
  avatarSearchText.value = ''
  selectedAvatarId.value = null
  selectedAvatar.value = null
}

const showDialog = () => {
  open.value = true
}

defineExpose({
  showDialog,
})
</script>

<style scoped lang="scss">
.avatar-container {
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

    .avatar-menu {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid var(--el-border-color-lighter);
      padding: 0.5rem;
      flex-direction: row;
      justify-content: space-around;
      gap: 0.25rem;

      .avatar-menu-item {
        flex: 1;
        justify-content: center;
        padding: 0.75rem 0.5rem;
        font-size: 0.875rem;
      }
    }

    .avatar-content {
      padding: 0.25rem;
    }
  }

  .avatar-menu {
    width: 10rem;
    border-right: 1px solid var(--el-border-color-lighter);
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .avatar-menu-item {
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
  .avatar-content {
    flex: 1;
    padding: 0.5rem;

    .upload-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 410px;
      gap: 1.5rem;

      // 移动端优化
      @media (max-width: 992px) {
        min-height: auto;
        gap: 1rem;
      }

      .upload-drag {
        width: 100%;
        :deep(.el-upload-dragger) {
          width: 100%;
          height: 300px;
          border: 2px dashed var(--el-border-color);
          border-radius: 12px;
          background: var(--el-fill-color-lighter);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          position: relative;

          // 移动端优化
          @media (max-width: 992px) {
            height: 250px;
            padding: 1rem;
            gap: 0.75rem;
          }

          &:hover {
            border-color: var(--el-color-primary);
          }

          .upload-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;

            @media (max-width: 992px) {
              gap: 0.75rem;
            }

            .upload-icon {
              font-size: 4rem;
              color: var(--el-color-primary);

              @media (max-width: 992px) {
                font-size: 3rem;
              }
            }

            .upload-text {
              text-align: center;
              .upload-text-main {
                font-size: 1rem;
                color: var(--el-text-color-primary);
                font-weight: 500;
                margin-bottom: 0.5rem;

                @media (max-width: 992px) {
                  font-size: 0.875rem;
                  margin-bottom: 0.25rem;
                }
              }
              .upload-text-tip {
                font-size: 0.875rem;
                color: var(--el-text-color-secondary);

                @media (max-width: 992px) {
                  font-size: 0.75rem;
                }
              }
            }
          }

          .upload-preview-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            width: 100%;
            height: 100%;

            @media (max-width: 992px) {
              gap: 0.75rem;
            }

            .preview-image-container {
              position: relative;
              width: 180px;
              height: 180px;
              border-radius: 50%;
              overflow: hidden;
              border: 4px solid var(--el-border-color-lighter);
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;

              @media (max-width: 992px) {
                width: 150px;
                height: 150px;
                border-width: 3px;
              }

              &:hover {
                border-color: var(--el-color-primary);
                box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);

                .preview-overlay {
                  opacity: 1;
                }
              }

              // 移动端优化：点击显示删除按钮
              @media (max-width: 992px) {
                .preview-overlay {
                  // 移动端点击时显示
                  opacity: 0;

                  &:active {
                    opacity: 1;
                  }
                }

                // 点击容器时显示删除按钮
                &:active .preview-overlay {
                  opacity: 1;
                }
              }

              .preview-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
              }

              .preview-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                border-radius: 50%;

                .clear-btn {
                  backdrop-filter: blur(4px);
                }
              }
            }

            .preview-hint {
              font-size: 0.875rem;
              color: var(--el-text-color-secondary);
              text-align: center;

              @media (max-width: 992px) {
                font-size: 0.75rem;
                padding: 0 0.5rem;
              }
            }
          }
        }
      }
    }

    .cat-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      @media (max-width: 992px) {
        gap: 0.75rem;
      }

      .cat-avatar-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 1rem;
        padding: 0.5rem 0;

        @media (max-width: 992px) {
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 0.75rem;
          padding: 0.25rem 0;
        }

        .cat-avatar-item {
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
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
          .cat-avatar-image {
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .cat-avatar-name {
            font-size: 0.75rem;
            margin-top: 0.25rem;
            text-align: center;

            @media (max-width: 992px) {
              font-size: 0.625rem;
              margin-top: 0.125rem;
            }
          }
        }
      }
    }
  }
}
</style>
