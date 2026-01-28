// check-db.ts
import { prisma } from './hello-prisma/prisma';


async function main() {
  try {
    // Query the database for connection details
    const result = await prisma.$queryRaw`
      SELECT current_user, current_database(), inet_server_addr(), inet_server_port()
    `;
    
    console.log('--- Connection Details ---');
    console.log(result);
  } catch (e) {
    console.error('Connection failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();