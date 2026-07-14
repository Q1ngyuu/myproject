# Blog System

基于 **Next.js 16** 的全栈博客系统，前后端一体化，一个命令启动，一键部署 Vercel。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router + Turbopack) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 4 |
| 表单 | React Hook Form + Zod |
| HTTP | Axios |
| API | Next.js API Routes（替代 Flask） |
| 部署 | Vercel |

## 项目结构

```
blog-system/
├── frontend/                    # Next.js 项目（前后端一体化）
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/             # API 路由（替代 Flask 后端）
│   │   │   │   ├── health/      # GET  /api/health
│   │   │   │   ├── posts/       # GET/POST /api/posts
│   │   │   │   │   └── [id]/    # GET/PUT/DELETE /api/posts/:id
│   │   │   │   └── categories/  # GET/POST /api/categories
│   │   │   ├── admin/           # 后台管理页
│   │   │   ├── posts/[id]/      # 文章详情页
│   │   │   ├── layout.tsx       # 根布局
│   │   │   └── page.tsx         # 文章列表页（首页）
│   │   └── lib/
│   │       ├── api.ts           # API 客户端
│   │       └── store.ts         # 数据存储层
│   ├── next.config.ts
│   ├── package.json
│   └── vercel.json
└── backend/                     # Flask 后端（可选，已不再使用）
    ├── app.py
    ├── models.py
    ├── routes/
    └── requirements.txt
```

## 快速开始

### 环境要求

- **Node.js >= 20.9.0**

### 安装运行

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器打开 `http://localhost:3000` 即可访问。

**前后端都在同一个进程中运行**，无需额外启动 Flask 或配置环境变量。

### API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/posts` | 文章列表 |
| GET | `/api/posts/:id` | 文章详情 |
| POST | `/api/posts` | 创建文章 |
| PUT | `/api/posts/:id` | 更新文章 |
| DELETE | `/api/posts/:id` | 删除文章 |
| GET | `/api/categories` | 分类列表 |
| POST | `/api/categories` | 创建分类 |

### 页面路由

| 路径 | 说明 |
|------|------|
| `/` | 文章列表（首页） |
| `/posts/:id` | 文章详情 |
| `/admin` | 后台管理 |

## 部署

### Vercel（推荐）

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. **Root Directory** 设置为 `frontend`
4. 无需配置环境变量，直接 Deploy

部署后访问 `https://你的域名.vercel.app` 即可。

> **注意：** 当前数据存储在内存中，服务冷启动后会重置为初始种子数据。如需持久化，可在 Vercel Dashboard 添加 **Vercel KV** 或 **Vercel Postgres**（免费额度足够个人项目使用）。

### Railway / Render（使用 Flask 后端）

如需使用 Flask 后端 + PostgreSQL：

1. 在项目根目录部署
2. 构建命令：`pip install -r requirements.txt`
3. 启动命令：`cd backend && gunicorn app:app --bind 0.0.0.0:$PORT`
4. 环境变量：

| Key | Value |
|-----|-------|
| `FLASK_APP` | `app.py` |
| `FLASK_ENV` | `production` |
| `SECRET_KEY` | 随机字符串 |
| `DATABASE_URL` | PostgreSQL 连接地址 |

## 本地开发说明

- **数据存储：** 开发时数据存储在内存中，每次重启服务会恢复为 8 篇种子文章和 3 个分类
- **热更新：** `npm run dev` 支持前端页面和 API 路由的热更新
- **构建生产版本：** `npm run build` 后 `npm start` 启动生产模式
