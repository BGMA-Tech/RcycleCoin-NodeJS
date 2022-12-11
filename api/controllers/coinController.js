const mongoose = require('mongoose');
const Coin = require('../models/coin');
const Utils = require('../utils/response');

exports.coinGetOne = (req, res, next) => {
  const id = req.params.id;
  Coin.find({ _id: id })
    .select('_id personelId totalCoin')
    .exec()
    .then((doc) => {
      if (doc) {
        return Utils.successResponse(res, 200, doc);
      } else {
        return Utils.errorResponse(
          res,
          404,
          'No valid entry found for provided ID'
        );
      }
    })
    .catch((err) => {
      return Utils.errorResponse(res, 500, err);
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
      return Utils.successResponse(res, 201, result);
    })
    .catch((err) => {
      return Utils.errorResponse(res, 500, err);
    });
};

exports.coinUpdate = (req, res, next) => {
  const id = req.params.id;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Coin.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      return Utils.successResponse(res, 200, result);
    })
    .catch((err) => {
      return Utils.errorResponse(res, 500, err);
    });
};

exports.coinDelete = (req, res, next) => {
  const id = req.params.id;
  Coin.findByIdAndRemove(id)
    .exec()
    .then((result) => {
      return Utils.successResponse(res, 200, result);
    })
    .catch((err) => {
      return Utils.errorResponse(res, 500, err);
    });
};
