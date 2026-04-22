import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useLangStore } from '@/stores/lang'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || ''
    const langStore = useLangStore()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 将当前应用语言统一传给后端
    // Accept-Language 是标准 HTTP 头，后端通常可以直接识别。
    // X-Locale 是额外补充的业务头，便于后端在需要时做更明确的自定义处理。
    // 这里统一传递 langStore.currentLang，避免请求层与 i18n 层使用不同的语言参数。
    config.headers['Accept-Language'] = langStore.currentLang
    config.headers['X-Locale'] = langStore.currentLang

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message } = response.data

    if (code === 500) {
      ElMessage.error(message)
    }

    if (code === 401) {
      ElMessage.error('401')
    }

    return response
  },
  (error) => {
    let errorMessage = '请求失败'

    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = '未授权，请重新登录'
          localStorage.removeItem('token')
          router.push('/login')
          break
        case 403:
          errorMessage = '拒绝访问'
          break
        case 404:
          errorMessage = '请求地址不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        default:
          errorMessage = error.response.data?.message || `请求失败(${error.response.status})`
      }
    } else if (error.request) {
      errorMessage = '网络连接失败，请检查网络'
    } else {
      errorMessage = error.message || '请求失败'
    }

    ElMessage.error(errorMessage)
    return Promise.reject(error)
  },
)

// 请求方法对象
const request = {
  /**
   * GET 请求
   * @param url 请求地址
   * @param config 请求配置（可选）
   * @returns Promise<AxiosResponse>
   */
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return service.get<T>(url, config)
  },

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求体数据（可选）
   * @param config 请求配置（可选）
   * @returns Promise<AxiosResponse>
   */
  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return service.post<T>(url, data, config)
  },

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求体数据（可选）
   * @param config 请求配置（可选）
   * @returns Promise<AxiosResponse>
   */
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return service.put<T>(url, data, config)
  },

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param config 请求配置（可选）
   * @returns Promise<AxiosResponse>
   */
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return service.delete<T>(url, config)
  },
}

export default request
export { service }
