import { Image, Text, View } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useMemo, useState } from 'react'
import backDark from '../../assets/icons/back-dark.png'
import shareGray from '../../assets/icons/share-gray.png'
import BottomNav from '../../components/BottomNav'
import { topicArticles, topicItems } from '../../data/content'
import './index.scss'

function formatCount(value: number) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`
  return value.toLocaleString()
}

export default function TopicPage() {
  const router = useRouter()
  const statusBarHeight = useMemo(() => Taro.getWindowInfo?.().statusBarHeight ?? 20, [])
  const [following, setFollowing] = useState(false)
  const tag = useMemo(() => {
    const rawTag = router.params.tag || topicItems[0].tag
    try {
      return decodeURIComponent(rawTag)
    } catch {
      return rawTag
    }
  }, [router.params.tag])
  const topic = topicItems.find((item) => item.tag === tag) || topicItems[0]
  const articles = useMemo(() => {
    const matched = topicArticles.filter((item) => item.tags.includes(topic.tag))
    const related = topicArticles.filter((item) => !item.tags.includes(topic.tag))
    return [...matched, ...related].slice(0, 8)
  }, [topic.tag])

  const openArticle = (id: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${id}` })
  }

  return (
    <View className='safe-page topic-page'>
      <View className='topic-nav' style={{ paddingTop: `${statusBarHeight}px` }}>
        <View className='topic-nav__bar'>
          <Image className='topic-nav__icon topic-nav__icon--inverse pressable' src={backDark} mode='aspectFit' onClick={() => Taro.navigateBack()} aria-label='返回' />
          <Text className='topic-nav__title'>专题</Text>
          <Image
            className='topic-nav__icon topic-nav__icon--inverse pressable'
            src={shareGray}
            mode='aspectFit'
            onClick={() => Taro.showShareMenu({ withShareTicket: true })}
            aria-label='分享专题'
          />
        </View>
      </View>

      <View className='topic-hero'>
        <View className='topic-hero__heading'>
          <View className='topic-hero__copy'>
            <Text className='topic-hero__title'>#{topic.tag}</Text>
            <Text className='topic-hero__description'>{topic.description}</Text>
          </View>
          <View className={`topic-follow pressable ${following ? 'is-following' : ''}`} onClick={() => setFollowing(!following)}>
            <Text>{following ? '已关注' : '关注'}</Text>
          </View>
        </View>
        <Text className='topic-hero__metrics'>128篇内容 · {formatCount(topic.views)}次浏览 · 今日更新6篇</Text>
        <View className='topic-cover'>
          <Image className='topic-cover__image' src={topic.image} mode='aspectFill' />
          <View className='topic-cover__overlay' />
          <Text className='topic-cover__caption'>看见一座城市生长的细节</Text>
        </View>
      </View>

      <View className='topic-feed'>
        <View className='topic-feed__toolbar'>
          <Text className='topic-feed__title'>专题内容</Text>
        </View>

        <View className='topic-article-list'>
          {articles.map((item) => (
            <View key={item.id} className='topic-article pressable' onClick={() => openArticle(item.id)}>
              <View className='topic-article__content'>
                <Text className='topic-article__title'>{item.title}</Text>
                <Text className='topic-article__subtitle'>{item.subtitle}</Text>
                <Text className='topic-article__meta'>{item.source} · {item.publishedAt}</Text>
              </View>
              <Image className='topic-article__image' src={item.image} mode='aspectFill' lazyLoad />
            </View>
          ))}
        </View>

        <Text className='topic-editor-note'>专题由知见编辑部整理</Text>
      </View>

      <BottomNav active='home' />
    </View>
  )
}
