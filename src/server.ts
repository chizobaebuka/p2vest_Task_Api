import express from 'express';
import connection from './db/sequelize';
import cors from 'cors';
import authRouter from './routes/auth.route';
import taskRouter from './routes/task.route';
import commentRouter from './routes/comment.route';
import tagRouter from './routes/tag.route';
import { models } from './db/models';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS for cross-origin requests
app.use('/api/auth', authRouter); // Use the auth routes
app.use('/api/task', taskRouter); // Use the task routes
app.use('/api/comment', commentRouter); // Use the comment routes
app.use('/api/tag', tagRouter)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// Define routes here
function initializeModels() {
  // Ensure all models are associated
  Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
      models[modelName].associate(models);
    }
  });
}

async function testConnection() {
  try {
    await connection.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Test database connection
async function startServer() {
  try {
    // initializeModels(); // Set up model associations
    await connection.sync(); // Sync the database
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      testConnection(); // Optionally test the database connection when the server starts
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

startServer();
