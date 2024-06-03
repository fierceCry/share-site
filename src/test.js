import { PrismaClient }  from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // User 생성
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      password: 'password123',
      nickname: 'user1',
      oneLiner: 'Hello, I am user1!',
      provider: 'LOCAL',
      emailVerified: true
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      password: 'password123',
      nickname: 'user2',
      oneLiner: 'Hello, I am user2!',
      provider: 'LOCAL',
      emailVerified: true
    }
  });

  // Post 생성
  const post1 = await prisma.post.create({
    data: {
      userId: user1.userId,
      title: 'First Post',
      content: 'This is the first post content.',
      regionId: 1,
      imageUrl: 'https://example.com/image1.jpg'
    }
  });

  const post2 = await prisma.post.create({
    data: {
      userId: user2.userId,
      title: 'Second Post',
      content: 'This is the second post content.',
      regionId: 2,
      imageUrl: 'https://example.com/image2.jpg'
    }
  });

  // Comment 생성
  const comment1 = await prisma.comment.create({
    data: {
      userId: user1.userId,
      postId: post1.postId,
      comment: 'Great post!'
    }
  });

  const comment2 = await prisma.comment.create({
    data: {
      userId: user2.userId,
      postId: post2.postId,
      comment: 'Thanks for sharing!'
    }
  });

  // Like 생성
  const like1 = await prisma.like.create({
    data: {
      userId: user1.userId,
      postId: post2.postId
    }
  });

  const like2 = await prisma.like.create({
    data: {
      userId: user2.userId,
      postId: post1.postId
    }
  });

  console.log('임시 데이터가 성공적으로 생성되었습니다.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });