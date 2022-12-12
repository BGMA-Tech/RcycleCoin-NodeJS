const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router();

const TransactionController = require('../controllers/transactionController');

router.get('/:id', checkAuth, TransactionController.transactionGetAllById);
router.get('/', checkAuth, TransactionController.transactionGetAll);
router.post('/', checkAuth, TransactionController.transactionCreate);

module.exports = router;
