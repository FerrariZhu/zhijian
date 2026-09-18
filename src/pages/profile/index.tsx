import { Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useMemo, useState } from 'react'
import BottomNav from '../../components/BottomNav'
import { clearEmailSession, readEmailSession } from '../../session'
import './index.scss'

export default function ProfilePage() {
  const statusBarHeight = useMemo(() => Taro.getWindowInfo?.().statusBarHeight ?? 20, [])
  const [email, setEmail] = useState(readEmailSession)

  useDidShow(() => {
    setEmail(readEmailSession())
  })

  const openLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' })
  }

  const logout = () => {
    clearEmailSession()
    setEmail('')
    Taro.showToast({ title: '已退出登录', icon: 'none' })
  }

  const displayName = email ? email.split('@')[0] : ''

  return (
    <View className='safe-page profile-page'>
      <View className='profile-nav' style={{ paddingTop: `${statusBarHeight}px` }}>
        <View className='profile-nav__bar'>
          <Text className='profile-nav__title'>我的</Text>
        </View>
      </View>

      <View className='profile-main'>
        {email ? (
          <View className='profile-card'>
            <View className='profile-avatar'>{displayName.slice(0, 1).toUpperCase()}</View>
            <View className='profile-identity'>
              <Text className='profile-identity__name'>{displayName}</Text>
              <Text className='profile-identity__email'>{email}</Text>
            </View>
          </View>
        ) : (
          <View className='profile-card profile-card--guest'>
            <View className='profile-avatar'>知</View>
            <View className='profile-identity'>
              <Text className='profile-identity__name'>未登录</Text>
              <Text className='profile-identity__email'>登录后查看账号</Text>
            </View>
            <View className='profile-login pressable' onClick={openLogin}>
              <Text>邮箱登录</Text>
            </View>
          </View>
        )}

        {email && (
          <View className='profile-menu'>
            <View className='profile-row pressable' onClick={() => Taro.navigateTo({ url: '/pages/favorites/index' })}>
              <Text className='profile-row__title'>我的收藏</Text>
            </View>
            <View className='profile-row pressable' onClick={logout}>
              <Text className='profile-row__title'>退出登录</Text>
            </View>
          </View>
        )}
      </View>

      <BottomNav active='profile' />
    </View>
  )
}
