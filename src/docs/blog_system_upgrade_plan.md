# Blog 系统升级策略（Tech/Life + Badges + 聚合搜索 + 富媒体）

## 1. 目标与边界
- 目标：把现有“可用的 TipTap + MongoDB 简易 blog”升级为更强的记录与浏览系统，重点是分类（Tech/Life）、内容相关 badges、聚合搜索、富文本（代码/图片/视频）、可自定义 post date（创建与编辑都可改）。
- 边界：本文件聚焦“策略与落地路径”，不是一次性实现清单；实现细节以实际代码为准。

## 2. 现状盘点（As-Is）

### 2.1 数据模型
- 当前 `Post` 仅包含 `title/content/description/slug/author/tags/published/createdAt/updatedAt`，并启用 `timestamps: true`  
  代码参考：[Post.ts](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/models/Post.ts#L1-L55)
- 当前没有显式 `category`、`badges`、`publishedAt`（“文章展示日期”）等字段。

### 2.2 API
- `GET /api/blog/get-blogs`：按 `createdAt` 倒序，固定 `limit(10)`，并 `select('-content')`。无分页、无筛选、无搜索。  
  代码参考：[get-blogs route.js](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/app/api/blog/get-blogs/route.js#L1-L46)
- `GET /api/blog/get-blog/[id]`：支持用 ObjectId 或 slug 拉取单篇全文。  
  代码参考：[get-blog route.js](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/app/api/blog/get-blog/%5Bid%5D/route.js#L1-L81)
- `POST /api/blog/create-blog`：管理员鉴权（JWT cookie），保存前会做一次 base64 图片兜底上传到 S3。当前会强制 `createdAt: new Date()`（因此前端传入的自定义日期不会生效）。  
  代码参考：[create-blog route.js](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/app/api/blog/create-blog/route.js#L111-L205)
- `PUT /api/blog/update-blog`：支持修改 `title/description/content/tags/slug`，不支持修改展示日期。  
  代码参考：[update-blog route.js](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/app/api/blog/update-blog/route.js#L30-L74)

### 2.3 前台页面与交互
- `/blog`：客户端请求 recent 列表后展示卡片。  
  代码参考：[blog page.tsx](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/app/blog/page.tsx#L1-L104)
- `/blog/[id]`：客户端请求单篇，直接用 `html-react-parser` 渲染保存的 HTML。  
  代码参考：[blog [id] page.tsx](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/app/blog/%5Bid%5D/page.tsx#L1-L147)
- 展示层面的“badges”目前就是 `tags` 的展示（最多展示前 3 个）。  
  代码参考：[BlogCard.tsx](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/components/Blog/BlogCard.tsx#L1-L98)

### 2.4 编辑器与图片上传
- 富文本编辑器是 TipTap，支持标题、列表、对齐、链接、图片、inline code、code block；拖拽/按钮插入图片会先以 base64 形式写入 HTML，标记为 pending，最终在创建时统一上传到 S3 并替换 URL。  
  代码参考：[BlogEditor.tsx](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/components/Blog/BlogEditor.tsx#L1-L414)
- S3 上传：`POST /api/upload-media-aws` 支持 base64 JSON 与 multipart 两种上传方式，返回 S3 URL。  
  代码参考：[upload-media-aws route.js](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/app/api/upload-media-aws/route.js#L1-L225)

## 3. 主要缺口（与目标对照）
- 分类缺失：Tech/Life 没有被数据模型表达，也就无法在列表页做稳定筛选与聚合。
- badges 语义不清：目前 `tags` 既当标签又当 badge，缺少“展示策略/聚合维度”的统一定义。
- 自定义文章日期缺失：目前按 `createdAt` 排序且创建时强制写死；无法“回填旧文/系列文章的发布时间”。
- 搜索与聚合缺失：没有按 `category/badges/title/date` 的组合过滤与排序，也没有分页。
- 富媒体视频缺失：编辑器没有视频节点/上传流程/渲染规范。
- 安全与可维护性：前台直接渲染 HTML（后续一旦支持 iframe/video/embed 更需要明确白名单与净化策略）。

## 4. To-Be 能力定义（建议统一口径）

### 4.1 文章维度
- `category`：仅 `tech` / `life`（建议存小写字符串，展示层再映射为 Tech/Life）。
- `badges`：和内容强相关、可用于聚合浏览的标签集合（可预置一批常用 badge 供点选，也允许临时添加自定义 badge）。
- `publishedAt`：文章的“展示日期”（可手动选择），列表/详情默认展示它；`createdAt` 只表示数据库创建时间。
- `status`：`draft` / `published`（避免 `published: true/false` 的语义漂移，也支持未来“定时发布”）。

### 4.2 检索与聚合（MVP 也要可扩展）
- 搜索：支持关键词（title/description/badges），且与筛选条件组合（category、badge、日期区间）。
- 聚合：至少支持“按 category 统计数量”“按 badge 统计 Top N”“按年份/月归档统计”。
- 分页：必须可翻页（page/limit 或 cursor）。

### 4.3 富媒体
- 图片：维持现有“上传到 S3，存 URL”方案（已很好）。
- 视频：建议优先支持“外链嵌入（YouTube/Vimeo）”与“短视频自托管（S3/CloudFront）”两种模式。

## 5. 数据模型升级方案（Post Schema）

### 5.1 字段建议（兼容现有 tags）
建议在 `Post` 上新增字段，同时保留 `tags` 一段时间用于迁移：
- `category: 'tech' | 'life'`
- `badges: string[]`（先用 string 数组足够；如果以后要颜色/图标再升级为对象）
- `publishedAt: Date`（用于展示与排序，可手动设置）
- `status: 'draft' | 'published'`
- `readingTimeMinutes: number`（服务端计算）

### 5.2 索引建议（为搜索/排序/聚合服务）
- `{ slug: 1 }` unique（已有）
- `{ category: 1, publishedAt: -1 }`（列表默认排序）
- `{ publishedAt: -1 }`（归档与时间线）
- 文本搜索：优先用 MongoDB text index（比 `$regex` 更可控且性能更好）
  - `title`、`description`、`badges`（如保留 tags，也可加上）

### 5.3 Badge 预置与交互（重点）
目标是让你“写文章时就能快速把内容语义贴上去”，并且读者在列表与详情里能一眼看到“这篇讲什么”。

#### Badge 的两种来源
- 预置 badge：系统内置的一批常用标签，创建/编辑时以 chips 形式可点选。
- 自定义 badge：创建/编辑时可以临时添加（输入后回车/逗号确认），用于长尾内容。

#### 预置 badge 建议分组（初版）
- Tech（Frontend）：`frontend` `nextjs` `react` `tailwind` `typescript` `css` `performance` `uiux`
- Tech（Backend/Infra）：`aws` `mongodb` `nodejs` `api` `database` `devops`
- Life（Fitness/Sports）：`fitness` `sports` `basketball` `running` `strength` `mobility`
- Life（General）：`life` `reflection` `travel` `reading`

#### 存储规范（建议）
- 统一存小写：例如 `nextjs`、`aws`，避免 `NextJS/Next.js` 造成聚合分裂。
- 展示可映射友好名称：例如 `nextjs -> Next.js`，`uiux -> UI/UX`（展示映射放前端常量即可）。

#### 去重与限制（建议）
- 去重：同一篇文章 badge 去重（忽略大小写）。
- 数量限制：建议上限 12（避免 UI 过密、聚合维度泛滥）。
- 长度限制：单个 badge 建议 ≤ 24 字符。

## 6. API 升级设计

### 6.1 `GET /api/blog/get-blogs`：列表 + 搜索
#### 推荐 query 参数（MVP 起步）
- `q`：关键词（title/description/badges）
- `category=tech|life`
- `badge=React`（支持重复 badge 或 `badge=React,bun`）
- `from=YYYY-MM-DD`、`to=YYYY-MM-DD`（按 `publishedAt`）
- `sort=publishedAt_desc|publishedAt_asc|title_asc|views_desc`
- `page`、`limit`

#### 返回结构建议
- `items: PostSummary[]`（不含 content）
- `pageInfo: { page, limit, total }`

### 6.2 聚合 Facets（推荐单独 endpoint）
建议新增（或在未来新增）：
- `GET /api/blog/facets?category=...&q=...` 返回：
  - `categoryCounts`
  - `badgeTop`
  - `archiveCounts`（year/month）

## 7. 创建/编辑 API：必须支持自定义 post date
- `POST /api/blog/create-blog` 与 `PUT /api/blog/update-blog` 必须接受并保存：
  - `category`
  - `badges`
  - `publishedAt`（允许为空则用当前时间）
- 必须修正：当前创建接口会覆盖 `createdAt`，导致“自定义展示日期”无法生效；未来应当写入 `publishedAt`，而不是强行改 `createdAt`。
- 必须计算：`readingTimeMinutes`（服务端基于纯文本字数估算，选一个固定口径即可）。

## 8. 前台 UI/UX 升级重点（不改风格也能“顶级”）
- 列表页：
  - 顶部：Tech/Life Tab + 搜索框 + badge 快捷筛选（chips）
  - 卡片：展示 category、badges、`X min read`、展示日期（`publishedAt`）
  - 列表分页：page/limit 或 “Load more”
- 详情页：
  - Hero：标题、日期、category、badges、阅读时长
  - badges 位置：建议紧贴标题下方（标题 → badges → 日期/阅读时长）
  - TOC：从 H2/H3 自动生成（可选）
  - Code block：语法高亮 + copy（可选）
  - Reading progress：顶部进度条（可选）

## 9. 编辑器与 Admin 升级（与你的诉求强相关）
- Create / Edit 表单新增字段：
  - `Category`：tech/life
  - `Badges`：
    - 预置 badge：点击 chips 选择（支持多选、再次点击取消）
    - 自定义 badge：输入框临时添加（回车/逗号确认），并立即变成可移除的 chip
  - `PublishedAt`：DateTime picker（创建与编辑都可改）
- 兼容策略：
  - 若历史文章只有 `tags`：可在展示层临时把 `tags` 当作 `badges` 兜底，直到完成数据迁移。

## 10. 视频支持：推荐方案（按投入/效果分层）

### 10.1 最推荐：外链嵌入（低成本高体验）
- 数据结构：在内容里插入“视频节点”，存 `provider + url`
- 渲染：前台用 `react-youtube`（项目已安装）渲染 YouTube；Vimeo 后续补齐

### 10.2 自托管短视频：S3 + CloudFront + HTML5 video（中等投入）
- 建议：
  - 上传后存 `mp4` URL（MVP）
  - 进阶：CloudFront 做 CDN；更进阶：HLS（转码与切片）
- TipTap 集成方式：
  - 新增 Video node（插入 `<video controls src="...">` 或 `<source>`）
  - 上传 UI 复用你现在的上传 API，新增 `folder: 'blog-videos'` 与大小限制

### 10.3 顶级体验：Mux / Cloudinary（高体验但有成本）
- 如果未来视频比例上来，优先 Mux；个人站且量不大也可先 S3 方案过渡。

## 11. 迁移与迭代路线（建议顺序）
### Phase A（先把数据语义补齐）
- Post 增加 `category/badges/publishedAt/status/readingTimeMinutes`。
- create/update API 支持这些字段，并以 `publishedAt` 作为默认排序字段。

### Phase B（把“浏览”变强）
- `/blog` 增加过滤与搜索 UI，并与 API query 参数打通。
- 增加分页（最少 page/limit）。
- 增加聚合 facets（category counts + badge top）。

### Phase C（富媒体与沉浸体验）
- TipTap 加视频节点（先外链嵌入，再自托管）。
- 详情页加 TOC/代码高亮/阅读进度（按你审美逐个加）。

## 12. 风险与注意项
- HTML 渲染安全：后续支持视频/iframe 时，必须定义允许的标签/属性白名单与内容净化策略（否则 XSS 风险会放大）。
- 字段冲突：当前 schema 同时显式定义 `createdAt/updatedAt` 又开启 timestamps，建议统一口径（要么完全交给 timestamps，要么自己管理）。
- 后台可用性：`get-blogs` 的固定 `limit(10)` 会让编辑后台也只能看到 10 条，升级时要一起修。
