import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      name: 'John Manager',
      password: hashedPassword,
      role: 'MANAGER',
    },
  });

  const developer = await prisma.user.upsert({
    where: { email: 'dev@example.com' },
    update: {},
    create: {
      email: 'dev@example.com',
      name: 'Sarah Dev',
      password: hashedPassword,
      role: 'TEAM_MEMBER',
    },
  });

  // Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Overhaul the corporate website with a modern look and feel.',
      clientName: 'Acme Corp',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-08-30'),
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      ownerId: manager.id,
      members: {
        create: [
          { userId: developer.id, roleInProject: 'Senior Developer', responsibility: 'Frontend architecture' }
        ]
      },
      tasks: {
        create: [
          { title: 'Design Mockups', description: 'Create high-fidelity mockups for the homepage.', status: 'DONE', priority: 'HIGH', assignedId: developer.id },
          { title: 'Setup Project Structure', description: 'Initialize Angular project with Tailwind.', status: 'IN_PROGRESS', priority: 'MEDIUM', assignedId: developer.id },
          { title: 'API Integration', description: 'Connect frontend to the new backend endpoints.', status: 'TODO', priority: 'MEDIUM', assignedId: developer.id },
        ]
      }
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
