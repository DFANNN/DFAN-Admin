<template>
  <!-- 快捷方式 -->
  <el-card class="project-section-card" shadow="never">
    <template #header>
      <div class="flex items-center gap-3">
        <el-icon class="header-icon">
          <component :is="menuStore.iconComponents['HOutline:WrenchScrewdriverIcon']" />
        </el-icon>
        <span>便捷工具</span>
      </div>
    </template>
    <div class="grid grid-cols-4 gap-4">
      <div
        v-for="item in shortcuts"
        :key="item.label"
        @click="router.push({ name: item.routerName })"
      >
        <HoverAnimateWrapper name="jelly" intensity="normal">
          <div
            class="group flex flex-col items-center gap-3 py-3 rounded-2xl transition-all duration-300 hover:bg-(--el-bg-color-page)"
          >
            <div
              class="w-14 h-14 bg-(--el-bg-color-page) flex items-center justify-center rounded-2xl transition-all duration-300 group-hover:bg-(--el-bg-color)"
            >
              <el-icon size="26" :style="{ color: item.color }">
                <component :is="menuStore.iconComponents[item.icon]" />
              </el-icon>
            </div>
            <div class="text-[13px] font-bold">
              {{ item.label }}
            </div>
          </div>
        </HoverAnimateWrapper>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
const router = useRouter()
const menuStore = useMenuStore()

const shortcuts = ref([
  { label: '分析', icon: 'HOutline:ChartBarIcon', color: '#ef4444', routerName: 'AnalysisView' },
  { label: '监控', icon: 'HOutline:EyeIcon', color: '#4f46e5', routerName: 'MonitorView' },
  { label: '用户', icon: 'HOutline:UserGroupIcon', color: '#f59e0b', routerName: 'UserView' },
  { label: '角色', icon: 'HOutline:IdentificationIcon', color: '#10b981', routerName: 'RoleView' },
  { label: '菜单', icon: 'HOutline:ListBulletIcon', color: '#ec4899', routerName: 'MenuView' },
  { label: '按钮', icon: 'HOutline:HandRaisedIcon', color: '#8b5cf6', routerName: 'ButtonView' },
  { label: '弹窗', icon: 'HOutline:WindowIcon', color: '#06b6d4', routerName: 'DialogView' },
  { label: '图标', icon: 'HOutline:SwatchIcon', color: '#f97316', routerName: 'IconSelectorView' },
])
</script>

<style scoped lang="scss">
.header-icon {
  font-size: 1.25rem;
  color: var(--el-color-primary);
}
.project-section-card {
  border: none;
  border-radius: 1rem;
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-extra-light);
}
</style>
