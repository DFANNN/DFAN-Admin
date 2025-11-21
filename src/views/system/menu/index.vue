<template>
  <div class="menu-container">
    <el-card shadow="never">
      <!-- 搜索和操作栏 -->
      <div class="toolbar">
        <div class="search-form">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入菜单标题"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-input
            v-model="searchForm.path"
            placeholder="请输入菜单路径"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select
            v-model="searchForm.type"
            placeholder="请选择类型"
            clearable
            style="width: 150px"
          >
            <el-option label="目录" value="directory" />
            <el-option label="菜单" value="menu" />
            <el-option label="按钮" value="button" />
          </el-select>
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </div>
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增菜单</el-button>
      </div>

      <!-- 菜单树形表格 -->
      <el-table
        v-loading="loading"
        :data="filteredMenuList"
        border
        style="width: 100%; margin-top: 16px"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        default-expand-all
      >
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.type === 'directory'" type="info">目录</el-tag>
            <el-tag v-else-if="row.type === 'menu'" type="primary">菜单</el-tag>
            <el-tag v-else-if="row.type === 'button'" type="warning">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="菜单标题" min-width="200" />
        <el-table-column prop="path" label="菜单路径" min-width="200">
          <template #default="{ row }">
            <span v-if="row.path">{{ row.path }}</span>
            <span v-else style="color: var(--el-text-color-placeholder)">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" width="120" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.icon">
              <component :is="menuStore.iconComponents[row.icon]" />
            </el-icon>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="order" label="排序" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'active'" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules as FormRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type" @change="handleTypeChange">
            <el-radio label="directory">目录</el-radio>
            <el-radio label="menu">菜单</el-radio>
            <el-radio label="button">按钮</el-radio>
          </el-radio-group>
          <div class="form-tip">
            <span v-if="formData.type === 'directory'">目录用于组织菜单结构，路径可选</span>
            <span v-else-if="formData.type === 'menu'">菜单对应实际路由，路径必填</span>
            <span v-else-if="formData.type === 'button'">按钮用于权限控制，路径可选</span>
          </div>
        </el-form-item>
        <el-form-item label="父菜单" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="parentMenuOptions"
            :props="{ label: 'title', value: 'id', children: 'children' }"
            placeholder="请选择父菜单（不选则为顶级菜单）"
            clearable
            check-strictly
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="菜单标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入菜单标题" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="path" :required="formData.type === 'menu'">
          <el-input
            v-model="formData.path"
            :placeholder="
              formData.type === 'menu'
                ? '请输入菜单路径，如：/layout/home'
                : '请输入菜单路径（可选）'
            "
          />
        </el-form-item>
        <el-form-item v-if="formData.type === 'button'" label="权限标识" prop="permission">
          <el-input
            v-model="formData.permission"
            placeholder="请输入权限标识，如：system:user:add"
          />
          <div class="form-tip">用于权限控制，格式建议：模块:功能:操作</div>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <div class="icon-selector-wrapper">
            <el-input v-model="formData.icon" placeholder="请选择图标或输入图标名称" clearable>
              <template #prefix>
                <el-icon v-if="formData.icon && menuStore.iconComponents[formData.icon]">
                  <component :is="menuStore.iconComponents[formData.icon]" />
                </el-icon>
              </template>
            </el-input>
            <el-button :icon="Search" @click="iconSelectorVisible = true">选择图标</el-button>
          </div>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="formData.order" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 图标选择器对话框 -->
    <el-dialog
      v-model="iconSelectorVisible"
      title="选择图标"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="icon-selector">
        <el-input
          v-model="iconSearchText"
          placeholder="搜索图标名称"
          clearable
          style="margin-bottom: 16px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <div class="icon-list">
          <div
            v-for="iconName in filteredIconNames"
            :key="iconName"
            class="icon-item"
            :class="{ active: formData.icon === iconName }"
            @click="handleSelectIcon(iconName)"
          >
            <el-icon :size="24">
              <component :is="menuStore.iconComponents[iconName]" />
            </el-icon>
            <div class="icon-name">{{ iconName }}</div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="iconSelectorVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useMenuStore } from '@/stores/menu'
import {
  getMenuList,
  createMenu,
  updateMenu,
  deleteMenu,
  type Menu,
  type MenuType,
  type CreateMenuParams,
  type UpdateMenuParams,
} from '@/api/menu'

defineOptions({ name: 'MenuView' })

const menuStore = useMenuStore()

// 搜索表单
const searchForm = reactive<{
  title: string
  path: string
  type: MenuType | ''
  status: 'active' | 'inactive' | ''
}>({
  title: '',
  path: '',
  type: '',
  status: '',
})

// 菜单列表
const menuList = ref<Menu[]>([])
const loading = ref(false)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增菜单')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = useTemplateRef<FormInstance>('formRef')

// 图标选择器
const iconSelectorVisible = ref(false)
const iconSearchText = ref('')

// 获取所有图标名称
const allIconNames = computed(() => {
  return Object.keys(menuStore.iconComponents).sort()
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
const handleSelectIcon = (iconName: string) => {
  formData.icon = iconName
  iconSelectorVisible.value = false
  ElMessage.success(`已选择图标: ${iconName}`)
}

// 表单数据
const formData = reactive<{
  type: MenuType
  title: string
  path: string
  icon: string
  parentId: string | null
  order: number
  status: 'active' | 'inactive'
  permission: string
}>({
  type: 'menu',
  title: '',
  path: '',
  icon: '',
  parentId: null,
  order: 0,
  status: 'active',
  permission: '',
})

// 当前编辑的菜单ID
let currentEditId: string | null = null

// 表单验证规则（动态）
const formRules = computed<FormRules>(() => {
  const rules: FormRules = {
    type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
    title: [{ required: true, message: '请输入菜单标题', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  }

  // 根据类型动态设置path验证规则
  if (formData.type === 'menu') {
    rules.path = [{ required: true, message: '菜单类型的路径不能为空', trigger: 'blur' }]
  } else {
    rules.path = []
  }

  return rules
})

// 类型改变时的处理
const handleTypeChange = () => {
  // 如果切换到button类型，清空path（可选）
  if (formData.type === 'button' && !formData.path) {
    // path可以为空
  }
  // 如果切换到menu类型，确保有path
  if (formData.type === 'menu' && !formData.path) {
    // 提示用户需要填写path
  }
  // 清除验证状态
  formRef.value?.clearValidate('path')
}

// 父菜单选项（用于树形选择器，排除当前编辑的菜单及其子菜单）
const parentMenuOptions = computed(() => {
  const buildOptions = (menus: Menu[], excludeId?: string): Menu[] => {
    return menus
      .filter((menu) => menu.id !== excludeId)
      .map((menu) => {
        const option: Menu = {
          ...menu,
          children: menu.children ? buildOptions(menu.children, excludeId) : undefined,
        }
        return option
      })
  }
  return buildOptions(menuList.value, currentEditId || undefined)
})

// 过滤后的菜单列表
const filteredMenuList = computed(() => {
  let filtered = menuList.value

  if (searchForm.title) {
    const filterByTitle = (menus: Menu[]): Menu[] => {
      return menus
        .map((menu) => {
          const matches = menu.title.includes(searchForm.title)
          const children = menu.children ? filterByTitle(menu.children) : undefined
          if (matches || (children && children.length > 0)) {
            return {
              ...menu,
              children: children && children.length > 0 ? children : menu.children,
            } as Menu
          }
          return null
        })
        .filter((menu): menu is Menu => menu !== null)
    }
    filtered = filterByTitle(filtered)
  }

  if (searchForm.path) {
    const filterByPath = (menus: Menu[]): Menu[] => {
      return menus
        .map((menu) => {
          const matches = menu.path.includes(searchForm.path)
          const children = menu.children ? filterByPath(menu.children) : undefined
          if (matches || (children && children.length > 0)) {
            return {
              ...menu,
              children: children && children.length > 0 ? children : menu.children,
            } as Menu
          }
          return null
        })
        .filter((menu): menu is Menu => menu !== null)
    }
    filtered = filterByPath(filtered)
  }

  if (searchForm.type) {
    const filterByType = (menus: Menu[]): Menu[] => {
      return menus
        .map((menu) => {
          const matches = menu.type === searchForm.type
          const children = menu.children ? filterByType(menu.children) : undefined
          if (matches || (children && children.length > 0)) {
            return {
              ...menu,
              children: children && children.length > 0 ? children : menu.children,
            } as Menu
          }
          return null
        })
        .filter((menu): menu is Menu => menu !== null)
    }
    filtered = filterByType(filtered)
  }

  if (searchForm.status) {
    const filterByStatus = (menus: Menu[]): Menu[] => {
      return menus
        .map((menu) => {
          const matches = menu.status === searchForm.status
          const children = menu.children ? filterByStatus(menu.children) : undefined
          if (matches || (children && children.length > 0)) {
            return {
              ...menu,
              children: children && children.length > 0 ? children : menu.children,
            } as Menu
          }
          return null
        })
        .filter((menu): menu is Menu => menu !== null)
    }
    filtered = filterByStatus(filtered)
  }

  return filtered
})

// 获取菜单列表
const fetchMenuList = async () => {
  loading.value = true
  try {
    const response = await getMenuList()
    const { data } = response.data
    menuList.value = data || []
  } catch (error) {
    console.error('获取菜单列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  // 搜索逻辑在 computed 中处理
}

// 重置
const handleReset = () => {
  searchForm.title = ''
  searchForm.path = ''
  searchForm.type = ''
  searchForm.status = ''
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增菜单'
  isEdit.value = false
  currentEditId = null
  resetForm()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Menu) => {
  dialogTitle.value = '编辑菜单'
  isEdit.value = true
  currentEditId = row.id
  formData.type = row.type
  formData.title = row.title
  formData.path = row.path || ''
  formData.icon = row.icon || ''
  formData.parentId = row.parentId || null
  formData.order = row.order || 0
  formData.status = row.status || 'active'
  formData.permission = row.permission || ''
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: Menu) => {
  try {
    await ElMessageBox.confirm(`确定要删除菜单 "${row.title}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteMenu(row.id)
    ElMessage.success('删除成功')
    fetchMenuList()
  } catch (error: unknown) {
    if ((error as { action?: string }).action !== 'cancel') {
      console.error('删除菜单失败:', error)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (isEdit.value && currentEditId) {
          // 更新
          const updateParams: UpdateMenuParams = {
            type: formData.type,
            title: formData.title,
            path: formData.path,
            icon: formData.icon,
            parentId: formData.parentId,
            order: formData.order,
            status: formData.status,
            permission: formData.permission || undefined,
          }
          await updateMenu(currentEditId, updateParams)
          ElMessage.success('更新成功')
        } else {
          // 新增
          const createParams: CreateMenuParams = {
            type: formData.type,
            title: formData.title,
            path: formData.path,
            icon: formData.icon,
            parentId: formData.parentId,
            order: formData.order,
            status: formData.status,
            permission: formData.permission || undefined,
          }
          await createMenu(createParams)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchMenuList()
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  formData.type = 'menu'
  formData.title = ''
  formData.path = ''
  formData.icon = ''
  formData.parentId = null
  formData.order = 0
  formData.status = 'active'
  formData.permission = ''
  formRef.value?.clearValidate()
}

// 对话框关闭
const handleDialogClose = () => {
  resetForm()
}

// 初始化
onMounted(() => {
  fetchMenuList()
})
</script>

<style scoped lang="scss">
.menu-container {
  padding: 20px;
  background: var(--el-bg-color-page);
  min-height: 100%;

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .search-form {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }
}

.form-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.icon-selector-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;

  .el-input {
    flex: 1;
  }
}

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
