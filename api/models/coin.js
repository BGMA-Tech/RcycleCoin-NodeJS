const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  personelId: { type: String, required: true },
  totalCoin: { type: Number, required: true },
});

module.exports = mongoose.model('Coin', CoinSchema);
