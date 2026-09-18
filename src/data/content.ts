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

export interface RealtimeHotItem {
  id: string
  title: string
  heat: number
}

export interface TopicItem {
  tag: string
  image: string
  description: string
  views: number
}

export interface TopicArticle {
  id: string
  title: string
  subtitle: string
  source: string
  publishedAt: string
  image: string
  tags: string[]
  reads: number
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

export const realtimeHotItems: RealtimeHotItem[] = [
  { id: 'hot-01', title: '多地加快推进城市更新行动', heat: 3268000 },
  { id: 'hot-02', title: '新一轮促消费政策持续落地', heat: 2841000 },
  { id: 'hot-03', title: '人工智能赋能公共服务', heat: 1976000 },
  { id: 'hot-04', title: '秋季文旅市场热度攀升', heat: 1264000 },
  { id: 'hot-05', title: '社区养老服务再升级', heat: 987000 },
  { id: 'hot-06', title: '教育均衡发展迈上新台阶', heat: 853000 },
  { id: 'hot-07', title: '县域商业体系加快完善', heat: 796000 },
  { id: 'hot-08', title: '绿色出行成为城市新风尚', heat: 742000 },
  { id: 'hot-09', title: '传统文化焕发年轻活力', heat: 689000 },
  { id: 'hot-10', title: '基层医疗服务能力持续提升', heat: 631000 },
  { id: 'hot-11', title: '乡村特色产业释放新动能', heat: 587000 },
  { id: 'hot-12', title: '公共文化空间延伸到社区', heat: 542000 },
  { id: 'hot-13', title: '数字技术助力中小企业转型', heat: 496000 },
  { id: 'hot-14', title: '更多口袋公园建在家门口', heat: 451000 },
  { id: 'hot-15', title: '城市夜间消费场景不断丰富', heat: 407000 },
  { id: 'hot-16', title: '青年人才服务体系继续完善', heat: 365000 },
  { id: 'hot-17', title: '老旧小区适老化改造提速', heat: 328000 },
  { id: 'hot-18', title: '全民健身公共设施持续扩容', heat: 296000 },
  { id: 'hot-19', title: '公共交通服务覆盖更多乡镇', heat: 267000 },
  { id: 'hot-20', title: '社区食堂探索可持续运营', heat: 238000 }
]

export const topicItems: TopicItem[] = [
  { tag: '城市更新', image: timeWindow, description: '看见城市空间与社区生活的持续变化', views: 326000 },
  { tag: '人工智能', image: dialogueRoom, description: '关注技术如何改变产业与公共服务', views: 284000 },
  { tag: '民生保障', image: commonGround, description: '记录与每个人息息相关的生活改善', views: 251000 },
  { tag: '基层治理', image: roundtable, description: '观察社区协商与公共治理实践', views: 197000 },
  { tag: '文化传承', image: dialogueRoom, description: '发现传统文化的当代表达', views: 168000 },
  { tag: '绿色发展', image: timeWindow, description: '追踪低碳转型与生态建设', views: 146000 },
  { tag: '教育观察', image: roundtable, description: '关注教育公平与人才成长', views: 128000 },
  { tag: '健康生活', image: commonGround, description: '提供可靠实用的健康资讯', views: 116000 },
  { tag: '乡村振兴', image: timeWindow, description: '记录乡村产业与生活新图景', views: 98700 }
]

export const topicArticles: TopicArticle[] = [
  {
    id: 'topic-01',
    title: '老街改造，留住烟火气也更新生活',
    subtitle: '从基础设施到公共空间，一场温和的城市更新正在发生',
    source: '城市早报',
    publishedAt: '2小时前',
    image: commonGround,
    tags: ['城市更新', '民生保障'],
    reads: 18642
  },
  {
    id: 'topic-02',
    title: '城市更新不只是拆旧建新',
    subtitle: '公共服务与居民参与，成为衡量更新质量的新尺度',
    source: '知见观察',
    publishedAt: '5小时前',
    image: roundtable,
    tags: ['城市更新', '基层治理'],
    reads: 15320
  },
  {
    id: 'topic-03',
    title: '口袋公园，让绿色走进日常',
    subtitle: '闲置边角地变身家门口的休闲空间',
    source: '绿色中国',
    publishedAt: '昨天',
    image: timeWindow,
    tags: ['城市更新', '绿色发展', '健康生活'],
    reads: 13691
  },
  {
    id: 'topic-04',
    title: '历史街区如何兼顾保护与发展',
    subtitle: '传统风貌、商业活力与居民生活需要找到平衡',
    source: '文脉周刊',
    publishedAt: '2天前',
    image: dialogueRoom,
    tags: ['城市更新', '文化传承'],
    reads: 12408
  },
  {
    id: 'topic-05',
    title: '适老化改造进入更多老旧社区',
    subtitle: '坡道、电梯与休息空间，让出行更有安全感',
    source: '民生热线',
    publishedAt: '2天前',
    image: commonGround,
    tags: ['城市更新', '民生保障', '健康生活'],
    reads: 11205
  },
  {
    id: 'topic-06',
    title: 'AI如何真正走进公共服务',
    subtitle: '从办事大厅到社区服务，智能技术正在进入真实场景',
    source: '知见科技',
    publishedAt: '3天前',
    image: dialogueRoom,
    tags: ['人工智能', '基层治理'],
    reads: 10987
  },
  {
    id: 'topic-07',
    title: '年轻人正在重新发现传统手艺',
    subtitle: '非遗直播与现代设计，让古老技艺获得新的观众',
    source: '文化观察',
    publishedAt: '3天前',
    image: roundtable,
    tags: ['文化传承'],
    reads: 9680
  },
  {
    id: 'topic-08',
    title: '乡村特色产业释放新动能',
    subtitle: '一县一业持续成长，更多年轻人选择返乡创业',
    source: '乡村纪事',
    publishedAt: '4天前',
    image: timeWindow,
    tags: ['乡村振兴'],
    reads: 8642
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
