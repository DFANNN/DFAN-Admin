import type { User } from '@/mocks/db/types'

export const DEFAULT_USERS: User[] = [
  {
    id: 'user_1',
    username: 'admin',
    password: 'admin', // 明文存储，仅用于开发测试
    name: '宇宙 Root 管理者 Rootiverse',
    email: 'admin@example.com',
    isBuiltIn: true,
    status: 'active',
    roleId: 'role_1',
    createTime: '2025-12-12 14:00:12',
    updateTime: '2025-12-12 14:00:12',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    bio: '全宇宙最强管理员，掌控一切！',
    tags: 'vue3,typescript,admin',
  },
  {
    id: 'user_2',
    username: 'user2',
    password: 'user2',
    name: '普通但不平凡的路人乙',
    email: 'user@example.com',
    isBuiltIn: true,
    status: 'active',
    roleId: 'role_2',
    createTime: '2025-12-12 14:00:12',
    updateTime: '2025-12-12 14:00:12',
  },
  {
    id: 'user_3',
    username: 'user3',
    password: 'user3',
    name: '权限被吃掉的少年',
    email: 'user3@example.com',
    isBuiltIn: true,
    status: 'active',
    roleId: 'role_3',
    createTime: '2025-12-12 14:00:12',
    updateTime: '2025-12-12 14:00:12',
  },
]
