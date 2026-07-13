import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Ensure environment variables are loaded
if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
  throw new Error('Missing required environment variables');
}

const connection = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX, 10) : 10,
      min: process.env.DB_POOL_MIN ? parseInt(process.env.DB_POOL_MIN, 10) : 0,
      acquire: process.env.DB_POOL_ACQUIRE_MS ? parseInt(process.env.DB_POOL_ACQUIRE_MS, 10) : 30000,
      idle: process.env.DB_POOL_IDLE_MS ? parseInt(process.env.DB_POOL_IDLE_MS, 10) : 10000,
    },
    retry: {
      max: 3,
    },
  }
);

export default connection;
