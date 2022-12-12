const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const CoinController = require('../controllers/coinController');

router.get('/:id', CoinController.coinGetOne);
router.patch('/:id', CoinController.coinUpdate);
router.delete('/:id', CoinController.coinDelete);

module.exports = router;
