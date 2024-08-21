import express from 'express';
import connection from './db/sequelize';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json()); // For parsing application/json

// Define routes here

// Test database connection
async function testConnection() {
  try {
    await connection.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  testConnection(); // Optionally test the database connection when the server starts
});
