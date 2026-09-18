import Taro from '@tarojs/taro'

const SESSION_KEY = 'zhijian-email-session'

export function readEmailSession() {
  try {
    const value = Taro.getStorageSync(SESSION_KEY)
    return typeof value === 'string' ? value : ''
  } catch {
    return ''
  }
}

export function saveEmailSession(email: string) {
  Taro.setStorageSync(SESSION_KEY, email)
}

export function clearEmailSession() {
  Taro.removeStorageSync(SESSION_KEY)
}
