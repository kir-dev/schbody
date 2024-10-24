import { faker } from '@faker-js/faker';
import { ApplicationStatus, PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  await prisma.application.deleteMany();
  await prisma.applicationPeriod.deleteMany();
  await prisma.user.deleteMany();

  // Create an admin user who the application period will belong to
  const admin = await prisma.user.create({
    data: {
      email: 'superuser@example.com',
      fullName: 'Super User',
      nickName: 'admin',
      role: 'SUPERUSER',
      authSchId: 'admin',
      isActiveVikStudent: true,
      isSchResident: true,
    },
  });

  const applicationPeriodEndAt = new Date(new Date().setMonth(new Date().getMonth() + 1));

  // Create an application period
  const applicationPeriod = await prisma.applicationPeriod.create({
    data: {
      name: 'Őszi jelentkezés',
      authorId: admin.authSchId,
      applicationPeriodStartAt: new Date(),
      applicationPeriodEndAt: applicationPeriodEndAt,
    },
  });

  // Create 20 users who the application will belong to
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        fullName: faker.person.fullName(),
        nickName: faker.person.firstName(),
        role: 'USER',
        isSchResident: true,
        isActiveVikStudent: true,
        canHelpNoobs: false,
        authSchId: faker.string.uuid(),
      },
    });

    // Randomly assign a status to the application
    const statuses = Object.values(ApplicationStatus);
    const applicationStatus = statuses[randomInt(statuses.length)];

    // Create an application for each user
    await prisma.application.create({
      data: {
        userId: user.authSchId,
        status: applicationStatus,
        applicationPeriodId: applicationPeriod.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
