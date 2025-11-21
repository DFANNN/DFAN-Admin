import request from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  code: number
  message: string
  success: boolean
  data: {
    token: string
    user: {
      id: string
      username: string
      name?: string
      email?: string
      [key: string]: unknown
    }
  }
}

export const login = (params: LoginParams) => {
  return request.post<LoginResponse>('/login', params)
}
