import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import passport from './config/passport';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import { connectDB, prisma } from './config/database';
import v1Routes from './routes/v1';
import logger from './config/logger';
import { httpLogger } from './middleware/logging.middleware';
import { startCleanupScheduler } from './utils/scheduler';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

connectDB().then(() => {
  logger.info('Database connected successfully');
  startCleanupScheduler();
  logger.info('Cleanup scheduler started');
}).catch((err) => {
  logger.error('Database connection error:', err);
  process.exit(1);
});

app.set('trust proxy', 1);
app.use(helmet());
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

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

app.use('/api/v1/admin/login', authLimiter);
app.use('/api/v1/admin/register', authLimiter);
app.use('/api/v1/store/auth/login', authLimiter);
app.use('/api/v1/store/auth/register', authLimiter);

const PgSession = connectPgSimple(session);
const sessionPool = new Pool({ connectionString: process.env.DATABASE_URL });

if (!process.env.SESSION_SECRET && process.env.NODE_ENV === 'production') {
  logger.error('SESSION_SECRET must be set in production');
  process.exit(1);
}

app.use(session({
  store: new PgSession({
    pool: sessionPool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'dev-only-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
  },
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to Express + TypeScript + PostgreSQL Server' });
});

app.use('/api/v1', v1Routes);

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});
