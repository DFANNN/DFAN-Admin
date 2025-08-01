<template>
  <div class="login-container">
    <div class="left">左</div>
    <div class="right">
      <routerView />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.login-container {
  display: flex;
  .left {
    flex: 1;
  }
  .right {
    width: 30%;
  }
}
</style>
