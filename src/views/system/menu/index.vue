<template>
  <div>
    <el-card shadow="never" class="card-clear-mb">
      <el-form :model="queryForm" label-width="auto" ref="queryFormRef" @keyup.enter="getMenuList">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="5">
            <el-form-item label="菜单标题" prop="title">
              <el-input v-model="queryForm.title" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="5">
            <el-form-item label="菜单路径" prop="path">
              <el-input v-model="queryForm.path" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="5">
            <el-form-item label="类型" prop="type">
              <el-select v-model="queryForm.type" placeholder="请选择">
                <el-option label="目录" value="directory" />
                <el-option label="菜单" value="menu" />
                <el-option label="按钮" value="button" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="5">
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryForm.status" placeholder="请选择">
                <el-option label="启用" value="active" />
                <el-option label="禁用" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="4">
            <el-form-item>
              <el-button type="primary" :icon="menuStore.iconComponents.Search" @click="getMenuList"
                >搜索</el-button
              >
              <el-button :icon="menuStore.iconComponents.Refresh" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="card-mt-16">
      <div class="operation-container">
        <el-button
          type="primary"
          :icon="menuStore.iconComponents.Plus"
          @click="menuCreateRef?.showDialog(undefined)"
          v-permission="['menu:add']"
          >新增菜单</el-button
        >
      </div>
      <el-table
        v-loading="loading"
        :data="filteredMenuList"
        :border="TABLE_CONFIG.border"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        default-expand-all
        show-overflow-tooltip
      >
        <el-table-column
          prop="title"
          label="菜单标题"
          min-width="200"
          :align="TABLE_CONFIG.align"
        />
        <el-table-column prop="path" label="菜单路径" min-width="250" :align="TABLE_CONFIG.align" />
        <el-table-column prop="type" label="类型" min-width="100" :align="TABLE_CONFIG.align">
          <template #default="{ row }">
            <BaseTag v-if="row.type === 'directory'" type="info" text="目录" />
            <BaseTag v-else-if="row.type === 'menu'" type="primary" text="菜单" />
            <BaseTag v-else-if="row.type === 'button'" type="warning" text="按钮" />
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" min-width="100" :align="TABLE_CONFIG.align">
          <template #default="{ row }">
            <el-icon v-if="row.icon">
              <component :is="menuStore.iconComponents[row.icon]" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="order" label="排序" min-width="100" :align="TABLE_CONFIG.align" />
        <el-table-column prop="status" label="状态" min-width="100" :align="TABLE_CONFIG.align">
          <template #default="{ row }">
            <BaseTag
              :type="row.status === 'active' ? 'success' : 'danger'"
              :text="row.status === 'active' ? '启用' : '禁用'"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          min-width="180"
          :align="TABLE_CONFIG.align"
        />
        <el-table-column label="操作" width="150" fixed="right" :align="TABLE_CONFIG.align">
          <template #default="{ row }: { row: IMenuItem }">
            <el-button
              type="primary"
              link
              :icon="menuStore.iconComponents.Edit"
              @click="menuCreateRef?.showDialog(row.id)"
              v-permission="['menu:edit']"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定要删除选中的菜单吗？"
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
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <MenuCreate ref="menuCreateRef" @refresh="refresh" />
  </div>
</template>

<script setup lang="ts">
import { menuPage, deleteMenu } from '@/api/menu'
import { TABLE_CONFIG, POPCONFIRM_CONFIG } from '@/config/elementConfig'
import MenuCreate from '@/views/system/menu/create.vue'
import type { FormInstance } from 'element-plus'
import type { IMenuItem } from '@/types/system/menu'

defineOptions({ name: 'MenuView' })

const menuStore = useMenuStore()
const queryFormRef = useTemplateRef<FormInstance>('queryFormRef')
const menuCreateRef = useTemplateRef<InstanceType<typeof MenuCreate> | null>('menuCreateRef')

// 加载中
const loading = ref(false)

// 查询表单
const queryForm = ref({
  title: '',
  path: '',
  type: '',
  status: '',
})

// 菜单列表
const menuList = ref<IMenuItem[]>([])

// 过滤后的菜单列表
const filteredMenuList = computed(() => {
  let filtered = menuList.value

  if (queryForm.value.title) {
    const filterByTitle = (menus: IMenuItem[]): IMenuItem[] => {
      return menus
        .map((menu) => {
          const matches = menu.title.includes(queryForm.value.title)
          const children = menu.children ? filterByTitle(menu.children) : undefined
          if (matches || (children && children.length > 0)) {
            return {
              ...menu,
              children: children && children.length > 0 ? children : menu.children,
            } as IMenuItem
          }
          return null
        })
        .filter((menu): menu is IMenuItem => menu !== null)
    }
    filtered = filterByTitle(filtered)
  }

  if (queryForm.value.path) {
    const filterByPath = (menus: IMenuItem[]): IMenuItem[] => {
      return menus
        .map((menu) => {
          const matches = menu.path.includes(queryForm.value.path)
          const children = menu.children ? filterByPath(menu.children) : undefined
          if (matches || (children && children.length > 0)) {
            return {
              ...menu,
              children: children && children.length > 0 ? children : menu.children,
            } as IMenuItem
          }
          return null
        })
        .filter((menu): menu is IMenuItem => menu !== null)
    }
    filtered = filterByPath(filtered)
  }

  if (queryForm.value.type) {
    const filterByType = (menus: IMenuItem[]): IMenuItem[] => {
      return menus
        .map((menu) => {
          const matches = menu.type === queryForm.value.type
          const children = menu.children ? filterByType(menu.children) : undefined
          if (matches || (children && children.length > 0)) {
            return {
              ...menu,
              children: children && children.length > 0 ? children : menu.children,
            } as IMenuItem
          }
          return null
        })
        .filter((menu): menu is IMenuItem => menu !== null)
    }
    filtered = filterByType(filtered)
  }

  if (queryForm.value.status) {
    const filterByStatus = (menus: IMenuItem[]): IMenuItem[] => {
      return menus
        .map((menu) => {
          const matches = menu.status === queryForm.value.status
          const children = menu.children ? filterByStatus(menu.children) : undefined
          if (matches || (children && children.length > 0)) {
            return {
              ...menu,
              children: children && children.length > 0 ? children : menu.children,
            } as IMenuItem
          }
          return null
        })
        .filter((menu): menu is IMenuItem => menu !== null)
    }
    filtered = filterByStatus(filtered)
  }

  return filtered
})

// 获取菜单列表
const getMenuList = async () => {
  loading.value = true
  try {
    const { data: res } = await menuPage()
    if (res.code !== 200) return
    menuList.value = res.data || []
  } finally {
    loading.value = false
  }
}

// 重置查询表单
const reset = () => {
  queryFormRef.value?.resetFields()
}

// 删除菜单
const deleteMenuHandle = async (id: string) => {
  const { data: res } = await deleteMenu(id)
  if (res.code !== 200) return
  ElMessage.success('删除成功')
  getMenuList()
}

// 刷新
const refresh = () => {
  getMenuList()
}

onMounted(() => {
  getMenuList()
})
</script>

<style></style>
