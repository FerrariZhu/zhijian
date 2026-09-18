import { Image, Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useMemo, useState } from 'react'
import backDark from '../../assets/icons/back-dark.png'
import { listFavoriteArticles, type FavoriteArticle } from '../../favorites'
import './index.scss'

export default function FavoritesPage() {
  const statusBarHeight = useMemo(() => Taro.getWindowInfo?.().statusBarHeight ?? 20, [])
  const [items, setItems] = useState<FavoriteArticle[]>(() => listFavoriteArticles())

  useDidShow(() => {
    setItems(listFavoriteArticles())
  })

  const goBack = () => {
    Taro.navigateBack({
      fail: () => {
        Taro.reLaunch({ url: '/pages/profile/index' })
      }
    })
  }

  return (
    <View className='safe-page favorites-page'>
      <View className='favorites-nav' style={{ paddingTop: `${statusBarHeight}px` }}>
        <View className='favorites-nav__bar'>
          <Image className='favorites-nav__back pressable' src={backDark} mode='aspectFit' onClick={goBack} aria-label='返回' />
          <Text className='favorites-nav__title'>我的收藏</Text>
          <View />
        </View>
      </View>

      {items.length ? (
        <View className='favorite-list'>
          {items.map((item) => (
            <View
              key={item.id}
              className='favorite-item pressable'
              onClick={() => Taro.navigateTo({ url: `/pages/detail/index?id=${item.id}` })}
            >
              <View className='favorite-item__content'>
                <Text className='favorite-item__title'>{item.title}</Text>
                <Text className='favorite-item__subtitle'>{item.subtitle}</Text>
              </View>
              {item.image && <Image className='favorite-item__image' src={item.image} mode='aspectFill' />}
            </View>
          ))}
        </View>
      ) : (
        <View className='favorites-empty'>
          <Text className='favorites-empty__title'>还没有收藏</Text>
          <Text className='favorites-empty__hint'>在文章页点收藏后，会出现在这里</Text>
        </View>
      )}
    </View>
  )
}
