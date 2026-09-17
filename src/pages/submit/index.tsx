import { Button, Image, Input, Switch, Text, Textarea, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo, useState } from 'react'
import aiPenRed from '../../assets/icons/ai-pen-red.png'
import boldDark from '../../assets/icons/bold-dark.png'
import cameraRed from '../../assets/icons/camera-red.png'
import chevronGray from '../../assets/icons/chevron-gray.png'
import imageGray from '../../assets/icons/image-gray.png'
import linkDark from '../../assets/icons/link-dark.png'
import listDark from '../../assets/icons/list-dark.png'
import quoteDark from '../../assets/icons/quote-dark.png'
import './index.scss'

const initialBody = '这是一场从普通人视角出发的观察。真正值得记录的，不只是一个结论，而是人们如何提出问题、理解分歧，并尝试在现实生活中寻找答案。'

export default function SubmitPage() {
  const [title, setTitle] = useState('一场两岸民间对话实验')
  const [subtitle, setSubtitle] = useState('当分歧被正式写在桌面上，真正的讨论才刚刚开始')
  const [body, setBody] = useState(initialBody)
  const [cover, setCover] = useState('')
  const [original, setOriginal] = useState(true)
  const [aiWorking, setAiWorking] = useState<'photo' | 'rewrite' | null>(null)
  const [savedAt, setSavedAt] = useState('刚刚')
  const statusBarHeight = useMemo(() => Taro.getWindowInfo?.().statusBarHeight ?? 20, [])

  const runPhotoToArticle = async () => {
    try {
      const result = await Taro.chooseImage({ count: 1, sourceType: ['camera', 'album'] })
      const imagePath = result.tempFilePaths[0]
      if (!imagePath) return

      setCover(imagePath)
      setAiWorking('photo')
      setTimeout(() => {
        setTitle('镜头里的现场：从一次相遇开始记录')
        setSubtitle('AI 已根据照片识别场景并生成可继续编辑的初稿')
        setBody('照片记录下一个正在发生的现场。画面中的人物、空间与细节共同构成了故事的起点。\n\nAI 已完成基础场景识别，并把视觉线索整理为初稿。请继续补充事件背景、人物身份与现场感受，让内容更准确、更有温度。')
        setAiWorking(null)
        setSavedAt('刚刚')
        Taro.showToast({ title: '初稿已生成', icon: 'success' })
      }, 700)
    } catch {
      Taro.showToast({ title: '已取消选择', icon: 'none' })
    }
  }

  const runRewrite = () => {
    if (!body.trim()) {
      Taro.showToast({ title: '请先输入正文', icon: 'none' })
      return
    }

    setAiWorking('rewrite')
    setTimeout(() => {
      setBody(`${body.trim()}\n\n真正有价值的公共讨论，不是迅速消除所有差异，而是让每一种关切都能被看见、被理解，并转化为可以继续验证的问题。`)
      setAiWorking(null)
      setSavedAt('刚刚')
      Taro.showToast({ title: '表达已优化', icon: 'success' })
    }, 600)
  }

  const saveDraft = () => {
    setSavedAt('刚刚')
    Taro.showToast({ title: '草稿已保存', icon: 'success' })
  }

  const submit = () => {
    if (!title.trim() || !body.trim()) {
      Taro.showToast({ title: '请完善标题和正文', icon: 'none' })
      return
    }
    Taro.showModal({
      title: '提交审核',
      content: '投稿提交后将进入内容审核，是否继续？',
      confirmColor: '#E9271C',
      success: ({ confirm }) => {
        if (confirm) Taro.showToast({ title: '投稿成功', icon: 'success' })
      }
    })
  }

  return (
    <View className='safe-page submit-page'>
      <View className='submit-nav' style={{ paddingTop: `${statusBarHeight}px` }}>
        <View className='submit-nav__bar'>
          <Text className='submit-nav__action pressable' onClick={() => Taro.navigateBack()}>取消</Text>
          <Text className='submit-nav__title'>投稿</Text>
          <Text className='submit-nav__action submit-nav__action--primary pressable' onClick={() => Taro.showToast({ title: '预览已更新', icon: 'none' })}>预览</Text>
        </View>
      </View>

      <View className='submit-content'>
        <View className='ai-section'>
          <View className='submit-section-title'>
            <Text className='submit-section-title__main'>AI 创作助手</Text>
            <Text className='submit-section-title__sub'>从素材到成稿，始终由你确认</Text>
          </View>
          <View className='ai-tools'>
            <View className='ai-tool pressable' onClick={runPhotoToArticle}>
              <Image className='ai-tool__icon' src={cameraRed} mode='aspectFit' />
              <Text className='ai-tool__title'>{aiWorking === 'photo' ? '正在识别…' : '拍照一键成文'}</Text>
              <Text className='ai-tool__desc'>拍摄现场，AI 识别并生成初稿</Text>
              <Text className='ai-tool__link'>选择照片</Text>
            </View>
            <View className='ai-tool pressable' onClick={runRewrite}>
              <Image className='ai-tool__icon' src={aiPenRed} mode='aspectFit' />
              <Text className='ai-tool__title'>{aiWorking === 'rewrite' ? '正在优化…' : 'AI 智能改写'}</Text>
              <Text className='ai-tool__desc'>优化表达、结构与标题</Text>
              <Text className='ai-tool__link'>优化当前正文</Text>
            </View>
          </View>
        </View>

        <View className='editor-card'>
          <View className={`cover-upload pressable ${cover ? 'has-cover' : ''}`} onClick={runPhotoToArticle}>
            {cover ? (
              <Image className='cover-upload__image' src={cover} mode='aspectFill' />
            ) : (
              <>
                <Image className='cover-upload__placeholder' src={imageGray} mode='aspectFit' />
                <View>
                  <Text className='cover-upload__title'>添加封面</Text>
                  <Text className='cover-upload__desc'>建议比例 16:9，图片不超过 10MB</Text>
                </View>
              </>
            )}
          </View>

          <View className='form-field'>
            <View className='form-field__label-row'>
              <Text className='form-field__label'>主标题</Text>
              <Text className='form-field__count'>{title.length}/30</Text>
            </View>
            <Input
              className='form-field__input form-field__input--title'
              maxlength={30}
              value={title}
              placeholder='请输入主标题'
              onInput={(event) => setTitle(event.detail.value)}
            />
          </View>

          <View className='form-field'>
            <View className='form-field__label-row'>
              <Text className='form-field__label'>副标题</Text>
              <Text className='form-field__count'>{subtitle.length}/50</Text>
            </View>
            <Input
              className='form-field__input'
              maxlength={50}
              value={subtitle}
              placeholder='补充内容背景或核心观点'
              onInput={(event) => setSubtitle(event.detail.value)}
            />
          </View>

          <View className='author-row'>
            <Text className='form-field__label'>作者</Text>
            <View className='author-row__profile'><View className='author-row__avatar'>林</View><Text>林知远</Text></View>
          </View>

          <View className='editor-toolbar'>
            <View className='editor-toolbar__style'><Text>正文</Text><Image src={chevronGray} mode='aspectFit' /></View>
            <Image className='editor-toolbar__button' src={boldDark} mode='aspectFit' />
            <Image className='editor-toolbar__button' src={quoteDark} mode='aspectFit' />
            <Image className='editor-toolbar__button' src={listDark} mode='aspectFit' />
            <Image className='editor-toolbar__button' src={imageGray} mode='aspectFit' />
            <Image className='editor-toolbar__button' src={linkDark} mode='aspectFit' />
          </View>

          <View className='form-field form-field--body'>
            <Text className='form-field__label'>正文内容</Text>
            <Textarea
              className='article-textarea'
              value={body}
              maxlength={5000}
              autoHeight
              placeholder='从一个真实的问题开始写起…'
              onInput={(event) => setBody(event.detail.value)}
            />
            <Text className='form-field__count form-field__count--body'>{body.length}/5000</Text>
          </View>

          <View className='settings-row pressable' onClick={() => Taro.showActionSheet({ itemList: ['当日热点', '两岸对话', '制度观察', '公共讨论'] })}>
            <Text>选择栏目</Text><View className='settings-row__value'><Text>两岸对话</Text><Image src={chevronGray} mode='aspectFit' /></View>
          </View>
          <View className='settings-row pressable' onClick={() => Taro.showToast({ title: '标签编辑待接入', icon: 'none' })}>
            <Text>内容标签</Text><View className='settings-row__value'><Text>公共讨论、制度观察</Text><Image src={chevronGray} mode='aspectFit' /></View>
          </View>
          <View className='settings-row'>
            <Text>原创声明</Text>
            <Switch checked={original} color='#E9271C' onChange={(event) => setOriginal(event.detail.value)} />
          </View>
          <Text className='draft-time'>草稿保存于：{savedAt}</Text>
        </View>
      </View>

      <View className='submit-dock'>
        <Button className='submit-dock__button submit-dock__button--secondary pressable' onClick={saveDraft}>保存草稿</Button>
        <Button className='submit-dock__button submit-dock__button--primary pressable' onClick={submit}>提交审核</Button>
      </View>
    </View>
  )
}
