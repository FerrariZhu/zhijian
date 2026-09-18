import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import homeGray from '../../assets/icons/home-gray.png'
import homeRed from '../../assets/icons/home-red.png'
import messageGray from '../../assets/icons/message-gray.png'
import messageRed from '../../assets/icons/message-red.png'
import profileGray from '../../assets/icons/profile-gray.png'
import profileRed from '../../assets/icons/profile-red.png'
import './index.scss'

type NavKey = 'home' | 'contact' | 'profile'

interface BottomNavProps {
  active: NavKey
}

const items: Array<{ key: NavKey; label: string; icon: string; activeIcon?: string }> = [
  { key: 'home', label: '首页', icon: homeGray, activeIcon: homeRed },
  { key: 'contact', label: '联系我们', icon: messageGray, activeIcon: messageRed },
  { key: 'profile', label: '我的', icon: profileGray, activeIcon: profileRed }
]

export default function BottomNav({ active }: BottomNavProps) {
  const [contactVisible, setContactVisible] = useState(false)

  const handleNavigate = (key: NavKey) => {
    if (key === active) return

    if (key === 'contact') {
      setContactVisible(true)
      return
    }

    if (key === 'home') {
      Taro.reLaunch({ url: '/pages/home/index' })
      return
    }

    Taro.navigateTo({ url: '/pages/profile/index' })
  }

  return (
    <>
      <View className='bottom-nav'>
        {items.map((item) => {
          const selected = item.key === active
          return (
            <View
              key={item.key}
              className={`bottom-nav__item pressable ${selected ? 'is-active' : ''}`}
              onClick={() => handleNavigate(item.key)}
              aria-label={item.label}
            >
              <Image
                className='bottom-nav__icon'
                src={selected && item.activeIcon ? item.activeIcon : item.icon}
                mode='aspectFit'
              />
              <Text className='bottom-nav__label'>{item.label}</Text>
            </View>
          )
        })}
      </View>

      {contactVisible && (
        <View className='contact-modal' onClick={() => setContactVisible(false)}>
          <View className='contact-card' onClick={(event) => event.stopPropagation()} role='dialog' aria-label='联系我们'>
            <View className='contact-card__accent' />
            <Text className='contact-card__eyebrow'>一起，让理解发生</Text>
            <Text className='contact-card__title'>联系我们</Text>
            <Text className='contact-card__intro'>
              我们正在搭建一个面向海峡两岸的公共交流平台，希望通过真实的信息、理性的讨论和多元的视角，减少误解、增进理解，在共同关切的问题上逐步凝聚共识。
            </Text>
            <Text className='contact-card__intro contact-card__intro--secondary'>
              如果你也有观察、经历或思考，欢迎分享你的声音，为两岸更深入的理解与交流贡献一份力量。
            </Text>

            <View className='contact-card__details'>
              <View className='contact-detail'>
                <Text className='contact-detail__label'>邮箱</Text>
                <Text className='contact-detail__value' selectable>zhenzhizhuojian84@163.com</Text>
              </View>
            </View>

            <View className='contact-card__close pressable' onClick={() => setContactVisible(false)}>
              <Text>知道了</Text>
            </View>
          </View>
        </View>
      )}
    </>
  )
}
