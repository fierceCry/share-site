import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async() => {
  const categories = [
    { regionName: '수도권' },
    { regionName: '충청권' },
    { regionName: '호남권' },
    { regionName: '영남권' },
    { regionName: '강원권' },
    { regionName: '제주권' },
  ];

  for (const category of categories) {
    await prisma.regionCategory.create({ data: category });
  }

  console.log('seed 완료!!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
