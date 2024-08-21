import express from 'express';
import connection from './db/sequelize';
import cors from 'cors';
import authRouter from './routes/auth.route';
import taskRouter from './routes/task.route';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS for cross-origin requests
app.use('/api/auth', authRouter); // Use the auth routes
app.use('/api/task', taskRouter); // Use the task routes


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
  console.log(`Server is running on http://localhost:${PORT}`);
  testConnection(); // Optionally test the database connection when the server starts
});
