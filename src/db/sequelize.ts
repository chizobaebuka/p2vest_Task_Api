import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Ensure environment variables are loaded
if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
  throw new Error('Missing required environment variables');
}

console.log({ process: process.env.DB_USER });
const connection = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    // Optionally, you can add more Sequelize options here
  }
);

export default connection;
