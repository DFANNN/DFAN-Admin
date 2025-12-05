import { defineStore } from 'pinia'
import { userInfoRequest } from '@/api/login'
import { rolePage } from '@/api/role'
import { updateProfile, updatePasswordRequest } from '@/api/user'
import type {
  IUserItem,
  IUserMessageItem,
  IUpdateUserProfileParams,
  IUpdatePasswordParams,
} from '@/types/system/user'
import type { IRoleItem } from '@/types/system/role'
import { ElMessage } from 'element-plus'
import router, { resetRouter } from '@/router'
import { useMenuStore } from './menu'
import { useTabsStore } from './tabs'

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

  // --------------- 个人中心 ---------------

  // 当前选择的菜单
  const currentMenu = ref<string>('info')

  // 用户消息
  const userMessages = ref<IUserMessageItem[]>([
    // 系统通知
    {
      id: '1',
      title: '系统维护通知',
      content: '系统将于今晚 22:00-24:00 进行维护升级，期间可能无法访问，请提前做好准备。',
      type: 'system',
      read: false,
      time: '2024-01-15 10:30:00',
    },
    {
      id: '2',
      title: '新功能上线',
      content: '个人中心功能已上线，您可以在这里管理个人信息和查看消息通知。',
      type: 'system',
      read: false,
      time: '2024-01-14 14:20:00',
    },
    {
      id: '3',
      title: '安全提醒',
      content: '为了您的账户安全，建议定期修改密码，并启用双重验证。',
      type: 'system',
      read: true,
      time: '2024-01-13 09:15:00',
    },
    // 用户信息
    {
      id: '4',
      title: '欢迎加入',
      content: '欢迎您加入我们的系统！如有任何问题，请随时联系客服。',
      type: 'user',
      read: false,
      time: '2024-01-12 16:45:00',
    },
    {
      id: '5',
      title: '账户信息更新',
      content: '您的账户信息已成功更新，请确认信息是否正确。',
      type: 'user',
      read: true,
      time: '2024-01-11 11:30:00',
    },
    {
      id: '6',
      title: '登录提醒',
      content: '您的账户在 2024-01-10 15:20:00 从新设备登录，如非本人操作，请及时修改密码。',
      type: 'user',
      read: true,
      time: '2024-01-10 15:25:00',
    },
    // 代办事项
    {
      id: '7',
      title: '待审核订单',
      content: '您有 3 个订单待审核，请及时处理。',
      type: 'todo',
      read: false,
      time: '2024-01-15 08:00:00',
    },
    {
      id: '8',
      title: '待处理任务',
      content: '您有 5 个待处理任务，请尽快完成。',
      type: 'todo',
      read: false,
      time: '2024-01-14 13:20:00',
    },
    {
      id: '9',
      title: '会议提醒',
      content: '您有一个会议将在明天上午 10:00 开始，请提前做好准备。',
      type: 'todo',
      read: true,
      time: '2024-01-13 17:00:00',
    },
  ])

  // 未读消息数量
  const unreadCount = computed(() => {
    return userMessages.value.filter((msg) => !msg.read).length
  })

  // 标记消息为已读
  const markAsRead = (id: string) => {
    const message = userMessages.value.find((msg) => msg.id === id)
    if (message) message.read = true
  }

  // 删除消息
  const deleteMessage = (id: string) => {
    const index = userMessages.value.findIndex((msg) => msg.id === id)
    if (index !== -1) userMessages.value.splice(index, 1)
  }

  // 全部标记为已读
  const markAllAsRead = () => {
    userMessages.value.forEach((msg) => {
      if (!msg.read) msg.read = true
    })
  }

  // 全部删除消息
  const deleteAllMessages = () => {
    userMessages.value = []
  }

  // 修改用户个人信息
  const updateUserProfile = async (data: IUpdateUserProfileParams) => {
    const { data: res } = await updateProfile(data)
    if (res.code !== 200) return
    getUserInfo()
    ElMessage.success('修改个人信息成功')
  }

  // 修改密码
  const updatePassword = async (data: IUpdatePasswordParams) => {
    const { data: res } = await updatePasswordRequest(data)
    if (res.code !== 200) return
    ElMessage.success('修改密码成功,请重新登录')
    setTimeout(() => logout(), 1000)
  }

  // 退出登录
  const logout = () => {
    localStorage.removeItem('token')
    const menuStore = useMenuStore()
    const tabsStore = useTabsStore()
    menuStore.clearUserPermissions()
    clearUserInfo()
    tabsStore.clearTabs()
    resetRouter()
    router.replace('/login')
    console.log(`output->`, router.getRoutes())
  }

  return {
    userInfo,
    roleList,
    userMessages,
    unreadCount,
    currentMenu,
    getUserInfo,
    clearUserInfo,
    getUserRoleName,
    markAsRead,
    deleteMessage,
    markAllAsRead,
    deleteAllMessages,
    updateUserProfile,
    updatePassword,
    logout,
  }
})
