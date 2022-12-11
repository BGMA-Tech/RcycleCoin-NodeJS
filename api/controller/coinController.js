const mongoose = require('mongoose');
const Coin = require('../models/coin');
const Utils = require('../utils');

exports.coinGetOne = (req, res, next) => {
  const personelId = req.params.personelId;
  Coin.find({ personelId: personelId })
    .select('personelId totalCoin')
    .exec()
    .then((doc) => {
      if (doc) {
        Utils.successResponse(res, 200, doc);
      } else {
        Utils.errorResponse(res, 404, 'No valid entry found for provided ID');
      }
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};

exports.coinCreate = (req, res, next) => {
  const coin = new Coin({
    _id: new mongoose.Types.ObjectId(),
    personelId: req.body.personelId,
    totalCoin: 0,
  });
  coin
    .save()
    .then((result) => {
      Utils.successResponse(res, 201, result);
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};

exports.coinUpdate = (req, res, next) => {
  const id = req.params.coinId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Coin.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      Utils.successResponse(res, 200, result);
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};

exports.coinDelete = (req, res, next) => {
  const id = req.params.coinId;
  Coin.findByIdAndRemove(id)
    .exec()
    .then((result) => {
      Utils.successResponse(res, 200, result);
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};
