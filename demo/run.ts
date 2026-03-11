/**
 * Prisma 入门 Demo
 * 演示：创建(Create)、读取(Read)、更新(Update)、删除(Delete)
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('========== Prisma CRUD Demo ==========\n');

  // 0️⃣ 清理旧数据，确保每次演示从干净状态开始
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // 1️⃣ CREATE - 创建数据
  console.log('1. CREATE 创建用户...');
  const user = await prisma.user.create({
    data: {
      name: '小明',
      email: 'xiaoming@example.com',
    },
  });
  console.log('   创建成功:', user);

  // 2️⃣ CREATE - 创建关联数据（嵌套写入）
  console.log('\n2. CREATE 创建用户的同时创建文章...');
  const userWithPost = await prisma.user.create({
    data: {
      name: '小红',
      email: 'xiaohong@example.com',
      posts: {
        create: [
          { title: '第一篇', content: 'Hello Prisma!', published: true },
          { title: '第二篇', content: '学习数据库', published: false },
        ],
      },
    },
    include: { posts: true }, // 返回时带上关联的 posts
  });
  console.log('   创建成功:', JSON.stringify(userWithPost, null, 2));

  // 3️⃣ READ - 查询
  console.log('\n3. READ 查询所有用户...');
  const allUsers = await prisma.user.findMany({
    include: { posts: true },
  });
  console.log('   用户列表:', allUsers.length, '人');

  console.log('\n   READ 按条件查询...');
  const publishedPosts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  console.log('   已发布文章:', publishedPosts.length, '篇');

  // 4️⃣ UPDATE - 更新
  console.log('\n4. UPDATE 更新文章为已发布...');
  const updated = await prisma.post.update({
    where: { id: userWithPost.posts[1].id },
    data: { published: true },
  });
  console.log('   更新成功:', updated.title);

  // 5️⃣ DELETE - 删除
  console.log('\n5. DELETE 删除用户小明（及其文章通过 onDelete: Cascade）...');
  await prisma.user.delete({
    where: { id: user.id },
  });
  console.log('   删除成功');

  // 最终状态
  console.log('\n========== 最终数据库中的用户 ==========');
  const final = await prisma.user.findMany({ include: { posts: true } });
  console.log(JSON.stringify(final, null, 2));
}

main()
  .catch((e) => {
    console.error('错误:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
