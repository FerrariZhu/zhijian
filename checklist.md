# 知见一期 · 开工前澄清清单

> 来源：产品 / 后端 / 前端 / 安全合规 四个专项 agent 对 PRD、接口与数据模型、架构时序图、design.md 及现有 Taro Demo 的交叉分析，去重合并而成。
> 用法：每一层都标注了「由谁拍板」和「阻塞程度」。第 0 层不拍板，写任何代码都是浪费。

---

## 0. 结论总览（先看这个）

四份文档作为**产品契约**是合格的，作为**工程契约**还差三类东西：① 冻结的工程规范（ID/分页/幂等/错误码/校验/鉴权）；② 约 13 张缺失的表（会话、短信、幂等、内容安全、审计、举报、埋点等）；③ 三处硬冲突（小程序直传
协议、CLI 写库边界、评论审核策略）。

但有一个**战略级风险凌驾于所有技术决策之上**：

> 知见的「热点/公共议题/思想/制度/民生 + 评论区公共讨论」形态，高度可能构成《互联网新闻信息服务管理规定》第二条的「新闻信息」（社会公共事务/突发事件的报道**及评论**）。微信小程序「时政信息」类目在企业主体下**
只认《互联网新闻信息服务许可证》**，该证周期以季度到年计、要求内资法人 + 专职编辑/审核队伍 + 安全评估。若不裁剪内容边界，一期无法按期上线。

因此建议：**先解决第 0 层（战略/合规），再冻结第 1 层（技术契约），再动后端工程。**

---

## 1. 第 0 层：战略与合规红线（决定「能不能做 / 怎么做」，周期最长）

| # | 事项 | 要点 | 由谁拍板 | 阻塞 |
|---|---|---|---|---|
| S1 | **内容资质 vs 定位裁剪** | 申请《互联网新闻信息服务许可证》，还是把一期裁剪为「转载 + 非时政领域」、避免「新闻信息及评论」定性？决定整个产品形态与排期 | 老板/法务 | **最高** |
| S2 | **H5 托管必须境内化** | 现架构用 Netlify（`netlify.toml` 已存在），与 ICP 备案物理不兼容（境外节点无法备案、数据出境、国内访问不稳）。须换阿里云/腾讯云 OSS/COS+CDN 或 ECS | 运维 | **P0** |
| S3 | **小程序备案 + 主体认证** | 企业主体 + 微信认证（300 元/年）；小程序备案 2–4 周；备案主体须与小程序主体一致 | 运营/合规 | **P0** |
| S4 | **AI 备案** | 调用第三方大模型需「算法备案 + 大模型登记」（周期 3–8 个月，2026 年小程序审核已要求提供凭证）。PRD 完全没提，却是阶段 C 的硬长杆。**必须本周启动** | 合规 | **阶段 C 阻塞** |
| S5 | **评论实名 + 先审后发** | 《互联网跟帖评论服务管理规定》：不得向未认证真实身份用户提供跟帖评论；对新闻信息须「先审后发」。`wx.login` 的 openid 不构成实名 → 小程序端评论需补 `getPhoneNumber`。与 PRD「评
论提交后立即显示」直接冲突 | 产品/法务 | **阶段 B 阻塞** |
| S6 | **AI 供应商全境内 + 内容标识** | 必须选已备案的境内厂商（通义千问/混元/豆包/GLM/DeepSeek 等，拍照成文需视觉模型）；签约约定「不用于训练、不留存输入、提供备案号」。AI 内容须加显式+隐式标识（元数据嵌入生
成属性），`ai_tasks` 需增标识字段。**排除 OpenAI/Anthropic 直连**（数据出境） | 合规/后端 | **阶段 C 阻塞** |
| S7 | **隐私政策/用户协议/内容规范 + 投诉渠道** | 小程序需配置《用户隐私保护指引》；PIPL 下手机号/头像/地区/图片/AI 输入均属个人信息，对外提供（AI/短信/审核/CDN/埋点）须列明并取得同意 + PIA。举报/投诉渠道是合
规前置（PRD 误列 P1） | 法务 | **P0** |
| S8 | **账号注销 + 日志留存 ≥6 个月 + 数据删除链路** | 15 个工作日响应删除请求；与「日志留存 6 个月」分层处理；需一份「数据保留矩阵」 | 法务/后端 | P0 |

> ⚠️ 若 S1 结论是「裁剪定位」，则 S5 的「先审后发」对非时政内容可放宽为「先发后审」，需产品在 S1 结论基础上二次确认。

---

## 2. 第 1 层：阻塞写代码的技术决策（本周拍板）

| # | 事项 | 推荐答案 | 由谁拍板 |
|---|---|---|---|
| T1 | **后端技术栈** | Node 20 + TypeScript（NestJS）+ Drizzle ORM + 原生 SQL 迁移；npm workspaces monorepo（`apps/api`、`apps/worker`、`apps/cli`、`packages/contracts`）。决定性理由：前端适配层 / API DTO / C
LI 导入结构三处复用同一份 TS 类型（Zod 单一真源） | 后端 |
| T2 | **鉴权/会话模型** | JWT access（15min，含 `sub/sid/ver/platform`）+ 不透明 refresh（30 天，存库、轮换 + 重放检测）；`users.token_version` 实现封禁即时生效；H5 refresh 走 HttpOnly Cookie（跨域 `SameSite=
None; Secure`，**必须补 CSRF 防护**），小程序走 `Authorization` 头 | 后端 |
| T3 | **小程序直传协议（硬冲突）** | `wx.uploadFile` 只支持 POST，无法消费现有 presign 的 PUT `upload_url`。**必须改 presign 为 POST Policy 表单直传**，响应改 `{ asset_id, upload_url, method:"POST", form_fiel
ds, expires_at }`；存储选腾讯云 COS（与微信同生态 + 数据万象可覆盖缩略图/图片审核） | 后端+前端 |
| T4 | **CLI 写库边界（文档自相矛盾）** | 文档 §1.1「投稿必须走 API」vs §8.5.3「运营用受控 SQL 审核」。推荐：CLI 只写内容域；投稿审核走**受保护管理 API**（`POST /admin/submissions/{id}/approve|reject`）或独立
`reviewer` 数据库角色（列级 GRANT 仅 status/reject_reason/reviewed_at/reviewed_by）+ 强制写审计日志 | 后端 |
| T5 | **评论审核策略** | 与 S1/S5 联动：若属新闻信息 → 先审后发（`PENDING`）；否则先发后审（`VISIBLE` → 异步命中 `HIDDEN` + 回滚计数）。无论哪种，内容安全（微信 `msgSecCheck` + `moderation_records` 表 + 举报
入口）**必须与评论同批上线**，不得推到阶段 D | 产品+后端 |
| T6 | **`home_carousel` 位置唯一性** | 二选一：`btree_gist` 排他约束 `EXCLUDE (position WITH =, tstzrange WITH &&)`；或砍掉 `starts_at/ends_at` 改 `UNIQUE(position) WHERE is_enabled` 覆盖式更新。决定 CLI `car
ousel set` 语义 | 后端 |
| T7 | **ID / 分页 / 幂等 / 错误码规范** | UUIDv7；游标 = 签名 base64url 的 keyset `(published_at,id)`（含 tie-breaker、channel_key 纳入签名）；幂等键统一请求头 `Idempotency-Key`（同 key 同 body 返回首次结果，
24h 窗口）；错误码 + HTTP 状态码映射表 + `details:[{field,code,message}]` 结构 | 后端 |
| T8 | **Redis / MQ 是否一期上** | Redis **建议一期就上最小规格**（微信 access_token 缓存、短信限流、验证码、限流计数、首页缓存都依赖，纯 PG 实现代价更高）；AI 任务队列一期用「DB 任务表 + `FOR UPDATE SKIP LOCK
ED` + `LISTEN/NOTIFY`」，但**必须**补 lease 字段 + 超时回收，并把投递封装在 `TaskQueue` 端口后以便后续迁 BullMQ | 后端 |
| T9 | **规模假设** | DAU ≤ 5k、峰值 QPS ≤ 50、投稿 ≤ 100/天、AI ≤ 500 次/天（决定不拆微服务、单实例 + 托管 PG）。如更高需重估 | 老板 |

---

## 3. 第 2 层：文档冲突与契约需补项（去重后，需写进 v1.1）

### 3.1 会造成错误的硬冲突

| # | 冲突 | 结论 |
|---|---|---|
| C1 | **`viewer` 进详情缓存 = 串号漏洞** | 架构 §7.1 说 viewer 不进公共缓存，接口 §3.2 却把 viewer 放进 `ContentDetail` 且详情缓存 5 分钟。**必须拆分**：`GET /contents/{id}` 缓存版 + 独立 `viewer-state` 接口
（列表页用 `POST /viewer/states` 批量查） |
| C2 | **`body_blocks` 富文本能力范围** | PRD 说「段落/粗体/引用/列表/图片/链接」6 种，接口只定义 `paragraph/heading/image/quote` 4 种。**收窄到 4 种**，粗体/列表/链接降级 P1（Demo 工具栏对应按钮一期隐藏） |
| C3 | **投稿 → 发布字段缺失** | `submissions` 无 `summary/display_variant/hero_asset_id/author_id`，`contents` 却需要。**补字段**：summary 发布时取 body_text 前 80–100 字、display_variant 按有无 cover 定、用
户首次投稿自动建 `authors` |
| C4 | **缓存 5 分钟 vs 下线即时生效** | PRD 要求下线后旧链接不可读，接口却缓存 5 分钟。详情缓存降为 60s，CLI 补 `content offline` 主动清缓存（CDN purge + Redis 删） |
| C5 | **审核操作者无字段** | `submissions` 只有 `reviewed_at`，无 `reviewer`、无审核日志表。**补 `reviewer_id` + `admin_operation_logs` + `submission_review_logs`**（合规现场核查要「三审三校留痕」） |
| C6 | **投稿栏目 vs 首页频道两套** | 首页「推荐/热点/思想/民生/制度」vs 投稿页「当日热点/两岸对话/制度观察/公共讨论」。统一一张 `channels` 表，加 `is_feed_visible`/`is_submittable` 两开关，「推荐」不可作投稿
栏目 |

### 3.2 需补齐的表（约 13 张，按优先级）

`auth_sessions`（refresh 轮换/撤销）、`sms_codes`+`sms_send_logs`、`idempotency_keys`、`moderation_records`（内容安全）、`reports`（举报）、`audit_logs`/`admin_operation_logs`、`submission_review_logs`、`conte
nt_reads`（阅读去重）、`ai_usage_daily`（配额/成本）、`analytics_events`（或走日志服务）、`rate_limit_counters`（若不上 Redis）、`notifications`（P1）、`user_blocklist`。

已有表需补的关键字段：`users.token_version`/`banned_at`/`ban_reason`/`last_login_at`；`media_assets.bucket`/`purpose`/`completed_at`/`deleted_at` + `storage_key` 强制 `users/{user_id}/{asset_id}.{ext}`；`conte
nts.ai_generated`/`offline_reason`/`search_vector`；`submissions.summary`/`display_variant`/`hero_asset_id`/`author_id`/`word_count`；`ai_tasks.attempt_count`/`next_attempt_at`/`leased_until`/`base_version`/`c
ost_micros`。

### 3.3 需补齐的 API

`GET /me` + `PATCH /me`、`GET /submissions`（我的草稿列表，**阻塞**）、`DELETE /submissions/{id}`、`POST /submissions/{id}/withdraw`（撤回，或明确不做）、`GET /channels`（投稿可选栏目）、`GET /tags`、`GET /ai/
tasks?submission_id=` 或 `GET /submissions/{id}/ai-tasks`（任务恢复）、`POST /ai/tasks/{id}/retry`、`POST /reports`、`POST /events`（埋点）、`DELETE /comments/{id}`、`GET /healthz`/`/readyz`、`POST /viewer/sta
tes`（批量互动状态）。

### 3.4 关键缺陷修正

- **点赞幂等**：`ON CONFLICT DO NOTHING` 后无条件 `like_count+1` 会重复计数，须用 `WITH ins AS (...) RETURNING` + `EXISTS` 判断，且 `content_stats` 用 upsert（否则漏插行时静默 0 行更新）。
- **楼层号**：`SELECT MAX+1` 会并发撞号，改在 `contents` 放 `last_floor_no`，`UPDATE ... RETURNING` 取号。
- **评论楼层唯一索引**：`WHERE ... status<>'DELETED'` 导致楼层号可复用，改成 `WHERE parent_id IS NULL`（删除留占位）。
- **内容安全**：投稿须逐 block 审（含 `alt`/`quote.source`）；上传图片须 OCR；AI 输入/输出两侧都要审；AI 建议标签白名单校验。
- **越权（IDOR）**：`submissions`/`ai_tasks`/`uploads complete` 全部补「归属当前用户」校验，否则可读/确认他人资源。
- **presign 最小权限**：Key 服务端生成、锁前缀、`content-length-range`、Content-Type 白名单、排除 SVG、5–15min 有效期。

---

## 4. 第 3 层：产品逻辑缺口（不阻塞骨架，但要尽快定）

1. **投稿状态对用户不可见（缺口最大）**：PRD 承诺「投稿状态承接」但无页面、无 `GET /submissions`。一期必须补「我的 → 投稿记录」最小版，否则 P0 验收「投稿审核状态」过不了。
2. **未登录 `viewer.*` 语义**：返回 `null`（前端据此弹登录）而非 `false`（会被误判为「取消点赞」）。
3. **`POST /ai/rewrite` 响应体缺失**：只定义了请求，无返回结构；`target=TITLE/SUBTITLE` 返回什么、是否 diff、如何与当前版本对比，全未定义。统一走异步任务返回 `{task_id,status,result}`。
4. **评论生命周期**：用户能否删自己评论、删除后的可见行为、回复层级（两级还是三级）、`preview_replies` 取哪 1–2 条、`comment_count` 是否含回复——全未定义。
5. **草稿自动保存规则**：首次创建的最小必填、触发间隔、本地兜底、冲突 409 的 UX。
6. **游客触发登录后「继续原操作」**：点赞/收藏/关注登录后自动执行，评论回到输入态不自动提交；列表滚动位置保留。
7. **分享落地页**：小程序 `path` + 封面（需 5:4）；H5 无 SSR，分享卡片标题/图无法随文章变化，需业务接受静态 OG 兜底。
8. **新用户昵称头像**：微信不再返回真实昵称头像 → 默认「知见读者+4 位数字」+ 首字色块头像。
9. **H5 登录方式**：一期只做手机号验证码（`WECHAT_H5` 保留不启用）。
10. **「专题/消息/我的」降级**：入口「建设中」还是隐藏，底栏建议只留 首页/专题/投稿/我的。

---

## 5. 第 4 层：可后置（一期先用默认值）

搜索、专题聚合、消息通知、完整「我的」、字号/朗读（Demo 有按钮，一期隐藏）、AI 主动推送（轮询即可）、图片多规格/WebP/懒加载、账号合并（unionid）、用户注销、深色模式、**视频（design.md 有组件，PRD 无规划 → 明确
不做）**、个性化推荐、评论热度排序、孤儿媒体回收。

---

## 6. 前端现有 Demo 现状（迁移前须知）

- 详情页**完全不读路由参数**（`useRouter` 未用，id 被忽略）——分享落地/链接直达的硬前提，必须最先修。
- **无任何网络层/状态层/会话层**：无 API client、无 store、无 token 存取、无错误码映射、无加载/空/错三态组件（`src/` 里 grep `Taro.request/fetch/axios/zustand/Storage` 全 0 命中）。
- `src/data/content.ts` 里静态数据与 4 张 PNG import 耦合，替换 API 时最易漏。
- 首页轮播是「hotTopics + 带图 feed 拼接 slice(5)」，与后端独立 `carousel` 语义完全不同。
- 详情正文 `index===2` 硬编码插一张图，须改为按 `body_blocks` 渲染（`BlockRenderer`）。
- 评论用 `floor` 当 React key，须改 `id`；时间「1小时前」硬编码。
- 前端迁移顺序建议：Phase0 地基（env/类型/格式化/修路由读参/抽组件）→ Phase1 只读闭环（client + mock 先行）→ Phase2 登录互动 → Phase3 投稿上传 AI；**上传平台 adapter（weapp/h5 分叉）是全链路最高风险，建议 Phas
e1 期间就对 presign 预研验证**。

---

## 7. 建议推进节奏

1. **本周（战略，老板拍板）**：S1 内容资质/定位 → S2 境内托管 → S3 备案启动 → S4 AI 备案启动 → 定 S5 评论策略。
2. **本周（技术，后端拍板）**：T1–T9 一次性签字（都是选择题，不需新信息）；产出 `packages/contracts` 的 Zod schema + OpenAPI + 错误码/幂等/分页/ID 规范。
3. **契约冻结后**：后端先做工程骨架 + 全量 DDL 评审（含 CHECK 约束、部分唯一索引、角色 GRANT）；前端先做不依赖争议字段的部分（骨架屏/错误层/空态/修路由读参）。
4. **评论与内容安全同批上线**，不可分两期；**投稿审核发布放在 AI 之前**（它是 P0 闭环最后一环且不依赖 AI，AI 可并行开发但不阻塞发布链路）。
5. 阶段 B（登录+只读+评论）与阶段 C（投稿+AI）**建议拆两次上线**，用时间换资质（AI 备案 3–8 个月是长杆）。