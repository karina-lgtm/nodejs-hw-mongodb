import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';

import { getEnvVariable } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = getEnvVariable('PORT') || 5150;

export const setupServer = () => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors());

  // Логер
  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });
  app.use(pinoHttp({ logger }));

  // Роутер
  app.use('/contacts', contactsRouter);

  // Обробка 404
  app.use(notFoundHandler);

  // Обробка помилок
  app.use(errorHandler);

  // Запуск сервера
  app.listen(PORT, (err) => {
    if (err) {
      console.error('❌ Server error:', err.message);
      process.exit(1);
    }
    logger.info(`✅ Server is running on port ${PORT}`);
  });
};
