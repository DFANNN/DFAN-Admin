<template>
  <div :style="{ width, height }" class="native-video-player">
    <video ref="videoRef" class="native-video" :src="activeSrc" :controls="controls" :muted="muted" :autoplay="autoplay" :poster="poster" :preload="preload" playsinline webkit-playsinline="true" x5-playsinline="true" :style="{ objectFit }" @canplay="onReady" @pause="onPause" @play="onPlay" @waiting="loading = true" @error="onNativeError" />
    <div v-if="!src" class="native-video-mask">暂无视频地址</div>
    <div v-else-if="loading" class="native-video-mask"><div class="native-video-spinner" /></div>
    <div v-else-if="!hasStarted || isPaused" class="native-video-mask native-video-mask--play" @click="play"><div class="native-video-player-btn"><svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36"><path d="M8 5v14l11-7z" /></svg></div></div>
    <div v-else-if="errorMessage" class="native-video-mask native-video-mask--error" @click="reload"><div>{{ errorMessage }}</div><div class="native-video-mask-tip">点击重试</div></div>
  </div>
</template>

<script setup lang="ts">
/**
 * NativeVideoPlayer
 * 基于浏览器原生 HTMLVideoElement 封装，不依赖第三方播放器库。
 * 主要适用于 mp4、webm、ogg 等浏览器原生支持的视频文件，Safari 也可播放部分原生 HLS。
 */
interface IProps {
  // 浏览器原生支持的视频地址，例如 mp4、webm、ogg
  src: string
  // 是否自动播放，浏览器通常要求 muted=true 才允许自动播放
  autoplay?: boolean
  // 是否静音
  muted?: boolean
  // 是否显示 video 原生控制栏
  controls?: boolean
  // 视频封面图
  poster?: string
  // 预加载策略
  preload?: 'none' | 'metadata' | 'auto'
  // 视频填充方式
  objectFit?: 'contain' | 'cover' | 'fill'
  width?: string
  height?: string
}

const props = withDefaults(defineProps<IProps>(), { autoplay: false, muted: true, controls: true, poster: '', preload: 'metadata', objectFit: 'cover', width: '100%', height: '100%' })
const emit = defineEmits<{ ready: []; play: []; pause: [] }>()

const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')
const activeSrc = ref('')
const hasStarted = ref(props.autoplay)
const isPaused = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const destroy = () => {
  activeSrc.value = ''
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.removeAttribute('src')
    videoRef.value.load()
  }
  loading.value = false
  isPaused.value = false
}

const init = async () => {
  hasStarted.value = true
  errorMessage.value = ''
  destroy()
  if (!props.src) {
    errorMessage.value = '视频地址不能为空'
    return
  }
  loading.value = true
  activeSrc.value = props.src
  await nextTick()
  try {
    videoRef.value?.load()
    if (props.autoplay) await videoRef.value?.play()
  } catch {
    loading.value = false
    errorMessage.value = '视频播放失败，请检查浏览器自动播放策略或视频地址'
  }
}

const play = () => (!hasStarted.value ? init() : videoRef.value?.play())
const reload = () => init()
const onReady = () => { loading.value = false; emit('ready') }
const onPlay = () => { isPaused.value = false; loading.value = false; emit('play') }
const onPause = () => { isPaused.value = true; emit('pause') }
const onNativeError = () => { if (props.src) { loading.value = false; errorMessage.value = '视频加载失败，请确认地址是否可访问、格式是否被当前浏览器支持' } }

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
.native-video-player { position: relative; overflow: hidden; border-radius: 8px; background: var(--el-mask-color); }
.native-video { display: block; width: 100%; height: 100%; background: var(--el-mask-color); }
.native-video-mask { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 16px; color: var(--el-color-white); text-align: center; background: var(--el-mask-color); }
.native-video-mask--play, .native-video-mask--error { cursor: pointer; }
.native-video-player-btn { display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; border: 2px solid var(--el-color-white); border-radius: 50%; transition: all 0.18s ease; }
.native-video-mask:hover .native-video-player-btn { background: var(--el-color-primary); border-color: var(--el-color-primary); transform: scale(1.1); }
.native-video-mask-tip { font-size: 12px; color: var(--el-text-color-placeholder); }
.native-video-spinner { width: 72px; height: 72px; border: 3px solid var(--el-fill-color-light); border-top-color: var(--el-color-primary); border-radius: 50%; animation: native-video-spin 0.75s linear infinite; }
@keyframes native-video-spin { to { transform: rotate(360deg); } }
</style>
