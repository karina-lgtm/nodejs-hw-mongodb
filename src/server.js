import express from 'express';
import pinoHttp from 'pino-http';
import pino from 'pino';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import { getAllContacts, getContactById } from './service/contacts.js';

dotenv.config();
const PORT = process.env.PORT || 5150;

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(pinoHttp({ logger }));

  
  app.get('/api/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
    }
  });


  app.get('/api/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);

      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }

      res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch contact',
        error: error.message,
      });
    }
  });

  
  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

 
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });


  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    logger.info(`Server is running on port ${PORT}`);
  });
};
