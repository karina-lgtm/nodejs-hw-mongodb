import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pinoHttp from 'pino-http';

import { getAllContacts, getContactById } from './service/contacts.js';

dotenv.config();

const PORT = process.env.PORT || 5150;

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Логер
  app.use(
    pinoHttp({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    })
  );

  // Роут для всіх контактів
  app.get('/contacts', async (req, res, next) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      next(error);
    }
  });

  // Роут для одного контакту
  app.get('/contacts/:contactId', async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);

      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }

      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Error handler
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  // Запуск сервера
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};
