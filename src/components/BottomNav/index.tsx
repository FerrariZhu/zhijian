import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import homeGray from '../../assets/icons/home-gray.png'
import homeRed from '../../assets/icons/home-red.png'
import messageGray from '../../assets/icons/message-gray.png'
import profileGray from '../../assets/icons/profile-gray.png'
import submitPlus from '../../assets/icons/submit-plus.png'
import topicGray from '../../assets/icons/topic-gray.png'
import './index.scss'

type NavKey = 'home' | 'topic' | 'submit' | 'message' | 'profile'

interface BottomNavProps {
  active: NavKey
}

const items: Array<{ key: NavKey; label: string; icon: string; activeIcon?: string }> = [
  { key: 'home', label: '首页', icon: homeGray, activeIcon: homeRed },
  { key: 'topic', label: '专题', icon: topicGray },
  { key: 'submit', label: '投稿', icon: submitPlus },
  { key: 'message', label: '消息', icon: messageGray },
  { key: 'profile', label: '我的', icon: profileGray }
]

export default function BottomNav({ active }: BottomNavProps) {
  const handleNavigate = (key: NavKey) => {
    if (key === active) return

    if (key === 'submit') {
      Taro.navigateTo({ url: '/pages/submit/index' })
      return
    }

    if (key === 'home') {
      Taro.reLaunch({ url: '/pages/home/index' })
      return
    }

    Taro.showToast({ title: 'Demo 阶段暂未开放', icon: 'none' })
  }

  return (
    <View className='bottom-nav'>
      {items.map((item) => {
        const isSubmit = item.key === 'submit'
        const selected = item.key === active
        return (
          <View
            key={item.key}
            className={`bottom-nav__item pressable ${selected ? 'is-active' : ''}`}
            onClick={() => handleNavigate(item.key)}
            aria-label={item.label}
          >
            <Image
              className={`bottom-nav__icon ${isSubmit ? 'bottom-nav__icon--submit' : ''}`}
              src={selected && item.activeIcon ? item.activeIcon : item.icon}
              mode='aspectFit'
            />
            <Text className='bottom-nav__label'>{item.label}</Text>
          </View>
        )
      })}
    </View>
  )
}
