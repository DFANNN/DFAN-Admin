<template>
  <div>
    <BasePage
      ref="basePageRef"
      :formConfig="searchFormConfig"
      :table-data="menuList"
      :columns="columns"
      :show-pagination="false"
      :show-export="false"
      :show-print="false"
      :table-loading="loading"
      :tableAttrs="{
        rowKey: 'id',
        defaultExpandAll: true,
        treeProps: { children: 'children', hasChildren: 'hasChildren' },
      }"
      @refresh="getMenuList"
    >
      <template #tableOperationLeft>
        <el-button
          type="primary"
          :icon="menuStore.iconComponents.Plus"
          @click="menuCreateRef?.showDialog(undefined)"
          v-permission="['menu:add']"
          >{{ $t('menu.addMenu') }}</el-button
        >
      </template>
      <template #type="{ row }">
        <BaseTag v-if="row.type === 'directory'" type="info" :text="$t('menu.directory')" />
        <BaseTag v-else-if="row.type === 'menu'" type="primary" :text="$t('menu.menu')" />
        <BaseTag v-else-if="row.type === 'button'" type="warning" :text="$t('menu.button')" />
      </template>
      <template #icon="{ row }">
        <el-icon v-if="row.icon">
          <component :is="menuStore.iconComponents[row.icon]" />
        </el-icon>
      </template>
      <template #status="{ row }">
        <BaseTag
          :type="row.status === 'active' ? 'success' : 'danger'"
          :text="row.status === 'active' ? $t('tag.enabled') : $t('tag.disabled')"
        />
      </template>
      <template #operation="{ row }">
        <el-button
          type="primary"
          link
          :icon="menuStore.iconComponents.Edit"
          @click="menuCreateRef?.showDialog(row.id)"
          v-permission="['menu:edit']"
          >{{ $t('button.edit') }}</el-button
        >
        <el-popconfirm
          title="{{ $t('menu.deleteMenuPopconfirm') }}"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="deleteMenuHandle(row.id)"
        >
          <template #reference>
            <el-button
              type="danger"
              link
              :icon="menuStore.iconComponents.Delete"
              v-permission="['menu:delete']"
            >
              {{ $t('button.delete') }}
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <MenuCreate ref="menuCreateRef" @refresh="refreshHandle" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { delay } from '@/utils/utils'
import { menuPage, deleteMenu } from '@/api/menu'
import MenuCreate from '@/views/system/menu/create.vue'
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
import type { IMenuItem } from '@/types/system/menu'
import type { IFormConfig } from '@/types/components/page'

defineOptions({ name: 'UserView' })
const { t } = useI18n()
const menuStore = useMenuStore()
const basePageRef = useTemplateRef('basePageRef')
const menuCreateRef = useTemplateRef('menuCreateRef')

// 搜索form配置
const searchFormConfig = ref<IFormConfig[]>([
  {
    label: t('menu.title'),
    prop: 'title',
    type: 'elInput',
    attrs: { placeholder: t('placeholder.input') },
  },
  {
    label: t('menu.path'),
    prop: 'path',
    type: 'elInput',
    attrs: { placeholder: t('placeholder.input') },
  },
  {
    label: t('menu.type'),
    prop: 'type',
    type: 'elSelect',
    attrs: {
      placeholder: t('placeholder.select'),
      options: [
        { label: t('menu.directory'), value: 'directory' },
        { label: t('menu.menu'), value: 'menu' },
        { label: t('menu.button'), value: 'button' },
      ],
    },
  },
  {
    label: t('menu.status'),
    prop: 'status',
    type: 'elSelect',
    attrs: {
      placeholder: t('placeholder.select'),
      options: [
        { label: t('tag.enabled'), value: 'active' },
        { label: t('tag.disabled'), value: 'inactive' },
      ],
    },
  },
])

// 表格列配置
const columns = ref([
  { label: t('menu.title'), prop: 'title', minWidth: 200 },
  { label: t('menu.path'), prop: 'path', minWidth: 250 },
  { label: t('menu.type'), prop: 'type', minWidth: 100 },
  { label: t('menu.icon'), prop: 'icon', minWidth: 100 },
  { label: t('menu.sort'), prop: 'order', minWidth: 100 },
  { label: t('menu.status'), prop: 'status', minWidth: 100 },
  { label: t('user.createdAt'), prop: 'createTime', minWidth: 180 },
  { label: t('user.actions'), prop: 'operation', width: 150, fixed: 'right' },
])

// 菜单列表
const menuList = ref<IMenuItem[]>([])
const loading = ref(false)

// 获取菜单列表
const getMenuList = async (queryForm: Record<string, unknown>) => {
  loading.value = true
  try {
    await delay(1000)
    const { data: res } = await menuPage(queryForm)
    if (res.code !== 200) return
    menuList.value = res.data || []
  } finally {
    loading.value = false
  }
}

// 删除菜单
const deleteMenuHandle = async (id: string) => {
  const { data: res } = await deleteMenu(id)
  if (res.code !== 200) return
  ElMessage.success(t('message.deleteSuccess'))
  refreshHandle()
}

// 刷新数据的方法
const refreshHandle = () => {
  basePageRef.value?.refreshCurrentPage()
}
</script>

<style></style>
