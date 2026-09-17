import { Image, ScrollView, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { useMemo, useState } from 'react'
import profileWhite from '../../assets/icons/profile-white.png'
import searchWhite from '../../assets/icons/search-white.png'
import BottomNav from '../../components/BottomNav'
import { feedItems, hotTopics, type ContentItem } from '../../data/content'
import './index.scss'

const channels = ['推荐', '热点', '思想', '民生', '制度']

function formatCount(value: number) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`
  return value.toLocaleString()
}

export default function HomePage() {
  const [channel, setChannel] = useState('推荐')
  const [refreshing, setRefreshing] = useState(false)
  const [hotIndex, setHotIndex] = useState(0)
  const statusBarHeight = useMemo(() => Taro.getWindowInfo?.().statusBarHeight ?? 20, [])
  const carouselItems = useMemo(
    () => [...hotTopics, ...feedItems.filter((item) => item.image)].slice(0, 5),
    []
  )

  usePullDownRefresh(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
      Taro.showToast({ title: '内容已更新', icon: 'none' })
    }, 500)
  })

  const openDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${id}` })
  }

  const renderFeedItem = (item: ContentItem) => {
    if (item.variant === 'hero-image' && item.image) {
      return (
        <View key={item.id} className='feed-item feed-item--hero pressable' onClick={() => openDetail(item.id)}>
          <Image className='feed-item__hero-image' src={item.image} mode='aspectFill' lazyLoad />
          <Text className='feed-item__title'>{item.title}</Text>
          <Text className='feed-item__summary'>{item.summary}</Text>
          <View className='feed-item__meta'>
            <Text>{item.author} · {item.publishedAt}</Text>
            <Text>{formatCount(item.likes)} 赞</Text>
          </View>
        </View>
      )
    }

    if (item.variant === 'side-image' && item.image) {
      return (
        <View key={item.id} className='feed-item feed-item--side pressable' onClick={() => openDetail(item.id)}>
          <View className='feed-item__content'>
            <Text className='feed-item__title'>{item.title}</Text>
            <Text className='feed-item__summary feed-item__summary--clamp'>{item.summary}</Text>
            <View className='feed-item__meta'>
              <Text>{item.category} · {item.publishedAt}</Text>
            </View>
          </View>
          <Image className='feed-item__side-image' src={item.image} mode='aspectFill' lazyLoad />
        </View>
      )
    }

    return (
      <View key={item.id} className='feed-item feed-item--text pressable' onClick={() => openDetail(item.id)}>
        <Text className='feed-item__title'>{item.title}</Text>
        <Text className='feed-item__summary'>{item.summary}</Text>
        <View className='feed-item__meta'>
          <Text>{item.author} · {item.publishedAt}</Text>
          <Text>{formatCount(item.reads)} 阅读</Text>
        </View>
      </View>
    )
  }

  return (
    <View className='safe-page home-page'>
      <View className='home-header' style={{ paddingTop: `${statusBarHeight}px` }}>
        <View className='home-header__bar'>
          <Text className='home-header__logo'>知见</Text>
          <View className='home-header__search pressable' onClick={() => Taro.showToast({ title: '搜索功能待接入', icon: 'none' })}>
            <Image className='search-icon' src={searchWhite} mode='aspectFit' />
            <Text>搜索内容</Text>
          </View>
          <Image className='profile-icon pressable' src={profileWhite} mode='aspectFit' aria-label='个人中心' />
        </View>
      </View>

      <ScrollView className='channel-tabs' scrollX enhanced showScrollbar={false}>
        <View className='channel-tabs__inner'>
          {channels.map((item) => (
            <View
              key={item}
              className={`channel-tab pressable ${channel === item ? 'is-active' : ''}`}
              onClick={() => setChannel(item)}
            >
              <Text>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className='home-section home-section--hot'>
        <Swiper
          className='hot-carousel'
          circular={false}
          autoplay={carouselItems.length > 1}
          indicatorDots={false}
          interval={5000}
          duration={420}
          current={0}
          onChange={(event) => setHotIndex(event.detail.current)}
        >
          {carouselItems.map((item) => (
            <SwiperItem key={item.id}>
              <View className='hot-slide pressable' onClick={() => openDetail(item.id)}>
                <Image className='hot-slide__image' src={item.image!} mode='aspectFill' />
                <View className='hot-slide__caption'>
                  <View className='hot-slide__title-wrap'>
                    <Text className='hot-slide__label'>热点</Text>
                    <Text className='hot-slide__title'>{item.title}</Text>
                  </View>
                  <View className='hot-slide__counter'>
                    <Text className='hot-slide__current'>{String(hotIndex + 1).padStart(2, '0')}</Text>
                    <Text className='hot-slide__total'>/ {String(carouselItems.length).padStart(2, '0')}</Text>
                  </View>
                </View>
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>

      <View className='home-section home-section--feed'>
        <View className='home-section__heading-row'>
          <Text className='home-section__title'>最新内容</Text>
          {refreshing && <Text className='home-section__more'>更新中…</Text>}
        </View>
        <View className='feed-list'>{feedItems.map(renderFeedItem)}</View>
      </View>

      <BottomNav active='home' />
    </View>
  )
}
