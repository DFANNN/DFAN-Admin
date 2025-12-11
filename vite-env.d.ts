interface ImportMetaEnv {
  // 静态资源URL
  readonly VITE_APP_STATIC_URL: string
  // 接口基础URL
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
