<template>
  <el-dropdown
    trigger="click"
    :show-arrow="false"
    ref="notificationDropdownRef"
    popper-class="i18n-dropdown-popper"
  >
    <HoverAnimateWrapper name="rotate">
      <IconButton icon="HOutline:GlobeAltIcon" />
    </HoverAnimateWrapper>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          :class="{ 'is-active': currentLanguage === 'CN' }"
          @click="currentLanguage = 'CN'"
        >
          <span class="language-code">CN</span>
          <span class="language-name">简体中文</span>
        </el-dropdown-item>
        <el-dropdown-item
          :class="{ 'is-active': currentLanguage === 'HK' }"
          @click="currentLanguage = 'HK'"
        >
          <span class="language-code">HK</span>
          <span class="language-name">繁体中文</span>
        </el-dropdown-item>
        <el-dropdown-item
          :class="{ 'is-active': currentLanguage === 'EN' }"
          @click="currentLanguage = 'EN'"
        >
          <span class="language-code">EN</span>
          <span class="language-name">English</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
const currentLanguage = ref<string>('CN')
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
  padding: 12px 20px;
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover {
    background: var(--el-fill-color-light) !important;
    color: var(--el-color-primary);
  }

  &:focus,
  &:focus-visible {
    background: var(--el-fill-color-light) !important;
    color: var(--el-color-primary);
  }

  &.is-active {
    background: var(--el-fill-color-light) !important;
    color: var(--el-color-primary);

    .language-code {
      color: var(--el-color-primary);
      font-weight: 700;
    }

    .language-name {
      color: var(--el-color-primary);
      font-weight: 600;
    }
  }
}

.language-code {
  font-size: 13px;
  letter-spacing: 0.5px;
  min-width: 32px;
}

.language-name {
  font-size: 14px;
  flex: 1;
}

:deep(.el-dropdown-menu__item:hover) {
  .language-code {
    color: var(--el-color-primary);
  }

  .language-name {
    color: var(--el-color-primary);
  }
}
</style>

<style lang="scss">
.i18n-dropdown-popper {
  border-radius: 8px !important;
  .el-dropdown-menu {
    border-radius: 8px !important;
  }
}
</style>
