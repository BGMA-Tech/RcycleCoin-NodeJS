const mongoose = require('mongoose');
const Coin = require('../models/coin');
const Utils = require('../utils/response');

exports.coinGetOne = (req, res, next) => {
  const id = req.params.id;
  Coin.findOne({ _id: id })
    .select('_id personelId totalCoin')
    .exec()
    .then((doc) => {
      if (doc) {
        return Utils.successResponse(res, 200, doc, 'Coin found successfully');
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

exports.coinUpdate = (req, res, next) => {
  const id = req.params.id;
  const updateOps = {};

  for (const [key, value] of Object.entries(req.body)) {
    updateOps[key] = value;
  }

  Coin.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      return Utils.successResponse(
        res,
        200,
        result,
        'Coin updated successfully'
      );
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
      return Utils.successResponse(
        res,
        200,
        result,
        'Coin deleted successfully'
      );
    })
    .catch((err) => {
      return Utils.errorResponse(res, 500, err);
    });
};
