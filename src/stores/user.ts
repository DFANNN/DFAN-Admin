import { defineStore } from 'pinia'
import { userInfoRequest } from '@/api/login'
import { rolePage } from '@/api/role'
import type { IUserItem } from '@/types/system/user'
import type { IRoleItem } from '@/types/system/role'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<IUserItem | null>(null)

  // 角色信息
  const roleList = ref<IRoleItem[]>([])

  // 获取用户信息
  const getUserInfo = async () => {
    const { data: res } = await userInfoRequest()
    if (res.code !== 200) return
    userInfo.value = res.data
  }

  // 获取用户角色名称
  const getUserRoleName = async () => {
    const { data: res } = await rolePage({
      page: 1,
      pageSize: 1000,
    })
    if (res.code !== 200) return
    roleList.value = res.data?.list ?? []
  }

  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null
  }

  return {
    userInfo,
    roleList,
    getUserInfo,
    clearUserInfo,
    getUserRoleName,
  }
})
