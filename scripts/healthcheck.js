// Health check script
// Run with: node scripts/healthcheck.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function healthCheck() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✓ Database connection: OK');

    // Test query
    const userCount = await prisma.user.count();
    console.log(`✓ Database query: OK (${userCount} users found)`);

    console.log('\n✅ Health check passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

healthCheck();

