import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  console.log('Successfully connected to the database!');
  
  const users = await prisma.user.findMany();
  console.log('Users found:', users.length);
}

main()
  .catch((e) => {
    console.error('Error connecting to database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
