import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes/v1';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { initCronJobs } from './jobs/scraper.job';
import { logger } from './config/logger';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(apiLimiter);

app.use('/api/v1', routes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  initCronJobs();
});