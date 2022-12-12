const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const CoinController = require('../controllers/coinController');

router.get('/:id', checkAuth, CoinController.coinGetOne);
router.patch('/:id', checkAuth, CoinController.coinUpdate);
router.delete('/:id', checkAuth, CoinController.coinDelete);

module.exports = router;
