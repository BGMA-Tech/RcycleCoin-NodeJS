const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fromCoin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coin',
    required: true,
  },
  toCoin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coin',
    required: true,
  },
  coinAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
