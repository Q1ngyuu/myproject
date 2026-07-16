"""Add 22 additional posts to reach 30 total."""
from app import app, db
from models import Post

NEW_POSTS = [
    # ── 技术 (6篇) ──
    (1, 'Docker 容器化部署实战',
     '从 Dockerfile 编写到 docker-compose 编排，一站式掌握容器化部署。',
     '## 为什么需要 Docker？\n\nDocker 解决了"在我机器上能跑"的经典问题。通过容器化，开发、测试、生产环境完全一致。\n\n## Dockerfile 基础\n\n```dockerfile\nFROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD ["python", "app.py"]\n```\n\n## Docker Compose\n\n```yaml\nversion: "3.8"\nservices:\n  web:\n    build: .\n    ports:\n      - "5000:5000"\n```\n\n## 常用命令\n\n- `docker build -t myapp .` 构建镜像\n- `docker run -p 5000:5000 myapp` 运行容器\n- `docker-compose up -d` 启动服务组\n\n## 总结\n\nDocker 是现代开发的必备技能，掌握它能让部署变得简单可靠。'),

    (1, 'Linux 常用命令速查',
     '整理 Linux 开发中最高频使用的命令，提高命令行效率。',
     '## 文件操作\n\n```bash\nls -la          # 列出所有文件\nfind . -name "*.py"  # 查找文件\ntail -f app.log # 实时查看日志\ngrep -r "error" .  # 递归搜索\n```\n\n## 进程管理\n\n```bash\nps aux | grep python   # 查找进程\nkill -9 1234          # 强制终止\nhtop                  # 交互式进程查看\n```\n\n## 网络\n\n```bash\ncurl -X GET http://localhost:5000/api/posts\nnetstat -tlnp | grep 5000\nlsof -i :5000\n```\n\n## 权限\n\n```bash\nchmod +x script.sh    # 添加执行权限\nchown user:group file # 修改所有者\nchmod 600 secret.key  # 只有所有者可读写\n```'),

    (1, 'MySQL 索引优化指南',
     '深入理解 B+Tree 索引原理，学会分析慢查询并优化数据库性能。',
     '## 索引是什么？\n\n索引就像书的目录，帮助数据库快速定位数据，避免全表扫描。\n\n## B+Tree 索引\n\nMySQL InnoDB 默认使用 B+Tree 索引：\n- 所有数据存储在叶子节点\n- 叶子节点之间通过指针连接，支持范围查询\n- 树的高度通常为 2-4 层\n\n## 最左前缀原则\n\n联合索引 `(a, b, c)` 的情况下：\n- `WHERE a=1` 可以使用索引\n- `WHERE a=1 AND b=2` 可以使用索引\n- `WHERE b=2` 不能使用索引\n\n## EXPLAIN 分析\n\n```sql\nEXPLAIN SELECT * FROM posts WHERE category_id = 1;\n```\n\n关注 type 列：`ALL` < `index` < `range` < `ref` < `const`'),

    (1, 'Redis 缓存策略与实战',
     '学习 Redis 常用数据结构，掌握缓存穿透、击穿、雪崩的解决方案。',
     '## Redis 数据类型\n\n| 类型 | 场景 |\n|------|------|\n| String | 缓存、计数器 |\n| Hash | 对象存储 |\n| List | 消息队列 |\n| Set | 标签、去重 |\n| ZSet | 排行榜 |\n\n## 缓存穿透\n\n查询不存在的数据，缓存和数据库都没有，导致每次请求都打到数据库。\n\n**解决方案：** 布隆过滤器 或 缓存空值。\n\n## 缓存击穿\n\n热点 key 过期瞬间，大量请求直接打到数据库。\n\n**解决方案：** 互斥锁 或 永不过期 + 异步更新。\n\n## 缓存雪崩\n\n大量 key 同时过期，数据库压力骤增。\n\n**解决方案：** 过期时间加随机值、多级缓存、限流降级。'),

    (1, '设计模式：单例与工厂',
     '用 Python 代码演示最常用的两种设计模式，理解其应用场景。',
     '## 单例模式\n\n确保一个类只有一个实例，并提供全局访问点。\n\n```python\nclass Singleton:\n    _instance = None\n\n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance\n```\n\n## 工厂模式\n\n定义一个创建对象的接口，让子类决定实例化哪个类。\n\n```python\nclass Animal:\n    def speak(self): pass\n\nclass Dog(Animal):\n    def speak(self): return "汪汪"\n\nclass Cat(Animal):\n    def speak(self): return "喵喵"\n\ndef animal_factory(name):\n    mapping = {"dog": Dog, "cat": Cat}\n    return mapping.get(name, Animal)()\n```'),

    (1, 'HTTP 协议深入理解',
     '从请求报文到状态码，全面理解 HTTP 协议的工作机制。',
     '## HTTP 请求报文\n\n```\nGET /api/posts HTTP/1.1\nHost: localhost:5000\nAccept: application/json\n```\n\n## HTTP 方法\n\n| 方法 | 语义 | 幂等 |\n|------|------|------|\n| GET | 查询 | 是 |\n| POST | 创建 | 否 |\n| PUT | 全量更新 | 是 |\n| DELETE | 删除 | 是 |\n\n## 状态码\n\n- 200：成功\n- 201：创建成功\n- 400：请求错误\n- 404：未找到\n- 500：服务器错误\n\n## HTTPS\n\nHTTPS = HTTP + TLS，通过非对称加密交换对称密钥。'),

    # ── 前端 (6篇) ──
    (4, 'Tailwind CSS 实战技巧',
     '掌握 Tailwind 的响应式设计、自定义主题和实用插件，高效构建 UI。',
     '## 为什么选择 Tailwind？\n\n传统 CSS 需要命名、切换文件、处理优先级。Tailwind 用原子类直接在 HTML 中描述样式，效率极高。\n\n## 响应式设计\n\n```html\n<div class="w-full md:w-1/2 lg:w-1/3">\n  响应式宽度\n</div>\n```\n\n断点：`sm:640px` `md:768px` `lg:1024px` `xl:1280px`\n\n## 自定义主题\n\n```js\n// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: { brand: "#4F46E5" }\n    }\n  }\n}\n```\n\n## 常用组合\n\n- 卡片：`rounded-2xl shadow-lg p-6 bg-white`\n- 按钮：`px-4 py-2 rounded-xl font-medium transition`'),

    (4, 'Vue 3 Composition API 入门',
     '学会 setup 语法糖、ref/reactive、watch/computed，快速上手 Vue 3。',
     '## setup 语法糖\n\n```vue\n<script setup>\nimport { ref, computed } from "vue";\n\nconst count = ref(0);\nconst double = computed(() => count.value * 2);\n\nfunction increment() {\n  count.value++;\n}\n</script>\n\n<template>\n  <button @click="increment">\n    {{ count }} x 2 = {{ double }}\n  </button>\n</template>\n```\n\n## ref vs reactive\n\n- `ref`：包装基本类型，访问需要 `.value`\n- `reactive`：包装对象，直接访问属性\n\n## watch vs watchEffect\n\n- `watch(source, callback)`：明确监听某个数据源\n- `watchEffect(callback)`：自动追踪回调中的响应式依赖'),

    (4, 'CSS Grid 布局完全指南',
     '图解 Grid 容器属性与项目属性，轻松实现复杂二维布局。',
     '## Grid vs Flexbox\n\n- Flexbox：一维布局（行或列）\n- Grid：二维布局（行和列同时）\n\n## 容器属性\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: auto;\n  gap: 1rem;\n}\n```\n\n## 项目属性\n\n```css\n.item {\n  grid-column: span 2;\n  grid-row: 1 / 3;\n}\n```\n\n## 实用布局\n\n圣杯布局：`grid-template-columns: 200px 1fr 200px;`'),

    (4, 'TypeScript 泛型高级用法',
     '深入理解泛型约束、条件类型、映射类型，写出类型安全的代码。',
     '## 基础泛型\n\n```typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n```\n\n## 泛型约束\n\n```typescript\ninterface HasLength {\n  length: number;\n}\n\nfunction logLength<T extends HasLength>(arg: T): T {\n  console.log(arg.length);\n  return arg;\n}\n```\n\n## 条件类型\n\n```typescript\ntype IsString<T> = T extends string ? true : false;\n```\n\n## 映射类型\n\n```typescript\ntype Readonly<T> = {\n  readonly [K in keyof T]: T[K];\n};\n```'),

    (4, 'Next.js 服务端渲染原理',
     '了解 SSR、SSG、ISR 的区别，选择最适合的渲染策略。',
     '## 三种渲染模式\n\n| 模式 | 生成时机 | 适用场景 |\n|------|----------|----------|\n| SSR | 每次请求 | 个性化内容 |\n| SSG | 构建时 | 静态内容 |\n| ISR | 构建时 + 按需 | 大部分页面 |\n\n## SSR\n\n服务端每次请求时渲染页面，返回完整 HTML。SEO 友好，但服务器压力大。\n\n## SSG\n\n构建时生成所有静态 HTML，访问速度最快，但内容更新需要重新构建。\n\n## ISR\n\n构建时生成静态页面，设置 revalidate 时间，后台按需重新生成。'),

    (4, 'Webpack 到 Vite：构建工具演进',
     '对比 Webpack 和 Vite 的开发体验，了解 ESM 原生支持的威力。',
     '## Webpack 的时代\n\nWebpack 将一切视为模块，通过 loader 和 plugin 实现强大的构建能力。但项目大了之后，冷启动和热更新越来越慢。\n\n## Vite 的革新\n\nVite 利用浏览器原生 ESM 支持：\n- 开发时：按需编译，只处理浏览器请求的模块\n- 生产时：Rollup 打包，输出优化产物\n\n## 速度对比\n\n| | Webpack 5 | Vite 5 |\n|------|-----------|--------|\n| 冷启动 | 30-60s | <1s |\n| HMR | 1-5s | <50ms |\n\n## 迁移建议\n\n中小项目可以直接迁移到 Vite，大型项目建议渐进式迁移。'),

    # ── 生活 (5篇) ──
    (2, '如何打造高效的工作环境',
     '从桌面布置到工具选择，打造一个让你专注工作的环境。',
     '## 桌面环境\n\n一个整洁的桌面能让思维更清晰。我推荐：\n- 主显示器 + 副屏竖放（看代码超方便）\n- 机械键盘（青轴打字，红轴编码）\n- 人体工学椅（久坐必备）\n\n## 软件工具\n\n- VS Code：主力编辑器，插件生态无敌\n- iTerm2 + Oh My Zsh：终端美化\n- Notion：笔记 + 任务管理\n\n## 时间管理\n\n番茄工作法：25 分钟专注 + 5 分钟休息，4 个番茄后休息 15 分钟。\n\n## 音乐\n\n推荐 coding 时听 Lo-Fi / 古典音乐 / 白噪音。'),

    (2, '我的 2024 书单推荐',
     '分享今年读过的好书，涵盖技术、文学、哲学多个领域。',
     '## 技术类\n\n1. 《代码整洁之道》—— 写出让人看得懂的代码\n2. 《深入理解计算机系统》—— CS:APP，经典中的经典\n3. 《设计数据密集型应用》—— DDIA，分布式系统必读\n\n## 文学类\n\n4. 《百年孤独》—— 魔幻现实主义的巅峰\n5. 《活着》—— 余华的代表作\n6. 《小王子》—— 每个年龄段都能读出不同的感悟\n\n## 哲学/思维\n\n7. 《思考，快与慢》—— 理解大脑的两套系统\n8. 《原子习惯》—— 小习惯带来大改变'),

    (2, '健身半年的变化与心得',
     '坚持健身 6 个月，体重降了 8kg，分享我的训练计划和饮食方案。',
     '## 初始状态\n\n身高 175cm，体重 78kg，体脂率约 25%。久坐写代码，肩颈经常酸痛。\n\n## 训练计划\n\n每周 4 练：\n- 周一：胸 + 三头\n- 周二：背 + 二头\n- 周四：腿 + 肩\n- 周五：全身 + 核心\n\n## 饮食调整\n\n- 早餐：燕麦 + 鸡蛋 + 牛奶\n- 午餐：正常吃，少油\n- 晚餐：鸡胸肉 + 蔬菜 + 红薯\n- 戒掉了奶茶和零食\n\n## 变化\n\n6 个月后：70kg，体脂率约 18%。最重要的是精神状态好了很多。'),

    (2, '一个人的旅行：成都到拉萨',
     '骑行 318 国道，22 天，2200 公里，一路风景一路歌。',
     '## 准备工作\n\n提前 3 个月开始体能训练，每天骑行 30km。装备清单：\n- 山地车 + 驮包\n- 冲锋衣 + 速干衣\n- 修车工具 + 备用内胎\n\n## 难忘的路段\n\n- 折多山：川藏线上第一座 4000 米以上的山\n- 怒江 72 拐：下坡超爽，但刹车片差点磨光\n- 然乌湖：湖水蓝得不真实，停下来拍了一个小时\n\n## 到达拉萨\n\n看到布达拉宫的那一刻，所有疲惫都值了。这趟旅行让我明白：很多事情不是做不到，只是不敢开始。'),

    (2, '学会做 10 道家常菜',
     '从厨房小白到能做一桌菜，记录我的烹饪学习之路。',
     '## 入门菜\n\n1. 西红柿炒鸡蛋 —— 国民第一菜，关键在于鸡蛋要嫩\n2. 酸辣土豆丝 —— 切丝要均匀，大火快炒\n3. 可乐鸡翅 —— 零失败，新手友好\n\n## 进阶菜\n\n4. 红烧排骨 —— 炒糖色是关键，小火慢炖 40 分钟\n5. 清蒸鲈鱼 —— 蒸 8 分钟，淋上热油和蒸鱼豉油\n6. 麻婆豆腐 —— 灵魂是豆瓣酱和花椒粉\n\n## 心得\n\n- 火候比调料重要\n- 买菜选时令的，食材好菜就好吃\n- 做饭是很好的减压方式'),

    # ── 随笔 (5篇) ──
    (3, '程序员的 35 岁危机真的存在吗',
     '关于年龄焦虑，我有一些不同的看法。',
     '## 焦虑的来源\n\n网上充斥着"35 岁被裁""程序员吃青春饭"的言论，让很多年轻程序员感到不安。\n\n但我认为，35 岁被淘汰的不是年龄，而是能力停滞。\n\n## 我的观察\n\n身边超过 35 岁的优秀程序员，都有这些共同点：\n1. 持续学习，不局限于一种语言/框架\n2. 有业务理解能力，不只是"接需求写代码"\n3. 能带人、能沟通、能推动事情落地\n\n## 建议\n\n- 每年学一门新语言或新框架\n- 多关注系统设计和架构\n- 培养软技能：沟通、管理、产品思维'),

    (3, '为什么我选择写博客',
     '坚持写作两年，说说博客给我带来的改变。',
     '## 开始的原因\n\n最初是为了记录学到的技术，方便以后查阅。写着写着发现，把知识写清楚比看懂难得多。\n\n## 写作的好处\n\n1. 加深理解：能写清楚才是真的懂\n2. 建立个人品牌：博客是最好的简历\n3. 认识同好：通过博客认识了很多朋友\n4. 被动收入：虽然不多，但广告费够买咖啡\n\n## 坚持的秘诀\n\n- 不追求完美，先写出来再改\n- 每周一篇，养成习惯\n- 写自己真正感兴趣的内容'),

    (3, '深夜 coding 的利与弊',
     '夜深人静时写代码效率翻倍，但代价是什么？',
     '## 为什么喜欢深夜 coding\n\n- 没有消息打扰，没有会议，完整的连续时间\n- 大脑反而更清醒（可能因为安静）\n- 有一种"世界只剩我和代码"的沉浸感\n\n## 代价\n\n- 第二天精神差，形成恶性循环\n- 长期熬夜对身体的影响是累积的\n- 失去了和家人/朋友相处的晚间时间\n\n## 尝试调整\n\n最近开始尝试早起 coding：晚上 11 点睡觉，早上 6 点起床，6:30-8:30 专注 2 小时。试了两周，效率完全不输深夜。'),

    (3, '关于 AI 取代程序员的思考',
     'Copilot 和 ChatGPT 让编程门槛降低，我们该何去何从？',
     '## AI 能做什么\n\n- 自动补全代码（Copilot 已经很好用了）\n- 生成样板代码（CRUD 基本不用手写）\n- Bug 修复建议（有时候比 Google 快）\n\n## AI 不能做什么\n\n- 理解复杂业务逻辑\n- 做出架构级别的决策\n- 与产品、设计、测试有效沟通\n- 对代码质量和可维护性负责\n\n## 我的看法\n\nAI 不会取代程序员，但会用 AI 的程序员会取代不会用的。未来的程序员更像是 AI 的指挥者。'),

    (3, '从一个 Bug 学到的教训',
     '一个简单的缩进错误让我 debug 了 3 个小时，记录这次惨痛经历。',
     '## Bug 描述\n\n写一个 Flask API 时，所有 POST 请求都返回 500，但日志里没有任何错误信息。\n\n## Debug 过程\n\n1. 检查请求体格式 — 没问题\n2. 检查数据库连接 — 正常\n3. 添加 print 调试 — 没输出\n4. 逐行注释代码 — 发现 try/except 里有个地方吞掉了异常\n\n## 真正的 Bug\n\n```python\ntry:\n    data = request.get_json()\nexcept:\n    pass  # 这里吞掉了所有异常！\n```\n\n一个裸 except: pass 让所有错误都石沉大海。\n\n## 教训\n\n1. 永远不要写裸 except\n2. 永远不要 except: pass\n3. 至少记录一下异常信息'),
]

with app.app_context():
    count = Post.query.count()
    print(f"Before: {count} posts")

    for cat_id, title, summary, content in NEW_POSTS:
        post = Post(title=title, content=content, summary=summary, category_id=cat_id)
        db.session.add(post)

    db.session.commit()
    print(f"After: {Post.query.count()} posts")
    print(f"Added {len(NEW_POSTS)} posts")
