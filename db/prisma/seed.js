const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting to seed...')

  // Create users
  const alice = await prisma.user.upsert({
    where: { username: 'alice' },
    update: {},
    create: {
      username: 'alice',
    },
  })

  const bob = await prisma.user.upsert({
    where: { username: 'bob' },
    update: {},
    create: {
      username: 'bob',
    },
  })

  const charlie = await prisma.user.upsert({
    where: { username: 'charlie' },
    update: {},
    create: {
      username: 'charlie',
    },
  })

  console.log('✅ Created users:', { alice, bob, charlie })

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Hello World',
      content: 'First post content',
      published: true,
      userId: alice.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'My First Blog Post',
      content: 'This is Bob\'s first blog post about web development and coding tips.',
      published: true,
      userId: bob.id,
    },
  })

  const post3 = await prisma.post.create({
    data: {
      title: 'Learning Node.js',
      content: 'Node.js is amazing! Here are some things I learned this week about async programming and Express.js.',
      published: true,
      userId: charlie.id,
    },
  })

  const post4 = await prisma.post.create({
    data: {
      title: 'Database Design Tips',
      content: 'Some best practices for designing PostgreSQL schemas with proper relationships and constraints.',
      published: true,
      userId: alice.id,
    },
  })

  const post5 = await prisma.post.create({
    data: {
      title: 'RESTful API Design',
      content: 'How to build clean and maintainable REST APIs with proper HTTP status codes and error handling.',
      published: false,
      userId: bob.id,
    },
  })

  console.log('✅ Created posts:', { post1, post2, post3, post4, post5 })

  // Create tags
  const tag1 = await prisma.tag.create({
    data: {
      name: 'general',
      userId: alice.id,
    },
  })

  const tag2 = await prisma.tag.create({
    data: {
      name: 'web-development',
      userId: bob.id,
    },
  })

  const tag3 = await prisma.tag.create({
    data: {
      name: 'nodejs',
      userId: charlie.id,
    },
  })

  const tag4 = await prisma.tag.create({
    data: {
      name: 'database',
      userId: alice.id,
    },
  })

  console.log('✅ Created tags:', { tag1, tag2, tag3, tag4 })

  // Link posts to tags
  await prisma.postTag.create({
    data: {
      postId: post1.id,
      tagId: tag1.id,
    },
  })

  console.log('✅ Linked post to tag')

  // Create comments
  const comment1 = await prisma.comment.create({
    data: {
      postId: post1.id,
      username: 'guest',
      content: 'Nice first post!',
    },
  })

  const comment2 = await prisma.comment.create({
    data: {
      postId: post2.id,
      username: 'developer123',
      content: 'Great tips! Thanks for sharing.',
    },
  })

  const comment3 = await prisma.comment.create({
    data: {
      postId: post3.id,
      username: 'nodejs_fan',
      content: 'Node.js is indeed amazing! Love the async/await pattern.',
    },
  })

  const comment4 = await prisma.comment.create({
    data: {
      postId: post4.id,
      username: 'db_expert',
      content: 'Excellent database design principles. Foreign keys are crucial!',
    },
  })

  const comment5 = await prisma.comment.create({
    data: {
      postId: post1.id,
      username: 'jane_smith',
      content: 'Excellent insights! I learned a lot from this post.',
    },
  })

  console.log('✅ Created comments:', { comment1, comment2, comment3, comment4, comment5 })

  // Create refresh token
  await prisma.refreshToken.create({
    data: {
      token: 'sample-token',
      userId: alice.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  })

  console.log('✅ Created refresh token')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
