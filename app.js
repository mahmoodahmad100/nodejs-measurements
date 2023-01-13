const express = require('express');

const app = express();

app.get('/test', async (req, res) => {
  res.status(200).json({'test': true});
});

app.listen(80);