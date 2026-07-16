"""Add 22 additional posts to reach 30 total."""
from app import app, db
from models import Post

NEW_POSTS = [
    # ── 技术 (6篇) ──
    (1, 'Docker 容器化部署实战',
     '从 Dockerfile 编写到 docker-compose 编排，一站式掌握容器化部署。',
     '''## 为什么需要 Docker？

在软件开发中，有一个经典问题："在我机器上能跑啊！"。Docker 的出现彻底解决了这个痛点。

通过容器化技术，开发环境、测试环境、生产环境可以做到完全一致。再也不用担心"环境不一致"导致的诡异 bug。

## Docker 核心概念

### 镜像（Image）

镜像是一个只读模板，包含了运行应用所需的一切：代码、运行时、系统工具、库和配置。你可以把镜像理解为一个"快照"。

### 容器（Container）

容器是镜像的运行实例。一个镜像可以启动多个容器，每个容器相互隔离。

### 仓库（Registry）

Docker Hub 是公共的镜像仓库，你可以 push/pull 镜像，就像 Git 一样。

## Dockerfile 编写

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

### 优化技巧

- 使用 `.dockerignore` 排除不必要的文件（`__pycache__`、`.git`、`venv` 等）
- 合并 RUN 命令减少镜像层数
- 使用多阶段构建（multi-stage build）减小最终镜像体积
- 优先使用官方镜像（安全 + 维护好）

## Docker Compose 编排

单容器应用很简单，但实际项目往往需要多个服务（Web + 数据库 + 缓存 + 消息队列）。Docker Compose 可以一键启动所有服务。

```yaml
version: "3.8"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/blog
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: blog
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  pgdata:
```

## 常用命令速查

```bash
# 镜像管理
docker build -t myapp:v1 .          # 构建镜像
docker images                        # 列出本地镜像
docker rmi myapp:v1                  # 删除镜像
docker tag myapp:v1 myapp:latest     # 打标签

# 容器管理
docker run -d -p 5000:5000 --name app myapp
docker ps                            # 运行中的容器
docker ps -a                         # 所有容器
docker stop app && docker rm app     # 停止并删除

# 调试
docker logs -f app                   # 实时查看日志
docker exec -it app /bin/bash        # 进入容器

# Compose
docker-compose up -d                 # 启动所有服务
docker-compose down                  # 停止并清理
docker-compose logs -f web           # 查看特定服务日志
```

## 生产环境注意

1. **不要用 root 用户运行容器**，在 Dockerfile 中创建专用用户
2. **设置资源限制**：`--memory="512m" --cpus="1.0"`
3. **健康检查**：在 Dockerfile 中添加 `HEALTHCHECK` 指令
4. **日志收集**：容器日志默认存储在本地，生产环境建议接入 ELK/Grafana Loki

## 总结

Docker 是现代开发的必备技能。从写好一个 Dockerfile 开始，逐步掌握 Compose 编排和集群管理，你的部署效率将大幅提升。记住：容器化不是目的，解决实际问题才是。'''),

    (1, 'Linux 常用命令速查',
     '整理 Linux 开发中最高频使用的命令，提高命令行效率。',
     '''## 前言

对于开发者来说，Linux 命令行是绕不过去的技能。无论你是后端、前端还是运维，每天至少要面对终端几个小时。掌握常用命令，能让你事半功倍。

本文整理了日常开发中最高频使用的 Linux 命令，建议收藏，按需查阅。

## 文件与目录操作

```bash
# 基础操作
ls -la              # 详细列表（含隐藏文件）
ls -lh              # 人类可读的文件大小
cd -                # 回到上一个目录
pwd                 # 当前目录路径

# 查找文件
find . -name "*.py"             # 按名称查找
find . -type f -size +10M       # 查找大于 10MB 的文件
find . -mtime -1                # 最近一天修改的文件
find . -name "*.log" -delete    # 查找并删除

# 查看文件
cat file.txt        # 查看全部
head -20 file.txt   # 前 20 行
tail -f app.log     # 实时跟踪日志末尾
less file.txt       # 分页浏览（按 q 退出）
wc -l file.txt      # 统计行数

# 文件操作
cp -r src dst       # 递归复制
mv old new          # 移动/重命名
rm -rf dir/         # 强制递归删除（慎用！）
ln -s /path/target link_name  # 创建软链接
```

## 文本处理

```bash
# grep — 文本搜索瑞士军刀
grep "error" app.log                # 搜索包含 error 的行
grep -i "error" app.log             # 忽略大小写
grep -r "TODO" src/                 # 递归搜索目录
grep -v "debug" app.log             # 排除匹配的行
grep -c "error" app.log             # 统计匹配行数
grep -A 3 "error" app.log           # 显示匹配行及后 3 行
grep -B 2 "error" app.log           # 显示匹配行及前 2 行

# awk — 列处理利器
awk '{print $1}' file.txt           # 打印第一列
awk -F':' '{print $1, $3}' /etc/passwd  # 指定分隔符
awk '$3 > 1000' file.txt            # 条件过滤

# sed — 流编辑器
sed 's/old/new/g' file.txt          # 替换文本
sed -i 's/old/new/g' file.txt       # 直接修改文件
sed '5,10d' file.txt                # 删除第 5-10 行

# 管道组合
cat access.log | grep "404" | awk '{print $1}' | sort | uniq -c | sort -rn | head -10
# 找出请求 404 最多的 10 个 IP
```

## 进程管理

```bash
ps aux | grep python        # 查找 Python 进程
ps aux --sort=-%mem | head  # 按内存使用排序
kill -9 1234                # 强制终止进程（最后手段）
killall -9 node             # 终止所有 node 进程
pkill -f "python app.py"    # 按命令行匹配终止

htop                        # 交互式进程查看器（推荐！）
top -p 1234                 # 监控特定进程

# 后台运行
nohup python app.py &       # 后台运行，忽略 hangup 信号
nohup python app.py > app.log 2>&1 &  # 后台运行并重定向输出
```

## 网络相关

```bash
# 端口与连接
netstat -tlnp | grep 5000   # 查看 5000 端口占用
lsof -i :5000               # 查看占用 5000 端口的进程
ss -tlnp                    # 更现代的 netstat

# HTTP 请求
curl http://localhost:5000/api/posts
curl -X POST http://localhost:5000/api/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title":"hello"}'
curl -I https://example.com  # 只看响应头

# DNS 与连通性
ping google.com              # 测试连通性
nslookup example.com         # DNS 查询
dig example.com A            # 详细 DNS 信息
```

## 权限管理

```bash
chmod +x script.sh           # 添加执行权限
chmod 755 script.sh          # rwxr-xr-x
chmod 600 secret.key         # 只有所有者可读写
chmod -R 755 dir/            # 递归修改

chown user:group file        # 修改所有者
chown -R user:group dir/     # 递归修改
```

## 磁盘与空间

```bash
df -h                        # 磁盘使用概览
du -sh *                     # 当前目录各文件/文件夹大小
du -sh .                     # 当前目录总大小
du -h --max-depth=1 | sort -hr | head  # 找出最大的文件夹
ncdu                         # 交互式磁盘分析（需安装）
```

## 实用快捷键

| 快捷键 | 作用 |
|--------|------|
| `Ctrl + R` | 搜索命令历史 |
| `Ctrl + A` | 跳到行首 |
| `Ctrl + E` | 跳到行尾 |
| `Ctrl + U` | 删除光标前内容 |
| `Ctrl + K` | 删除光标后内容 |
| `Ctrl + L` | 清屏 |
| `!!` | 执行上一条命令 |
| `!$` | 上一条命令的最后一个参数 |

## 总结

命令行不需要死记硬背，多用自然就熟了。建议每天至少用命令行完成一项任务，一个月后你会发现自己离不开终端了。遇到不记得的命令，`man` 和 `--help` 是最好的老师。'''),

    (1, 'MySQL 索引优化指南',
     '深入理解 B+Tree 索引原理，学会分析慢查询并优化数据库性能。',
     '''## 为什么需要索引？

想象你在一本 1000 页的书里找一个词，如果没有目录，你只能一页一页翻。数据库也是一样：没有索引，MySQL 必须全表扫描（Full Table Scan），数据量大时性能会急剧下降。

索引就像书的目录，能让数据库快速定位到目标数据。

## B+Tree 索引原理

MySQL InnoDB 引擎默认使用 B+Tree 作为索引结构。理解它的特点，才能更好地设计索引。

### B+Tree 的特点

1. **所有数据存储在叶子节点**：非叶子节点只存 key，叶子节点存完整行数据（聚簇索引）或主键值（二级索引）
2. **叶子节点通过指针串联成有序链表**：这使得范围查询非常高效
3. **树是平衡的**：查询时间复杂度 O(log n)，通常 3-4 层就能覆盖千万级数据

### 为什么不用二叉树？

二叉树在极端情况下会退化成链表（比如按顺序插入 1,2,3,4,5...）。B+Tree 是自平衡的，且每个节点能存多个 key，大大降低了树的高度。

## 索引类型

```sql
-- 主键索引（聚簇索引）
-- InnoDB 按照主键顺序存储数据
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)
);

-- 普通索引（二级索引）
CREATE INDEX idx_name ON users(name);

-- 唯一索引
CREATE UNIQUE INDEX idx_email ON users(email);

-- 联合索引
CREATE INDEX idx_city_age ON users(city, age);

-- 前缀索引（适用于长字符串）
CREATE INDEX idx_title_prefix ON posts(title(20));

-- 全文索引
CREATE FULLTEXT INDEX idx_content ON posts(content);
```

## 最左前缀原则

这是面试和实战中最容易被问到的知识点。假设我们创建了联合索引 `(a, b, c)`：

```sql
-- ✅ 能用索引
WHERE a = 1
WHERE a = 1 AND b = 2
WHERE a = 1 AND b = 2 AND c = 3
WHERE a = 1 AND c = 3  -- 用到了 a，但 c 不行

-- ❌ 不能用索引
WHERE b = 2             -- 跳过了 a
WHERE b = 2 AND c = 3   -- 跳过了 a
WHERE c = 3             -- 跳过了 a 和 b
```

**口诀：** 最左列不能少，中间列不能断。范围查询右边的列会失效。

## EXPLAIN 分析

遇到慢查询，第一步就是用 `EXPLAIN` 分析执行计划：

```sql
EXPLAIN SELECT * FROM posts WHERE category_id = 1 ORDER BY created_at DESC;
```

关注这几个关键字段：

| 字段 | 含义 | 好的值 |
|------|------|--------|
| type | 访问类型 | const > ref > range > index > ALL |
| key | 使用的索引 | 不是 NULL |
| rows | 扫描行数 | 越小越好 |
| Extra | 额外信息 | Using index（覆盖索引） |

如果 type 是 `ALL`（全表扫描），说明必须加索引了。

## 索引优化实战

### 1. 覆盖索引

如果查询的所有字段都在索引中，MySQL 就不用回表查询：

```sql
-- 假设有索引 (category_id, title, created_at)
-- 这个查询只访问索引，不回表，Extra 显示 Using index
SELECT category_id, title FROM posts WHERE category_id = 1;
```

### 2. 避免在索引列上做运算

```sql
-- ❌ 索引失效
SELECT * FROM posts WHERE YEAR(created_at) = 2024;

-- ✅ 使用范围查询
SELECT * FROM posts WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
```

### 3. 避免隐式类型转换

```sql
-- 假设 phone 是 VARCHAR 类型
-- ❌ 索引失效（MySQL 会把字符串转为数字）
SELECT * FROM users WHERE phone = 13800138000;

-- ✅ 用字符串查询
SELECT * FROM users WHERE phone = '13800138000';
```

## 慢查询日志

开启慢查询日志，定期分析：

```sql
-- 查看慢查询配置
SHOW VARIABLES LIKE 'slow_query%';
SHOW VARIABLES LIKE 'long_query_time';

-- 开启慢查询日志
SET GLOBAL slow_query_log = ON;
SET GLOBAL long_query_time = 1;  -- 超过 1 秒的查询会被记录
```

## 总结

索引优化是一个"理解原理 → 分析执行计划 → 调整索引 → 验证效果"的循环过程。记住：不是索引越多越好，每个索引都会占用存储空间并降低写入性能。只为高频查询条件建立索引，让 EXPLAIN 告诉你真相。'''),

    (1, 'Redis 缓存策略与实战',
     '学习 Redis 常用数据结构，掌握缓存穿透、击穿、雪崩的解决方案。',
     '''## 为什么需要缓存？

现代 Web 应用面临的挑战：用户量增长 → 数据库压力增大 → 响应变慢 → 用户体验下降。

缓存的本质是**用空间换时间**：把高频访问的数据放在更快的存储中，减少对数据库的直接访问。

Redis 是目前最流行的缓存中间件，单机 QPS 可达 10 万+，延迟通常在 1ms 以内。

## Redis 五大基本数据类型

### String（字符串）

最基础的类型，用于缓存、计数器、分布式锁。

```python
import redis
r = redis.Redis(host='localhost', port=6379)

# 缓存 JSON 数据
r.setex('post:1', 3600, json.dumps(post_data))  # 1 小时过期

# 计数器（INCR 是原子操作）
r.incr('page_view:post:1')

# 分布式锁
lock = r.set('lock:task', '1', nx=True, ex=30)  # 30 秒自动释放
```

### Hash（哈希）

适合存储对象，比 String 更节省空间。

```python
r.hset('user:1001', mapping={'name': 'Alice', 'age': '25', 'city': 'Beijing'})
r.hget('user:1001', 'name')    # 获取单个字段
r.hgetall('user:1001')         # 获取所有字段
```

### List（列表）

可用于消息队列、最新动态列表。

```python
r.lpush('news_feed', 'post:100', 'post:101')   # 左侧插入
r.lrange('news_feed', 0, 9)                     # 获取前 10 条
r.ltrim('news_feed', 0, 99)                     # 只保留前 100 条
```

### Set（集合）

无序不重复集合，适合标签、共同好友等场景。

```python
r.sadd('tags:post:1', 'python', 'flask', 'web')
r.sinter('tags:post:1', 'tags:post:2')  # 两篇文章的共同标签
```

### ZSet（有序集合）

排行榜的最佳选择。

```python
r.zadd('leaderboard', {'user:1': 1000, 'user:2': 850, 'user:3': 720})
r.zrevrange('leaderboard', 0, 9, withscores=True)  # Top 10
r.zincrby('leaderboard', 50, 'user:1')             # 加分
```

## 三大缓存问题

### 缓存穿透

**场景：** 查询一个**数据库中也不存在**的数据，缓存和数据库都没有，请求直接打到数据库。

**解决方案：**
1. **布隆过滤器**：在缓存前加一个布隆过滤器，判断 key 是否可能存在
2. **缓存空值**：对不存在的数据也缓存一个空值（设置较短的过期时间）

```python
def get_post(post_id):
    cache_key = f'post:{post_id}'
    data = r.get(cache_key)
    if data is not None:
        return json.loads(data) if data != 'NULL' else None
    # 查数据库
    post = db_get_post(post_id)
    if post:
        r.setex(cache_key, 3600, json.dumps(post))
    else:
        r.setex(cache_key, 60, 'NULL')  # 缓存空值防穿透
    return post
```

### 缓存击穿

**场景：** 某个**热点 key** 在过期瞬间，大量并发请求同时打到数据库。

**解决方案：**
1. **互斥锁**：第一个请求去查 DB 并重建缓存，其他请求等待
2. **逻辑过期**：value 里存一个逻辑过期时间，后台异步刷新

```python
def get_hot_post(post_id):
    cache_key = f'post:{post_id}'
    data = r.get(cache_key)
    if data:
        return json.loads(data)
    # 加锁，只有一个请求去查 DB
    lock_key = f'lock:post:{post_id}'
    if r.setnx(lock_key, 1):
        r.expire(lock_key, 10)
        post = db_get_post(post_id)
        r.setex(cache_key, 3600, json.dumps(post))
        r.delete(lock_key)
        return post
    else:
        time.sleep(0.1)
        return get_hot_post(post_id)  # 重试
```

### 缓存雪崩

**场景：** 大量 key 在同一时间段过期，请求集中打到数据库。

**解决方案：**
1. **过期时间加随机值**：`expire = 3600 + random.randint(0, 600)`
2. **多级缓存**：本地缓存（如 Caffeine）→ Redis → DB
3. **限流降级**：使用 Hystrix/Sentinel 保护数据库

## 缓存更新策略

| 策略 | 做法 | 适用场景 |
|------|------|----------|
| Cache Aside | 先更新 DB，再删除缓存 | 最常用，简单可靠 |
| Read/Write Through | 缓存层负责读写 DB | 对业务透明 |
| Write Behind | 先写缓存，异步写 DB | 写密集型，有数据丢失风险 |

## 总结

Redis 功能强大，但用好它需要理解其数据结构和缓存策略。缓存不是银弹——先有性能瓶颈，再考虑加缓存。过早优化是万恶之源，但没有缓存的系统也是脆弱的。掌握穿透、击穿、雪崩的解决方案，是每个后端开发的必修课。'''),

    (1, '设计模式：单例与工厂',
     '用 Python 代码演示最常用的两种设计模式，理解其应用场景。',
     '''## 什么是设计模式？

设计模式是软件开发中反复出现的、经过验证的解决方案。它们不是具体的代码，而是一种**可复用的设计经验**。

GoF（Gang of Four）在 1994 年总结了 23 种经典设计模式，分为三大类：创建型、结构型、行为型。本文聚焦最常用的两种创建型模式：单例模式和工厂模式。

## 单例模式（Singleton Pattern）

### 定义

确保一个类**只有一个实例**，并提供一个全局访问点。

### 什么时候用？

- 数据库连接池（全局只应有一个连接池）
- 配置管理器（全局共用一套配置）
- 日志记录器（避免多个 logger 写同一个文件）
- 应用中的全局状态管理

### Python 实现

```python
class Singleton:
    _instance = None
    _initialized = False

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        # 防止重复初始化
        if not self._initialized:
            self.data = {}
            self._initialized = True


# 验证
a = Singleton()
b = Singleton()
print(a is b)        # True — 同一个实例
a.data['key'] = 'value'
print(b.data)        # {'key': 'value'} — 共享状态
```

### 线程安全的单例

```python
import threading

class ThreadSafeSingleton:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:  # 双重检查锁
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
```

### 使用装饰器实现

```python
def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Config:
    def __init__(self):
        self.settings = {}
```

### 优缺点

✅ 优点：控制资源访问、全局访问点、避免重复创建
❌ 缺点：隐藏依赖关系、难以单元测试（全局状态）、可能变成"上帝对象"

## 工厂模式（Factory Pattern）

### 定义

定义一个创建对象的接口，让子类决定实例化哪个类。工厂方法使一个类的实例化延迟到其子类。

### 简单工厂

```python
class Animal:
    def speak(self):
        raise NotImplementedError

class Dog(Animal):
    def speak(self):
        return "汪汪！"

class Cat(Animal):
    def speak(self):
        return "喵喵！"

class Bird(Animal):
    def speak(self):
        return "叽叽喳喳！"


class AnimalFactory:
    @staticmethod
    def create(animal_type: str) -> Animal:
        mapping = {
            "dog": Dog,
            "cat": Cat,
            "bird": Bird,
        }
        animal_class = mapping.get(animal_type.lower())
        if animal_class is None:
            raise ValueError(f"Unknown animal type: {animal_type}")
        return animal_class()


# 使用
pet = AnimalFactory.create("dog")
print(pet.speak())  # 汪汪！
```

### 实战：支付网关

```python
from abc import ABC, abstractmethod

class PaymentGateway(ABC):
    @abstractmethod
    def pay(self, amount: float) -> bool:
        pass

class AlipayGateway(PaymentGateway):
    def pay(self, amount):
        print(f"支付宝支付 {amount} 元")
        return True

class WechatGateway(PaymentGateway):
    def pay(self, amount):
        print(f"微信支付 {amount} 元")
        return True

class UnionPayGateway(PaymentGateway):
    def pay(self, amount):
        print(f"银联支付 {amount} 元")
        return True


class PaymentFactory:
    gateways = {
        "alipay": AlipayGateway,
        "wechat": WechatGateway,
        "unionpay": UnionPayGateway,
    }

    @classmethod
    def get_gateway(cls, method: str) -> PaymentGateway:
        gateway = cls.gateways.get(method)
        if gateway is None:
            raise ValueError(f"不支持的支付方式: {method}")
        return gateway()

    @classmethod
    def register(cls, name: str, gateway_class):
        """注册新的支付方式 — 开闭原则"""
        cls.gateways[name] = gateway_class


# 使用
gateway = PaymentFactory.get_gateway("alipay")
gateway.pay(99.99)
```

### 优缺点

✅ 优点：解耦创建和使用、易于扩展（开闭原则）、统一管理对象创建
❌ 缺点：类数量增多、增加了一层抽象

## 总结

设计模式不是银弹，不要为了"用模式"而用模式。关键是在合适的场景选择合适的模式：

- **单例模式**：当你确实只需要一个实例时
- **工厂模式**：当创建逻辑复杂，或者需要根据参数动态决定创建哪个类时

记住：最简单的方案往往是好方案。如果一段简单的 `if/else` 能解决问题，就不需要引入工厂模式。'''),

    (1, 'HTTP 协议深入理解',
     '从请求报文到状态码，全面理解 HTTP 协议的工作机制。',
     '''## 前言

HTTP（HyperText Transfer Protocol）是互联网的基石。每天你在浏览器里打开的每一个页面，背后都有成百上千次 HTTP 请求。

作为 Web 开发者，深入理解 HTTP 协议是必备基本功。本文从报文结构到状态码，从缓存机制到 HTTPS，帮你构建完整的 HTTP 知识体系。

## HTTP 请求报文

一个典型的 HTTP 请求长这样：

```
POST /api/posts HTTP/1.1
Host: www.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...
User-Agent: Mozilla/5.0
Accept: application/json
Content-Length: 68

{"title": "Hello World", "category_id": 1, "content": "..."}
```

### 请求行

```
方法 路径 协议版本
POST /api/posts HTTP/1.1
```

### 请求头（Headers）

请求头是键值对形式的元数据，告诉服务器客户端的身份、期望的格式、能够接受的压缩算法等。

### 请求体（Body）

不是所有请求都有 Body（GET 和 HEAD 就没有）。POST/PUT/PATCH 通常携带 JSON 或表单数据。

## HTTP 方法

| 方法 | 语义 | 幂等性 | 安全性 | 是否有 Body |
|------|------|--------|--------|-------------|
| GET | 获取资源 | 是 | 是 | 否 |
| POST | 创建资源 | 否 | 否 | 是 |
| PUT | 全量替换 | 是 | 否 | 是 |
| PATCH | 部分更新 | 否 | 否 | 是 |
| DELETE | 删除资源 | 是 | 否 | 否 |
| HEAD | 获取响应头 | 是 | 是 | 否 |
| OPTIONS | 获取支持的请求方法 | 是 | 是 | 否 |

**幂等性**：多次执行相同请求，结果一致。GET 永远幂等，POST 不幂等（多次 POST 会创建多条记录）。

## HTTP 状态码

### 2xx — 成功

- `200 OK`：请求成功（GET/PUT/PATCH）
- `201 Created`：资源创建成功（POST）
- `204 No Content`：成功但没有返回体（DELETE 常见）

### 3xx — 重定向

- `301 Moved Permanently`：永久重定向（浏览器会缓存）
- `302 Found`：临时重定向
- `304 Not Modified`：资源未修改，使用缓存

### 4xx — 客户端错误

- `400 Bad Request`：请求格式有误
- `401 Unauthorized`：需要认证
- `403 Forbidden`：没有权限
- `404 Not Found`：资源不存在
- `422 Unprocessable Entity`：参数校验失败
- `429 Too Many Requests`：请求频率超限

### 5xx — 服务器错误

- `500 Internal Server Error`：服务器内部错误
- `502 Bad Gateway`：网关错误（Nginx 连不上后端）
- `503 Service Unavailable`：服务不可用（过载/维护）
- `504 Gateway Timeout`：网关超时

## HTTP 缓存机制

### 强缓存

浏览器不向服务器发请求，直接从缓存读取。

```http
# 响应头
Cache-Control: max-age=3600       # 缓存 1 小时
Cache-Control: no-cache           # 每次都要验证
Cache-Control: no-store           # 完全不缓存
Cache-Control: public, max-age=86400  # CDN 也可缓存
```

### 协商缓存

浏览器向服务器发请求验证缓存是否有效。

```http
# 请求头
If-None-Match: "abc123"           # ETag 验证
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT

# 响应头（内容未变）
HTTP/1.1 304 Not Modified
ETag: "abc123"
```

### 缓存策略建议

- HTML 文件：`Cache-Control: no-cache`（每次验证）
- CSS/JS 文件（带 hash）：`Cache-Control: public, max-age=31536000, immutable`
- API 响应：按数据更新频率设置不同的 max-age

## HTTPS 的工作原理

HTTPS = HTTP + TLS（Transport Layer Security）

### TLS 握手流程（简化）

1. **客户端 Hello**：发送支持的 TLS 版本、加密套件、随机数 C
2. **服务器 Hello**：选择加密套件、发送证书（含公钥）、随机数 S
3. **客户端验证**：验证证书有效性（CA 签名、域名匹配、有效期）
4. **密钥交换**：客户端生成 pre-master secret，用服务器公钥加密发送
5. **生成会话密钥**：双方用 C + S + pre-master secret 通过 PRF 生成对称密钥
6. **加密通信**：后续数据用对称密钥加密传输

### 为什么 HTTPS 是安全的？

- **加密性**：内容加密，中间人看不到明文
- **完整性**：消息认证码（MAC）防止数据被篡改
- **身份认证**：CA 证书体系验证服务器身份

## HTTP/1.1 vs HTTP/2 vs HTTP/3

| 特性 | HTTP/1.1 | HTTP/2 | HTTP/3 |
|------|----------|--------|--------|
| 传输层 | TCP | TCP | QUIC（UDP） |
| 多路复用 | 不支持 | 支持（Stream） | 支持（独立流） |
| 头部压缩 | 不支持 | HPACK | QPACK |
| 队头阻塞 | 有 | TCP 层仍有 | 基本消除 |
| 服务器推送 | 不支持 | 支持 | 支持 |

## 总结

HTTP 协议比你想象的更"深"。从一次简单的浏览器请求，到 TLS 握手、缓存策略、多路复用，每个环节都值得深入理解。建议至少通读一遍 MDN 的 HTTP 文档，配合 Chrome DevTools 的 Network 面板实践观察。'''),

    # ── 前端 (6篇) ──
    (4, 'Tailwind CSS 实战技巧',
     '掌握 Tailwind 的响应式设计、自定义主题和实用插件，高效构建 UI。',
     '''## 为什么选择 Tailwind CSS？

传统 CSS 开发有几个痛点：命名困难（BEM 很啰嗦）、样式分散、优先级混乱、文件间跳来跳去。Tailwind CSS 另辟蹊径——用原子类直接在 HTML 中描述样式，把"写 CSS"变成"组合类名"。

### 核心理念

```html
<!-- 传统方式 -->
<div class="card">
  <h2 class="card-title">标题</h2>
</div>
<!-- 然后去 CSS 文件里写 .card { ... } .card-title { ... } -->

<!-- Tailwind 方式 -->
<div class="rounded-2xl shadow-lg p-6 bg-white">
  <h2 class="text-xl font-bold text-gray-900">标题</h2>
</div>
<!-- 所见即所得，不需要切换文件 -->
```

## 响应式设计

Tailwind 的响应式断点遵循**移动优先**原则：

```html
<!-- 默认手机 → md:平板 → lg:桌面 -->
<div class="w-full md:w-1/2 lg:w-1/3">
  响应式卡片
</div>

<!-- 响应式导航 -->
<nav class="flex flex-col md:flex-row md:items-center md:justify-between">
  <div class="text-xl font-bold">Logo</div>
  <ul class="hidden md:flex md:gap-6">
    <li><a href="#">首页</a></li>
    <li><a href="#">关于</a></li>
  </ul>
</nav>
```

断点一览：`sm:640px` `md:768px` `lg:1024px` `xl:1280px` `2xl:1536px`

## 常用组件组合

### 卡片

```html
<div class="rounded-2xl shadow-lg bg-white overflow-hidden hover:shadow-xl transition-shadow">
  <img class="w-full h-48 object-cover" src="cover.jpg" alt="" />
  <div class="p-6">
    <span class="text-sm text-indigo-600 font-medium">技术</span>
    <h3 class="mt-2 text-xl font-bold text-gray-900">文章标题</h3>
    <p class="mt-2 text-gray-600 line-clamp-3">文章摘要内容...</p>
    <div class="mt-4 flex items-center gap-3">
      <img class="w-10 h-10 rounded-full" src="avatar.jpg" alt="" />
      <span class="text-sm text-gray-500">作者 · 2024-01-15</span>
    </div>
  </div>
</div>
```

### 按钮

```html
<button class="px-4 py-2 rounded-xl font-medium transition-all duration-200
               bg-indigo-600 text-white hover:bg-indigo-700
               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
               active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
  提交
</button>
```

### 表单

```html
<input type="text"
       class="w-full px-4 py-3 rounded-xl border border-gray-300
              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
              placeholder:text-gray-400 transition-colors"
       placeholder="请输入标题..." />
```

## 自定义主题

Tailwind 的 `tailwind.config.js` 让你可以定制一切：

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ]
}
```

## 实用技巧

### 1. group 和 group-hover

```html
<div class="group cursor-pointer">
  <h3 class="group-hover:text-indigo-600 transition-colors">标题</h3>
  <p class="group-hover:translate-x-1 transition-transform">描述</p>
</div>
```

### 2. peer 兄弟元素联动

```html
<label>
  <input type="checkbox" class="peer hidden" />
  <span class="peer-checked:bg-indigo-600 peer-checked:text-white px-4 py-2 rounded-xl border">
    选我
  </span>
</label>
```

### 3. 暗色模式

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  自动适配系统主题
</div>
```

### 4. 任意值语法

```html
<div class="w-[327px] h-[200px] bg-[#f5f5f5]">
  精确尺寸和颜色
</div>
```

## 总结

Tailwind 的学习曲线是先陡后平——刚开始会觉得"这 HTML 也太长了吧"，但用熟了之后，你会发现自己写 CSS 的速度提升了好几倍。配合组件封装（React/Vue），长类名的问题自然解决。建议打开官方文档，边做边查，一周就能上手。'''),

    (4, 'Vue 3 Composition API 入门',
     '学会 setup 语法糖、ref/reactive、watch/computed，快速上手 Vue 3。',
     '''## 从 Options API 到 Composition API

Vue 2 时代，我们用 Options API 组织代码：

```vue
<script>
export default {
  data() {
    return { count: 0, message: '' }
  },
  computed: {
    double() { return this.count * 2 }
  },
  methods: {
    increment() { this.count++ }
  },
  mounted() {
    this.message = 'Hello'
  }
}
</script>
```

这种方式在小项目中很清晰，但随着组件变复杂，问题出现了：**同一个功能的代码被分散在 data、computed、methods、watch 等不同选项中**，维护起来需要在文件里上下跳转。

Composition API 解决了这个问题——**按功能组织代码，而不是按选项类型**。

## setup 语法糖

Vue 3 推荐使用 `<script setup>`，代码更简洁：

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const message = ref('')

const double = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  message.value = 'Hello Vue 3!'
})
</script>

<template>
  <button @click="increment">
    {{ count }} × 2 = {{ double }}
  </button>
  <p>{{ message }}</p>
</template>
```

与 Options API 相比，少了 `this`、少了嵌套、少了样板代码。所有相关的逻辑可以自然地放在一起。

## ref vs reactive

这是新手最容易困惑的地方：

```vue
<script setup>
import { ref, reactive } from 'vue'

// ref：包装基本类型，访问需要 .value
const count = ref(0)
const name = ref('Vue')
count.value++  // 修改

// reactive：包装对象，直接访问属性
const state = reactive({
  user: { name: 'Alice' },
  posts: []
})
state.user.name = 'Bob'  // 直接修改，不需要 .value
</script>
```

**使用建议：**
- 基本类型（string, number, boolean）→ `ref`
- 对象/数组 → `reactive`（更自然）或 `ref`（统一用 `.value` 也可以）
- 实际项目中，很多人统一用 `ref`，保持一致性

## computed 计算属性

```vue
<script setup>
import { ref, computed } from 'vue'

const items = ref([
  { name: '苹果', price: 10, quantity: 2 },
  { name: '香蕉', price: 5, quantity: 5 },
  { name: '橙子', price: 8, quantity: 3 },
])

// 只读计算
const total = computed(() =>
  items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

// 可写计算
const keyword = ref('')
const filteredItems = computed(() =>
  items.value.filter(item => item.name.includes(keyword.value))
)
</script>
```

computed 会自动追踪依赖，只有依赖变化时才会重新计算。不要在里面做异步操作——那个应该用 `watch` 或 `watchEffect`。

## watch 和 watchEffect

```vue
<script setup>
import { ref, watch, watchEffect } from 'vue'

const keyword = ref('')
const page = ref(1)

// 精确监听
watch(keyword, (newVal, oldVal) => {
  console.log(`搜索词从 "${oldVal}" 变为 "${newVal}"`)
  page.value = 1  // 重置页码
  fetchData()
})

// 监听多个源
watch([keyword, page], ([newKeyword, newPage]) => {
  fetchData(newKeyword, newPage)
})

// 立即执行 + 自动追踪依赖
watchEffect(() => {
  // 自动追踪 keyword.value 和 page.value
  console.log(`正在搜索: ${keyword.value}, 第 ${page.value} 页`)
})
</script>
```

区别：`watch` 需要明确指定监听源，默认懒执行；`watchEffect` 自动追踪回调中的响应式依赖，立即执行。

## 组合函数（Composables）

Composition API 最大的好处是可以轻松抽取可复用逻辑：

```js
// composables/useFetch.js
import { ref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchData() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(url.value || url)
      data.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // url 变化时自动重新请求
  if (typeof url === 'object') {
    watchEffect(() => { url.value && fetchData() })
  } else {
    fetchData()
  }

  return { data, loading, error, refetch: fetchData }
}

// 使用
const { data: posts, loading, error } = useFetch('/api/posts')
```

## Props 和 Emits

```vue
<script setup>
// 定义 props
const props = defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
})

// 定义 emits
const emit = defineEmits(['update', 'delete'])

function handleClick() {
  emit('update', { title: props.title, count: props.count + 1 })
}
</script>
```

## 总结

Composition API 不是要替代 Options API——两者可以共存。但如果你开始新项目，强烈建议直接用 Composition API + `<script setup>`。它更灵活、更利于逻辑复用、TypeScript 支持也更好。从一个小功能开始，逐步感受它的魅力吧。'''),

    (4, 'CSS Grid 布局完全指南',
     '图解 Grid 容器属性与项目属性，轻松实现复杂二维布局。',
     '''## Grid vs Flexbox

很多开发者熟悉 Flexbox，但面对复杂布局时总觉得"差一点"。Flexbox 是一维布局系统（要么行，要么列），而 Grid 是真正的二维布局系统（行和列同时控制）。

**简单判断：**
- 只需要一排或一列的对齐 → Flexbox
- 需要同时控制行和列 → Grid
- 整体页面布局 → Grid
- 组件内部的小布局 → Flexbox

两者不是对立的，实际项目中经常混用：外层 Grid 做页面布局，内层 Flexbox 做组件排列。

## 基础概念

### Grid 容器与项目

```html
<div class="container">       <!-- Grid 容器 -->
  <div class="item">1</div>   <!-- Grid 项目 -->
  <div class="item">2</div>
  <div class="item">3</div>
</div>
```

## 容器属性

### 定义行列

```css
.container {
  display: grid;
  /* 3 列：各占 1 份 */
  grid-template-columns: 1fr 1fr 1fr;
  /* 等价于 */
  grid-template-columns: repeat(3, 1fr);
  /* 列间距 24px，行间距 16px */
  gap: 16px 24px;
}
```

`fr`（fraction）是 Grid 最强大的单位，表示"剩余空间的一份"。`1fr 2fr 1fr` 意味着中间列是两侧的两倍宽。

### 自适应列

```css
/* 每列最小 250px，最大 1fr，自动换行 */
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

/* 与 auto-fit 的区别：
   auto-fill：有空列也会保留
   auto-fit：拉伸已有项目填满空间 */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

### 隐式网格

```css
/* 超过定义行数的行，自动使用此高度 */
grid-auto-rows: minmax(100px, auto);
```

### 对齐方式

```css
.container {
  /* 项目在容器中的水平对齐 */
  justify-content: center;    /* start | end | center | space-between | space-around */

  /* 项目在容器中的垂直对齐 */
  align-content: center;

  /* 所有项目在单元格内的水平对齐 */
  justify-items: center;      /* start | end | center | stretch */

  /* 所有项目在单元格内的垂直对齐 */
  align-items: center;
}
```

## 项目属性

### 位置与跨度

```css
.item {
  /* 从第 1 条列线跨到第 3 条列线（占 2 列） */
  grid-column: 1 / 3;
  /* 等价写法 */
  grid-column: span 2;

  /* 从第 2 条行线跨到第 4 条行线（占 2 行） */
  grid-row: 2 / 4;
  grid-row: span 2;

  /* 简写 */
  grid-area: 2 / 1 / 4 / 3;  /* row-start / col-start / row-end / col-end */
}
```

### 单独对齐

```css
.item {
  justify-self: center;       /* 水平 */
  align-self: center;         /* 垂直 */
  /* 简写 */
  place-self: center;
}
```

## 经典布局实战

### 圣杯布局

```css
body {
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  grid-template-rows: 60px 1fr 50px;
  grid-template-areas:
    "header  header  header"
    "sidebar main    aside"
    "footer  footer  footer";
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }
```

### 响应式卡片网格

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* 手机上单列 */
@media (max-width: 640px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
```

### 居中一个元素

```css
/* Grid 版的居中（比 Flexbox 更简短） */
.parent {
  display: grid;
  place-items: center;  /* justify-items + align-items */
}
```

## Grid + Flexbox 混用示例

```html
<!-- 页面整体用 Grid -->
<div style="display: grid; grid-template-columns: 250px 1fr; gap: 24px;">

  <!-- 侧边栏用 Flexbox 纵向排列 -->
  <aside style="display: flex; flex-direction: column; gap: 16px;">
    <nav>导航项</nav>
    <nav>标签云</nav>
  </aside>

  <!-- 主内容区 -->
  <main style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px;">
    <!-- 卡片内部用 Flexbox -->
    <article style="display: flex; flex-direction: column; gap: 8px;">
      <img src="cover.jpg" alt="" />
      <h3>标题</h3>
      <p>描述</p>
    </article>
  </main>
</div>
```

## 总结

Grid 是现代 CSS 布局的基石。掌握 `grid-template-columns`、`fr` 单位、`minmax()` 和 `grid-area`，你就有了构建任何布局的能力。建议把常用的布局（圣杯、卡片网格、居中）写几遍，形成肌肉记忆。Chrome DevTools 的 Grid 可视化工具也非常好用，可以帮助你直观理解网格线。'''),

    (4, 'TypeScript 泛型高级用法',
     '深入理解泛型约束、条件类型、映射类型，写出类型安全的代码。',
     '''## 为什么需要泛型？

在 JavaScript 中，我们经常写这样的代码：

```typescript
function getFirst(arr: any[]): any {
  return arr[0];
}

const num = getFirst([1, 2, 3]);  // 类型是 any
num.toFixed(2);  // 没有类型提示，也不安全
```

用了泛型之后：

```typescript
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const num = getFirst([1, 2, 3]);  // 类型自动推断为 number
num.toFixed(2);  // ✅ 有完整的类型提示
```

泛型让你在定义函数、类、接口时**不预先指定具体类型**，而是在使用时再确定。它就像"类型的函数参数"。

## 基础泛型

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 泛型接口
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

type PostResponse = ApiResponse<Post>;
type PostsResponse = ApiResponse<Post[]>;

// 泛型类
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
const n = numStack.pop();  // number | undefined
```

## 泛型约束（extends）

有时候我们需要限制泛型参数必须满足某些条件：

```typescript
// 约束必须有 length 属性
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello");          // ✅ string 有 length
logLength([1, 2, 3]);        // ✅ array 有 length
logLength({ length: 10 });   // ✅
// logLength(123);            // ❌ number 没有 length
```

### keyof 约束

```typescript
// 确保 key 是对象的有效属性名
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const post = { title: "Hello", id: 1, category: "技术" };
getProperty(post, "title");    // ✅ 返回 string
getProperty(post, "id");       // ✅ 返回 number
// getProperty(post, "author"); // ❌ 编译错误！
```

## 条件类型

条件类型是 TypeScript 类型系统的"if 语句"：

```typescript
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;   // "yes"
type B = IsString<number>;   // "no"
type C = IsString<"hello">;  // "yes"
```

### 常用内置条件类型

```typescript
type T0 = Exclude<"a" | "b" | "c", "a">;           // "b" | "c"
type T1 = Extract<"a" | "b" | "c", "a" | "b">;     // "a" | "b"
type T2 = NonNullable<string | null | undefined>;   // string
type T3 = ReturnType<() => string>;                  // string
type T4 = Parameters<(a: string, b: number) => void>; // [string, number]
type T5 = Awaited<Promise<Promise<string>>>;          // string
```

### infer 关键字

`infer` 可以在条件类型中推断类型变量：

```typescript
// 提取 Promise 的返回值类型
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type T1 = Unwrap<Promise<string>>;   // string
type T2 = Unwrap<number>;            // number

// 提取数组元素类型
type ArrayElement<T> = T extends (infer U)[] ? U : T;

type T3 = ArrayElement<string[]>;    // string
type T4 = ArrayElement<number>;      // number
```

## 映射类型

基于已有类型创建新类型：

```typescript
// 内置映射类型
interface User {
  name: string;
  age: number;
  email: string;
}

type PartialUser = Partial<User>;     // 所有属性变为可选
type RequiredUser = Required<User>;   // 所有属性变为必填
type ReadonlyUser = Readonly<User>;   // 所有属性变为只读
type UserKeys = Pick<User, 'name' | 'email'>;  // 选取部分属性
type UserNoEmail = Omit<User, 'email'>;  // 排除部分属性
```

### 自定义映射类型

```typescript
// 所有属性变为可空
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// 所有属性加上 setter
type WithSetters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (val: T[K]) => void;
};

interface User {
  name: string;
  age: number;
}
type UserSetters = WithSetters<User>;
// { setName: (val: string) => void; setAge: (val: number) => void; }
```

## 实战：类型安全的 API 客户端

```typescript
// 定义 API 路径和响应类型的映射
interface ApiPaths {
  '/api/posts': Post[];
  '/api/posts/:id': Post;
  '/api/categories': Category[];
}

// 类型安全的请求函数
async function fetchApi<P extends keyof ApiPaths>(
  path: P,
  options?: RequestInit
): Promise<ApiResponse<ApiPaths[P]>> {
  const res = await fetch(path, options);
  return res.json();
}

// 使用时自动推断返回类型
const posts = await fetchApi('/api/posts');
// posts.data 类型是 Post[]

const post = await fetchApi('/api/posts/1');
// post.data 类型是 Post
```

## 总结

泛型是 TypeScript 的灵魂。从基础的 `<T>` 到条件类型和映射类型，每一步都是对"类型安全"的深化。学习路径建议：

1. 先在函数中尝试用 `<T>` 替代 `any`
2. 用 `extends` 给泛型加约束
3. 熟悉内置工具类型（Partial、Pick、Omit 等）
4. 再挑战条件类型和 infer
5. 最后读一些开源库的类型定义，看看大师们怎么用

不要试图一次性掌握所有——在写代码的过程中遇到 `any` 时，想想能不能用泛型替代，日积月累就熟练了。'''),

    (4, 'Next.js 服务端渲染原理',
     '了解 SSR、SSG、ISR 的区别，选择最适合的渲染策略。',
     '''## 什么是服务端渲染？

传统的 React 应用是 CSR（Client-Side Rendering）：浏览器收到一个几乎空的 HTML，然后 JavaScript 在客户端渲染整个页面。这导致两个问题：

1. **首屏白屏时间长**：用户需要等 JS 下载、解析、执行完才能看到内容
2. **SEO 不友好**：搜索引擎爬虫可能看不到 JS 渲染后的内容

SSR（Server-Side Rendering）在服务端就把 HTML 渲染好，浏览器收到的是完整的页面。Next.js 把这个过程变得极其简单。

## Next.js 的三种渲染模式

### SSR（Server-Side Rendering）

每次请求都在服务端渲染页面，适合个性化内容。

```typescript
// pages/posts/[id].tsx 或 app/posts/[id]/page.tsx
export default async function PostPage({ params }: { params: { id: string } }) {
  // 每次请求都会执行，获取最新数据
  const post = await fetch(`https://api.example.com/posts/${params.id}`, {
    cache: 'no-store'  // 禁用缓存，确保每次都获取最新数据
  }).then(res => res.json());

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
      <p>当前时间: {new Date().toLocaleString()}</p>
    </article>
  );
}
```

**适用场景：** 用户仪表盘、个性化推荐、实时数据页面。

### SSG（Static Site Generation）

构建时（`next build`）生成静态 HTML，访问速度最快。

```typescript
// 构建时生成所有文章页面
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json());
  return posts.map(post => ({ id: post.id.toString() }));
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await fetch(`https://api.example.com/posts/${params.id}`)
    .then(res => res.json());

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}
```

**适用场景：** 博客文章、文档页面、营销页面、产品介绍——内容不经常变化的页面。

### ISR（Incremental Static Regeneration）

结合 SSG 和 SSR 的优点：构建时生成静态页面，按需在后台重新生成。

```typescript
// App Router: 使用 revalidate
export const revalidate = 3600;  // 每小时最多重新生成一次

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await fetch(`https://api.example.com/posts/${params.id}`, {
    next: { revalidate: 3600 }  // 也可以在这里设置
  }).then(res => res.json());

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}
```

**适用场景：** 大多数内容页面——兼顾性能和内容新鲜度。

## 三种模式对比

| 特性 | SSR | SSG | ISR |
|------|-----|-----|-----|
| 生成时机 | 每次请求 | 构建时 | 构建时 + 按需 |
| 内容新鲜度 | 实时 | 需要重新构建 | 按 revalidate 间隔 |
| 首屏速度 | 中等 | 最快 | 最快 |
| 服务器压力 | 较高 | 几乎为零 | 极低 |
| SEO | 好 | 最好 | 最好 |
| 适合 | 个性化内容 | 静态内容 | 大多数页面 |

## App Router vs Pages Router

Next.js 13+ 引入了 App Router，带来重大变化：

```typescript
// Pages Router（旧）
// pages/posts/[id].tsx
export async function getStaticProps({ params }) {
  const post = await getPost(params.id);
  return { props: { post }, revalidate: 3600 };
}

// App Router（新）
// app/posts/[id]/page.tsx
export const revalidate = 3600;

export default async function PostPage({ params }) {
  const post = await getPost(params.id);
  return <PostContent post={post} />;
}
```

App Router 的核心改进：React Server Components（默认服务端组件）、流式渲染（Streaming）、更简洁的数据获取。

## React Server Components（RSC）

在 App Router 中，组件默认就是服务端组件：

```typescript
// 这是服务端组件 - 可以直接访问数据库
import { db } from '@/lib/db';

export default async function PostList() {
  const posts = await db.post.findMany();  // 直接查数据库，不需要 API！

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.summary}</p>
          <LikeButton postId={post.id} />  {/* 客户端组件 */}
        </li>
      ))}
    </ul>
  );
}

// 客户端组件 - 需要交互
'use client';
import { useState } from 'react';

function LikeButton({ postId }: { postId: number }) {
  const [liked, setLiked] = useState(false);
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'}
    </button>
  );
}
```

## 选择策略

```mermaid
graph TD
    A[页面内容] --> B{内容是否因人而异?}
    B -->|是| C[SSR]
    B -->|否| D{内容多久更新一次?}
    D -->|几乎不更新| E[SSG]
    D -->|定期更新| F[ISR - revalidate]
    D -->|实时| G{是否 SEO 重要?}
    G -->|是| C
    G -->|否| H[CSR 也可以]
```

## 总结

Next.js 给你一套完整的渲染策略工具箱。关键是选择合适的工具：

- 博客文章 → ISR（revalidate: 86400）
- 首页文章列表 → ISR（revalidate: 60）
- 用户个人中心 → SSR
- 关于页面 → SSG
- 后台管理 → CSR（不需要 SEO）

没有一种策略适合所有场景，好架构是各种策略的合理组合。'''),

    (4, 'Webpack 到 Vite：构建工具演进',
     '对比 Webpack 和 Vite 的开发体验，了解 ESM 原生支持的威力。',
     '''## 前端构建工具的演进

回顾前端构建工具的演进历程：

1. **Grunt/Gulp 时代（2013）**：任务运行器，手动配置文件处理流程
2. **Webpack 时代（2014-至今）**：一切皆模块，loader + plugin 体系
3. **Rollup 时代（2016）**：专注 ES Module 打包，适合库开发
4. **Vite 时代（2021-至今）**：基于 ESM 的开发服务器，秒级冷启动

## Webpack 的核心思想

Webpack 的核心是**一切皆模块**：JS、CSS、图片、字体统统是模块，通过 loader 转换，plugin 扩展。

```js
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.(png|jpg|gif)$/, type: 'asset/resource' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};
```

### Webpack 的痛点

- **冷启动慢**：项目大了之后，首次构建动辄 30-60 秒
- **HMR 慢**：改了代码要等 1-5 秒才能看到效果
- **配置复杂**：`webpack.config.js` 轻轻松松几百行

根本原因：Webpack 在开发时也要**先打包全部模块**，然后才启动 dev server。这就像每次改一个字就要重新印整本书。

## Vite 的革新

Vite 利用浏览器原生支持 ES Module（`<script type="module">`）这一特性，实现**按需编译**：

```
传统 Webpack：改文件 → 打包整个 bundle → 浏览器刷新
Vite：改文件 → 只编译这个文件 → 浏览器热更新这个模块
```

### 开发模式

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  resolve: {
    alias: { '@': '/src' },
  },
})
```

当你访问 `http://localhost:3000` 时：
1. Vite 返回一个 HTML，引用了 `/src/main.jsx`
2. 浏览器请求 `/src/main.jsx`
3. Vite 用 esbuild 即时编译这个文件并返回
4. 浏览器解析 import 语句，继续请求依赖
5. Vite 逐个编译并返回

结果是：**冷启动不到 1 秒**，无论项目多大。

### 生产构建

生产时 Vite 用 Rollup 打包，输出高度优化的产物：

```
vite build
# dist/
#   assets/
#     index-abc123.js    ← 代码分割
#     vendor-def456.js   ← 第三方库
#     index-ghi789.css
#   index.html
```

## 速度对比

| 指标 | Webpack 5 | Vite 5 |
|------|-----------|--------|
| 冷启动 | 30-60 秒 | <1 秒 |
| 热更新（HMR） | 1-5 秒 | <50 毫秒 |
| 首次构建 | 30-120 秒 | 15-45 秒 |
| 配置复杂度 | 较高 | 极低 |

## 从 Webpack 迁移到 Vite

### 1. 安装依赖

```bash
npm uninstall webpack webpack-cli webpack-dev-server
npm uninstall babel-loader css-loader style-loader # ...
npm install -D vite @vitejs/plugin-react
```

### 2. 创建 vite.config.js

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
})
```

### 3. 更新 index.html

把 `index.html` 从 `public/` 移到根目录，添加 script 标签：

```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
```

### 4. 更新 package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 常见问题

### Webpack 的 require.context 怎么替代？

```js
// Webpack
const modules = require.context('./modules', true, /\.js$/);

// Vite
const modules = import.meta.glob('./modules/**/*.js');
```

### 环境变量

```js
// Webpack: process.env.REACT_APP_API_URL
// Vite: import.meta.env.VITE_API_URL（必须 VITE_ 前缀）
```

## 总结

Vite 不是要革 Webpack 的命——在生产构建上，Rollup 和 Webpack 各有千秋。但在开发体验上，Vite 的按需编译 + ESM 原生支持是降维打击。如果你正在启动一个新项目，没有历史包袱，Vite 是最佳选择。如果你有一个庞大的 Webpack 项目，可以考虑渐进式迁移，或者等下一代构建工具（如 Turbopack、Rspack）更成熟后再做决定。'''),

    # ── 生活 (5篇) ──
    (2, '如何打造高效的工作环境',
     '从桌面布置到工具选择，打造一个让你专注工作的环境。',
     '''## 为什么工作环境重要？

你可能听过这句话："你的环境决定了你的行为"。对于每天坐在电脑前 8 小时以上的程序员来说，工作环境直接影响效率和健康。

我在过去两年里不断调整优化自己的桌面环境，从硬件到软件，从椅子到灯光。这篇文章分享我的经验和心得，希望能帮你打造一个舒适高效的工作空间。

## 桌面布置

### 显示器

双屏是程序员的基本配置，但摆放位置有讲究：

- **主显示器**：27 寸 4K，正对视线，写代码看文档
- **副显示器**：24 寸竖放（旋转 90°），看代码非常爽——一个屏幕能看到 150+ 行代码
- **笔记本**：放在支架上，合盖外接屏幕，或作为第三屏放聊天/终端

### 键盘

机械键盘是程序员的生产力工具：

- **红轴**：线性手感，按压力度轻，适合长时间编码（不吵到同事）
- **青轴**：段落感强，打字反馈好，但声音大（适合在家用）
- **茶轴**：介于红轴和青轴之间，中庸之选

推荐 75% 或 80% 配列——保留功能键和方向键，比 60% 实用，比全键盘省桌面空间。

### 座椅

人体工学椅可能是你最有价值的投资。每天坐 8 小时，一张好椅子比一台好显示器更重要。重点看：**腰部支撑**、**头枕**、**坐垫透气性**。预算有限的话，至少加一个腰靠。

### 桌面收纳

- 显示器支架：抬高屏幕，保护颈椎，下方还能放东西
- 理线器/理线槽：桌面干净，心情也好
- 台灯：推荐屏幕挂灯，不占桌面，照亮键盘区域

## 软件工具

### 编辑器：VS Code

主力编辑器，推荐必装插件：

- **GitHub Copilot**：AI 辅助编码，比你自己写还快
- **Prettier**：代码格式化，统一团队风格
- **ESLint**：代码质量检查
- **GitLens**：Git 历史可视化
- **Thunder Client**：轻量级 API 测试，替代 Postman
- **Error Lens**：行内显示报错信息

VS Code 主题推荐：One Dark Pro、Dracula、Catppuccin。字体用 **JetBrains Mono**（有连字符 ligature，`=>` 会变成箭头 ⟹ 非常好看）。

### 终端：Windows Terminal + Oh My Posh

Windows 用户推荐 Windows Terminal，配合 Oh My Posh 美化：

```powershell
# 安装 Oh My Posh
winget install JanDeDobbeleer.OhMyPosh

# 在 PowerShell 配置文件中添加
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/jandedobbeleer.omp.json" | Invoke-Expression
```

主题推荐 jandedobbeleer、atomic、night-owl。

### 笔记：Notion

用 Notion 管理一切：学习笔记、项目文档、读书笔记、个人目标。它的数据库功能特别强大，我用来做：

- **技术 Wiki**：记录学到的知识点，按分类整理
- **Bug 记录**：记录踩过的坑和解决方案
- **读书清单**：已读/想读/在读，附笔记

### 其他推荐

- **Everything**（Windows）：秒搜文件，比系统搜索快 100 倍
- **Snipaste**：截图 + 贴图，可以把截图钉在屏幕上
- **Ditto**：剪贴板管理，`Ctrl + `` 呼出历史记录
- **f.lux**：根据时间自动调节屏幕色温，保护眼睛

## 时间管理

### 番茄工作法

25 分钟专注 + 5 分钟休息，4 个番茄后休息 15-30 分钟。推荐工具：

- **Forest**：种树 App，25 分钟不碰手机种一棵树
- **Pomotroid**：桌面番茄钟，简洁美观

### 任务管理

- **早上第一件事**：写下今天要完成的 3 件最重要的事
- **深度工作时间**：上午 9-12 点设置为"勿扰模式"
- **沟通时间**：下午集中处理消息和会议

## 声音环境

- **白噪音**：下雨声、咖啡馆背景音、风扇声
- **Lo-Fi 音乐**：没有歌词的节奏音乐，适合编码
- **古典音乐**：巴赫、莫扎特、肖邦
- **降噪耳机**：Sony WH-1000XM 系列或 AirPods Pro，隔出一个安静世界

推荐网站/App：Noisli、Brain.fm、Lofi Girl（YouTube）

## 总结

打造高效工作环境是一个持续优化的过程，不需要一步到位。可以从一个显示器支架、一把好椅子、一个好用的笔记工具开始，逐步升级。记住：**最好的工具是让你忘记工具本身存在的工具**——它自然到你不觉得在"使用"它，只是专心做手头的事。'''),

    (2, '我的 2024 书单推荐',
     '分享今年读过的好书，涵盖技术、文学、哲学多个领域。',
     '''## 前言

2024 年读了一些书，有好有坏。从中挑出 10 本真心推荐的好书，涵盖技术、文学和思维三个方向。

阅读不应该是任务，不需要追求数量。一本好书，慢慢读、反复读，比囫囵吞枣十本更有价值。

## 技术类

### 1. 《代码整洁之道》— Robert C. Martin

读这本书之前，我以为写代码就是"能跑就行"。读完才明白：**代码是写给人看的，顺便给机器执行**。

几点印象深刻的教训：
- 函数应该短小（20 行以内最好）
- 有意义的命名比注释更重要
- 注释是失败的表达——好代码自己能说话
- DRY（Don't Repeat Yourself）原则

适合有一年开发经验的程序员阅读，太早读可能感触不深。

### 2. 《深入理解计算机系统》（CS:APP）— Bryant & O'Hallaron

计算机领域的"圣经"之一。从二进制到虚拟内存，从 CPU 流水线到网络编程，把计算机"抽象层"一层层剥开给你看。

建议不要通读（2000+ 页），挑重点章节精读：
- 第 3 章：程序的机器级表示
- 第 6 章：存储器层次结构
- 第 9 章：虚拟内存
- 第 11 章：网络编程

### 3. 《设计数据密集型应用》（DDIA）— Martin Kleppmann

分布式系统领域的必读书。如果你想从"会用 MySQL/Redis/Kafka"进阶到"理解它们的设计原理"，这本书是钥匙。

每一章都是独立的宝藏：
- 第 5 章：复制
- 第 6 章：分区
- 第 7 章：事务
- 第 8 章：分布式系统的麻烦
- 第 9 章：一致性与共识

## 文学类

### 4. 《百年孤独》— 加西亚·马尔克斯

重读这本书，与第一次的感觉完全不同。十年前读是"故事好神奇"，现在读是"人生好孤独"。

> "生命中曾经有过的所有灿烂，终究都需要用寂寞来偿还。"

布恩迪亚家族七代人的故事，每个人都在用自己的方式对抗孤独。马尔克斯用魔幻的笔触写了最真实的拉美历史，也写了每个普通人的一生。

### 5. 《活着》— 余华

一本让你又哭又笑的书。福贵的一生跌宕起伏，经历了太多失去，但他依然"活着"。

> "人是为了活着本身而活着，而不是为了活着之外的任何事物而活着。"

这本书会让你重新审视自己的人生——和福贵比，我们的烦恼也许根本不算什么。

### 6. 《小王子》— 圣埃克苏佩里

每个年龄段读《小王子》，都能读出不同的感悟。小时候觉得是童话，长大后发现是爱情，再大一些发现是人生。

> "只有用心才能看清，本质的东西用眼睛是看不见的。"

> "正是你为玫瑰花费的时间，才使你的玫瑰如此重要。"

## 思维与自我提升

### 7. 《思考，快与慢》— 丹尼尔·卡尼曼

诺贝尔经济学奖得主的杰作。大脑有两套思考系统：

- **系统 1**：快速、直觉、自动（容易出错）
- **系统 2**：缓慢、理性、费力（比较准确）

了解这两套系统的运作机制，能帮你识别认知偏差、做出更好的决策。做 code review 时用系统 2，别凭直觉说"这个没问题"。

### 8. 《原子习惯》— James Clear

小习惯带来大改变。核心理念：不要关注目标，关注**系统**。

- 如果你每天进步 1%，一年后你会进步 37 倍
- 习惯的四大法则：让它显而易见、有吸引力、简单易行、令人满足
- 身份认同 > 目标："我想成为什么样的人"比"我想达成什么目标"更有力量

我把这个方法用在了健身和学习上，效果显著。

## 总结

分享一句我很喜欢的话：

> "读书不是为了记住，而是为了在某个需要的时刻，那本书会在你脑海中浮现。"

如果只推荐一本，技术人读《设计数据密集型应用》，文学爱好者读《百年孤独》，想提升自己的读《原子习惯》。慢慢读，细细品。'''),

    (2, '健身半年的变化与心得',
     '坚持健身 6 个月，体重降了 8kg，分享我的训练计划和饮食方案。',
     '''## 为什么开始健身？

去年年底体检，报告上多了几行红字：轻度脂肪肝、体重超标、颈椎曲度变直。医生说："小伙子，该动一动了。"

那一刻我意识到，写代码写得再好，也换不来一个好身体。于是决心开始健身。

## 初始状态

- 身高：175cm
- 体重：78kg
- 体脂率：约 25%
- 体态问题：圆肩、头前倾（典型的"程序员体态"）
- 体能：爬 5 层楼喘得不行

## 训练计划

我选择的是**力量训练 + 有氧**结合的方式，每周 4 练：

### 周一：胸 + 三头肌

| 动作 | 组数 × 次数 | 要点 |
|------|-------------|------|
| 杠铃平板卧推 | 4 × 8-10 | 肩胛骨收紧，脚踩实地面 |
| 哑铃上斜卧推 | 3 × 10-12 | 上胸发力，顶峰停留 |
| 龙门架夹胸 | 3 × 12-15 | 手肘微屈，胸肌挤压 |
| 绳索臂屈伸 | 3 × 12-15 | 三头孤立发力 |

### 周二：背 + 二头肌

| 动作 | 组数 × 次数 | 要点 |
|------|-------------|------|
| 引体向上 | 4 × 力竭 | 先做最难的！ |
| 杠铃划船 | 4 × 8-10 | 背部收缩，不要靠手臂拉 |
| 高位下拉 | 3 × 10-12 | 挺胸，杆拉到锁骨 |
| 哑铃弯举 | 3 × 12-15 | 控制离心，下放要慢 |

### 周四：腿 + 肩

| 动作 | 组数 × 次数 | 要点 |
|------|-------------|------|
| 杠铃深蹲 | 4 × 8-10 | 核心收紧，膝盖不要内扣 |
| 哑铃推举 | 4 × 8-10 | 不要弓腰，核心稳定 |
| 侧平举 | 4 × 15-20 | 轻重量高次数，肌肉感受最重要 |
| 腿弯举 | 3 × 12-15 | 股二头肌发力 |

### 周五：全身 + 核心

- 硬拉 3 × 8（王牌动作，练全身）
- 平板支撑 3 × 力竭
- 悬垂举腿 3 × 15
- 30 分钟有氧（跑步或椭圆机）

每次训练前热身 10 分钟（动态拉伸 + 轻重量激活），练后拉伸 15 分钟。

## 饮食调整

**七分吃，三分练**——这句话是真理。我的饮食方案：

### 早餐（7:30）
- 燕麦 50g + 牛奶 200ml
- 水煮蛋 2 个
- 一个香蕉

### 午餐（12:00）
- 正常吃，但**少油、少碳水、多蛋白**
- 米饭量减半，换成粗粮更好
- 多夹蔬菜，先吃菜再吃饭

### 加餐（16:00）
- 蛋白粉一勺（训练日）
- 或者一小把坚果 + 一个苹果

### 晚餐（19:00）
- 鸡胸肉 150g（用空气炸锅，不加油也很好吃）
- 西兰花/菠菜等绿色蔬菜
- 红薯或玉米半根

### 戒掉的
- ✗ 奶茶/可乐（用无糖茶和白水替代）
- ✗ 薯片/辣条等零食
- ✗ 夜宵
- ✗ 外卖（自己做，控制油盐）

**Cheat Meal**：每周六晚上吃一次想吃的（火锅/炸鸡/蛋糕），这是长期坚持的关键——不能太苦行僧。

## 六个月的变化

| 指标 | 初始 | 现在 | 变化 |
|------|------|------|------|
| 体重 | 78kg | 70kg | -8kg |
| 体脂率 | ~25% | ~18% | -7% |
| 卧推 | 空杠 | 60kg |
| 深蹲 | 空杠 | 80kg |
| 引体向上 | 0 个 | 6 个 |

最重要的变化不是数字：
- 肩颈不再酸痛，体态明显改善
- 精力充沛，下午不再犯困
- 睡眠质量提升（以前入睡困难，现在沾枕头就睡）
- 对身体的感知能力变强（能感觉到哪块肌肉在发力）
- 自信心提升——不只是外貌，更是"我能掌控自己"的掌控感

## 给初学者的建议

1. **开始比完美重要**：不要等"准备好了"才开始，今天就动起来
2. **动作质量 > 重量**：小重量标准动作 > 大重量错误动作
3. **找个搭子**：互相监督，比一个人容易坚持十倍
4. **记录数据**：每周拍照、记录体重和围度，看到变化是最大的动力
5. **睡眠和饮食是训练的一部分**：不睡好练不好

## 总结

健身不是冲刺，是马拉松。六个月只是一个开始，但已经让我看到了完全不同的自己。如果你也在犹豫要不要开始——**去练就完了，未来的你会感谢现在的自己。**'''),

    (2, '一个人的旅行：成都到拉萨',
     '骑行 318 国道，22 天，2200 公里，一路风景一路歌。',
     '''## 为什么出发？

"想去西藏"这个念头在心里放了三年。每次看到别人发的 318 国道骑行照片，心里就痒痒的。去年终于下定决心，辞掉了那份干了三年但已经看不到成长的工作，背上包，跨上车，出发了。

很多人问我："一个人不害怕吗？"怕，但更怕的是十年后后悔自己为什么没有去。

## 准备工作

提前三个月开始准备：

### 体能训练
- 每天通勤骑行 15km → 周末 50km → 每月一次 100km+ 拉练
- 爬楼训练（20 层 × 5 趟，模拟爬山）
- 核心力量训练（长时间骑车腰背压力大）

### 装备清单
- **车辆**：捷安特 ATX 860 山地车（加装后货架和驮包架）
- **衣物**：冲锋衣 1 套、速干衣 3 件、骑行裤 2 条（海绵垫是救命的东西）
- **工具**：内胎 3 条、补胎工具、打气筒、六角扳手套装
- **药品**：红景天（提前一周开始吃）、感冒药、肠胃药、创可贴、碘伏
- **其他**：防晒霜 SPF50+、骑行手套（全指和半指各一副）、头盔、骑行眼镜

### 路线规划
川藏南线（G318）：成都 → 雅安 → 泸定 → 康定 → 新都桥 → 理塘 → 巴塘 → 芒康 → 左贡 → 八宿 → 波密 → 林芝 → 拉萨，全程约 2200 公里，计划 22-25 天完成。

## 最难忘的路段

### Day 3-4：折多山（海拔 4298m）
川藏线上第一座 4000 米以上的高山，也是我第一次体会到什么叫"高反"。骑到一半开始头痛、喘不上气，推着车走了好几公里。到达垭口那一刻，看到经幡在风中飘扬，眼泪差点掉下来——不是因为高反，是觉得自己真的能做到。

### Day 7：怒江 72 拐
从海拔 4658 米的业拉山口下到海拔 2740 米的怒江大桥，连续 40 公里的下坡。下坡超爽，但刹车片差点磨光，手捏刹车捏到抽筋。路上遇到一位 65 岁的大爷，他说这是他第五次骑川藏线了。五！次！

### Day 12：然乌湖
湖水蓝得不像是真的。在湖边坐了整整一个小时，什么也不想，就看着湖面和雪山。那一刻觉得——路上的所有辛苦都是值得的。

### Day 19：色季拉山遇见南迦巴瓦
南迦巴瓦峰终年被云雾笼罩，十人九不遇。我运气好，在垭口等了半小时后，云散开了，主峰露出来。夕阳打在雪山上，金光灿烂。旁边的藏族大叔说，能看见南迦巴瓦的人是有福气的。

## 路上的那些人

一个人的旅行，但并不孤独。路上遇到了很多同行者：

- **小杨**：大学刚毕业，gap year 骑行川藏，充满了生命力
- **老赵**：65 岁，退休教师，第五次骑 318，身体比很多年轻人还好
- **阿卓**：藏族小伙，从拉萨骑到成都再骑回去，一路上给我讲了很多藏族文化
- **骑行驿站老板**：每天晚上到驿站，总有一碗热腾腾的酥油茶等着

最感动的瞬间：某天在路边修车（刹车线断了），一个路过的牧民停下来，虽然语言不通，但他用肢体语言告诉我附近哪里有修车的地方。

## 到达拉萨

第 22 天，终于看到了布达拉宫。那天的天气格外好，蓝天白云，布达拉宫在阳光下闪着金光。

我在布达拉宫前的广场上坐了很久。这三周的旅程像放电影一样在脑海中闪过：爬过的山、路过的湖、遇见的人、流过的汗、喝过的酥油茶……

很多事情，我们不是做不到，只是不敢开始。一旦开始，路就在脚下。

## 实用建议

如果你也想骑行川藏线：

1. **最佳时间**：5 月-6 月（避开雨季）或 9 月-10 月（秋色最美）
2. **不要逞强**：累了就休息，高原骑行不是比赛
3. **防晒！防晒！防晒！** 高原紫外线不是闹着玩的
4. **学会修车**：至少会补胎、调刹车、修链条
5. **带现金**：很多地方只收现金
6. **买保险**：高原旅行意外险，为自己和家人负责

## 总结

有人说 318 国道是一条"身体下地狱，眼睛上天堂，灵魂回故乡"的路。经历过才知道，这句话一点不夸张。

这趟旅行改变了我很多：不再那么害怕未知，不再轻易说"我不行"，学会了和自己独处，也学会了感恩路上遇到的每一个人。

或许每个人的生命中都需要一次这样的旅行——独自上路，看陌生的风景，重新认识自己。'''),

    (2, '学会做 10 道家常菜',
     '从厨房小白到能做一桌菜，记录我的烹饪学习之路。',
     '''## 从零开始的厨房之旅

作为一个以前只会泡面和煮速冻水饺的程序员，学会做饭是我今年最大的"非技术"成就。

起因很现实：外卖吃腻了（而且贵），体检结果不太理想（外卖油盐太重），加上疫情封控期间出不了门——于是下决心学做饭。

半年时间，从炒鸡蛋都会糊，到能独立做一桌菜招待朋友。这篇文章分享我的 10 道"招牌菜"和学习心得。

## 入门三道菜（零失败率）

### 1. 西红柿炒鸡蛋

**国民第一菜，但做好不容易。**

关键技巧：
- 鸡蛋加几滴水搅匀，炒出来更嫩
- 先炒鸡蛋，八分熟盛出，不要炒老
- 西红柿切小块，中火炒出汁，加点番茄酱提味
- 最后鸡蛋倒回锅中，30 秒拌匀就出锅

### 2. 酸辣土豆丝

**考验刀功的第一课。**

关键技巧：
- 土豆切丝后泡水（去淀粉，炒出来才脆）
- 大火快炒，从下锅到出锅不超过 2 分钟
- 醋分两次放：锅边淋醋增香，出锅前再加一点提酸
- 干辣椒和花椒先爆锅，香味翻倍

### 3. 可乐鸡翅

**零失败的新手福音。**

关键技巧：
- 鸡翅提前用料酒、姜片、生抽腌制 20 分钟
- 先煎至两面金黄（锁住肉汁）
- 可乐没过鸡翅即可，不需要太多
- 中火焖 15 分钟，大火收汁
- 出锅前撒白芝麻

## 进阶三道菜（有挑战但值得）

### 4. 红烧排骨

**炒糖色是关键。**

步骤：
1. 排骨冷水下锅焯水，加料酒姜片去腥，捞出冲净
2. 锅里放油 + 冰糖，小火慢炒，炒到枣红色冒泡
3. 立刻倒入排骨翻炒上色（这一步手速要快，糖色过了会发苦）
4. 加生抽、老抽、料酒、八角、桂皮、香叶
5. 加水没过排骨，大火烧开转小火，焖 40 分钟
6. 大火收汁，汤汁浓稠即可

### 5. 清蒸鲈鱼

**大道至简，食材新鲜最重要。**

步骤：
1. 鲈鱼洗净，两面划几刀，塞入姜片
2. 水开后上锅，大火蒸 8 分钟（时间精确！久了肉老）
3. 倒掉盘中蒸出的腥水
4. 铺上葱丝、姜丝、红椒丝
5. 淋上蒸鱼豉油
6. 烧一勺热油，浇在葱丝上——"滋啦"一声，香味炸开

### 6. 麻婆豆腐

**灵魂是豆瓣酱和花椒粉。**

步骤：
1. 嫩豆腐切小块，焯水（水里加盐，豆腐不容易碎）
2. 锅中油热，下肉末炒至酥香
3. 加豆瓣酱炒出红油（一定要炒够时间，不够红油出不来）
4. 加姜蒜末爆香
5. 加适量水，放入豆腐，轻轻推匀（不要翻！豆腐会碎）
6. 小火煮 3-5 分钟入味
7. 水淀粉勾芡，出锅前撒花椒粉和葱花

正宗麻婆豆腐要"麻辣烫香酥嫩鲜"七味俱全。

## 快手三道菜（工作日 30 分钟搞定）

### 7. 蒜蓉西兰花
焯水 1 分钟，蒜末爆香，翻炒 2 分钟，加盐出锅。简单健康。

### 8. 青椒肉丝
猪肉切丝 + 淀粉 + 料酒腌制。先滑肉丝盛出，再炒青椒，最后合炒调味。全程 15 分钟。

### 9. 紫菜蛋花汤
水烧开，紫菜撕碎放入。鸡蛋打散，转圈淋入沸水中。加盐、香油、葱花。3 分钟搞定。

## 一道硬菜（朋友来了露一手）

### 10. 大盘鸡

**西北风味，分量霸气。**

步骤：
1. 鸡腿剁块焯水备用，土豆切滚刀块
2. 热油炒糖色，下鸡块翻炒上色
3. 加豆瓣酱、干辣椒、花椒、八角、桂皮爆香
4. 加啤酒（不是水！）没过鸡肉，大火烧开
5. 加土豆块，转中火焖 20 分钟
6. 加青红椒块，再焖 5 分钟
7. 出锅前加蒜末和香菜

搭配宽面或馕，汤汁拌饭也是一绝。

## 学习心得

1. **看视频比看菜谱管用**：B 站美食区是最好的老师（王刚、美食作家王刚、日食记）
2. **先模仿再创新**：把经典做法做熟了再自由发挥
3. **装备不用多**：一口好用的炒锅 + 一把趁手的菜刀，足以应对 80% 的菜
4. **火候 > 调料**：学会判断火候是进阶的关键
5. **买菜选时令**：食材好，菜就好吃了一半
6. **做饭是很解压的事**：写了一天代码，切菜、炒菜、装盘，是很好的"数字排毒"

## 总结

从前觉得做饭是浪费时间，现在发现做饭是最好的放松。当葱姜蒜在热油中爆出香味，当朋友吃着我做的菜竖起大拇指，那种成就感不亚于代码完美跑通。

如果你也一直是"外卖党"，建议从一道最简单的菜开始——比如西红柿炒鸡蛋。做好一道菜，你就会想做第二道、第三道。不知不觉，厨房就成了家里最温暖的地方。'''),

    # ── 随笔 (5篇) ──
    (3, '程序员的 35 岁危机真的存在吗',
     '关于年龄焦虑，我有一些不同的看法。',
     '''## 焦虑的来源

"程序员 35 岁以后怎么办？"——这个问题几乎是每个技术论坛的月经帖。脉脉上不时有"35 岁被裁，找不到工作"的帖子，底下一堆人焦虑附和。

我也曾被这种焦虑困扰过。但工作越久，接触的人越多，我越来越觉得：**35 岁被淘汰的不是年龄，而是能力停滞。**

## 我观察到的 35+ 优秀程序员

我合作过不少超过 35 岁的程序员，目前也和一些 35+ 的同事共事。观察下来，那些越老越吃香的程序员，都有以下共同点：

### 1. 持续学习，不固守一种技术

```

他们不会说"我只会 Java/只会后端"。新技术出来，他们会去了解、去尝试，判断这个技术解决了什么问题，在什么场景下值得用。

比如大模型火了之后，我身边一位 38 岁的架构师第一时间去学了 LangChain 和 RAG，现在已经在公司内部落地了 AI 客服系统。

### 2. 有业务理解能力

初级程序员等需求，中级程序员做需求，高级程序员**挑战需求**。

优秀的 35+ 程序员不只是"接需求写代码"——他们能理解业务痛点，能和技术方、产品方、业务方有效沟通，能推动事情落地。这些能力是时间和经验积累出来的，不是刷 LeetCode 能学会的。

### 3. 能带人、能沟通

技术强是一回事，能把自己的技术复制给团队是另一回事。一个能带 5 个人的技术专家，比 5 个各自为战的程序员更有价值。

做 Code Review 不只是挑毛病，而是教思考方式；写文档不只是完成 KPI，而是沉淀团队知识。

## 为什么会有"35 岁危机"的说法？

客观地说，这个说法不完全是无稽之谈。原因有几个：

### 1. 互联网泡沫期的高薪惯性

2014-2020 年，互联网行业疯狂扩张，很多程序员享受着远超能力价值的高薪。泡沫退去后，公司发现：花 80 万年薪请的资深工程师，产出不一定比得上两个 25 万年薪的年轻人。

### 2. 确实有人在"吃老本"

有些人在前几年靠着一门技术（比如某个框架）拿到了高薪，然后停止了学习。5 年过去了，除了年限，能力和 3 年经验的开发者没有差别。这样的"高薪低能"确实会被淘汰——但淘汰的是能力，不是年龄。

### 3. 国内企业的管理文化

部分国内企业倾向于"堆人"而不是"提升效率"，更喜欢能加班的年轻人。但这个问题正在改善——越来越多的公司意识到，一个资深工程师顶 5 个初级工程师。

## 我的建议

如果你正在焦虑 35 岁危机，与其焦虑，不如行动：

### 每年学一门新语言或新框架
不是为了跳槽，而是为了打开视野。不同语言和框架的设计哲学不同，能帮你建立更全面的技术观。

### 多关注系统设计和架构
业务代码写多了，容易陷入 CRUD 的重复中。尝试理解你所用框架背后的设计原理，理解分布式系统的 trade-off，理解架构决策的上下文。

### 培养软技能
- **写作**：写博客、写文档、写技术方案
- **表达**：能在 5 分钟内把一个技术问题讲清楚
- **管理**：不一定做管理岗，但要有"把事做成"的能力
- **英语**：技术领域的好资料 90% 是英文的

### 建立个人品牌
- 写博客（你正在看这篇文章，这就是我的个人品牌建设）
- 在 GitHub 上贡献开源项目
- 在技术社区分享和答疑
- 参加技术会议做分享

## 换个角度看

一个行业的成熟度，看它如何对待年长的从业者。

医生越老越吃香，因为经验值钱。律师、建筑师也是如此。软件工程作为一个年轻的行业，正在经历这个成熟过程。当行业逐渐认识到——写代码不只是搬砖，经验和判断力是有价值的——35 岁以上的优秀程序员会越来越被认可。

## 总结

35 岁危机存在吗？对停止学习的人，存在。对持续成长的人，不存在。

与其担心 35 岁被裁，不如想想如何让自己在 35 岁时拥有不可替代的价值。年龄不是问题，能力停滞才是。**保持好奇心，保持学习力，保持"我不知道，但我想搞明白"的态度**——这不仅是对抗焦虑的方法，也是做好任何事情的底层逻辑。'''),

    (3, '为什么我选择写博客',
     '坚持写作两年，说说博客给我带来的改变。',
     '''## 开始的契机

两年前的一天，我在项目里踩了一个很坑的 bug，花了整整一个下午才解决。当时就想："这个问题网上居然没有中文资料，我得把它记下来，帮后面的人省点时间。"

于是写了第一篇博客文章。写得磕磕绊绊，排版乱七八糟，但发出去之后，居然收到了一条评论："谢谢，帮了大忙！"

那种感觉——怎么说呢——爽。

## 写作的四大收获

### 1. 加深理解：能写清楚才是真的懂

以前学新技术，看完文档觉得"我懂了"，但真正开始写的时候发现——很多细节根本说不清楚。

写作是一个"发现自己其实不懂"的过程。为了把一篇 Docker 教程写清楚，我反复看了官方文档、读了源码、做了各种实验。写完那篇文章之后，我对 Docker 的理解上升了一个层次。

**教是最好的学。** 这句话在写作中体现得淋漓尽致。

### 2. 建立个人品牌：博客是最好的简历

我的博客没有大流量，每个月也就几千 UV。但就是这么一个"小破站"，给我带来了：

- 一次面试邀请（面试官说"看了你的博客，觉得你对技术有热情"）
- 两次技术分享邀约（技术社区看到我的文章后联系我的）
- 几个志同道合的朋友（通过评论和邮件交流认识的）

博客就像一张 24 小时在线的名片。你不用主动推销自己，好的内容会帮你说话。

### 3. 连接同好：认识了很多不错的人

写了两年博客，最大的意外收获是社群。

有人通过我的 RSS 订阅了我的博客，每篇必读；有人发邮件和我讨论技术细节，一来二去成了朋友；有人把我的文章翻译成了日语和韩语……这些都是如果没有博客永远不会发生的事。

互联网最美好的地方是——你可以通过内容连接到那些和你频率相同的人，无论他们在地球的哪个角落。

### 4. 被动收入：虽然不多，但很开心

在博客上放了 Google AdSense，后来也接过几次技术产品的推广。说实话，收入不多，一个月几十美元，还不够一顿大餐。

但这种"睡后收入"的感觉很奇妙——你两年前写的一篇文章，到现在还在为你赚钱。更重要的是，它证明了你的内容有价值。

## 坚持的秘诀

很多人问我："你怎么坚持写了两年的？我也想写，但总是坚持不下来。"

### 1. 不追求完美，先写出来再改

完美主义是写作最大的敌人。你的第一稿不需要完美，甚至在发布之后你还可以继续修改。

记住：**一篇不完美的文章，比一个完美的"草稿箱"好一百倍。**

### 2. 写自己真正感兴趣的内容

不要为了流量去写"大家都在看"的热点——那种文章你写起来痛苦，写完了也没有成长。写你真正想搞清楚的东西。热情是会传递的，读者能感受到。

### 3. 固定节奏，但不强迫自己

我给自己定的是"每周一篇"，但如果某周实在太忙，就不硬撑。宁缺毋滥——一篇好文章比十篇水文更有价值。

### 4. 建立写作流程

我的写作流程：
1. 积累选题（平时有灵感就记在 Notion 里）
2. 周末花 2 小时写初稿
3. 隔一天再读一遍（你会发现很多问题）
4. 修改、加图、排版
5. 发布

## 写什么？

如果你也想开始写博客但不知道写什么，给你一些方向：

- **踩坑记录**：今天你花了一个小时解决的 bug，写下来就能帮到别人
- **学习笔记**：刚学完一个新技术，边学边记，整理成教程
- **读后感**：读完一本好书，写写你的思考和笔记
- **技术对比**：A 和 B 有什么区别？什么时候用哪个？
- **实战经验**：项目中学到的经验教训

## 总结

写了两年博客，回头看，最大的受益者不是读者，是我自己。

通过写作，我把碎片化的知识变成了体系化的理解，把"以为自己懂"变成了"真的懂"，也从一个小透明变成了在圈子里有一点点名字的人。

如果你还在犹豫要不要开始——**开始写吧**。不需要完美的平台，不需要漂亮的主题，不需要很多的读者。GitHub Issues、语雀、Notion、掘金……随便选一个，写下你的第一篇文章。

写得不好没关系，下一篇会更好。重要的是——**开始，然后坚持。**'''),

    (3, '深夜 coding 的利与弊',
     '夜深人静时写代码效率翻倍，但代价是什么？',
     '''## 深夜的魔力

凌晨一点，万籁俱寂。房间里只有键盘的敲击声和显示器的微光。没有 Slack 消息、没有会议邀请、没有人在你耳边问"这个需求什么时候能上线"。

世界安静得只剩下你和代码。

这种感觉，每一个深夜 coding 过的程序员都懂。

## 为什么深夜 coding 效率高？

### 1. 完整的连续时间

白天的工作时间被各种事情切得支离破碎：站会、code review、同事的问题、产品经理的"紧急需求"……每 30 分钟就被打断一次，刚进入状态就被拉出来。

深夜不一样。你可以连续 3-4 个小时不受干扰地沉浸在代码中。这种"心流"状态是高质量工作的保证。

### 2. 大脑更清醒？

听起来反直觉——深夜明明应该困了。但很多程序员发现，晚上 10 点之后反而比下午更清醒。

一个可能的解释是：有些人天生是"夜猫子"（生物钟偏向晚睡型）。另一个原因是——夜晚的安静降低了大脑的认知负荷，让你能更专注。

### 3. 没有"被催促"的压力

白天写代码时，总觉得背后有人在等。晚上没有这种压力——你可以从容地尝试不同的方案，可以重构，可以写测试，可以做那些"不急但很重要"的技术优化。

## 深夜 coding 的代价

上面说的都是好处，现在说说代价——**这部分更重要**。

### 1. 睡眠债是最昂贵的技术债

熬夜一次，第二天精神差。连续熬夜，形成恶性循环：白天效率低 → 只能晚上加班赶进度 → 继续熬夜 → 白天效率更低。

研究表明，长期睡眠不足对认知能力的影响相当于醉酒。你以为深夜写的代码很厉害，第二天回看——"这谁写的？"

### 2. 健康影响是累积的

- **心血管**：长期熬夜增加心脏病和中风风险
- **代谢**：熬夜会导致激素紊乱，更容易发胖
- **免疫**：熬夜降低免疫力，更容易生病
- **皮肤**：黑眼圈、长痘、加速衰老

这些影响不是一天两天能感受到的，但它们在累积。你今天熬的夜，十年后身体会还给你。

### 3. 失去了生活

深夜是家人朋友相处的时间。如果每天晚上都关在房间里写代码，你可能会失去很多重要的东西——和伴侣的聊天、陪孩子的时间、和朋友的聚会。

代码可以明天再写，但这些时刻不会重来。

## 我的尝试：从夜猫子到早起鸟

深夜 coding 了一个月后，发现自己状态越来越差。于是尝试了一个改变：**从深夜 coding 变成早起 coding**。

### 新的作息

- 晚上 11:00：放下手机，准备睡觉
- 早上 6:00：起床，洗漱，喝一杯温水
- 6:30 - 8:30：专注 coding 2 小时（这段时间同样安静！）
- 9:00：正常上班

### 效果如何？

试了两周之后，我发现自己：
- 精神明显变好（睡够了就是不一样）
- 早晨的工作效率完全不输深夜（同样是没有人打扰的时间段）
- 晚上可以和家人朋友正常相处（不用再"等我把这个写完"）
- 皮肤变好了（女同事问我用了什么护肤品……其实就是不熬夜）

### 为什么早起比熬夜好？

同样的 2 小时，早起的意义不同：
- 深夜：你已经累了，是在**透支**
- 清晨：你睡饱了，是在**投资**

## 实在避免不了熬夜怎么办？

有时候 deadline 压着，熬夜在所难免。这时候尽量"有策略地熬夜"：

1. **提前睡觉**：比如晚上 9 点先睡 2 小时，11 点起来工作（比直接熬到凌晨好）
2. **分段式**：工作 25 分钟，强制休息 5 分钟（番茄工作法）
3. **控制频率**：每周最多熬夜 1-2 次，不要连续两天
4. **第二天补觉**：中午小睡 20 分钟，晚上早睡
5. **吃好喝好**：熬夜时别吃泡面零食，吃水果、坚果；多喝水

## 总结

深夜 coding 是一把双刃剑。偶尔享受那种沉浸感是美好的，但**不要把熬夜当成常态**。

有一段话我很喜欢：

> "编程是一场马拉松，不是短跑。你今天写的任何一行代码，都不值得用你的健康去换。"

试试早起 coding 吧。凌晨 6 点，天刚蒙蒙亮，冲一杯咖啡，坐下来写代码——那种感觉，和深夜一样美好，而且不伤身体。'''),

    (3, '关于 AI 取代程序员的思考',
     'Copilot 和 ChatGPT 让编程门槛降低，我们该何去何从？',
     '''## 这个问题的热度

2023 年以来，"AI 会取代程序员吗"成了技术圈最热的话题。每次新的 AI 编程工具发布，这个话题就被重新点燃一次。

Devin 发布时，有人说"程序员的末日到了"。Cursor 火起来后，又有人说"以后不需要会写代码了"。

作为一个每天使用 AI 工具（GitHub Copilot + ChatGPT/Claude）的程序员，我想聊聊自己的真实感受。

## AI 编程工具现状

### GitHub Copilot

我用了一年多 Copilot，它已经成了我编码的"肌肉记忆"：

- 写注释，它能自动生成函数体
- 写测试用例，它比我还快
- 写样板代码（CRUD、表单验证、错误处理），基本不用手打了

但 Copilot 也会犯错：它会"编造"不存在的 API、会写出看似正确但逻辑有 bug 的代码、会在你不注意的时候引入安全漏洞。

### ChatGPT / Claude

对于复杂问题（"帮我设计一个分布式锁的方案"、"解释这段正则表达式"），大语言模型非常有用。它是很好的"结对编程伙伴"——随时可以 bounce ideas。

但同样的问题：它会自信满满地给出错误的答案。你必须自己判断它说的对不对。

## AI 能做什么？

客观来说，AI 确实能替代一些编程工作：

- ✅ 自动补全代码（Copilot 已经很好用了）
- ✅ 生成样板代码（CRUD 接口基本不用手写）
- ✅ Bug 修复建议（有时候比 Google 快）
- ✅ 代码解释和文档生成
- ✅ 简单的单元测试生成
- ✅ SQL 查询编写和优化建议

## AI 不能做什么？

但 AI 在很多方面还远远不够：

### 1. 理解复杂业务逻辑

AI 擅长的是模式匹配，不是理解。它能生成"根据用户 ID 查询订单"的代码，但无法理解"这个业务场景下为什么需要分两步查询订单状态"。

真正的业务逻辑往往充满了 if/else/特殊情况，这些"特殊情况"来自你对业务的理解，不是来自训练数据。

### 2. 做出架构级别的决策

"应该用 Redis 还是数据库触发器实现这个功能？""微服务拆分的粒度应该是什么？""这个技术选型对团队招聘有什么影响？"

架构决策需要权衡（trade-off），需要考虑人、团队、成本、时间、风险——AI 做不了这种综合判断。

### 3. 与人有效沟通

程序员的工作不只是写代码。你还需要：
- 和产品经理讨论需求的合理性
- 和设计师沟通交互方案的可行性
- 和测试同事解释技术方案的边界
- 在 code review 中给同事提建设性意见
- 写技术文档让其他人理解你的设计

AI 在这些方面完全帮不上忙。

### 4. 对代码质量和可维护性负责

AI 能生成代码，但它不负责。出了问题，你得自己 debug、自己修、自己背锅。

对于代码的长期可维护性——"这段代码半年后别人能不能看懂""这个设计是不是过度抽象了"——AI 没有这种判断力。

## 我的判断

**AI 不会完全取代程序员，但会用 AI 的程序员会取代不会用的。**

这句话像是一句正确的废话，但仔细想想：

- 用 AI 的程序员，写样板代码的时间节省 50%，专注于更有价值的架构和业务
- 不用 AI 的程序员，还在手写 getter/setter、还在手动写 CRUD

一年下来，差距是显著的。

## 我们该做什么？

### 1. 把 AI 当工具，不当威胁

害怕 AI 取代你，不如学会使用它。把 Copilot 当成"超级自动补全"，把 ChatGPT 当成"随时随地可用的技术顾问"。

### 2. 提升不可替代的能力

AI 不擅长的事情，恰恰是你应该重点发展的：
- **系统设计**：理解架构、trade-off、设计模式
- **业务理解**：不是等需求，而是理解需求为什么这样
- **沟通协作**：跨团队推动事情落地的能力
- **技术判断**：什么该做、什么不该做、什么先做、什么后做

### 3. 保持学习，不焦虑

每次技术革命都会淘汰一些人，但也会创造新的机会。AI 降低的是"写代码"的门槛，提升的是对"理解问题"能力的要求。

工具在变，底层原理不变。计算机科学的基础知识——数据结构、算法、网络、操作系统——比任何一个框架都更保值。

## 未来的程序员

我猜未来程序员的工作会变成这样：

- **AI 生成 80% 的代码**（样板、CRUD、测试）
- **人写 20% 的关键代码**（核心逻辑、架构决策）
- **人的主要工作是**：理解业务、设计方案、审查 AI 生成的代码、保证质量

程序员更像是一个"AI 的指挥者"——告诉 AI 要做什么、检查 AI 做得对不对、在关键节点亲自动手。

## 总结

蒸汽机没有淘汰工人，但改变了工人的工作方式。内燃机没有淘汰马车夫，但让会开汽车的人赚到了钱。

AI 也是一样。它不会淘汰所有程序员，但会改变程序员的工作方式。**拥抱变化，保持学习，提升不可替代的能力**——这不仅是应对 AI 的策略，也是成为一个更好程序员的路径。'''),

    (3, '从一个 Bug 学到的教训',
     '一个简单的缩进错误让我 debug 了 3 个小时，记录这次惨痛经历。',
     '''## 事发经过

那天下午，我像往常一样写一个 Flask API 接口。需求很简单：接收一个 POST 请求，解析 JSON 数据，写入数据库，返回结果。

写完代码，启动服务器，用 Postman 测试——**所有 POST 请求都返回 500 Internal Server Error**。

我心想："小事，肯定是哪里写错了。" 没想到这个"小事"花了我 3 个小时。

## Debug 过程

### 第一步：检查请求体（30 分钟）

以为是请求格式有问题。反复检查 JSON 格式、Content-Type 头、body 是不是空的……一切正常。

用 curl 直接请求，还是 500。

### 第二步：检查数据库连接（30 分钟）

怀疑数据库挂了。检查连接字符串、测试数据库连通性、查看数据库日志……数据库好好的。

GET 请求正常返回数据，说明数据库没问题。问题一定在 POST 的处理逻辑里。

### 第三步：添加 print 调试（1 小时）

在代码里加了 10 个 `print("到达此处")` 的调试语句。但日志里**什么都没有输出**。

这就很奇怪了——说明代码根本没执行到那些地方。

### 第四步：逐行注释代码（30 分钟）

把处理逻辑一行一行注释掉，想找到是哪一行出的问题。

注释了 20 行之后发现……还是 500。这太诡异了。

### 第五步：找到真正的 Bug

最后决定仔细检查 try/except 块。在一个不起眼的角落，我看到了它：

```python
try:
    data = request.get_json()
    # ... 后续处理逻辑
except:
    pass  # ← 就是这个 pass！
```

一个**裸 except + pass**，吞掉了所有异常。

## 问题分析

这个裸 `except: pass` 做了什么？它告诉 Python："不管发生什么错误，当作什么都没发生，继续执行。"

结果是：

1. `request.get_json()` 因为某个原因（后来发现是 request body 已经被某个中间件消费了）抛出了异常
2. 异常被 `except: pass` 静默吞掉
3. `data` 变量没有被正确赋值，仍然是 `None` 或者未定义
4. 后续代码试图使用 `data` 时出错了
5. 但这个错误又被外层的 try/except 捕获了
6. 因为所有日志都被吞掉了，我完全不知道发生了什么

## 教训

### 1. 永远不要写裸 except

裸 except 会捕获**一切**异常，包括 `KeyboardInterrupt`（Ctrl+C）和 `SystemExit`——这些你通常不想捕获。

至少写明你要处理什么异常：

```python
try:
    data = request.get_json()
except ValueError:  # 只捕获你预期的异常
    data = {}
```

### 2. 永远不要 except: pass

异常被静默吞掉 = 你失去了所有排查问题的线索。如果你不得不捕获异常（虽然你应该尽量避免），至少：

```python
except Exception as e:
    # 记录日志！
    logger.error(f"解析请求数据失败: {e}", exc_info=True)
    # 或者返回有意义的错误信息
    return jsonify({"error": "请求格式错误"}), 400
```

### 3. 异常处理的最佳实践

```python
# ✅ 好的异常处理
@app.route('/api/posts', methods=['POST'])
def create_post():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "请求体为空"}), 400

        title = data.get('title')
        if not title:
            return jsonify({"error": "标题不能为空"}), 400

        post = Post(title=title, content=data.get('content', ''))
        db.session.add(post)
        db.session.commit()

        return jsonify(post.to_dict()), 201

    except ValidationError as e:
        # 预期的错误，返回友好提示
        return jsonify({"error": str(e)}), 422

    except Exception as e:
        # 非预期错误，记录详细日志
        app.logger.error(f"创建文章失败: {e}", exc_info=True)
        return jsonify({"error": "服务器内部错误"}), 500
```

### 4. Debug 时的反思

回头看，如果有这些习惯，这个 bug 不会花 3 个小时：
- 如果有**日志**而不是 `pass`，一眼就能看到错误信息
- 如果开了**Debug 模式**（`app.run(debug=True)`），Flask 会显示详细的 traceback
- 如果**单元测试**覆盖了这个接口，bug 会在提交之前就被发现

## 总结

这个 bug 让我付出了 3 个小时的代价，但它教给我的东西值 100 个小时：

1. **永远不要写裸 except + pass**——这是给自己埋雷
2. **日志是 debug 的眼睛**——没有日志的代码就是在黑暗中行走
3. **Debug 模式是开发时最好的朋友**——Flask 的 debug 模式、Django 的 DEBUG=True、Node.js 的 NODE_ENV=development
4. **单元测试不是负担**——当你花了 3 小时 debug 时，那 30 分钟写测试的时间一点都不多

每一个让你痛苦不堪的 bug，都是最好的老师。记住痛苦，下次不再犯。

> "经验就是在你需要的瞬间之前刚刚获得的东西。" —— 每个 debug 过的程序员都懂。'''),
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
