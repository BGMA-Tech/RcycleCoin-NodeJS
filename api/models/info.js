const mongoose = require('mongoose');

const InfoSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model('Info', InfoSchema);
