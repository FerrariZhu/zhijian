# 知见前端 Demo

面向微信小程序与 H5 的共用前端工程。当前实现首页、内容详情页和投稿页，内容取自 `小红书卡片切片.md`。

## 技术架构

- Taro 4：统一小程序与 H5 构建和路由
- React 18 + TypeScript：组件化与类型约束
- Sass：设计令牌和响应式样式
- 本地类型化内容层：Demo 阶段读取静态数据，后续可平滑替换为 API
- 内容生成 PNG 配图：根据文章主题生成并随应用打包，H5 与小程序可独立运行
- PNG 图标切图：所有界面图标均为本地栅格资源，避免小程序与 H5 的 CSS 绘制差异

当前没有引入大型 UI 组件库，避免覆盖 `design.md` 的视觉令牌，并控制小程序包体积。

## 页面

- `/pages/home/index`：热点横滑卡片、三种单列信息流
- `/pages/detail/index`：文章正文、推荐阅读、楼层评论、底部操作栏
- `/pages/submit/index`：拍照成文、AI 改写、富文本投稿表单

投稿页中的 AI 功能目前为可交互的前端演示流程。接入真实服务时，将 `runPhotoToArticle` 和 `runRewrite` 替换为后端 API 调用即可。

## 本地运行

```bash
npm install
npm run dev:h5
```

浏览器访问 `http://localhost:10086`。

微信小程序：

```bash
npm run dev:weapp
```

然后使用微信开发者工具打开项目根目录。正式开发前，将 `project.config.json` 中的 `appid` 替换为实际小程序 AppID。

## 生产构建

```bash
npm run build:h5
npm run build:weapp
```

构建产物按平台隔离：

- H5：`dist/h5/`
- 微信小程序：`dist/weapp/`

H5 部署 `dist/h5/`；微信开发者工具直接打开项目根目录，其配置会读取 `dist/weapp/`。

## 后续接口边界

建议后端按以下模块提供接口：

- `GET /contents`：频道、热点及信息流
- `GET /contents/:id`：文章详情
- `GET /contents/:id/comments`：分页评论
- `POST /contents/:id/comments`：发表评论或回复
- `POST /ai/photo-to-article`：图片识别与初稿生成
- `POST /ai/rewrite`：标题、结构或正文改写
- `POST /submissions`：保存草稿与提交审核

AI 生成结果必须由用户确认后才能写入正文或提交审核。
