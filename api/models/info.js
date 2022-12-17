const mongoose = require('mongoose');

const InfoSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String },
  image: { type: String },
});

module.exports = mongoose.model('Info', InfoSchema);
