const express = require('express');
require('dotenv').config();

const port = process.env.PORT;
const app = express();

app.get('/healthcheck', (req, res) => {
  res.send('Healthy');
});

app.listen(port, () => {
  console.log(`Contact Management System listening on port ${port}`);
});
