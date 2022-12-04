require('dotenv/config');

const express = require('express');
const app = express();

const managers = require('./api/managers');

managers.mongooseManager.init();
managers.appManager.init(app);

app.get('/', (req, res) => {
  return res.json({
    message: 'Hello World',
  });
});

module.exports = app;
