import dialogueRoom from '../assets/dialogue-room.png'
import commonGround from '../assets/common-ground.png'
import roundtable from '../assets/roundtable.png'
import timeWindow from '../assets/time-window.png'

export type FeedVariant = 'text' | 'side-image' | 'hero-image'

export interface ContentItem {
  id: string
  title: string
  summary: string
  hook: string
  author: string
  region?: string
  publishedAt: string
  category: string
  image?: string
  variant: FeedVariant
  reads: number
  likes: number
}

export interface CommentItem {
  floor: number
  name: string
  region: string
  body: string
  likes: number
  reply?: {
    name: string
    body: string
  }
}

export const hotTopics: ContentItem[] = [
  {
    id: '01',
    title: '第一次，有人把“一国两制台湾方案”摆上桌面细谈',
    summary: '方案未必成熟，但“开始谈”本身重要吗？',
    hook: '一个“不成熟的开始”，会不会比长期沉默更有价值？',
    author: '知见编辑部',
    publishedAt: '今天 09:30',
    category: '当日热点',
    image: dialogueRoom,
    variant: 'hero-image',
    reads: 18642,
    likes: 1286
  },
  {
    id: '02',
    title: '有些词，在一边是制度概念，在另一边却先触发情绪',
    summary: '台湾学者走进“深水区”，到底难在哪里？',
    hook: '真正的“深水区”，也许是连问题都很难被说出口。',
    author: '知见观察',
    publishedAt: '今天 08:45',
    category: '两岸对话',
    image: commonGround,
    variant: 'hero-image',
    reads: 15320,
    likes: 932
  },
  {
    id: '10',
    title: '力量结构一直在变，谈判条件不会永远停在今天',
    summary: '和平统一方案，要不要先算“时间账”？',
    hook: '今天还能谈的条件，五年后还会原封不动地留在桌上吗？',
    author: '知见编辑部',
    publishedAt: '昨天 20:10',
    category: '局势',
    image: timeWindow,
    variant: 'hero-image',
    reads: 12408,
    likes: 766
  }
]

export const feedItems: ContentItem[] = [
  {
    id: '03',
    title: '“一国”与“两制”，谁是前提？',
    summary: '争论最激烈的第一道题：自治权从哪里来？',
    hook: '如果双方对起点的定义不同，细节谈得越多，会不会离共识越远？',
    author: '知见编辑部',
    publishedAt: '12 分钟前',
    category: '制度观察',
    variant: 'text',
    reads: 8642,
    likes: 534
  },
  {
    id: '06',
    title: '统一后“保留什么”，还是“解决什么”？',
    summary: '有人谈制度保留，有人更关心食安、工安、住房和教育。',
    hook: '决定普通人态度的，究竟是制度标签，还是一日三餐与下一代的生活？',
    author: '知见民生',
    publishedAt: '1 小时前',
    category: '民生',
    image: commonGround,
    variant: 'side-image',
    reads: 11205,
    likes: 871
  },
  {
    id: '07',
    title: '谁能代表台湾普通人的利益？',
    summary: '学者、政客、名嘴、资本，还是沉默的大多数？',
    hook: '公共讨论里声音最大的人，真的就是利益最需要被看见的人吗？',
    author: '知见观察',
    publishedAt: '2 小时前',
    category: '公共讨论',
    image: roundtable,
    variant: 'hero-image',
    reads: 13691,
    likes: 1024
  },
  {
    id: '05',
    title: '“可信承诺”为什么必须是双向的？',
    summary: '台湾担心安排被改变，大陆也担心统一被架空。',
    hook: '真正的安全感，是一方保证不变，还是双方都有清晰可验证的约束？',
    author: '知见编辑部',
    publishedAt: '3 小时前',
    category: '观点',
    variant: 'text',
    reads: 9680,
    likes: 611
  },
  {
    id: '09',
    title: '驻军、外交、国安：哪些问题不能模糊？',
    summary: '评论区公认的“硬边界”，其实比想象中集中。',
    hook: '没有清晰的安全边界，其他制度承诺能否真正稳定运行？',
    author: '知见观察',
    publishedAt: '4 小时前',
    category: '国家安全',
    image: dialogueRoom,
    variant: 'side-image',
    reads: 10123,
    likes: 705
  }
]

export const article = {
  id: '01',
  title: '一场两岸民间对话实验：一个“不成熟的开始”，为何仍有价值？',
  subtitle: '当口号被拆成主权、自治、司法、国安与普通人的生活，真正的讨论才刚刚开始。',
  author: '知见编辑部',
  publishedAt: '2026-09-17 09:30',
  image: dialogueRoom,
  paragraphs: [
    '这场讨论最受关注的判断，并不是某一条制度设计已经找到了标准答案，而是过去被口号覆盖的问题，终于开始被逐项摆到桌面上。',
    '有人把这种变化形容为两个边缘平滑、颜色不同的色块，接触面第一次出现了细齿。观点不同的人开始听见彼此真实的担心：台湾关心自治安排能否持续，大陆关心国家主权、安全边界与履约风险。',
    '分歧很快进入“深水区”。自治权从哪里来？统一后的权利清单之外，是否还应有一张责任清单？制度安排最终能否改善食安、住房、教育和公共建设？这些问题都无法只靠一句口号回答。',
    '讨论也提醒我们，可信承诺必须是双向的。理解与包容不应长期只是单向要求；稳定的制度安排，需要双方都能看见、理解并验证对方承担的责任。',
    '方案当然可以继续批评。但提出假设、接受验证、继续修正，才可能一步步接近答案。一个不成熟的开始，或许仍然比长期沉默更有价值。'
  ],
  tags: ['两岸对话', '公共讨论', '制度观察'],
  reads: 18642,
  likes: 1286
}

export const comments: CommentItem[] = [
  {
    floor: 1,
    name: '丁多',
    region: '湖北',
    body: '过去双方像两个边缘平滑、颜色不同的色块。现在接触面出现了细齿，彼此终于开始听见真实想法。',
    likes: 328
  },
  {
    floor: 2,
    name: '小白杨',
    region: '山东',
    body: '观点不同可以坐在一起交流，能一起交流就是巨大的进步。',
    likes: 241,
    reply: {
      name: '知见编辑部',
      body: '把分歧说清楚，正是形成共识的第一步。'
    }
  },
  {
    floor: 3,
    name: '溪五侠',
    region: '江苏',
    body: '方案本身可以继续批评，但希望这种讨论在岛内产生先驱作用。',
    likes: 187
  },
  {
    floor: 4,
    name: 'jinjin',
    region: '广东',
    body: '探索可能会犯错，但提出假设、接受验证、继续修正，才可能一步步接近答案。',
    likes: 156
  }
]
