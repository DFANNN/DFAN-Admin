<template>
  <div :style="{ width, height }" class="webrtc-player">
    <video
      ref="videoRef"
      class="webrtc-video"
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
    <div v-if="!src" class="webrtc-mask">暂无 WebRTC 视频流地址</div>
    <div v-else-if="loading" class="webrtc-mask"><div class="webrtc-spinner" /></div>
    <div v-else-if="!hasStarted || isPaused" class="webrtc-mask webrtc-mask--play" @click="play">
      <div class="webrtc-player-btn"><svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36"><path d="M8 5v14l11-7z" /></svg></div>
    </div>
    <div v-else-if="errorMessage" class="webrtc-mask webrtc-mask--error" @click="reload">
      <div>{{ errorMessage }}</div>
      <div class="webrtc-mask-tip">点击重试</div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * WebRtcPlayer
 * 基于浏览器原生 WebRTC API 封装，用于播放 WHEP 拉流地址。
 * 主要适用于低延迟直播、监控预览、实时音视频场景，不适合直接播放 mp4、flv、m3u8 文件。
 */
interface IProps {
  // WHEP 信令端点地址
  src: string
  // 是否自动播放
  autoplay?: boolean
  // 是否静音
  muted?: boolean
  // 是否显示 video 原生控制栏
  controls?: boolean
  // 是否接收音频轨道
  hasAudio?: boolean
  // 是否接收视频轨道
  hasVideo?: boolean
  // 视频封面图
  poster?: string
  // 视频填充方式
  objectFit?: 'contain' | 'cover' | 'fill'
  width?: string
  height?: string
}

const props = withDefaults(defineProps<IProps>(), {
  autoplay: false,
  muted: true,
  controls: true,
  hasAudio: false,
  hasVideo: true,
  poster: '',
  objectFit: 'cover',
  width: '100%',
  height: '100%',
})

const emit = defineEmits<{ ready: []; play: []; pause: [] }>()

let pc: RTCPeerConnection | null = null
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')
const hasStarted = ref(props.autoplay)
const isPaused = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const destroy = () => {
  if (pc) {
    pc.ontrack = null
    pc.onconnectionstatechange = null
    pc.close()
    pc = null
  }
  if (videoRef.value?.srcObject) {
    const stream = videoRef.value.srcObject as MediaStream
    stream.getTracks().forEach((track) => track.stop())
    videoRef.value.srcObject = null
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

const waitIceComplete = (instance: RTCPeerConnection) => new Promise<void>((resolve) => {
  if (instance.iceGatheringState === 'complete') return resolve()
  const onChange = () => {
    if (instance.iceGatheringState === 'complete') {
      instance.removeEventListener('icegatheringstatechange', onChange)
      resolve()
    }
  }
  instance.addEventListener('icegatheringstatechange', onChange)
})

const bindEvents = (instance: RTCPeerConnection) => {
  instance.ontrack = (event) => {
    if (!videoRef.value) return
    const [stream] = event.streams
    if (!stream) return
    videoRef.value.srcObject = stream
    videoRef.value.play().catch(() => {})
    loading.value = false
    emit('ready')
  }

  instance.onconnectionstatechange = () => {
    if (!pc) return
    if (pc.connectionState === 'connected') {
      loading.value = false
      emit('play')
    } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
      showError('WebRTC 连接断开，请检查流地址或服务状态')
    }
  }
}

const parseAnswerSdp = (text: string) => {
  try {
    const json = JSON.parse(text) as { sdp?: string; code?: number; msg?: string }
    if (json.sdp) return json.sdp
    if (json.code !== undefined && json.code !== 0) throw new Error(`服务端错误(code=${json.code}, msg=${json.msg ?? ''})`)
    return text
  } catch (error) {
    if (error instanceof SyntaxError) return text
    throw error
  }
}

const init = async () => {
  hasStarted.value = true
  errorMessage.value = ''
  destroy()
  loading.value = true

  if (!props.src) return showError('视频地址不能为空')
  if (!videoRef.value) return
  if (typeof RTCPeerConnection === 'undefined') return showError('当前浏览器不支持 WebRTC 播放')

  try {
    pc = new RTCPeerConnection()
    if (props.hasVideo) pc.addTransceiver('video', { direction: 'recvonly' })
    if (props.hasAudio) pc.addTransceiver('audio', { direction: 'recvonly' })
    bindEvents(pc)

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    await waitIceComplete(pc)

    const response = await fetch(props.src, {
      method: 'POST',
      headers: { 'Content-Type': 'application/sdp', Accept: 'application/sdp, application/json' },
      body: pc.localDescription?.sdp,
    })
    if (!response.ok) throw new Error(`WebRTC 信令请求失败，HTTP 状态码：${response.status}`)

    const answerSdp = parseAnswerSdp(await response.text())
    await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp })
  } catch (error) {
    showError(`WebRTC 视频流初始化失败：${error instanceof Error ? error.message : String(error)}`)
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
.webrtc-player { position: relative; overflow: hidden; border-radius: 8px; background: var(--el-mask-color); }
.webrtc-video { display: block; width: 100%; height: 100%; background: var(--el-mask-color); }
.webrtc-mask { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 16px; color: var(--el-color-white); text-align: center; background: var(--el-mask-color); }
.webrtc-mask--play, .webrtc-mask--error { cursor: pointer; }
.webrtc-player-btn { display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; border: 2px solid var(--el-color-white); border-radius: 50%; transition: all 0.18s ease; }
.webrtc-mask:hover .webrtc-player-btn { background: var(--el-color-primary); border-color: var(--el-color-primary); transform: scale(1.1); }
.webrtc-mask-tip { font-size: 12px; color: var(--el-text-color-placeholder); }
.webrtc-spinner { width: 72px; height: 72px; border: 3px solid var(--el-fill-color-light); border-top-color: var(--el-color-primary); border-radius: 50%; animation: webrtc-spin 0.75s linear infinite; }
@keyframes webrtc-spin { to { transform: rotate(360deg); } }
</style>
