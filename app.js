require('dotenv/config');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  return res.json({
    message: 'Hello World',
  });
});

module.exports = app;
