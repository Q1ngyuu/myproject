# Blog System API 文档

Base URL: `http://localhost:3000`（开发）/ `https://你的域名.vercel.app`（生产）

所有接口统一返回格式：

```json
{
  "code": 0,
  "data": "...",
  "message": "success"
}
```

| code | 含义 |
|------|------|
| `0` | 成功 |
| `1` | 业务错误（如数据不存在、参数校验失败） |

---

## 文章接口

### 1. 获取文章列表

```
GET /api/posts
```

**请求头：** 无需特殊设置

**响应示例：**

```json
{
  "code": 0,
  "data": [
    {
      "id": 8,
      "title": "雨夜随想",
      "summary": "一个安静的雨夜，一些零碎的感想",
      "category_name": "随笔",
      "created_at": "2026-07-15T10:30:00.000Z"
    },
    {
      "id": 7,
      "title": "学会断舍离",
      "summary": "整理物品也是对内心的整理",
      "category_name": "生活",
      "created_at": "2026-07-15T10:29:00.000Z"
    }
  ],
  "message": "success"
}
```

**说明：** 按创建时间倒序排列，不返回正文内容。

---

### 2. 获取文章详情

```
GET /api/posts/:id
```

**请求示例：**

```
GET /api/posts/1
```

**成功响应：**

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "title": "Python Flask 入门指南",
    "content": "Flask 是一个轻量级的 Python Web 框架...",
    "summary": "从零开始学习 Flask Web 开发",
    "category_id": 1,
    "category_name": "技术",
    "created_at": "2026-07-15T10:00:00.000Z",
    "updated_at": "2026-07-15T10:00:00.000Z"
  },
  "message": "success"
}
```

**错误响应：**

```json
{
  "code": 1,
  "data": null,
  "message": "Post not found"
}
```

---

### 3. 创建文章

```
POST /api/posts
```

**请求头：**

```
Content-Type: application/json
```

**请求体：**

```json
{
  "title": "我的新文章",
  "content": "这是文章正文内容...",
  "summary": "文章摘要（可选）",
  "category_id": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 文章标题 |
| `content` | string | ✅ | 文章正文 |
| `summary` | string | ❌ | 文章摘要 |
| `category_id` | number | ❌ | 所属分类 ID |

**成功响应：**

```json
{
  "code": 0,
  "data": {
    "id": 9,
    "title": "我的新文章",
    "summary": "文章摘要（可选）",
    "category_name": "技术",
    "created_at": "2026-07-15T12:00:00.000Z",
    "updated_at": "2026-07-15T12:00:00.000Z"
  },
  "message": "Post created"
}
```

**错误响应（缺少必填字段）：**

```json
{
  "code": 1,
  "data": null,
  "message": "Title is required"
}
```

---

### 4. 更新文章

```
PUT /api/posts/:id
```

**请求头：**

```
Content-Type: application/json
```

**请求体（支持部分更新）：**

```json
{
  "title": "修改后的标题",
  "content": "修改后的内容..."
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ❌ | 新标题（不能为空字符串） |
| `content` | string | ❌ | 新内容（不能为空字符串） |
| `summary` | string | ❌ | 新摘要 |
| `category_id` | number | ❌ | 新分类 ID |

**成功响应：**

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "title": "修改后的标题",
    "content": "修改后的内容...",
    "summary": "从零开始学习 Flask Web 开发",
    "category_id": 1,
    "category_name": "技术",
    "created_at": "2026-07-15T10:00:00.000Z",
    "updated_at": "2026-07-15T12:30:00.000Z"
  },
  "message": "Post updated"
}
```

**错误响应（文章不存在）：**

```json
{
  "code": 1,
  "data": null,
  "message": "Post not found"
}
```

**错误响应（标题为空）：**

```json
{
  "code": 1,
  "data": null,
  "message": "Title cannot be empty"
}
```

---

### 5. 删除文章

```
DELETE /api/posts/:id
```

**请求示例：**

```
DELETE /api/posts/1
```

**成功响应：**

```json
{
  "code": 0,
  "data": null,
  "message": "Post deleted"
}
```

**错误响应：**

```json
{
  "code": 1,
  "data": null,
  "message": "Post not found"
}
```

---

## 分类接口

### 6. 获取分类列表

```
GET /api/categories
```

**请求头：** 无需特殊设置

**响应示例：**

```json
{
  "code": 0,
  "data": [
    { "id": 1, "name": "技术" },
    { "id": 2, "name": "生活" },
    { "id": 3, "name": "随笔" }
  ],
  "message": "success"
}
```

---

### 7. 创建分类

```
POST /api/categories
```

**请求头：**

```
Content-Type: application/json
```

**请求体：**

```json
{
  "name": "摄影"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 分类名称（不能重复） |

**成功响应：**

```json
{
  "code": 0,
  "data": {
    "id": 4,
    "name": "摄影"
  },
  "message": "Category created"
}
```

**错误响应（名称为空）：**

```json
{
  "code": 1,
  "data": null,
  "message": "Category name is required"
}
```

**错误响应（名称重复）：**

```json
{
  "code": 1,
  "data": null,
  "message": "Category '技术' already exists"
}
```

---

## 健康检查

```
GET /api/health
```

**响应：**

```json
{
  "code": 0,
  "data": null,
  "message": "Blog System API is running"
}
```

---

## 错误码汇总

| HTTP 状态码 | code | 场景 |
|-------------|------|------|
| 200 | 0 | 操作成功 |
| 400 | 1 | 参数校验失败、数据重复 |
| 404 | 1 | 文章不存在 |

## cURL 测试示例

```bash
# 获取文章列表
curl http://localhost:3000/api/posts

# 获取文章详情
curl http://localhost:3000/api/posts/1

# 创建文章
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"测试文章","content":"正文","category_id":1}'

# 更新文章
curl -X PUT http://localhost:3000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"新标题"}'

# 删除文章
curl -X DELETE http://localhost:3000/api/posts/1

# 获取分类
curl http://localhost:3000/api/categories

# 创建分类
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"摄影"}'

# 健康检查
curl http://localhost:3000/api/health
```
