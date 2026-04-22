import { defineStore } from 'pinia'
import { userInfoRequest } from '@/api/login'
import { rolePage } from '@/api/role'
import { updateProfile, updatePasswordRequest, updateAvatarRequest, deleteUser } from '@/api/user'
import { ElMessage } from 'element-plus'
import router, { resetRouter } from '@/router'
import { useMenuStore } from './menu'
import { useTabsStore } from './tabs'
import defaultAvatarSvg from '@/assets/defaultAvatar.svg'
import defaultSystemAvatar from '@/assets/images/defaultSystemAvatar.svg'
import type { IRoleItem } from '@/types/system/role'
import type { ICurrentTab, ITabsMenuData } from '@/types/profile'
import type {
  IUserItem,
  IUserMessageItem,
  IUpdateUserProfileParams,
  IUpdatePasswordParams,
} from '@/types/system/user'
import dayjs from 'dayjs'

export const useUserStore = defineStore('user', () => {
  // 默认头像占位
  const defaultAvatarImg = ref(defaultAvatarSvg)
  // 用户信息
  const userInfo = ref<IUserItem | null>(null)

  // 角色信息
  const roleList = ref<IRoleItem[]>([])

  // 用户角色名称
  const userRoleName = computed(() => {
    return roleList.value.find((role) => role.id === userInfo.value?.roleId)?.name ?? '无权限'
  })

  // 地址信息
  const address = ref({
    country: '',
    region: '',
    city: '',
  })

  // 获取用户信息
  const getUserInfo = async () => {
    const { data: res } = await userInfoRequest()
    if (res.code !== 200) return
    userInfo.value = res.data
    userInfo.value.bio = userInfo.value.bio || '这个人很懒，什么都没留下~'
    if (!userInfo.value?.avatar) {
      userInfo.value.avatar = defaultAvatarImg.value
    }
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

  // 修改头像
  const updateAvatar = async (avatar: string) => {
    const { data: res } = await updateAvatarRequest({ avatar })
    if (res.code !== 200) return
    getUserInfo()
    ElMessage.success('修改头像成功')
  }

  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null
  }

  // 获取地址信息
  const getAddress = async () => {
    const ipRes = await fetch('https://ipapi.co/json/').then((res) => res.json())
    address.value = {
      country: ipRes.country_name,
      region: ipRes.region,
      city: ipRes.city,
    }
  }

  // --------------- 个人中心 ---------------

  const currentTab = ref<ICurrentTab>('personalInfo')

  // 导航菜单
  const menuTabs = ref<ITabsMenuData[]>([
    { key: 'personalInfo', label: '我的资料', icon: 'HOutline:UserIcon' },
    { key: 'projects', label: '我的项目', icon: 'HOutline:Square3Stack3DIcon' },
    { key: 'permissions', label: '我的权限', icon: 'HOutline:ShieldCheckIcon' },
    { key: 'messages', label: '我的消息', icon: 'HOutline:BellAlertIcon' },
    { key: 'logs', label: '登录日志', icon: 'HOutline:ClockIcon' },
  ])

  // 修改用户个人信息
  const updateUserProfile = async (data: IUpdateUserProfileParams) => {
    const { data: res } = await updateProfile(data)
    if (res.code !== 200) return
    getUserInfo()
    ElMessage.success('修改个人资料成功')
  }

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  // 注销用户
  const deleteUserAccount = async () => {
    const { data: res } = await deleteUser([userInfo.value!.id])
    if (res.code !== 200) return
    ElMessage.success('注销账户成功,2秒后跳转至登录页面...')
    await delay(2000)
    logout()
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
  }

  // 用户消息
  const userMessages = ref<IUserMessageItem[]>([
    {
      id: '1',
      title: '系统维护通知',
      content: '系统将于今晚 22:00-24:00 进行维护升级，期间可能无法访问，请提前做好准备。',
      type: 'system',
      read: false,
      time: '2026-01-22 08:30:00',
      avatar: defaultSystemAvatar,
    },
    {
      id: '2',
      title: 'David Fan',
      content: '今天的任务清单已经更新，别忘了先喝一杯水💧再开工哦！',
      type: 'user',
      read: false,
      time: '2026-01-22 08:45:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    },
    {
      id: '3',
      title: '新功能上线',
      content: '个人中心功能已上线，您可以管理个人信息和查看消息通知。',
      type: 'system',
      read: false,
      time: '2026-01-21 17:20:00',
      avatar: defaultSystemAvatar,
    },
    {
      id: '4',
      title: 'Alice L.',
      content: '你的排行榜进度更新了，你现在是第 2 名，冲呀！🏆',
      type: 'user',
      read: true,
      time: '2026-01-21 16:10:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AliceL',
    },
    {
      id: '5',
      title: '安全提醒',
      content: '请定期修改密码，并启用双重验证，保护账户安全。',
      type: 'system',
      read: true,
      time: '2026-01-21 09:30:00',
      avatar: defaultSystemAvatar,
    },
    {
      id: '6',
      title: 'Bob T.',
      content: '刚完成了你的好友排行榜更新，你现在是第 3 名，加油！🚀',
      type: 'user',
      read: false,
      time: '2026-01-20 14:25:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BobT',
    },
    {
      id: '7',
      title: 'Charlie W.',
      content: '今天运气不错，收到了系统送的隐藏小彩蛋🎁，快去看看吧！',
      type: 'user',
      read: false,
      time: '2026-01-20 10:15:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CharlieW',
    },
    {
      id: '8',
      title: '数据库性能优化通知',
      content: '系统将在今晚 23:00 进行数据库性能优化，期间部分服务可能会出现短暂波动。',
      type: 'system',
      read: false,
      time: '2026-01-19 18:10:00',
      avatar: defaultSystemAvatar,
    },
    {
      id: '9',
      title: 'Eve K.',
      content: '别忘了今天下午的团队茶歇☕，顺便检查看看谁偷吃了蛋糕😂',
      type: 'user',
      read: false,
      time: '2026-01-19 15:45:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EveK',
    },
    {
      id: '10',
      title: '服务网络升级',
      content: '为提升访问速度，我们将于本周内进行网络带宽扩容，升级期间不影响正常使用。',
      type: 'system',
      read: false,
      time: '2026-01-18 09:50:00',
      avatar: defaultSystemAvatar,
    },
    {
      id: '11',
      title: 'Frank H.',
      content: '你的收藏夹里新增了一个神秘物品🔮，快去查看吧！',
      type: 'user',
      read: true,
      time: '2026-01-18 08:40:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FrankH',
    },
    {
      id: '12',
      title: 'Grace M.',
      content: '系统提醒：别忘了今天的运动计划🏃‍♀️，保持健康，保持快乐！',
      type: 'user',
      read: false,
      time: '2026-01-17 19:00:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GraceM',
    },
  ])

  // 发送消息
  const sendMessage = (message: string) => {
    userMessages.value.unshift({
      id: String(userMessages.value.length + 1),
      title: userInfo.value?.name || userInfo.value?.username || '未知用户',
      content: message,
      type: 'user',
      read: false,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      avatar: userInfo.value?.avatar || defaultSystemAvatar,
    })
  }

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

  // 修改密码
  const updatePassword = async (data: IUpdatePasswordParams) => {
    const { data: res } = await updatePasswordRequest(data)
    if (res.code !== 200) return
    ElMessage.success('修改密码成功,即将重新登录')
    setTimeout(() => logout(), 1000)
  }

  onMounted(() => {
    getAddress()
  })

  return {
    userInfo,
    roleList,
    userMessages,
    unreadCount,
    userRoleName,
    address,
    currentTab,
    menuTabs,
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
    updateAvatar,
    deleteUserAccount,
    delay,
    sendMessage,
  }
})
