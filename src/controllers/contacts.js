import { Contact } from '../models/contact.js';

export const getContacts = async (req, res) => {
  const contacts = await Contact.find(); // ← беремо з Mongo
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};
