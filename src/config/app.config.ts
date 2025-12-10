/**
 * 应用全局配置
 * 用户可以在这里自定义项目的各种配置项
 */

export const APP_CONFIG = {
  // 项目名称
  name: 'CAT Admin',

  // Favicon src
  faviconSrc: '/favicon.ico',

  // Logo src
  logoSrc: new URL('@/assets/logo.svg', import.meta.url).href,

  // 首页轮播图配置
  carousel: {
    interval: 5000, // 轮播图间隔时间
    indicatorPosition: 'outside', // 指示器位置
    items: [
      {
        id: 1, // 图片ID
        src: new URL('@/assets/cats/白猫.svg', import.meta.url).href, // 图片源
        alt: '白猫', // 图片alt
        title: '白猫', // 图片标题
        description: '纯白色的猫咪，毛色纯净如雪，优雅高贵，是许多人心目中的理想宠物。', // 图片描述
        tags: ['纯白', '优雅', '高贵', '温顺'], // 图片标签
      },
      {
        id: 2,
        src: new URL('@/assets/cats/黑猫.svg', import.meta.url).href,
        alt: '黑猫',
        title: '黑猫',
        description: '全身黑色的猫咪，神秘而优雅，在阳光下会呈现出深棕色的光泽。',
        tags: ['神秘', '优雅', '独立', '聪明'],
      },
      {
        id: 3,
        src: new URL('@/assets/cats/黄猫.svg', import.meta.url).href,
        alt: '黄猫',
        title: '黄猫',
        description: '金黄色或橘黄色的猫咪，温暖明亮，性格通常活泼开朗。',
        tags: ['温暖', '活泼', '开朗', '友好'],
      },
      {
        id: 4,
        src: new URL('@/assets/cats/橘猫.svg', import.meta.url).href,
        alt: '橘猫',
        title: '橘猫',
        description: '橘色或橙色的猫咪，以贪吃和亲人著称，是最受欢迎的猫咪之一。',
        tags: ['贪吃', '亲人', '活泼', '可爱'],
      },
      {
        id: 5,
        src: new URL('@/assets/cats/蓝猫.svg', import.meta.url).href,
        alt: '蓝猫',
        title: '蓝猫',
        description: '蓝灰色毛发的猫咪，通常指俄罗斯蓝猫或英国短毛猫，性格温和安静。',
        tags: ['温和', '安静', '优雅', '忠诚'],
      },
      {
        id: 6,
        src: new URL('@/assets/cats/三花猫.svg', import.meta.url).href,
        alt: '三花猫',
        title: '三花猫',
        description: '拥有白色、黑色和橘色三种颜色的猫咪，几乎都是母猫，性格独立而聪明。',
        tags: ['三色', '独立', '聪明', '活泼'],
      },
      {
        id: 7,
        src: new URL('@/assets/cats/牛奶猫.svg', import.meta.url).href,
        alt: '牛奶猫',
        title: '牛奶猫',
        description: '黑白相间的猫咪，像奶牛一样的花色，性格温和友善，是很好的家庭宠物。',
        tags: ['黑白', '温和', '友善', '亲人'],
      },
      {
        id: 8,
        src: new URL('@/assets/cats/布偶猫.svg', import.meta.url).href,
        alt: '布偶猫',
        title: '布偶猫',
        description: '大型长毛猫品种，性格温顺如布偶，喜欢被抱着，是理想的室内宠物。',
        tags: ['大型', '长毛', '温顺', '亲人'],
      },
      {
        id: 9,
        src: new URL('@/assets/cats/英短猫.svg', import.meta.url).href,
        alt: '英短猫',
        title: '英短猫',
        description: '英国短毛猫，圆脸圆眼，性格温和安静，适应能力强，是优秀的家庭伴侣。',
        tags: ['圆脸', '温和', '安静', '适应性强'],
      },
      {
        id: 10,
        src: new URL('@/assets/cats/美短猫.svg', import.meta.url).href,
        alt: '美短猫',
        title: '美短猫',
        description: '美国短毛猫，体格健壮，性格活泼友好，喜欢与人互动，是很好的玩伴。',
        tags: ['健壮', '活泼', '友好', '聪明'],
      },
      {
        id: 11,
        src: new URL('@/assets/cats/缅因猫.svg', import.meta.url).href,
        alt: '缅因猫',
        title: '缅因猫',
        description: '大型长毛猫，体型巨大，性格温和友善，被称为"温柔的巨人"。',
        tags: ['大型', '长毛', '温和', '友善'],
      },
      {
        id: 12,
        src: new URL('@/assets/cats/波斯猫.svg', import.meta.url).href,
        alt: '波斯猫',
        title: '波斯猫',
        description: '长毛猫品种，面部扁平，性格安静优雅，需要定期梳理毛发。',
        tags: ['长毛', '优雅', '安静', '高贵'],
      },
      {
        id: 13,
        src: new URL('@/assets/cats/暹罗猫.svg', import.meta.url).href,
        alt: '暹罗猫',
        title: '暹罗猫',
        description: '原产于泰国的短毛猫，性格活泼好动，喜欢与人交流，声音洪亮。',
        tags: ['活泼', '好动', '爱叫', '聪明'],
      },
      {
        id: 14,
        src: new URL('@/assets/cats/无毛猫.svg', import.meta.url).href,
        alt: '无毛猫',
        title: '无毛猫',
        description: '斯芬克斯猫，全身几乎无毛，皮肤温暖，性格温顺亲人，需要特殊护理。',
        tags: ['无毛', '温顺', '亲人', '特殊护理'],
      },
      {
        id: 15,
        src: new URL('@/assets/cats/田园猫.svg', import.meta.url).href,
        alt: '田园猫',
        title: '田园猫',
        description: '中华田园猫，适应能力强，性格独立，是常见的家猫品种。',
        tags: ['适应性强', '独立', '聪明', '健康'],
      },
      {
        id: 16,
        src: new URL('@/assets/cats/猫.svg', import.meta.url).href,
        alt: '猫',
        title: '猫',
        description: '通用猫咪形象，代表所有猫咪的可爱和神秘特质。',
        tags: ['可爱', '神秘', '独立', '优雅'],
      },
      {
        id: 17,
        src: new URL('@/assets/cats/眯眯眼猫.svg', import.meta.url).href,
        alt: '眯眯眼猫',
        title: '眯眯眼猫',
        description: '眼睛眯成一条缝的猫咪，表情可爱呆萌，通常表示满足和放松。',
        tags: ['可爱', '呆萌', '满足', '放松'],
      },
      {
        id: 18,
        src: new URL('@/assets/cats/傻猫.svg', import.meta.url).href,
        alt: '傻猫',
        title: '傻猫',
        description: '表情呆萌可爱的猫咪，看起来傻乎乎的，但实际上非常聪明有趣。',
        tags: ['呆萌', '可爱', '有趣', '聪明'],
      },
      {
        id: 19,
        src: new URL('@/assets/cats/博学猫 .svg', import.meta.url).href,
        alt: '博学猫',
        title: '博学猫',
        description: '戴着眼镜的博学猫咪，象征智慧和知识，是爱学习的猫咪形象。',
        tags: ['博学', '智慧', '知识', '学者'],
      },
    ],
  },

  // 是否展示主题配置
  showThemeConfig: true,
}
