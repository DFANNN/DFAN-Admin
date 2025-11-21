import request from '@/utils/request'

export const login = () => {
  return request.get('/login')
}
