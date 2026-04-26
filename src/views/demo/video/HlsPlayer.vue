<template>
  <div :style="{ width, height }" class="hls-player">
    <video ref="videoRef" class="hls-video" :controls="controls" :muted="muted" :autoplay="autoplay" :poster="poster" playsinline webkit-playsinline="true" x5-playsinline="true" :style="{ objectFit }" @canplay="onReady" @pause="onPause" @play="onPlay" @error="onNativeError" />
    <div v-if="!src" class="hls-mask">暂无 HLS 视频流地址</div>
    <div v-else-if="loading" class="hls-mask"><div class="hls-spinner" /></div>
    <div v-else-if="!hasStarted || isPaused" class="hls-mask hls-mask--play" @click="play"><div class="hls-player-btn"><svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36"><path d="M8 5v14l11-7z" /></svg></div></div>
    <div v-else-if="errorMessage" class="hls-mask hls-mask--error" @click="reload"><div>{{ errorMessage }}</div><div class="hls-mask-tip">点击重试</div></div>
  </div>
</template>

<script setup lang="ts">
/**
 * HlsPlayer
 * 基于 hls.js 封装，用于播放 HLS .m3u8 点播或直播流。
 * Chrome/Edge/Firefox 通常依赖 hls.js + MSE，Safari 可直接走 video 原生 HLS 能力。
 */
import Hls from 'hls.js'

interface IProps {
  // HLS 地址，通常是 .m3u8
  src: string
  // 是否自动播放，浏览器通常要求 muted=true 才允许自动播放
  autoplay?: boolean
  // 是否静音
  muted?: boolean
  // 是否显示 video 原生控制栏
  controls?: boolean
  // 视频封面图
  poster?: string
  // 视频填充方式
  objectFit?: 'contain' | 'cover' | 'fill'
  // 是否启用低延迟 HLS，需服务端同时支持 LL-HLS
  lowLatencyMode?: boolean
  width?: string
  height?: string
}

const props = withDefaults(defineProps<IProps>(), { autoplay: false, muted: true, controls: true, poster: '', objectFit: 'cover', lowLatencyMode: true, width: '100%', height: '100%' })
const emit = defineEmits<{ ready: []; play: []; pause: [] }>()

let player: Hls | null = null
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')
const hasStarted = ref(props.autoplay)
const isPaused = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const destroy = () => {
  player?.destroy()
  player = null
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.removeAttribute('src')
    videoRef.value.load()
  }
  loading.value = false
  isPaused.value = false
}

const showError = async (message: string) => {
  if (errorMessage.value) return
  errorMessage.value = message
  await nextTick()
  destroy()
}

const bindEvents = (instance: Hls) => {
  instance.on(Hls.Events.MANIFEST_PARSED, () => {
    loading.value = false
    emit('ready')
    if (props.autoplay) videoRef.value?.play().catch(() => {})
  })
  instance.on(Hls.Events.ERROR, (_, data) => {
    if (!data.fatal) return
    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) return showError('HLS 网络错误，请检查 m3u8 地址或服务状态')
    if (data.type === Hls.ErrorTypes.MEDIA_ERROR) return showError('HLS 媒体错误，请检查视频编码格式')
    showError('HLS 播放器内部错误')
  })
}

const init = async () => {
  hasStarted.value = true
  errorMessage.value = ''
  destroy()
  loading.value = true
  if (!props.src) return showError('视频地址不能为空')
  if (!videoRef.value) return
  try {
    if (Hls.isSupported()) {
      player = new Hls({ lowLatencyMode: props.lowLatencyMode, backBufferLength: 90 })
      bindEvents(player)
      player.loadSource(props.src)
      player.attachMedia(videoRef.value)
      return
    }
    if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.value.src = props.src
      videoRef.value.load()
      if (props.autoplay) await videoRef.value.play()
      return
    }
    showError('当前浏览器不支持 HLS 播放')
  } catch {
    showError('HLS 视频流初始化失败，请检查流地址或服务状态')
  }
}

const play = () => (!hasStarted.value ? init() : videoRef.value?.play())
const reload = () => init()
const onReady = () => { loading.value = false; emit('ready') }
const onPlay = () => { isPaused.value = false; loading.value = false; emit('play') }
const onPause = () => { isPaused.value = true; emit('pause') }
const onNativeError = () => { if (props.src) showError('视频加载失败，请检查流地址、跨域配置或编码格式') }

watch(() => props.src, async (src) => {
  errorMessage.value = ''
  hasStarted.value = props.autoplay
  if (src && props.autoplay) {
    await nextTick()
    init()
  } else if (!src) {
    destroy()
  }
}, { immediate: true })

onUnmounted(destroy)
defineExpose({ videoEl: videoRef, play: init, destroy })
</script>

<style scoped lang="scss">
.hls-player { position: relative; overflow: hidden; border-radius: 8px; background: var(--el-mask-color); }
.hls-video { display: block; width: 100%; height: 100%; background: var(--el-mask-color); }
.hls-mask { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 16px; color: var(--el-color-white); text-align: center; background: var(--el-mask-color); }
.hls-mask--play, .hls-mask--error { cursor: pointer; }
.hls-player-btn { display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; border: 2px solid var(--el-color-white); border-radius: 50%; transition: all 0.18s ease; }
.hls-mask:hover .hls-player-btn { background: var(--el-color-primary); border-color: var(--el-color-primary); transform: scale(1.1); }
.hls-mask-tip { font-size: 12px; color: var(--el-text-color-placeholder); }
.hls-spinner { width: 72px; height: 72px; border: 3px solid var(--el-fill-color-light); border-top-color: var(--el-color-primary); border-radius: 50%; animation: hls-spin 0.75s linear infinite; }
@keyframes hls-spin { to { transform: rotate(360deg); } }
</style>
