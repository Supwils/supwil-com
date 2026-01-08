# Dev Doc（项目开发指引）

## 1. 常用命令
- 本地开发：`npm run dev`（默认端口 3082）
- 构建：`npm run build`
- 启动：`npm run start`
- Lint：`npm run lint`

## 2. 目录与职责（与 blog 相关）
- 页面路由：
  - 前台列表：[src/app/blog/page.tsx](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/app/blog/page.tsx)
  - 前台详情：[src/app/blog/[id]/page.tsx](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/app/blog/%5Bid%5D/page.tsx)
  - 后台创建：[src/app/a1d2m3i4n5/create-blog/page.jsx](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/app/a1d2m3i4n5/create-blog/page.jsx)
  - 后台编辑列表：[src/app/a1d2m3i4n5/edit-blog/page.jsx](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/app/a1d2m3i4n5/edit-blog/page.jsx)
  - 后台编辑详情：[src/app/a1d2m3i4n5/edit-blog/[id]/page.jsx](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/app/a1d2m3i4n5/edit-blog/%5Bid%5D/page.jsx)
- API：
  - blog CRUD：[src/app/api/blog](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/app/api/blog)
  - S3 上传：[src/app/api/upload-media-aws/route.js](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/app/api/upload-media-aws/route.js)
- 数据模型：
  - Post：[src/models/Post.ts](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/models/Post.ts)

## 3. 环境变量（最低集）

### 3.1 MongoDB
- `MONGODB_URI`

### 3.2 Admin 鉴权（JWT Cookie）
- `JWT_SECRET`

### 3.3 AWS S3（媒体上传）
- `APP_REGION`
- `APP_BUCKET_NAME`
- `APP_ACCESS_KEY_ID`
- `APP_SECRET_ACCESS_KEY`

## 4. Blog 开发约定（建议）

### 4.1 字段语义（后续升级用）
- `createdAt/updatedAt`：数据库记录创建/更新时间。
- `publishedAt`：文章展示日期（可手动指定，列表排序默认用它）。
- `category`：`tech` / `life`。
- `badges`：内容相关标签，用于聚合浏览与筛选（预置可点选 + 支持临时自定义）。
- `status`：`draft` / `published`。

### 4.1.1 Badge 预置建议（初版）
- Tech（Frontend）：`frontend` `nextjs` `react` `tailwind` `typescript` `css` `performance` `uiux`
- Tech（Backend/Infra）：`aws` `mongodb` `nodejs` `api` `database` `devops`
- Life（Fitness/Sports）：`fitness` `sports` `basketball` `running` `strength` `mobility`
- Life（General）：`life` `reflection` `travel` `reading`

### 4.1.2 Badge 存储约定
- 存储统一小写，聚合维度只用存储值。
- 展示层用映射表做“友好名称”，例如 `nextjs -> Next.js`、`uiux -> UI/UX`。

### 4.2 API 约定
- 列表接口默认不返回 `content`，详情接口返回全文。
- 所有“列表接口”必须支持分页参数，避免固定 `limit`。
- 搜索优先用可索引的方案（MongoDB text index），避免全表 `$regex`。

### 4.3 富文本内容约定
- 内容当前以 HTML 字符串保存并在前台解析渲染。
- 任何新增富媒体（视频/iframe/embed）都必须同时定义：
  - 编辑器写入格式（TipTap node 的 HTML/attrs）
  - 渲染方式（前台组件）
  - 安全策略（允许标签/属性白名单与净化策略）

### 4.4 迁移策略
- 新字段上线时，先“兼容读取”后“批量迁移”，最后再移除旧字段。
- 对历史文章：可把 `tags` 临时当作 `badges` 展示兜底，避免一次性数据清洗阻塞 UI 上线。

## 5. 升级策略入口
- Blog 系统升级策略文档：[blog_system_upgrade_plan.md](file:///Users/supwils/Desktop/SupwilSoft/my_site/supwils-com/src/docs/blog_system_upgrade_plan.md)
