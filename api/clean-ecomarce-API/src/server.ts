import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import passport from './config/passport';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import v1Routes from './routes/v1';
import logger from './config/logger';
import { httpLogger } from './middleware/logging.middleware';
import { startCleanupScheduler } from './utils/scheduler';
import notificationRoutes from './modules/notification/notification.route';
import session from 'express-session';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

connectDB().then(() => {
  logger.info('Database connected successfully');
  startCleanupScheduler();
  logger.info('S3 cleanup scheduler started');
}).catch((err) => {
  logger.error('Database connection error:', err);
  process.exit(1);
});

app.use(httpLogger);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.STORE_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', v1Routes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to Express + TypeScript + PostgreSQL Server' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});
