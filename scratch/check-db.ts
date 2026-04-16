import { prisma } from './apps/backend/src/config/prisma';

async function main() {
  try {
    console.log('Checking database connection...');
    const users = await prisma.user.count();
    console.log(`Connection OK. Users count: ${users}`);
    
    console.log('Checking Goal table...');
    // We try to query Goals to see if the table and fields are correctly updated
    const goals = await prisma.goal.findMany({ take: 1 });
    console.log('Goal table accessible.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
