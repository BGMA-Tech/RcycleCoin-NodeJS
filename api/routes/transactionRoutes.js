const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router();

const TransactionController = require('../controllers/transactionController');

router.get('/:id', checkAuth, TransactionController.transactionGetById);
router.get('/', checkAuth, TransactionController.transactionGetAll);
router.post('/', checkAuth, TransactionController.transactionCreate);
router.get(
  '/getAllFromId/:id',
  checkAuth,
  TransactionController.transactionGetAllByFromPersonelId
);

router.get(
  '/getAllToId/:id',
  checkAuth,
  TransactionController.transactionGetAllByToPersonelId
);

module.exports = router;
