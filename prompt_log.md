# AI 辅助编程日志

本项目使用 **Claude Code**（Anthropic 出品）作为 AI 辅助编程工具，贯穿项目初始化、前后端开发、调试部署全流程。

---

| 日期 | Prompt 摘要 | 对应文件/功能 | AI 输出要点 |
|------|-------------|--------------|-------------|
| 2026-07-13 | 在桌面创建 blog-system 文件夹，初始化 Git，关联 GitHub 远程仓库，创建 .gitignore | `.gitignore`、Git 配置 | 创建文件夹、`git init`、`git remote add`、编写忽略 node_modules/.env/__pycache__ 等规则、首次提交推送 |
| 2026-07-13 | 使用 create-next-app 创建 Next.js 项目到 frontend 子目录，安装 axios/react-hook-form/zod/@hookform/resolvers | `frontend/` 整个项目 | `npx create-next-app@latest` 带 TypeScript + Tailwind + App Router，npm install 额外依赖，提交推送 |
| 2026-07-14 | 修改 page.tsx 为 "Hello, Blog System" 测试页，清理 layout.tsx 和 globals.css | `page.tsx`、`layout.tsx`、`globals.css` | 替换默认模板为简洁测试页，移除 Geist 字体，精简 globals.css 为纯 Tailwind 导入 |
| 2026-07-14 | 配置 next.config.ts 的 rewrites，代理 /api 到 http://localhost:5000 | `next.config.ts` | `async rewrites()` 配置 source/destination 规则，开发环境 API 代理 |
| 2026-07-14 | 创建 Flask 后端：venv、requirements.txt、安装依赖 | `backend/`、`requirements.txt` | `python -m venv venv`、pip install flask/flask-cors/python-dotenv |
| 2026-07-14 | 创建 Flask app.py：CORS、SQLAlchemy (SQLite)、os.getenv() 读取配置、/api/health | `app.py`、`.env.example` | Flask 应用骨架，dotenv 加载，所有配置用环境变量，无硬编码密钥 |
| 2026-07-14 | 创建 models.py：Category 和 Post 两个 SQLAlchemy 模型 | `models.py` | Category(id, name unique)、Post(id, title, content, summary, category_id FK, created_at, updated_at)，使用 backref |
| 2026-07-14 | 创建 init_db.py：删表→建表→插入 3 个分类和 8 篇测试文章 | `init_db.py` | `db.drop_all()` / `db.create_all()`，种子数据包含技术/生活/随笔三个分类 |
| 2026-07-14 | 创建 routes/posts.py：Blueprint 实现 5 个 CRUD 接口 | `routes/posts.py` | GET 列表(join Category)、GET 详情、POST 创建(校验)、PUT 更新(部分更新)、DELETE 删除，统一 `{code, data, message}` 格式 |
| 2026-07-14 | 创建 routes/categories.py：获取列表和创建分类，名称防重复 | `routes/categories.py` | GET 列表、POST 创建（检查重复），Blueprint 注册 url_prefix |
| 2026-07-14 | 创建 frontend/lib/api.ts：axios 实例、TypeScript 类型、统一错误处理 | `lib/api.ts` | PostListItem/PostDetail/Category 等类型定义，`request()` 包装器统一处理 code !== 0 和网络错误 |
| 2026-07-14 | 创建文章列表页 page.tsx：卡片网格、导航栏、Loading 骨架屏、Error+重试 | `app/page.tsx` | "use client"、Tailwind 3 列响应式布局、骨架屏动画、重试按钮、空状态 |
| 2026-07-14 | 创建文章详情页 posts/[id]/page.tsx：根据 id 获取详情、404 处理 | `app/posts/[id]/page.tsx` | useParams 读 id、Loading/Error/404/成功四种状态、white-space: pre-wrap 换行 |
| 2026-07-14 | 创建后台管理页 admin/page.tsx：表格、新建/编辑 Modal、删除确认弹窗 | `app/admin/page.tsx` | react-hook-form + zod 表单验证、Modal 模态框、CRUD 完整流程、操作后自动刷新 |
| 2026-07-14 | 生成部署配置：frontend/vercel.json + backend/render.yaml | `vercel.json`、`render.yaml` | Vercel Next.js 配置、Render Python web service 配置、环境变量清单(sync: false) |
| 2026-07-14 | Vercel 构建报错排查修复 | 多个前端文件 | 修复 3 个问题：① `@/src/lib/api` 路径改为 `@/lib/api`；② Tailwind 原生模块重装；③ zod v4 `invalid_type_error` 改为 `message`，`z.coerce.number` 改为 `z.string()` + 手动转换 |
| 2026-07-14 | Vercel 页面 Network Error | 环境变量 | 需要在 Vercel 设置 `NEXT_PUBLIC_API_URL` 指向后端地址 |
| 2026-07-14 | Railway 部署报错 railpack 无法判断构建方式 | 根目录配置 | 创建 `railway.toml` 指定 build.config.root = "backend"、`backend/Procfile`、添加 gunicorn 依赖 |
| 2026-07-14 | Railway Nixpacks 找不到 Python 项目 | 根目录配置 | 删除 railway.toml，在根目录创建 `Procfile` 和 `requirements.txt`（含完整依赖），让 Nixpacks 识别 Python |
| 2026-07-14 | Railway 根目录 requirements.txt -r 引用失败 | `requirements.txt` | 将引用语法 `-r backend/requirements.txt` 改为直接写入完整依赖列表 |
| 2026-07-14 | Railway 部署后连接超时 | `Procfile`、`app.py` | Procfile 改用 `gunicorn --chdir backend`、SECRET_KEY 加 `or "dev-key..."` 兜底 |
| 2026-07-15 | 前后端一体化改造：静态导出 + Flask 服务静态文件 | 多个文件 | `output: 'export'`、`images.unoptimized`、API baseURL=""、Flask static_folder + SPA catch-all、动态路由 `[id]` 改为查询参数 `/post?id=`（绕过 Turbopack generateStaticParams 限制）、build.sh/build.bat 构建脚本 |
| 2026-07-15 | 恢复 Vercel 独立部署 + 修复 404 | 多个文件 | 回退 static export、恢复 `/posts/[id]` 动态路由、恢复 `NEXT_PUBLIC_API_URL`、更新 vercel.json、清理 backend/static/ |
| 2026-07-15 | 迁移 Flask API 到 Next.js API Routes（纯 Vercel 部署） | `app/api/*`、`lib/store.ts` | 创建 4 个 API Route 文件替代 Flask（posts CRUD + categories + health）、内存数据存储层含种子数据、无需环境变量 |
| 2026-07-15 | 本地启动提示 Node.js 版本过低，升级 | PATH 环境变量 | winget 已安装 v24.18.0，用 PowerShell 修复用户 PATH，移除旧版 v16.13.2 |
| 2026-07-15 | 更新 README.md 反映一体化部署 | `README.md` | 项目介绍、技术栈、目录结构、快速开始（3 条命令）、API 表、页面路由表、Vercel 部署、Railway 备选方案 |
| 2026-07-15 | 生成 API.md 详细接口文档 | `API.md` | 7 个核心接口 + 健康检查，每个接口含请求/响应示例、字段表、错误码汇总、cURL 测试命令 |
| 2026-07-15 | 首页卡片网格改为列表形式 | `app/page.tsx` | 移除 grid/sm:grid-cols-2/lg:grid-cols-3 多列布局，改为单列列表 + divide-y 分割线；每行横向排列标题/摘要 + 分类/日期；hover 左移 + 渐变蓝色背景 |
| 2026-07-15 | 全面视觉优化：靛蓝渐变主题、毛玻璃导航栏、圆角卡片、背景纹理 | `globals.css`、`layout.tsx`、`page.tsx`、`posts/[id]/page.tsx`、`admin/page.tsx` | 主色调 indigo-600→blue-600 渐变；导航栏 glassmorphism (bg-white/75 backdrop-blur-xl)；按钮渐变背景 + hover:scale-105；列表 hover 上浮；globals.css 添加圆点背景图案、fadeInUp 动画、gradient-text 工具类；弹窗 backdrop-blur-sm 模糊遮罩 |
| 2026-07-15 | 文章详情页优化：阅读进度条、Markdown 渲染、排版插件 | `posts/[id]/page.tsx`、`globals.css`、`package.json` | 安装 @tailwindcss/typography + react-markdown；全局 CSS 添加 @plugin；页面顶部固定渐变滚动进度条(z-20)；ReactMarkdown 渲染正文支持 ## 标题/代码块/段落；prose prose-lg prose-indigo 排版；📂📅 图标化元信息；返回按钮箭头 hover:-translate-x-1.5 |
| 2026-07-15 | 丰富 8 篇示例文章内容 | `lib/store.ts` | 每篇从 2-3 句扩充为完整博文(500-700字)，含 ## 标题、代码块、列表、表格、加粗等 Markdown 结构；中文引号""替换为「」避免 JS 解析错误 |
| 2026-07-15 | 后台管理页专业风格重设计 | `app/admin/page.tsx` | 页面标题 📋+副标题；3 列统计卡片(文章总数/分类总数/快捷操作)；斑马纹表格(even:bg-white odd:bg-slate-50/30)；分类标签分色(蓝色技术/翠绿生活/紫色随笔)；编辑🗑删除按钮带图标；弹窗 backdrop-blur + fadeInUp 动画；提交按钮 SVG spinner；空状态引导 |
| 2026-07-15 | 创建全局 404 页面 + 文章 not-found 页 + 可复用空状态组件 | `app/not-found.tsx`、`app/posts/[id]/not-found.tsx`、`components/EmptyState.tsx` | EmptyState 组件支持 icon/title/description/action props；全局 404 显示 🔍 + 404 大字 + 返回首页/后台管理双按钮；文章 404 带导航栏风格统一；posts/[id] 页面改用 notFound() 函数触发 not-found.tsx；首页/后台空状态替换为 EmptyState 组件 |
| 2026-07-15 | 创建骨架屏组件 SkeletonCard | `components/SkeletonCard.tsx`、`page.tsx`、`posts/[id]/page.tsx`、`admin/page.tsx` | 4 种变体：list-item(首页列表行)、article(详情页含导航栏+标题+段落)、stat-card(统计卡片)、table-row(表格行)；支持 count 批量渲染；替换 3 个页面共 ~90 行内联骨架代码 |
| 2026-07-15 | 安装 react-hot-toast 替代 alert | `components/ToastProvider.tsx`、`layout.tsx`、`admin/page.tsx` | npm install react-hot-toast；ToastProvider 全局配置(顶部居中/3秒/深色圆角)；admin 6 处 alert() → toast.success/error；创建→"文章发布成功！"、更新→"文章已更新！"、删除→"文章已删除" |
| 2026-07-15 | 后台表单校验优化：onBlur 即时验证 + 红色错误边框 | `app/admin/page.tsx` | useForm mode: "onBlur" 失焦立即校验；3 个表单字段添加条件 className(error ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100")；错误文字添加 animate-fade-in-up 动画 |
| 2026-07-15 | 安装 framer-motion 添加页面过渡 + 列表 staggered 动画 | `components/PageTransition.tsx`、`components/ClientLayout.tsx`、`layout.tsx`、`page.tsx` | npm install framer-motion；PageTransition 包裹全局(淡入+上滑12px/0.3s)；ClientLayout 客户端桥接；首页列表 Variants：container staggerChildren:0.08s + item y20→0/duration:0.4s 依次上浮 |
| 2026-07-15 | 添加文章搜索功能 | `components/SearchBar.tsx`、`page.tsx`、`lib/api.ts`、`lib/store.ts`、`app/api/posts/route.ts`、`backend/routes/posts.py` | SearchBar 组件 500ms 防抖；store.getPostList(q?) 按标题/摘要/分类名过滤；API route 读取 ?q= 参数；Flask ILIKE 模糊搜索；导航栏嵌入搜索框+后台管理按钮；搜索结果动态标题"找到 N 篇与「关键词」相关的文章" |
| 2026-07-15 | 添加文章分页功能 | `components/Pagination.tsx`、`app/api/posts/route.ts`、`lib/api.ts`、`page.tsx`、`admin/page.tsx`、`backend/routes/posts.py` | API 返回 {posts, total, page, limit, totalPages}；Pagination 组件(←上一页/页码/下一页→)；当前页渐变蓝高亮；首页/末页按钮自动 disable；切页 smooth scrollTo top；默认 limit=6；Flask offset/limit 分页；admin 适配 .posts 新格式 |

---

> **统计：** 本项目共经历 **39 轮 AI 对话**，覆盖项目初始化 → 前端开发 → 后端开发 → 部署调试 → 架构重构 → UI 重设计 → 交互优化 → 搜索分页 → 文档完善全流程。
