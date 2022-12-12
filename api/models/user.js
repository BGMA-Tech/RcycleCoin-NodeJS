const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  personelId: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid e-mail address'],
  },
  password: { type: String, required: true },
  coin: { type: mongoose.Schema.Types.ObjectId, ref: 'Coin', required: true },
  info: { type: mongoose.Schema.Types.ObjectId, ref: 'Info', required: true },
});

module.exports = mongoose.model('User', UserSchema);
