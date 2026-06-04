import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import pool from './db';
import { seedUsers } from './seedUsers';

dotenv.config();

const dbName = process.env.DB_NAME;

export async function initializeDatabase(): Promise<void> {
  if (!dbName) {
    throw new Error('DB_NAME is missing in .env');
  }

  await createDatabaseIfNotExists();
  await runSqlFile('schema.sql');
  await seedUsers();
  await runSqlFile('seed.sql');

  console.log('Database initialized successfully');
}

async function createDatabaseIfNotExists(): Promise<void> {
  const adminPool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  });

  try {
    const result = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (result.rowCount === 0) {
      await adminPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created`);
    } else {
      console.log(`Database "${dbName}" already exists`);
    }
  } finally {
    await adminPool.end();
  }
}

async function runSqlFile(fileName: string): Promise<void> {
  const filePath = path.join(__dirname, '..', 'database', fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`${fileName} not found at ${filePath}`);
  }

  const sql = fs.readFileSync(filePath, 'utf8');

  await pool.query(sql);

  console.log(`${fileName} executed`);
}
