import bcrypt from 'bcryptjs';
import db from './db';

export async function seedUsers(): Promise<void> {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await db.query(
    `
    INSERT INTO "User" (id, email, password, name, role)
    VALUES
      ($1, $2, $3, $4, $5),
      ($6, $7, $8, $9, $10),
      ($11, $12, $13, $14, $15)
    ON CONFLICT (email) DO UPDATE
    SET password = EXCLUDED.password,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        "updatedAt" = NOW()
    `,
    [
      'd1111111-1111-1111-1111-111111111111',
      'admin@example.com',
      hashedPassword,
      'System Admin',
      'SUPER_ADMIN',

      'd2222222-2222-2222-2222-222222222222',
      'manager@example.com',
      hashedPassword,
      'Project Manager',
      'MANAGER',

      'd3333333-3333-3333-3333-333333333333',
      'dev@example.com',
      hashedPassword,
      'Lead Developer',
      'TEAM_MEMBER'
    ]
  );

  console.log('Users seeded successfully');
}
