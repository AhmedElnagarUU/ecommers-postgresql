import morgan from 'morgan';
import { morganStream } from '../config/logger';

// Custom Morgan token for request body
morgan.token('body', (req: any) => JSON.stringify(req.body));

export const httpLogger = morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  {
    stream: morganStream,
    skip: (req, res) => {
      // Skip logging for successful health check endpoints
      return req.url === '/health' && res.statusCode === 200;
    }
  }
); 