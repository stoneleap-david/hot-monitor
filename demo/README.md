# Prisma 入门 Demo

用最简例子理解 Prisma：不写 SQL，用 TypeScript API 操作数据库。

---

## 一、Prisma 是什么？

| 概念 | 说明 |
|------|------|
| **Schema** | `prisma/schema.prisma` 里用代码定义表结构（类比 SQL 的 CREATE TABLE） |
| **Client** | 运行 `prisma generate` 后生成的 `PrismaClient`，提供 `create`、`findMany` 等方法 |
| **Migration** | 把 schema 变更同步到真实数据库的 SQL 脚本，由 Prisma 自动生成 |

---

## 二、Demo 数据结构

```
User (用户)           Post (文章)
├── id                ├── id
├── name              ├── title
├── email             ├── content
└── posts ──────────► ├── published
     (1:N 一对多)     ├── authorId → User.id
                     └── author
```

---

## 三、快速运行

```bash
cd demo
npm install
# 首次运行需创建 .env，内容：DATABASE_URL="file:./demo.db"
npx prisma migrate dev --name init    # 创建表结构
npm run demo                          # 运行 CRUD 示例
```

---

## 四、常用 Prisma API

| 操作 | 方法 | 示例 |
|------|------|------|
| **创建** | `create` | `prisma.user.create({ data: { name, email } })` |
| **批量创建** | `createMany` | `prisma.post.createMany({ data: [...] })` |
| **查询多条** | `findMany` | `prisma.user.findMany({ where: { ... } })` |
| **查询单条** | `findFirst` / `findUnique` | `prisma.user.findUnique({ where: { id } })` |
| **更新** | `update` | `prisma.post.update({ where, data })` |
| **删除** | `delete` | `prisma.user.delete({ where: { id } })` |
| **统计** | `count` | `prisma.post.count({ where })` |

### 常用参数

- **where**：条件筛选，如 `{ published: true }`
- **include**：带上关联数据，如 `include: { author: true }`
- **select**：只返回指定字段
- **orderBy**：排序
- **skip / take**：分页

---

## 五、可视化查看数据

```bash
npx prisma studio
```

浏览器打开 `http://localhost:5555` 可查看和编辑表数据。

---

## 六、重置数据库（清空重来）

```bash
npm run db:reset
```

---

## 七、与 hot-monitor 项目的关系

本 demo 的 `User`、`Post` 对应 hot-monitor 里的 `Keyword`、`Hotspot`，用法一致，只是模型更复杂。熟悉本 demo 后再看项目代码会更容易理解。
