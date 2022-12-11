const mongoose = require('mongoose');

const Transaction = require('../models/transaction');
const Coin = require('../models/coin');
const Utils = require('../utils/response');

exports.transactionGetAll = (req, res, next) => {
  Transaction.find()
    .select('_id fromPersonelId toPersonelId coinAmount createdAt')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        transactions: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
          };
        }),
      };
      Utils.successResponse(res, 200, response);
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};

exports.transactionGetAllById = (req, res, next) => {
  const id = req.params.id;
  Transaction.findById(id)
    .select('_id fromPersonelId toPersonelId coinAmount createdAt')
    .exec()
    .then((doc) => {
      if (doc) {
        Utils.successResponse(res, 200, doc);
      } else {
        Utils.errorResponse(res, 404, {
          message: 'No valid entry found for provided ID',
        });
      }
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};

exports.transactionCreate = async (req, res, next) => {
  const fromCoin = Coin.findOne({ personelId: req.body.fromPersonelId });
  const toCoin = Coin.findOne({ personelId: req.body.toPersonelId });

  const transaction = new Transaction({
    _id: new mongoose.Types.ObjectId(),
    fromPersonelId: req.body.fromPersonelId,
    toPersonelId: req.body.toPersonelId,
    coinAmount: req.body.coinAmount,
    createdAt: Date.now(),
  });

  await Promise.all([fromCoin, toCoin]).then(async (values) => {
    const fromCoin = values[0];
    const toCoin = values[1];

    if (fromCoin.coinAmount < transaction.coinAmount) {
      return Utils.errorResponse(res, 500, {
        message: 'Not enough coin to transfer',
      });
    } else {
      fromCoin.coinAmount -= transaction.coinAmount;
      toCoin.coinAmount += transaction.coinAmount;

      try {
        await fromCoin.save();
        await toCoin.save();
        await transaction.save();

        return Utils.successResponse(res, 201, {
          message: 'Transaction stored',
          createdTransaction: {
            _id: transaction._id,
            fromPersonelId: transaction.fromPersonelId,
            toPersonelId: transaction.toPersonelId,
            coinAmount: transaction.coinAmount,
            createdAt: transaction.createdAt,
          },
        });
      } catch (error) {
        return Utils.errorResponse(res, 500, error);
      }
    }
  });
};
