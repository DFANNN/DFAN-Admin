<template>
  <div class="personal-center-root">
    <div class="header-banner">
      <div class="mesh-blob blob-primary"></div>
      <div class="mesh-blob blob-secondary"></div>
      <div class="mesh-blob blob-tertiary"></div>
      <div class="mesh-overlay"></div>
    </div>

    <div class="content-container">
      <div class="user-main-card animate-up">
        <div class="card-inner-top">
          <div class="left-profile">
            <div class="avatar-container">
              <img :src="userForm.avatar" alt="User Avatar" class="main-avatar" />
              <div class="online-status"></div>
            </div>
            <div class="user-identity">
              <div class="name-row">
                <h1>{{ userForm.nickname }} <span class="admin-badge">核心管理员</span></h1>
                <el-tooltip content="实名认证用户" placement="top">
                  <component :is="CheckBadgeIcon" class="h-6 w-6 text-blue-500" />
                </el-tooltip>
              </div>
              <p class="user-motto">“ {{ userForm.bio }} ”</p>
              <div class="social-tags">
                <div class="s-tag">
                  <component :is="MapPinIcon" class="h-4 w-4" /> {{ userForm.location }}
                </div>
                <div class="s-tag">
                  <component :is="LinkIcon" class="h-4 w-4" /> github.com/admin
                </div>
              </div>
            </div>
          </div>

          <div class="right-stats hidden-sm-and-down">
            <div class="stat-mini-item">
              <span class="val">1,284</span>
              <span class="lab">系统工单</span>
            </div>
            <div class="stat-mini-divider"></div>
            <div class="stat-mini-item">
              <span class="val">98%</span>
              <span class="lab">代码质量</span>
            </div>
          </div>
        </div>

        <div class="card-nav-container">
          <div class="card-nav-tabs">
            <div
              v-for="item in menuTabs"
              :key="item.id"
              :class="['nav-tab-item', { active: currentTab === item.id }]"
              @click="currentTab = item.id"
            >
              <component :is="item.icon" class="h-5 w-5" />
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <el-row :gutter="24" class="layout-body">
        <el-col :lg="7" :md="24" class="mb-5">
          <div class="sticky-sidebar">
            <div class="detail-card glass-effect animate-up">
              <div class="card-title-box">
                <component :is="IdentificationIcon" class="h-5 w-5" />
                <span>详细档案</span>
              </div>
              <div class="detail-content">
                <div class="info-cell">
                  <label>账号UID</label>
                  <span>880921203</span>
                </div>
                <div class="info-cell">
                  <label>所属机构</label>
                  <span>{{ userForm.department }}</span>
                </div>
                <div class="info-cell">
                  <label>加入时间</label>
                  <span>2022-03-15</span>
                </div>
                <div class="info-cell">
                  <label>联系邮箱</label>
                  <span>{{ userForm.email }}</span>
                </div>
              </div>
              <el-divider />
              <div class="card-title-box small">
                <span>技能专长</span>
              </div>
              <div class="skill-wrappers">
                <el-tag
                  v-for="skill in skills"
                  :key="skill.name"
                  :type="skill.type"
                  effect="plain"
                  class="custom-skill-tag"
                >
                  {{ skill.name }}
                </el-tag>
              </div>
            </div>

            <div class="detail-card glass-effect mt-24 animate-up delay-100">
              <div class="card-title-box">
                <component :is="UsersIcon" class="h-5 w-5" />
                <span>核心团队 ({{ team.length }})</span>
              </div>
              <div class="team-grid">
                <div v-for="member in team" :key="member.name" class="team-item-mini">
                  <el-avatar :size="40" :src="member.avatar" class="hover-scale" />
                  <div class="m-meta">
                    <strong>{{ member.name }}</strong>
                    <span>{{ member.role }}</span>
                  </div>
                  <el-button link class="chat-btn"
                    ><component :is="ChatBubbleLeftRightIcon" class="h-4 w-4"
                  /></el-button>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :lg="17" :md="24">
          <div v-if="currentTab === 'profile'" class="tab-content-wrapper">
            <div class="profile-settings-card glass-effect animate-up">
              <div class="s-header">
                <div class="header-left">
                  <h3>个人资料中心</h3>
                  <p>在这里管理您的头像、联系方式及账户公开信息</p>
                </div>
                <el-button type="primary" class="btn-save" @click="handleSave"
                  >保存全部更改</el-button
                >
              </div>

              <div class="profile-edit-body">
                <div class="avatar-edit-section">
                  <div class="edit-avatar-wrapper">
                    <img :src="userForm.avatar" alt="Avatar" />
                    <div class="avatar-mask">
                      <component :is="CameraIcon" class="h-6 w-6" />
                      <span>更换头像</span>
                    </div>
                  </div>
                  <div class="avatar-tips">
                    <h4>您的头像</h4>
                    <p>支持 JPG, PNG 或 GIF 格式。建议尺寸为 400x400 px。</p>
                    <el-button size="small" plain>上传新图片</el-button>
                  </div>
                </div>

                <el-divider />

                <el-form :model="userForm" label-position="top" class="custom-form">
                  <div class="form-section-title">基本信息</div>
                  <el-row :gutter="20">
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="公开昵称">
                        <el-input
                          v-model="userForm.nickname"
                          placeholder="请输入昵称"
                          :prefix-icon="UserIcon"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="电子邮箱">
                        <el-input
                          v-model="userForm.email"
                          placeholder="请输入邮箱"
                          :prefix-icon="EnvelopeIcon"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="联系电话">
                        <el-input
                          v-model="userForm.phone"
                          placeholder="请输入电话"
                          :prefix-icon="PhoneIcon"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="办公地点">
                        <el-input
                          v-model="userForm.location"
                          placeholder="例如：上海 · 张江"
                          :prefix-icon="MapPinIcon"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <div class="form-section-title mt-20">职场信息</div>
                  <el-row :gutter="20">
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="所属部门">
                        <el-select v-model="userForm.department" class="w-full">
                          <el-option label="研发中心" value="研发中心" />
                          <el-option label="产品部" value="产品部" />
                          <el-option label="市场部" value="市场部" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="职位角色">
                        <el-input v-model="userForm.role" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-form-item label="个人简介/座右铭">
                    <el-input
                      v-model="userForm.bio"
                      type="textarea"
                      :rows="4"
                      placeholder="写点什么来展示你自己..."
                    />
                  </el-form-item>
                </el-form>

                <el-divider />
                <div class="danger-zone">
                  <div class="d-text">
                    <strong>注销账户</strong>
                    <p>一旦注销，所有数据将无法恢复，请谨慎操作。</p>
                  </div>
                  <el-button type="danger" plain>立即注销</el-button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentTab === 'overview'" class="tab-content-wrapper">
            <div class="publish-container glass-effect animate-up">
              <div class="publish-header">
                <img :src="userForm.avatar" class="mini-avatar" />
                <span class="greet">Hi, {{ userForm.nickname }}，今天有什么新的技术发现？</span>
              </div>
              <el-input
                v-model="postContent"
                type="textarea"
                :rows="3"
                placeholder="在此分享技术心得或项目周报..."
                class="custom-textarea"
              />
              <div class="publish-footer">
                <div class="attach-tools">
                  <el-tooltip content="上传图片"
                    ><component :is="PhotoIcon" class="h-5 w-5 icon-btn"
                  /></el-tooltip>
                  <el-tooltip content="插入代码"
                    ><component :is="CodeBracketIcon" class="h-5 w-5 icon-btn"
                  /></el-tooltip>
                  <el-tooltip content="表情"
                    ><component :is="FaceSmileIcon" class="h-5 w-5 icon-btn"
                  /></el-tooltip>
                </div>
                <el-button type="primary" round class="btn-send">发布动态</el-button>
              </div>
            </div>

            <div class="activity-timeline mt-24">
              <div
                v-for="(act, idx) in activityList"
                :key="idx"
                class="activity-item glass-effect animate-up"
                :style="{ animationDelay: idx * 100 + 200 + 'ms' }"
              >
                <div class="act-header">
                  <el-avatar :size="44" :src="act.userAvatar" />
                  <div class="act-user-info">
                    <strong>{{ act.userName }}</strong>
                    <span>于 {{ act.time }} 发布了 {{ act.type }}</span>
                  </div>
                  <component
                    :is="EllipsisHorizontalIcon"
                    class="h-6 w-6 cursor-pointer text-gray-400"
                  />
                </div>
                <div class="act-body">
                  <p>{{ act.content }}</p>
                  <div v-if="act.image" class="act-image"><img :src="act.image" /></div>
                </div>
                <div class="act-footer">
                  <div class="f-left">
                    <span class="f-btn"
                      ><component :is="HeartIcon" class="h-5 w-5" /> {{ act.likes }}</span
                    >
                    <span class="f-btn"
                      ><component :is="ChatBubbleBottomCenterIcon" class="h-5 w-5" />
                      {{ act.comments }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentTab === 'projects'" class="tab-content-wrapper">
            <el-row :gutter="20">
              <el-col :sm="12" :xs="24" v-for="(proj, pIdx) in projects" :key="proj.name">
                <div
                  class="project-pro-card glass-effect animate-up"
                  :style="{ animationDelay: pIdx * 100 + 'ms' }"
                >
                  <div class="p-header">
                    <div
                      class="p-icon-box"
                      :style="{ background: proj.theme + '15', color: proj.theme }"
                    >
                      <component :is="proj.icon" class="h-8 w-8" />
                    </div>
                    <el-tag :type="proj.status === '进行中' ? 'primary' : 'success'" size="small">{{
                      proj.status
                    }}</el-tag>
                  </div>
                  <div class="p-body">
                    <h3>{{ proj.name }}</h3>
                    <p>{{ proj.desc }}</p>
                  </div>
                  <div class="p-progress-area">
                    <el-progress
                      :percentage="proj.progress"
                      :color="proj.theme"
                      :stroke-width="8"
                    />
                  </div>
                  <div class="p-footer">
                    <div class="p-members">
                      <el-avatar
                        v-for="m in 3"
                        :key="m"
                        :size="24"
                        :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=p${m + pIdx}`"
                      />
                    </div>
                    <el-button link type="primary"
                      >进入详情 <component :is="ArrowRightIcon" class="h-4 w-4 ml-1"
                    /></el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>

          <div v-if="currentTab === 'permissions'" class="tab-content-wrapper">
            <div class="permission-card glass-effect animate-up">
              <div class="perm-header">
                <component :is="ShieldCheckIcon" class="h-10 w-10 text-green-500" />
                <div class="p-text">
                  <h3>系统安全与权限分级</h3>
                  <p>账户状态：<span class="text-green-500 font-bold">高安全性运行中</span></p>
                </div>
              </div>
              <el-divider />
              <div class="perm-grid">
                <div v-for="group in permissionGroups" :key="group.title" class="perm-group">
                  <div class="g-title">
                    <component :is="group.icon" class="h-5 w-5" /> {{ group.title }}
                  </div>
                  <div class="g-tags">
                    <div v-for="p in group.items" :key="p" class="perm-tag-item">
                      <component :is="CheckCircleIcon" class="h-4 w-4 text-blue-500" /> {{ p }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentTab === 'logs'" class="tab-content-wrapper">
            <div class="log-card glass-effect animate-up">
              <div class="table-toolbar">
                <h3>最近登录审计</h3>
                <el-button type="info" plain size="small">导出 PDF</el-button>
              </div>
              <el-table :data="auditLogs" class="custom-modern-table">
                <el-table-column label="设备" width="180">
                  <template #default="{ row }">
                    <div class="flex items-center">
                      <component
                        :is="row.type === 'PC' ? ComputerDesktopIcon : DevicePhoneMobileIcon"
                        class="h-5 w-5 mr-2 text-gray-400"
                      />
                      {{ row.device }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="ip" label="IP 地址" />
                <el-table-column prop="location" label="地点" />
                <el-table-column prop="time" label="操作时间" width="160" />
                <el-table-column label="状态" width="100">
                  <template #default="{ row }">
                    <span :class="['status-pill', row.status]">{{
                      row.status === 'success' ? '成功' : '拦截'
                    }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="floating-feedback hidden-sm-and-down">
      <div class="f-ball">
        <component :is="QuestionMarkCircleIcon" class="h-7 w-7 text-white" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/display.css'
import {
  CheckBadgeIcon,
  MapPinIcon,
  LinkIcon,
  Square3Stack3DIcon,
  ShieldCheckIcon,
  ListBulletIcon,
  UserIcon,
  IdentificationIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  CodeBracketIcon,
  FaceSmileIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  ShareIcon,
  ChatBubbleBottomCenterIcon,
  RocketLaunchIcon,
  FireIcon,
  CpuChipIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  CommandLineIcon,
  KeyIcon,
  CameraIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/vue/24/outline'

// 1. 核心状态
const currentTab = ref('profile') // 默认进入资料页
const postContent = ref('')

// 2. 菜单配置 (适配手机端)
const menuTabs = [
  { id: 'profile', name: '个人资料', icon: UserIcon },
  { id: 'overview', name: '全景概览', icon: RocketLaunchIcon },
  { id: 'projects', name: '我的项目', icon: Square3Stack3DIcon },
  { id: 'permissions', name: '权限审计', icon: ShieldCheckIcon },
  { id: 'logs', name: '登录日志', icon: ListBulletIcon },
]

// 3. 个人资料表单数据
const userForm = reactive({
  nickname: '张小帅',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  email: 'xiaoshuai.zhang@company.com',
  phone: '138-xxxx-8888',
  location: '上海 · 张江高科',
  department: '研发中心',
  role: '高级系统架构师',
  bio: '凡是过往，皆为序章。在技术的海洋里，我们都是逐浪人。追求卓越，成功就会在不经意间追上你！',
})

// 4. 其他 Mock 数据
const skills = [
  { name: 'Vue 3.x', type: '' },
  { name: 'TypeScript', type: 'success' },
  { name: 'Element Plus', type: 'warning' },
  { name: 'Node.js', type: 'danger' },
]

const team = [
  {
    name: 'Lucille Richards',
    role: 'UI Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucille',
  },
  {
    name: 'Ray Vaughn',
    role: 'Frontend Dev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ray',
  },
]

const activityList = [
  {
    userName: '张小帅',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    time: '15 分钟前',
    type: '技术分享',
    content:
      '今天深入研究了 Vue3 的 Diff 算法，特别是在处理长列表更新时，Key 的合理使用能极大减少 Patch 次数。',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    likes: 128,
    comments: 24,
  },
]

const projects = [
  {
    name: 'Spike Admin Pro',
    desc: '基于 Vue3 的企业级中后台方案。',
    progress: 88,
    theme: '#5d87ff',
    icon: RocketLaunchIcon,
    status: '进行中',
  },
  {
    name: 'DataV Dashboard',
    desc: '实时大数据可视化看板。',
    progress: 45,
    theme: '#fb923c',
    icon: CpuChipIcon,
    status: '进行中',
  },
]

const permissionGroups = [
  { title: '账户角色', icon: UserIcon, items: ['Super Admin', 'Developer'] },
  { title: '敏感操作', icon: KeyIcon, items: ['User Delete', 'Token Refresh'] },
]

const auditLogs = [
  {
    device: 'MacBook Pro',
    ip: '192.168.1.1',
    location: '上海',
    time: '10:24',
    status: 'success',
    type: 'PC',
  },
  {
    device: 'iPhone 15',
    ip: '114.92.3.1',
    location: '北京',
    time: '09:12',
    status: 'warning',
    type: 'Mobile',
  },
]

// 5. 方法
const handleSave = () => {
  ElMessage.success('个人资料已成功更新！')
}
</script>

<style lang="scss" scoped>
/* ==========================================================================================
   VARIABLES & ANIMATIONS
   ========================================================================================== */
$primary: #5d87ff;
$bg-body: #f6f9fc;
$radius: 24px;
$shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05);

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
.delay-100 {
  animation-delay: 0.1s;
}

/* ==========================================================================================
   ROOT & BANNER
   ========================================================================================== */
.personal-center-root {
  background-color: $bg-body;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;

  .header-banner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 400px;
    background: #dde6ff;
    z-index: 0;
    .mesh-blob {
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.6;
    }
    .blob-primary {
      background: #818cf8;
      top: -150px;
      left: -100px;
    }
    .blob-secondary {
      background: #c084fc;
      top: -100px;
      right: 10%;
    }
    .blob-tertiary {
      background: #60a5fa;
      bottom: -50px;
      left: 20%;
    }
    .mesh-overlay {
      position: absolute;
      inset: 0;
      backdrop-filter: saturate(150%);
    }
  }

  .content-container {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 80px 20px 60px;
  }
}

/* ==========================================================================================
   USER MAIN CARD (PC & MOBILE ADAPTED)
   ========================================================================================== */
.user-main-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: $radius;
  padding: 30px 30px 0;
  box-shadow: $shadow;
  border: 1px solid rgba(255, 255, 255, 0.4);
  margin-bottom: 30px;

  .card-inner-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 25px;
    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
      gap: 20px;
    }

    .left-profile {
      display: flex;
      align-items: center;
      gap: 25px;
      @media (max-width: 768px) {
        flex-direction: column;
      }

      .avatar-container {
        position: relative;
        .main-avatar {
          width: 110px;
          height: 110px;
          border-radius: 30px;
          border: 4px solid #fff;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        .online-status {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 20px;
          height: 20px;
          background: #13deb9;
          border: 4px solid #fff;
          border-radius: 50%;
        }
      }

      .user-identity {
        .name-row {
          display: flex;
          align-items: center;
          gap: 12px;
          h1 {
            font-size: 26px;
            font-weight: 800;
            color: #2a3547;
            margin: 0;
          }
          .admin-badge {
            font-size: 11px;
            background: #ecf2ff;
            color: $primary;
            padding: 4px 10px;
            border-radius: 8px;
          }
        }
        .user-motto {
          color: #7c8fac;
          font-size: 14px;
          margin: 8px 0;
          max-width: 500px;
        }
        .social-tags {
          display: flex;
          gap: 15px;
          @media (max-width: 768px) {
            justify-content: center;
          }
          .s-tag {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
            color: #7c8fac;
          }
        }
      }
    }

    .right-stats {
      display: flex;
      gap: 30px;
      .stat-mini-item {
        text-align: center;
        .val {
          display: block;
          font-size: 20px;
          font-weight: 800;
        }
        .lab {
          font-size: 11px;
          color: #7c8fac;
        }
      }
      .stat-mini-divider {
        width: 1px;
        height: 35px;
        background: #e2e8f0;
      }
    }
  }

  /* 导航栏手机端滑动适配 */
  .card-nav-container {
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none;
    } /* Chrome/Safari */

    .card-nav-tabs {
      display: flex;
      gap: 40px;
      min-width: max-content;
      .nav-tab-item {
        padding: 18px 5px;
        font-size: 15px;
        font-weight: 600;
        color: #7c8fac;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        position: relative;
        transition: 0.3s;
        &:hover {
          color: $primary;
        }
        &.active {
          color: $primary;
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: $primary;
            border-radius: 3px 3px 0 0;
          }
        }
      }
    }
  }
}

/* ==========================================================================================
   PROFILE SETTINGS (NEW SECTION)
   ========================================================================================== */
.profile-settings-card {
  background: #fff;
  border-radius: $radius;
  padding: 35px;
  box-shadow: $shadow;

  .s-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 30px;
    @media (max-width: 640px) {
      flex-direction: column;
      gap: 15px;
    }
    h3 {
      font-size: 22px;
      font-weight: 700;
      color: #2a3547;
      margin: 0 0 5px;
    }
    p {
      color: #7c8fac;
      font-size: 14px;
      margin: 0;
    }
    .btn-save {
      padding: 12px 25px;
      font-weight: 700;
      border-radius: 12px;
    }
  }

  .profile-edit-body {
    .avatar-edit-section {
      display: flex;
      align-items: center;
      gap: 30px;
      margin-bottom: 30px;
      @media (max-width: 640px) {
        flex-direction: column;
        text-align: center;
      }

      .edit-avatar-wrapper {
        position: relative;
        cursor: pointer;
        img {
          width: 100px;
          height: 100px;
          border-radius: 24px;
          object-fit: cover;
        }
        .avatar-mask {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          opacity: 0;
          transition: 0.3s;
          span {
            font-size: 11px;
            margin-top: 5px;
          }
        }
        &:hover .avatar-mask {
          opacity: 1;
        }
      }
      .avatar-tips {
        h4 {
          margin: 0 0 5px;
          font-size: 16px;
        }
        p {
          font-size: 13px;
          color: #7c8fac;
          margin: 0 0 10px;
        }
      }
    }

    .form-section-title {
      font-size: 14px;
      font-weight: 700;
      color: #7c8fac;
      text-transform: uppercase;
      margin-bottom: 20px;
      border-left: 4px solid $primary;
      padding-left: 10px;
    }

    .custom-form {
      :deep(.el-form-item__label) {
        font-weight: 600;
        color: #2a3547;
        padding-bottom: 4px;
      }
      :deep(.el-input__wrapper) {
        background: #f8fafc;
        border-radius: 10px;
        box-shadow: none !important;
        border: 1px solid #eef2f6;
        &:hover {
          border-color: $primary;
        }
      }
    }
  }
}

/* ==========================================================================================
   OTHER TAB STYLES (PROJECTS, LOGS, ETC)
   ========================================================================================== */
.glass-effect {
  background: #fff;
  border-radius: $radius;
  box-shadow: $shadow;
  border: 1px solid rgba(235, 238, 245, 0.8);
}

.detail-card {
  padding: 25px;
  .card-title-box {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    span {
      font-size: 17px;
      font-weight: 700;
    }
    svg {
      color: $primary;
    }
  }
  .info-cell {
    margin-bottom: 15px;
    label {
      display: block;
      font-size: 11px;
      color: #7c8fac;
      margin-bottom: 2px;
    }
    span {
      font-size: 14px;
      font-weight: 600;
    }
  }
}

.project-pro-card {
  background: #fff;
  border-radius: $radius;
  padding: 25px;
  margin-bottom: 24px;
  transition: 0.3s;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }
  .p-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    .p-icon-box {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .p-body h3 {
    margin: 0 0 5px;
    font-size: 17px;
  }
  .p-body p {
    font-size: 12px;
    color: #7c8fac;
    height: 36px;
    overflow: hidden;
  }
  .p-progress-area {
    margin: 15px 0;
  }
  .p-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .p-members {
      display: flex;
      img {
        border-radius: 50%;
        border: 2px solid #fff;
        margin-left: -8px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}

.log-card {
  padding: 30px;
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
}

.status-pill {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  &.success {
    background: #e6fffa;
    color: #13deb9;
  }
  &.warning {
    background: #fff5f5;
    color: #fa896b;
  }
}

/* ==========================================================================================
   FEEDBACK BALL
   ========================================================================================== */
.floating-feedback {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 100;
  .f-ball {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: $primary;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 20px rgba($primary, 0.4);
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      transform: scale(1.1);
    }
  }
}

/* UTILS */
.mt-24 {
  margin-top: 24px;
}
.mt-20 {
  margin-top: 20px;
}
.mb-5 {
  margin-bottom: 20px;
}
.w-full {
  width: 100%;
}
.sticky-sidebar {
  position: sticky;
  top: 20px;
}
.hidden-sm-and-down {
  @media (max-width: 992px) {
    display: none !important;
  }
}
</style>
