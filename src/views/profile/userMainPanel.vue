<!-- 用户信息面板 -->
<template>
  <BaseCard>
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
          <el-statistic :value="stat.value" :title="stat.label" class="text-center">
            <template #suffix v-if="stat.label === '代码质量'">%</template>
          </el-statistic>
          <el-divider direction="vertical" v-if="stat !== stats[stats.length - 1]" />
        </div>
      </div>
    </div>
    <div class="mt-9 flex justify-center xl:justify-start">
      <div class="max-w-full">
        <BadgeTabsMenu
          v-model="userStore.currentTab"
          :icon-only="menuStore.isMobile ? true : false"
          :tabs-menu-data="userStore.menuTabs"
        />
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const menuStore = useMenuStore()

// 统计数据
const stats = ref([
  { label: '系统工单', value: 1284 },
  { label: '代码质量', value: 98 },
  { label: '负责项目', value: 15 },
])
</script>

<style scoped lang="scss">
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
