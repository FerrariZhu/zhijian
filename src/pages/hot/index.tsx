import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo } from 'react'
import searchWhite from '../../assets/icons/search-white.png'
import BottomNav from '../../components/BottomNav'
import { realtimeHotItems } from '../../data/content'
import './index.scss'

function formatHeat(value: number) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万热度`
  return `${value.toLocaleString()}热度`
}

export default function HotPage() {
  const statusBarHeight = useMemo(() => Taro.getWindowInfo?.().statusBarHeight ?? 20, [])

  const openDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${id}` })
  }

  return (
    <View className='safe-page hot-page'>
      <View className='home-header' style={{ paddingTop: `${statusBarHeight}px` }}>
        <View className='home-header__bar'>
          <Text className='home-header__logo'>知见</Text>
          <View className='home-header__search pressable' onClick={() => Taro.showToast({ title: '搜索功能待接入', icon: 'none' })}>
            <Image className='search-icon' src={searchWhite} mode='aspectFit' />
            <Text>搜索内容</Text>
          </View>
        </View>
      </View>

      <View className='hot-tabs'>
        <View className='hot-tab pressable' onClick={() => Taro.reLaunch({ url: '/pages/home/index' })}>
          <Text>推荐</Text>
        </View>
        <View className='hot-tab is-active'>
          <Text>热点</Text>
        </View>
      </View>

      <View className='hot-ranking-header'>
        <View>
          <Text className='hot-ranking-header__title'>实时热点</Text>
          <Text className='hot-ranking-header__description'>聚合当下最受关注的新闻与公共议题</Text>
        </View>
        <View className='hot-ranking-header__status'>
          <View className='hot-ranking-header__dot' />
          <Text>实时更新</Text>
        </View>
      </View>

      <View className='hot-ranking-list'>
        {realtimeHotItems.map((item, index) => (
          <View key={item.id} className={`hot-ranking-item pressable ${index < 3 ? 'is-top' : ''}`} onClick={() => openDetail(item.id)}>
            <View className='hot-ranking-item__rank'>
              <Text>{String(index + 1).padStart(2, '0')}</Text>
            </View>
            <View className='hot-ranking-item__content'>
              <Text className='hot-ranking-item__title'>{item.title}</Text>
              <View className='hot-ranking-item__meta'>
                <Text>{formatHeat(item.heat)}</Text>
                <Text>知见热点</Text>
              </View>
            </View>
            <Text className='hot-ranking-item__chevron' aria-hidden>›</Text>
          </View>
        ))}
      </View>

      <Text className='hot-ranking-note'>榜单依据内容曝光与关注度综合生成</Text>
      <BottomNav active='home' />
    </View>
  )
}
