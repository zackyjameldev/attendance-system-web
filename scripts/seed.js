// Seed script to create initial data
// Run with: node scripts/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrator',
        role: 'ADMINISTRATOR',
      },
    });
    console.log('✓ Admin user created');
  } else {
    console.log('✓ Admin user already exists');
  }

  // Create a sample field
  const field = await prisma.field.upsert({
    where: { name: 'Software Engineering' },
    update: {},
    create: {
      name: 'Software Engineering',
    },
  });
  console.log('✓ Field created:', field.name);

  // Create a sample teacher
  const teacherEmail = 'teacher@example.com';
  const teacherPassword = 'teacher123';
  
  let teacher = await prisma.user.findUnique({
    where: { email: teacherEmail },
  });

  if (!teacher) {
    const hashedPassword = await bcrypt.hash(teacherPassword, 10);
    teacher = await prisma.user.create({
      data: {
        email: teacherEmail,
        password: hashedPassword,
        name: 'John Teacher',
        role: 'TEACHER',
        fieldId: field.id,
      },
    });
    console.log('✓ Teacher created:', teacher.name);
  } else {
    console.log('✓ Teacher already exists');
  }

  // Create sample students
  const students = [
    { email: 'student1@example.com', name: 'Alice Student', password: 'student123' },
    { email: 'student2@example.com', name: 'Bob Student', password: 'student123' },
    { email: 'student3@example.com', name: 'Charlie Student', password: 'student123' },
  ];

  for (const studentData of students) {
    const existing = await prisma.user.findUnique({
      where: { email: studentData.email },
    });

    if (!existing) {
      const hashedPassword = await bcrypt.hash(studentData.password, 10);
      await prisma.user.create({
        data: {
          email: studentData.email,
          password: hashedPassword,
          name: studentData.name,
          role: 'STUDENT',
          fieldId: field.id,
        },
      });
      console.log('✓ Student created:', studentData.name);
    }
  }

  console.log('\n✅ Seeding completed!');
  console.log('\nDefault credentials:');
  console.log('Admin:', adminEmail, '/', adminPassword);
  console.log('Teacher:', teacherEmail, '/', teacherPassword);
  console.log('Students: student1@example.com / student123');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

