import { Image, Input, Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useMemo, useState } from 'react'
import backDark from '../../assets/icons/back-dark.png'
import { readEmailSession, saveEmailSession } from '../../session'
import './index.scss'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const statusBarHeight = useMemo(() => Taro.getWindowInfo?.().statusBarHeight ?? 20, [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useDidShow(() => {
    if (readEmailSession()) {
      Taro.redirectTo({ url: '/pages/profile/index' })
    }
  })

  const goBack = () => {
    Taro.navigateBack({
      fail: () => {
        Taro.reLaunch({ url: '/pages/home/index' })
      }
    })
  }

  const handleEmail = (value: string) => {
    setEmail(value)
    if (emailError) setEmailError('')
  }

  const handlePassword = (value: string) => {
    setPassword(value)
    if (passwordError) setPasswordError('')
  }

  const login = () => {
    const nextEmail = email.trim().toLowerCase()
    const nextEmailError = !nextEmail ? '请输入邮箱' : EMAIL_PATTERN.test(nextEmail) ? '' : '请输入正确的邮箱地址'
    const nextPasswordError = !password ? '请输入密码' : password.length < 6 ? '密码至少 6 位' : ''

    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    if (nextEmailError || nextPasswordError) return

    saveEmailSession(nextEmail)
    setPassword('')
    Taro.showToast({ title: '登录成功', icon: 'success' })
    Taro.navigateBack({
      fail: () => {
        Taro.redirectTo({ url: '/pages/profile/index' })
      }
    })
  }

  return (
    <View className='safe-page login-page'>
      <View className='login-nav' style={{ paddingTop: `${statusBarHeight}px` }}>
        <View className='login-nav__bar'>
          <Image className='login-nav__back pressable' src={backDark} mode='aspectFit' onClick={goBack} aria-label='返回' />
          <Text className='login-nav__title'>登录</Text>
          <View />
        </View>
      </View>

      <View className='login-body'>
        <View className='login-mark' />
        <Text className='login-brand'>知见</Text>

        <View className='login-form'>
          <Text className='login-title'>邮箱登录</Text>
          <Text className='login-subtitle'>仅支持邮箱和密码，不提供其他登录方式</Text>

          <View className='login-field'>
            <Text className='login-field__label'>邮箱</Text>
            <Input
              className='login-field__input'
              type='text'
              value={email}
              maxlength={80}
              placeholder='name@example.com'
              onInput={(event) => handleEmail(event.detail.value)}
            />
            {emailError && <Text className='login-field__error'>{emailError}</Text>}
          </View>

          <View className='login-field'>
            <Text className='login-field__label'>密码</Text>
            <Input
              className='login-field__input'
              password
              value={password}
              maxlength={32}
              placeholder='至少 6 位'
              onInput={(event) => handlePassword(event.detail.value)}
            />
            {passwordError && <Text className='login-field__error'>{passwordError}</Text>}
          </View>

          <View className='login-submit pressable' onClick={login}>
            <Text>登录</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
