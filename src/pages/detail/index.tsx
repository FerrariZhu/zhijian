import { Image, Input, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo, useState } from 'react'
import audioDark from '../../assets/icons/audio-dark.png'
import backDark from '../../assets/icons/back-dark.png'
import commentGray from '../../assets/icons/comment-gray.png'
import favoriteGray from '../../assets/icons/favorite-gray.png'
import favoriteRed from '../../assets/icons/favorite-red.png'
import likeGray from '../../assets/icons/like-gray.png'
import likeRed from '../../assets/icons/like-red.png'
import moreDark from '../../assets/icons/more-dark.png'
import shareGray from '../../assets/icons/share-gray.png'
import { article, comments, feedItems } from '../../data/content'
import './index.scss'

function formatNumber(value: number) {
  return value.toLocaleString()
}

export default function DetailPage() {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({})
  const statusBarHeight = useMemo(() => Taro.getWindowInfo?.().statusBarHeight ?? 20, [])

  const toggleCommentLike = (floor: number) => {
    setCommentLikes((current) => ({ ...current, [floor]: !current[floor] }))
  }

  const handleReply = (name: string) => {
    Taro.showToast({ title: `回复 ${name}`, icon: 'none' })
  }

  return (
    <View className='safe-page detail-page'>
      <View className='article-nav' style={{ paddingTop: `${statusBarHeight}px` }}>
        <View className='article-nav__bar'>
          <Image className='back-icon pressable' src={backDark} mode='aspectFit' onClick={() => Taro.navigateBack()} aria-label='返回' />
          <Text className='article-nav__brand'>知见</Text>
          <View className='article-nav__actions'>
            <Image className='audio-icon pressable' src={audioDark} mode='aspectFit' onClick={() => Taro.showToast({ title: '开始朗读', icon: 'none' })} aria-label='朗读文章' />
            <Image className='more-icon pressable' src={moreDark} mode='aspectFit' onClick={() => Taro.showActionSheet({ itemList: ['字体设置', '举报内容', '复制链接'] })} aria-label='更多操作' />
          </View>
        </View>
      </View>

      <View className='article'>
        <Text className='article__title'>{article.title}</Text>
        <Text className='article__subtitle'>{article.subtitle}</Text>

        <View className='article-author'>
          <View className='article-author__avatar'>知</View>
          <View className='article-author__info'>
            <Text className='article-author__name'>{article.author}</Text>
            <Text className='article-author__time'>{article.publishedAt}</Text>
          </View>
          <View className='article-author__follow pressable' onClick={() => Taro.showToast({ title: '已关注', icon: 'none' })}>
            <Text>关注</Text>
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

        <Text className='article__hook'>一个“不成熟的开始”，会不会比长期沉默更有价值？</Text>

        <View className='article-tags'>
          {article.tags.map((tag) => <Text key={tag} className='article-tag'>{tag}</Text>)}
        </View>

        <View className='article-metrics'>
          <View><Text className='article-metrics__label'>阅读</Text><Text className='article-metrics__value'>{formatNumber(article.reads)}</Text></View>
          <View className={`pressable ${liked ? 'is-liked' : ''}`} onClick={() => setLiked(!liked)}>
            <Text className='article-metrics__label'>{liked ? '已点赞' : '点赞'}</Text>
            <Text className='article-metrics__value'>{formatNumber(article.likes + (liked ? 1 : 0))}</Text>
          </View>
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
        <View className={`dock-action pressable ${saved ? 'is-active' : ''}`} onClick={() => setSaved(!saved)}>
          <Image className='dock-action__icon' src={saved ? favoriteRed : favoriteGray} mode='aspectFit' /><Text>{saved ? '已收藏' : '收藏'}</Text>
        </View>
        <View className='dock-action pressable' onClick={() => Taro.showShareMenu({ withShareTicket: true })}>
          <Image className='dock-action__icon' src={shareGray} mode='aspectFit' /><Text>分享</Text>
        </View>
      </View>
    </View>
  )
}
