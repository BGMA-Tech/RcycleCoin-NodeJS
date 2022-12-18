const mongoose = require('mongoose');
const Coin = require('../models/coin');
const Utils = require('../utils/response');

exports.coinGetOne = (req, res, next) => {
  const id = req.params.id;
  Coin.findOne({ personelId: id })
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

exports.coinUpdate = async (req, res, next) => {
  const id = req.params.id;
  const totalCoin = req.body.totalCoin;
  try {
    await Coin.updateOne(
      { personelId: id },
      { $set: { totalCoin: totalCoin } }
    ).exec();
    Coin.findOne({ personelId: id })
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
      });
  } catch (error) {
    return Utils.errorResponse(res, 500, error);
  }
};

exports.coinDelete = (req, res, next) => {
  const id = req.params.id;
  Coin.findOneAndRemove({ personelId: id })
    .exec()
    .then((result) => {
      return Utils.successResponse(res, 200, result);
    })
    .catch((err) => {
      return Utils.errorResponse(res, 500, err);
    });
};
