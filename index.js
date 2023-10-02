const express = require('express');
const cors = require('cors');
require('dotenv').config();
const validate = require('jsonschema').validate;

const contactSchema = require('./contactSchema.json');
const {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContactById
} = require('./functions/contacts.js');

const port = process.env.PORT;

const app = express();

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function logging(req) {
  console.info(`${req.method} ${req.originalUrl}, Payload: ${JSON.stringify(req.body)}`);
}

app.get('/', (req, res) => {
  logging(req);
  res.status(204).send();
});

app.get('/contacts', async (req, res) => {
  logging(req);
  const contacts = await getContacts();
  res.send(contacts);
});

app.get('/contacts/:id', async (req, res) => {
  logging(req);
  const contacts = await getContactById(req.params.id);
  res.send(contacts);
});

app.post('/contacts', async (req, res) => {
  logging(req);

  // Validate request payload against contact schema
  const { errors } = validate(req.body, contactSchema);
  if (errors.length > 0) {
    const errorArray = errors.map(({ path, message }) => `${path} ${message}`);
    res.status(400).send({ errors: errorArray });
    return;
  }

  const result = await addContact(req.body);
  if (result.errors) {
    res.status(400);
  }
  res.send(result);
});

app.put('/contacts/:id', async (req, res) => {
  logging(req);

  // Validate request payload against contact schema
  const { errors } = validate(req.body, contactSchema);
  if (errors.length > 0) {
    const errorArray = errors.map(({ path, message }) => `${path} ${message}`);
    res.status(400).send({ errors: errorArray });
    return;
  }

  const result = await updateContact(req.params.id, req.body);
  if (result.errors) {
    res.status(400);
  }
  res.send(result);
});

app.delete('/contacts/:id', async (req, res) => {
  logging(req);
  const result = await deleteContactById(req.params.id);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Contact Management System is listening on port ${port}`);
});
