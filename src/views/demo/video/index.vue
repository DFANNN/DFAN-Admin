<template>
  <div class="video-demo-page">
    <el-row :gutter="20">
      <el-col v-for="item in playerList" :key="item.key" :xs="24" :lg="12">
        <BaseCard class="video-demo-card">
          <template #header>
            <div class="video-card-header">
              <div>
                <div class="video-card-title">{{ item.title }}</div>
                <div class="video-card-desc">{{ item.description }}</div>
              </div>
              <el-tag type="primary" effect="plain">{{ item.library }}</el-tag>
            </div>
          </template>

          <div class="video-player-wrap">
            <component :is="item.component" :src="item.playUrl" height="320px" :autoplay="false" />
          </div>

          <div class="video-control">
            <el-input v-model="item.inputUrl" clearable :placeholder="item.placeholder" @keyup.enter="play(item)">
              <template #prepend>流地址</template>
            </el-input>
            <el-button type="primary" @click="play(item)">播放</el-button>
          </div>

          <el-alert :title="item.usage" type="info" :closable="false" show-icon />
        </BaseCard>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import MpegtsPlayer from './MpegtsPlayer.vue'
import WebRtcPlayer from './WebRtcPlayer.vue'
import HlsPlayer from './HlsPlayer.vue'
import NativeVideoPlayer from './NativeVideoPlayer.vue'

defineOptions({ name: 'VideoView' })

interface IPlayerDemoItem {
  key: string
  title: string
  library: string
  description: string
  usage: string
  placeholder: string
  inputUrl: string
  playUrl: string
  component: Component
}

const playerList = reactive<IPlayerDemoItem[]>([
  {
    key: 'mpegts',
    title: 'MpegtsPlayer',
    library: 'mpegts.js',
    description: '基于 mpegts.js 封装，通过 MSE 将 FLV/MPEG-TS 流交给 video 播放。',
    usage: '主要适用于 HTTP-FLV、MPEG-TS 直播流，例如监控直播、直播转封装后的低延迟播放。',
    placeholder: '请输入 http(s)://example.com/live.flv 或 .ts 地址',
    inputUrl: '',
    playUrl: '',
    component: MpegtsPlayer,
  },
  {
    key: 'webrtc',
    title: 'WebRtcPlayer',
    library: 'WebRTC API',
    description: '基于浏览器原生 RTCPeerConnection 封装，通过 WHEP 信令拉取实时流。',
    usage: '主要适用于 WHEP WebRTC 低延迟直播流，不适合直接播放 mp4、flv、m3u8 文件地址。',
    placeholder: '请输入 WHEP 地址，例如 http(s)://example.com/whep/stream',
    inputUrl: '',
    playUrl: '',
    component: WebRtcPlayer,
  },
  {
    key: 'hls',
    title: 'HlsPlayer',
    library: 'hls.js',
    description: '基于 hls.js 封装，在非 Safari 浏览器中通过 MSE 播放 HLS。',
    usage: '主要适用于 HLS 的 .m3u8 点播或直播流，兼容性好，但通常延迟高于 WebRTC/HTTP-FLV。',
    placeholder: '请输入 http(s)://example.com/live/index.m3u8',
    inputUrl: '',
    playUrl: '',
    component: HlsPlayer,
  },
  {
    key: 'native',
    title: 'NativeVideoPlayer',
    library: 'HTMLVideoElement',
    description: '基于浏览器原生 video 标签封装，不引入第三方播放器内核。',
    usage: '主要适用于 mp4、webm、ogg 等浏览器原生支持的视频文件；Safari 可播放部分原生 HLS。',
    placeholder: '请输入 http(s)://example.com/video.mp4',
    inputUrl: '',
    playUrl: '',
    component: NativeVideoPlayer,
  },
])

const play = (item: IPlayerDemoItem) => {
  item.playUrl = item.inputUrl.trim()
}
</script>

<style scoped lang="scss">
.video-demo-card { margin-bottom: 20px; }
.video-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.video-card-title { margin-bottom: 6px; font-size: 16px; font-weight: 600; color: var(--el-text-color-primary); }
.video-card-desc { font-size: 13px; line-height: 1.6; color: var(--el-text-color-secondary); }
.video-player-wrap { overflow: hidden; border-radius: 8px; background: var(--el-mask-color); }
.video-control { display: flex; gap: 12px; margin: 16px 0; }

@media (max-width: 768px) {
  .video-card-header,
  .video-control { flex-direction: column; }
  .video-control .el-button { width: 100%; }
}
</style>
