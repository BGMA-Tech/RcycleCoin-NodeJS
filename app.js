require('dotenv/config');

const express = require('express');
const app = express();

const managers = require('./api/managers');

const routes = require('./api/routes');

managers.mongooseManager.init();
managers.appManager.init(app);

app.use('/coin', routes.coinRoutes);

app.get('/', (req, res) => {
  return res.json({
    message: 'Hello World',
  });
});

module.exports = app;
