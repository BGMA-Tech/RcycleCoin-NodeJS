const express = require('express');
const app = express();

const managers = require('./api/managers');

const routes = require('./api/routes/routes');

managers.mongooseManager.init();
managers.appManager.init(app);
app.use(routes.default);

app.get('/', (req, res) => {
  return res.json({
    message: 'Hello World',
  });
});

module.exports = app;
