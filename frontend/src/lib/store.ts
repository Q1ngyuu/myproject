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
  ];

  const [tech, life, essay] = categories;

  posts = [
    {
      id: nextPostId++,
      title: "Python Flask 入门指南",
      content:
        "Flask 是一个轻量级的 Python Web 框架，适合快速构建 Web 应用和 API。\n\n本文将带你从零开始搭建一个 Flask 项目，涵盖路由、模板、数据库等基础知识。",
      summary: "从零开始学习 Flask Web 开发",
      category_id: tech.id,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: nextPostId++,
      title: "理解 RESTful API 设计",
      content:
        "REST（Representational State Transfer）是一种软件架构风格。\n\n一个好的 RESTful API 应该遵循资源导向、无状态通信、统一接口等原则。",
      summary: "RESTful API 最佳实践与设计原则",
      category_id: tech.id,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: nextPostId++,
      title: "周末徒步登山记",
      content:
        "周六清晨六点出发，驱车两小时到达山脚。沿途野花盛开，空气清新。\n\n登顶那一刻，俯瞰云海翻涌，所有的疲惫都值得了。",
      summary: "一次说走就走的户外徒步体验",
      category_id: life.id,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: nextPostId++,
      title: "我的居家办公效率提升方法",
      content:
        "远程办公一年多，总结了几点提高效率的心得：\n\n1. 固定作息时间\n2. 打造专属工作区\n3. 使用番茄工作法\n4. 定期运动保持精力",
      summary: "远程办公的高效秘诀分享",
      category_id: life.id,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: nextPostId++,
      title: "关于阅读这件事",
      content:
        "最近重读了《百年孤独》，与十年前读时的感受完全不同。\n\n阅读的魅力或许就在于此——同一本书，不同年龄读，会有不同的理解和共鸣。",
      summary: "重新思考阅读的意义与乐趣",
      category_id: essay.id,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: nextPostId++,
      title: "Git 工作流的思考",
      content:
        "团队协作中，选择一个合适的 Git 工作流至关重要。\n\nGit Flow 适合有固定发布周期的项目，而 GitHub Flow 则更适合持续部署的团队。",
      summary: "聊聊团队协作中的 Git 实践",
      category_id: tech.id,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: nextPostId++,
      title: "学会断舍离",
      content:
        "整理房间时发现囤积了大量不再使用的物品。下定决心做了一次彻底的断舍离。\n\n丢掉的不只是物品，还有附着在上面的执念。",
      summary: "整理物品也是对内心的整理",
      category_id: life.id,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: nextPostId++,
      title: "雨夜随想",
      content:
        "窗外下着淅淅沥沥的小雨，泡一杯热茶，放一张老唱片。\n\n这样的夜晚适合放空，什么都不想，什么都不做。",
      summary: "一个安静的雨夜，一些零碎的感想",
      category_id: essay.id,
      created_at: now(),
      updated_at: now(),
    },
  ];
}

// --- Posts CRUD ---

export function getPostList() {
  return posts
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
