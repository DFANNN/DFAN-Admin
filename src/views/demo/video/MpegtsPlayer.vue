<template>
  <div :style="{ width, height }" class="mpegts-player">
    <video
      ref="videoRef"
      class="mpegts-video"
      :controls="controls"
      :muted="muted"
      :autoplay="autoplay"
      :poster="poster"
      playsinline
      webkit-playsinline="true"
      x5-playsinline="true"
      :style="{ objectFit }"
      @pause="onPause"
      @play="onPlay"
    />
    <div v-if="!src" class="mpegts-mask">暂无 FLV/MPEG-TS 视频流地址</div>
    <div v-else-if="loading" class="mpegts-mask"><div class="mpegts-spinner" /></div>
    <div v-else-if="!hasStarted || isPaused" class="mpegts-mask mpegts-mask--play" @click="play">
      <div class="mpegts-player-btn"><svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36"><path d="M8 5v14l11-7z" /></svg></div>
    </div>
    <div v-else-if="errorMessage" class="mpegts-mask mpegts-mask--error" @click="reload">
      <div>{{ errorMessage }}</div>
      <div class="mpegts-mask-tip">点击重试</div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * MpegtsPlayer
 * 基于 mpegts.js 封装，用于播放 HTTP-FLV、MPEG-TS 直播流。
 * 不直接支持 RTMP/RTSP，通常需要服务端先转成浏览器可播放的 FLV/MPEG-TS over HTTP。
 */
import mpegts from 'mpegts.js'

interface IProps {
  // FLV/MPEG-TS 视频流地址
  src: string
  // 流类型，HTTP-FLV 用 flv，MPEG-TS 用 mpegts
  type?: 'flv' | 'mpegts'
  // 是否自动播放，浏览器通常要求 muted=true 才允许自动播放
  autoplay?: boolean
  // 是否静音
  muted?: boolean
  // 是否显示 video 原生控制栏
  controls?: boolean
  // 是否为直播流
  live?: boolean
  // 是否包含音频轨道
  hasAudio?: boolean
  // 是否包含视频轨道
  hasVideo?: boolean
  // 视频封面图
  poster?: string
  // 视频填充方式
  objectFit?: 'contain' | 'cover' | 'fill'
  // 是否启用 worker 解析，适合降低主线程压力
  enableWorker?: boolean
  width?: string
  height?: string
}

const props = withDefaults(defineProps<IProps>(), {
  type: 'flv',
  autoplay: false,
  muted: true,
  controls: true,
  live: true,
  hasAudio: false,
  hasVideo: true,
  poster: '',
  objectFit: 'cover',
  enableWorker: true,
  width: '100%',
  height: '100%',
})

const emit = defineEmits<{ ready: []; play: []; pause: [] }>()

let player: mpegts.Player | null = null
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')
const hasStarted = ref(props.autoplay)
const isPaused = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const destroy = () => {
  if (player) {
    player.unload()
    player.detachMediaElement()
    player.destroy()
    player = null
  }
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

const bindEvents = (instance: mpegts.Player) => {
  instance.on(mpegts.Events.ERROR, (type: unknown, detail: unknown, info: unknown) => {
    const data = typeof info === 'object' && info ? (info as { msg?: string; code?: number }) : {}
    if (type === mpegts.ErrorTypes.NETWORK_ERROR) {
      showError(detail === mpegts.ErrorDetails.NETWORK_STATUS_CODE_INVALID ? `视频流请求失败，HTTP 状态码：${data.code ?? '未知'}` : '网络错误，请检查流地址或服务状态')
      return
    }
    if (type === mpegts.ErrorTypes.MEDIA_ERROR) {
      showError('媒体错误，请检查 FLV/MPEG-TS 格式或编码')
      return
    }
    showError(`播放器内部错误${data.msg ? `：${data.msg}` : ''}`)
  })
}

const init = async () => {
  hasStarted.value = true
  errorMessage.value = ''
  destroy()
  loading.value = true

  if (!props.src) return showError('视频地址不能为空')
  if (!videoRef.value) return
  if (!mpegts.isSupported()) return showError('当前浏览器不支持 FLV/MPEG-TS 播放')

  try {
    player = mpegts.createPlayer(
      { type: props.type, url: props.src, isLive: props.live, hasAudio: props.hasAudio, hasVideo: props.hasVideo },
      { enableWorker: props.enableWorker, lazyLoad: false, autoCleanupSourceBuffer: true, liveBufferLatencyChasing: props.live },
    )
    bindEvents(player)
    player.attachMediaElement(videoRef.value)
    player.load()
    await player.play()
    loading.value = false
    emit('ready')
  } catch {
    showError('FLV/MPEG-TS 视频流初始化失败，请检查流地址或服务状态')
  }
}

const play = () => (!hasStarted.value ? init() : videoRef.value?.play())
const reload = () => init()
const onPlay = () => { isPaused.value = false; loading.value = false; emit('play') }
const onPause = () => { isPaused.value = true; emit('pause') }

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
.mpegts-player { position: relative; overflow: hidden; border-radius: 8px; background: var(--el-mask-color); }
.mpegts-video { display: block; width: 100%; height: 100%; background: var(--el-mask-color); }
.mpegts-mask { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 16px; color: var(--el-color-white); text-align: center; background: var(--el-mask-color); }
.mpegts-mask--play, .mpegts-mask--error { cursor: pointer; }
.mpegts-player-btn { display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; border: 2px solid var(--el-color-white); border-radius: 50%; transition: all 0.18s ease; }
.mpegts-mask:hover .mpegts-player-btn { background: var(--el-color-primary); border-color: var(--el-color-primary); transform: scale(1.1); }
.mpegts-mask-tip { font-size: 12px; color: var(--el-text-color-placeholder); }
.mpegts-spinner { width: 72px; height: 72px; border: 3px solid var(--el-fill-color-light); border-top-color: var(--el-color-primary); border-radius: 50%; animation: mpegts-spin 0.75s linear infinite; }
@keyframes mpegts-spin { to { transform: rotate(360deg); } }
</style>
