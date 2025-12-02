<template>
  <div></div>
</template>

<script setup lang="ts">
defineOptions({ name: 'RedirectComponent' })

const route = useRoute()
const router = useRouter()

const { params, query } = route

const path = params.path as string

// 重定向到目标路径
router.replace({
  path: '/' + path,
  query,
})
</script>

<style></style>
