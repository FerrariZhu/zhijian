import { Image, Input, Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useMemo, useState } from 'react'
import backDark from '../../assets/icons/back-dark.png'
import commentGray from '../../assets/icons/comment-gray.png'
import favoriteGray from '../../assets/icons/favorite-gray.png'
import favoriteRed from '../../assets/icons/favorite-red.png'
import likeGray from '../../assets/icons/like-gray.png'
import likeRed from '../../assets/icons/like-red.png'
import shareGray from '../../assets/icons/share-gray.png'
import shareMoments from '../../assets/icons/share-moments.png'
import shareWechat from '../../assets/icons/share-wechat.png'
import shareWeibo from '../../assets/icons/share-weibo.png'
import { article, comments, feedItems } from '../../data/content'
import { isFavorite, toggleFavorite } from '../../favorites'
import './index.scss'

const shareChannels = [
  { key: 'wechat', label: '微信', icon: shareWechat },
  { key: 'moments', label: '朋友圈', icon: shareMoments },
  { key: 'weibo', label: '微博', icon: shareWeibo }
]

function formatNumber(value: number) {
  return value.toLocaleString()
}

function currentShareLink() {
  if (process.env.TARO_ENV === 'h5') return window.location.href
  return `/pages/detail/index?id=${article.id}`
}

export default function DetailPage() {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(() => isFavorite(article.id))
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({})
  const [shareOpen, setShareOpen] = useState(false)
  const statusBarHeight = useMemo(() => Taro.getWindowInfo?.().statusBarHeight ?? 20, [])

  useDidShow(() => {
    setSaved(isFavorite(article.id))
  })

  const toggleCommentLike = (floor: number) => {
    setCommentLikes((current) => ({ ...current, [floor]: !current[floor] }))
  }

  const handleReply = (name: string) => {
    Taro.showToast({ title: `回复 ${name}`, icon: 'none' })
  }

  const shareTo = (label: string) => {
    setShareOpen(false)
    Taro.setClipboardData({
      data: `${article.title} ${currentShareLink()}`,
      success: () => Taro.showToast({ title: `链接已复制，去${label}分享`, icon: 'none' }),
      fail: () => Taro.showToast({ title: '复制链接失败，请重试', icon: 'none' })
    })
  }

  return (
    <View className='safe-page detail-page'>
      <View className='article-nav' style={{ paddingTop: `${statusBarHeight}px` }}>
        <View className='article-nav__bar'>
          <Image className='back-icon pressable' src={backDark} mode='aspectFit' onClick={() => Taro.navigateBack()} aria-label='返回' />
          <Text className='article-nav__brand'>知见</Text>
          <View />
        </View>
      </View>

      <View className='article'>
        <Text className='article__title'>{article.title}</Text>
        <Text className='article__subtitle'>{article.subtitle}</Text>
        <Text className='article__reads'>{formatNumber(article.reads)} 阅读</Text>

        <View className='article-author'>
          <View className='article-author__avatar'>知</View>
          <View className='article-author__info'>
            <Text className='article-author__name'>{article.author}</Text>
            <Text className='article-author__time'>{article.publishedAt}</Text>
          </View>
        </View>

        <View className='article__body'>
          {article.paragraphs.map((paragraph, index) => (
            <View key={paragraph}>
              {index === 2 && (
                <Image className='article__image' src={article.image} mode='aspectFill' />
              )}
              <Text className='article__paragraph'>{paragraph}</Text>
            </View>
          ))}
        </View>

        <View className='article-tags'>
          {article.tags.map((tag) => <Text key={tag} className='article-tag'>{tag}</Text>)}
        </View>
      </View>

      <View className='detail-section recommendations'>
        <Text className='section-heading'>推荐阅读</Text>
        <View className='recommendation-list'>
          {feedItems.slice(0, 3).map((item) => (
            <View key={item.id} className='recommendation pressable' onClick={() => Taro.pageScrollTo({ scrollTop: 0, duration: 240 })}>
              <View className='recommendation__content'>
                <Text className='recommendation__title'>{item.title}</Text>
                <Text className='recommendation__meta'>{item.category} · {item.publishedAt}</Text>
              </View>
              {item.image && <Image className='recommendation__image' src={item.image} mode='aspectFill' />}
            </View>
          ))}
        </View>
      </View>

      <View className='detail-section comments'>
        <Text className='section-heading'>评论 {comments.length}</Text>
        <View className='comment-list'>
          {comments.map((comment) => {
            const commentLiked = commentLikes[comment.floor]
            return (
              <View key={comment.floor} className='comment'>
                <View className='comment__avatar'>{comment.name.slice(0, 1)}</View>
                <View className='comment__main'>
                  <View className='comment__header'>
                    <View>
                      <Text className='comment__name'>{comment.name}</Text>
                      <Text className='comment__region'>{comment.region}</Text>
                    </View>
                    <Text className='comment__floor'>{comment.floor}楼</Text>
                  </View>
                  <Text className='comment__body'>{comment.body}</Text>
                  {comment.reply && (
                    <View className='comment__reply'>
                      <Text className='comment__reply-name'>{comment.reply.name}：</Text>
                      <Text>{comment.reply.body}</Text>
                    </View>
                  )}
                  <View className='comment__actions'>
                    <Text>1小时前</Text>
                    <Text className='pressable' onClick={() => handleReply(comment.name)}>回复</Text>
                    <View
                      className={`pressable ${commentLiked ? 'is-liked' : ''}`}
                      onClick={() => toggleCommentLike(comment.floor)}
                    >
                      <Image className='comment__like-icon' src={commentLiked ? likeRed : likeGray} mode='aspectFit' />
                      <Text>{comment.likes + (commentLiked ? 1 : 0)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </View>

      <View className='article-dock'>
        <View className='article-dock__input'>
          <Input placeholder='说说你的观点' onConfirm={(event) => Taro.showToast({ title: event.detail.value ? '评论已提交' : '请输入评论', icon: 'none' })} />
        </View>
        <View className='dock-action pressable' onClick={() => Taro.pageScrollTo({ selector: '.comments', duration: 240 })}>
          <Image className='dock-action__icon' src={commentGray} mode='aspectFit' /><Text>{comments.length}</Text>
        </View>
        <View
          className={`dock-action pressable ${liked ? 'is-active' : ''}`}
          onClick={() => setLiked(!liked)}
          aria-label={liked ? '取消点赞' : '点赞'}
        >
          <Image className='dock-action__icon' src={liked ? likeRed : likeGray} mode='aspectFit' />
          <Text>{formatNumber(article.likes + (liked ? 1 : 0))}</Text>
        </View>
        <View className={`dock-action pressable ${saved ? 'is-active' : ''}`} onClick={() => setSaved(toggleFavorite(article.id))} aria-label={saved ? '取消收藏' : '收藏'}>
          <Image className='dock-action__icon' src={saved ? favoriteRed : favoriteGray} mode='aspectFit' /><Text>{saved ? '已收藏' : '收藏'}</Text>
        </View>
        <View className='dock-action pressable' onClick={() => setShareOpen(true)}>
          <Image className='dock-action__icon' src={shareGray} mode='aspectFit' /><Text>分享</Text>
        </View>
      </View>

      {shareOpen && (
        <View className='share-sheet' onClick={() => setShareOpen(false)}>
          <View className='share-panel' onClick={(event) => event.stopPropagation()} role='dialog' aria-label='分享到'>
            <Text className='share-panel__title'>分享到</Text>
            <View className='share-channels'>
              {shareChannels.map((channel) => (
                <View
                  key={channel.key}
                  className='share-channel pressable'
                  onClick={() => shareTo(channel.label)}
                  aria-label={`分享到${channel.label}`}
                >
                  <Image className='share-channel__icon' src={channel.icon} mode='aspectFit' />
                  <Text className='share-channel__label'>{channel.label}</Text>
                </View>
              ))}
            </View>
            <View className='share-panel__cancel pressable' onClick={() => setShareOpen(false)}>
              <Text>取消</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
