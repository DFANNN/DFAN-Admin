<template>
  <!-- 用户信息面板 -->
  <el-card shadow="never" class="user-main-panel">
    <div class="flex items-center justify-between flex-col xl:flex-row gap-8 mt-4">
      <div class="flex items-center gap-2 flex-col md:flex-row md:gap-8">
        <HoverAnimateWrapper name="flip">
          <div class="relative shrink-0">
            <el-avatar :size="110" :src="userStore.userInfo?.avatar" />
            <div
              class="absolute h-5 w-5 bottom-2 right-2 rounded-full border-3 border-(--el-bg-color) bg-(--el-color-success)"
            ></div>
          </div>
        </HoverAnimateWrapper>

        <div class="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
          <div class="flex items-center gap-2">
            <TextEllipsis
              :text="userStore.userInfo?.name! || userStore.userInfo?.username!"
              :clickable="false"
              class="text-2xl font-extrabold"
            />
            <data>
              <IconButton icon="HOutline:CheckBadgeIcon" type="primary" tooltip="实名认证用户" />
            </data>
            <div
              class="shrink-0 p-3 py-1 rounded-sm text-[11px] text-(--el-color-primary) bg-(--el-color-primary-light-9)"
            >
              {{ userStore.userRoleName }}
            </div>
          </div>
          <TextEllipsis
            :text="`“ ${userStore.userInfo?.bio} ”`"
            class="italic text-sm text-(--el-text-color-regular)"
          />
          <div
            class="flex items-center gap-2 text-sm font-semibold px-3 py-2 text-(--el-text-color-primary) bg-(--el-bg-color-page) rounded-lg"
          >
            <el-icon>
              <component
                :is="menuStore.iconComponents['HOutline:MapPinIcon']"
                class="text-indigo-500"
              />
            </el-icon>
            <span class="text-xs"
              >{{ userStore.address.country }} · {{ userStore.address.region }} ·
              {{ userStore.address.city }}</span
            >
          </div>
        </div>
      </div>
      <div class="flex gap-7">
        <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-5">
          <div
            class="flex flex-col items-center gap-1 cursor-pointer hover:text-(--el-color-primary)"
          >
            <span class="text-xl font-extrabold">{{ stat.value }}</span>
            <span class="text-xs text-(--el-text-color-secondary) uppercase tracking-[1px]">{{
              stat.label
            }}</span>
          </div>
          <el-divider direction="vertical" v-if="stat !== stats[stats.length - 1]" />
        </div>
      </div>
    </div>
    <div class="mt-9 flex gap-11 justify-center xl:justify-start">
      <div
        v-for="item in userStore.menuTabs"
        :key="item.id"
        class="relative py-4 text-sm font-semibold text-(--el-text-color-regular) cursor-pointer flex items-center gap-2 hover:text-(--el-color-primary)"
        :class="{ active: userStore.currentTab === item.id }"
        @click="userStore.currentTab = item.id"
      >
        <el-icon size="18">
          <component :is="menuStore.iconComponents[item.icon]" />
        </el-icon>
        <span class="hidden md:block">{{ item.name }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const menuStore = useMenuStore()

// 统计数据
const stats = ref([
  { label: '系统工单', value: '1,284' },
  { label: '代码质量', value: '98%' },
  { label: '负责项目', value: '15' },
])
</script>

<style scoped lang="scss">
.user-main-panel {
  border: none;
  border-radius: 1rem;
}
.active {
  color: var(--el-color-primary);
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0.25rem;
    background: var(--el-color-primary);
    border-radius: 4px 4px 0 0;
  }
}
</style>
