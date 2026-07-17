# Blog System

基于 **Next.js 16 + Flask** 的全栈博客系统，双后端架构（Flask + SQLite 持久化 + Next.js API Routes 内存存储），项目已部署至Vercel服务器，链接：https://myproject-qingyu1.vercel.app/
项目演示录屏链接（若GitHub无法打开）： https://pan.baidu.com/s/1xtWWBvnARxlg5ZcEZBdoiQ?pwd=wn2i


![主题色](https://img.shields.io/badge/主题-靛蓝渐变-4F46E5?style=flat-square)
![框架](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![部署](https://img.shields.io/badge/部署-Vercel-000?style=flat-square&logo=vercel)

## ✨ 功能特性

-  **文章管理** — 创建/编辑/删除文章，支持 Markdown 写作
-  **靛蓝渐变主题** — 毛玻璃导航栏、渐变按钮、柔和阴影
-  **实时搜索** — 500ms 防抖，按标题/内容/分类模糊搜索
-  **分页浏览** — 每页 6 篇，页码导航，切页平滑滚动
-  **后台仪表盘** — 统计卡片、斑马纹表格、分类色标
-  **页面动画** — framer-motion 页面过渡 + 列表 staggered 入场
-  **阅读进度条** — 文章详情页顶部实时滚动进度
-  **Toast 通知** — 操作成功/失败深色圆角提示
-  **骨架屏加载** — 列表/详情/表格三种变体，脉冲动画
-  **404 页面** — 全局 404 + 文章专用 404，友好引导

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router + Turbopack) |
| 后端 | Flask + SQLAlchemy |
| 数据库 | SQLite (`backend/blog.db`) |
| 语言 | TypeScript + Python |
| 样式 | Tailwind CSS 4 + @tailwindcss/typography |
| 动画 | framer-motion |
| 通知 | react-hot-toast |
| Markdown | react-markdown |
| 表单 | React Hook Form + Zod |
| HTTP | Axios |
| 部署 | Vercel + Railway |

## 项目结构

```
blog-system/
├── frontend/                       # Next.js 项目（前端 + API 路由）
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/                # API 路由（Vercel 部署时使用内存存储）
│   │   │   │   ├── health/         # GET  /api/health
│   │   │   │   ├── posts/          # GET/POST /api/posts
│   │   │   │   │   └── [id]/       # GET/PUT/DELETE /api/posts/:id
│   │   │   │   └── categories/     # GET/POST /api/categories
│   │   │   ├── admin/              # 后台管理页
│   │   │   ├── posts/[id]/         # 文章详情页
│   │   │   ├── layout.tsx          # 根布局
│   │   │   ├── page.tsx            # 文章列表页（首页）
│   │   │   └── not-found.tsx       # 全局 404 页
│   │   ├── components/             # 通用组件
│   │   │   ├── Carousel.tsx         # 轮播图组件
│   │   │   ├── ClientLayout.tsx    # 客户端布局桥接
│   │   │   ├── EmptyState.tsx      # 空状态（可复用）
│   │   │   ├── PageTransition.tsx  # 页面过渡动画
│   │   │   ├── Pagination.tsx      # 分页导航
│   │   │   ├── SearchBar.tsx       # 搜索框（防抖）
│   │   │   ├── SkeletonCard.tsx    # 骨架屏（4 种变体）
│   │   │   └── ToastProvider.tsx   # Toast 全局配置
│   │   └── lib/
│   │       ├── api.ts              # API 客户端
│   │       └── store.ts            # 数据存储层（30 篇种子文章）
│   ├── next.config.ts
│   ├── package.json
│   └── vercel.json
└── backend/                        # Flask 后端
    ├── app.py
    ├── models.py
    ├── extensions.py
    ├── blog.db                     # SQLite 数据库（含种子数据）
    ├── routes/
    │   ├── posts.py
    │   └── categories.py
    ├── seed.py                     # 数据库种子脚本（前 8 篇）
    ├── add_posts.py                # 追加文章脚本（后 22 篇）
    └── requirements.txt
```

## 快速开始

### 环境要求

- **Node.js >= 20.9.0**
- **Python >= 3.10**

### 1. 后端（Flask + SQLite）

```bash
cd backend

# 创建虚拟环境并安装依赖
python -m venv venv
./venv/Scripts/pip install -r requirements.txt   # Windows
# source venv/bin/pip install -r requirements.txt # macOS/Linux

# 启动 Flask 开发服务器
./venv/Scripts/python app.py   # Windows
# venv/bin/python app.py       # macOS/Linux
```

Flask 运行在 `http://localhost:5000`。

> **数据库说明：** 项目自带 `backend/blog.db` SQLite 数据库文件，包含 4 个分类和 30 篇种子文章。克隆后可直接使用，无需额外配置数据库。如需重新生成种子数据，运行 `seed.py` + `add_posts.py`。

### 2. 前端（Next.js）

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器打开 `http://localhost:3000` 即可访问。

> **双后端架构说明：** 项目提供两套 API 实现。本地开发时使用 **Flask + SQLite**（`backend/`），数据持久化，重启不丢失。Vercel 部署时使用 **Next.js API Routes**（`frontend/src/app/api/`），数据存储在内存中，冷启动后重置为种子数据。两套 API 接口完全一致，前端无需修改。

### API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/posts?q=&page=&limit=` | 文章列表（支持搜索+分页） |
| GET | `/api/posts/:id` | 文章详情 |
| POST | `/api/posts` | 创建文章 |
| PUT | `/api/posts/:id` | 更新文章 |
| DELETE | `/api/posts/:id` | 删除文章 |
| GET | `/api/categories` | 分类列表 |
| POST | `/api/categories` | 创建分类 |

**分页参数：** `GET /api/posts?page=1&limit=6` 返回 `{ posts, total, page, limit, totalPages }`

**搜索参数：** `GET /api/posts?q=关键词` 按标题/摘要/分类模糊匹配

### 页面路由

| 路径 | 说明 |
|------|------|
| `/` | 文章列表（首页），支持搜索 + 分页 |
| `/posts/:id` | 文章详情，Markdown 渲染 + 阅读进度条 |
| `/admin` | 后台管理，统计卡片 + 表格 CRUD |
| 任意未匹配路径 | 全局 404 友好页面 |

### 组件清单

| 组件 | 说明 |
|------|------|
| `Carousel` | 首页轮播图，自动播放推荐文章 |
| `EmptyState` | 空状态占位，支持 icon/title/description/action |
| `SkeletonCard` | 骨架屏，4 种变体：list-item/article/table-row/stat-card |
| `SearchBar` | 搜索框，500ms 防抖，输入即搜 |
| `Pagination` | 分页导航，← 上一页 / 页码 / 下一页 → |
| `PageTransition` | 页面切换淡入上滑动画（framer-motion） |
| `ToastProvider` | Toast 通知全局配置（react-hot-toast） |

## 部署

### Vercel（推荐）

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. **Root Directory** 设置为 `frontend`
4. 无需配置环境变量，直接 Deploy

部署后访问 `https://你的域名.vercel.app` 即可。

> **注意：** 当前数据存储在内存中，服务冷启动后会重置为初始种子数据。如需持久化，可在 Vercel Dashboard 添加 **Vercel KV** 或 **Vercel Postgres**（免费额度足够个人项目使用）。

### Railway / Render（推荐用于 Flask + SQLite 部署）

使用 Flask 后端部署：

1. 在项目根目录部署，设置 Root Directory 为 `backend`
2. 构建命令：`pip install -r requirements.txt`
3. 启动命令：`gunicorn app:app --bind 0.0.0.0:$PORT`
4. 环境变量：

| Key | Value |
|-----|-------|
| `FLASK_APP` | `app.py` |
| `FLASK_ENV` | `production` |
| `SECRET_KEY` | 随机字符串 |
| `DATABASE_URL` | PostgreSQL 连接地址 |

## 本地开发说明

- **数据存储：** 使用 SQLite 数据库（`backend/blog.db`），数据持久化保存，重启服务不会丢失
- **数据库位置：** `backend/blog.db`，已提交到 Git 仓库，克隆即可使用
- **种子数据：** 包含 4 个分类（技术/生活/随笔/前端）和 30 篇 Markdown 文章
- **重建数据库：** 删除 `backend/blog.db` 后依次运行 `cd backend && ./venv/Scripts/python seed.py && ./venv/Scripts/python add_posts.py`
- **热更新：** Flask `debug=True` 支持自动重载，Next.js Turbopack 支持 HMR
