const mongoose = require('mongoose');
const Info = require('../models/info');
const Utils = require('../utils/response');

exports.infoGetOne = (req, res, next) => {
  const id = req.params.id;
  Info.find({ _id: id })
    .select('_id firstname lastname createdAt role image')
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

exports.infoCreate = (req, res, next) => {
  const info = new Info({
    _id: new mongoose.Types.ObjectId(),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    role: req.body.role,
    image: req.body.image,
  });
  info
    .save()
    .then((result) => {
      Utils.successResponse(res, 201, result);
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};

exports.infoUpdate = (req, res, next) => {
  const id = req.params.infoId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Info.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      Utils.successResponse(res, 200, result);
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};
