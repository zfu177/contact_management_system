const express = require('express');
require('dotenv').config();
const { get, getById, post, put, deleteById } = require('./functions/contacts.js');

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send({ Healthy: true });
});

app.get('/contacts', async (req, res) => {
  const contacts = await get();
  res.send(contacts);
});

app.get('/contacts/:id', async (req, res) => {
  const contacts = await getById(req.params.id);
  res.send(contacts);
});

app.post('/contacts', async (req, res) => {
  const result = await post(req.body);
  res.send(result);
});

app.put('/contacts/:id', async (req, res) => {
  const result = await put(req.params.id, req.body);
  res.send(result);
});

app.delete('/contacts/:id', async (req, res) => {
  const result = await deleteById(req.params.id);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Contact Management System is listening on port ${port}`);
});
