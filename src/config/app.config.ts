/**
 * 应用全局配置
 * 用户可以在这里自定义项目的各种配置项
 */

export const APP_CONFIG = {
  // 是否启用 MSW
  enableMSW: true,
  // MSW 监听的请求路径
  listenMSWPath: '/DFAN-admin-api',

  // 项目名称
  name: 'DFAN Admin',

  // Favicon src - 根据环境动态设置 base path
  faviconSrc: `${import.meta.env.VITE_STATIC_URL}favicon.ico`,

  // Logo src
  logoSrc: new URL('@/assets/logo.svg', import.meta.url).href,

  // 首页轮播图配置
  carousel: {
    interval: 5000, // 轮播图间隔时间
    indicatorPosition: 'outside', // 指示器位置
    items: [
      {
        id: 1, // 图片ID
        src: new URL('@/assets/animals/海豚.svg', import.meta.url).href, // 图片源
        alt: '海豚', // 图片alt
        title: '跃动海豚', // 图片标题
        description: '灵动的海豚跃出水面，线条流畅，展现海洋的自由与活力。', // 图片描述
        tags: ['海洋', '自由', '灵动', '跃起'], // 图片标签
      },
      {
        id: 2,
        src: new URL('@/assets/animals/兔子.svg', import.meta.url).href,
        alt: '兔子',
        title: '软萌兔子',
        description: '长耳软萌的小兔子，表情温柔，透着乖巧与治愈感。',
        tags: ['软萌', '温柔', '治愈', '长耳'],
      },
      {
        id: 3,
        src: new URL('@/assets/animals/小狗.svg', import.meta.url).href,
        alt: '小狗',
        title: '活力小狗',
        description: '充满好奇心的小狗，神态机灵，给人陪伴与活力的感觉。',
        tags: ['活力', '陪伴', '机灵', '友好'],
      },
      {
        id: 4,
        src: new URL('@/assets/animals/小鹿.svg', import.meta.url).href,
        alt: '小鹿',
        title: '温柔小鹿',
        description: '眼神澄澈的小鹿，线条简洁，传递森林的安静与灵气。',
        tags: ['温柔', '森林', '灵气', '安静'],
      },
      {
        id: 5,
        src: new URL('@/assets/animals/鹰.svg', import.meta.url).href,
        alt: '雄鹰',
        title: '雄鹰之姿',
        description: '展翅的雄鹰，锐利目光与展开的羽翼，彰显力量与远眺的意志。',
        tags: ['力量', '远眺', '翱翔', '锋锐'],
      },
      {
        id: 6,
        src: new URL('@/assets/animals/狐狸.svg', import.meta.url).href,
        alt: '狐狸',
        title: '灵巧狐狸',
        description: '灵巧的狐狸，带着狡黠与灵动，象征智慧与敏捷。',
        tags: ['灵巧', '狡黠', '智慧', '敏捷'],
      },
    ],
  },

  // 是否展示主题配置
  showThemeConfig: true,

  // 系统内置头像
  systemAvatar: Object.entries(import.meta.glob('@/assets/animals/*.svg', { eager: true })).map(
    ([path, module], index) => {
      const src = (module as { default: string }).default
      const fileName = path.split('/').pop()?.replace('.svg', '') ?? `avatar-${index + 1}`
      return {
        id: index + 1,
        title: fileName,
        alt: fileName,
        src,
      }
    },
  ),
}
