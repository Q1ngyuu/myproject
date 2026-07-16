// In-memory data store with JSON file persistence for local dev.
// On Vercel serverless, data lives only for the function's lifetime.

let posts: PostRow[] = [];
let categories: CategoryRow[] = [];
let nextPostId = 1;
let nextCategoryId = 1;

export interface PostRow {
  id: number;
  title: string;
  content: string;
  summary: string | null;
  category_id: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface CategoryRow {
  id: number;
  name: string;
}

function now(): string {
  return new Date().toISOString();
}

export function initStore(): void {
  if (categories.length > 0) return; // already seeded

  categories = [
    { id: nextCategoryId++, name: "技术" },
    { id: nextCategoryId++, name: "生活" },
    { id: nextCategoryId++, name: "随笔" },
    { id: nextCategoryId++, name: "前端" },
  ];

  const [tech, life, essay, frontend] = categories;

  posts = [
    {
      id: nextPostId++,
      title: "Python Flask 入门指南",
      content:
        "Flask 是一个轻量级的 Python Web 框架，由 Armin Ronacher 开发。它的设计哲学是「微内核 + 扩展」，核心只包含路由、请求和响应处理等基础功能，其他如数据库 ORM、表单验证等通过插件灵活扩展。\n\n" +
        "## 为什么选择 Flask？\n\n" +
        "相比 Django 这种「大而全」的框架，Flask 更加灵活轻便。你可以自由选择自己喜欢的组件：用 SQLAlchemy 还是 Peewee 做 ORM？用 Jinja2 还是 Mako 做模板引擎？一切都由你决定。\n\n" +
        "Flask 的学习曲线非常平缓，初学者可以在一个下午就搭建出一个可用的 Web 应用。这也是为什么它常年位列 Python Web 框架排行榜前三。\n\n" +
        "## 快速上手\n\n" +
        "安装 Flask 只需要一行命令：\n\n" +
        "```bash\npip install flask\n```\n\n" +
        "创建一个最简单的应用：\n\n" +
        "```python\nfrom flask import Flask\n\napp = Flask(__name__)\n\n@app.route('/')\ndef hello():\n    return 'Hello, World!'\n\nif __name__ == '__main__':\n    app.run(debug=True)\n```\n\n" +
        "运行后访问 `http://127.0.0.1:5000/`，你就能看到那句经典的 Hello, World! 了。\n\n" +
        "## 路由与视图函数\n\n" +
        "Flask 使用装饰器来定义路由，支持动态 URL 参数、类型转换和自定义转换器：\n\n" +
        "```python\n@app.route('/user/<int:user_id>')\ndef user_profile(user_id):\n    return f'用户 {user_id} 的主页'\n```\n\n" +
        "你可以轻松定义 GET、POST、PUT、DELETE 等 HTTP 方法，构建出标准的 RESTful API。\n\n" +
        "## 模板渲染\n\n" +
        "Flask 默认集成 Jinja2 模板引擎，支持模板继承、条件判断、循环等丰富的语法，让你可以快速构建动态页面。配合 Bootstrap 或 Tailwind CSS，前端开发效率极高。\n\n" +
        "## 总结\n\n" +
        "Flask 是一个非常适合入门和快速原型开发的框架。当你需要更大的灵活性，或者项目规模不大时，Flask 是非常好的选择。如果你正准备学习 Web 开发，不妨从 Flask 开始。",
      summary: "从零开始学习 Flask Web 开发，涵盖路由、模板、数据库等核心概念",
      category_id: tech.id,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: nextPostId++,
      title: "理解 RESTful API 设计",
      content:
        "REST（Representational State Transfer）是 Roy Fielding 在 2000 年提出的软件架构风格。它不是一种标准，而是一组设计原则和约束条件。一个好的 RESTful API 应该让使用者一眼就能理解如何与你的服务交互。\n\n" +
        "## 核心原则\n\n" +
        "### 1. 资源导向\n\n" +
        "REST 的核心思想是把一切都视为「资源」。每个资源有一个唯一的 URI，比如 `/users/1` 表示 ID 为 1 的用户。URI 应该用名词而非动词——用 `/articles` 而不是 `/getArticles`。\n\n" +
        "### 2. 无状态通信\n\n" +
        "每个请求必须包含服务器理解该请求所需的所有信息。服务器不应该在请求之间存储客户端的状态。这样做的好处是系统更容易扩展，因为任何服务器节点都可以处理任何请求。\n\n" +
        "### 3. 统一接口\n\n" +
        "使用标准的 HTTP 方法来操作资源：\n\n" +
        "- `GET /articles` — 获取文章列表\n" +
        "- `GET /articles/1` — 获取单篇文章\n" +
        "- `POST /articles` — 创建新文章\n" +
        "- `PUT /articles/1` — 更新整篇文章\n" +
        "- `PATCH /articles/1` — 部分更新文章\n" +
        "- `DELETE /articles/1` — 删除文章\n\n" +
        "### 4. 使用合适的 HTTP 状态码\n\n" +
        "状态码是 API 与客户端沟通的重要语言：\n\n" +
        "- `200 OK` — 请求成功\n" +
        "- `201 Created` — 资源创建成功\n" +
        "- `204 No Content` — 删除成功，无返回内容\n" +
        "- `400 Bad Request` — 请求参数有误\n" +
        "- `401 Unauthorized` — 未认证\n" +
        "- `404 Not Found` — 资源不存在\n" +
        "- `500 Internal Server Error` — 服务器内部错误\n\n" +
        "## API 版本管理\n\n" +
        "API 不可能一成不变。常见的版本管理策略有三种：\n\n" +
        "1. **URL 路径版本**：`/api/v1/articles` — 最直观，但不够 RESTful\n" +
        "2. **请求头版本**：`Accept: application/vnd.myapi.v1+json` — 更 RESTful，但不直观\n" +
        "3. **查询参数版本**：`/api/articles?version=1` — 简单但容易遗漏\n\n" +
        "我个人推荐在 URL 中使用版本号，虽然理论上不够「纯粹」，但在实际项目中最为清晰直观。\n\n" +
        "## 分页、过滤与排序\n\n" +
        "当资源数量庞大时，必须提供分页支持：\n\n" +
        "```\nGET /api/articles?page=2&page_size=20&sort=-created_at&category=tech\n```\n\n" +
        "返回的响应中应该包含分页元数据，方便客户端了解当前页面的位置。\n\n" +
        "## 总结\n\n" +
        "设计一个好的 RESTful API 并不难，关键在于遵循约定俗成的规范，保持一致性。记住：API 的用户是开发者，让他们的体验尽可能顺畅，你的 API 就是成功的。",
      summary: "深入理解 RESTful API 设计原则、HTTP 状态码、版本管理与分页策略",
      category_id: tech.id,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: nextPostId++,
      title: "周末徒步登山记",
      content:
        "周六清晨六点，闹钟还没响，我已经自然醒了。窗外的天空泛着鱼肚白，是个难得的好天气。今天的目标是城北的凤凰山，海拔不算高，但沿途风景据说极好。\n\n" +
        "## 出发\n\n" +
        "简单收拾了背包——两瓶水、三明治、充电宝、防晒霜，还有那顶陪了我三年的渔夫帽。驱车两小时，到达山脚停车场时已经八点半。停车场只有零星几辆车，看来今天人不多，正合我意。\n\n" +
        "山脚的空气明显比市区清新许多，带着青草和泥土的气息。入口处有一块木牌，上面写着「凤凰山森林公园」，字迹已经斑驳，透着一股岁月的味道。\n\n" +
        "## 登山途中\n\n" +
        "前半小时是缓坡，路面铺着碎石，走起来还算轻松。路边开满了不知名的野花，紫色的、白色的、黄色的，在晨风中轻轻摇曳。偶尔有早起的鸟儿从头顶掠过，留下一串清脆的鸣叫。\n\n" +
        "走过缓坡后，路开始变陡。石阶被雨水冲刷得有些光滑，每一步都要踩稳。心率明显上来了，能听到自己粗重的呼吸声。停下来喝口水，回头一看——远处的城市已经在晨雾中若隐若现，高楼大厦变成了小小的积木块。\n\n" +
        "半山腰遇到了一位老大爷，看起来六十多岁，背着手慢悠悠地往上走。聊了两句才知道，他每周都来，已经坚持了十几年。「爬山不在于快，在于坚持。」老大爷笑呵呵地说完，继续稳步向前。\n\n" +
        "## 登顶\n\n" +
        "经过两个小时的攀登，终于到达了山顶。那一刻，所有的疲惫都被眼前的景色冲散了。\n\n" +
        "云海在脚下翻涌，远处的山峦层层叠叠，像一幅水墨画。阳光穿过云层洒下来，给整片云海镀上了一层金色。山顶的风很大，吹得衣服猎猎作响，但那种站在高处的畅快感，是坐在办公室里永远体会不到的。\n\n" +
        "我在山顶找了块平整的石头坐下，掏出三明治慢慢吃着。这一刻，时间好像变慢了。没有消息提醒，没有会议邀请，只有风声、鸟鸣和自己平稳的呼吸。\n\n" +
        "## 下山\n\n" +
        "下山比上山快得多，但对膝盖的冲击也大得多。每一步都能感觉到小腿肌肉的抗议。不过心情是轻盈的——那种完成了一件事的满足感，足以抵消身体的疲惫。\n\n" +
        "回到停车场已经是下午两点。坐在车里，看着后视镜里渐行渐远的山，心里已经在计划下一次的路线了。\n\n" +
        "## 一点感悟\n\n" +
        "登山这件事，和生活中的很多事情其实很像——过程虽然辛苦，但只要一步一步往前走，总能到达想去的地方。最重要的是，别忘了偶尔停下来，看看沿途的风景。",
      summary: "一次说走就走的户外徒步体验，登顶云海，所有的疲惫都值得了",
      category_id: life.id,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: nextPostId++,
      title: "我的居家办公效率提升方法",
      content:
        "远程办公已经一年多了。刚开始的时候，每天睡到自然醒，穿着睡衣坐在沙发上敲代码，感觉这就是理想中的工作方式。但很快我就发现了一个残酷的事实：效率反而比在公司时更低了。\n\n" +
        "经过一年多的摸索和调整，我总结出了一套适合自己的居家办公方法论。分享出来，希望能帮到同样在远程工作的你。\n\n" +
        "## 1. 固定作息，像上班一样对待\n\n" +
        "最开始我犯的最大错误就是作息混乱。有时候熬夜到凌晨两点，第二天十点才起床，整个上午就废了。\n\n" +
        "后来我给自己定了一个规矩：**每天早上八点起床，九点准时坐到书桌前。** 跟去公司上班一样，该洗漱洗漱，该换衣服换衣服。穿着睡衣工作虽然舒服，但心理上很难切换到「工作模式」。\n\n" +
        "## 2. 打造专属工作区\n\n" +
        "不要在床上或沙发上工作——这是血泪教训。我在书房辟出了一块区域，买了升降桌和人体工学椅，双显示器加机械键盘，整个环境让我一坐下去就有「要开始干活了」的感觉。\n\n" +
        "物理空间的划分对心理状态的影响比你想象的大得多。工作区和生活区的分离，能帮助你在下班后真正「离开」工作。\n\n" +
        "## 3. 番茄工作法 + 时间块\n\n" +
        "我用的是改良版的番茄工作法：\n\n" +
        "- **25 分钟** 深度工作，手机静音、关闭通知\n" +
        "- **5 分钟** 休息，站起来走动、喝水、看看窗外\n" +
        "- 每 4 个番茄钟后，休息 **15-20 分钟**\n\n" +
        "同时我会在每天开始前列出当天的 3 件最重要的事（MIT, Most Important Tasks），优先完成它们。其他琐事排在这三件事后面。\n\n" +
        "## 4. 异步沟通，减少打断\n\n" +
        "远程工作中最大的效率杀手是即时通讯。我关掉了 Slack 和微信的消息提醒，改为每隔两小时集中查看一次。如果是紧急事项，同事会直接打电话。\n\n" +
        "我还养成了一个习惯：写详细的文档而不是口头沟通。一个清晰的 Notion 页面，比来回十几条消息高效得多。\n\n" +
        "## 5. 定期运动，保持精力\n\n" +
        "久坐是健康杀手。我每天中午会出去散步 30 分钟，下午四点左右做一组简单的徒手训练——俯卧撑、深蹲、平板支撑。周末会去骑行或爬山。\n\n" +
        "运动不仅能保持身体健康，更重要的是对心理状态的调节。当你感觉下午昏昏欲睡的时候，十来个俯卧撑比一杯咖啡更管用。\n\n" +
        "## 总结\n\n" +
        "居家办公不是「躺着赚钱」的美梦，它需要更强的自律和时间管理能力。但一旦找到了适合自己的节奏，你会发现这种工作方式带来的自由度是传统办公室无法给予的。",
      summary: "一年多远程办公的经验总结，从作息、环境、方法到精力管理",
      category_id: life.id,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: nextPostId++,
      title: "关于阅读这件事",
      content:
        "上个月整理书架，翻出了一本泛黄的《百年孤独》。扉页上写着「2016 年购于北京」，一晃已经十年了。\n\n" +
        "十年前读这本书时，我被那些绕口的人名搞得晕头转向，读到三分之一就放弃了。当时的批注写着：「人物关系太复杂，看不下去。」现在重新翻开，却一口气读完了全书，连那些曾经觉得啰嗦的段落都变得意味深长。\n\n" +
        "## 书还是那本书，变的是人\n\n" +
        "这让我想明白了一件事：**阅读从来不只是关于书，更是关于你与书相遇时的自己。**\n\n" +
        "二十岁时读《百年孤独》，看到的是一个魔幻的故事。三十岁时再读，读到的是家族的轮回、时间的循环，以及那种刻在骨子里的孤独感。不是马尔克斯变了，是我变了。我开始理解为什么布恩迪亚家族的人总是在重复同样的错误——因为我们每个人不也如此吗？\n\n" +
        "## 阅读的层次\n\n" +
        "有人说阅读有四个层次：\n\n" +
        "1. **基础阅读** — 认识字，理解句子\n" +
        "2. **检视阅读** — 快速浏览，抓住主旨\n" +
        "3. **分析阅读** — 深入理解，批判性思考\n" +
        "4. **主题阅读** — 围绕一个主题，读多本书，构建自己的知识体系\n\n" +
        "大多数人停留在第一和第二层。只有当你开始分析阅读时，书才真正开始「为你所用」。这不是说每本书都需要精读——有些书快速浏览就够了——但那些真正重要的书，值得你花时间去消化、去质疑、去内化。\n\n" +
        "## 我的阅读习惯\n\n" +
        "这几年我逐渐形成了一些阅读习惯：\n\n" +
        "**做笔记**：不是摘抄，而是用自己的话复述作者的观点，然后写下自己的思考。这个过程能帮你确认自己是否真的理解了。\n\n" +
        "**交叉阅读**：同时读 2-3 本书，一本专业书、一本文学作品、一本杂书。不同领域的知识会在你的大脑中产生意想不到的连接。\n\n" +
        "**读完要输出**：读完一本书后，我会写一篇简短的读后感，哪怕只有几百字。输出的过程是最好的消化。\n\n" +
        "**不勉强自己**：如果一本书读了 50 页还提不起兴趣，就果断放下。世界上好书太多，不值得为一本不合适的书浪费时间。\n\n" +
        "## 阅读的意义\n\n" +
        "在这个短视频和碎片信息泛滥的时代，静下心来读一本完整的书变得越来越奢侈。但正因为如此，深度阅读变得更加珍贵。\n\n" +
        "阅读让我知道，我遇到的问题，几百年前就有人思考过；我经历的迷茫，前人也曾走过。这种跨越时空的共鸣，是其他任何媒介都无法给予的。\n\n" +
        "如果你也很久没有好好读一本书了，不妨今晚关掉手机，拿起那本一直想读但一直没读的书。哪怕只读半小时。",
      summary: "从重读《百年孤独》谈起，聊聊阅读的层次、习惯与意义",
      category_id: essay.id,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: nextPostId++,
      title: "Git 工作流的思考",
      content:
        "团队协作中，选择一个合适的 Git 工作流，往往比选择什么技术栈更重要。技术栈可以迁移，但工作流一旦形成习惯，会深刻影响团队的协作效率和代码质量。\n\n" +
        "## 主流的 Git 工作流\n\n" +
        "### Git Flow\n\n" +
        "Git Flow 是最经典的分支模型，由 Vincent Driessen 在 2010 年提出。它定义了一套严格的分支体系：\n\n" +
        "- **main** — 生产环境代码，只接受来自 release 和 hotfix 的合并\n" +
        "- **develop** — 开发主线，功能分支从这里切出，完成后合并回来\n" +
        "- **feature/xxx** — 功能开发分支\n" +
        "- **release/x.x.x** — 发布准备分支\n" +
        "- **hotfix/xxx** — 紧急修复分支\n\n" +
        "Git Flow 适合有固定发布周期的项目，比如按月发布版本的移动应用或桌面软件。但对于持续部署的 Web 应用来说，这套流程显得过于繁琐。\n\n" +
        "### GitHub Flow\n\n" +
        "GitHub Flow 是 GitHub 内部使用的工作流，极其简洁：\n\n" +
        "1. `main` 分支始终可部署\n" +
        "2. 任何新工作从 `main` 切出分支\n" +
        "3. 分支名要有描述性，如 `add-user-auth`\n" +
        "4. 提交 PR，进行代码审查\n" +
        "5. 合并后立即部署\n\n" +
        "GitHub Flow 的理念是「持续部署」，适合网站和 SaaS 产品。它的优势是简单、快速，缺点是对团队的代码审查和自动化测试要求较高。\n\n" +
        "### Trunk-Based Development（TBD）\n\n" +
        "TBD 是更激进的方案：所有开发者直接向主干提交，分支的生命周期极短（通常不超过一天）。Google 和 Facebook 等大厂都在使用这种模式。\n\n" +
        "这要求极其完善的自动化测试和特性开关（Feature Flag），不适合大多数中小团队。\n\n" +
        "## 如何选择？\n\n" +
        "没有银弹，选择取决于你的团队和项目：\n\n" +
        "| 场景 | 推荐工作流 |\n" +
        "|---|---|\n" +
        "| 小型团队（2-5 人），持续部署 | GitHub Flow |\n" +
        "| 中型团队，固定发布周期 | Git Flow |\n" +
        "| 开源项目，外部贡献者多 | GitHub Flow + Fork |\n" +
        "| 大型团队，完善的 CI/CD | Trunk-Based |\n\n" +
        "## 写好 Commit Message\n\n" +
        "无论选择哪种工作流，写好 Commit Message 都是基本素养。我推荐使用 Conventional Commits 规范：\n\n" +
        "```\nfeat: add user login with JWT\nfix: resolve race condition in order creation\nrefactor: extract validators into shared module\ndocs: update API documentation\nstyle: format code with prettier\n```\n\n" +
        "一个好的 Commit Message 应该能回答「为什么做这个改动」，而不仅仅是「改了什么」。Diff 已经告诉了你改了什么，但不会告诉你原因。\n\n" +
        "## 代码审查的文化\n\n" +
        "工具和流程只是手段，真正重要的是团队的代码审查文化。一个好的代码审查应该是：\n\n" +
        "- **善意的** — 目标是提高代码质量，而不是挑剔别人\n" +
        "- **具体的** — 说「这里可能有问题」比「写得不好」更有帮助\n" +
        "- **及时的** — PR 放了两天才 review，开发者的心流早就断了\n" +
        "- **双向的** — 审查者也能从中学到东西\n\n" +
        "## 总结\n\n" +
        "Git 工作流没有对错之分，只有合适与否。选择一个适合你团队规模、项目类型和交付节奏的流程，然后坚持执行。更重要的是，保持开放的心态——当团队成长或项目变化时，工作流也应该随之演进。",
      summary: "深入对比 Git Flow、GitHub Flow 和 Trunk-Based 开发模式，聊聊如何写好 Commit Message",
      category_id: tech.id,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: nextPostId++,
      title: "学会断舍离",
      content:
        "周末花了一整天整理房间。从衣柜开始，到书架，再到堆满杂物的阳台储物柜。最后清理出了三大袋不要的东西——旧衣服、过期的杂志、买了却从没打开过的电子产品。\n\n" +
        "看着客厅地板上堆成小山的「废弃物」，我突然意识到：这些年我到底囤积了多少根本不需要的东西？\n\n" +
        "## 我们为什么喜欢囤积\n\n" +
        "囤积是人类的本能。在远古时代，资源稀缺，多囤一点食物和工具意味着更高的生存概率。但现代社会物质极度丰富，这种本能反而成了一种负担。\n\n" +
        "我发现自己囤积的原因大致有三种：\n\n" +
        "1. **「万一以后用得上」** — 于是那件三年前买的但不合身的衬衫一直挂在衣柜里\n" +
        "2. **「扔掉太可惜」** — 明知道某样东西不会再用了，但觉得扔掉是浪费\n" +
        "3. **「这是回忆啊」** — 旧电影票、展览手册、旅行纪念品……每件都承载着一段记忆\n\n" +
        "## 断舍离不是扔东西\n\n" +
        "日本杂物管理咨询师山下英子提出的「断舍离」概念，常被误解为就是「扔东西」。但其实它包含三个层次：\n\n" +
        "- **断**：断绝不需要的东西进入自己的生活\n" +
        "- **舍**：舍弃家里堆积的废物\n" +
        "- **离**：脱离对物品的执念\n\n" +
        "最重要的其实是「断」——从源头减少不必要的购入。如果做不到这一点，「舍」就只是一次性的清理，过不了多久又会回到原来的状态。\n\n" +
        "## 我的实践方法\n\n" +
        "这次整理，我给自己定了三条标准：\n\n" +
        "1. **一年没用过的东西，果断处理。** 一件东西如果一整年都没有被使用，那基本上以后也不会用了。\n\n" +
        "2. **保留的不是「物品」，而是「使用价值」。** 如果一样东西只有「回忆价值」而没有「使用价值」，我会拍张照片存在手机里，然后把它处理掉。记忆不会因为物品的消失而消失。\n\n" +
        "3. **购入新物品前，先处理掉一件旧物品。** 这个「一进一出」的规则能有效控制物品总量。\n\n" +
        "## 清理后的感受\n\n" +
        "把三大袋东西搬下楼扔掉之后，回到家里，感觉整个空间都「透气」了。\n\n" +
        "书架不再塞得满满当当，留下的都是真正会重读的书。衣柜里的衣服虽然少了，但每一件都是合身且常穿的。阳台的储物柜空出了一半的空间，阳光透过窗户洒进来，连光线都变好了。\n\n" +
        "更意外的收获是心理上的。当周围的环境变得整洁有序时，内心也莫名平静了下来。原来杂乱的环境真的会在无形中消耗注意力——你的大脑一直在无意识地「扫描」那些无序的视觉信息。\n\n" +
        "## 不只是物品\n\n" +
        "断舍离的理念不只适用于物品。社交关系、信息摄入、日程安排，其实都需要定期「断舍离」。\n\n" +
        "取关了那些从不互动的公众号，退出了常年死寂的群聊，删掉了手机上从没打开过的 App。做完这些之后，每天接收的信息量减少了，但质量提高了。\n\n" +
        "**丢掉的不只是物品，还有附着在上面的执念。给自己留出更多空间，才能让真正重要的东西进来。**",
      summary: "一次彻底的断舍离实践，不仅是整理物品，更是对内心的梳理",
      category_id: life.id,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: nextPostId++,
      title: "雨夜随想",
      content:
        "窗外下着淅淅沥沥的小雨。我泡了一杯热茶，放了一张 Bill Evans 的爵士钢琴唱片。这是我最喜欢的夜晚模式。\n\n" +
        "## 雨声\n\n" +
        "雨声大概是这世界上最让人平静的白噪音了。雨点打在窗玻璃上的声音、落在树叶上的声音、顺着屋檐滴落的声音，每一种都不同，但组合在一起却出奇地和谐。\n\n" +
        "有一个专门的词叫「ASMR」，很多人用它来助眠。其实古人早就知道这个道理——「小楼一夜听春雨」，这不就是最早的 ASMR 体验吗？\n\n" +
        "## 慢下来的勇气\n\n" +
        "我发现自己越来越难以「什么都不做」了。\n\n" +
        "等人的时候刷手机，吃饭的时候看视频，走路的时候听播客。每一分钟都要被填满，每一秒钟都要有信息输入。我们害怕「浪费时间」，害怕「什么都没做」，害怕在人生的竞赛中落后一步。\n\n" +
        "但这样的夜晚提醒我：**什么都不做，也是一种「做」。**\n\n" +
        "放空不是浪费，而是给自己的大脑留出整理和消化的空间。那些最好的创意和最深刻的领悟，往往不是在你拼命工作的时候产生的，而是在你散步、洗澡、或者像现在这样——对着窗外发呆的时候悄悄浮现的。\n\n" +
        "## 关于孤独\n\n" +
        "一个人待着，和孤独是两回事。\n\n" +
        "孤独是一种被动状态，你渴望陪伴却得不到。而独处是你主动选择的——你享受与自己相处的时间。这种区别很重要，因为很多人害怕的不是「一个人」，而是「孤独」。\n\n" +
        "学会独处是一种能力。它意味着你不再需要外界的持续刺激来填补内心的空洞。你可以看书、写字、听音乐、或者什么都不做，而不感到焦虑。\n\n" +
        "## 茶凉了\n\n" +
        "不知不觉，茶杯已经见底了。雨也小了许多，从淅淅沥沥变成了若有若无的毛毛细雨。远处偶尔传来几声汽车驶过积水路面的声音。\n\n" +
        "唱片播完了最后一段钢琴独奏，房间里只剩下老式挂钟的滴答声。该去睡觉了。\n\n" +
        "这样的夜晚什么成就都没有，但我觉得很充实。\n\n" +
        "也许，这就是生活本来的样子。",
      summary: "一个安静的雨夜，一杯热茶，一张老唱片，以及一些关于慢生活的零碎感想",
      category_id: essay.id,
      created_at: now(),
      updated_at: now(),
    },
    // ── 技术 (6篇) ──
    {
      id: nextPostId++, title: "Docker 容器化部署实战",
      content:
        "## 为什么需要 Docker？\n\n" +
        "在软件开发中，有一个经典问题：\"在我机器上能跑啊！\"。Docker 的出现彻底解决了这个痛点。通过容器化技术，开发环境、测试环境、生产环境可以做到完全一致。再也不用担心\"环境不一致\"导致的诡异 bug。\n\n" +
        "## Docker 核心概念\n\n" +
        "### 镜像（Image）\n\n" +
        "镜像是一个只读模板，包含了运行应用所需的一切：代码、运行时、系统工具、库和配置。你可以把镜像理解为一个\"快照\"。\n\n" +
        "### 容器（Container）\n\n" +
        "容器是镜像的运行实例。一个镜像可以启动多个容器，每个容器相互隔离。\n\n" +
        "### 仓库（Registry）\n\n" +
        "Docker Hub 是公共的镜像仓库，你可以 push/pull 镜像，就像 Git 一样。\n\n" +
        "## Dockerfile 编写\n\n" +
        "```dockerfile\nFROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\n" +
        "RUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nEXPOSE 5000\n" +
        'CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]\n```\n\n' +
        "### 优化技巧\n\n" +
        "- 使用 `.dockerignore` 排除不必要的文件（`__pycache__`、`.git`、`venv` 等）\n" +
        "- 合并 RUN 命令减少镜像层数\n" +
        "- 使用多阶段构建（multi-stage build）减小最终镜像体积\n" +
        "- 优先使用官方镜像（安全 + 维护好）\n\n" +
        "## Docker Compose 编排\n\n" +
        "单容器应用很简单，但实际项目往往需要多个服务（Web + 数据库 + 缓存）。Docker Compose 可以一键启动所有服务。\n\n" +
        "```yaml\nversion: \"3.8\"\nservices:\n  web:\n    build: .\n    ports:\n      - \"5000:5000\"\n" +
        "    depends_on:\n      - db\n      - redis\n    environment:\n      - DATABASE_URL=postgresql://user:pass@db:5432/blog\n" +
        "  db:\n    image: postgres:15-alpine\n    environment:\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n      POSTGRES_DB: blog\n" +
        "  redis:\n    image: redis:7-alpine\nvolumes:\n  pgdata:\n```\n\n" +
        "## 常用命令速查\n\n" +
        "```bash\n# 镜像管理\ndocker build -t myapp:v1 .          # 构建镜像\ndocker images                        # 列出本地镜像\n" +
        "docker rmi myapp:v1                  # 删除镜像\n\n# 容器管理\ndocker run -d -p 5000:5000 --name app myapp\ndocker ps                            # 运行中的容器\n" +
        'docker stop app && docker rm app     # 停止并删除\n\n# 调试\ndocker logs -f app                   # 实时查看日志\ndocker exec -it app /bin/bash        # 进入容器\n\n' +
        "# Compose\ndocker-compose up -d                 # 启动所有服务\ndocker-compose down                  # 停止并清理\n```\n\n" +
        "## 生产环境注意\n\n" +
        "1. **不要用 root 用户运行容器**，在 Dockerfile 中创建专用用户\n" +
        "2. **设置资源限制**：`--memory=\"512m\" --cpus=\"1.0\"`\n" +
        "3. **健康检查**：在 Dockerfile 中添加 `HEALTHCHECK` 指令\n" +
        "4. **日志收集**：容器日志默认存储在本地，生产环境建议接入 ELK/Grafana Loki\n\n" +
        "## 总结\n\n" +
        "Docker 是现代开发的必备技能。从写好一个 Dockerfile 开始，逐步掌握 Compose 编排和集群管理，你的部署效率将大幅提升。记住：容器化不是目的，解决实际问题才是。",
      summary: "从 Dockerfile 编写到 docker-compose 编排，一站式掌握容器化部署。",
      category_id: tech.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "Linux 常用命令速查",
      content:
        "## 前言\n\n" +
        "对于开发者来说，Linux 命令行是绕不过去的技能。无论你是后端、前端还是运维，每天至少要面对终端几个小时。掌握常用命令，能让你事半功倍。本文整理了日常开发中最高频使用的 Linux 命令，建议收藏，按需查阅。\n\n" +
        "## 文件与目录操作\n\n" +
        "```bash\n# 基础操作\nls -la              # 详细列表（含隐藏文件）\nls -lh              # 人类可读的文件大小\ncd -                # 回到上一个目录\npwd                 # 当前目录路径\n\n" +
        '# 查找文件\nfind . -name "*.py"             # 按名称查找\nfind . -type f -size +10M       # 查找大于 10MB 的文件\nfind . -mtime -1                # 最近一天修改的文件\n' +
        'find . -name "*.log" -delete    # 查找并删除\n\n# 查看文件\ncat file.txt        # 查看全部\nhead -20 file.txt   # 前 20 行\ntail -f app.log     # 实时跟踪日志末尾\n' +
        "less file.txt       # 分页浏览（按 q 退出）\nwc -l file.txt      # 统计行数\n\n# 文件操作\ncp -r src dst       # 递归复制\nmv old new          # 移动/重命名\n" +
        "rm -rf dir/         # 强制递归删除（慎用！）\nln -s /path/target link_name  # 创建软链接\n```\n\n" +
        "## 文本处理\n\n" +
        "```bash\n# grep — 文本搜索瑞士军刀\ngrep \"error\" app.log                # 搜索包含 error 的行\ngrep -i \"error\" app.log             # 忽略大小写\n" +
        'grep -r "TODO" src/                 # 递归搜索目录\ngrep -v "debug" app.log             # 排除匹配的行\ngrep -c "error" app.log             # 统计匹配行数\n' +
        'grep -A 3 "error" app.log           # 显示匹配行及后 3 行\ngrep -B 2 "error" app.log           # 显示匹配行及前 2 行\n\n# awk — 列处理利器\n' +
        "awk '{print $1}' file.txt           # 打印第一列\nawk -F':' '{print $1, $3}' /etc/passwd  # 指定分隔符\n\n# sed — 流编辑器\nsed 's/old/new/g' file.txt          # 替换文本\n" +
        "sed -i 's/old/new/g' file.txt       # 直接修改文件\nsed '5,10d' file.txt                # 删除第 5-10 行\n\n# 管道组合\ncat access.log | grep \"404\" | awk '{print $1}' | sort | uniq -c | sort -rn | head -10\n" +
        "# 找出请求 404 最多的 10 个 IP\n```\n\n" +
        "## 进程管理\n\n" +
        "```bash\nps aux | grep python        # 查找 Python 进程\nps aux --sort=-%mem | head  # 按内存使用排序\nkill -9 1234                # 强制终止进程（最后手段）\n" +
        "killall -9 node             # 终止所有 node 进程\npkill -f \"python app.py\"    # 按命令行匹配终止\nhtop                        # 交互式进程查看器（推荐！）\n" +
        "top -p 1234                 # 监控特定进程\n\n# 后台运行\nnohup python app.py &       # 后台运行，忽略 hangup 信号\nnohup python app.py > app.log 2>&1 &  # 后台运行并重定向输出\n```\n\n" +
        "## 网络相关\n\n" +
        "```bash\n# 端口与连接\nnetstat -tlnp | grep 5000   # 查看 5000 端口占用\nlsof -i :5000               # 查看占用 5000 端口的进程\nss -tlnp                    # 更现代的 netstat\n\n" +
        "# HTTP 请求\ncurl http://localhost:5000/api/posts\ncurl -X POST http://localhost:5000/api/posts -H \"Content-Type: application/json\" -d '{\"title\":\"hello\"}'\n" +
        "curl -I https://example.com  # 只看响应头\n\n# DNS 与连通性\nping google.com              # 测试连通性\nnslookup example.com         # DNS 查询\n```\n\n" +
        "## 权限管理\n\n" +
        "```bash\nchmod +x script.sh           # 添加执行权限\nchmod 755 script.sh          # rwxr-xr-x\nchmod 600 secret.key         # 只有所有者可读写\nchmod -R 755 dir/            # 递归修改\n" +
        "chown user:group file        # 修改所有者\n```\n\n" +
        "## 总结\n\n" +
        "命令行不需要死记硬背，多用自然就熟了。建议每天至少用命令行完成一项任务，一个月后你会发现自己离不开终端了。遇到不记得的命令，`man` 和 `--help` 是最好的老师。",
      summary: "整理 Linux 开发中最高频使用的命令，提高命令行效率。",
      category_id: tech.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "MySQL 索引优化指南",
      content:
        "## 为什么需要索引？\n\n" +
        "想象你在一本 1000 页的书里找一个词，如果没有目录，你只能一页一页翻。数据库也是一样：没有索引，MySQL 必须全表扫描（Full Table Scan），数据量大时性能会急剧下降。索引就像书的目录，能让数据库快速定位到目标数据。\n\n" +
        "## B+Tree 索引原理\n\n" +
        "MySQL InnoDB 引擎默认使用 B+Tree 作为索引结构。理解它的特点，才能更好地设计索引。\n\n" +
        "### B+Tree 的特点\n\n" +
        "1. **所有数据存储在叶子节点**：非叶子节点只存 key，叶子节点存完整行数据（聚簇索引）或主键值（二级索引）\n" +
        "2. **叶子节点通过指针串联成有序链表**：这使得范围查询非常高效\n" +
        "3. **树是平衡的**：查询时间复杂度 O(log n)，通常 3-4 层就能覆盖千万级数据\n\n" +
        "## 索引类型\n\n" +
        "```sql\n-- 主键索引（聚簇索引）\nCREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100));\n" +
        "-- 普通索引\nCREATE INDEX idx_name ON users(name);\n-- 唯一索引\nCREATE UNIQUE INDEX idx_email ON users(email);\n" +
        "-- 联合索引\nCREATE INDEX idx_city_age ON users(city, age);\n-- 前缀索引\nCREATE INDEX idx_title_prefix ON posts(title(20));\n```\n\n" +
        "## 最左前缀原则\n\n" +
        "联合索引 `(a, b, c)` 的情况下：`WHERE a=1` 可以使用索引；`WHERE a=1 AND b=2` 可以使用索引；`WHERE b=2` 不能使用索引（跳过了 a）。**最左列不能少，中间列不能断，范围查询右边的列会失效。**\n\n" +
        "## EXPLAIN 分析\n\n" +
        "```sql\nEXPLAIN SELECT * FROM posts WHERE category_id = 1 ORDER BY created_at DESC;\n```\n\n" +
        "关注这几个关键字段：type（访问类型：const > ref > range > index > ALL）、key（使用的索引）、rows（扫描行数）、Extra（Using index 表示覆盖索引）。如果 type 是 ALL（全表扫描），说明必须加索引了。\n\n" +
        "## 索引优化实战\n\n" +
        "### 1. 覆盖索引\n\n" +
        "如果查询的所有字段都在索引中，MySQL 就不用回表查询，Extra 显示 Using index。\n\n" +
        "### 2. 避免在索引列上做运算\n\n" +
        "`WHERE YEAR(created_at) = 2024` 会导致索引失效，应改为 `WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'`。\n\n" +
        "### 3. 避免隐式类型转换\n\n" +
        "假设 phone 是 VARCHAR 类型，`WHERE phone = 13800138000` 会导致索引失效，应使用字符串：`WHERE phone = '13800138000'`。\n\n" +
        "## 总结\n\n" +
        "索引优化是一个\"理解原理 → 分析执行计划 → 调整索引 → 验证效果\"的循环过程。记住：不是索引越多越好，每个索引都会占用存储空间并降低写入性能。只为高频查询条件建立索引，让 EXPLAIN 告诉你真相。",
      summary: "深入理解 B+Tree 索引原理，学会分析慢查询并优化数据库性能。",
      category_id: tech.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "Redis 缓存策略与实战",
      content:
        "## 为什么需要缓存？\n\n" +
        "现代 Web 应用面临的挑战：用户量增长 → 数据库压力增大 → 响应变慢 → 用户体验下降。缓存的本质是**用空间换时间**：把高频访问的数据放在更快的存储中，减少对数据库的直接访问。Redis 是目前最流行的缓存中间件，单机 QPS 可达 10 万+，延迟通常在 1ms 以内。\n\n" +
        "## Redis 五大基本数据类型\n\n" +
        "### String（字符串）\n\n" +
        "最基础的类型，用于缓存、计数器、分布式锁。`SETEX key 3600 value` 设置 1 小时过期，`INCR page_view:post:1` 原子计数器。\n\n" +
        "### Hash（哈希）\n\n" +
        "适合存储对象，比 String 更节省空间。`HSET user:1001 name \"Alice\" age \"25\"`。\n\n" +
        "### List（列表）\n\n" +
        "可用于消息队列、最新动态列表。`LPUSH news_feed \"post:100\"`，`LRANGE news_feed 0 9` 获取前 10 条。\n\n" +
        "### Set（集合）\n\n" +
        "无序不重复集合，适合标签、共同好友等场景。`SINTER tags:post:1 tags:post:2` 计算共同标签。\n\n" +
        "### ZSet（有序集合）\n\n" +
        "排行榜的最佳选择。`ZADD leaderboard 1000 \"user:1\"`，`ZREVRANGE leaderboard 0 9 WITHSCORES` 获取 Top 10。\n\n" +
        "## 三大缓存问题\n\n" +
        "### 缓存穿透\n\n" +
        "查询一个数据库中也不存在的数据，请求直接打到数据库。解决方案：**布隆过滤器** 或 **缓存空值**（对不存在的数据也缓存一个空值，设置较短的过期时间）。\n\n" +
        "### 缓存击穿\n\n" +
        "某个热点 key 在过期瞬间，大量并发请求同时打到数据库。解决方案：**互斥锁**（第一个请求去查 DB 并重建缓存，其他请求等待）或 **逻辑过期**（后台异步刷新）。\n\n" +
        "### 缓存雪崩\n\n" +
        "大量 key 在同一时间段过期，请求集中打到数据库。解决方案：**过期时间加随机值**（expire = 3600 + random(0, 600)）、**多级缓存**、**限流降级**。\n\n" +
        "## 缓存更新策略\n\n" +
        "| 策略 | 做法 | 适用场景 |\n|------|------|----------|\n| Cache Aside | 先更新 DB，再删除缓存 | 最常用，简单可靠 |\n| Read/Write Through | 缓存层负责读写 DB | 对业务透明 |\n| Write Behind | 先写缓存，异步写 DB | 写密集型，有数据丢失风险 |\n\n" +
        "## 总结\n\n" +
        "Redis 功能强大，但用好它需要理解其数据结构和缓存策略。缓存不是银弹——先有性能瓶颈，再考虑加缓存。掌握穿透、击穿、雪崩的解决方案，是每个后端开发的必修课。",
      summary: "学习 Redis 常用数据结构，掌握缓存穿透、击穿、雪崩的解决方案。",
      category_id: tech.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "设计模式：单例与工厂",
      content:
        "## 什么是设计模式？\n\n" +
        "设计模式是软件开发中反复出现的、经过验证的解决方案。它们不是具体的代码，而是一种可复用的设计经验。GoF 在 1994 年总结了 23 种经典设计模式，本文聚焦最常用的两种创建型模式。\n\n" +
        "## 单例模式（Singleton Pattern）\n\n" +
        "### 定义\n\n" +
        "确保一个类只有一个实例，并提供一个全局访问点。\n\n" +
        "### 什么时候用？\n\n" +
        "数据库连接池、配置管理器、日志记录器、应用中的全局状态管理。这些场景都只需要一个实例。\n\n" +
        "### Python 实现\n\n" +
        "```python\nclass Singleton:\n    _instance = None\n    _initialized = False\n\n    def __new__(cls, *args, **kwargs):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance\n\n    def __init__(self):\n        if not self._initialized:\n            self.data = {}\n            self._initialized = True\n\n# 验证\na = Singleton()\nb = Singleton()\nprint(a is b)        # True — 同一个实例\n```\n\n" +
        "### 优缺点\n\n" +
        "✅ 优点：控制资源访问、全局访问点、避免重复创建。❌ 缺点：隐藏依赖关系、难以单元测试（全局状态）、可能变成\"上帝对象\"。\n\n" +
        "## 工厂模式（Factory Pattern）\n\n" +
        "### 定义\n\n" +
        "定义一个创建对象的接口，让子类决定实例化哪个类。工厂方法使一个类的实例化延迟到其子类。\n\n" +
        "### 实战：支付网关\n\n" +
        "```python\nfrom abc import ABC, abstractmethod\n\nclass PaymentGateway(ABC):\n    @abstractmethod\n    def pay(self, amount: float) -> bool:\n        pass\n\nclass AlipayGateway(PaymentGateway):\n    def pay(self, amount):\n        print(f\"支付宝支付 {amount} 元\")\n        return True\n\nclass WechatGateway(PaymentGateway):\n    def pay(self, amount):\n        print(f\"微信支付 {amount} 元\")\n        return True\n\nclass PaymentFactory:\n    gateways = {\"alipay\": AlipayGateway, \"wechat\": WechatGateway}\n\n    @classmethod\n    def get_gateway(cls, method: str) -> PaymentGateway:\n        gateway = cls.gateways.get(method)\n        if gateway is None:\n            raise ValueError(f\"不支持的支付方式: {method}\")\n        return gateway()\n\n    @classmethod\n    def register(cls, name: str, gateway_class):\n        cls.gateways[name] = gateway_class  # 开闭原则\n```\n\n" +
        "✅ 优点：解耦创建和使用、易于扩展（开闭原则）、统一管理对象创建。❌ 缺点：类数量增多、增加了一层抽象。\n\n" +
        "## 总结\n\n" +
        "设计模式不是银弹，不要为了\"用模式\"而用模式。关键是在合适的场景选择合适的模式：当你确实只需要一个实例时用单例；当创建逻辑复杂，需要根据参数动态决定创建哪个类时用工" +
        "厂。记住：最简单的方案往往是好方案。",
      summary: "用 Python 代码演示最常用的两种设计模式，理解其应用场景。",
      category_id: tech.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "HTTP 协议深入理解",
      content:
        "## 前言\n\n" +
        "HTTP（HyperText Transfer Protocol）是互联网的基石。每天你在浏览器里打开的每一个页面，背后都有成百上千次 HTTP 请求。作为 Web 开发者，深入理解 HTTP 协议是必备基本功。\n\n" +
        "## HTTP 请求报文\n\n" +
        "```\nPOST /api/posts HTTP/1.1\nHost: www.example.com\nContent-Type: application/json\nAuthorization: Bearer eyJhbGciOi...\n\n" +
        '{"title": "Hello World", "category_id": 1, "content": "..."}\n```\n\n' +
        "请求行 = 方法 + 路径 + 协议版本。请求头是键值对形式的元数据。请求体（Body）不是所有请求都有（GET 和 HEAD 没有）。\n\n" +
        "## HTTP 方法\n\n" +
        "| 方法 | 语义 | 幂等性 |\n|------|------|--------|\n| GET | 获取资源 | 是 |\n| POST | 创建资源 | 否 |\n| PUT | 全量替换 | 是 |\n" +
        "| DELETE | 删除资源 | 是 |\n| PATCH | 部分更新 | 否 |\n\n" +
        "幂等性：多次执行相同请求，结果一致。GET 永远幂等，POST 不幂等（多次 POST 会创建多条记录）。\n\n" +
        "## HTTP 状态码\n\n" +
        "- 2xx 成功：200 OK（请求成功）、201 Created（资源创建成功）、204 No Content（成功但没有返回体）\n" +
        "- 3xx 重定向：301 永久重定向（浏览器会缓存）、302 临时重定向、304 Not Modified（资源未修改，使用缓存）\n" +
        "- 4xx 客户端错误：400 Bad Request、401 Unauthorized、403 Forbidden、404 Not Found、422 Unprocessable Entity、429 Too Many Requests\n" +
        "- 5xx 服务器错误：500 Internal Server Error、502 Bad Gateway、503 Service Unavailable、504 Gateway Timeout\n\n" +
        "## HTTP 缓存机制\n\n" +
        "### 强缓存\n\n" +
        "浏览器不向服务器发请求，直接从缓存读取。`Cache-Control: max-age=3600` 缓存 1 小时，`Cache-Control: no-cache` 每次都要验证，`Cache-Control: no-store` 完全不缓存。\n\n" +
        "### 协商缓存\n\n" +
        "浏览器向服务器发请求验证缓存是否有效。请求头 `If-None-Match: \"abc123\"`（ETag 验证），`If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT`。内容未变则返回 `304 Not Modified`。\n\n" +
        "## HTTPS 的工作原理\n\n" +
        "HTTPS = HTTP + TLS。TLS 握手流程：客户端 Hello → 服务器 Hello + 证书 → 客户端验证证书 → 密钥交换 → 生成会话密钥 → 加密通信。HTTPS 提供加密性、完整性和身份认证。\n\n" +
        "## HTTP/1.1 vs HTTP/2 vs HTTP/3\n\n" +
        "| 特性 | HTTP/1.1 | HTTP/2 | HTTP/3 |\n|------|----------|--------|--------|\n| 传输层 | TCP | TCP | QUIC（UDP） |\n" +
        "| 多路复用 | 不支持 | 支持（Stream） | 支持（独立流） |\n| 头部压缩 | 不支持 | HPACK | QPACK |\n| 队头阻塞 | 有 | TCP 层仍有 | 基本消除 |\n\n" +
        "## 总结\n\n" +
        "HTTP 协议比你想象的更\"深\"。从一次简单的浏览器请求，到 TLS 握手、缓存策略、多路复用，每个环节都值得深入理解。建议至少通读一遍 MDN 的 HTTP 文档，配合 Chrome DevTools 的 Network 面板实践观察。",
      summary: "从请求报文到状态码，全面理解 HTTP 协议的工作机制。",
      category_id: tech.id, created_at: now(), updated_at: now(),
    },
    // ── 前端 (6篇) ──
    {
      id: nextPostId++, title: "Tailwind CSS 实战技巧",
      content:
        "## 为什么选择 Tailwind CSS？\n\n" +
        "传统 CSS 开发有几个痛点：命名困难（BEM 很啰嗦）、样式分散、优先级混乱、文件间跳来跳去。Tailwind CSS 另辟蹊径——用原子类直接在 HTML 中描述样式，把\"写 CSS\"变成\"组合类名\"。\n\n" +
        "## 核心理念\n\n" +
        '```html\n<!-- 传统方式 -->\n<div class="card"><h2 class="card-title">标题</h2></div>\n<!-- 然后去 CSS 文件里写 .card { ... } -->\n\n' +
        '<!-- Tailwind 方式 -->\n<div class="rounded-2xl shadow-lg p-6 bg-white">\n  <h2 class="text-xl font-bold text-gray-900">标题</h2>\n</div>\n<!-- 所见即所得，不需要切换文件 -->\n```\n\n' +
        "## 响应式设计\n\n" +
        "Tailwind 的响应式断点遵循移动优先原则：`sm:640px` `md:768px` `lg:1024px` `xl:1280px` `2xl:1536px`。\n" +
        '```html\n<div class="w-full md:w-1/2 lg:w-1/3">响应式卡片</div>\n```\n\n' +
        "## 常用组件组合\n\n" +
        "### 卡片\n" +
        '```html\n<div class="rounded-2xl shadow-lg bg-white overflow-hidden hover:shadow-xl transition-shadow">\n' +
        '  <img class="w-full h-48 object-cover" src="cover.jpg" alt="" />\n' +
        '  <div class="p-6">\n' +
        '    <span class="text-sm text-indigo-600 font-medium">技术</span>\n' +
        '    <h3 class="mt-2 text-xl font-bold text-gray-900">文章标题</h3>\n' +
        '    <p class="mt-2 text-gray-600 line-clamp-3">文章摘要内容...</p>\n' +
        "  </div>\n</div>\n```\n\n" +
        "### 按钮\n" +
        '```html\n<button class="px-4 py-2 rounded-xl font-medium transition-all duration-200\n' +
        '               bg-indigo-600 text-white hover:bg-indigo-700\n' +
        '               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2\n' +
        '               active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">\n  提交\n</button>\n```\n\n' +
        "## 自定义主题\n\n" +
        "```js\n// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: { brand: { 50: '#eef2ff', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' } },\n" +
        "      fontFamily: { sans: ['Inter', 'Noto Sans SC', 'sans-serif'] },\n" +
        "    }\n  },\n  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]\n}\n```\n\n" +
        "## 实用技巧\n\n" +
        "### 1. group 和 group-hover\n" +
        '父元素加 `group`，子元素用 `group-hover:text-indigo-600` 实现悬停联动。\n\n' +
        "### 2. 暗色模式\n" +
        '`<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">` 自动适配系统主题。\n\n' +
        "### 3. 任意值语法\n" +
        '`<div class="w-[327px] h-[200px] bg-[#f5f5f5]">` 精确尺寸和颜色。\n\n' +
        "## 总结\n\n" +
        "Tailwind 的学习曲线是先陡后平——刚开始会觉得\"这 HTML 也太长了吧\"，但用熟了之后，你会发现自己写 CSS 的速度提升了好几倍。配合组件封装（React/Vue），长类名的问题自然解决。建议打开官方文档，边做边查，一周就能上手。",
      summary: "掌握 Tailwind 的响应式设计、自定义主题和实用插件，高效构建 UI。",
      category_id: frontend.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "Vue 3 Composition API 入门",
      content:
        "## 从 Options API 到 Composition API\n\n" +
        "Vue 2 时代，我们用 Options API 组织代码：`data()`、`computed`、`methods`、`mounted()`。这种方式在小项目中很清晰，但随着组件变复杂，同一个功能的代码被分散在不同选项中，维护起来需要在文件里上下跳转。Composition API 解决了这个问题——**按功能组织代码，而不是按选项类型**。\n\n" +
        "## setup 语法糖\n\n" +
        "```vue\n<script setup>\nimport { ref, computed, onMounted } from 'vue'\n\nconst count = ref(0)\nconst double = computed(() => count.value * 2)\n\nfunction increment() { count.value++ }\n\nonMounted(() => { console.log('组件已挂载') })\n</script>\n\n<template>\n  <button @click=\"increment\">\n    {{ count }} × 2 = {{ double }}\n  </button>\n</template>\n```\n\n" +
        "与 Options API 相比，少了 `this`、少了嵌套、少了样板代码。所有相关的逻辑可以自然地放在一起。\n\n" +
        "## ref vs reactive\n\n" +
        "这是新手最容易困惑的地方：`ref` 包装基本类型，访问需要 `.value`；`reactive` 包装对象，直接访问属性。实际项目中，很多人统一用 `ref`，保持一致性。\n\n" +
        "## computed 计算属性\n\n" +
        "```vue\n<script setup>\nconst items = ref([\n  { name: '苹果', price: 10, quantity: 2 },\n  { name: '香蕉', price: 5, quantity: 5 },\n])\nconst total = computed(() =>\n  items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)\n)\n</script>\n```\n\n" +
        "computed 会自动追踪依赖，只有依赖变化时才会重新计算。不要在里面做异步操作——那个应该用 `watch`。\n\n" +
        "## watch 和 watchEffect\n\n" +
        "`watch(source, callback)` 需要明确指定监听源，默认懒执行；`watchEffect(callback)` 自动追踪回调中的响应式依赖，立即执行。\n\n" +
        "## 组合函数（Composables）\n\n" +
        "Composition API 最大的好处是可以轻松抽取可复用逻辑：\n\n" +
        "```js\n// composables/useFetch.js\nimport { ref, watchEffect } from 'vue'\n\nexport function useFetch(url) {\n  const data = ref(null)\n  const loading = ref(false)\n  const error = ref(null)\n\n  async function fetchData() {\n    loading.value = true\n    try {\n      const res = await fetch(typeof url === 'function' ? url() : url)\n      data.value = await res.json()\n    } catch (e) {\n      error.value = e.message\n    } finally {\n      loading.value = false\n    }\n  }\n\n  fetchData()\n  return { data, loading, error, refetch: fetchData }\n}\n\n// 使用\nconst { data: posts, loading, error } = useFetch('/api/posts')\n```\n\n" +
        "## 总结\n\n" +
        "Composition API 不是要替代 Options API——两者可以共存。但如果你开始新项目，强烈建议直接用 Composition API + `<script setup>`。它更灵活、更利于逻辑复用、TypeScript 支持也更好。从一个小功能开始，逐步感受它的魅力吧。",
      summary: "学会 setup 语法糖、ref/reactive、watch/computed，快速上手 Vue 3。",
      category_id: frontend.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "CSS Grid 布局完全指南",
      content:
        "## Grid vs Flexbox\n\n" +
        "很多开发者熟悉 Flexbox，但面对复杂布局时总觉得\"差一点\"。Flexbox 是一维布局系统（要么行，要么列），而 Grid 是真正的二维布局系统（行和列同时控制）。简单判断：只需要一排或一列的对齐 → Flexbox；需要同时控制行和列 → Grid；整体页面布局 → Grid；组件内部的小布局 → Flexbox。两者不是对立的，实际项目中经常混用。\n\n" +
        "## 基础概念\n\n" +
        "Grid 容器（`display: grid`）+ Grid 项目（直接子元素）。`fr`（fraction）是 Grid 最强大的单位，表示\"剩余空间的一份\"。`1fr 2fr 1fr` 意味着中间列是两侧的两倍宽。\n\n" +
        "## 容器属性\n\n" +
        "```css\n.container {\n  display: grid;\n  /* 3 列：各占 1 份 */\n  grid-template-columns: repeat(3, 1fr);\n  /* 列间距 24px，行间距 16px */\n  gap: 16px 24px;\n  /* 超过定义行数的行，自动使用此高度 */\n  grid-auto-rows: minmax(100px, auto);\n}\n```\n\n" +
        "自适应列：`grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));` 每列最小 250px，最大 1fr，自动换行。`auto-fill` 保留空列，`auto-fit` 拉伸已有项目填满空间。\n\n" +
        "## 项目属性\n\n" +
        "```css\n.item {\n  grid-column: 1 / 3;       /* 占 2 列 */\n  grid-column: span 2;      /* 等价写法 */\n  grid-row: 2 / 4;          /* 占 2 行 */\n  grid-area: 2 / 1 / 4 / 3; /* row-start / col-start / row-end / col-end */\n}\n```\n\n" +
        "## 经典布局实战\n\n" +
        "### 圣杯布局\n" +
        "```css\nbody {\n  display: grid;\n  grid-template-columns: 250px 1fr 250px;\n  grid-template-rows: 60px 1fr 50px;\n  grid-template-areas:\n    \"header  header  header\"\n    \"sidebar main    aside\"\n    \"footer  footer  footer\";\n  min-height: 100vh;\n}\n.header  { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main    { grid-area: main; }\n.aside   { grid-area: aside; }\n.footer  { grid-area: footer; }\n```\n\n" +
        "### 居中一个元素\n" +
        "```css\n.parent {\n  display: grid;\n  place-items: center;  /* 比 Flexbox 更简短 */\n}\n```\n\n" +
        "## 总结\n\n" +
        "Grid 是现代 CSS 布局的基石。掌握 `grid-template-columns`、`fr` 单位、`minmax()` 和 `grid-area`，你就有了构建任何布局的能力。建议把常用的布局（圣杯、卡片网格、居中）写几遍，形成肌肉记忆。Chrome DevTools 的 Grid 可视化工具也非常好用，可以帮助你直观理解网格线。",
      summary: "图解 Grid 容器属性与项目属性，轻松实现复杂二维布局。",
      category_id: frontend.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "TypeScript 泛型高级用法",
      content:
        "## 为什么需要泛型？\n\n" +
        "在 JavaScript 中，我们经常写 `function getFirst(arr: any[]): any { return arr[0]; }`，但返回类型是 `any`，没有类型提示也不安全。用了泛型之后：`function getFirst<T>(arr: T[]): T { return arr[0]; }`，类型自动推断。泛型让你在定义时**不预先指定具体类型**，而是使用时再确定——就像\"类型的函数参数\"。\n\n" +
        "## 基础泛型\n\n" +
        "```typescript\n// 泛型接口\ninterface ApiResponse<T> {\n  code: number;\n  data: T;\n  message: string;\n}\ntype PostResponse = ApiResponse<Post>;     // data 是 Post\ntype PostsResponse = ApiResponse<Post[]>;  // data 是 Post[]\n\n// 泛型类\nclass Stack<T> {\n  private items: T[] = [];\n  push(item: T): void { this.items.push(item); }\n  pop(): T | undefined { return this.items.pop(); }\n}\n```\n\n" +
        "## 泛型约束（extends）\n\n" +
        "```typescript\ninterface HasLength { length: number; }\n\nfunction logLength<T extends HasLength>(arg: T): T {\n  console.log(arg.length);\n  return arg;\n}\n\nlogLength(\"hello\");     // ✅\nlogLength([1, 2, 3]);   // ✅\n// logLength(123);       // ❌ number 没有 length\n```\n\n" +
        "### keyof 约束\n\n" +
        "```typescript\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\nconst post = { title: \"Hello\", id: 1 };\ngetProperty(post, \"title\");  // ✅ 返回 string\n// getProperty(post, \"author\"); // ❌ 编译错误！\n```\n\n" +
        "## 条件类型\n\n" +
        "条件类型是 TypeScript 类型系统的\"if 语句\"：\n\n" +
        "```typescript\ntype IsString<T> = T extends string ? \"yes\" : \"no\";\ntype A = IsString<string>;   // \"yes\"\ntype B = IsString<number>;   // \"no\"\n\n// 常用内置条件类型\ntype T0 = Exclude<\"a\" | \"b\" | \"c\", \"a\">;           // \"b\" | \"c\"\ntype T1 = Extract<\"a\" | \"b\" | \"c\", \"a\" | \"b\">;     // \"a\" | \"b\"\ntype T2 = NonNullable<string | null | undefined>;   // string\ntype T3 = ReturnType<() => string>;                  // string\ntype T4 = Awaited<Promise<Promise<string>>>;          // string\n```\n\n" +
        "### infer 关键字\n\n" +
        "```typescript\ntype Unwrap<T> = T extends Promise<infer U> ? U : T;\ntype T1 = Unwrap<Promise<string>>;   // string\n\ntype ArrayElement<T> = T extends (infer U)[] ? U : T;\ntype T2 = ArrayElement<string[]>;    // string\n```\n\n" +
        "## 映射类型\n\n" +
        "基于已有类型创建新类型：\n\n" +
        "```typescript\ninterface User { name: string; age: number; email: string; }\n\ntype PartialUser = Partial<User>;      // 所有属性变为可选\ntype ReadonlyUser = Readonly<User>;    // 所有属性变为只读\ntype UserPick = Pick<User, 'name' | 'email'>;  // 选取部分属性\ntype UserOmit = Omit<User, 'email'>;   // 排除部分属性\n```\n\n" +
        "## 总结\n\n" +
        "泛型是 TypeScript 的灵魂。学习路径建议：先在函数中尝试用 `<T>` 替代 `any`，用 `extends` 给泛型加约束，熟悉内置工具类型（Partial、Pick、Omit），再挑战条件类型和 infer。不要试图一次性掌握所有——在写代码的过程中遇到 `any` 时，想想能不能用泛型替代，日积月累就熟练了。",
      summary: "深入理解泛型约束、条件类型、映射类型，写出类型安全的代码。",
      category_id: frontend.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "Next.js 服务端渲染原理",
      content:
        "## 什么是服务端渲染？\n\n" +
        "传统的 React 应用是 CSR（Client-Side Rendering）：浏览器收到一个几乎空的 HTML，然后 JavaScript 在客户端渲染整个页面。这导致两个问题：首屏白屏时间长（用户需要等 JS 下载、解析、执行完）、SEO 不友好（搜索引擎爬虫可能看不到 JS 渲染后的内容）。SSR（Server-Side Rendering）在服务端就把 HTML 渲染好，浏览器收到的是完整的页面。\n\n" +
        "## Next.js 的三种渲染模式\n\n" +
        "### SSR（Server-Side Rendering）\n\n" +
        "每次请求都在服务端渲染页面，适合个性化内容。在 App Router 中，默认就是服务端组件，可以直接访问数据库。\n\n" +
        "### SSG（Static Site Generation）\n\n" +
        "构建时（`next build`）生成静态 HTML，访问速度最快。使用 `generateStaticParams` 在构建时生成所有文章页面。适合博客文章、文档页面、营销页面——内容不经常变化的页面。\n\n" +
        "### ISR（Incremental Static Regeneration）\n\n" +
        "结合 SSG 和 SSR 的优点：构建时生成静态页面，按需在后台重新生成。使用 `export const revalidate = 3600;` 设置重新验证间隔。适合大多数内容页面——兼顾性能和内容新鲜度。\n\n" +
        "## 三种模式对比\n\n" +
        "| 特性 | SSR | SSG | ISR |\n|------|-----|-----|-----|\n| 生成时机 | 每次请求 | 构建时 | 构建时 + 按需 |\n| 内容新鲜度 | 实时 | 需要重新构建 | 按 revalidate 间隔 |\n| 首屏速度 | 中等 | 最快 | 最快 |\n| 服务器压力 | 较高 | 几乎为零 | 极低 |\n| SEO | 好 | 最好 | 最好 |\n\n" +
        "## React Server Components（RSC）\n\n" +
        "在 App Router 中，组件默认就是服务端组件，可以直接访问数据库，不需要 API！客户端组件需要加 `'use client'` 指令。服务端组件负责数据获取，客户端组件负责交互，各司其职。\n\n" +
        "## 选择策略\n\n" +
        "- 博客文章 → ISR（revalidate: 86400）\n" +
        "- 首页文章列表 → ISR（revalidate: 60）\n" +
        "- 用户个人中心 → SSR\n" +
        "- 关于页面 → SSG\n" +
        "- 后台管理 → CSR（不需要 SEO）\n\n" +
        "## 总结\n\n" +
        "Next.js 给你一套完整的渲染策略工具箱。没有一种策略适合所有场景，好架构是各种策略的合理组合。关键是理解每种模式的 trade-off，然后为每个页面选择最合适的方案。",
      summary: "了解 SSR、SSG、ISR 的区别，选择最适合的渲染策略。",
      category_id: frontend.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "Webpack 到 Vite：构建工具演进",
      content:
        "## 前端构建工具的演进\n\n" +
        "回顾前端构建工具的演进历程：Grunt/Gulp 时代（2013）任务运行器 → Webpack 时代（2014）一切皆模块 → Rollup 时代（2016）专注 ES Module 打包 → Vite 时代（2021）基于 ESM 的开发服务器，秒级冷启动。\n\n" +
        "## Webpack 的核心思想\n\n" +
        "Webpack 的核心是一切皆模块：JS、CSS、图片、字体统统是模块，通过 loader 转换，plugin 扩展。但痛点也很明显：**冷启动慢**（项目大了之后首次构建 30-60 秒）、**HMR 慢**（改了代码要等 1-5 秒）、**配置复杂**（webpack.config.js 轻松几百行）。根本原因：Webpack 在开发时也要先打包全部模块，然后才启动 dev server。就像每次改一个字就要重新印整本书。\n\n" +
        "## Vite 的革新\n\n" +
        "Vite 利用浏览器原生支持 ES Module（`<script type=\"module\">`）这一特性，实现**按需编译**。当你访问 `http://localhost:3000` 时：Vite 返回 HTML → 浏览器请求 `/src/main.jsx` → Vite 用 esbuild 即时编译这个文件并返回 → 浏览器解析 import，继续请求依赖 → Vite 逐个编译并返回。结果是：**冷启动不到 1 秒**，无论项目多大。\n\n" +
        "## 速度对比\n\n" +
        "| 指标 | Webpack 5 | Vite 5 |\n|------|-----------|--------|\n| 冷启动 | 30-60 秒 | <1 秒 |\n| 热更新（HMR） | 1-5 秒 | <50 毫秒 |\n| 首次构建 | 30-120 秒 | 15-45 秒 |\n| 配置复杂度 | 较高 | 极低 |\n\n" +
        "开发时 Vite 用 esbuild 做预构建（依赖打包），生产时用 Rollup 输出优化产物。\n\n" +
        "## 从 Webpack 迁移到 Vite\n\n" +
        "1. 安装 `vite` 和 `@vitejs/plugin-react`\n" +
        "2. 创建 `vite.config.js`：`export default defineConfig({ plugins: [react()], server: { port: 3000 } })`\n" +
        '3. 把 `index.html` 移到根目录，添加 `<script type="module" src="/src/main.jsx"></script>`\n' +
        '4. 更新 package.json scripts：`"dev": "vite"`, `"build": "vite build"`, `"preview": "vite preview"`\n\n' +
        "## 总结\n\n" +
        "Vite 不是要革 Webpack 的命——在生产构建上，Rollup 和 Webpack 各有千秋。但在开发体验上，Vite 的按需编译 + ESM 原生支持是降维打击。如果你正在启动一个新项目，没有历史包袱，Vite 是最佳选择。",
      summary: "对比 Webpack 和 Vite 的开发体验，了解 ESM 原生支持的威力。",
      category_id: frontend.id, created_at: now(), updated_at: now(),
    },
    // ── 生活 (5篇) ──
    {
      id: nextPostId++, title: "如何打造高效的工作环境",
      content:
        "## 为什么工作环境重要？\n\n" +
        "\"你的环境决定了你的行为\"。对于每天坐在电脑前 8 小时以上的程序员来说，工作环境直接影响效率和健康。我在过去两年里不断调整优化自己的桌面环境，从硬件到软件，从椅子到灯光。这篇文章分享我的经验和心得。\n\n" +
        "## 桌面布置\n\n" +
        "### 显示器\n\n" +
        "双屏是程序员的基本配置：主显示器 27 寸 4K 正对视线（写代码看文档），副显示器 24 寸竖放（旋转 90°）看代码超爽——一个屏幕能看到 150+ 行代码。笔记本放在支架上，合盖外接屏幕。\n\n" +
        "### 键盘\n\n" +
        "机械键盘是程序员的生产力工具：红轴线性手感（适合长时间编码，不吵到同事），青轴段落感强（适合在家用），茶轴中庸之选。推荐 75% 或 80% 配列——保留功能键和方向键，比 60% 实用。\n\n" +
        "### 座椅\n\n" +
        "人体工学椅可能是你最有价值的投资。每天坐 8 小时，一张好椅子比一台好显示器更重要。重点看：腰部支撑、头枕、坐垫透气性。预算有限的话，至少加一个腰靠。\n\n" +
        "### 桌面收纳\n\n" +
        "显示器支架（抬高屏幕，保护颈椎）、理线器（桌面干净，心情也好）、屏幕挂灯（不占桌面，照亮键盘区域）。\n\n" +
        "## 软件工具\n\n" +
        "### 编辑器：VS Code\n\n" +
        "推荐必装插件：GitHub Copilot（AI 辅助编码）、Prettier（代码格式化）、ESLint（代码质量检查）、GitLens（Git 历史可视化）、Error Lens（行内显示报错信息）。字体推荐 JetBrains Mono（有连字符 ligature，`=>` 会变成箭头 ⟹）。\n\n" +
        "### 终端美化\n\n" +
        "Windows 用户推荐 Windows Terminal + Oh My Posh。主题推荐 jandedobbeleer、atomic、night-owl。\n\n" +
        "### 笔记：Notion\n\n" +
        "用 Notion 管理一切：技术 Wiki、Bug 记录、读书清单、个人目标。数据库功能特别强大。\n\n" +
        "### 其他推荐\n\n" +
        "- Everything（Windows）：秒搜文件，比系统搜索快 100 倍\n" +
        "- Snipaste：截图 + 贴图，可以把截图钉在屏幕上\n" +
        "- Ditto：剪贴板管理\n" +
        "- f.lux：根据时间自动调节屏幕色温，保护眼睛\n\n" +
        "## 时间管理\n\n" +
        "番茄工作法：25 分钟专注 + 5 分钟休息，4 个番茄后休息 15-30 分钟。推荐工具 Forest（种树 App）和 Pomotroid（桌面番茄钟）。每天早上第一件事：写下今天要完成的 3 件最重要的事。上午 9-12 点设置为\"勿扰模式\"做深度工作，下午集中处理消息和会议。\n\n" +
        "## 声音环境\n\n" +
        "推荐 coding 时听 Lo-Fi 音乐、古典音乐或白噪音。推荐 Noisli、Brain.fm、Lofi Girl（YouTube）。降噪耳机推荐 Sony WH-1000XM 系列或 AirPods Pro，隔出一个安静世界。\n\n" +
        "## 总结\n\n" +
        "打造高效工作环境是一个持续优化的过程，不需要一步到位。可以从一个显示器支架、一把好椅子、一个好用的笔记工具开始，逐步升级。记住：**最好的工具是让你忘记工具本身存在的工具**——它自然到你不觉得在\"使用\"它，只是专心做手头的事。",
      summary: "从桌面布置到工具选择，打造一个让你专注工作的环境。",
      category_id: life.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "我的 2024 书单推荐",
      content:
        "## 前言\n\n" +
        "2024 年读了一些书，有好有坏。从中挑出 10 本真心推荐的好书，涵盖技术、文学和思维三个方向。阅读不应该是任务，不需要追求数量。一本好书，慢慢读、反复读，比囫囵吞枣十本更有价值。\n\n" +
        "## 技术类\n\n" +
        "### 1. 《代码整洁之道》— Robert C. Martin\n\n" +
        "读这本书之前，我以为写代码就是\"能跑就行\"。读完才明白：代码是写给人看的，顺便给机器执行。几点印象深刻的教训：函数应该短小（20 行以内最好）、有意义的命名比注释更重要、注释是失败的表达、DRY（Don't Repeat Yourself）原则。适合有一年开发经验的程序员阅读。\n\n" +
        "### 2. 《深入理解计算机系统》（CS:APP）— Bryant & O'Hallaron\n\n" +
        "计算机领域的\"圣经\"之一。从二进制到虚拟内存，从 CPU 流水线到网络编程，把计算机\"抽象层\"一层层剥开给你看。建议挑重点章节精读：第 3 章程序的机器级表示、第 6 章存储器层次结构、第 9 章虚拟内存、第 11 章网络编程。\n\n" +
        "### 3. 《设计数据密集型应用》（DDIA）— Martin Kleppmann\n\n" +
        "分布式系统领域的必读书。如果你想从\"会用 MySQL/Redis/Kafka\"进阶到\"理解它们的设计原理\"，这本书是钥匙。每一章都是独立的宝藏：复制、分区、事务、分布式系统的麻烦、一致性与共识。\n\n" +
        "## 文学类\n\n" +
        "### 4. 《百年孤独》— 加西亚·马尔克斯\n\n" +
        "重读这本书，与第一次的感觉完全不同。十年前读是\"故事好神奇\"，现在读是\"人生好孤独\"。\"生命中曾经有过的所有灿烂，终究都需要用寂寞来偿还。\"布恩迪亚家族七代人的故事，每个人都在用自己的方式对抗孤独。\n\n" +
        "### 5. 《活着》— 余华\n\n" +
        "一本让你又哭又笑的书。福贵的一生跌宕起伏，经历了太多失去，但他依然\"活着\"。\"人是为了活着本身而活着，而不是为了活着之外的任何事物而活着。\"这本书会让你重新审视自己的人生。\n\n" +
        "### 6. 《小王子》— 圣埃克苏佩里\n\n" +
        "\"只有用心才能看清，本质的东西用眼睛是看不见的。\"\"正是你为玫瑰花费的时间，才使你的玫瑰如此重要。\"每个年龄段读《小王子》，都能读出不同的感悟。\n\n" +
        "## 思维与自我提升\n\n" +
        "### 7. 《思考，快与慢》— 丹尼尔·卡尼曼\n\n" +
        "诺贝尔经济学奖得主的杰作。大脑有两套思考系统：系统 1 快速、直觉、自动（容易出错），系统 2 缓慢、理性、费力（比较准确）。了解这两套系统的运作机制，能帮你识别认知偏差、做出更好的决策。\n\n" +
        "### 8. 《原子习惯》— James Clear\n\n" +
        "小习惯带来大改变。核心理念：不要关注目标，关注系统。如果你每天进步 1%，一年后你会进步 37 倍。习惯的四大法则：让它显而易见、有吸引力、简单易行、令人满足。我把这个方法用在了健身和学习上，效果显著。\n\n" +
        "## 总结\n\n" +
        "\"读书不是为了记住，而是为了在某个需要的时刻，那本书会在你脑海中浮现。\"如果只推荐一本，技术人读《设计数据密集型应用》，文学爱好者读《百年孤独》，想提升自己的读《原子习惯》。慢慢读，细细品。",
      summary: "分享今年读过的好书，涵盖技术、文学、哲学多个领域。",
      category_id: life.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "健身半年的变化与心得",
      content:
        "## 为什么开始健身？\n\n" +
        "去年年底体检，报告上多了几行红字：轻度脂肪肝、体重超标、颈椎曲度变直。医生说：\"小伙子，该动一动了。\"那一刻我意识到，写代码写得再好，也换不来一个好身体。于是决心开始健身。\n\n" +
        "## 初始状态\n\n" +
        "身高 175cm，体重 78kg，体脂率约 25%。体态问题：圆肩、头前倾（典型的\"程序员体态\"）。体能：爬 5 层楼喘得不行。\n\n" +
        "## 训练计划\n\n" +
        "**七分吃，三分练**——这句话是真理。我选择力量训练 + 有氧结合，每周 4 练：\n\n" +
        "- **周一 胸+三头**：杠铃平板卧推 4×8-10、哑铃上斜卧推 3×10-12、龙门架夹胸 3×12-15、绳索臂屈伸 3×12-15\n" +
        "- **周二 背+二头**：引体向上 4×力竭（先做最难的！）、杠铃划船 4×8-10、高位下拉 3×10-12、哑铃弯举 3×12-15\n" +
        "- **周四 腿+肩**：杠铃深蹲 4×8-10、哑铃推举 4×8-10、侧平举 4×15-20（轻重量高次数）、腿弯举 3×12-15\n" +
        "- **周五 全身+核心**：硬拉 3×8（王牌动作）、平板支撑 3×力竭、悬垂举腿 3×15、30 分钟有氧\n\n" +
        "每次训练前热身 10 分钟，练后拉伸 15 分钟。\n\n" +
        "## 饮食调整\n\n" +
        "- 早餐（7:30）：燕麦 50g + 牛奶 200ml + 水煮蛋 2 个 + 一个香蕉\n" +
        "- 午餐（12:00）：正常吃，但少油少碳水多蛋白，米饭量减半换成粗粮更好，多夹蔬菜先吃菜再吃饭\n" +
        "- 加餐（16:00）：蛋白粉一勺（训练日）或一小把坚果 + 一个苹果\n" +
        "- 晚餐（19:00）：鸡胸肉 150g + 西兰花/菠菜等绿色蔬菜 + 红薯或玉米半根\n" +
        "- 戒掉：奶茶/可乐（用无糖茶和白水替代）、薯片/辣条等零食、夜宵、外卖\n" +
        "- Cheat Meal：每周六晚上吃一次想吃的（火锅/炸鸡/蛋糕），这是长期坚持的关键\n\n" +
        "## 六个月的变化\n\n" +
        "| 指标 | 初始 | 现在 | 变化 |\n|------|------|------|------|\n| 体重 | 78kg | 70kg | -8kg |\n| 体脂率 | ~25% | ~18% | -7% |\n| 卧推 | 空杠 | 60kg | — |\n| 深蹲 | 空杠 | 80kg | — |\n| 引体向上 | 0 个 | 6 个 | — |\n\n" +
        "最重要的变化不是数字：肩颈不再酸痛，体态明显改善；精力充沛，下午不再犯困；睡眠质量提升（沾枕头就睡）；对身体的感知能力变强；自信心提升——不只是外貌，更是\"我能掌控自己\"的掌控感。\n\n" +
        "## 给初学者的建议\n\n" +
        "1. **开始比完美重要**：不要等\"准备好了\"才开始，今天就动起来\n" +
        "2. **动作质量 > 重量**：小重量标准动作 > 大重量错误动作\n" +
        "3. **找个搭子**：互相监督，比一个人容易坚持十倍\n" +
        "4. **记录数据**：每周拍照、记录体重和围度，看到变化是最大的动力\n" +
        "5. **睡眠和饮食是训练的一部分**：不睡好练不好\n\n" +
        "## 总结\n\n" +
        "健身不是冲刺，是马拉松。六个月只是一个开始，但已经让我看到了完全不同的自己。如果你也在犹豫要不要开始——**去练就完了，未来的你会感谢现在的自己。**",
      summary: "坚持健身 6 个月，体重降了 8kg，分享训练计划和饮食方案。",
      category_id: life.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "一个人的旅行：成都到拉萨",
      content:
        "## 为什么出发？\n\n" +
        "\"想去西藏\"这个念头在心里放了三年。每次看到别人发的 318 国道骑行照片，心里就痒痒的。去年终于下定决心，背上包，跨上车，出发了。很多人问我：\"一个人不害怕吗？\"怕，但更怕的是十年后后悔自己为什么没有去。\n\n" +
        "## 准备工作\n\n" +
        "提前三个月开始准备。体能训练：每天通勤骑行 15km → 周末 50km → 每月一次 100km+ 拉练；爬楼训练（20 层 × 5 趟，模拟爬山）；核心力量训练（长时间骑车腰背压力大）。\n\n" +
        "装备清单：捷安特 ATX 860 山地车（加装后货架和驮包架）、冲锋衣 1 套、速干衣 3 件、骑行裤 2 条（海绵垫是救命的东西）、内胎 3 条 + 补胎工具 + 打气筒、红景天（提前一周开始吃）、防晒霜 SPF50+（高原紫外线不是闹着玩的）、骑行手套全指和半指各一副。\n\n" +
        "路线规划：川藏南线（G318）成都 → 雅安 → 泸定 → 康定 → 新都桥 → 理塘 → 巴塘 → 芒康 → 左贡 → 八宿 → 波密 → 林芝 → 拉萨，全程约 2200 公里，计划 22-25 天完成。\n\n" +
        "## 最难忘的路段\n\n" +
        "### Day 3-4：折多山（海拔 4298m）\n\n" +
        "川藏线上第一座 4000 米以上的高山，也是我第一次体会到什么叫\"高反\"。骑到一半开始头痛、喘不上气，推着车走了好几公里。到达垭口那一刻，看到经幡在风中飘扬，眼泪差点掉下来——不是因为高反，是觉得自己真的能做到。\n\n" +
        "### Day 7：怒江 72 拐\n\n" +
        "从海拔 4658 米的业拉山口下 40 公里连续下坡。下坡超爽，但刹车片差点磨光，手捏刹车捏到抽筋。路上遇到一位 65 岁的大爷，他说这是他第五次骑川藏线了。五！次！\n\n" +
        "### Day 12：然乌湖\n\n" +
        "湖水蓝得不像是真的。在湖边坐了整整一个小时，什么也不想，就看着湖面和雪山。那一刻觉得——路上的所有辛苦都是值得的。\n\n" +
        "### Day 19：色季拉山遇见南迦巴瓦\n\n" +
        "南迦巴瓦峰终年被云雾笼罩，十人九不遇。我运气好，在垭口等了半小时后，云散开了，主峰露出来。夕阳打在雪山上，金光灿烂。旁边的藏族大叔说，能看见南迦巴瓦的人是有福气的。\n\n" +
        "## 路上的那些人\n\n" +
        "一个人的旅行，但并不孤独。路上遇到了：小杨（大学刚毕业，gap year 骑行川藏）、老赵（65 岁退休教师，第五次骑 318，身体比很多年轻人还好）、阿卓（藏族小伙，一路上给我讲了很多藏族文化）。最感动的瞬间：某天在路边修车，一个路过的牧民停下来，虽然语言不通，但他用肢体语言告诉我附近哪里有修车的地方。\n\n" +
        "## 到达拉萨\n\n" +
        "第 22 天，终于看到了布达拉宫。在布达拉宫前的广场上坐了很久。这三周的旅程像放电影一样在脑海中闪过：爬过的山、路过的湖、遇见的人、流过的汗、喝过的酥油茶……很多事情，我们不是做不到，只是不敢开始。一旦开始，路就在脚下。\n\n" +
        "## 实用建议\n\n" +
        "1. 最佳时间：5 月-6 月（避开雨季）或 9 月-10 月（秋色最美）\n" +
        "2. 不要逞强：累了就休息，高原骑行不是比赛\n" +
        "3. 防晒！防晒！防晒！高原紫外线不是闹着玩的\n" +
        "4. 学会修车：至少会补胎、调刹车、修链条\n" +
        "5. 带现金：很多地方只收现金\n" +
        "6. 买保险：高原旅行意外险，为自己和家人负责\n\n" +
        "## 总结\n\n" +
        "有人说 318 国道是一条\"身体下地狱，眼睛上天堂，灵魂回故乡\"的路。经历过才知道，这句话一点不夸张。这趟旅行改变了我很多：不再那么害怕未知，不再轻易说\"我不行\"，学会了和自己独处。或许每个人的生命中都需要一次这样的旅行——独自上路，看陌生的风景，重新认识自己。",
      summary: "骑行 318 国道，22 天，2200 公里，一路风景一路歌。",
      category_id: life.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "学会做 10 道家常菜",
      content:
        "## 从零开始的厨房之旅\n\n" +
        "作为一个以前只会泡面和煮速冻水饺的程序员，学会做饭是我今年最大的\"非技术\"成就。起因很现实：外卖吃腻了（而且贵），体检结果不太理想（外卖油盐太重）。半年时间，从炒鸡蛋都会糊，到能独立做一桌菜招待朋友。\n\n" +
        "## 入门三道菜（零失败率）\n\n" +
        "### 1. 西红柿炒鸡蛋\n\n" +
        "国民第一菜，但做好不容易。关键技巧：鸡蛋加几滴水搅匀炒出来更嫩；先炒鸡蛋八分熟盛出；西红柿切小块中火炒出汁；最后鸡蛋倒回锅中 30 秒拌匀就出锅。\n\n" +
        "### 2. 酸辣土豆丝\n\n" +
        "考验刀功的第一课。土豆切丝后泡水（去淀粉，炒出来才脆）；大火快炒从下锅到出锅不超过 2 分钟；醋分两次放：锅边淋醋增香，出锅前再加一点提酸；干辣椒和花椒先爆锅，香味翻倍。\n\n" +
        "### 3. 可乐鸡翅\n\n" +
        "零失败的新手福音。鸡翅提前用料酒、姜片、生抽腌制 20 分钟；先煎至两面金黄锁住肉汁；可乐没过鸡翅即可；中火焖 15 分钟大火收汁；出锅前撒白芝麻。\n\n" +
        "## 进阶三道菜（有挑战但值得）\n\n" +
        "### 4. 红烧排骨\n\n" +
        "炒糖色是关键。排骨冷水下锅焯水加料酒姜片去腥；锅里放油 + 冰糖小火慢炒到枣红色冒泡；立刻倒入排骨翻炒上色（手速要快，糖色过了会发苦）；加生抽老抽料酒八角桂皮香叶；加水没过排骨大火烧开转小火焖 40 分钟；大火收汁至浓稠。\n\n" +
        "### 5. 清蒸鲈鱼\n\n" +
        "大道至简，食材新鲜最重要。鲈鱼洗净两面划几刀塞入姜片；水开后上锅大火蒸 8 分钟（时间精确！久了肉老）；倒掉盘中蒸出的腥水；铺上葱丝姜丝红椒丝淋蒸鱼豉油；烧一勺热油浇在葱丝上——\"滋啦\"一声香味炸开。\n\n" +
        "### 6. 麻婆豆腐\n\n" +
        "灵魂是豆瓣酱和花椒粉。嫩豆腐切小块焯水（水里加盐豆腐不容易碎）；锅中油热下肉末炒至酥香；加豆瓣酱炒出红油（一定要炒够时间）；加姜蒜末爆香；加适量水放入豆腐轻轻推匀（不要翻！豆腐会碎）；小火煮 3-5 分钟入味；水淀粉勾芡；出锅前撒花椒粉和葱花。正宗麻婆豆腐要\"麻辣烫香酥嫩鲜\"七味俱全。\n\n" +
        "## 快手三道菜（工作日 30 分钟搞定）\n\n" +
        "7. **蒜蓉西兰花**：焯水 1 分钟，蒜末爆香翻炒 2 分钟加盐出锅。8. **青椒肉丝**：猪肉切丝加淀粉料酒腌制，先滑肉丝盛出再炒青椒，全程 15 分钟。9. **紫菜蛋花汤**：水烧开放紫菜，鸡蛋打散转圈淋入沸水中，加盐香油葱花，3 分钟搞定。\n\n" +
        "## 一道硬菜：大盘鸡\n\n" +
        "鸡腿剁块焯水备用土豆切滚刀块；热油炒糖色下鸡块翻炒上色；加豆瓣酱干辣椒花椒八角桂皮爆香；加啤酒（不是水！）没过鸡肉大火烧开；加土豆块转中火焖 20 分钟；加青红椒块再焖 5 分钟；出锅前加蒜末和香菜。搭配宽面或馕，汤汁拌饭也是一绝。\n\n" +
        "## 学习心得\n\n" +
        "1. **看视频比看菜谱管用**：B 站美食区是最好的老师（王刚、日食记）\n" +
        "2. **先模仿再创新**：把经典做法做熟了再自由发挥\n" +
        "3. **装备不用多**：一口好用的炒锅 + 一把趁手的菜刀足以应对 80% 的菜\n" +
        "4. **火候 > 调料**：学会判断火候是进阶的关键\n" +
        "5. **买菜选时令**：食材好，菜就好吃了一半\n" +
        "6. **做饭是很好的减压方式**：写了一天代码，切菜、炒菜、装盘，是很好的\"数字排毒\"\n\n" +
        "## 总结\n\n" +
        "从前觉得做饭是浪费时间，现在发现做饭是最好的放松。当葱姜蒜在热油中爆出香味，当朋友吃着我做的菜竖起大拇指，那种成就感不亚于代码完美跑通。如果你也一直是\"外卖党\"，建议从一道最简单的菜开始——比如西红柿炒鸡蛋。做好一道菜，你就会想做第二道、第三道。不知不觉，厨房就成了家里最温暖的地方。",
      summary: "从厨房小白到能做一桌菜，记录我的烹饪学习之路。",
      category_id: life.id, created_at: now(), updated_at: now(),
    },
    // ── 随笔 (5篇) ──
    {
      id: nextPostId++, title: "程序员的 35 岁危机真的存在吗",
      content:
        "## 焦虑的来源\n\n" +
        "\"程序员 35 岁以后怎么办？\"——这个问题几乎是每个技术论坛的月经帖。脉脉上不时有\"35 岁被裁，找不到工作\"的帖子，底下一堆人焦虑附和。我也曾被这种焦虑困扰过。但工作越久，接触的人越多，我越来越觉得：**35 岁被淘汰的不是年龄，而是能力停滞。**\n\n" +
        "## 我观察到的 35+ 优秀程序员\n\n" +
        "我合作过不少超过 35 岁的程序员。观察下来，那些越老越吃香的程序员都有共同点：\n\n" +
        "### 1. 持续学习，不固守一种技术\n\n" +
        "他们不会说\"我只会 Java/只会后端\"。新技术出来，他们会去了解、去尝试，判断这个技术解决了什么问题，在什么场景下值得用。比如大模型火了之后，我身边一位 38 岁的架构师第一时间去学了 LangChain 和 RAG，现在已经在公司内部落地了 AI 客服系统。\n\n" +
        "### 2. 有业务理解能力\n\n" +
        "初级程序员等需求，中级程序员做需求，高级程序员**挑战需求**。优秀的 35+ 程序员不只是\"接需求写代码\"——他们能理解业务痛点，能和技术方、产品方、业务方有效沟通，能推动事情落地。这些能力是时间和经验积累出来的，不是刷 LeetCode 能学会的。\n\n" +
        "### 3. 能带人、能沟通\n\n" +
        "技术强是一回事，能把自己的技术复制给团队是另一回事。一个能带 5 个人的技术专家，比 5 个各自为战的程序员更有价值。做 Code Review 不只是挑毛病，而是教思考方式；写文档不只是完成 KPI，而是沉淀团队知识。\n\n" +
        "## 为什么会有\"35 岁危机\"的说法？\n\n" +
        "客观地说，这个说法不完全是无稽之谈。原因：互联网泡沫期的高薪惯性（2014-2020 年疯狂扩张，泡沫退去后高薪低能的人被淘汰）；确实有人在\"吃老本\"（5 年过去了能力和 3 年经验的开发者没有差别）；部分国内企业更喜欢能加班的年轻人（但这个问题正在改善）。\n\n" +
        "## 我的建议\n\n" +
        "如果你正在焦虑 35 岁危机，与其焦虑，不如行动：\n\n" +
        "1. **每年学一门新语言或新框架**：不是为了跳槽，而是为了打开视野\n" +
        "2. **多关注系统设计和架构**：理解你所用框架背后的设计原理，理解分布式系统的 trade-off\n" +
        "3. **培养软技能**：写作（写博客、写文档、写技术方案）、表达（能在 5 分钟内把一个技术问题讲清楚）、英语（技术领域的好资料 90% 是英文的）\n" +
        "4. **建立个人品牌**：写博客、在 GitHub 上贡献开源项目、在技术社区分享和答疑\n\n" +
        "## 换个角度看\n\n" +
        "一个行业的成熟度，看它如何对待年长的从业者。医生越老越吃香，因为经验值钱。律师、建筑师也是如此。软件工程作为一个年轻的行业，正在经历这个成熟过程。\n\n" +
        "## 总结\n\n" +
        "35 岁危机存在吗？对停止学习的人，存在。对持续成长的人，不存在。与其担心 35 岁被裁，不如想想如何让自己在 35 岁时拥有不可替代的价值。年龄不是问题，能力停滞才是。**保持好奇心，保持学习力，保持\"我不知道，但我想搞明白\"的态度。**",
      summary: "关于年龄焦虑，我有一些不同的看法。",
      category_id: essay.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "为什么我选择写博客",
      content:
        "## 开始的契机\n\n" +
        "两年前的一天，我在项目里踩了一个很坑的 bug，花了整整一个下午才解决。当时就想：\"这个问题网上居然没有中文资料，我得把它记下来，帮后面的人省点时间。\"于是写了第一篇博客文章。写得磕磕绊绊，排版乱七八糟，但发出去之后，居然收到了一条评论：\"谢谢，帮了大忙！\"那种感觉——爽。\n\n" +
        "## 写作的四大收获\n\n" +
        "### 1. 加深理解：能写清楚才是真的懂\n\n" +
        "以前学新技术，看完文档觉得\"我懂了\"，但真正开始写的时候发现——很多细节根本说不清楚。写作是一个\"发现自己其实不懂\"的过程。为了把一篇教程写清楚，我反复看了官方文档、读了源码、做了各种实验。写完那篇文章之后，理解上升了一个层次。**教是最好的学。**\n\n" +
        "### 2. 建立个人品牌：博客是最好的简历\n\n" +
        "我的博客没有大流量，每个月也就几千 UV。但就是这么一个\"小破站\"，给我带来了：一次面试邀请（面试官说\"看了你的博客，觉得你对技术有热情\"）、两次技术分享邀约、几个志同道合的朋友。博客就像一张 24 小时在线的名片，好的内容会帮你说话。\n\n" +
        "### 3. 连接同好：认识了很多不错的人\n\n" +
        "写了两年博客，最大的意外收获是社群。有人通过 RSS 订阅了我的博客每篇必读；有人发邮件和我讨论技术细节一来二去成了朋友；有人把我的文章翻译成了日语和韩语……这些都是如果没有博客永远不会发生的事。互联网最美好的地方是——你可以通过内容连接到那些和你频率相同的人。\n\n" +
        "### 4. 被动收入：虽然不多，但很开心\n\n" +
        "在博客上放了 Google AdSense，后来也接过几次技术产品的推广。收入不多，一个月几十美元，还不够一顿大餐。但这种\"睡后收入\"的感觉很奇妙——你两年前写的一篇文章，到现在还在为你赚钱。更重要的是，它证明了你的内容有价值。\n\n" +
        "## 坚持的秘诀\n\n" +
        "1. **不追求完美，先写出来再改**：完美主义是写作最大的敌人。一篇不完美的文章比一个完美的\"草稿箱\"好一百倍。\n" +
        "2. **写自己真正感兴趣的内容**：不要为了流量去写热点——那种文章你写起来痛苦，写完了也没有成长。热情是会传递的。\n" +
        "3. **固定节奏，但不强迫自己**：我定的是\"每周一篇\"，但如果某周实在太忙就不硬撑。宁缺毋滥。\n" +
        "4. **建立写作流程**：积累选题（平时有灵感就记在 Notion 里）→ 周末花 2 小时写初稿 → 隔一天再读一遍（会发现很多问题）→ 修改、加图、排版 → 发布。\n\n" +
        "## 写什么？\n\n" +
        "如果你也想开始写博客但不知道写什么：踩坑记录（今天你花了一个小时解决的 bug，写下来就能帮到别人）、学习笔记（刚学完一个新技术，边学边记整理成教程）、读后感（读完一本好书，写写你的思考）、技术对比（A 和 B 有什么区别？什么时候用哪个？）、实战经验（项目中学到的经验教训）。\n\n" +
        "## 总结\n\n" +
        "写了两年博客，回头看，最大的受益者不是读者，是我自己。通过写作，我把碎片化的知识变成了体系化的理解，也从一个小透明变成了在圈子里有一点点名字的人。如果你还在犹豫要不要开始——**开始写吧**。GitHub Issues、语雀、Notion、掘金……随便选一个，写下你的第一篇文章。写得不好没关系，下一篇会更好。重要的是——**开始，然后坚持。**",
      summary: "坚持写作两年，说说博客给我带来的改变。",
      category_id: essay.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "深夜 coding 的利与弊",
      content:
        "## 深夜的魔力\n\n" +
        "凌晨一点，万籁俱寂。房间里只有键盘的敲击声和显示器的微光。没有 Slack 消息、没有会议邀请、没有人在你耳边问\"这个需求什么时候能上线\"。世界安静得只剩下你和代码。这种感觉，每一个深夜 coding 过的程序员都懂。\n\n" +
        "## 为什么深夜 coding 效率高？\n\n" +
        "### 1. 完整的连续时间\n\n" +
        "白天的工作时间被各种事情切得支离破碎：站会、code review、同事的问题、产品经理的\"紧急需求\"……每 30 分钟就被打断一次。深夜不一样，你可以连续 3-4 个小时不受干扰地沉浸在代码中。这种\"心流\"状态是高质量工作的保证。\n\n" +
        "### 2. 大脑更清醒？\n\n" +
        "听起来反直觉——深夜明明应该困了。但很多程序员发现晚上 10 点之后反而比下午更清醒。一个可能的解释是：有些人天生是\"夜猫子\"（生物钟偏向晚睡型）。另一个原因是——夜晚的安静降低了大脑的认知负荷，让你能更专注。\n\n" +
        "### 3. 没有\"被催促\"的压力\n\n" +
        "白天写代码时总觉得背后有人在等。晚上没有这种压力——你可以从容地尝试不同的方案，可以重构，可以写测试，可以做那些\"不急但很重要\"的技术优化。\n\n" +
        "## 深夜 coding 的代价\n\n" +
        "### 1. 睡眠债是最昂贵的技术债\n\n" +
        "熬夜一次，第二天精神差。连续熬夜，形成恶性循环：白天效率低 → 只能晚上加班赶进度 → 继续熬夜 → 白天效率更低。研究表明，长期睡眠不足对认知能力的影响相当于醉酒。你以为深夜写的代码很厉害，第二天回看——\"这谁写的？\"\n\n" +
        "### 2. 健康影响是累积的\n\n" +
        "长期熬夜增加心脏病和中风风险；熬夜会导致激素紊乱更容易发胖；熬夜降低免疫力更容易生病；黑眼圈、长痘、加速衰老。这些影响不是一天两天能感受到的，但它们在累积。你今天熬的夜，十年后身体会还给你。\n\n" +
        "### 3. 失去了生活\n\n" +
        "深夜是家人朋友相处的时间。如果每天晚上都关在房间里写代码，你可能会失去很多重要的东西——和伴侣的聊天、陪孩子的时间、和朋友的聚会。代码可以明天再写，但这些时刻不会重来。\n\n" +
        "## 我的尝试：从夜猫子到早起鸟\n\n" +
        "深夜 coding 了一个月后，发现自己状态越来越差。于是尝试了一个改变：**从深夜 coding 变成早起 coding**。新的作息：晚上 11:00 睡觉 → 早上 6:00 起床 → 6:30-8:30 专注 coding 2 小时 → 9:00 正常上班。试了两周之后发现：精神明显变好（睡够了就是不一样）、早晨的工作效率完全不输深夜（同样是没有人打扰的时间段）、晚上可以和家人朋友正常相处。\n\n" +
        "## 总结\n\n" +
        "深夜 coding 是一把双刃剑。偶尔享受那种沉浸感是美好的，但**不要把熬夜当成常态**。试试早起 coding 吧。凌晨 6 点，天刚蒙蒙亮，冲一杯咖啡，坐下来写代码——那种感觉，和深夜一样美好，而且不伤身体。\"编程是一场马拉松，不是短跑。你今天写的任何一行代码，都不值得用你的健康去换。\"",
      summary: "夜深人静时写代码效率翻倍，但代价是什么？",
      category_id: essay.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "关于 AI 取代程序员的思考",
      content:
        "## 这个问题的热度\n\n" +
        "2023 年以来，\"AI 会取代程序员吗\"成了技术圈最热的话题。Devin 发布时有人说\"程序员的末日到了\"，Cursor 火起来后又有人说\"以后不需要会写代码了\"。作为一个每天使用 AI 工具（GitHub Copilot + ChatGPT/Claude）的程序员，我想聊聊自己的真实感受。\n\n" +
        "## AI 编程工具现状\n\n" +
        "### GitHub Copilot\n\n" +
        "我用了一年多 Copilot，它已经成了我编码的\"肌肉记忆\"：写注释它能自动生成函数体、写测试用例它比我还快、写样板代码（CRUD、表单验证、错误处理）基本不用手打了。但 Copilot 也会犯错：会\"编造\"不存在的 API、会写出看似正确但逻辑有 bug 的代码、会在你不注意的时候引入安全漏洞。\n\n" +
        "### ChatGPT / Claude\n\n" +
        "对于复杂问题（\"帮我设计一个分布式锁的方案\"、\"解释这段正则表达式\"），大语言模型非常有用。它是很好的\"结对编程伙伴\"——随时可以 bounce ideas。但同样：它会自信满满地给出错误的答案。你必须自己判断它说的对不对。\n\n" +
        "## AI 能做什么 vs 不能做什么\n\n" +
        "能做的：自动补全代码、生成样板代码（CRUD 基本不用手写）、Bug 修复建议（有时候比 Google 快）、代码解释和文档生成、简单的单元测试生成、SQL 查询编写和优化建议。\n\n" +
        "不能做的：**理解复杂业务逻辑**（AI 擅长模式匹配不是理解，真正的业务逻辑充满了 if/else/特殊情况）；**做出架构级别的决策**（架构需要权衡 trade-off，需要考虑人、团队、成本、时间——AI 做不了这种综合判断）；**与人有效沟通**（和产品经理讨论需求的合理性、和设计师沟通交互方案、跨团队推动事情落地）；**对代码质量和可维护性负责**（AI 能生成代码但它不负责，出了问题你得自己 debug 自己修自己背锅）。\n\n" +
        "## 我的判断\n\n" +
        "**AI 不会完全取代程序员，但会用 AI 的程序员会取代不会用的。** 用 AI 的程序员写样板代码的时间节省 50%，专注于更有价值的架构和业务；不用 AI 的程序员还在手写 getter/setter、还在手动写 CRUD。一年下来，差距是显著的。\n\n" +
        "## 我们该做什么？\n\n" +
        "1. **把 AI 当工具，不当威胁**：害怕 AI 取代你，不如学会使用它\n" +
        "2. **提升不可替代的能力**：系统设计、业务理解、沟通协作、技术判断——这些是 AI 不擅长的事情\n" +
        "3. **保持学习，不焦虑**：每次技术革命都会淘汰一些人，但也会创造新的机会。计算机科学的基础知识——数据结构、算法、网络、操作系统——比任何一个框架都更保值\n\n" +
        "## 未来的程序员\n\n" +
        "我猜未来程序员的工作会变成这样：AI 生成 80% 的代码（样板、CRUD、测试）；人写 20% 的关键代码（核心逻辑、架构决策）；人的主要工作是理解业务、设计方案、审查 AI 生成的代码、保证质量。程序员更像是一个\"AI 的指挥者\"——告诉 AI 做什么、检查 AI 做得对不对、在关键节点亲自动手。\n\n" +
        "## 总结\n\n" +
        "蒸汽机没有淘汰工人，但改变了工人的工作方式。AI 也是一样。它不会淘汰所有程序员，但会改变程序员的工作方式。**拥抱变化，保持学习，提升不可替代的能力**——这不仅是应对 AI 的策略，也是成为一个更好程序员的路径。",
      summary: "Copilot 和 ChatGPT 让编程门槛降低，我们该何去何从？",
      category_id: essay.id, created_at: now(), updated_at: now(),
    },
    {
      id: nextPostId++, title: "从一个 Bug 学到的教训",
      content:
        "## 事发经过\n\n" +
        "那天下午，我像往常一样写一个 Flask API 接口。需求很简单：接收一个 POST 请求，解析 JSON 数据，写入数据库，返回结果。写完代码，用 Postman 测试——**所有 POST 请求都返回 500 Internal Server Error**。我心想：\"小事，肯定是哪里写错了。\"没想到这个\"小事\"花了我 3 个小时。\n\n" +
        "## Debug 过程\n\n" +
        "### 第一步：检查请求体（30 分钟）\n\n" +
        "以为是请求格式有问题。反复检查 JSON 格式、Content-Type 头、body 是不是空的……一切正常。用 curl 直接请求，还是 500。\n\n" +
        "### 第二步：检查数据库连接（30 分钟）\n\n" +
        "怀疑数据库挂了。检查连接字符串、测试数据库连通性、查看数据库日志……数据库好好的。GET 请求正常返回数据，说明数据库没问题。问题一定在 POST 的处理逻辑里。\n\n" +
        "### 第三步：添加 print 调试（1 小时）\n\n" +
        "在代码里加了 10 个 `print(\"到达此处\")` 的调试语句。但日志里**什么都没有输出**。这就很奇怪了——说明代码根本没执行到那些地方。\n\n" +
        "### 第四步：逐行注释代码（30 分钟）\n\n" +
        "把处理逻辑一行一行注释掉，想找到是哪一行出的问题。注释了 20 行之后发现……还是 500。这太诡异了。\n\n" +
        "### 第五步：找到真正的 Bug\n\n" +
        "最后决定仔细检查 try/except 块。在一个不起眼的角落，我看到了它：\n\n" +
        "```python\ntry:\n    data = request.get_json()\n    # ... 后续处理逻辑\nexcept:\n    pass  # ← 就是这个 pass！\n```\n\n" +
        "一个**裸 except + pass**，吞掉了所有异常。\n\n" +
        "## 问题分析\n\n" +
        "这个裸 `except: pass` 做了什么？它告诉 Python：\"不管发生什么错误，当作什么都没发生，继续执行。\"结果是：`request.get_json()` 因为某个原因抛出了异常 → 异常被 `except: pass` 静默吞掉 → `data` 变量没有被正确赋值 → 后续代码试图使用 `data` 时出错了 → 但这个错误又被外层 try/except 捕获了 → 因为所有日志都被吞掉了，我完全不知道发生了什么。\n\n" +
        "## 教训\n\n" +
        "### 1. 永远不要写裸 except\n\n" +
        "裸 except 会捕获一切异常，包括 `KeyboardInterrupt`（Ctrl+C）和 `SystemExit`——这些你通常不想捕获。至少写明你要处理什么异常：`except ValueError:`。\n\n" +
        "### 2. 永远不要 except: pass\n\n" +
        "异常被静默吞掉 = 你失去了所有排查问题的线索。如果你不得不捕获异常，至少：`except Exception as e: logger.error(f\"解析失败: {e}\", exc_info=True)`。\n\n" +
        "### 3. 异常处理的最佳实践\n\n" +
        "```python\n@app.route('/api/posts', methods=['POST'])\ndef create_post():\n    try:\n        data = request.get_json()\n        if not data:\n            return jsonify({\"error\": \"请求体为空\"}), 400\n        # ... 处理逻辑\n        return jsonify(post.to_dict()), 201\n    except ValidationError as e:\n        # 预期的错误，返回友好提示\n        return jsonify({\"error\": str(e)}), 422\n    except Exception as e:\n        # 非预期错误，记录详细日志\n        app.logger.error(f\"创建文章失败: {e}\", exc_info=True)\n        return jsonify({\"error\": \"服务器内部错误\"}), 500\n```\n\n" +
        "### 4. Debug 时的反思\n\n" +
        "回头看，如果有这些习惯，这个 bug 不会花 3 个小时：如果有**日志**而不是 `pass`，一眼就能看到错误信息；如果开了**Debug 模式**（`app.run(debug=True)`），Flask 会显示详细的 traceback；如果**单元测试**覆盖了这个接口，bug 会在提交之前就被发现。\n\n" +
        "## 总结\n\n" +
        "这个 bug 让我付出了 3 个小时的代价，但它教给我的东西值 100 个小时：永远不要写裸 except + pass；日志是 debug 的眼睛；Debug 模式是开发时最好的朋友；单元测试不是负担——当你花了 3 小时 debug 时，那 30 分钟写测试的时间一点都不多。每一个让你痛苦不堪的 bug，都是最好的老师。",
      summary: "一个简单的缩进错误让我 debug 了 3 个小时，记录这次惨痛经历。",
      category_id: essay.id, created_at: now(), updated_at: now(),
    },
  ];
}

// --- Posts CRUD ---

export function getPostList(q?: string) {
  let result = posts
    .map((p) => {
      const cat = categories.find((c) => c.id === p.category_id);
      return {
        id: p.id,
        title: p.title,
        summary: p.summary,
        category_name: cat?.name ?? null,
        created_at: p.created_at,
      };
    })
    .sort((a, b) => b.id - a.id);

  if (q) {
    const lower = q.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        (p.summary && p.summary.toLowerCase().includes(lower)) ||
        (p.category_name && p.category_name.toLowerCase().includes(lower))
    );
  }

  return result;
}

export function getPostById(id: number) {
  const p = posts.find((x) => x.id === id);
  if (!p) return null;
  const cat = categories.find((c) => c.id === p.category_id);
  return {
    ...p,
    category_name: cat?.name ?? null,
  };
}

export function createPost(data: {
  title: string;
  content: string;
  summary?: string;
  category_id?: number;
}) {
  const p: PostRow = {
    id: nextPostId++,
    title: data.title,
    content: data.content,
    summary: data.summary ?? null,
    category_id: data.category_id ?? null,
    created_at: now(),
    updated_at: now(),
  };
  posts.push(p);
  return getPostById(p.id);
}

export function updatePost(
  id: number,
  data: {
    title?: string;
    content?: string;
    summary?: string;
    category_id?: number;
  }
) {
  const idx = posts.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  const p = posts[idx];
  if (data.title !== undefined) p.title = data.title;
  if (data.content !== undefined) p.content = data.content;
  if (data.summary !== undefined) p.summary = data.summary || null;
  if (data.category_id !== undefined) p.category_id = data.category_id;
  p.updated_at = now();
  return getPostById(id);
}

export function deletePost(id: number): boolean {
  const idx = posts.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  posts.splice(idx, 1);
  return true;
}

// --- Categories ---

export function getCategoryList() {
  return categories.map((c) => ({ id: c.id, name: c.name }));
}

export function createCategory(name: string) {
  const exists = categories.find((c) => c.name === name);
  if (exists) return null;
  const c: CategoryRow = { id: nextCategoryId++, name };
  categories.push(c);
  return { id: c.id, name: c.name };
}
