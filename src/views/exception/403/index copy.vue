<template>
  <div class="profile-wrapper">
    <div class="profile-banner">
      <div class="banner-gradient"></div>
    </div>

    <div class="profile-container">
      <div class="user-main-card">
        <div class="user-info-flex">
          <div class="avatar-section">
            <el-avatar
              :size="100"
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              class="avatar-border"
            />
            <div class="name-box">
              <h3>张小帅 <el-tag size="small" round effect="light">Admin</el-tag></h3>
              <p>Vue3 全栈开发工程师 | 追求极致的 UI/UX 体验</p>
              <div class="status-tag"><span class="dot"></span> 运行中</div>
            </div>
          </div>

          <div class="profile-completion">
            <el-progress type="circle" :percentage="85" :width="70" color="#5d87ff" />
            <div class="completion-text">
              <span>资料完成度</span>
              <strong>优秀</strong>
            </div>
          </div>

          <div class="action-buttons">
            <el-button type="primary" class="btn-edit" auto-insert-space>编辑资料</el-button>
          </div>
        </div>

        <div class="inner-nav">
          <div class="nav-item active">个人概览</div>
          <div class="nav-item">我的项目</div>
          <div class="nav-item">权限范围</div>
          <div class="nav-item">登录日志</div>
        </div>
      </div>

      <el-row :gutter="24" class="content-row">
        <el-col :lg="8" :md="24">
          <div class="glass-card info-sidebar">
            <div class="card-title">关于我</div>
            <p class="intro-text">
              专注于企业级后台管理系统的架构设计，擅长 Vue3
              生态链与微前端方案。在当前系统中负责核心业务逻辑与 UI 组件库的维护。
            </p>

            <el-divider />

            <div class="detail-list">
              <div class="detail-item">
                <div class="icon-box blue">
                  <el-icon><Postcard /></el-icon>
                </div>
                <div class="item-text"><span>所属部门</span><strong>研发中心 - 架构组</strong></div>
              </div>
              <div class="detail-item">
                <div class="icon-box green">
                  <el-icon><Message /></el-icon>
                </div>
                <div class="item-text">
                  <span>联系邮箱</span><strong>admin@dev-cloud.com</strong>
                </div>
              </div>
              <div class="detail-item">
                <div class="icon-box orange">
                  <el-icon><Calendar /></el-icon>
                </div>
                <div class="item-text"><span>入职日期</span><strong>2021年05月12日</strong></div>
              </div>
            </div>

            <div class="card-title mt-20">技术栈</div>
            <div class="skill-tags">
              <el-tag effect="plain" type="primary">Vue 3.x</el-tag>
              <el-tag effect="plain" type="success">TypeScript</el-tag>
              <el-tag effect="plain" type="warning">Echarts</el-tag>
              <el-tag effect="plain" type="danger">Pinia</el-tag>
              <el-tag effect="plain" type="info">Node.js</el-tag>
            </div>
          </div>

          <div class="glass-card mt-20">
            <div class="card-title">项目组员 <el-badge :value="12" class="title-badge" /></div>
            <div class="team-list">
              <div v-for="i in 3" :key="i" class="team-member">
                <el-avatar
                  :size="36"
                  :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`"
                />
                <div class="member-info">
                  <strong>李思思</strong>
                  <span>UI 设计师</span>
                </div>
                <el-button link type="primary">私聊</el-button>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :lg="16" :md="24">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-icon purple">
                  <el-icon><Files /></el-icon>
                </div>
                <div class="stat-data">
                  <h3>48</h3>
                  <p>托管项目</p>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-icon cyan">
                  <el-icon><Finished /></el-icon>
                </div>
                <div class="stat-data">
                  <h3>156</h3>
                  <p>完成任务</p>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-icon red">
                  <el-icon><Warning /></el-icon>
                </div>
                <div class="stat-data">
                  <h3>2</h3>
                  <p>待处理Bug</p>
                </div>
              </div>
            </el-col>
          </el-row>

          <div class="glass-card mt-20 publish-box">
            <el-input
              v-model="publishText"
              placeholder="分享一下今天的开发心得..."
              type="textarea"
              :rows="3"
            />
            <div class="publish-actions">
              <div class="icons">
                <el-icon><Picture /></el-icon>
                <el-icon><Link /></el-icon>
                <el-icon><Microphone /></el-icon>
              </div>
              <el-button type="primary" round>发布更新</el-button>
            </div>
          </div>

          <div class="glass-card mt-20">
            <div class="card-title">最近系统动态</div>
            <div class="activity-feed">
              <div v-for="item in activities" :key="item.id" class="feed-item">
                <div class="feed-header">
                  <el-avatar
                    :size="32"
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  />
                  <div class="feed-meta">
                    <strong>张小帅</strong> <span>更新了项目进度</span>
                    <p>15分钟前</p>
                  </div>
                </div>
                <div class="feed-content">
                  {{ item.text }}
                  <div v-if="item.img" class="content-img">
                    <img :src="item.img" alt="content" />
                  </div>
                </div>
                <div class="feed-footer">
                  <el-button link
                    ><el-icon><ChatDotRound /></el-icon> 评论(12)</el-button
                  >
                  <el-button link
                    ><el-icon><Share /></el-icon> 分享</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Postcard,
  Message,
  Calendar,
  Files,
  Finished,
  Warning,
  Picture,
  Link,
  Microphone,
  ChatDotRound,
  Share,
} from '@element-plus/icons-vue'

const publishText = ref('')

const activities = [
  {
    id: 1,
    text: '今天成功接入了新的看板组件，系统性能提升了 20%！正在进行最后的压力测试。',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format',
  },
  {
    id: 2,
    text: '完成了用户中心页面的 UI 重构，使用了更加柔和的阴影和圆角设计，适配了暗黑模式。',
    img: null,
  },
]
</script>

<style lang="scss" scoped>
// 变量定义
$primary: #5d87ff;
$bg-color: #f4f7fb;
$card-shadow: 0 10px 30px rgba(82, 63, 105, 0.05);

.profile-wrapper {
  background-color: $bg-color;
  min-height: 100vh;
  font-family:
    'Inter',
    -apple-system,
    sans-serif;

  .profile-banner {
    height: 280px;
    .banner-gradient {
      height: 100%;
      background: linear-gradient(135deg, #7091ff 0%, #c2e9fb 100%);
      position: relative;
      &::before {
        content: '';
        position: absolute;
        width: 300px;
        height: 300px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        top: -100px;
        right: -50px;
      }
    }
  }

  .profile-container {
    max-width: 1200px;
    margin: -100px auto 0;
    padding: 0 20px 40px;

    // 核心用户信息卡片
    .user-main-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 30px 30px 0;
      box-shadow: $card-shadow;
      border: 1px solid rgba(255, 255, 255, 0.3);
      margin-bottom: 24px;

      .user-info-flex {
        display: flex;
        align-items: center;
        gap: 25px;
        padding-bottom: 25px;

        .avatar-border {
          border: 5px solid #fff;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .name-box {
          flex: 1;
          h3 {
            font-size: 22px;
            margin: 0 0 8px;
            color: #2a3547;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          p {
            color: #7c8fac;
            margin: 0 0 10px;
            font-size: 14px;
          }
          .status-tag {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: #13deb9;
            background: rgba(19, 222, 185, 0.1);
            padding: 2px 10px;
            border-radius: 12px;
            .dot {
              width: 6px;
              height: 6px;
              background: #13deb9;
              border-radius: 50%;
            }
          }
        }

        .profile-completion {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 0 30px;
          border-left: 1px solid #eee;
          border-right: 1px solid #eee;
          .completion-text {
            span {
              display: block;
              font-size: 12px;
              color: #7c8fac;
            }
            strong {
              font-size: 18px;
              color: $primary;
            }
          }
        }
      }

      .inner-nav {
        display: flex;
        gap: 30px;
        .nav-item {
          padding: 15px 5px;
          font-size: 15px;
          color: #7c8fac;
          cursor: pointer;
          position: relative;
          transition: 0.3s;
          &:hover {
            color: $primary;
          }
          &.active {
            color: $primary;
            font-weight: 600;
            &::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 2px;
              background: $primary;
            }
          }
        }
      }
    }

    // 通用玻璃卡片样式
    .glass-card {
      background: #fff;
      border-radius: 20px;
      padding: 25px;
      box-shadow: $card-shadow;
      border: 1px solid rgba(235, 238, 245, 0.7);

      .card-title {
        font-size: 18px;
        font-weight: 600;
        color: #2a3547;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title-badge {
          margin-left: 8px;
        }
      }
    }

    // 左侧详情列表
    .detail-list {
      .detail-item {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
        .icon-box {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          &.blue {
            background: rgba(93, 135, 255, 0.1);
            color: #5d87ff;
          }
          &.green {
            background: rgba(19, 222, 185, 0.1);
            color: #13deb9;
          }
          &.orange {
            background: rgba(255, 174, 31, 0.1);
            color: #ffae1f;
          }
        }
        .item-text {
          span {
            display: block;
            font-size: 12px;
            color: #7c8fac;
          }
          strong {
            font-size: 14px;
            color: #2a3547;
          }
        }
      }
    }

    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    // 统计卡片
    .stat-card {
      background: #fff;
      padding: 20px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      box-shadow: $card-shadow;
      margin-bottom: 24px;
      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        &.purple {
          background: #f2f6ff;
          color: #5d87ff;
        }
        &.cyan {
          background: #edfbff;
          color: #00bcd4;
        }
        &.red {
          background: #fef2f2;
          color: #fa896b;
        }
      }
      .stat-data {
        h3 {
          margin: 0;
          font-size: 20px;
          color: #2a3547;
        }
        p {
          margin: 0;
          font-size: 13px;
          color: #7c8fac;
        }
      }
    }

    // 发布框与动态
    .publish-box {
      .publish-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
        .icons {
          display: flex;
          gap: 15px;
          color: #7c8fac;
          font-size: 20px;
          .el-icon {
            cursor: pointer;
            &:hover {
              color: $primary;
            }
          }
        }
      }
    }

    .activity-feed {
      .feed-item {
        padding: 20px 0;
        border-bottom: 1px solid #f1f3f5;
        &:last-child {
          border-bottom: none;
        }
        .feed-header {
          display: flex;
          gap: 12px;
          align-items: center;
          .feed-meta {
            font-size: 14px;
            strong {
              color: #2a3547;
            }
            span {
              color: #7c8fac;
            }
            p {
              margin: 2px 0 0;
              font-size: 12px;
              color: #adbbcb;
            }
          }
        }
        .feed-content {
          margin: 15px 0 15px 44px;
          font-size: 14px;
          color: #5a6a85;
          line-height: 1.6;
          .content-img {
            margin-top: 12px;
            img {
              width: 100%;
              border-radius: 12px;
              max-height: 250px;
              object-fit: cover;
            }
          }
        }
        .feed-footer {
          margin-left: 44px;
        }
      }
    }

    .team-list {
      .team-member {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 15px;
        .member-info {
          flex: 1;
          strong {
            display: block;
            font-size: 14px;
            color: #2a3547;
          }
          span {
            font-size: 12px;
            color: #7c8fac;
          }
        }
      }
    }
  }
}

// 辅助样式
.mt-20 {
  margin-top: 20px;
}
:deep(.el-textarea__inner) {
  border: none;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  &:focus {
    box-shadow: none;
    background: #f1f3f5;
  }
}
</style>
