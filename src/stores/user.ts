import { defineStore } from 'pinia'
import { userInfoRequest } from '@/api/login'
import { rolePage } from '@/api/role'
import { updateProfile, updatePasswordRequest, updateAvatarRequest, deleteUser } from '@/api/user'

import { ElMessage } from 'element-plus'
import router, { resetRouter } from '@/router'
import { useMenuStore } from './menu'
import { useTabsStore } from './tabs'
import defaultAvatarSvg from '@/assets/defaultAvatar.svg'
import type { IRoleItem } from '@/types/system/role'
import type { ICurrentTab, IMenuTab } from '@/types/profile'
import type {
  IUserItem,
  IUserMessageItem,
  IUpdateUserProfileParams,
  IUpdatePasswordParams,
} from '@/types/system/user'

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
  const getAddress = () => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        address.value = {
          country: data.country_name,
          region: data.region,
          city: data.city,
        }
      })
  }

  // --------------- 个人中心 ---------------

  const currentTab = ref<ICurrentTab>('personalInfo')

  // 导航菜单
  const menuTabs = ref<IMenuTab[]>([
    { id: 'personalInfo', name: '个人资料', icon: 'HOutline:UserIcon' },
    { id: 'projects', name: '我的项目', icon: 'HOutline:Square3Stack3DIcon' },
    { id: 'permissions', name: '我的权限', icon: 'HOutline:ShieldCheckIcon' },
    { id: 'logs', name: '登录日志', icon: 'HOutline:ListBulletIcon' },
    { id: 'settings', name: '修改资料', icon: 'HOutline:Cog6ToothIcon' },
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

  onMounted(() => {
    getAddress()
  })

  // --------------- 个人中心 (旧的) ---------------

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
    {
      id: '10',
      title: '数据库性能优化通知',
      content: '系统将在今晚 23:00 进行数据库性能优化，期间部分服务可能会出现短暂波动，请您谅解。',
      type: 'system',
      read: false,
      time: '2024-01-15 09:10:00',
    },
    {
      id: '11',
      title: '服务网络升级',
      content: '为提升访问速度，我们将于本周内进行网络带宽扩容，升级期间不影响正常使用。',
      type: 'system',
      read: false,
      time: '2024-01-14 18:40:00',
    },
    {
      id: '12',
      title: '隐私政策更新',
      content: '我们的隐私政策已于今日更新，请前往设置中心查看最新内容。',
      type: 'system',
      read: false,
      time: '2024-01-14 09:30:00',
    },
    {
      id: '13',
      title: '系统版本升级公告',
      content: '系统已升级至 V2.1.0，带来更稳定的体验及多项功能优化。',
      type: 'system',
      read: false,
      time: '2024-01-13 18:00:00',
    },
    {
      id: '14',
      title: 'API 调用限制调整',
      content: '由于系统策略调整，部分 API 的调用限制已变更，请查看文档以了解最新规则。',
      type: 'system',
      read: true,
      time: '2024-01-13 12:50:00',
    },
    {
      id: '15',
      title: '缓存系统更新',
      content: '我们已完成缓存系统的升级，数据读取速度和稳定性将得到显著提升。',
      type: 'system',
      read: true,
      time: '2024-01-12 11:20:00',
    },
    {
      id: '16',
      title: '账号安全通知',
      content: '近期检测到异常登录行为增多，建议所有用户开启登录提醒并启用双重认证。',
      type: 'system',
      read: false,
      time: '2024-01-12 08:45:00',
    },
    {
      id: '17',
      title: '功能调整说明',
      content: '由于使用率较低，系统将于本月底下线旧版数据导出功能，请尽快迁移至新版导出工具。',
      type: 'system',
      read: false,
      time: '2024-01-11 19:00:00',
    },
    {
      id: '18',
      title: '消息通知优化',
      content: '我们优化了消息推送机制，现在可以更快地接收到系统和业务通知。',
      type: 'system',
      read: true,
      time: '2024-01-11 09:40:00',
    },
    {
      id: '19',
      title: '异常故障恢复通知',
      content: '今日上午发生的短暂访问异常已全部修复，当前系统运行正常，感谢您的理解。',
      type: 'system',
      read: false,
      time: '2024-01-10 18:10:00',
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

  // 修改密码
  const updatePassword = async (data: IUpdatePasswordParams) => {
    const { data: res } = await updatePasswordRequest(data)
    if (res.code !== 200) return
    ElMessage.success('修改密码成功,请重新登录')
    setTimeout(() => logout(), 1000)
  }

  return {
    userInfo,
    roleList,
    userMessages,
    unreadCount,
    currentMenu,
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
  }
})
