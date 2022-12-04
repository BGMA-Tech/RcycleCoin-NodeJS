const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const AppManager = {
  init: (app) => {
    console.log('AppManager.init()');
    app.use(cors());
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
  },
};

module.exports = AppManager;
