const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fromPersonelId: { type: String, required: true },
  toPersonelId: { type: String, required: true },
  coinAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
