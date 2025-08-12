import { createApp } from 'vue'
import '@/assets/common.css'
import 'ant-design-vue/dist/reset.css'
import router from '@/router/index'
import App from './App.vue'

const app = createApp(App)

app.use(router)

app.mount('#app')
