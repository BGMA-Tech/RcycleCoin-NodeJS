const mongoose = require("mongoose");

const Transaction = require("../models/transaction");
const Coin = require("../models/coin");
const Utils = require("../utils/response");

exports.transactionGetAll = (req, res, next) => {
  Transaction.find()
    .select("_id fromPersonelId toPersonelId coinAmount createdAt")
    .exec()
    .then((docs) => {
      Utils.successResponse(res, 200, docs);
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};

exports.transactionGetById = (req, res, next) => {
  const id = req.params.id;
  Transaction.findById(id)
    .select("_id fromPersonelId toPersonelId coinAmount createdAt")
    .exec()
    .then((doc) => {
      if (doc) {
        Utils.successResponse(res, 200, doc);
      } else {
        Utils.errorResponse(res, 404, "No valid entry found for provided ID");
      }
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};

exports.transactionCreate = async (req, res, next) => {
  const fromCoin = await Coin.findOne({ personelId: req.body.fromPersonelId });

  const toCoin = await Coin.findOne({ personelId: req.body.toPersonelId });

  if (fromCoin == null || toCoin == null) {
    return Utils.errorResponse(res, 500, "Personel ID is wrong");
  }
  const transaction = new Transaction({
    _id: new mongoose.Types.ObjectId(),
    fromPersonelId: req.body.fromPersonelId,
    toPersonelId: req.body.toPersonelId,
    coinAmount: req.body.coinAmount,
    createdAt: Date.now(),
  });

  if (fromCoin.totalCoin < transaction.coinAmount) {
    return Utils.errorResponse(res, 500, "Not enough coin to transfer");
  } else {
    fromCoin.totalCoin -= transaction.coinAmount;
    toCoin.totalCoin += transaction.coinAmount;

    try {
      await fromCoin.save();
      await toCoin.save();
      await transaction.save();

      return Utils.successResponse(res, 201, {
        _id: transaction._id,
        fromPersonelId: transaction.fromPersonelId,
        toPersonelId: transaction.toPersonelId,
        coinAmount: transaction.coinAmount,
        createdAt: transaction.createdAt,
      });
    } catch (error) {
      console.error(error);
      return Utils.errorResponse(res, 500, error);
    }
  }
};

exports.transactionGetAllByFromPersonelId = (req, res, next) => {
  const id = req.params.id;
  Transaction.find({ fromPersonelId: id })
    .select("_id fromPersonelId toPersonelId coinAmount createdAt")
    .exec()
    .then((docs) => {
      Utils.successResponse(res, 200, docs);
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};

exports.transactionGetAllByToPersonelId = (req, res, next) => {
  const id = req.params.id;
  Transaction.find({ toPersonelId: id })
    .select("_id fromPersonelId toPersonelId coinAmount createdAt")
    .exec()
    .then((docs) => {
      Utils.successResponse(res, 200, docs);
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};
