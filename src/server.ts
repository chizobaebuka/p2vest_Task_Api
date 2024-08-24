// src/server.ts
import express from 'express';
import cors from 'cors';
import connection from './db/sequelize';
import authRouter from './routes/auth.route';
import taskRouter from './routes/task.route';
import commentRouter from './routes/comment.route';
import tagRouter from './routes/tag.route';
import { connectClient, closeClient } from './db/redis.client';
import { Server } from 'socket.io';
import http from 'http';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
export const io = new Server(server);

// Socket.io setup
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Route setup
app.use('/api/auth', authRouter);
app.use('/api/task', taskRouter);
app.use('/api/comment', commentRouter);
app.use('/api/tag', tagRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

async function testConnection() {
  try {
    await connection.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

async function startServer() {
  try {
    await connection.sync();
    await connectClient();

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      testConnection();
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

async function shutdown() {
  console.log('Shutting down...');
  try {
    await closeClient();
    await connection.close();
  } catch (err) {
    console.error('Error during shutdown:', err);
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();
