import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      username: 'alice',
      name: 'Alice Johnson',
      bio: 'Full-stack developer passionate about building great products',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      username: 'bob',
      name: 'Bob Smith',
      bio: 'Designer & frontend enthusiast',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'carol@example.com',
      username: 'carol',
      name: 'Carol Williams',
      bio: 'Backend engineer with a love for databases',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
    },
  });

  console.log('✅ Created users:', { user1: user1.username, user2: user2.username, user3: user3.username });

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with Prisma',
      content: `Prisma is a next-generation ORM that makes database access easy with an auto-generated and type-safe query builder.

Here are some key features:
- Type-safe database client
- Declarative data modeling
- Easy migrations
- Powerful GUI for database management

In this post, we'll explore how to set up Prisma with a Next.js application.`,
      published: true,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Building a Blog with Next.js 14',
      content: `Next.js 14 introduces several exciting features:

1. **App Router**: A new routing system based on React Server Components
2. **Server Actions**: Direct server mutations from client components
3. **Partial Prerendering**: Combine static and dynamic content

Let's build a blog using these features!`,
      published: true,
      authorId: user2.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Draft: Advanced Database Patterns',
      content: 'This is a draft post about advanced database patterns. Coming soon!',
      published: false,
      authorId: user3.id,
    },
  });

  console.log('✅ Created posts:', { post1: post1.title, post2: post2.title, post3: post3.title });

  // Create comments
  const comment1 = await prisma.comment.create({
    data: {
      content: 'Great introduction to Prisma! The type safety is a game changer.',
      authorId: user2.id,
      postId: post1.id,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content: 'Thanks! I found the migrations especially useful.',
      authorId: user1.id,
      postId: post1.id,
      parentId: comment1.id, // This is a reply
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      content: 'Next.js 14 is amazing! Server Actions are so convenient.',
      authorId: user3.id,
      postId: post2.id,
    },
  });

  const comment4 = await prisma.comment.create({
    data: {
      content: 'Agree! No more separate API routes for simple mutations.',
      authorId: user1.id,
      postId: post2.id,
      parentId: comment3.id, // This is a reply
    },
  });

  console.log('✅ Created comments:', { 
    comment1: comment1.content.substring(0, 30) + '...', 
    comment2: comment2.content.substring(0, 30) + '...',
    comment3: comment3.content.substring(0, 30) + '...',
    comment4: comment4.content.substring(0, 30) + '...',
  });

  // Create likes
  await prisma.like.createMany({
    data: [
      { userId: user2.id, postId: post1.id },
      { userId: user3.id, postId: post1.id },
      { userId: user1.id, postId: post2.id },
      { userId: user3.id, postId: post2.id },
    ],
  });

  console.log('✅ Created likes for posts');

  // Summary
  const summary = await prisma.$transaction([
    prisma.user.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.like.count(),
  ]);

  console.log('\n📊 Seed Summary:');
  console.log(`   Users: ${summary[0]}`);
  console.log(`   Posts: ${summary[1]}`);
  console.log(`   Comments: ${summary[2]}`);
  console.log(`   Likes: ${summary[3]}`);
  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

