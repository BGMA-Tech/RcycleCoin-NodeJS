const express = require('express');
const app = express();
const routes = require('./');

app.use('/coin', routes.coinRoutes);
app.use('/info', routes.infoRoutes);
app.use('/user', routes.userRoutes);
app.use('/transaction', routes.transactionRoutes);

exports.default = app;
