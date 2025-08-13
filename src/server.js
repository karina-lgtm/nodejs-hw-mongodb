import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import 'dotenv/config';

import { getEnvVariable } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js'; 
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = getEnvVariable('PORT') || 3000;

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  const logger = pino();
  app.use(pinoHttp({ logger }));

  app.use('/api/contacts', contactsRouter);
  app.use('/api/auth', authRouter);

 
  app.get('/', (req, res) => {
    res.json({ message: 'API is working 🎉' });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};
